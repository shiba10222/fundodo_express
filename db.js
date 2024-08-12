import mysql from "mysql2/promise";

//!重要：請將所使用的資料庫按以下設定
//資料庫名稱: fundodo
//使用者帳號: fundodo
//使用者密碼: fdd12345
const conn = await mysql.createConnection({
    host: "localhost",
    user: "admin",
    password: "12345",
    database: "fundodo_prod"
});

export default conn;
