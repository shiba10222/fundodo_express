import { Router } from 'express';
import multer from 'multer';
import conn from '../../db.js';

//================== 初始化
const router = Router();
const upload = multer();

//==================================================
//================== 設置路由架構 ====================
//==================================================
//================== 路由之根
router.get('/', (req, res) => {
  res.status(400).json({
    status: "Bad Request",
    message: "尼豪，歡迎乃到本區域。要使用服務請輸入更完整的路由網址"
  });
});

//================== 路由之根
router.post('/', upload.none(), (req, res) => {
  ['']





  res.status(400).json({
    status: "Bad Request",
    message: "尼豪，歡迎乃到本區域。要使用服務請輸入更完整的路由網址"
  });
});

//======== handle 404
router.all('*', (req, res) => {
  res.status(404).json({
    status: "success",
    message: "喔不！迷有諸葛網址。請修正尼要使用的路由網址"
  });
});

//================== 匯出
export default router;