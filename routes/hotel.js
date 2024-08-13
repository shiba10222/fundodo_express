import { Router } from 'express';
import multer from 'multer';
import moment from 'moment';
import jwt from 'jsonwebtoken';
import { v4 as uuid } from 'uuid';
import { resolve } from "path";
import express from "express";
import conn from "../db.js";


const router = express.Router();


router.get("/detail/:id", async (req, res) => {
  try {
    const id = req.params.id;
    // 假設您使用某種數據庫連接 (如 conn)
    const [result] = await conn.query("SELECT * FROM hotel WHERE id = ?", [id]);
    
    if (result.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "找不到指定旅館"
      });
    }

    res.status(200).json({
      status: "success",
      message: "已找到指定旅館",
      data: result[0]
    });
  } catch (error) {
    console.error("Error fetching hotel details:", error);
    res.status(500).json({
      status: "error",
      message: "伺服器錯誤",
      error: error.message
    });
  }
});

export default router;