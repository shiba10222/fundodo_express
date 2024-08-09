import { Router } from "express";
import multer from "multer";

const router = Router();
const defaultData = [];
// const db = new Low(new JSONFile("./data.json"), defaultData);
// await db.read();

router.get("/", (req, res) => {
  res.send("首頁");
});

router.get("/prod", (req, res) => {
  // let allProducts = db.data.map((p) => {
  //   const { name, priceArr, picNameArr } = p;

  //   return { name, priceArr, picNameArr };
  // });
  // if (!allProducts) {
  //   return res.status(404).json({
  //     status: "fail",
  //     message: "找不到商品",
  //   });
  // }
  res.status(200).json({
    status: "success",
    message: "找到全部商品!",
    allProducts,
  });
});

//================== 匯出
export default router;