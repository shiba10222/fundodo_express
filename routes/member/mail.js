import { Router } from 'express';
import transporter from '../../configs/gmail.js';
const router = Router();

// 定義你的路由
router.post('/send', async (req, res) => {
  try {
    // 使用 transporter 來發送郵件
    await transporter.sendMail({
      from: 'your-email@example.com',
      to: 'recipient@example.com',
      subject: 'Hello',
      text: 'Hello world',
    });
    res.status(200).json({ status: 'success', message: 'Email sent successfully' });
  } catch (error) {
    res.status(500).json({ status: 'error', message: error.message });
  }
});

export default router;