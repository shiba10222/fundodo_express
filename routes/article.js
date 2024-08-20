import express from "express"
import multer from "multer"
import { Low } from "lowdb"
import cors from "cors"
import { JSONFile } from "lowdb/node"
import connect from "./db.js"
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

const uploadDir = path.join(__dirname, 'public', 'articleImg');
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir, { recursive: true });
}
// 設置文件儲存
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
      cb(null, path.join(__dirname, 'public', 'articleImg'));
    },
    filename: function(req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
  });
  
  const upload = multer({ storage: storage });
  

const defaultDate = {article:[]}
const db = new Low(new JSONFile("article.json"), defaultDate)
await db.read()






app.use('/public', express.static(path.join(__dirname, 'public')));

app.get("/", (req, res) => {
    res.send("首頁")
})

app.get("/api/articles", (req, res) => {
    connect.execute(
        "SELECT * FROM `article` WHERE `article_delete` = 0 ORDER BY `create_at` DESC",
        (err, articles) => {
            if (err) {
                console.log(err);
                return
            }
            res.status(200).json({
                status: "success",
                message: "所有文章",
                articles
            })
        }
    )
})

app.get("/api/articles/:sort", (req, res) => {
    const sort = req.params.sort
    if (sort) {
        connect.execute(
            "SELECT * FROM `article` WHERE `article_delete` = 0 AND sort = ? ORDER BY `create_at` DESC", [sort],
            (err, articles) => {
                if (err) {
                    console.log(err);
                    return
                }
                res.status(200).json({
                    status: "success",
                    message: "所有文章",
                    articles
                })
            }
        )
    }

})

app.get("/api/sort", (req, res) => {
    connect.execute(
        "SELECT * FROM `article_sort`",
        (err, sorts) => {
            if (err) {
                console.log(err);
                return
            }
            res.status(200).json({
                status: "success",
                message: "所有分類",
                sorts
            })
        }
    )
})

app.get("/api/articleContent/:id", (req, res) => {
    const id = req.params.id
    connect.execute(
        "SELECT * FROM `article` WHERE `id`= ? AND `article_delete` = 0", [id],
        (err, content) => {
            if (err) {
                console.log(err);
                return
            }
            res.status(200).json({
                status: "success",
                message: "文章內容",
                content
            })
        }
    )
})

app.post("/api/upload2", upload.single('articleImage'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "檔案未上傳成功" });
        }

        const imgPath = '/public/articleImg/' + req.file.filename;
        
        connect.execute(
            'INSERT INTO `article_img` (img_path) VALUES (?)',
            [imgPath],
            (err, result) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({ message: "保存圖片資訊失敗" });
                }

                const imageId = result.insertId;

                res.status(200).json({
                    message: "檔案上傳成功",
                    url: imgPath,
                    imageId: imageId
                });
            }
        );
    } catch (error) {
        console.error("處理過程中發生錯誤:", error);
        res.status(500).json({ message: "伺服器錯誤" });
    }
});

// 獲取圖片的路由（如果需要的話）
app.get("/api/images/:id", (req, res) => {
    const imageId = req.params.id;
    
    connect.execute(
        'SELECT * FROM `article_img` WHERE id = ?',
        [imageId],
        (err, rows) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ message: "伺服器錯誤" })
            }

            if (rows.length === 0) {
                return res.status(404).json({ message: "圖片未找到" })
            }

            const image = rows[0];
            res.json({ imagePath: image.img_path });
        }
    )
})

// 修改創建文章的 API 路由，以關聯上傳的圖片
app.post("/api/createArticle", (req, res) => {
    const { title, content, sort, imageIds } = req.body;
    
    connect.execute(
        'INSERT INTO `article` (title, content, sort, create_at) VALUES (?, ?, ?, NOW())',
        [title, content, sort],
        (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ status: 'error', message: '保存文章失敗' })
            }
            
            const articleId = result.insertId;

            // 更新 article_img 表中的 article_id
            if (imageIds && imageIds.length > 0) {
                const updatePromises = imageIds.map(imageId => 
                    new Promise((resolve, reject) => {
                        connect.execute(
                            'UPDATE `article_img` SET article_id = ? WHERE id = ?',
                            [articleId, imageId],
                            (updateErr) => {
                                if (updateErr) reject(updateErr);
                                else resolve()
                            }
                        );
                    })
                );

                Promise.all(updatePromises)
                    .then(() => {
                        res.status(201).json({ 
                            status: 'success', 
                            message: '文章保存成功', 
                            articleId: articleId 
                        });
                    })
                    .catch(updateErr => {
                        console.error(updateErr);
                        res.status(500).json({ status: 'error', message: '更新圖片關聯失敗，但文章已保存' })
                    });
            } else {
                res.status(201).json({ 
                    status: 'success', 
                    message: '文章保存成功', 
                    articleId: articleId 
                });
            }
        }
    )
})

function extractImageIds(content) {
    const regex = /imageId=(\d+)/g;
    const matches = content.matchAll(regex);
    return Array.from(matches, m => parseInt(m[1]));
}


app.listen(3001, () => {
    console.log("http://localhost:3001");
})