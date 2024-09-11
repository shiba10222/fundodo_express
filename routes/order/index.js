import { Router } from 'express';
import multer from 'multer';
import conn from '../../db.js';
import { getTimeStr_DB } from '../lib/common/time.js';
import { res200Json, res400Json } from '../lib/common/response.js';
import { v4 as uuid4 } from 'uuid';

//================== 初始化
const router = Router();
const upload = multer();

//==================================================
//================== 設置路由架構 ====================
//==================================================
//================== 路由之根
router.get('/', (_, res) => {
  res.status(400).json({
    status: "Bad Request",
    message: "尼豪，歡迎乃到 order 區域。要使用服務請輸入更完整的路由網址"
  });
});

//======== 讀取指定 ==========//
//【核心功能】查詢使用者的購物車內容
router.get('/:uid', async (req, res) => {
  const uid = Number(req.params.uid);

  /**
   * 查詢一筆或是全部
   * @description 1 | 全部 ; 0 | 僅最新一筆
   */
  const code = Object.prototype.hasOwnProperty.call(req.query, 'all')
    ? Number(req.query.all)
    : 1;
  const showAll = !!code;

  //== 1 ==== 查詢 cart_PD
  const [rows] = await conn.query(
    `SELECT * FROM orders WHERE user_id = ?
    ORDER BY orders.id DESC`,
    [uid]
  );

  if (rows.length === 0) {
    res.status(200).json({
      status: "success",
      message: "查詢成功，此帳號沒有歷史訂單紀錄",
      results: []
    });
    return;
  }

  const orderList = rows.map(pkg => {
    const { id, user_id, deleted_at, ...others } = pkg;
    return others;
  })

  res200Json(res,
    "訂單查詢成功",
    showAll ? orderList : orderList[0]
  )
  // res.status(200).json({
  //   status: "success",
  //   message: "查詢成功",
  //   results: showAll ? orderList : orderList[0]
  // });
});

//======== 新增資料 ==========//
//================== 輸入資料表 orders
router.post('/', upload.none(), async (req, res) => {
  //驗證資料是否完整
  const colArr = ['user_id', 'amount', 'addressee', 'tel', 'email', 'pay_thru', 'ship_thru', 'ship_zipcode', 'ship_shop', 'ship_address', 'ship_ps'];
  if (colArr.some(keyword => {
    if (Object.prototype.hasOwnProperty.call(req.body, keyword) === false) {
      res400Json(res, `訂單格式錯誤，請求缺少 ${keyword} 參數`);
      return true;
    }
    return false;
  })
  ) return;

  //生成 uuid
  const timeStr = getTimeStr_DB(new Date()).split(' ')[0].replaceAll('-', '');
  const orderSeries = timeStr + uuid4().slice(-10);

  //handle the sql query
  
  const valueArr = colArr.map(key => req.body[key]);
  colArr.push('created_at', 'uuid');
  const colStr = colArr.join(', ');
  valueArr.push(timeStr, orderSeries);
  
  const markStr = Array(valueArr.length).fill('?').join(', ');
  const sql = `INSERT INTO orders (${colStr}) VALUES (${markStr})`;

  await conn.execute(sql, valueArr)
    .then(([results]) => {
      if (results.affectedRows < 1) throw new Error(`寫入 orders 資料表失敗`);

      res200Json(res,
        `成功於 orders 資料表匯入 ${results.affectedRows} 筆訂單`,
        { order_id: results.insertId }
      );
    }).catch(err => {
      console.error(err.message);
    })
});

//================== 輸入資料表 order_items
router.post('/items', upload.none(), async (req, res) => {
  //驗證資料是否完整: 大架構
  if (['order_id', 'purchaseItems'].some(keyword => {
    if (Object.prototype.hasOwnProperty.call(req.body, keyword) === false) {
      res.status(400).json({ status: "rejected", message: `格式錯誤，請求缺少 ${keyword} 參數` });
      return true;
    }
    return false;
  })
  ) return;

  const { order_id, purchaseItems } = req.body;

  //驗證資料是否完整: 逐筆檢查
  const colArr = ['purchase_id', 'purchase_sort', 'purchase_price', 'room_type'];
  if (purchaseItems.some(item =>
    colArr.some(keyword => {
      if (Object.prototype.hasOwnProperty.call(item, keyword) === false) {
        const text = (keyword === 'purchase_id')
          ? '沒有符合格式'
          : `${item.purchase_id} 的資料不完整`;

        res.status(400).json({
          status: "rejected",
          message: `order ID ${order_id} 中，purchase_id ${text}`,
          rejected_item: JSON.stringify(item)
        });
        return true;
      }
      return false;
    })
  )) return;

  //逐筆匯入資料表
  let counter = 0;

  await Promise.all(
    purchaseItems.map(async (item) => {
      const colStr = colArr.join(', ') + ', order_id';
      const valueArr = colArr.map(key => {
        if (item.purchase_sort === 'HT' && key === 'room_type') {
          const char = item[key].slice(0, 1);
          if (['小', '中', '大', 'S', 'M', 'L'].indexOf(char) !== -1) {
            switch (char) {
              case '小': return 'S';
              case '中': return 'M';
              case '大': return 'L';
              default: return 'L';
            }
          } else return 'L';
        }

        return item[key];
      });
      valueArr.push(order_id);
      const markStr = Array(valueArr.length).fill('?').join(', ');
      const sql = `INSERT INTO order_items (${colStr}) VALUES (${markStr})`;

      await conn.execute(sql, valueArr)
        .then(([results]) => {
          if (results.affectedRows < 1) throw new Error(`寫入 orders 資料表失敗`);

          counter++;
        }).catch(err => {
          console.error(err.message);
        });
    })
  );
  res.status(200).json({
    status: "success",
    message: `成功匯入 ${counter} 筆於資料表 order_items`
  });

});

//======== handle 404
router.all('*', (req, res) => {
  res.status(404).json({
    status: "success",
    message: "喔不！order 這裡迷有諸葛網紫。請修正尼要使用的路由網紫"
  });
});

//================== 匯出
export default router;