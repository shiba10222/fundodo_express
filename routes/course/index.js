import express from "express";
import conn from "../../db.js";
import multer from 'multer';
import path from 'path';
import moment from 'moment';
import authenticateToken from "../member/auth/authToken.js";

const router = express.Router();

// 圖片影片上傳配置
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.fieldname === 'img_path') {
      cb(null, 'public/upload/crs_images');
    } else if (file.fieldname.startsWith('video_')) {
      cb(null, 'public/upload/crs_videos');
    }
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname))
  }
});

const upload = multer({
  storage: storage,
  fileFilter: function (req, file, cb) {
    if (file.fieldname === 'video_path') {
      const filetypes = /mp4|avi|mov|wmv/;
      const mimetype = filetypes.test(file.mimetype);
      const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
      if (mimetype && extname) {
        return cb(null, true);
      }
      cb(new Error('只允許上傳 mp4, avi, mov, wmv 格式的文件'));
    } else {
      cb(null, true);
    }
  }
}).fields([
  { name: 'img_path', maxCount: 1 },
  { name: 'video_path', maxCount: 10 }
]);


// GET: 獲取所有課程
router.get("/", async (req, res) => {
  try {
    const search = req.query.search || '';
    const page = parseInt(req.query.page) || 1;
    const coursesPerPage = parseInt(req.query.perPage, 10) || 9;
    const tag = req.query.tag || '全部分類';
    const sort = req.query.sort || 'newest';
    const offset = (page - 1) * coursesPerPage;

    let query = `
      SELECT c.*, 
        GROUP_CONCAT(DISTINCT ct.name) AS tags,
        GROUP_CONCAT(DISTINCT ci.path) AS image_paths
      FROM courses c
      LEFT JOIN course_tags cta ON c.id = cta.course_id
      LEFT JOIN course_tag ct ON cta.tag_id = ct.id
      LEFT JOIN course_imgs ci ON c.id = ci.course_id
      WHERE c.status = "1" AND c.title LIKE ?
    `;

    const queryParams = [`%${search}%`];

    if (tag !== '全部分類') {
      query += ' AND ct.name = ?';
      queryParams.push(tag);
    }

    query += ' GROUP BY c.id';

    switch (sort) {
      case 'newest':
        query += ' ORDER BY c.created_at DESC';
        break;
      case 'mostViewed':
        query += ' ORDER BY c.viewed_count DESC';
        break;
      case 'priceLowToHigh':
        query += ' ORDER BY c.sale_price ASC';
        break;
      case 'priceHighToLow':
        query += ' ORDER BY c.sale_price DESC';
        break;
    }

    query += ' LIMIT ? OFFSET ?';
    queryParams.push(coursesPerPage, offset);

    const [coursesResult] = await conn.query(query, queryParams);
    const [totalResult] = await conn.query(`
      SELECT COUNT(DISTINCT c.id) as total 
      FROM courses c
      LEFT JOIN course_tags cta ON c.id = cta.course_id
      LEFT JOIN course_tag ct ON cta.tag_id = ct.id
      WHERE c.status = "1" AND c.title LIKE ? ${tag !== '全部分類' ? 'AND ct.name = ?' : ''}
    `, queryParams.slice(0, tag !== '全部分類' ? 2 : 1)); // 注意這裡的 queryParams.slice 確保正確參數傳遞
    const totalCourses = totalResult[0].total;

    const coursesWithTags = coursesResult.map(course => ({
      ...course,
      tags: course.tags ? course.tags.split(',') : [],
      images: course.image_paths ? course.image_paths.split(',') : []
    }));

    res.status(200).json({
      status: "success",
      message: "取得所有課程",
      data: coursesWithTags,
      currentPage: page,
      totalCourses: totalCourses,
      coursesPerPage: coursesPerPage,
      totalPages: Math.ceil(totalCourses / coursesPerPage)
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "獲取課程失敗",
      error: error.message
    });
  }
});

// GET: 獲取所有分類
router.get("/tags", async (req, res) => {
  try {
    const [result] = await conn.query("SELECT id, name FROM course_tag");
    res.status(200).json({
      status: "success",
      message: "取得所有分類",
      data: result
    });
  } catch (error) {
    res.status(404).json({
      status: "error",
      message: "找不到分類資料",
      error: error.message
    });
  }
});

