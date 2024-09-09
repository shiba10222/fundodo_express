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
  const tag = req.query.tag;
  const orderBy = req.query.orderBy;

  let query = `
    SELECT a.*, u.nickname as author_nickname,u.avatar_file,
           s.sort as sort_name,
           GROUP_CONCAT(DISTINCT at.tag) as tags,
           (SELECT COUNT(*) FROM reply r WHERE r.article_id = a.id AND r.reply_delete = 0) as reply_count
    FROM article a
    LEFT JOIN users u ON a.userid = u.id
    LEFT JOIN article_sort s ON a.sort = s.id
    LEFT JOIN article_tags at ON a.id = at.article_id
    WHERE a.article_delete = 0
  `
  let params = [];

  // if (sort) {
  //   query += " AND sort = ?";
  //   params.push(sort);
  // }
  if (sort) {
    query += " AND a.sort = ?";
    params.push(sort);
  }


  if (search) {
    query += " AND LOWER(title) LIKE LOWER(?)";
    params.push(`%${search}%`);
  }
  if (tag) {
    query += " AND at.tag = ?";
    params.push(tag);
  }
  query += " GROUP BY a.id";

  // 如果按標籤過濾，我們需要一個子查詢來確保只返回包含該標籤的文章
  if (tag) {
    query = `
      SELECT * FROM (${query}) AS filtered
      WHERE filtered.tags LIKE ? OR filtered.tags IS NULL
    `;
    params.push(`%${tag}%`);
  }

  switch (orderBy) {
    case '2':
      query += " ORDER BY reply_count DESC, create_at DESC";
      break;
    case '1':
    default:
      query += " ORDER BY create_at DESC";
  }
  // query += " ORDER BY `create_at` DESC";

  try {
    const [articles] = await connect.execute(query, params);
    res.status(200).json({
      status: "success",
      message: "文章列表",
      articles: articles.map(article => ({
        ...article,
        tags: article.tags ? article.tags.split(',') : [],
        sort: article.sort_name,
        reply_count: parseInt(article.reply_count, 10),
        avatar_file: article.avatar_file ? `http://localhost:3005/upload/${article.avatar_file}` : null
      }))
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
const VIEW_TIMEOUT = 300000; // 5分鐘，可以根據需求調整
const viewCache = new Map();
router.get("/articleContent/:id", async (req, res) => {

  const id = req.params.id;
  const clientIp = req.ip;
  try {
    const cacheKey = `${id}-${clientIp}`;
    const lastViewTime = viewCache.get(cacheKey);
    const now = Date.now();

    if (!lastViewTime || now - lastViewTime > VIEW_TIMEOUT) {
      await connect.execute(
        'UPDATE article SET view_count = view_count + 1 WHERE id = ?',
        [id]
      );
      viewCache.set(cacheKey, now);

      // 清理過期的緩存項
      if (viewCache.size > 10000) { // 設置一個合理的上限
        for (const [key, time] of viewCache.entries()) {
          if (now - time > VIEW_TIMEOUT) {
            viewCache.delete(key);
          }
        }
      }
    }
    const [content] = await connect.execute(
      `
       SELECT a.*, u.nickname as author_nickname, u.avatar_file,
             s.sort as sort_name,
             GROUP_CONCAT(at.tag) as tags
      FROM article a
      LEFT JOIN users u ON a.userid = u.id
      LEFT JOIN article_sort s ON a.sort = s.id
      LEFT JOIN article_tags at ON a.id = at.article_id
      WHERE a.id = ? AND a.article_delete = 0
      GROUP BY a.id
    `,
      [id]
    )

    if (content.length > 0) {
      content[0].tags = content[0].tags ? content[0].tags.split(',') : []
      content[0].sort = content[0].sort_name
    }

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
  const { title, content, sort, userId, tags } = req.body;

  try {
    const [result] = await connect.execute(
      "INSERT INTO `article` (title, content, sort, userid, create_at) VALUES (?, ?, ?, ?, NOW())",
      [title, content, sort, userId]
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

    if (tags && tags.length > 0) {
      for (const tag of tags) {
        if (tag.trim() !== '') {  // 確保標籤不是空字串
          await connect.execute(
            "INSERT INTO article_tags (tag, article_id) VALUES (?, ?)",
            [tag.trim(), articleId]
          );
        }
      }
    }


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
  const { title, content, sort, imageIds, tags } = req.body;
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
    // if (imageIds && imageIds.length > 0) {
    //   const updateQuery = `
    //     UPDATE article_img 
    //     SET article_id = ?
    //     WHERE SUBSTRING_INDEX(SUBSTRING_INDEX(img_path, '-', -2), '-', 1) IN (?)
    //     AND (article_id = 0 OR article_id IS NULL)
    //   `;

    //   await connect.query(updateQuery, [articleId, imageIds]);
    // }
    let updatedImageCount = 0;
    let deletedImageCount = 0;
    if (imageIds && imageIds.length > 0) {
      // 更新保留的圖片
      const updateQuery = `
        UPDATE article_img 
        SET article_id = ?
        WHERE SUBSTRING_INDEX(SUBSTRING_INDEX(img_path, '-', -2), '-', 1) IN (?)
        AND (article_id = 0 OR article_id IS NULL)
      `;
      const [updateResult] = await connect.query(updateQuery, [articleId, imageIds]);
      updatedImageCount = updateResult.affectedRows;

      // 刪除不再使用的圖片
      const deleteQuery = `
        DELETE FROM article_img 
        WHERE article_id = 0
        AND SUBSTRING_INDEX(SUBSTRING_INDEX(img_path, '-', -2), '-', 1) NOT IN (?)
      `;
      const [deleteResult] = await connect.query(deleteQuery, [imageIds]);
      deletedImageCount = deleteResult.affectedRows;
    } else {
      // 如果沒有圖片，刪除所有未關聯的圖片
      const deleteQuery = `
        DELETE FROM article_img 
        WHERE article_id = 0
      `;
      const [deleteResult] = await connect.execute(deleteQuery);
      deletedImageCount = deleteResult.affectedRows;
    }

    // 步驟 4：刪除不再使用的圖片
    // const deleteQuery = `
    //   DELETE FROM article_img 
    //   WHERE article_id = 0
    //   AND SUBSTRING_INDEX(SUBSTRING_INDEX(img_path, '-', -2), '-', 1) NOT IN (?)
    // `;

    // const [deleteResult] = await connect.query(deleteQuery, [imageIds]);

    // 處理標籤
    // 首先，刪除文章的所有現有標籤
    await connect.execute(
      "DELETE FROM article_tags WHERE article_id = ?",
      [articleId]
    );

    // 然後，添加新的標籤
    if (tags && tags.length > 0) {
      for (const tag of tags) {
        if (tag.trim() !== '') {
          await connect.execute(
            "INSERT INTO article_tags (tag, article_id) VALUES (?, ?)",
            [tag.trim(), articleId]
          );
        }
      }
    }

    res.status(200).json({
      status: "success",
      message: "文章更新成功，包括圖片更新",
      articleId: articleId,
      // updatedImageCount: result.affectedRows,
      // deletedImageCount: deleteResult.affectedRows
      updatedImageCount: updatedImageCount,
      deletedImageCount: deletedImageCount
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
  const { content, userid } = req.body;
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
       WHERE r.article_id = ? AND r.reply_delete = 0
       `,
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

router.get("/replyContent/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const [content] = await connect.execute(
      `SELECT r.*, u.nickname as author_nickname
       FROM reply r
       LEFT JOIN users u ON r.userid = u.id
       WHERE r.id = ? AND r.reply_delete = 0`,
      [id]
    );

    if (content.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "回覆不存在",
      });
    }

    res.status(200).json({
      status: "success",
      message: "回覆內容",
      content: content[0],
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: "error",
      message: "獲取回覆內容失敗",
    });
  }
});

// 編輯回覆
router.put("/editReply/:id", async (req, res) => {
  const { content } = req.body;
  const replyId = req.params.id;

  try {
    const [result] = await connect.execute(
      "UPDATE `reply` SET content = ? WHERE id = ?",
      [content, replyId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ status: "error", message: "回覆不存在" });
    }

    // 獲取文章ID，以便前端重定向
    const [replyInfo] = await connect.execute(
      "SELECT article_id FROM `reply` WHERE id = ?",
      [replyId]
    );

    res.status(200).json({
      status: "success",
      message: "回覆更新成功",
      replyId: replyId,
      articleId: replyInfo[0].article_id
    });
  } catch (err) {
    console.error('更新回覆時發生錯誤:', err);
    res.status(500).json({ status: "error", message: "更新回覆失敗", error: err.message });
  }
});

// 刪除回覆
router.delete("/deleteReply/:id", async (req, res) => {
  const replyId = req.params.id;

  try {
    // 先獲取文章ID，以便返回給前端
    const [replyInfo] = await connect.execute(
      "SELECT article_id FROM `reply` WHERE id = ?",
      [replyId]
    );

    const [result] = await connect.execute(
      "UPDATE `reply` SET reply_delete = 1 WHERE id = ?",
      [replyId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ status: "error", message: "回覆不存在" });
    }

    res.status(200).json({
      status: "success",
      message: "回覆已成功標記為刪除",
      replyId: replyId,
      articleId: replyInfo[0].article_id
    });
  } catch (err) {
    console.error('刪除回覆時發生錯誤:', err);
    res.status(500).json({ status: "error", message: "刪除回覆失敗", error: err.message });
  }
});

router.get("/userRating/:articleId/:userId", async (req, res) => {
  const { articleId, userId } = req.params;

  try {
    const [rating] = await connect.execute(
      "SELECT is_like FROM article_ratings WHERE article_id = ? AND user_id = ?",
      [articleId, userId]
    );

    if (rating.length > 0) {
      res.json({
        status: "success",
        rating: rating[0].is_like ? 'like' : 'dislike'
      });
    } else {
      res.json({
        status: "success",
        rating: null
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: "error",
      message: "獲取評分狀態失敗"
    });
  }
});

// 處理用戶評分
router.post("/rate/:articleId", async (req, res) => {
  const { articleId } = req.params;
  const { userId, isLike } = req.body;

  if (!userId) {
    return res.status(400).json({
      status: "error",
      message: "需要用戶ID"
    });
  }

  try {
    // 檢查用戶是否已經評分過
    const [existingRating] = await connect.execute(
      "SELECT id, is_like FROM article_ratings WHERE article_id = ? AND user_id = ?",
      [articleId, userId]
    );

    if (existingRating.length > 0) {
      // 用戶已經評分過，更新評分
      if (existingRating[0].is_like !== isLike) {
        await connect.execute(
          "UPDATE article_ratings SET is_like = ? WHERE id = ?",
          [isLike, existingRating[0].id]
        );

        // 更新文章的評分計數
        if (isLike) {
          await connect.execute(
            "UPDATE article SET likes = likes + 1, dislikes = dislikes - 1 WHERE id = ?",
            [articleId]
          );
        } else {
          await connect.execute(
            "UPDATE article SET likes = likes - 1, dislikes = dislikes + 1 WHERE id = ?",
            [articleId]
          );
        }
      }
    } else {
      // 新的評分
      await connect.execute(
        "INSERT INTO article_ratings (article_id, user_id, is_like) VALUES (?, ?, ?)",
        [articleId, userId, isLike]
      );

      // 更新文章的評分計數
      if (isLike) {
        await connect.execute(
          "UPDATE article SET likes = likes + 1 WHERE id = ?",
          [articleId]
        );
      } else {
        await connect.execute(
          "UPDATE article SET dislikes = dislikes + 1 WHERE id = ?",
          [articleId]
        );
      }
    }

    // 獲取更新後的點讚和倒讚數
    const [updatedCounts] = await connect.execute(
      "SELECT likes, dislikes FROM article WHERE id = ?",
      [articleId]
    );

    res.json({
      status: "success",
      message: "評分成功",
      likes: updatedCounts[0].likes,
      dislikes: updatedCounts[0].dislikes
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      status: "error",
      message: "評分失敗"
    });
  }
});

export default router;