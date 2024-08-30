import { Router } from 'express';
import multer from 'multer';
import conn from "../../db.js";
import { getTimeNum, getTimeStr, getTimeStr_DB, nDaysAfter } from '../../data/test/lib-time.js';
import geneCode from './_aux/geneCode.js';

//================== 初始化
const router = Router();
const upload = multer();

//================== 待命函數
const isOverDue = time => {
  // const timeStr = time.replaceAll('/', '-');
  const now = new Date().getTime();
  const then = getTimeNum(time);

  return then < now;
}

//==================================================
//================== 設置路由架構 ====================
//==================================================


//================== 查詢：預設為查詢使用者所有優惠券
router.get('/:uid', async (req, res) => {
  const uid = Number(req.params.uid);

  let [rows] = await conn.execute(
    `SELECT * FROM coupon_user WHERE user_id = ?`,
    [uid]
  );

  if (rows.length === 0) {
    return res.status(200).json({
      status: "success",
      message: "優惠券一張都沒有",
      result: {
        usableArr: [],
        usedArr: [],
        overdueArr: []
      }
    });
  }

  rows = rows.map(row => ({
    id: row.id,
    cp_id: row.cp_id,
    created_at: row.created_at ? getTimeStr(row.created_at) : null,
    applied_at: row.applied_at ? getTimeStr(row.applied_at) : null,
    expired_at: row.expired_at ? getTimeStr(row.expired_at) : null,
    code: row.code,
  }))

  let usableArr = rows.filter(cp => !(cp.used_at || isOverDue(cp.expired_at)));
  const usedArr = rows.filter(cp => cp.used_at);
  const overdueArr = rows.filter(cp => isOverDue(cp.expired_at));

  if (usableArr.length > 0) {
    usableArr = await Promise.all(
      usableArr.map(async cp => {
        const [rows_info] = await conn.execute(
          'SELECT name, `desc`, desc_ps, scope_from, scope_to, discount, min_spent, max_discount FROM coupon WHERE id = ?',
          [cp.cp_id]
        );
        return { ...cp, ...rows_info[0] }
      })
    );
  } else {
    usableArr = [];
  }

  res.status(200).json({
    status: "success",
    message: "查詢成功",
    result: {
      usableArr,
      usedArr,
      overdueArr
    }
  });
});

//================== 查詢：查詢該優惠券的所屬 cp_id
router.get('/', async (req, res) => {
  const userCouponID = Number(req.execute.ucid);

  let [rows] = await conn.execute(
    `SELECT cp_id FROM coupon_user WHERE id = ${userCouponID}`
  ).catch(err => {
    res.status(500).json({ status: "error", message: "出現了意外的錯誤而提早中止", error: err });
  });

  if (rows.length === 0)
    res.status(200).json({ status: "success", message: "搜尋完畢，查無此號", result: 0 });

  res.status(200).json({ status: "success", message: "查詢成功", result: rows[0].cp_id });
});

//================== 路由之根
router.get('/', (_, res) => {
  res.status(400).json({
    status: "Bad Request",
    message: "尼豪，歡迎乃到本區域。要暑用服務請輸路更完整的路由網紫"
  });
});

//================== 新增：消費觸發的發放
router.post('/checkout', upload.none(), async (req, res) => {
  const { user_id, ucids } = req.body;

  if (!user_id || !ucids || ucids.length === 0) {
    res.status(400).json({ status: "rejected", message: "資料不完整" });
    return;
  }

  //! 以下 3 個參數為系統設定，不得更動
  const givenCpID = 2;
  const time_span = 7;
  const targetIDs = [5, 6];

  const cpidArr = await Promise.all(
    ucids.map(async ucid => {
      const [rows] = await conn.execute(
        `SELECT cp_id FROM coupon_user WHERE id = ${ucid}`
      ).catch(err => {
        res.status(500).json({ status: "error", message: "查詢時出現了意外的錯誤而提早中止", error: err });
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
        res.status(500).json({ status: "error", message: "新增時出現了意外的錯誤而提早中止", error: err });
      });
      return rows[0].cp_id;
    })
  );
  if (targetArr.length === 0)
    res.status(200).json({ status: "success", message: `感謝訂購，本次消費無獲得新的優惠券` });
  else
    res.status(200).json({ status: "success", message: `感謝訂購，恭喜您獲得 ${targetArr.length} 張優惠券` });
});

//======== PATCH 區：部份更新 ==========//
// 結帳完，狀態更新
router.patch('/', upload.none(), async (req, res) => {
  //驗證資料格式
  if (['user_id', 'ucids'].some(keyword => {
    if (Object.prototype.hasOwnProperty.call(req.body, keyword) === false) {
      res.status(400).json({ status: "rejected", message: `格式錯誤，請求缺少了 ${keyword} 參數` });
      return true;
    }
    return false;
  })
  ) return;

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
      }).catch(err => {
        console.error(err.message);
      });
    })
  );
  res.status(200).json({
    status: "success",
    message: `成功從資料表 coupon_user 更新 ${counter} 筆優惠券`
  });
});

//======== handle 404
router.all('*', (req, res) => {
  res.status(404).json({
    status: "NOT FOUND",
    message: "喔不！沒有這個網址。請修正尼要使用的 coupon 路由網址"
  });
});

//================== 匯出
export default router;