// GET: 獲取特定課程
router.get("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const [courseResult] = await conn.query("SELECT * FROM courses WHERE id = ? AND status = '1'", [id]);
    if (courseResult.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "找不到指定課程"
      });
    }

    const course = courseResult[0];
    const [chaptersResult] = await conn.query("SELECT * FROM course_chapters WHERE course_id = ?", [id]);
    const [lessonsResult] = await conn.query(`
      SELECT cl.*
      FROM course_lessons cl
      JOIN course_chapters cc ON cl.chapter_id = cc.id
      WHERE cc.course_id = ?
      ORDER BY cl.chapter_id, cl.id 
    `, [id]);

    course.chapters = chaptersResult.map(chapter => ({
      ...chapter,
      lessons: lessonsResult
        .filter(lesson => lesson.chapter_id === chapter.id)
        .map(lesson => ({
          ...lesson,
          video_path: lesson.video_path ? `/upload/crs_videos/${lesson.video_path}` : null
        }))
    }));

    const [tagResults] = await conn.query(`
      SELECT ct.id, ct.name
      FROM course_tags cta
      JOIN course_tag ct ON cta.tag_id = ct.id
      WHERE cta.course_id = ?
    `, [id]);

    course.tag_ids = tagResults.map(tag => tag.id);
    course.tags = tagResults.map(tag => tag.name);

    const [imgResult] = await conn.query("SELECT path FROM course_imgs WHERE course_id = ?", [id]);
    course.images = imgResult.map(img => img.path);

    res.status(200).json({
      status: "success",
      message: "取得指定課程",
      data: course,
      imgPath: course.img_path ? `/images/${course.img_path}` : null
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "獲取課程失敗",
      error: error.message
    });
  }
});


// POST: 新增課程
router.post("/", (req, res, next) => {
  upload(req, res, function (err) {
    if (err) {
      console.error("File upload error:", err);
      return res.status(400).json({ status: "error", message: err.message });
    }
    console.log('Files received:', JSON.stringify(req.files, null, 2));
    console.log('Request body:', JSON.stringify(req.body, null, 2));
    next();
  });
}, async (req, res) => {
  try {

    console.log('Received files:', req.files);
    console.log('Received body:', req.body);
    const { title, summary, description, original_price, sale_price, tags, chapters } = req.body;
    const img_path = req.files['img_path'] ? req.files['img_path'][0].filename : null;
    const created_at = moment().format('YYYY-MM-DD HH:mm:ss');

    // 插入課程基本信息(還差多張圖片)
    const [result] = await conn.query(
      "INSERT INTO courses (title, summary, description, img_path, original_price, sale_price, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [title, summary, description, img_path, original_price, sale_price, created_at]
    );

    const courseId = result.insertId;

    // 插入課程分類
    let tagsArray = Array.isArray(tags) ? tags : [tags].filter(Boolean);
    if (tagsArray.length > 0) {
      const tagValues = tagsArray.map(tagId => [courseId, tagId]);
      await conn.query(
        "INSERT INTO course_tags (course_id, tag_id) VALUES ?",
        [tagValues]
      );
    }

    // 處理章節和課程
    const parsedChapters = JSON.parse(chapters);
    for (let chapterIndex = 0; chapterIndex < parsedChapters.length; chapterIndex++) {
      const chapter = parsedChapters[chapterIndex];
      const [chapterResult] = await conn.query(
        "INSERT INTO course_chapters (course_id, name) VALUES (?, ?)",
        [courseId, chapter.name]
      );

      const chapterId = chapterResult.insertId;

      for (let lessonIndex = 0; lessonIndex < chapter.lessons.length; lessonIndex++) {
        const lesson = chapter.lessons[lessonIndex];
        const videoFieldName = `video_${chapterIndex}_${lessonIndex}`;
        console.log('Looking for video file:', videoFieldName);
        const videoFile = req.files['video_path'] ?
          req.files['video_path'].find(file => file.fieldname === 'video_path') :
          null;

        let videoPath = null;
        if (videoFile) {
          videoPath = videoFile.filename;
          console.log(`Video file found for ${videoFieldName}:`, videoFile.filename);
        } else {
          console.warn(`No video file found for ${videoFieldName}`);
        }

        await conn.query(
          "INSERT INTO course_lessons (chapter_id, name, duration, video_path) VALUES (?, ?, ?, ?)",
          [chapterId, lesson.name, lesson.duration, videoPath]
        );
      }
    }

    res.status(201).json({
      status: "success",
      message: "課程新增成功",
      data: { courseId }
    });
  } catch (error) {
    console.error("新增課程時發生錯誤:", error);
    res.status(500).json({
      status: "error",
      message: "課程新增失敗",
      error: error.message
    });
  }
});

