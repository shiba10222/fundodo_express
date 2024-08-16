import { Router } from 'express';
import conn from "../../db.js";
import readPD from './get-for-user/read-prod.js'
import readCR from './get-for-user/read-crs.js';
import readHT from './get-for-user/read-hotel.js';

// 參數
const envMode = process.argv[2];//dev or dist

// 模組物件
const router = Router();

//==================================================
//================== 設置路由架構 ====================
//==================================================

//======== 讀取全部 ==========//

router.get('/', (req, res) => {
  res.status(400).send({ status: "Bad Request", message: '欲使用購物車查詢系統，請輸入正確的路由' });
});


//======== 讀取指定 ==========//
//【核心功能】使用者的購物車內容
//* test uid = 59
router.get('/:uid', async (req, res) => {
  const uid = Number(req.params.uid);

  //== 1 ==== 查詢 cart_PD ==========================
  const [rows_cart] = await conn.query(
    `SELECT * FROM cart WHERE user_id = ?`,
    [uid]
  );

  if (rows_cart.length === 0) return null;
  //== 2 ==== 打包三種資料 =================================
  const pkgPD = rows_cart.filter(d => d.buy_sort === 'PD');
  const rows_PD = pkgPD.length === 0 ? null : await readPD(pkgPD);

  const pkgCR = rows_cart.filter(d => d.buy_sort === 'CR');
  const rows_CR = pkgCR.length === 0 ? null : await readCR(pkgCR);

  const pkgHT = rows_cart.filter(d => d.buy_sort === 'HT');
  const rows_HT = pkgHT.length === 0 ? null : await readHT(pkgHT);

  //== 3 ==== 組合三包資料 ==========================
  let result = {
    PD: rows_PD,
    CR: rows_CR,
    HT: rows_HT,
  };
  res.status(200).json({ status: "success", message: "查詢成功", result });
});



//======== handle 404

router.all("*", (req, res) => {
  res.send('Send Tree Pay: 404');
})

//================== 匯出
export default router;