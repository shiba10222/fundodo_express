  import express from 'express';
  import jwt from 'jsonwebtoken';
  import 'dotenv/config';
  import { OAuth2Client } from 'google-auth-library';
  import conn from '../../db.js';
  import { v4 as uuidv4 } from 'uuid';

  const router = express.Router();

  // Google OAuth2 客戶端設定
  const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

  router.post('/google', async (req, res) => {
    const { token } = req.body; // 前端發送的 Google token

    if (!token) {
      return res.status(400).json({ status: 'error', message: '缺少 Google token' });
    }

    try {
      // 驗證 Google token
      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.GOOGLE_CLIENT_ID,
      });
      const payload = ticket.getPayload();
      const { sub: google_uid, name: displayName, email, picture: photoURL } = payload;

      if (!google_uid) {
        return res.status(400).json({ status: 'error', message: '無效的 Google token' });
      }

      let returnUser = {
        id: 0,
        name: '',
        google_uid: '',
        uuid: '',
        nickname: '',
        user_level: 0,
        avatar_file: '',
        email_verified: 1
      };

      // 檢查資料庫中是否有相同的 google_uid
      const [rows] = await conn.execute('SELECT * FROM users WHERE google_uid = ?', [google_uid]);

      if (rows.length > 0) {
        // 用戶已經存在
        const user = rows[0];
        returnUser = {
          userId: user.id,
          name: user.name || '',
          nickname: user.nickname || '',
          google_uid: user.google_uid,
          uuid: user.uuid,
          user_level: user.user_level || 0,
          avatar_file: user.avatar_file || ''
        };
      } else {
        // 用戶不存在，創建新用戶
        const uuidValue = uuidv4();
        const sql = 'INSERT INTO users (name, email, google_uid, photo_url, uuid, email_verified) VALUES (?, ?, ?, ?, ?, ?)';
        const values = [displayName || '', email || '', google_uid, photoURL || '', uuidValue, 1];
        const [result] = await conn.execute(sql, values);

        returnUser = {
          userId: result.insertId,
          name: displayName || '',
          nickname: '',
          google_uid,
          uuid: uuidValue,
          user_level: 0,
          avatar_file: '',
          email_verified: 1
        };
      }

      // 創建 JWT token
      const accessToken = jwt.sign(returnUser, process.env.JWT_SECRET, {
        expiresIn: '3d',
      });

      // 返回 token 和用戶資訊
      return res.status(200).json({
        status: 'success',
        data: {
          accessToken,
          user: returnUser
        },
      });

    } catch (error) {
      console.error('Server Error:', error);
      res.status(500).json({ status: 'error', message: '伺服器錯誤' });
    }
  });

  export default router;