// PATCH: 更新特定課程
router.patch("/:id", (req, res, next) => {
  upload(req, res, function (err) {
    if (err) {
      console.error("File upload error:", err);
      return res.status(400).json({ status: "error", message: err.message });
    }
    console.log('Files received:', JSON.stringify(req.files, null, 2));
    console.log('Request body:', JSON.stringify(req.body, null, 2));
    next();
  });
}, async (req, res) => {
  const courseId = req.params.id;

  try {
    // 檢查課程是否存在
    const [courseCheck] = await conn.query("SELECT * FROM courses WHERE id = ? AND status = '1'", [courseId]);
    if (courseCheck.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "找不到指定課程或課程已被刪除"
      });
    }

    const { title, summary, description, original_price, sale_price, tag_ids, chapters } = req.body;
    const img_path = req.files['img_path'] ? req.files['img_path'][0].filename : null;
    const updated_at = moment().format('YYYY-MM-DD HH:mm:ss');

    let updateQuery = "UPDATE courses SET title = ?, summary = ?, description = ?, original_price = ?, sale_price = ?, updated_at = ?";
    let updateParams = [title, summary, description, original_price, sale_price, updated_at];

    if (img_path) {
      updateQuery += ", img_path = ?";
      updateParams.push(img_path);
    }

    updateQuery += " WHERE id = ? AND status = '1'";
    updateParams.push(courseId);

    await conn.query(updateQuery, updateParams);

    // 更新課程分類
    await conn.query("DELETE FROM course_tags WHERE course_id = ?", [courseId]);
    const parsedTagIds = JSON.parse(tag_ids);
    if (parsedTagIds && parsedTagIds.length > 0) {
      const tagValues = parsedTagIds.map(tagId => [courseId, tagId]);
      await conn.query("INSERT INTO course_tags (course_id, tag_id) VALUES ?", [tagValues]);
    }

    // 更新章節和課程
    await conn.query("DELETE FROM course_chapters WHERE course_id = ?", [courseId]);
    await conn.query("DELETE FROM course_lessons WHERE chapter_id IN (SELECT id FROM course_chapters WHERE course_id = ?)", [courseId]);

    const parsedChapters = JSON.parse(chapters);
    for (let chapterIndex = 0; chapterIndex < parsedChapters.length; chapterIndex++) {
      const chapter = parsedChapters[chapterIndex];
      const [chapterResult] = await conn.query(
        "INSERT INTO course_chapters (course_id, name) VALUES (?, ?)",
        [courseId, chapter.name]
      );

      const chapterId = chapterResult.insertId;

      for (let lessonIndex = 0; lessonIndex < chapter.lessons.length; lessonIndex++) {
        const lesson = chapter.lessons[lessonIndex];
        const videoFile = req.files[`video_path`];

        let videoFileName = lesson.video_path;

        if (videoFile) {
          videoFileName = videoFile[0].filename; // 使用新的文件名
        }

        await conn.query(
          "INSERT INTO course_lessons (chapter_id, name, duration, video_path) VALUES (?, ?, ?, ?)",
          [chapterId, lesson.name, lesson.duration, videoFileName] // 保存新的文件名到資料庫
        );
      }

    }

    res.status(200).json({
      status: "success",
      message: "課程更新成功",
      data: { courseId }
    });
  } catch (error) {
    console.error("更新課程時發生錯誤:", error);
    res.status(500).json({
      status: "error",
      message: "課程更新失敗",
      error: error.message
    });
  }
});

// DELETE: 軟刪除特定課程
router.patch("/delete/:id", async (req, res) => {
  const id = req.params.id;

  try {
    const [result] = await conn.query(
      "UPDATE courses SET updated_at = NOW(), status = '0' WHERE id = ? AND status = '1'",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        status: "error",
        message: "找不到指定的課程或課程已被刪除"
      });
    }

    res.status(200).json({
      status: "success",
      message: "課程軟刪除成功"
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "刪除課程失敗",
      error: error.message
    });
  }
});

router.post("/cart", authenticateToken, async (req, res) => {
  const { buy_sort, buy_id } = req.body;
  const user_id = req.user.id;

  if (!buy_sort || !buy_id) {
    return res.status(400).json({
      status: "error",
      message: "缺少必要欄位"
    });
  }

  try {
    // 檢查商品是否已存在於購物車中
    const [existingItem] = await conn.query(
      "SELECT * FROM cart WHERE user_id = ? AND buy_sort = ? AND buy_id = ?",
      [user_id, buy_sort, buy_id]
    );

    if (existingItem.length > 0) {
      return res.status(400).json({
        status: "error",
        message: "此項目已在購物車中"
      });
    }

    // 插入資料到購物車表
    const [result] = await conn.query(
      `INSERT INTO cart (user_id, buy_sort, buy_id, quantity)
       VALUES (?, ?, ?, 1)`,
      [user_id, buy_sort, buy_id]
    );

    res.status(201).json({
      status: "success",
      message: "成功添加到購物車",
      data: { id: result.insertId }
    });
  } catch (error) {
    console.error("添加到購物車時出錯", error);
    res.status(500).json({
      status: "error",
      message: "伺服器錯誤",
      error: error.message
    });
  }
});


router.get("/permission", authenticateToken, async (req, res) => {
  const { courseId } = req.query;
  const userId = req.user.id; // 從已驗證的 token 中獲取 user_id

  if (!courseId) {
    return res.status(400).json({
      status: "error",
      message: "缺少必要的查詢參數"
    });
  }


  try {
    const [result] = await conn.query(
      "SELECT * FROM crs_perm WHERE user_id = ? AND crs_id = ?",
      [userId, courseId]
    );

    if (result.length > 0) {
      res.status(200).json({
        status: "success",
        hasPurchased: true,
        startDate: result[0].start_date
      });
    } else {
      res.status(200).json({
        status: "success",
        hasPurchased: false
      });
    }
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "檢查課程權限時發生錯誤",
      error: error.message
    });
  }
});

export default router;