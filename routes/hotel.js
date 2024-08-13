import express from "express";
import cors from "cors";
import multer from 'multer';
import moment from 'moment';
import { v4 as uuid } from 'uuid';
import conn from "../db.js";
import { resolve } from "path";



router.get("/",async (req, res) => {
  try{
   const [result] = await conn.query("SELECT * FROM hotel");
   res.status(200).json({
       status:"success",
       message:"取得所有旅館",
       data:result
       
   })

  }catch(error){
   res.status(500).json({
       status:"error",
       message:"找不到旅館",
       error:error.message
   })
  }
});
