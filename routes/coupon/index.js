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

  /** 精簡優惠券物件內的資料 */
  const coupons = rows.map(row => {
    const { id, cp_id, code } = row;

    return {
      id,
      cp_id,
      code,
      created_at: row.created_at ? getTimeStr(row.created_at) : null,
      applied_at: row.applied_at ? getTimeStr(row.applied_at) : null,
      expired_at: row.expired_at ? getTimeStr(row.expired_at) : null,
    };
  });

  let usableArr = coupons.filter(cp => !(cp.used_at || isOverDue(cp.expired_at)));
  const usedArr = coupons.filter(cp => cp.used_at);
  const overdueArr = coupons.filter(cp => isOverDue(cp.expired_at));

  if (usableArr.length > 0) {
    usableArr = await Promise.all(
      usableArr.map(async cp => {
        const [rows_info] = await conn.execute(
          `SELECT name, 'desc', desc_ps, scope_from,
          scope_to, discount, min_spent, max_discount
          FROM coupon WHERE id = ?`,
          [cp.cp_id]
        );
        //! desc 因為是保留的關鍵字，必須使用字串型態
        return { ...cp, ...rows_info[0] }
      })
    ).catch(err => console.error(err));
  } else {
    usableArr = [];
  }

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
    isOK || res400Json(res, `格式錯誤，請求缺少了 ${keyword} 參數`);
    return isOK;
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

