import { Router } from "express";
import multer from "multer";
// import conn from '../db.js';
import {Low} from "lowdb";
import { JSONFile } from "lowdb/node";
import {resolve} from 'path';

const filePath = resolve(import.meta.dirname, "../data/prod/newProduct.json");
const router = Router();
const defaultData = [];
const db = new Low(new JSONFile(filePath), defaultData);
await db.read();

// console.log(db.data);


router.get("/", (req, res) => {
  let allProducts = db.data.map((p) => {
    const { id, name, priceArr, picNameArr } = p;

    return { id, name, priceArr, picNameArr };
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

router.get("/detail/:id", (req, res)=>{
  const id = req.params.id
  let product = db.data.find((p, i)=>p.id == id)
  if(!product){
    res.status(404).json({
      status:"fail",
      message:"找不到商品"
    })
    return
  }
  res.status(200).json({
    status: "success",
    message: "找到指定的商品了!",
    product
  });
})

//================== 匯出
export default router;