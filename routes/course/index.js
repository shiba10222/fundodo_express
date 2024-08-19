import express from "express";
import conn from "../../db.js";
import multer from 'multer';
import moment from 'moment';
import { v4 as uuid } from 'uuid';

const router = express.Router();


router.get("/", async (req, res) => {
    try {
        const query = `
            SELECT c.*, GROUP_CONCAT(ct.name) AS tags
            FROM courses c
            LEFT JOIN course_tags cta ON c.id = cta.course_id
            LEFT JOIN course_tag ct ON cta.tag_id = ct.id
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


router.get("/detail/:id", async (req, res) => {
    const id = req.params.id
    console.log(id)
    try {

        const [courseResult] = await conn.query("SELECT * FROM courses WHERE id = ?", [id]);
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




router.post("/", async (req, res) => {
    const { id, title, summary, description, img_path, price, viewed_count, created_at, deleted_at } = req.body;
    if (!title || !summary || !description || !img_path || !price) {
        return res.status(400).json({
            status: "error",
            message: "所有項目皆必填"
        })
    }
    try {
        const [result] = await conn.query("INSERT INTO `courses`(`id`, `title`, `summary`, `description`, `img_path`, `price`, , `created_at`) VALUES (?,?,?,?,?,?,?)", []);
        res.status(200).json({
            status: "success",
            message: "新增課程成功",
            data: result

        })

    } catch (error) {
        res.status(400).json({
            status: "error",
            message: "新增課程失敗",
            error: error.message
        })
    }
});


export default router;

