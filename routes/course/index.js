import express from "express";
import conn from "../../db.js";
import multer from 'multer';
import moment from 'moment';
import { v4 as uuid } from 'uuid';

// 處理圖片上傳

const router = express.Router();
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/coursePics');
    },
    filename: (req, file, cb) => {
        cb(null, uuid() + "_" + file.originalname);
    }
})
const upload = multer({ storage: storage })



// 路由開始//

// 取得所有課程
router.get("/", async (req, res) => {
    try {
        const query = `
            SELECT c.*, GROUP_CONCAT(ct.name) AS tags
            FROM courses c
            LEFT JOIN course_tags cta ON c.id = cta.course_id
            LEFT JOIN course_tag ct ON cta.tag_id = ct.id
            WHERE c.status ="1"
            GROUP BY c.id
        `;

        const [coursesResult] = await conn.query(query);
        const coursesWithTags = coursesResult.map(course => ({
            ...course,
            tags: course.tags ? course.tags.split(',') : []
        }));

        res.status(200).json({
            status: "success",
            message: "取得所有課程",
            data: coursesWithTags
        });
    } catch (error) {
        res.status(404).json({
            status: "error",
            message: "找不到課程",
            error: error.message
        });
    }
});

router.get("/category", async (req, res) => {
    try {
        const [result] = await conn.query("SELECT id, name FROM course_tag");
        res.status(200).json({
            status: "success",
            message: "取得所有分類",
            data: result

        })

    } catch (error) {
        res.status(404).json({
            status: "error",
            message: "找不到分類資料",
            error: error.message
        })
    }
});

// 取得特定課程
router.get("/:id", async (req, res) => {
    const id = req.params.id
    try {
        const [courseResult] = await conn.query("SELECT * FROM courses WHERE id = ? AND status = '1' ", [id]);
        if (courseResult.length === 0) {
            return res.status(404).json({
                status: "error",
                message: "找不到指定課程"
            })
        }

        const course = courseResult[0];
        const [chaptersResult] = await conn.query("SELECT * FROM course_chapters WHERE course_id = ?", [id])

        const [lessonsResult] = await conn.query(`
            SELECT cl.id, cl.chapter_id, cl.name, cl.duration, cl.video_path, cl.preview_videos, cc.course_id
            FROM course_lessons cl
            JOIN course_chapters cc ON cl.chapter_id = cc.id
            WHERE cc.course_id = ?
            ORDER BY cl.chapter_id, cl.id
        `, [id]);

        course.chapters = chaptersResult.map(chapter => ({
            ...chapter,
            lessons: lessonsResult.filter(lesson => lesson.chapter_id === chapter.id)
        }));

        const [tagsResult] = await conn.query(`
            SELECT ct.name
            FROM course_tags cta
            JOIN course_tag ct ON cta.tag_id = ct.id
            WHERE cta.course_id = ?
        `, [id]);
        course.tags = tagsResult.map(tag => tag.name);

        const [imgResult] = await conn.query("SELECT path FROM course_imgs WHERE course_id = ?", [id])
        course.images = imgResult.map(img => img.path)


        res.status(200).json({
            status: "success",
            message: "取得指定課程",
            data: course
        })
    } catch (error) {
        res.status(404).json({
            status: "error",
            message: "找不到指定課程",
            error: error.message
        })
    }
});


