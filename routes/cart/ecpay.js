import { Router } from 'express';
import dotenv from 'dotenv';
import multer from 'multer';
import { getTradeNo, CheckMacValueGen } from './pay-lib/ecpay-lib.js';

// 以下範例參考綠界提供的 SDK

// 模組物件
const router = Router();
const upload = multer();
dotenv.config();

// 參數
const { EC_MERCHANTID } = process.env;

//======================改以下參數即可========================
//一、選擇帳號，是否為測試環境
let isStage = true // 測試環境 | true ; 正式環境 | false

//二、輸入參數
//* 接受購物車資料
const TradeDesc = '商店線上付款'
const ItemName = '翻肚肚商城購買訂單一筆'
//  POST API 回來伺服器，但是要有公開網域的伺服器才能用
const ReturnURL = 'https://www.ecpay.com.tw'
const ClientBackURL = 'http://localhost:3000/buy/return' //前端成功頁面
/* https://ithelp.ithome.com.tw/articles/10230353 */
const ChoosePayment = 'ALL'

//======================以下參數不用改========================
const stage = isStage ? '-stage' : ''
const API_URL = `https://payment${stage}.ecpay.com.tw/Cashier/AioCheckOut/V5`

//===函數

//====================== 路由本體 ========================//
router.post('/', upload.none(), function (req, res) {
  const AMOUNT = req.body.amount;

  //* 生成這筆交易的 ID
  const MerchantTradeDate = new Date().toLocaleString('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
    timeZone: 'UTC',
  });
  const MerchantTradeNo = getTradeNo(MerchantTradeDate);

  //* 計算 CheckMacValue 的前置作業
  let ParamsBeforeCMV = {
    MerchantID: EC_MERCHANTID,
    MerchantTradeNo: MerchantTradeNo,
    MerchantTradeDate: MerchantTradeDate,
    PaymentType: 'aio',
    EncryptType: 1,
    TotalAmount: AMOUNT,
    TradeDesc: TradeDesc,
    ItemName: ItemName,
    ReturnURL: ReturnURL,
    ChoosePayment: ChoosePayment,
    ClientBackURL,
  }

  //* 計算 CheckMacValue
  const algorithm = 'sha256'
  const digest = 'hex'
  const CheckMacValue = CheckMacValueGen(ParamsBeforeCMV, algorithm, digest)
  //* 將所有的參數製作成 payload
  const AllParams = { ...ParamsBeforeCMV, CheckMacValue };
  // const inputArr = Object.entries(AllParams).map((param) => {
  //   return `<input name="${param[0]}" value="${param[1].toString()}"><br/>`
  // });

  res.status(200).json({
    status: 'OK',
    message: '處理完成',
    package: {
      apiURL: API_URL,
      inputArr: Object.entries(AllParams),
    },
  });

  //==== 自動送出表單給綠界
  // res.send(`
  //   <!DOCTYPE html>
  //   <html lang="zh-Hant-tw">
  //   <head>
  //     <title>轉址中</title>
  //   </head>
  //   <body>
  //     <form method="post" action="${APIURL}">
  //       ${inputs}
  //       <input type="submit" value="送出參數" style="display:none">
  //     </form>
  //   <script>
  //     document.forms[0].submit();
  //   </script>
  //   </body>
  //   </html>
  // `)
});

//================== 匯出
export default router;