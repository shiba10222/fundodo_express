import { Router } from "express";
import conn from '../db.js';

const router = Router();

router.get("/", async (req, res) => {
  try {
    const [rows] = await conn.execute(
      `SELECT
          product.id,
          product.name,
          (SELECT 
              GROUP_CONCAT(prod_price_stock.price ORDER BY prod_price_stock.price) 
           FROM 
              prod_price_stock
           WHERE 
              prod_price_stock.prod_id = product.id
          ) AS priceArr,
          GROUP_CONCAT(DISTINCT prod_picture.pic_name ORDER BY prod_picture.pic_name) AS picNameArr
      FROM
          product
      LEFT JOIN 
          prod_price_stock ON prod_price_stock.prod_id = product.id
      LEFT JOIN 
          prod_picture ON prod_picture.prod_id = product.id
      GROUP BY
          product.id`
    );

    const productList = rows.map(row => ({
      id:row.id,
      name: row.name,
      priceArr: row.priceArr ? row.priceArr.split(',').map(Number) : [],
      picNameArr: row.picNameArr ? row.picNameArr.split(',') : []
    }));

    // console.log(productList);
    res.status(200).send({ status: "success", message: '回傳所有商品資料', productList });
  } catch (error) {
    console.error('資料庫查詢錯誤：', error);
    res.status(500).json({ status: "error", message: '資料庫查詢錯誤', error: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id
    const [rows] = await conn.execute(
      `SELECT
          product.id,
          product.name,
          product.brand,
          product.cate_1,
          product.cate_2,
          product.is_near_expired,
          product.is_refurbished,
          product.description,
          (SELECT 
              GROUP_CONCAT(prod_price_stock.price ORDER BY prod_price_stock.price) 
           FROM 
              prod_price_stock
           WHERE 
              prod_price_stock.prod_id = product.id
          ) AS priceArr,
           (SELECT 
              GROUP_CONCAT(DISTINCT prod_picture.pic_name ORDER BY prod_picture.pic_name)
           FROM 
              prod_picture
           WHERE 
              prod_picture.prod_id = product.id
          ) AS picNameArr,
           
          
           (SELECT 
              GROUP_CONCAT(DISTINCT prod_price_stock.sortname ORDER BY prod_price_stock.sortname)
           FROM 
              prod_price_stock
           WHERE 
              prod_price_stock.prod_id = product.id
          ) AS sortArr,
           (SELECT 
              GROUP_CONCAT(DISTINCT prod_price_stock.specname ORDER BY prod_price_stock.specname)
           FROM 
              prod_price_stock
           WHERE 
              prod_price_stock.prod_id = product.id
          ) AS specArr
      FROM
          product
      LEFT JOIN 
          prod_price_stock ON prod_price_stock.prod_id = product.id
      LEFT JOIN 
          prod_picture ON prod_picture.prod_id = product.id
      WHERE
          product.id = ?
      GROUP BY
          product.id`,
      [id]
    )
    if (rows.length > 0) {
      const product = rows[0];
      product.priceArr = product.priceArr ? product.priceArr.split(',').map(Number) : [];
      product.picNameArr = product.picNameArr ? product.picNameArr.split(',') : [];
      product.stockArr = product.stockArr ? product.stockArr.split(',') : [];
      product.sortArr = product.sortArr ? product.sortArr.split(',') : [];
      product.specArr = product.specArr ? product.specArr.split(',') : [];

      res.status(200).json({
        status: "success",
        message: "找到指定的商品了!",
        product
      });
    } else {
      res.status(404).json({
        status: "error",
        message: "找不到該商品"
      });
    }
  } catch (error) {
    console.error('資料庫查詢錯誤：', error);
    res.status(500).json({ status: "error", message: '資料庫查詢錯誤', error: error.message });
  }

})

//================== 匯出
export default router;