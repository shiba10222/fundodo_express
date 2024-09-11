import { Router } from 'express';
import multer from 'multer';
import conn from "../../db.js";
import readPD from './get-for-user/read-prod.js'
import readCR from './get-for-user/read-crs.js';
import readHT from './get-for-user/read-hotel.js';
import { getTimeStr_DB } from '../lib/common/time.js';
import updateQuantity from './handle-patch/update-quantity.js';
import softDelete from './handle-patch/soft-delete.js';
import { res200Json, res400Json } from '../lib/common/response.js';

// 模組物件
const router = Router();
const upload = multer();

//==================================================
//================== 設置路由架構 ====================
//==================================================

router.get('/', (req, res) => {
  res.status(400).json({ status: "Bad Request", message: '欲使用後台的購物車系統，請輸入正確的路由' });
});

//======== 讀取課程是否已在購物車 ==========//
router.get('/check-crs', upload.none(), async (req, res) => {
  //驗證資料格式
  if (['uid', 'cid'].some(keyword => {
    if (Object.prototype.hasOwnProperty.call(req.query, keyword)) {
      return false;
    }
    res400Json(res, `格式錯誤，請求缺少了 ${keyword} 參數`);
    return true;
  })) return;

  const { uid, cid } = req.query;

  //查詢是否存在
  const [rows] = await conn.execute(
    `SELECT id, deleted_at FROM cart WHERE user_id = ? AND buy_sort = 'CR' AND buy_id = ?`,
    [uid, cid]
  ).catch(err => {
    res.status(500).json({ status: "failure", message: "查詢購物車中是否有指定課程時出了意外" });
    next(err);
  });
  const doesExist = rows.length > 0 && rows[0].deleted_at === null;

  res200Json(res, `查詢購物車中指定課程成功，${doesExist ? '有' : '不'}在購物車中`, doesExist);
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

  if (rows_cart.length === 0)
    return res200Json(res,
      `成功查詢 ID ${uid} 之會員的購物車，其為空空如也`,
      {
        PD: null,
        CR: null,
        HT: null,
      });
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
  return res200Json(res, `成功查詢 ID ${uid} 之會員的購物車`, result);
});

//======== POST 區：新增資料 ==========//
router.post('/', upload.none(), async (req, res, next) => {
  if (Object.prototype.hasOwnProperty.call(req.body, 'user_id')
    && Object.prototype.hasOwnProperty.call(req.body, 'buy_sort')
    && Object.prototype.hasOwnProperty.call(req.body, 'buy_id') === false) {
    res.status(400).json({ status: "failure", message: "格式錯誤，請確認請求至少包含 user_id、buy_sort、buy_id 三種參數" });
    return;
  }
  const { user_id, buy_sort, buy_id } = req.body;

  //====== 檢驗是否已經存在購物車中
  if (buy_sort !== 'HT') {
    const [rows] = await conn.execute(
      `SELECT id, deleted_at FROM cart WHERE user_id = ? AND buy_sort = ? AND buy_id = ?`,
      [user_id, buy_sort, buy_id]
    ).catch(err => {
      res.status(500).json({ status: "failure", message: "新增購物車項目在查詢環節出了意外的差錯" });
      next(err);
    });

    if (rows.length > 1) console.error('救命啊，購物車裡有重複的東西');
    if (rows.length > 0) {
      console.log(rows[0]);
      if (rows[0].deleted_at === null) {
        //有已存在的項目
        return res200Json(res, "此商品已在購物車中", false);
      } else {
        //已有的項目是已被軟刪除的
        await conn.execute(`DELETE FROM cart WHERE id = ?`, [rows[0].id]);
      }
    }
  }

  //====== 蒐集資料
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
          ? res400Json(res, "格式錯誤，旅館類即使沒有綁定狗勾，也必須寫 dog_id: null")
          : res400Json(res, `格式錯誤，旅館類必須包含 ${property} 參數`);
        isNotOK = true;
        return;
      }
    });
    if (isNotOK) return;

    const dog_id = req.body.dog_id ? Number(req.body.dog_id) : null;

    valuePkg = {
      user_id,
      dog_id,
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
    valuePkg = {
      user_id,
      dog_id: null,
      buy_sort,
      buy_id,
      quantity: 1,
      amount: null,
      room_type: null,
      check_in_date: null,
      check_out_date: null,
      created_at: time_now,
      deleted_at: null
    };
  } else {
    res400Json(res, "查無此種 buy_sort：", buy_sort);
  }

  //====== 打包資料
  const colArr = [];
  const valueArr = [];
  for (const [key, value] of Object.entries(valuePkg)) {
    colArr.push(key);
    valueArr.push(value);
  }

  const colStr = '(' + colArr.join(', ') + ')';
  const valueStr = '(' + Array(valueArr.length).fill('?').join(', ') + ')';
  const sql = `INSERT INTO cart ${colStr} VALUES ${valueStr}`;

  //====== 新增進資料庫中
  const [results] = await conn.execute(sql, valueArr)
    .catch(err => {
      res.status(500).json({ status: "failure", message: "新增購物車項目在寫入環節出了意外的差錯" });
      next(err);
    });

  if (results.affectedRows < 1)
    return res.status(500).json({ status: "failure", message: "新增購物車項目在寫入環節出了意外的差錯" });

  res200Json(res,
    `成功匯入 ${results.affectedRows} 筆，其 ID 為 ${results.insertId}`, true);
});

