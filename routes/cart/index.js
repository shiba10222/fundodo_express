import { Router } from 'express';
import multer from 'multer';
import conn from "../../db.js";
import readPD from './get-for-user/read-prod.js'
import readCR from './get-for-user/read-crs.js';
import readHT from './get-for-user/read-hotel.js';
import { getTimeStr_DB } from '../../data/test/lib-time.js';
import updateQuantity from './handle-patch/update-quantity.js';
import softDelete from './handle-patch/soft-delete.js';

// 參數
const envMode = process.argv[2];//dev or dist

// 模組物件
const router = Router();
const upload = multer();

//=================== 函數
const getCoursePrice = id => new Promise(async (resolve, reject) => {
  const [rows] = await conn.query(
    "SELECT price, price_sp FROM courses WHERE id = ?",
    [id]
  );
  if (rows.length === 0) {
    reject(new Error(`發生了未預期的結果：找不到 courses id: ${id} 的品項`));
    return;
  } else if (rows.length > 1) {
    reject(new Error(`courses id: ${id} 非唯一`));
    return;
  }

  const course = rows[0];
  const price = course.price_sp || course.price;
  resolve(price);
});

const insert = data => new Promise(async (resolve, reject) => {
  const colArr = [];
  const valueArr = [];
  for (const [key, value] of Object.entries(data)) {
    colArr.push(key);
    valueArr.push(value);
  }

  const colStr = '(' + colArr.join(', ') + ')';
  const valueStr = '(' + Array(valueArr.length).fill('?').join(', ') + ')';
  const sql = `INSERT INTO cart ${colStr} VALUES ${valueStr}`;

  const [results] = await conn.query(sql, valueArr);

  if (results.affectedRows < 1) {
    reject(new Error(`寫入 cart 資料表失敗`));
  }
  console.log(`成功匯入 ${results.affectedRows} 筆，其 ID 為 ${results.insertId}`);
  resolve(results);
});


//==================================================
//================== 設置路由架構 ====================
//==================================================

router.get('/', (req, res) => {
  res.status(400).send({ status: "Bad Request", message: '欲使用後台的購物車系統，請輸入正確的路由' });
});

//======== 讀取指定 ==========//
//【核心功能】查詢使用者的購物車內容
router.get('/:uid', async (req, res) => {
  const uid = Number(req.params.uid);

  //== 1 ==== 查詢 cart_PD
  const [rows_cart] = await conn.query(
    `SELECT * FROM cart WHERE user_id = ?`,
    [uid]
  );

  if (rows_cart.length === 0) {
    res.status(200).json({
      status: "success",
      message: "查詢成功",
      result: {
        PD: null,
        CR: null,
        HT: null,
      }
    });
    return;
  }
  //== 2 ==== 打包三種資料
  //! await 被 ts(80007) 說沒必要，但是經測試有非同步的效果與需要
  const pkgPD = rows_cart.filter(d => d.buy_sort === 'PD');
  const rows_PD = pkgPD.length === 0 ? null : await readPD(pkgPD);

  const pkgCR = rows_cart.filter(d => d.buy_sort === 'CR');
  const rows_CR = pkgCR.length === 0 ? null : await readCR(pkgCR);

  const pkgHT = rows_cart.filter(d => d.buy_sort === 'HT');
  const rows_HT = pkgHT.length === 0 ? null : await readHT(pkgHT);

  //== 3 ==== 組合三包資料
  let result = {
    PD: rows_PD,
    CR: rows_CR,
    HT: rows_HT,
  };
  res.status(200).json({ status: "success", message: "查詢成功", result });
});

