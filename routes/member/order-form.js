import { Router } from 'express';
import multer from 'multer';
import conn from '../../db.js';
import { res200Json } from '../lib/common/response.js';

const router = Router();
const upload = multer();

// 新增一個 API 端點來處理前端的驗證請求
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  if (!id)
    return res.status(400)
      .json({ status: 'error', message: '缺少必要資訊。' });

  await conn.execute(
    'SELECT * FROM user_order_info WHERE user_id = ?',
    [id]
  ).then(([records]) => {
    if (records.length === 0) {
      //case 1 : 查無紀錄
      return res.status(200).json({
        status: 'success',
        message: '查無該用戶的訂單表單存檔',
        result: null
      });
    }
    //case 2 : 曾有紀錄
    if (records.length >= 2) {
      //若有兩筆以上，則刪除該 uid 對應之較早的所有資料
      const tediousIDList = records.map(r => r.id).slice(0, -1);
      for (const id of tediousIDList) {
        conn.execute(
          'DELETE FROM user_order_info WHERE `user_order_info`.`id` = ?',
          [id]
        ).catch(e => {
          console.log('刪除出了一點差錯');
          console.log(e.message);
        })
      }
    }
    return res.status(200).json({
      status: 'success',
      message: '有留存的訂單表單資料',
      result: records[0]
    });
  }).catch(err =>
    res.status(500).json({
      status: 'error',
      message: '資料庫查詢錯誤',
      error: err.message
    })
  );
});

// 新增一個 API 端點來處理前端的驗證請求
router.post('/', upload.none(), async (req, res) => {
  const {
    user_id = null,
    name = null,
    email = null,
    tel = null,
    city_id = null,
    zipcode = null,
    order_address = null,
    ship_ps = null
  } = req.body;

  [user_id, name, email, tel, city_id, zipcode, order_address, ship_ps]
    .forEach((v, i) => {
      if (v === null) {
        const keyword = ['user_id', 'name',
          'email', 'tel', 'city_id', 'zipcode',
          'order_address', 'ship_ps'][i];
        return res.status(400)
          .json({ status: 'rejected', message: `缺少必要資訊: ${keyword}` });
      }
    });

  const colNames = [`user_id`, `name`, `email`, `tel`, `city_id`, `zipcode`, `order_address`, `ship_ps`];
  const markStr = Array(colNames.length).fill('?').join(', ');
  await conn.execute(
    `INSERT INTO user_order_info (${colNames.join(', ')}) VALUES (${markStr});`,
    [user_id, name, email, tel, city_id, zipcode, order_address, ship_ps]
  ).then(([results]) => {
    res200Json(res,
      `已成功存進 user_order_info 資料庫，其 ID 為 ${results.insertId}`
    );
  }).catch(err => {
    res.status(500).json({
      status: 'error',
      message: 'user_order_info 資料庫新增失敗',
      error: err.message
    });
    console.log(err.message);
  });
});

export default router;