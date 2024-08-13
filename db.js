import mysql from "mysql2/promise";
import 'dotenv/config.js'

//!重要：請將所使用的資料庫按以下設定
//資料庫名稱: fundodo
//使用者帳號: fundodo
//使用者密碼: fdd12345
const conn = await mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    port: process.env.PORT,
    password: process.env.PASSWORD,
    database: process.env.DATABASE
});

export default conn;
