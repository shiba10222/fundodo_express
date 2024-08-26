import express, { Router } from "express";
import multer from "multer";
import cors from "cors";
import connect from "../db.js";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const router = Router();
router.use(cors());
router.use(express.json());

const uploadDir = path.join(__dirname, "..", "public", "articleImg");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
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

router.use("/public", express.static(path.join(__dirname, "..", "public")));

router.get("/", (req, res) => {
  res.send("首頁");
});

router.get("/articles", async (req, res) => {
  const sort = req.query.sort;
  const search = req.query.search;

  let query = `
    SELECT a.*, u.nickname as author_nickname
    FROM article a
    LEFT JOIN users u ON a.userid = u.id
    WHERE a.article_delete = 0
  `
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

  try {
    const [articles] = await connect.execute(query, params);
    res.status(200).json({
      status: "success",
      message: "文章列表",
      articles,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: "error",
      message: "資料庫查詢錯誤",
    });
  }
});

router.get("/sort", async (req, res) => {
  try {
    const [sorts] = await connect.execute("SELECT * FROM `article_sort`");
    res.status(200).json({
      status: "success",
      message: "所有分類",
      sorts,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: "error",
      message: "獲取分類失敗",
    });
  }
});

router.get("/articleContent/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const [content] = await connect.execute(
      `
      SELECT a.*, u.nickname as author_nickname
      FROM article a
      LEFT JOIN users u ON a.userid = u.id
      WHERE a.id = ? AND a.article_delete = 0
    `,
      [id]
    )

    res.status(200).json({
      status: "success",
      message: "文章內容",
      content,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: "error",
      message: "獲取文章內容失敗",
    });
  }
});

router.post("/upload2", upload.single("articleImage"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "檔案未上傳成功" });
    }

    const imgPath = "/public/articleImg/" + req.file.filename;

    const [result] = await connect.execute(
      "INSERT INTO `article_img` (img_path) VALUES (?)",
      [imgPath]
    );

    const imageId = result.insertId;

    res.status(200).json({
      message: "檔案上傳成功",
      url: imgPath,
      imageId: imageId,
    });
  } catch (error) {
    console.error("處理過程中發生錯誤:", error);
    res.status(500).json({ message: "伺服器錯誤" });
  }
});

router.get("/images/:id", async (req, res) => {
  const articleId = req.params.id;

  try {
    const [results] = await connect.execute(
      "SELECT img_path FROM article_img WHERE article_id = ? LIMIT 1",
      [articleId]
    );

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
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Database error" });
  }
});

router.post("/createArticle", async (req, res) => {
  const { title, content, sort } = req.body;

  try {
    const [result] = await connect.execute(
      "INSERT INTO `article` (title, content, sort, create_at) VALUES (?, ?, ?, NOW())",
      [title, content, sort]
    );

    const articleId = result.insertId;

    const [rows] = await connect.execute(
      "SELECT id FROM `article_img` WHERE article_id IS NULL OR article_id = 0"
    );

    const imageIds = rows.map((row) => row.id);

    await Promise.all(
      imageIds.map((imageId) =>
        connect.execute(
          "UPDATE `article_img` SET article_id = ? WHERE id = ?",
          [articleId, imageId]
        )
      )
    );

    res.status(201).json({
      status: "success",
      message: "文章保存成功",
      articleId: articleId,
      imageIds: imageIds,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: "error",
      message: "保存文章失敗",
    });
  }
});

router.put("/editArticle/:id", async (req, res) => {
  const { title, content, sort, imageIds } = req.body;
  const articleId = req.params.id;

  console.log('收到請求:', { articleId, title, sort, imageIds });

  try {
    // 步驟 1：更新文章基本資訊
    const [result] = await connect.execute(
      "UPDATE `article` SET title = ?, content = ?, sort = ? WHERE id = ?",
      [title, content, sort, articleId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ status: "error", message: "文章不存在" });
    }

    // 步驟 2：將所有與該文章相關的圖片設置為未關聯狀態
    await connect.execute(
      "UPDATE `article_img` SET article_id = 0 WHERE article_id = ?",
      [articleId]
    );

    // 步驟 3：更新應該保留的圖片關聯
    const updateQuery = `
      UPDATE article_img 
      SET article_id = ?
      WHERE SUBSTRING_INDEX(SUBSTRING_INDEX(img_path, '-', -2), '-', 1) IN (?)
      AND (article_id = 0 OR article_id IS NULL)
    `;

    await connect.query(updateQuery, [articleId, imageIds]);

    // 步驟 4：刪除不再使用的圖片
    const deleteQuery = `
      DELETE FROM article_img 
      WHERE article_id = 0
      AND SUBSTRING_INDEX(SUBSTRING_INDEX(img_path, '-', -2), '-', 1) NOT IN (?)
    `;

    const [deleteResult] = await connect.query(deleteQuery, [imageIds]);

    res.status(200).json({
      status: "success",
      message: "文章更新成功，包括圖片更新",
      articleId: articleId,
      updatedImageCount: result.affectedRows,
      deletedImageCount: deleteResult.affectedRows
    });
  } catch (err) {
    console.error('更新文章時發生錯誤:', err);
    res.status(500).json({ status: "error", message: "更新文章失敗", error: err.message });
  }
});

router.delete("/deleteArticle/:id", async (req, res) => {
  const articleId = req.params.id;

  console.log('收到刪除文章請求:', { articleId });

  try {
    const [result] = await connect.execute(
      "UPDATE `article` SET article_delete = 1 WHERE id = ?",
      [articleId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ status: "error", message: "文章不存在" });
    }

    res.status(200).json({
      status: "success",
      message: "文章已成功標記為刪除",
      articleId: articleId
    });
  } catch (err) {
    console.error('刪除文章時發生錯誤:', err);
    res.status(500).json({ status: "error", message: "刪除文章失敗", error: err.message });
  }
});

router.post("/createReply/:aid", async (req, res) => {
  const { content,userid } = req.body;
  const articleId = req.params.aid;

  try {
    const [result] = await connect.execute(
      "INSERT INTO `reply` (content, userid, article_id, create_at) VALUES (?, ?, ?, NOW())",
      [content, userid, articleId]
    );

    res.status(201).json({
      status: "success",
      message: "回覆保存成功",
      replyId: result.insertId,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "error", message: "保存回覆失敗" });
  }
});

router.get("/replys/:aid", async (req, res) => {
  const articleId = req.params.aid;
  try {
    const [replies] = await connect.execute(
      `SELECT r.*, u.nickname as author_nickname
       FROM reply r
       LEFT JOIN users u ON r.userid = u.id
       WHERE r.article_id = ?
       ORDER BY r.create_at DESC`,
      [articleId]
    );
    res.status(200).json({
      status: "success",
      message: "所有回覆",
      replies,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ status: "error", message: "獲取回覆失敗" });
  }
});

export default router;