import { Router } from 'express';
import conn from "../../db.js";

import { getTimeNum, getTimeStr } from '../../data/test/lib-time.js';

//================== 初始化
const router = Router();

//================== 設置路由架構
router.get('/', (req, res) => {
  res.status(400).json({
    status: "Bad Request",
    message: "尼豪，歡迎乃到本區域。要使用服務請輸入更完整的路由網址"
  });
});

const isOverDue = time => {
  // const timeStr = time.replaceAll('/', '-');
  const now = new Date().getTime();
  const then = getTimeNum(time);

  return then < now;
}

router.get('/:uid', async (req, res) => {
  const uid = Number(req.params.uid);

  let [rows] = await conn.query(
    `SELECT * FROM coupon_user WHERE user_id = ?`,
    [uid]
  );

  if(rows.length === 0) {
    return res.status(200).json({
      status: "success",
      message: "優惠券一張都沒有",
      result: []
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
  console.log(rows);

  let usableArr = rows.filter(cp => !(cp.used_at || isOverDue(cp.expired_at)));
  const usedArr = rows.filter(cp => cp.used_at);
  const overdueArr = rows.filter(cp => isOverDue(cp.expired_at));

  if (usableArr.length > 0) {
    usableArr = await Promise.all(
      usableArr.map(async cp => {
        const [rows_info] = await conn.query(
          'SELECT name, `desc`, desc_ps, scope_from, scope_to, discount, min_spent, max_discount FROM coupon WHERE id = ?',
          [cp.cp_id]
        );
        return { ...cp,...rows_info[0] }
      })
    );
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

//======== handle 404
router.all('*', (req, res) => {
  res.status(404).json({
    status: "success",
    message: "喔不！沒有這個網址。請修正尼要使用的路由網址"
  });
});

//================== 匯出
export default router;

