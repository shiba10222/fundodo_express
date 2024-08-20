import { Router } from 'express';
import multer from 'multer';
import conn from "../../db.js";
import readPD from './get-for-user/read-prod.js'
import readCR from './get-for-user/read-crs.js';
import readHT from './get-for-user/read-hotel.js';
import { getTimeStr_DB } from '../../data/test/lib-time.js';

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

//======== 新增資料 ==========//
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

//======== 軟刪除資料 ==========//

router.patch('/del/:id', async (req, res) => {
  const cartID = Number(req.params.id);

  const timeObj = new Date().getTime();
  const now = getTimeStr_DB(timeObj);

  try {
    await conn.execute(
      "UPDATE `cart` SET `deleted_at` = ? WHERE id = ?",
      [now, cartID]
    );
  } catch (e) {
    res.status(500).json({ status: "failure", message: "刪除失敗，請稍後再嘗試" });
    console.error(e);
    return;
  };

  res.json({ status: "success", message: `成功刪除 ID ${cartID} 之購物車項目` });
});
//======== 恢復軟刪除資料 ==========//

router.patch('/undodel/:id', async (req, res) => {
  const cartID = Number(req.params.id);

  try {
    await conn.execute(
      "UPDATE `cart` SET `deleted_at` = NULL WHERE id = ?",
      [now, cartID]
    );
  } catch (e) {
    res.status(500).json({ status: "failure", message: "刪除失敗，請稍後再嘗試" });
    console.error(e);
    return;
  };

  res.json({ status: "success", message: `成功刪除 ID ${cartID} 之購物車項目` });
});

//======== handle 404

router.all("*", (req, res) => {
  res.send('Send Tree Pay: 404');
})

//================== 匯出
export default router;