import express from "express";
const router = express.Router();
import conn from "../../db.js";
import multer from 'multer';
import moment from 'moment';
import { v4 as uuid } from 'uuid';


router.get("/", async (req, res) => {
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


export default router;