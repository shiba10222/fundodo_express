import { createLinePayClient } from 'line-pay-merchant'
import { Router } from 'express'
import 'dotenv/config.js'
import multer from 'multer';
import { res200Json } from '../lib/common/response.js';
import { v4 as uuid4 } from 'uuid'

const router = Router();
const upload = multer();

const idDev = true;
/** LINEPAY API URL 的前半段 */
const LINE_API_URL = `https://${idDev ? "sandbox" : ""}-api-pay.line.me/v3`;

// 定義安全的私鑰字串
const linePayClient = createLinePayClient({
  channelId: process.env.LINE_PAY_CHANNEL_ID,
  channelSecretKey: process.env.LINE_PAY_CHANNEL_SECRET,
  env: process.env.NODE_ENV,
});

// 從前台接收訂單內容
// 訂單總金額、訂單商品細節
// 參考 https://pay.line.me/jp/developers/apis/onlineApis?locale=zh_TW
// 當中 Request API 的格式說明
// 以打包出 requset body
router.post('/', upload.none(), (req, res) => {
  //todo uid

  //產生 orderId與packageId
  const orderId = uuid4()
  const packageId = uuid4()

  const order = {
    orderId: orderId,
    currency: 'TWD',
    amount: req.body.amount,
    packages: [
      {
        id: packageId,
        amount: req.body.amount,
        products: req.body.products,
      },
    ],
    options: { display: { locale: 'zh_TW' } },
  }

  const dbOrder = {
    id: orderId,
    user_id: userId,
    amount: req.body.amount,
    status: 'pending', // 'pending' | 'paid' | 'cancel' | 'fail' | 'error'
    order_info: JSON.stringify(order), // 要傳送給line pay的訂單資訊
  }

  //todo 儲存 dbOrder 到資料庫

  res200Json(res, 'OK', order);
});

//todo 以下待研究
// 重新導向到line-pay，進行交易(純導向不回應前端)
// 資料格式參考 https://enylin.github.io/line-pay-merchant/api-reference/request.html#example
router.get('/reserve', async (req, res) => {
  if (!req.query.orderId) {
    return res.json({ status: 'error', message: 'order id不存在' })
  }

  const orderId = req.query.orderId

  // 設定重新導向與失敗導向的網址
  const redirectUrls = {
    confirmUrl: process.env.LINEPAY_RETURN_CONFIRM_URL,
    cancelUrl: process.env.LINEPAY_RETURN_CANCEL_URL,
  }

  // 從資料庫取得訂單資料
  const orderRecord = await Purchase_Order.findByPk(orderId, {
    raw: true, // 只需要資料表中資料
  })

  // const orderRecord = await findOne('orders', { order_id: orderId })

  // order_info記錄要向line pay要求的訂單json
  const order = JSON.parse(orderRecord.order_info)

  //const order = cache.get(orderId)
  console.log(`獲得訂單資料，內容如下：`)
  console.log(order)

  try {
    // 向line pay傳送的訂單資料
    const linePayResponse = await linePayClient.request.send({
      body: { ...order, redirectUrls },
    })

    // 深拷貝一份order資料
    const reservation = JSON.parse(JSON.stringify(order))

    reservation.returnCode = linePayResponse.body.returnCode
    reservation.returnMessage = linePayResponse.body.returnMessage
    reservation.transactionId = linePayResponse.body.info.transactionId
    reservation.paymentAccessToken =
      linePayResponse.body.info.paymentAccessToken

    console.log(`預計付款資料(Reservation)已建立。資料如下:`)
    console.log(reservation)

    // 在db儲存reservation資料
    const result = await Purchase_Order.update(
      {
        reservation: JSON.stringify(reservation),
        transaction_id: reservation.transactionId,
      },
      {
        where: {
          id: orderId,
        },
      }
    )

    // console.log(result)

    // 導向到付款頁面， line pay回應後會帶有info.paymentUrl.web為付款網址
    res.redirect(linePayResponse.body.info.paymentUrl.web)
  } catch (e) {
    console.log('error', e)
  }
})

// 向Line Pay確認交易結果
// 格式參考: https://enylin.github.io/line-pay-merchant/api-reference/confirm.html#example
router.get('/confirm', async (req, res) => {
  // 網址上需要有transactionId
  const transactionId = req.query.transactionId

  // 從資料庫取得交易資料
  const dbOrder = await Purchase_Order.findOne({
    where: { transaction_id: transactionId },
    raw: true, // 只需要資料表中資料
  })

  console.log(dbOrder)

  // 交易資料
  const transaction = JSON.parse(dbOrder.reservation)

  console.log(transaction)

  // 交易金額
  const amount = transaction.amount

  try {
    // 最後確認交易
    const linePayResponse = await linePayClient.confirm.send({
      transactionId: transactionId,
      body: {
        currency: 'TWD',
        amount: amount,
      },
    })

    // linePayResponse.body回傳的資料
    console.log(linePayResponse)

    //transaction.confirmBody = linePayResponse.body

    // status: 'pending' | 'paid' | 'cancel' | 'fail' | 'error'
    let status = 'paid'

    if (linePayResponse.body.returnCode !== '0000') {
      status = 'fail'
    }

    // 更新資料庫的訂單狀態
    const result = await Purchase_Order.update(
      {
        status,
        return_code: linePayResponse.body.returnCode,
        confirm: JSON.stringify(linePayResponse.body),
      },
      {
        where: {
          id: dbOrder.id,
        },
      }
    )

    console.log(result)

    return res.json({ status: 'success', data: linePayResponse.body })
  } catch (error) {
    return res.json({ status: 'fail', data: error.data })
  }
})

// 檢查交易用
router.get('/check-transaction', async (req, res) => {
  const transactionId = req.query.transactionId

  try {
    const linePayResponse = await linePayClient.checkPaymentStatus.send({
      transactionId: transactionId,
      params: {},
    })

    // 範例:
    // {
    //   "body": {
    //     "returnCode": "0000",
    //     "returnMessage": "reserved transaction."
    //   },
    //   "comments": {}
    // }

    res.json(linePayResponse.body)
  } catch (e) {
    res.json({ error: e })
  }
})

export default router