import { Router } from 'express';
import multer from 'multer';
import conn from "../../db.js";
import {
  getTimeNum,
  getTimeStr,
  getTimeStr_DB,
  nDaysAfter
} from '../lib/common/time.js';
import { res200Json, res400Json } from '../lib/common/response.js';
import geneCode from './_aux/geneCode.js';

//================== 初始化
const router = Router();
const upload = multer();

//================== 待命函數
/**
 * 根據此函數執行的當下時間判斷給定的時間在
 * @param {*} time Date object 可以接受的時間格式
 * @returns true | 已經過期了 ; false | 還在期限內
 */
const isOverDue = time => {
  const now = new Date().getTime();
  const then = getTimeNum(time);

  return then < now;
}

//==================================================
//================== 設置路由架構 ====================
//==================================================

//================== 查詢：預設為查詢使用者所有優惠券
router.get('/:uid', async (req, res, next) => {
  const uid = Number(req.params.uid);

  const [rows] = await conn.execute(
    `SELECT * FROM coupon_user WHERE user_id = ?`,
    [uid]
  ).catch(next);

  if (rows.length === 0)
    return res200Json(res,
      "查詢完成，一張優惠券都沒有",
      {
        usableArr: [],
        usedArr: [],
        overdueArr: []
      }
    );

  /** 重新打包優惠券物件內的資料，
   * 即使是不能用的優惠券，也需要附上
   */
  const coupons = await Promise.all(
    rows.map(async coupon => {
      const { id, cp_id, code } = coupon;

      const [rows_info] = await conn.execute(
        'SELECT name, `desc`, scope_from, scope_to, discount, min_spent, max_discount FROM coupon WHERE id = ?',
        [coupon.cp_id]
      );
      //! desc 因為是保留的關鍵字，必須使用反引號的字串型態，一般引號會變輸出純字串
      return {
        id,
        cp_id,
        code,
        created_at: coupon.created_at ? getTimeStr(coupon.created_at) : null,
        applied_at: coupon.applied_at ? getTimeStr(coupon.applied_at) : null,
        expired_at: coupon.expired_at ? getTimeStr(coupon.expired_at) : null,
        ...rows_info[0]
      }
    })
  ).catch(err => console.error(err));

  let usableArr = coupons.filter(cp => !(cp.applied_at || isOverDue(cp.expired_at)));
  const usedArr = coupons.filter(cp => cp.applied_at);
  const overdueArr = coupons.filter(cp => isOverDue(cp.expired_at));


  res200Json(res,
    `查詢完成，共有 ${coupons.length} 張優惠券，其中共 ${usableArr.length} 張可用`,
    {
      usableArr,
      usedArr,
      overdueArr
    }
  );
  return;
});

//================== 查詢：查詢該優惠券的所屬 cp_id
router.get('/', async (req, res) => {
  const userCouponID = Number(req.query.ucid);

  let [rows] = await conn.execute(
    `SELECT cp_id FROM coupon_user WHERE id = ${userCouponID}`
  ).catch(err => {
    res.status(500).json({ status: "error", message: "出現了意外的錯誤而提早中止", error: err });
  });

  if (rows.length === 0) res200Json(res, "搜尋完畢，優惠券系統中查無此 ID", 0);

  res200Json(res, "查詢成功，已回傳優惠券系統中的 ID", rows[0].cp_id);
});

//*======== POST 區：發放優惠券 ==========//

//================== 新增：註冊觸發的發放
router.post('/register', upload.none(), async (req, res, next) => {
  if (Object.prototype.hasOwnProperty.call(req.body, 'user_id') === false)
    return res400Json(res, "資料不完整，資料必須包含 user_id");

  const { user_id } = req.body;

  //! 以下 2 個參數為系統設定，不得更動
  const targetIDs = [4, 10];
  const time_span = [7, 14];

  const now = new Date().getTime();
  const t_create = getTimeStr_DB(now);

  await Promise.all(
    targetIDs.map(async (id, j) => {
      const t_expired = getTimeStr_DB(nDaysAfter(now, time_span[j]));

      await conn.execute(
        `INSERT coupon_user (code, user_id, cp_id, created_at, expired_at) VALUE (?, ?, ?, ?, ?)`,
        [geneCode(), user_id, id, t_create, t_expired]
      ).catch(err => {
        res.status(500).json({ status: "error", message: "新增時出現了意外的錯誤而提早中止", error: err });
        next(err);// let express handle the error
      });
    })
  );

  res200Json(res, `感謝註冊，恭喜您獲得 ${targetIDs.length} 張優惠券`);
});

//================== 新增：消費觸發的發放
router.post('/checkout', upload.none(), async (req, res, next) => {
  const { user_id, ucids } = req.body;

  if (!user_id || !ucids || ucids.length === 0)
    return res400Json(res, "資料不完整，缺少 user_id、ucids 或是格式不符合。");

  //! 以下 3 個參數為系統設定，不得更動
  const givenCpID = 2;
  const time_span = 7;
  const targetIDs = [5, 6];

  const cpidArr = await Promise.all(
    ucids.map(async ucid => {
      const [rows] = await conn.execute(
        `SELECT cp_id FROM coupon_user WHERE id = ${ucid}`
      ).catch(err => {
        res.status(500).json({ status: "error", message: "查詢優惠券時出現了意外的錯誤而提早中止", error: err });
        next(err);
      });
      return rows[0].cp_id;
    })
  );

  const now = new Date();
  const t_create = getTimeStr_DB(now);
  const t_expired = getTimeStr_DB(nDaysAfter(now, time_span));

  const targetArr = cpidArr.filter(cpid => targetIDs.indexOf(cpid) !== -1);

  await Promise.all(
    targetArr.map(async () => {
      await conn.execute(
        `INSERT coupon_user (code, user_id, cp_id, created_at, expired_at) VALUE (?, ?, ?, ?, ?)`,
        [geneCode(), user_id, givenCpID, t_create, t_expired]
      ).catch(err => {
        res.status(500).json({ status: "error", message: "新增優惠券時出現了意外的錯誤而提早中止", error: err });
        next(err);
      });
      return;
    })
  );
  res200Json(res,
    (targetIDs.length === 0)
      ? "感謝訂購，本次消費無獲得新的優惠券"
      : `感謝訂購，恭喜您獲得 ${targetIDs.length} 張優惠券`
  );
});

