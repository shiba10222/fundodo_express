//! ================== Failed ==================== !//
//綠界的地圖選取器，只給正式環境用
//且自己伺服器的 api 連結必須跟送訂單一樣的打包流程
//因此無法得到使用者選取的結果

import { Router } from 'express'
import cookieParser from 'cookie-parser'
const router = Router()


// const callback_url = "http://localhost:3000/test/ship/callback"

// 註: 本路由與資料庫無關，單純轉向使用
// 使用 API URL：
// https://emap.presco.com.tw/c2cemap.ashx?eshopid=888&servicetype=1&url=http://localhost:3005/api/shipment/711

// POST
router.post('/711', cookieParser(), function (req, res) {
  // res.cookie('ck_name', 'ck_value', { httpOnly: true, sameSite: 'None', secure: true });
  
  console.log("req.body 內 ", req.body)
  console.log("req.cookies 內 ", req.cookies)
  // res.json(req.body)
  // res.redirect(callback_url + '?' + new URLSearchParams(req.body).toString())
  res.status(200).send('OK');
})

export default router
