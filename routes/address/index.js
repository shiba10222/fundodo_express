import { Router } from 'express';
import conn from "../../db.js";

//================== 初始化
const router = Router();

//================== 設置路由架構
router.get('/', (req, res) => {
  res.status(200).json({
    status: "success or so",
    message: "尼豪，歡迎乃到本區域。要使用服務請輸入更完整的路由網址",
    choices: {
      area: "東南西北離島",
      city: "縣市",
      dist: "鄉鎮區",
    }
  });
});

//查詢所有縣市
router.get('/city', async (_, res) => {
  const [rows] = await conn.query("SELECT id, name FROM tw_citys WHERE 1");

  if (rows.length === 0)
    res.json({ status: "error", message: "未如預期讀取資料" });
  else
    res.json({ status: "success", message: "成功", results: rows });
});

//查詢指定區域內的所有縣市
router.get('/city/:id', async (req, res) => {
  const city_id = req.params.id;
  const [rows] = await conn.query(
    "SELECT id, name FROM tw_citys WHERE area_id = ?",
    [city_id]
  );

  if (rows.length === 0)
    res.json({ status: "error", message: "未如預期讀取資料" });
  else
    res.json({ status: "success", message: "成功", results: rows });
});

router.get('/dist/:id', async (req, res) => {
  const city_id = req.params.id;

  const [rows] = await conn.query(
    "SELECT name, zipcode FROM tw_dist WHERE city_id = ?", [city_id]
  );
  if (rows.length === 0)
    res.json({ status: "error", message: "未如預期讀取資料" });
  else {
    const results = rows;
    res.json({ status: "success", message: "成功", results });
  }
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