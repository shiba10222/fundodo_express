import nodemailer from 'nodemailer';
import 'dotenv/config';

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_TO_EMAIL,
    pass: process.env.SMTP_TO_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false, // 不驗證伺服器的證書
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.error('WARN - 無法連線至SMTP伺服器 Unable to connect to the SMTP server.', error);
  } else {
    console.log('INFO - SMTP伺服器已連線 SMTP server connected.');
  }
});

export default transporter;