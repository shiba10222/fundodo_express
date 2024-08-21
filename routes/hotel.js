import { Router } from 'express';
import multer from 'multer';
import moment from 'moment';
import jwt from 'jsonwebtoken';
import { v4 as uuid } from 'uuid';
import { resolve } from "path";
import express from "express";
import conn from "../db.js";


const router = express.Router();

//fetch 全部旅館
router.get("/", async (req, res) => {
  try {
    const [result] = await conn.query(
      ` SELECT h.*, GROUP_CONCAT(hi.path) AS images
      FROM hotel h
      LEFT JOIN hotel_img hi ON h.id = hi.hotel_id
      GROUP BY h.id`
    );
    
    res.status(200).json({
      status: "success",
      message: "取得所有旅館",
      data: result

    })

  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "找不到旅館",
      error: error.message
    })
  }
});

//fetch 單一旅館
router.get("/detail/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const [result] = await conn.query(
      `
     SELECT h.*, GROUP_CONCAT(hi.path) AS images
    FROM hotel h
    LEFT JOIN hotel_img hi ON h.id = hi.hotel_id
    WHERE h.id = ?
    GROUP BY h.id
  `, [id]);
    
    if (result.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "找不到指定旅館~",
        data: allHotels, 
      });
    }

    res.status(200).json({
      status: "success",
      message: "已找到指定旅館",
      data: result[0]
    });
  } catch (error) {
    console.error("找不到指定旅館", error);
    res.status(500).json({
      status: "error",
      message: "伺服器錯誤",
      error: error.message
    });
  }
});

// 新增單一旅館
// router.post("/add", async (req, res) => {
//   try {
//     const  id,location_id,name,description,address,Latitude,Longitude,main_img_path,price_s,price_m,price_l,service_food,service_bath,service_live_stream": 1,
//     "service_playground": 1,
//     "created_at": "2022-04-18T00:53:50.000Z",
//     "valid": 1,
//     "images": "HT0000201.jpg,HT0000202.jpg,HT0000203.jpg"
//   }
// })

// // 修改單一旅館
// router.post("/detail/:id", async (req, res) => {
// })







//fetch 購物車
router.post("/cart", async (req, res) => {
  try {
    const {
      user_id,
      dog_id,
      buy_sort,
      buy_id,
      amount,
      room_type,
      check_in_date,
      check_out_date
    } = req.body;

  // 驗證必要欄位
  if (!user_id || !buy_sort || !buy_id || !amount || !room_type || !check_in_date || !check_out_date) {
    return res.status(400).json({
      status: "error",
      message: "缺少必要欄位"
    });
  }

   // 插入資料到購物車表
   const [result] = await conn.query(
    `INSERT INTO cart (user_id, dog_id, buy_sort, buy_id, amount, room_type, check_in_date, check_out_date)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [user_id, dog_id, buy_sort, buy_id, amount, room_type, check_in_date, check_out_date]
  );
 

  //返回模擬的成功fetch
  res.status(201).json({
    status: "success",
    message: "成功添加到購物車",
    data: { id: result.insertId }
  });
} catch (error) {
  console.error("添加到購物車時出錯", error);
  res.status(500).json({
    status: "error",
    message: "伺服器錯誤",
    error: error.message
  });
}
});


export default router;


