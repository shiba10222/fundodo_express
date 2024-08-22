import { Router } from 'express';
import multer from 'multer';
import moment from 'moment';
import jwt from 'jsonwebtoken';
import { v4 as uuid } from 'uuid';
import { resolve } from "path";
import express from "express";
import conn from "../db.js";
import path from 'path';


const router = express.Router();
const upload = multer();

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

//fetch 城市
router.get("/cities", async (req, res) => {
  try {
    const [result] = await conn.query(
      `SELECT id, name FROM tw_citys`
    );
    res.json({ status: 'success', data: result });
  } catch (error) {
    res.status(500).json({ status: 'error', message: 'Database query failed' });
  }
});




// 新增旅館

router.post("/", upload.none(), async (req, res) => {

  const {
    id,
    location_id,
    name, description,
    address,
    Latitude, Longitude,
    main_img_path,
    price_s, price_m, price_l,
    service_food, service_bath, service_live_stream, service_playground
  } = req.body;

  let isNotOK = false;
  ['name', 'description', 'address', 'price_s', 'price_m','price_l'].forEach(property => {
    if (Object.prototype.hasOwnProperty.call(req.body, property) === false) {
      res.status(400).json({ status: "failure", message: `格式錯誤，旅館類必須包含 ${property} 參數` });
      isNotOK = true;
      return;
    }
  });
  if (isNotOK) return;


  // 驗證必填項目
  if (!name || !description || !address || !price_s || !price_m || !price_l) {

    return res.status(400).json({
      status: "error",
      message: "所有項目皆必填"
    });
  }

  try {
    // 插入數據
    const [result] = await conn.query(
      "INSERT INTO `hotel`(`name`, `description`, `address`, `price_s`, `price_m`,`price_l`,`service_food`,`service_bath`,`service_live_stream`,`service_playground`,`created_at`) VALUES (?,?,?,?,?,?,?,?,?,?,?)",
      [
        name,
        description,
        address,
        price_s, price_m, price_l,
        service_food, service_bath, service_live_stream, service_playground,
        new Date()]
    );

    // 返回成功訊息
    res.status(200).json({
      status: "success",
      message: "新增旅館成功",
      data: result
    });

  } catch (error) {
    console.error('發生錯誤:', error);
    console.error('錯誤詳情:', error.stack);
    res.status(500).json({ error: '發生內部服務器錯誤' });
  }
});


// 修改單一旅館
router.put("/detail/:id", async (req, res) => {
})







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


