import mysql from "mysql2/promise";

const conn = await mysql.createConnection({
    host: "localhost",
    user: "admin",
    password: "12345",
    database: "fundodo"
});

export default conn;
