import mysql from "mysql2/promise";
import 'dotenv/config.js'

//!重要：請將所使用的資料庫按以下設定
//資料庫名稱: fundodo
//使用者帳號: fundodo
//使用者密碼: fdd12345
const conn = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    port: process.env.DB_PORT,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
});

export default conn;
