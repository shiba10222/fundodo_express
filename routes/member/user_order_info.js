import express from 'express';
import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';
import 'dotenv/config';
import multer from 'multer';
import conn from '../../db.js';

// 創建 express 路由
const router = express.Router();

// upload 設定
const upload = multer();

// 新增一個API端點來處理前端的驗證請求
router.get('/:id', async (req, res) => {
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ status: 'error', message: '缺少必要資訊。' });
    }

    try {
        const [users] = await conn.execute('SELECT * FROM user_order_info WHERE user_id = ?', [id]);
        // 這裡可以再次驗證token，或者直接返回成功
        if (users.length === 0) {
            // 用戶不存在
            return res.status(401).json({ status: 'fail', message: '查無用戶訂單資料' });
        }
        // 返回查詢結果
        res.status(200).json({
            status: 'success',
            message: '查詢成功',
            result: users[0]
        });
    } catch (err) {
        console.error('資料庫查詢錯誤：', err);
        res.status(500).json({ status: 'error', message: '資料庫查詢錯誤', error: err.message });
    }
});

export default router;