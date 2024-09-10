import { Router } from 'express'
import 'dotenv/config.js'

import HmacSHA256 from "crypto-js/hmac-sha256.js";
import Base64 from 'crypto-js/enc-base64.js'
import { v4 as uuid4 } from 'uuid'
import { res200Json } from '../lib/common/response.js';
import axios from 'axios';
import multer from 'multer';

const router = Router();
const upload = multer();

const idDev = true;
/** LINEPAY API URL 的前半段 */
const LINE_API_SITE = `https://${idDev ? "sandbox" : ""}-api-pay.line.me/v3`;

router.post('/', upload.none(), async (req, res, next) => {
  // 簡單檢驗是否有資料
  const { orderPkg } = req.body;

  // console.log(orderPkg);

  //=== 把 order 資料打包成 line pay 需要的格式
  //todo: 把 order 資料打包成 line pay 需要的格式

  const packages = [];

  //=== 從環境變數取出重要參數
  const {
    LINEPAY_URI,
    LINE_PAY_CHANNEL_ID,
    LINE_PAY_CHANNEL_SECRET,
    LINEPAY_RETURN_CONFIRM_URL,
    LINEPAY_RETURN_CANCEL_URL
  } = process.env;


  //=== 設置轉址的路由
  const redirectUrls = {
    confirmUrl: LINEPAY_RETURN_CONFIRM_URL,
    cancelUrl: LINEPAY_RETURN_CANCEL_URL
  };

  const linePayBody = {
    ...orderPkg,
    currency: 'TWD',
    packages,
    redirectUrls
  };

  /** 一次性隨機數 as 加密用加料字串
    * 官方表示可使用 uuid 生成
    */
  const NONCE = uuid4();

  //=== 打包成加密簽章
  const requestArr = [
    LINE_PAY_CHANNEL_SECRET,
    '/v3',
    LINEPAY_URI,
    JSON.stringify(linePayBody),
    NONCE
  ];

  //HmacSHA256 輸出的型別為物件
  const infoStr = HmacSHA256(requestArr.join(''), LINE_PAY_CHANNEL_SECRET);
  /** 加密過的 hmac 簽章 */
  const signature = Base64.stringify(infoStr);

  //=== 打包成要符合 LINEPAY API 要求的 Headers

  /** LINE Pay APIs認證的通用標頭（Header） */
  const headers = {
    'Content-Type': 'application/json',
    'X-LINE-ChannelId': LINE_PAY_CHANNEL_ID,
    'X-LINE-Authorization-Nonce': NONCE,
    'X-LINE-Authorization': signature
  }


  //=== 呼叫 LINEPAY API
  const LINE_API_URL = `${LINE_API_SITE}/${LINEPAY_URI}`;
  const responseFromLINEPAY = await axios.post(
    LINE_API_URL,
    linePayBody,
    { headers }
  ).catch(err => next(err));

  // console.log(responseFromLINEPAY);

  res.status(200).json({
    status: "success",
    message: "成功",
    result: responseFromLINEPAY.data
  });
});

export default router;