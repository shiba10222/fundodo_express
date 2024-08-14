import { Router } from "express";
import conn from '../db.js';

const router = Router();

router.get("/", async (req, res) => {
  try {
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
          GROUP_CONCAT(DISTINCT prod_price_stock.sortname ORDER BY prod_price_stock.sortname) AS sortArr,
          GROUP_CONCAT(DISTINCT prod_price_stock.specname ORDER BY prod_price_stock.specname) AS specArr,
          GROUP_CONCAT(DISTINCT prod_picture.pic_name ORDER BY prod_picture.pic_name) AS picNameArr,
          GROUP_CONCAT(DISTINCT prod_tag.tag ORDER BY prod_tag.tag) AS tagArr,
          GROUP_CONCAT(DISTINCT prod_age.age ORDER BY prod_age.age) AS ageArr
      FROM
          product
      LEFT JOIN 
          prod_price_stock ON prod_price_stock.prod_id = product.id
      LEFT JOIN 
          prod_picture ON prod_picture.prod_id = product.id
      LEFT JOIN 
          prod_tag ON prod_tag.prod_id = product.id
      LEFT JOIN 
          prod_age ON prod_age.prod_id = product.id
      GROUP BY
          product.id`
    );
    
    const productList = rows.map(row => ({
      id: row.id,
      name: row.name,
      brand: row.brand,
      cate_1: row.cate_1,
      cate_2: row.cate_2,
      is_near_expired: row.is_near_expired,
      is_refurbished: row.is_refurbished,
      desc: row.description,
      sortArr: row.sortArr ? row.sortArr.split(',') : [],
      specArr: row.specArr ? row.specArr.split(',') : [],
      priceArr: row.priceArr ? row.priceArr.split(',').map(Number) : [],
      picNameArr: row.picNameArr ? row.picNameArr.split(',') : [],
      others: {
        tagArr: row.tagArr ? row.tagArr.split(',') : [],
        ageArr: row.ageArr ? row.ageArr.split(',') : []
      }
    }));
    
    console.log(productList);
    res.status(200).send({ status: "success", message: '回傳所有商品資料', productList });
  } catch (error) {
    console.error('資料庫查詢錯誤：', error);
    res.status(500).json({ status: "error", message: '資料庫查詢錯誤', error: error.message });
  }
});


router.get("/detail/:id",async (req, res) => {
  const id = req.params.id
  try {
    const [row] = conn.execute(
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
          GROUP_CONCAT(DISTINCT prod_price_stock.sortname ORDER BY prod_price_stock.sortname) AS sortArr,
          GROUP_CONCAT(DISTINCT prod_price_stock.specname ORDER BY prod_price_stock.specname) AS specArr,
          GROUP_CONCAT(DISTINCT prod_picture.pic_name ORDER BY prod_picture.pic_name) AS picNameArr,
          GROUP_CONCAT(DISTINCT prod_tag.tag ORDER BY prod_tag.tag) AS tagArr,
          GROUP_CONCAT(DISTINCT prod_age.age ORDER BY prod_age.age) AS ageArr
      FROM
          product
      LEFT JOIN 
          prod_price_stock ON prod_price_stock.prod_id = product.id
      LEFT JOIN 
          prod_picture ON prod_picture.prod_id = product.id
      LEFT JOIN 
          prod_tag ON prod_tag.prod_id = product.id
      LEFT JOIN 
          prod_age ON prod_age.prod_id = product.id
      WHERE
          product.id = ?
      GROUP BY
          product.id`, 
      [id]
    );
    if (rows.length === 0) {
      return res.status(404).json({ status: "error", message: "產品未找到" });
    }
    
    const product = rows.map(row => ({
      id: row.id,
      name: row.name,
      brand: row.brand,
      cate_1: row.cate_1,
      cate_2: row.cate_2,
      is_near_expired: row.is_near_expired,
      is_refurbished: row.is_refurbished,
      desc: row.description,
      sortArr: row.sortArr ? row.sortArr.split(',') : [],
      specArr: row.specArr ? row.specArr.split(',') : [],
      priceArr: row.priceArr ? row.priceArr.split(',').map(Number) : [],
      picNameArr: row.picNameArr ? row.picNameArr.split(',') : [],
      others: {
        tagArr: row.tagArr ? row.tagArr.split(',') : [],
        ageArr: row.ageArr ? row.ageArr.split(',') : []
      }
    }))[0];
  } catch (error) {
    
  }
  res.status(200).json({
    status: "success",
    message: "找到指定的商品了!",
    product
  });
})

//================== 匯出
export default router;