//======== POST 區：新增資料 ==========//
router.post('/', upload.none(), async (req, res) => {
  if (Object.prototype.hasOwnProperty.call(req.body, 'user_id')
    && Object.prototype.hasOwnProperty.call(req.body, 'buy_sort')
    && Object.prototype.hasOwnProperty.call(req.body, 'buy_id') === false) {
    res.status(400).json({ status: "failure", message: "格式錯誤，請確認請求至少包含 user_id、buy_sort、buy_id 三種參數" });
    return;
  }
  const { user_id, buy_sort, buy_id } = req.body;

  const timeObj = new Date().getTime();
  const time_now = getTimeStr_DB(timeObj);
  let valuePkg;

  if (buy_sort === 'PD') {
    if (Object.prototype.hasOwnProperty.call(req.body, 'quantity') === false) {
      res.status(400).json({ status: "failure", message: "格式錯誤，商品類必須包含 quantity 參數" });
      return;
    }

    valuePkg = {
      user_id: user_id,
      dog_id: null,
      buy_sort,
      buy_id,
      quantity: req.body.quantity,
      amount: null,
      room_type: null,
      check_in_date: null,
      check_out_date: null,
      created_at: time_now,
      deleted_at: null
    };
  } else if (buy_sort === 'HT') {
    let isNotOK = false;
    ['dog_id', 'amount', 'room_type', 'check_in_date', 'check_out_date'].forEach(property => {
      if (Object.prototype.hasOwnProperty.call(req.body, property) === false) {
        (property === 'dog_id')
          ? res.status(400).json({ status: "failure", message: "格式錯誤，旅館類即使沒有綁定狗勾，也必須寫 dog_id: null" })
          : res.status(400).json({ status: "failure", message: `格式錯誤，旅館類必須包含 ${property} 參數` });
        isNotOK = true;
        return;
      }
    });
    if (isNotOK) return;

    valuePkg = {
      user_id,
      dog_id: req.body.dog_id,
      buy_sort,
      buy_id,
      quantity: 1,
      amount: 4788,
      room_type: req.body.room_type,
      check_in_date: req.body.check_in_date,
      check_out_date: req.body.check_out_date,
      created_at: time_now,
      deleted_at: null
    };
  } else if (buy_sort === 'CR') {
    const amount = await getCoursePrice(buy_id);

    valuePkg = {
      user_id,
      dog_id: null,
      buy_sort,
      buy_id,
      quantity: 1,
      amount,
      room_type: null,
      check_in_date: null,
      check_out_date: null,
      created_at: time_now,
      deleted_at: null
    };
  } else { /*//TODO  */ }

  const result = await insert(valuePkg);
  res.json({ status: "success", message: "新增成功", result });
});

//======== PATCH 區：部份更新 ==========//
// 目前提供軟刪除及其回復，和更改商品數量
// 其他則不予供應

router.patch('/:id', upload.none(), async (req, res) => {
  const reqCount = Object.keys(req.body).length;
  if (reqCount === 0) {
    res.status(400).json({ status: "failure", message: "沒有資料的請求算什麼請求" });
    return;
  }
  if (reqCount !== 1) {
    res.status(400).json({ status: "failure", message: "要求太多，拒絕受理" });
    return;
  }

  const [attribute, value] = Object.entries(req.body)[0];
  const cartID = Number(req.params.id);

  if (isNaN(cartID)) {
    res.status(400).json({ status: "failure", message: `ID(${cartID}) 有問題` });
    return;
  }

  if (attribute !== 'quantity' && attribute !== 'deleted_at') {
    res.status(400).json({ status: "failure", message: "本路由只提供更新數量與軟刪除之服務" });
    return;
  }

  //====== 服務一 ==== 更新購物車中的商品數量
  if (attribute === 'quantity') updateQuantity(res, conn, cartID, value);

  //====== 服務二 ==== 軟刪除與還原購物車的項目
  if (attribute === 'deleted_at') softDelete(res, conn, cartID, value);

});
//======== DELETE 區：結帳完清空購物車 ==========//
// 目前提供軟刪除及其回復，和更改商品數量
// 其他則不予供應

router.delete('/', upload.none(), async (req, res) => {
  //驗證資料格式
  if (['user_id', 'cart_ids'].some(keyword => {
    if (Object.prototype.hasOwnProperty.call(req.body, keyword) === false) {
      res.status(400).json({ status: "rejected", message: `格式錯誤，請求缺少了 ${keyword} 參數` });
      return true;
    }
    return false;
  })
  ) return;

  const uID = Number(req.body.user_id);
  const cartIDs = req.body.cart_ids.map(Number);

  if (isNaN(uID)) {
    res.status(400).json({ status: "failure", message: `ID(${uID}) 有問題` });
    return;
  }

  let counter = 0;

  await Promise.all(
    cartIDs.map(async id => {
      await conn.execute('DELETE FROM cart WHERE `id` = ?', [id])
        .then(([results]) => {
          if (results.affectedRows < 1) throw new Error(`刪除購物車項目失敗`);

          counter++;
        }).catch(err => {
          console.error(err.message);
        });
    })
  );
  res.status(200).json({
    status: "success",
    message: `成功從資料表 cart 刪除 ${counter} 筆項目`
  });
});

//======== handle 404

router.all("*", (req, res) => {
  res.send('Send Tree Pay: 404');
})

//================== 匯出
export default router;