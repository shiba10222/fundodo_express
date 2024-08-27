import { Router } from 'express';
import crypto from 'crypto'
import dotenv from 'dotenv';
import multer from 'multer';

// 綠界提供的 SDK
// import ecpay_payment from 'ecpay_aio_nodejs';

// 模組物件
const router = Router();
const upload = multer();
dotenv.config();

// 參數
// const { MERCHANTID, HASHKEY, HASHIV } = process.env;
const MERCHANTID = "3002607";
const HASHKEY = "pwFHCqoQZGmho4w6";
const HASHIV = "EkRm7iFT261dpevs";

//======================改以下參數即可========================
//一、選擇帳號，是否為測試環境
let isStage = true // 測試環境： true；正式環境：false

//二、輸入參數
//todo for test
const TotalAmount = 1850
//* 接受購物車資料
const TradeDesc = '商店線上付款'
const ItemName = '翻肚肚商城購買訂單一筆'
const ReturnURL = 'https://www.ecpay.com.tw'
const OrderResultURL = 'http://localhost:3000/buy/return' //前端成功頁面
const ChoosePayment = 'ALL'

//======================以下參數不用改========================
const stage = isStage ? '-stage' : ''
const APIURL = `https://payment${stage}.ecpay.com.tw//Cashier/AioCheckOut/V5`

//===函數
/**
 * 生成 20 碼的交易識別用編號
 * @description fundodo 加上函數執行時間而成的字串
 * 請用 toLocaleString('zh-TW')
 * @param {string} 
 * @returns {string} 
 */
const getTradeNo = (timeStr) => {
  const strArr = timeStr.split(' ');
  return 'fdd' + strArr[0].replaceAll('/', '') + strArr[1].replaceAll(':', '');
}

function CheckMacValueGen(parameters, algorithm, digest) {
  /**
   * 
   * @param {string} string 
   * @returns 
   */
  function DotNETURLEncode(string) {
    const list = {
      '%2D': '-',
      '%5F': '_',
      '%2E': '.',
      '%21': '!',
      '%2A': '*',
      '%28': '(',
      '%29': ')',
      '%20': '+',
    }
    Object.entries(list).forEach(([encoded, decoded]) => {
      const regex = new RegExp(encoded, 'g')
      string = string.replace(regex, decoded)
    })
    return string
  }
  const Step0 = Object.entries(parameters)
    .map(([key, value]) => `${key}=${value}`)

  const Step1 = Step0
    .sort((a, b) => {
      const keyA = a.split('=')[0]
      const keyB = b.split('=')[0]
      return keyA.localeCompare(keyB)
    })
    .join('&')
  const Step2 = `HashKey=${HASHKEY}&${Step1}&HashIV=${HASHIV}`
  const Step3 = DotNETURLEncode(encodeURIComponent(Step2))
  const Step4 = Step3.toLowerCase()
  const Step5 = crypto.createHash(algorithm).update(Step4).digest(digest)
  const Step6 = Step5.toUpperCase()
  return Step6
}

//====================== 路由本體 ========================//
router.get('/', upload.none(), function (req, res, next) {
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
    MerchantID: MERCHANTID,
    MerchantTradeNo: MerchantTradeNo,
    MerchantTradeDate: MerchantTradeDate,
    PaymentType: 'aio',
    EncryptType: 1,
    TotalAmount: TotalAmount,
    TradeDesc: TradeDesc,
    ItemName: ItemName,
    ReturnURL: ReturnURL,
    ChoosePayment: ChoosePayment,
    OrderResultURL,
  }

  //* 計算 CheckMacValue
  const algorithm = 'sha256'
  const digest = 'hex'
  const CheckMacValue = CheckMacValueGen(ParamsBeforeCMV, algorithm, digest)

  //* 將所有的參數製作成 payload
  const AllParams = { ...ParamsBeforeCMV, CheckMacValue }
  console.log(AllParams);
  const inputs = Object.entries(AllParams).map((param) => {
    console.log(param);
    return `<input name=${param[0]} value="${param[1].toString()}"><br/>`
  }).join('')

  //* 自動送出表單給綠界
  res.send(`
    <!DOCTYPE html>
    <html lang="zh-Hant-tw">
    <head>
      <title>轉址中</title>
    </head>
    <body>
      <form method="post" action="${APIURL}">
        ${inputs}
        <input type="submit" value="送出參數" style="display:none">
      </form>
    <script>
      document.forms[0].submit();
    </script>
    </body>
    </html>
  `)
});


//================== 匯出
export default router;