// 新增課程
router.post("/", upload.single('img_path'), async (req, res) => {
    const { title, summary, description, tags, chapters, original_price, sale_price } = req.body;
    const img_path = req.files['img_path'] ? req.files['img_path'][0].filename : null;

    if (!title || !summary || !description || !chapters || !img_path || !original_price || !sale_price || !tags || tags.length === 0) {
        return res.status(400).json({
            status: "error",
            message: "所有必填項目皆需填寫"
        });
    }

    if (isNaN(Number(original_price)) || isNaN(Number(sale_price))) {
        return res.status(400).json({
            status: "error",
            message: "價格必須為數字"
        });
    }

    const tagArray = JSON.parse(tags);
    if (tagArray.length === 0) {
        return res.status(400).json({
            status: "error",
            message: "至少要有一個分類標籤"
        });
    }

    try {
        // 插入課程基本信息
        const [courseResult] = await conn.query(
            "INSERT INTO courses (title, summary, description, img_path, original_price, sale_price, created_at) VALUES (?, ?, ?, ?, ?, ?, NOW())",
            [title, summary, description, img_path, original_price, sale_price]
        );

        const courseId = courseResult.insertId;

        // 插入標籤
        for (const tagId of tagArray) {
            await conn.query("INSERT INTO course_tags (course_id, tag_id) VALUES (?, ?)", [courseId, tagId]);
        }

        // 插入章節和課程
        const chaptersArray = JSON.parse(chapters);
        for (let i = 0; i < chaptersArray.length; i++) {
            const chapter = chaptersArray[i];
            const [chapterResult] = await conn.query(
                "INSERT INTO course_chapters (course_id, name) VALUES (?, ?)",
                [courseId, chapter.name]
            );
            const chapterId = chapterResult.insertId;

            for (let j = 0; j < chapter.lessons.length; j++) {
                const lesson = chapter.lessons[j];
                const videoFile = req.files[`video_${i}_${j}`];
                const videoPath = videoFile ? videoFile[0].filename : null;
                await conn.query(
                    "INSERT INTO course_lessons (chapter_id, name, duration, video_path) VALUES (?, ?, ?, ?)",
                    [chapterId, lesson.name, lesson.duration, videoPath]
                );
            }
        }

        res.status(201).json({
            status: "success",
            message: "新增課程成功",
            data: { id: courseId }
        });
    } catch (error) {
        console.error('新增課程失敗:', error);
        res.status(500).json({
            status: "error",
            message: "新增課程失敗",
            error: error.message
        });
    }
});

// 更新特定課程
router.patch("/:id", upload.single('img_path'), async (req, res) => {
    const id = req.params.id;
    const { title, summary, description, original_price, sale_price, tags } = req.body;
    const img_path = req.file ? `${req.file.filename}` : null;

    if (!title || !summary || !description || !original_price || !sale_price || !tags || tags.length === 0) {
        return res.status(400).json({
            status: "error",
            message: "所有必填項目皆需填寫"
        });
    }

    // 驗證欄位
    if (isNaN(Number(original_price)) || isNaN(Number(sale_price))) {
        return res.status(400).json({
            status: "error",
            message: "價格必須為數字"
        });
    }

    const tagArray = Array.isArray(tags) ? tags : tags.split(",").map(tag => tag.trim());
    if (tagArray.length === 0) {
        return res.status(400).json({
            status: "error",
            message: "至少要有一個分類標籤"
        });
    }

    try {
        // 更新課程資料
        const [result] = await conn.query(
            `UPDATE courses 
             SET title = ?, summary = ?, description = ?, img_path = IFNULL(?, img_path), original_price = ?, sale_price = ?, updated_at = NOW() 
             WHERE id = ? AND status = "1" `,
            [title, summary, description, img_path, original_price, sale_price, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                status: "error",
                message: "找不到指定的課程"
            });
        }

        // 先刪除現有的標籤關聯
        await conn.query("DELETE FROM course_tags WHERE course_id = ?", [id]);

        // 再新增新的標籤關聯
        for (const tag of tagArray) {
            await conn.query("INSERT INTO course_tags (course_id, tag_id) VALUES (?, ?)", [id, tag]);
        }

        res.status(200).json({
            status: "success",
            message: "課程更新成功"
        });
    } catch (error) {
        res.status(500).json({
            status: "error",
            message: "更新課程失敗",
            error: error.message
        });
    }
});

// 軟刪除特定課程
router.delete("/:id", async (req, res) => {
    const id = req.params.id;

    try {
        const [result] = await conn.query(
            "UPDATE courses SET updated_at = NOW(),status = '0'  WHERE id = ? AND status = '1'",
            [id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                status: "error",
                message: "找不到指定的課程"
            });
        }

        res.status(200).json({
            status: "success",
            message: "課程已被軟刪除"
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