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

const notyet = time => {
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

  if (rows.length > 0) {
    rows = await Promise.all(
      rows.map(async cp => {
        const [rows_info] = await conn.query(
          'SELECT name, `desc`, desc_ps, discount, min_spent, max_discount FROM coupon WHERE id = ?',
          [cp.cp_id]
        );
        return { ...cp,
          created_at: cp.created_at ? getTimeStr(cp.created_at) : null,
          applied_at: cp.applied_at ? getTimeStr(cp.applied_at) : null,
          expired_at: cp.expired_at ? getTimeStr(cp.expired_at) : null,
          ...rows_info[0] }
      })
    );
  }

  const unusedArr = rows.filter(cp => !cp.used_at && notyet(cp.expired_at));
  const usedArr = rows.filter(cp => cp.used_at);
  const overdueArr = rows.filter(cp => !cp.used_at && !notyet(cp.expired_at));


  res.status(200).json({
    status: "success",
    message: "查詢成功",
    result: {
      unusedArr,
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

