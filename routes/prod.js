import express from "express";
import multer from "multer";
import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";
import cors from "cors";

const app = express();
const defaultData = [];
const db = new Low(new JSONFile("./data.json"), defaultData);
await db.read();

app.use(
  cors({
    origin: "http://localhost:3000", // 前端應用的 URL
    methods: ["GET", "POST"],
    credentials: true,
  })
);

app.get("/", (req, res) => {
  res.send("首頁");
});

app.get("/api/prod", (req, res) => {
  let allProducts = db.data.map((p) => {
    const { name, priceArr, picNameArr } = p;

    return { name, priceArr, picNameArr };
  });
  if (!allProducts) {
    return res.status(404).json({
      status: "fail",
      message: "找不到商品",
    });
  }
  res.status(200).json({
    status: "success",
    message: "找到全部商品!",
    allProducts,
  });
});

app.all("*", (req, res) => {
  res.send("<h1>404 找不到</h1>");
});

app.listen(3005, () => {
  console.log(`服務已啟動於 http://localhost:3005`);
});