//================== 新增：會員領取的發放
// 此路由只要查詢過程正常，回覆碼皆為 200
// 因為無須回覆結果值，result 用來區分新增結果的成功
// true | 有成功新增優惠券 ; false | 沒有獲得優惠券
router.post('/claim', upload.none(), async (req, res, next) => {
  const colArr = ['user_id', 'cp_code'];

  //=================== 格式驗證
  colArr.forEach(key => {
    if (Object.prototype.hasOwnProperty.call(req.body, key) === false)
      return res400Json(res, `資料不完整，資料必須包含 ${key}`);
  })

  const { user_id, cp_code } = req.body;


  //=================== 查詢領取碼對應的優惠券

  const [rows] = await conn.execute(
    "SELECT id, time_span, end_date FROM coupon WHERE get_code = ?",
    [cp_code]
  ).catch(err => {
    res.status(500).json({
      status: "error",
      message: "新增優惠券前的查詢環節出現了意外的錯誤而提早中止",
      error: err
    });
    next(err);// let express handle the error
  });

  if (rows.length === 0)
    return res200Json(res, `查無此張優惠券`, false);

  const coupon = rows[0];

  //=================== 查詢該優惠券是否有效
  if (isOverDue(coupon.end_date))
    return res200Json(res, `該優惠券活動檔期已結束，感謝支持`, false);

  //=================== 查詢使用者是否領取過該優惠券
  const [rows_history] = await conn.execute(
    "SELECT id FROM coupon_user WHERE user_id = ? AND cp_id = ?",
    [user_id, coupon.id]
  ).catch(err => {
    res.status(500).json({
      status: "error",
      message: "新增優惠券前的查詢環節出現了意外的錯誤而提早中止",
      error: err
    });
    next(err);// let express handle the error
  });

  if (rows_history.length > 0)
    return res200Json(res, `已領取過該優惠券`, false);

  //=================== 發放優惠券
  const now = new Date().getTime();
  const t_create = getTimeStr_DB(now);
  const t_expired = (coupon.time_span > 0)
    ? getTimeStr_DB(nDaysAfter(now, coupon.time_span))
    : getTimeStr_DB(coupon.end_date);

  await conn.execute(
    `INSERT coupon_user (code, user_id, cp_id, created_at, expired_at) VALUE (?, ?, ?, ?, ?)`,
    [geneCode(), user_id, coupon.id, t_create, t_expired]
  ).then(() => {

    res200Json(res, `優惠券領取成功，恭喜您獲得 1 張優惠券`, true);

  }).catch(err => {
    res.status(500).json({
      status: "error",
      message: "新增優惠券時出現了意外的錯誤而提早中止",
      error: err
    });
    next(err);// let express handle the error
  });
});

//======== handle 404
router.post('*', (_, res) =>
  res.status(404).json({
    status: "NOT FOUND",
    message: "婀娜！優惠券的 POST 路由沒有這個網紫。請修正尼要使用的 coupon 路由網紫"
  })
);

//*======== PATCH 區：部份更新 ==========//
// 結帳完，狀態更新
router.patch('/', upload.none(), async (req, res) => {
  //驗證資料格式
  if (['user_id', 'ucids'].some(keyword => {
    const isOK = Object.prototype.hasOwnProperty.call(req.body, keyword);

    if (isOK) return false;

    res400Json(res, `格式錯誤，請求缺少了 ${keyword} 參數`);
    return true;
  })) return;

  //提取資料
  const uID = Number(req.body.user_id);
  const couponIDs = req.body.ucids.map(Number);


  //加碼驗證資料格式
  if (isNaN(uID)) {
    res.status(400).json({ status: "failure", message: `ID(${uID}) 有問題` });
    return;
  }

  let counter = 0;
  const timeObj = new Date().getTime();
  const time_now = getTimeStr_DB(timeObj);

  await Promise.all(
    couponIDs.map(async id => {
      await conn.execute(
        'UPDATE `coupon_user` SET `applied_at` = ? WHERE id = ?',
        [time_now, id]
      ).then(([results]) => {
        if (results.affectedRows < 1)
          throw new Error(`更新優惠券 (id: ${id}) 狀態失敗`);

        counter++;
      }).catch(err => console.error(err.message));
    })
  ).catch(err => {
    res.status(400).json({ status: "failure", message: err.message });
    consolr.error(err.message);
  });

  res200Json(res, `成功從資料表 coupon_user 更新 ${counter} 筆優惠券`);
});

//======== handle 404
router.all('*', (_, res) => {
  res.status(404).json({
    status: "NOT FOUND",
    message: "喔不！優惠券區域沒有這個網紫。請修正尼要使用的 coupon 路由網紫"
  });
});

//================== 匯出
export default router;