//======== PATCH 區：部份更新 ==========//
// 目前提供軟刪除及其回復，和更改商品數量
// 其他則不予供應

router.patch('/:id', upload.none(), async (req, res) => {
  const reqCount = Object.keys(req.body).length;
  if (reqCount === 0) {
    res400Json(res, "沒有資料的請求算什麼請求");
    return;
  }
  if (reqCount !== 1) {
    res400Json(res, "要求太多，拒絕受理");
    return;
  }

  //* attribute: quantity | 更新數量 ; deleted_at | 軟刪除與還原
  const [attribute, value] = Object.entries(req.body)[0];
  const cartID = Number(req.params.id);

  if (isNaN(cartID)) {
    res400Json(res, `ID(${cartID}) 有問題`);
    return;
  }

  if (attribute !== 'quantity' && attribute !== 'deleted_at') {
    res400Json(res, "本路由只提供更新數量與軟刪除之服務");
    return;
  }

  //====== 服務一 ==== 更新購物車中的商品數量
  if (attribute === 'quantity') updateQuantity(res, cartID, value);

  //====== 服務二 ==== 軟刪除與還原購物車的項目
  if (attribute === 'deleted_at') softDelete(res, cartID, value);

});
//======== DELETE 區：結帳完清空購物車 ==========//

router.delete('/', upload.none(), async (req, res) => {
  //驗證資料格式
  if (['user_id', 'cart_ids'].some(keyword => {
    if (Object.prototype.hasOwnProperty.call(req.body, keyword)) {
      return false;
    }
    res400Json(res, `格式錯誤，請求缺少了 ${keyword} 參數`);
    return true;
  })) return;

  const uID = Number(req.body.user_id);
  const cartIDs = req.body.cart_ids.map(Number);

  if (isNaN(uID))
    return res400Json(res, `ID(${uID}) 有問題`);

  //刪除
  let counter = 0;

  await conn.execute('DELETE FROM cart WHERE `user_id` = ?', [uID])
    .then(([results]) => {
      if (results.affectedRows < 1) throw new Error(`刪除購物車項目失敗`);

      counter++;
    }).catch(err => {
      res.status(500).json({
        status: "error",
        message: "刪除購物車項目時出現了意外的錯誤",
        error: err
      });
      next(err);// let express handle the error
    });

  // await Promise.all(
  //   cartIDs.map(async id => {
  //     await conn.execute('DELETE FROM cart WHERE `id` = ?', [id])
  //       .then(([results]) => {
  //         if (results.affectedRows < 1) throw new Error(`刪除購物車項目失敗`);

  //         counter++;
  //       }).catch(err => {
  //         res.status(500).json({
  //           status: "error",
  //           message: "刪除購物車項目時出現了意外的錯誤",
  //           error: err
  //         });
  //         next(err);// let express handle the error
  //       });
  //   })
  // );
  res200Json(res, `成功從資料表 cart 刪除 ${counter} 筆項目`);
});

//======== handle 404

router.all("*", (req, res) => {
  res.send('Send Tree Pay: 404');
})

//================== 匯出
export default router;