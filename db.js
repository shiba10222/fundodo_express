import 'dotenv/config.js'
import mysql from "mysql2/promise";

//! === 公告 ===
//請在自己的電腦以 .env 檔設定以下五項資訊
const conn =  mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    port: process.env.DB_PORT,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
});

export default conn;
