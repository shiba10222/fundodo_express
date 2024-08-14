import express from "express";
import conn from "../db.js";
import cors from "cors";
import multer from 'multer';
import moment from 'moment';
import { v4 as uuid } from 'uuid';
import { resolve } from "path";

const router = express.Router();


router.get("/", async (req, res) => {
    try {
        const [result] = await conn.query("SELECT * FROM courses");
        res.status(200).json({
            status: "success",
            message: "取得所有課程",
            data: result

        })

    } catch (error) {
        res.status(404).json({
            status: "error",
            message: "找不到課程",
            error: error.message
        })
    }
});


router.get("/detail/:id", async (req, res) => {
    const id = req.params.id
    console.log(id)
    try {
        const [result] = await conn.query("SELECT * FROM courses WHERE id = ?", [id]);
        // const [result1] = await conn.query("SELECT * FROM courses WHERE id = ?", [id]);
        // const [result2] = await conn.query("SELECT * FROM courses WHERE id = ?", [id]);




        res.status(200).json({
            status: "success",
            message: "取得指定課程",
            data: result[0]
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
        const [result] = await conn.query("INSERT INTO `courses`(`id`, `title`, `summary`, `description`, `img_path`, `price`, , `created_at`) VALUES (?,?,?,?,?,?,?)",[]);
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

