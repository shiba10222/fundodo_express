import express from "express";
import multer from "multer";
import { Low } from "lowdb";
import cors from "cors";
import { JSONFile } from "lowdb/node";
import connect from "./db.js";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

const uploadDir = path.join(__dirname, "public", "articleImg");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}
// 設置文件儲存
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "public", "articleImg"));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage: storage });

const defaultDate = { article: [] };
const db = new Low(new JSONFile("article.json"), defaultDate);
await db.read();

app.use("/public", express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.send("首頁");
});
app.get("/api/articles", (req, res) => {
  const sort = req.query.sort;
  const search = req.query.search;

  let query = "SELECT * FROM `article` WHERE `article_delete` = 0";
  let params = [];

  if (sort) {
    query += " AND sort = ?";
    params.push(sort);
  }

  if (search) {
    query += " AND LOWER(title) LIKE LOWER(?)";
    params.push(`%${search}%`);
  }

  query += " ORDER BY `create_at` DESC";

  connect.execute(query, params, (err, articles) => {
    if (err) {
      console.error(err);
      return res.status(500).json({
        status: "error",
        message: "資料庫查詢錯誤",
      });
    }

    res.status(200).json({
      status: "success",
      message: "文章列表",
      articles,
    });
  });
});

// app.get("/api/articles", (req, res) => {
//     connect.execute(
//         "SELECT * FROM `article` WHERE `article_delete` = 0 ORDER BY `create_at` DESC",
//         (err, articles) => {
//             if (err) {
//                 console.log(err);
//                 return
//             }
//             res.status(200).json({
//                 status: "success",
//                 message: "所有文章",
//                 articles
//             })
//         }
//     )
// })

// app.get("/api/articles/:sort", (req, res) => {
//     const sort = req.params.sort
//     if (sort) {
//         connect.execute(
//             "SELECT * FROM `article` WHERE `article_delete` = 0 AND sort = ? ORDER BY `create_at` DESC", [sort],
//             (err, articles) => {
//                 if (err) {
//                     console.log(err);
//                     return
//                 }
//                 res.status(200).json({
//                     status: "success",
//                     message: "所有文章",
//                     articles
//                 })
//             }
//         )
//     }

// })

app.get("/api/sort", (req, res) => {
  connect.execute("SELECT * FROM `article_sort`", (err, sorts) => {
    if (err) {
      console.log(err);
      return;
    }
    res.status(200).json({
      status: "success",
      message: "所有分類",
      sorts,
    });
  });
});

app.get("/api/articleContent/:id", (req, res) => {
  const id = req.params.id;
  connect.execute(
    "SELECT * FROM `article` WHERE `id`= ? AND `article_delete` = 0",
    [id],
    (err, content) => {
      if (err) {
        console.log(err);
        return;
      }
      res.status(200).json({
        status: "success",
        message: "文章內容",
        content,
      });
    }
  );
});

app.post("/api/upload2", upload.single("articleImage"), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "檔案未上傳成功" });
    }

    const imgPath = "/public/articleImg/" + req.file.filename;

    connect.execute(
      "INSERT INTO `article_img` (img_path) VALUES (?)",
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
          imageId: imageId,
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
  const articleId = req.params.id;

  connect.execute(
    "SELECT img_path FROM article_img WHERE article_id = ? LIMIT 1",
    [articleId],
    (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: "Database error" });
      }

      if (results.length > 0) {
        res.json({
          status: "success",
          message: "圖片讀取成功",
          imagePath: results[0].img_path,
        });
      } else {
        res.json({
          status: "success",
          message: "圖片讀取失敗",
          imagePath: null,
        });
      }
    }
  );
});

// 修改創建文章的 API 路由，以關聯上傳的圖片
app.post("/api/createArticle", (req, res) => {
  const { title, content, sort } = req.body;

  connect.execute(
    "INSERT INTO `article` (title, content, sort, create_at) VALUES (?, ?, ?, NOW())",
    [title, content, sort],
    (err, result) => {
      if (err) {
        console.error(err);
        return res
          .status(500)
          .json({ status: "error", message: "保存文章失敗" });
      }

      const articleId = result.insertId;

      // 查詢 article_img 表,根據 articleId 獲取對應的 id 列表
      connect.execute(
        "SELECT id FROM `article_img` WHERE article_id IS NULL OR article_id = 0",
        (selectErr, rows) => {
          if (selectErr) {
            console.error(selectErr);
            return res
              .status(500)
              .json({ status: "error", message: "獲取圖片資訊失敗" });
          }

          const imageIds = rows.map((row) => row.id);

          // 更新 article_img 表中的 article_id
          const updatePromises = imageIds.map(
            (imageId) =>
              new Promise((resolve, reject) => {
                connect.execute(
                  "UPDATE `article_img` SET article_id = ? WHERE id = ?",
                  [articleId, imageId],
                  (updateErr) => {
                    if (updateErr) reject(updateErr);
                    else resolve();
                  }
                );
              })
          );

          Promise.all(updatePromises)
            .then(() => {
              res.status(201).json({
                status: "success",
                message: "文章保存成功",
                articleId: articleId,
                imageIds: imageIds,
              });
            })
            .catch((updateErr) => {
              console.error(updateErr);
              res.status(500).json({
                status: "error",
                message: "更新圖片關聯失敗，但文章已保存",
              });
            });
        }
      );
    }
  );
});

