import { Router } from 'express';
import multer from 'multer';
import moment from 'moment';
import jwt from 'jsonwebtoken';
import { v4 as uuid } from 'uuid';
import { resolve } from "path";
import express from "express";
import conn from "../db.js";


const router = express.Router();

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

export default router;


