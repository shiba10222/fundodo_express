import express from "express";
import conn from "../../db.js";
import multer from 'multer';
import path from 'path';
import moment from 'moment';

const router = express.Router();

// 圖片影片上傳配置
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (file.fieldname === 'img_path' || file.fieldname === 'outline_images') {
      cb(null, 'public/upload/crs_images');
    } else if (file.fieldname === 'videos') {
      cb(null, 'public/upload/crs_videos');
    }
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname))
  }
});

const fileFilter = function (req, file, cb) {
  console.log('Processing file:', file.fieldname, file.originalname);
  if (file.fieldname === 'img_path') {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
      return cb(new Error('只允許上傳圖片文件'));
    }
  } else if (file.fieldname === 'videos') {
    if (!file.originalname.match(/\.(mp4|avi|mov|wmv)$/)) {
      return cb(new Error('只允許上傳 mp4, avi, mov, wmv 格式的文件'));
    }
  }
  cb(null, true);
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: { fileSize: 100 * 1024 * 1024 } // 100MB
});




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

router.get("/permission", async (req, res) => {
  const { courseId, userId } = req.query;

  console.log(`Received courseId: ${courseId}, userId: ${userId}`);

  if (!courseId) {
    return res.status(400).json({
      status: "error",
      message: "缺少必要的查詢參數"
    });
  }

  try {
    console.log(`Checking permission for user ${userId} and course ${courseId}`);

    const [result] = await conn.execute(`
      SELECT c.id as course_id, c.title, cp.start_date, cp.end_date
      FROM courses c
      LEFT JOIN crs_perm cp ON c.id = cp.crs_id AND cp.user_id = ?
      WHERE c.id = ? AND c.status = 1
    `, [userId, courseId]);

    console.log('Query result:', result);

    if (result.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "找不到指定課程或已被刪除"
      });
    }

    const course = result[0];

    if (course.start_date) {
      res.status(200).json({
        status: "success",
        hasPurchased: true,
        startDate: course.start_date,
        endDate: course.end_date
      });
    } else {
      res.status(200).json({
        status: "success",
        hasPurchased: false
      });
    }
  } catch (error) {
    console.error('檢查課程時發生錯誤:', error);
    res.status(500).json({
      status: "error",
      message: "檢查課程權限時發生錯誤",
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
router.post("/", upload.fields([
  { name: 'img_path', maxCount: 1 },
  { name: 'videos', maxCount: 50 },
  { name: 'outline_images', maxCount: 10 }
]), async (req, res) => {
  try {
    const { title, summary, description, original_price, sale_price, tags, chapters } = req.body;
    
    // 檢查並解析 tags
    let parsedTags;
    try {
      parsedTags = JSON.parse(tags);
    } catch (error) {
      console.error('解析 tags 時出錯:', error);
      return res.status(400).json({ status: "error", message: "無效的 tags 格式" });
    }

    // 檢查並解析 chapters
    let parsedChapters;
    try {
      parsedChapters = JSON.parse(chapters);
    } catch (error) {
      console.error('解析 chapters 時出錯:', error);
      return res.status(400).json({ status: "error", message: "無效的 chapters 格式" });
    }

    const img_path = req.files['img_path'] ? req.files['img_path'][0].filename : null;
    const created_at = moment().format('YYYY-MM-DD HH:mm:ss');

    // 插入課程基本信息
    const [result] = await conn.query(
      "INSERT INTO courses (title, summary, description, img_path, original_price, sale_price, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [title, summary, description, img_path, original_price, sale_price, created_at]
    );

    const courseId = result.insertId;

    // 處理標籤
    if (parsedTags && parsedTags.length > 0) {
      const tagValues = parsedTags.map(tagId => [courseId, tagId]);
      await conn.query("INSERT INTO course_tags (course_id, tag_id) VALUES ?", [tagValues]);
    }

    // 處理章節和課程
    for (let chapter of parsedChapters) {
      const [chapterResult] = await conn.query(
        "INSERT INTO course_chapters (course_id, name) VALUES (?, ?)",
        [courseId, chapter.name]
      );

      const chapterId = chapterResult.insertId;

      for (let lesson of chapter.lessons) {
        let videoPath = null;
        if (req.files['videos'] && req.files['videos'].length > 0) {
          videoPath = req.files['videos'].shift().filename;
        }

        await conn.query(
          "INSERT INTO course_lessons (chapter_id, name, duration, video_path) VALUES (?, ?, ?, ?)",
          [chapterId, lesson.name, lesson.duration, videoPath]
        );
      }
    }

    // 處理課程大綱圖片
    if (req.files['outline_images']) {
      const outlineImages = req.files['outline_images'];
      for (let image of outlineImages) {
        await conn.query(
          "INSERT INTO course_imgs (course_id, path) VALUES (?, ?)",
          [courseId, image.filename]
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
router.patch('/:id', upload.fields([{ name: 'img_path', maxCount: 1 }, { name: 'outline_images', maxCount: 10 }, { name: 'videos', maxCount: 10 }]), async (req, res) => {
  const courseId = req.params.id;
  const { title, summary, description, tags, original_price, sale_price, chapters } = req.body;
  const updated_at = moment().format('YYYY-MM-DD HH:mm:ss');

  try {
    const img_path = req.files['img_path'] ? req.files['img_path'][0].filename : null;
    const [course] = await conn.query(
      "SELECT * FROM courses WHERE id = ?", [courseId]
    );

    if (!course.length) {
      return res.status(404).json({
        status: "error",
        message: "課程不存在"
      });
    }

    // 更新課程資料
    await conn.query('UPDATE courses SET title = ?, summary = ?, description = ?, img_path = COALESCE(?, img_path), original_price = ?, sale_price = ?, updated_at = ? WHERE id = ?', [title, summary, description, img_path, original_price, sale_price, updated_at, courseId]);


    // 如果 tags 不為空或 null，更新標籤，否則保留原有標籤
    if (tags) {
      const tagArray = JSON.parse(tags);
      if (tagArray.length > 0) {
        // 刪除舊標籤
        await conn.query("DELETE FROM course_tags WHERE course_id = ?", [courseId]);

        // 插入新標籤
        const tagValues = tagArray.map(tagId => [courseId, tagId]);
        await conn.query("INSERT INTO course_tags (course_id, tag_id) VALUES ?", [tagValues]);
      }
    }

    // 處理大綱圖片
    const parsedExistingImages = JSON.parse(existing_outline_images);
    await conn.query("DELETE FROM course_imgs WHERE course_id = ? AND path NOT IN (?)", [courseId, parsedExistingImages]);

    if (req.files['outline_images']) {
      for (let file of req.files['outline_images']) {
        await conn.query("INSERT INTO course_imgs (course_id, path) VALUES (?, ?)", [courseId, file.filename]);
      }
    }


    // 更新章節和單元
    await conn.query('DELETE FROM course_chapters WHERE course_id = ?', [courseId]);
    await conn.query('DELETE FROM course_lessons WHERE chapter_id IN (SELECT id FROM course_chapters WHERE course_id = ?)', [courseId]);

    const chaptersData = JSON.parse(chapters);
    const videoFiles = req.files['videos'] || [];
    let videoIndex = 0;

    for (let chapterIndex = 0; chapterIndex < chaptersData.length; chapterIndex++) {
      const chapter = chaptersData[chapterIndex];
      const [chapterResult] = await conn.query(
        "INSERT INTO course_chapters (course_id, name) VALUES (?, ?)",
        [courseId, chapter.name]
      );

      const chapterId = chapterResult.insertId;
      for (let lessonIndex = 0; lessonIndex < chapter.lessons.length; lessonIndex++) {
        const lesson = chapter.lessons[lessonIndex];

        let videoPath = null;
        if (videoIndex < videoFiles.length) {
          videoPath = videoFiles[videoIndex].filename;
          videoIndex++;
        } else {
          // 保留原有影片路徑
          videoPath = lesson.video_path || null;
        }

        await conn.query(
          "INSERT INTO course_lessons (chapter_id, name, duration, video_path) VALUES (?, ?, ?, COALESCE(?, video_path))",
          [chapterId, lesson.name, lesson.duration, videoPath]
        );
      }
    }

    res.status(200).json({ message: '課程更新成功' });
  } catch (error) {
    console.error('課程更新錯誤:', error);
    res.status(500).json({ message: '更新課程失敗' });
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


export default router;