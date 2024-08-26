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

// 定義 email 的寄送伺服器位置
const transport = {
  host: 'smtp.gmail.com',
  port: 465,
  secure: true, // 使用 TLS
  auth: {
    user: process.env.SMTP_TO_EMAIL,
    pass: process.env.SMTP_TO_PASSWORD,
  },
  tls: {
    servername: 'smtp.gmail.com',
    rejectUnauthorized: false,
  },
};

// 創建 nodemailer transporter
const transporter = nodemailer.createTransport(transport);

// 驗證連線設定
transporter.verify((error, success) => {
  if (error) {
    console.error('WARN - 無法連線至SMTP伺服器 Unable to connect to the SMTP server.', error);
  } else {
    console.log('INFO - SMTP伺服器已連線 SMTP server connected.');
  }
});

// 寄送 email 的路由
router.post('/send', upload.none(), async (req, res) => {
  console.log('Received request body:', req.body); // 記錄接收到的請求體

  const { email } = req.body; // 從請求體中獲取郵件地址

  if (!email) {
    return res.status(400).json({ status: 'error', message: '郵件地址未提供' });
  }

  // 生成 JWT 令牌
  const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });

  // 驗證鏈接
  const verificationLink = `${process.env.BASE_URL}/api/member/email/verify-email?token=${token}`;

  const dynamicMailOptions = {
    from: `"support" <${process.env.SMTP_TO_EMAIL}>`,
    to: email,
    subject: '請確認您的郵件地址',
    text: `你好，\r\n請點擊以下鏈接以驗證您的郵件地址: ${verificationLink}\r\n\r\n敬上\r\n開發團隊`,
  };

  console.log('Dynamic mail options:', dynamicMailOptions);

  try {
    await transporter.sendMail(dynamicMailOptions);
    console.log('Email sent successfully.');
    return res.json({ status: 'success', message: 'Email sent successfully' });
  } catch (err) {
    console.error('Error sending email:', err);
    return res.status(500).json({ status: 'error', message: '發送郵件時發生錯誤: ' + err.message });
  }
});

//======== 驗證指定信箱 ==========//
router.get('/verify-email',async (req, res) => {
  const { token } = req.query;

  if (!token) {
    return res.status(400).json({ status: 'error', message: '缺少驗證令牌。' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // 假設你有一個函數來驗證令牌
    console.log('Decoded Token:', decoded);
    const email = decoded.email

    const [users] = await conn.execute('SELECT * FROM users WHERE email = ?', [email]);
    if (users.length === 0) {
      return res.status(400).json({ status: "error", message: "無此用戶" });
    }

    const result = await conn.execute('UPDATE users SET email_verified = 1 WHERE email = ?', [email]);

    if (result[0].affectedRows > 0) {
      // 成功驗證
      res.status(200).json({ status: 'success', message: '電子郵件驗證成功！' });
    } else {
      // 更新失敗，可能是因為用戶已經被驗證過
      res.status(400).json({ status: 'error', message: '驗證令牌無效或用戶已經驗證過。' });
    }
  } catch (err) {
    // 處理錯誤，例如令牌過期
    console.error('Error verifying token:', err);
    res.status(400).json({ status: 'error', message: '驗證令牌過期或無效。' });
  }
});

export default router;
