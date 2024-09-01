import { Router } from 'express';
import multer from 'multer';
import moment from 'moment';
import jwt from 'jsonwebtoken';
import { v4 as uuid } from 'uuid';
import { resolve } from "path";
import express from "express";
import conn from "../db.js";
import path from 'path';
import { fileURLToPath } from 'url';
import { rename } from 'fs/promises';

//將後端圖片傳到前端
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = Router();
// const upload = multer();


//顯示圖片
router.use('/images', express.static(path.join(__dirname, '..', 'public/hotelPic/pic')));


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


// 新增旅館(一張照片)

// 設置 multer 儲存設定
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/hotelPic/pic/') // 確保這個目錄存在
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)) // 給檔案一個唯一的名稱
  }
});

const upload = multer({ storage: storage });

// 處理圖片上傳的路由
router.post('/upload', upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ status: 'error', message: '沒有檔案被上傳' });
  }
  res.json({ status: 'success', path: req.file.filename });
});

// 原有的新增旅館路由
router.post("/", async (req, res) => {
  const {
    name, description, address, price_s, price_m, price_l,
    service_food, service_bath, service_live_stream, service_playground,
    main_img_path
  } = req.body;

  // 驗證必填項目
  if (!name || !description || !address || !price_s || !price_m || !price_l || !main_img_path) {
    return res.status(400).json({
      status: "error",
      message: "尚有選項未填寫"
    });
  }

  try {
    // 插入數據
    const [result] = await conn.query(
      "INSERT INTO `hotel`(`name`, `description`, `address`, `price_s`, `price_m`,`price_l`,`service_food`,`service_bath`,`service_live_stream`,`service_playground`,`main_img_path`,`created_at`) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)",
      [
        name, description, address, price_s, price_m, price_l,
        service_food, service_bath, service_live_stream, service_playground,
        main_img_path,new Date()
      ]
    );

    // 返回成功訊息
    res.status(200).json({
      status: "success",
      message: "新增旅館成功",
      data: result
    });
  } catch (error) {
    console.error('發生錯誤:', error);
    res.status(500).json({ 
      status: "error",
      message: error.message || '發生內部服務器錯誤' 
    });
  }
});





//更新圖片 測試

const uploadMultiple = upload.array('images', 3);
router.put("/:id/update-images", uploadMultiple, async (req, res) => {
const { id } = req.params;
if (!req.files || req.files.length === 0) {
return res.status(400).json({ status: 'error', message: '沒有檔案被上傳' });
 }

 try {
    // 獲取當前的 main_img_path
    const [currentImages] = await conn.query(
      "SELECT main_img_path FROM hotel WHERE id = ?",
      [id]
    );

    let currentImageArray = currentImages[0].main_img_path ? currentImages[0].main_img_path.split(',') : [];

    // 更新圖片數組
    req.files.forEach((file, index) => {
      if (index < 3) { // 確保只處理最多3張圖片
        if (currentImageArray[index]) {
          currentImageArray[index] = file.filename; // 替換現有圖片
        } else {
          currentImageArray.push(file.filename); // 添加新圖片
        }
      }
    });

    // 將數組轉換為逗號分隔的字符串
    const updatedMainImagePath = currentImageArray.join(',');

    // 更新數據庫
    await conn.query(
      "UPDATE hotel SET main_img_path = ? WHERE id = ?",
      [updatedMainImagePath, id]
    );

    res.json({
      status: 'success',
      message: '圖片已成功更新',
      updatedImages: currentImageArray
    });
  } catch (error) {
    console.error('Error updating images:', error);
    res.status(500).json({ status: 'error', message: '更新圖片時發生錯誤' });
  }
});





// 更新旅館
router.put("/:id", upload.none(), async (req, res) => {
  const { id } = req.params;
  const {
    location_id,
    name,
    description,
    address,
    Latitude,
    Longitude,
    main_img_path,
    price_s,
    price_m,
    price_l,
    service_food,
    service_bath,
    service_live_stream,
    service_playground,
    valid
  } = req.body;

  let isNotOK = false;
  ['name', 'description', 'address', 'price_s', 'price_m', 'price_l'].forEach(property => {
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
    // 更新數據
    const [result] = await conn.query(
      "UPDATE `hotel` SET `name`=?, `description`=?, `address`=?, `price_s`=?, `price_m`=?, `price_l`=?, `service_food`=?, `service_bath`=?, `service_live_stream`=?, `service_playground`=?, `valid`=?,`created_at`=? WHERE `id`=?",
      [
        name,
        description,
        address,
        price_s,
        price_m,
        price_l,
        service_food,
        service_bath,
        service_live_stream,
        service_playground,
        valid,
        new Date(),
        id
      ]
    );
    // 返回成功訊息
    res.status(200).json({
      status: "success",
      message: "更新旅館成功",
      data: result
    });
  } catch (error) {
    console.error('發生錯誤:', error);
    console.error('錯誤詳情:', error.stack);
    res.status(500).json({ error: '發生內部服務器錯誤' });
  }
});





//刪除旅館
router.delete("/:id", async (req, res, next) => {
  const id = req.params.id;

  try {
    const [result] = await conn.query(
      "DELETE FROM hotel WHERE `hotel`.`id` = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        status: "error",
        message: "找不到指定的旅館"
      });
    }

    res.status(200).json({
      status: "success",
      message: "旅館已被刪除"
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "刪除旅館失敗",
      error: error.message
    });
  }

});



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


