import express from "express";
import cors from "cors";
import multer from 'multer';
import moment from 'moment';
import { v4 as uuid } from 'uuid';
import conn from "../db.js";
import { resolve } from "path";

const router = express.Router();


router.get("/",async (req, res) => {
   try{
    const [result] = await conn.query("SELECT * FROM courses");
    res.status(200).json({
        status:"success",
        message:"取得所有課程",
        data:result
        
    })

   }catch(error){
    res.status(500).json({
        status:"error",
        message:"找不到課程",
        error:error.message
    })
   }
});


router.get("/detail/:id",async (req, res) => {
    const id = req.params.id
    try{
     const [result] = await conn.query("SELECT * FROM courses WHERE id = ?", [id]);
     res.status(200).json({
         status:"success",
         message:"取得指定課程",
         data:result[0]
     })
    }catch(error){
     res.status(500).json({
         status:"error",
         message:"找不到指定課程",
         error:error.message
     })
    }
 });


export default router;