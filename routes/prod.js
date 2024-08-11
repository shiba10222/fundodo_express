import { Router } from "express";
import multer from "multer";
import conn from '../db.js'
const router = Router();
const defaultData = [];
// const db = new Low(new JSONFile("./data.json"), defaultData);
// await db.read();

router.get("/prod",async (req, res) => {
  const [rows] = await conn.query(
    "SELECT product.name"
  )
});

// router.get("/prod", (req, res) => {
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
//   res.status(200).json({
//     status: "success",
//     message: "找到全部商品!",
//     allProducts,
//   });
// });

//================== 匯出
export default router;