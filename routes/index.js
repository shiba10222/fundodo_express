import express from "express";

const app = express();

app.get("/", (req, res) => {
    res.send("首頁");
});
app.all("*", (req, res) => {
    res.send("<h1>404 找不到</h1>");
});
app.listen(3000, () => {
    console.log(`服務已啟動於 http://localhost:3005`);
});