import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { v4 as uuid } from 'uuid';
import conn from "../../db.js";

// 參數
const envMode = process.argv[2];//dev or dist

// 模組物件
const router = Router();

//================================= 設置中介函數
/**
 * 解析 TOKEN | 中介函數
 * @description 處理 token 驗證失敗之情形
 */
const checkToken = (req, res, next) => {
  if (envMode === 'dev') next();

  let token = req.get("Authorization");
  const headStr = "Bearer ";

  if (token && token.startsWith(headStr)) {
    token = req.get("Authorization").slice(headStr.length);

    //================================================================
    // 類似 SESSION 的作法，但僅能用於單次測試，因為 blacklist 在重啟後就會跟著重置
    // if(blackList.includes(token)) {
    //   return res.status(401).json({
    //     status: '401',
    //     message: '登入驗證已失效，請重新登入'
    //   })
    // }
    //================================================================

    jwt.verify(token, secretKey, (err, decoded) => {
      if (err) {
        res.status(401).json({ status: 'failed', message: '登入驗證已失效，請重新登入。' });
      } else {
        // 讓成功的應對由不同路由各自處理，回傳 decoded
        req.decoded = decoded;
        // next 以離開中介，返回路由流程
        next();
      }
    });
    res.status(200).json({ status: 'success', message: '驗證成功。' });
  } else {
    res.status(401).json({ status: 'unauthorized', message: '驗證失敗，請重新登入。' });
    next();
  }
}
//==================================================
//================== 設置路由架構 ====================
//==================================================

//======== 讀取全部 ==========//

//兵分三路
/**
 * 查詢 product 並打包資料
 * @param {number} uid user id
 * @returns {{
 * buy_id: number, quantity: number,
 * created_at: string, deleted_at: string
 * }[]} object[ ] | null
 */
const handleProd = async uid => {
  //== 1 ==== 查詢 cart_PD ==========================
  const [rows_cart] = await conn.query(
    `SELECT buy_id, quantity, created_at, deleted_at
    FROM cart_temp WHERE buy_sort = ? AND user_id = ?`,
    ['PD', uid]
  );

  if (rows_cart.length === 0) return null;

  const sample = {
    "buy_id": 979,
    "quantity": 1,
    "created_at": "2023-04-16T00:19:42.000Z",
    "deleted_at": null
  };

  //== 2 ==== 打包資料 =================================
  const pkgArr = await Promise.all(
    rows_cart.map(async cartItem => {
      //== 2-1 ==== 查詢 prod_price_stock ========
      const [rows_item] = await conn.query(
        `SELECT * FROM prod_price_stock WHERE id = ?`,
        [cartItem.buy_id]
      );

      if (rows_item.length !== 1) {
        console.error("發生了未預期的結果：給定的 prod_price_stock id 不存在或是非唯一");
        return null;
      }
      const subProd = rows_item[0];
      //== 2-2 ==== 查詢 product ==================
      const [rows_prod] = await conn.query(
        `SELECT name FROM product WHERE id = ?`,
        [subProd.prod_id]
      );

      if (rows_prod.length !== 1) {
        console.error("發生了未預期的結果：給定的 product id 不存在或是非唯一");
        return null;
      }
      const product = rows_prod[0];
      //== 2-3 ==== 查詢 prod_picture ==================
      const [rows_pic] = await conn.query(
        "SELECT name FROM prod_picture WHERE prod_id = ?",
        [subProd.prod_id]
      );
      
      const picName = rows_pic[0]['name'];

      return ({
        key: cartItem.buy_id,
        prod_name: product.name,
        pic_name: picName,
        sort_name: subProd.sortname,
        spec_name: subProd.specname,
        price: subProd.price,
        price_sp: subProd.price_sp,
        quantity: cartItem.quantity,
        isOutOfStock: subProd.stock === 0,
        stock_when_few: (subProd.stock < 20) ? subProd.stock : null
      })
    })
  ).catch(err => {
    console.error(err);
    return null;
  });

  return pkgArr.filter(obj => !!obj);
}

//正文開始
router.get('/', (req, res) => {
  res.status(400).send({ status: "Bad Request", message: '欲使用購物車查詢系統，請輸入正確的路由' });
});


//======== 讀取指定 ==========//
//【核心功能】使用者的購物車內容
//* test uid = 59
router.get('/:uid', async (req, res) => {
  const uid = Number(req.params.uid);
  const rows_PD = await handleProd(uid);


  let rows = {
    PD: rows_PD,
    HT: null,
    CR: null,
  };
  res.status(200).json({ status: "success", message: "查詢成功", result: rows });
});



//======== handle 404

router.all("*", (req, res) => {
  res.send('Send Tree Pay: 404');
})

//================== 匯出
export default router;