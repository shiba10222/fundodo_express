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
      id: row.id,
      name: row.name,
      brand: row.brand,
      cate_1: row.cate_1,
      cate_2: row.cate_2,
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
router.get("/filter-options", async (req, res) => {
  try {
    // 獲取類別和子類別
    const [categories] = await conn.execute(
      `SELECT DISTINCT cate_1, cate_2 FROM product`
    );

    // 獲取品牌和類別
    const [brandCategories] = await conn.execute(
      `SELECT DISTINCT category, brand FROM brand_category ORDER BY category, brand`
    );

    // 獲取價格範圍
    const [priceRange] = await conn.execute(
      `SELECT MIN(price) as min_price, MAX(price) as max_price FROM prod_price_stock`
    );

    // 處理類別和子類別
    const categoryStructure = categories.reduce((acc, curr) => {
      if (!acc[curr.cate_1]) acc[curr.cate_1] = [];
      if (curr.cate_2 && !acc[curr.cate_1].includes(curr.cate_2)) {
        acc[curr.cate_1].push(curr.cate_2);
      }
      return acc;
    }, {});

    // 處理按類別分類的品牌
    const categoryBrands = brandCategories.reduce((acc, { category, brand }) => {
      if (!acc[category]) {
        acc[category] = [];
      }
      if (!acc[category].includes(brand)) {
        acc[category].push(brand);
      }
      return acc;
    }, {});

    const filterOptions = {
      categories: categoryStructure,
      categoryBrands: categoryBrands,
      allCategories: Object.keys(categoryBrands),
      priceRange: {
        min: priceRange[0].min_price,
        max: priceRange[0].max_price
      }
    };

    res.status(200).json({ status: "success", filterOptions });
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
              GROUP_CONCAT(DISTINCT prod_picture.pic_name ORDER BY prod_picture.id)
           FROM 
              prod_picture
           WHERE 
              prod_picture.prod_id = product.id
          ) AS picNameArr,
           (SELECT 
              GROUP_CONCAT(prod_price_stock.sortname ORDER BY prod_price_stock.id)
           FROM 
              prod_price_stock
           WHERE 
              prod_price_stock.prod_id = product.id
          ) AS sortArr,
           (SELECT 
              GROUP_CONCAT(prod_price_stock.specname ORDER BY prod_price_stock.id)
           FROM 
              prod_price_stock
           WHERE 
              prod_price_stock.prod_id = product.id
          ) AS specArr,
           (SELECT 
              GROUP_CONCAT(prod_price_stock.stock ORDER BY prod_price_stock.id)
           FROM 
              prod_price_stock
           WHERE 
              prod_price_stock.prod_id = product.id
          ) AS stockArr,
          (SELECT 
              GROUP_CONCAT(prod_price_stock.price ORDER BY prod_price_stock.id) 
           FROM 
              prod_price_stock
           WHERE 
              prod_price_stock.prod_id = product.id
          ) AS priceArr
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
});

//================== 匯出
export default router;