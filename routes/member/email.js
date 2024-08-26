import express from 'express'
import nodemailer from 'nodemailer'
import jwt from 'jsonwebtoken'
import 'dotenv/config.js'

const router = express.Router()

// 設置 nodemailer 的配置
const transport = {
  host: 'smtp.gmail.com',
  port: 465,
  secure: true, // use TLS
  auth: {
    user: process.env.SMTP_TO_EMAIL,
    pass: process.env.SMTP_TO_PASSWORD,
  },
  tls: {
    servername: 'smtp.gmail.com',
    rejectUnauthorized: false,
  },
}

const transporter = nodemailer.createTransport(transport)

// 驗證連線設定
transporter.verify((error, success) => {
  if (error) {
    console.error('WARN - 無法連線至SMTP伺服器 Unable to connect to the SMTP server.')
  } else {
    console.log('INFO - SMTP伺服器已連線 SMTP server connected.')
  }
})

// 產生驗證 token 的函數
const generateVerificationToken = (userEmail) => {
  return jwt.sign({ email: userEmail }, process.env.JWT_SECRET, { expiresIn: '1h' })
}

// 寄送 email 的路由
router.post('/send', async (req, res) => {
  const { email } = req.body  // 從請求體中取得 email

  // 生成驗證 token
  const verificationToken = generateVerificationToken(email)

  // 設定 mailOptions
  const mailOptions = {
    from: `"support" <${process.env.SMTP_TO_EMAIL}>`,
    to: email,
    subject: '請驗證您的電子郵件',
    text: `請點擊以下連結驗證您的電子郵件：\n\n${process.env.BASE_URL}/verify-email?token=${verificationToken}`
  }

  // 寄送 email
  transporter.sendMail(mailOptions, (err, info) => {
    if (err) {
      return res.status(400).json({ status: 'error', message: err.message })
    } else {
      return res.json({ status: 'success', message: '驗證郵件已寄出，請檢查您的信箱' })
    }
  })
})

// 處理驗證請求的路由
router.get('/verify-email', async (req, res) => {
  const { token } = req.query

  try {
    // 驗證 token
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    const userEmail = decoded.email

    // 在這裡更新用戶的 email 驗證狀態（例如，將資料庫中的 email_verified 設置為 true）
    // 假設有一個 updateUserEmailVerified 的函數
    await updateUserEmailVerified(userEmail)
    
    res.send('Email 驗證成功！')
  } catch (err) {
    res.status(400).send('無效的或過期的驗證連結')
  }
})

export default router