app.put("/api/editArticle/:id", (req, res) => {
  const { title, content, sort, imageIds } = req.body;
  const articleId = req.params.id;

  console.log('收到請求:', { articleId, title, sort, imageIds });

  // 步驟 1：更新文章基本資訊
  connect.execute(
    "UPDATE `article` SET title = ?, content = ?, sort = ? WHERE id = ?",
    [title, content, sort, articleId],
    (err, result) => {
      if (err) {
        console.error('更新文章時發生錯誤:', err);
        return res.status(500).json({ status: "error", message: "更新文章失敗", error: err.message });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ status: "error", message: "文章不存在" });
      }

      // 步驟 2：將所有與該文章相關的圖片設置為未關聯狀態
      connect.execute(
        "UPDATE `article_img` SET article_id = 0 WHERE article_id = ?",
        [articleId],
        (unlinkErr) => {
          if (unlinkErr) {
            console.error('解除圖片關聯時發生錯誤:', unlinkErr);
            return res.status(500).json({ status: "error", message: "解除圖片關聯失敗", error: unlinkErr.message });
          }

          // 步驟 3：更新應該保留的圖片關聯
          const updateQuery = `
            UPDATE article_img 
            SET article_id = ?
            WHERE SUBSTRING_INDEX(SUBSTRING_INDEX(img_path, '-', -2), '-', 1) IN (?)
            AND (article_id = 0 OR article_id IS NULL)
          `;

          connect.query(updateQuery, [articleId, imageIds], (updateErr, updateResult) => {
            if (updateErr) {
              console.error('更新圖片關聯時發生錯誤:', updateErr);
              return res.status(500).json({ status: "error", message: "更新圖片關聯失敗", error: updateErr.message });
            }

            // 步驟 4：刪除不再使用的圖片
            const deleteQuery = `
              DELETE FROM article_img 
              WHERE article_id = 0
              AND SUBSTRING_INDEX(SUBSTRING_INDEX(img_path, '-', -2), '-', 1) NOT IN (?)
            `;

            connect.query(deleteQuery, [imageIds], (deleteErr, deleteResult) => {
              if (deleteErr) {
                console.error('刪除未使用圖片時發生錯誤:', deleteErr);
                return res.status(500).json({ status: "error", message: "刪除未使用圖片失敗", error: deleteErr.message });
              }

              res.status(200).json({
                status: "success",
                message: "文章更新成功，包括圖片更新",
                articleId: articleId,
                updatedImageCount: updateResult.affectedRows,
                deletedImageCount: deleteResult.affectedRows
              });
            });
          });
        }
      );
    }
  );
});

app.delete("/api/deleteArticle/:id", (req, res) => {
  const articleId = req.params.id;

  console.log('收到刪除文章請求:', { articleId });

  connect.execute(
    "UPDATE `article` SET article_delete = 1 WHERE id = ?",
    [articleId],
    (err, result) => {
      if (err) {
        console.error('刪除文章時發生錯誤:', err);
        return res.status(500).json({ status: "error", message: "刪除文章失敗", error: err.message });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ status: "error", message: "文章不存在" });
      }

      res.status(200).json({
        status: "success",
        message: "文章已成功標記為刪除",
        articleId: articleId
      });
    }
  );
});

app.post("/api/createReply/:aid", (req, res) => {
  const { content } = req.body;
  const articleId = req.params.aid;
  const userid = 0; // 這裡應該是從身份驗證中獲取的


  connect.execute(
    "INSERT INTO `reply` (content, userid, article_id, create_at) VALUES (?, ?, ?, NOW())",
    [content, userid, articleId],
    (err, result) => {
      if (err) {
        console.error(err);
        return res
          .status(500)
          .json({ status: "error", message: "保存回覆失敗" });
      }

      res.status(201).json({
        status: "success",
        message: "回覆保存成功",
        replyId: result.insertId,
      });
    }
  );
});

app.get("/api/replys/:aid", (req, res) => {
  const articleId = req.params.aid;
  connect.execute(
    "SELECT * FROM `reply` WHERE `article_id` = ?",
    [articleId],
    (err, articles) => {
      if (err) {
        console.log(err);
        return;
      }
      res.status(200).json({
        status: "success",
        message: "所有回覆",
        articles,
      });
    }
  );
});

app.listen(3001, () => {
  console.log("http://localhost:3001");
});
