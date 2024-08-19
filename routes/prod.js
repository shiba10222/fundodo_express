import { Router } from "express";
import conn from '../db.js';  // 導入資料庫連接

const router = Router();  // 創建 Express 路由器實例

// 獲取產品列表的路由，支持多種篩選條件
router.get("/", async (req, res) => {
  try {
    // 從查詢參數中解構出篩選條件
    const { category, subcategory, brand, minPrice, maxPrice } = req.query;

    // 構建基本的 SQL 查詢
    // 這個查詢使用了多個子查詢來獲取每個產品的價格數組和圖片名稱數組
    let query = `
      SELECT
        product.id,
        product.name,
        product.brand,
        product.cate_1 as category,
        product.cate_2 as subcategory,   
       (SELECT 
              GROUP_CONCAT(prod_price_stock.price ORDER BY prod_price_stock.id) 
           FROM 
              prod_price_stock
           WHERE 
              prod_price_stock.prod_id = product.id
          ) AS priceArr,  -- 使用子查詢獲取每個產品的所有價格
       (SELECT DISTINCT
              GROUP_CONCAT(prod_picture.pic_name ORDER BY prod_picture.id) 
           FROM 
              prod_picture
           WHERE 
              prod_picture.prod_id = product.id
          ) AS picNameArr  -- 使用子查詢獲取每個產品的所有圖片名稱
      FROM
        product
      LEFT JOIN 
        prod_price_stock ON prod_price_stock.prod_id = product.id
      LEFT JOIN 
        prod_picture ON prod_picture.prod_id = product.id
      WHERE 1=1  -- 這個條件總是為真，用於開始 WHERE 子句
    `;

    const params = [];  // 用於存儲查詢參數的數組

    // 根據篩選條件動態添加 WHERE 子句
    if (category) {
      query += ` AND product.cate_1 = ?`;  // 添加類別篩選
      params.push(category);
    }
    if (subcategory) {
      query += ` AND product.cate_2 = ?`;  // 添加子類別篩選
      params.push(subcategory);
    }
    if (brand) {
      query += ` AND product.brand = ?`;  // 添加品牌篩選
      params.push(brand);
    }
    if (minPrice) {
      // 使用 EXISTS 子查詢來檢查是否存在大於或等於最小價格的價格
      query += ` AND EXISTS (SELECT 1 FROM prod_price_stock pps WHERE pps.prod_id = product.id AND pps.price >= ?)`;
      params.push(minPrice);
    }
    if (maxPrice) {
      // 使用 EXISTS 子查詢來檢查是否存在小於或等於最大價格的價格
      query += ` AND EXISTS (SELECT 1 FROM prod_price_stock pps WHERE pps.prod_id = product.id AND pps.price <= ?)`;
      params.push(maxPrice);
    }

    query += ` GROUP BY product.id`;  // 按產品 ID 分組，確保每個產品只返回一次

    // 執行 SQL 查詢
    const [rows] = await conn.execute(query, params);

    // 處理查詢結果，將字符串轉換為數組
    const productList = rows.map(row => ({
      id: row.id,
      name: row.name,
      brand: row.brand,
      category: row.category,
      subcategory: row.subcategory,
      priceArr: row.priceArr ? row.priceArr.split(',').map(Number) : [],  // 將價格字符串轉換為數字數組
      picNameArr: row.picNameArr ? row.picNameArr.split(',') : []  // 將圖片名稱字符串轉換為數組
    }));

    // 發送成功響應
    res.status(200).send({ status: "success", message: '回傳篩選後的商品資料', productList });
  } catch (error) {
    // 錯誤處理
    console.error('資料庫查詢錯誤：', error);
    res.status(500).json({ status: "error", message: '資料庫查詢錯誤', error: error.message });
  }
});

// 獲取篩選選項的路由
router.get("/filter-options", async (req, res) => {
  try {
    // 獲取所有唯一的類別和子類別
    const [categories] = await conn.execute(
      `SELECT DISTINCT cate_1, cate_2 FROM product`
    );

    // 獲取所有唯一的品牌和類別組合 每個類別會有相對應的品牌
    const [brandCategories] = await conn.execute(
      `SELECT DISTINCT category, brand FROM brand_category ORDER BY category, brand`
    );

    // 獲取價格範圍（最小值和最大值）
    const [priceRange] = await conn.execute(
      `SELECT MIN(price) as min_price, MAX(price) as max_price FROM prod_price_stock`
    );

    // 處理類別和子類別數據=========================
    // categories = [
    // { cate_1: "寵物食品", cate_2: "狗糧" },
    // { cate_1: "寵物食品", cate_2: "貓糧" },
    // { cate_1: "寵物食品", cate_2: "狗糧" }, // 重複項
    // { cate_1: "寵物用品", cate_2: "玩具" },
    // { cate_1: "寵物用品", cate_2: "床" },
    // { cate_1: "寵物食品", cate_2: "貓零食" }]
    // 經過這段代碼處理後，categoryStructure = {
    // "寵物食品": ["狗糧", "貓糧", "貓零食"],
    // "寵物用品": ["玩具", "床"]}

    const categoryStructure = categories.reduce((acc, curr) => {// 使用 reduce 方法遍歷 categories 陣列。reduce 方法允許我們將陣列轉換為單個值。
      // acc 累加器(存儲我們正在構建的類別結構對象) curr當前值(當前正在處理的類別項，包含 cate_1（主類別）和 cate_2（子類別）)
      if (!acc[curr.cate_1]) acc[curr.cate_1] = [];// 檢查累加器對象中是否已經有當前主類別的鍵，如果沒有，則為這個主類別創建一個空數組。
      if (curr.cate_2 && !acc[curr.cate_1].includes(curr.cate_2)) {
        acc[curr.cate_1].push(curr.cate_2);
      }
      return acc;
    }, {});

    //============================================

    // 處理品牌和類別數據，創建一個按類別分類的品牌對象
    const categoryBrands = brandCategories.reduce((acc, { category, brand }) => {
      if (!acc[category]) {
        acc[category] = [];
      }
      if (!acc[category].includes(brand)) {
        acc[category].push(brand);
      }
      return acc;
    }, {});

    // 組合所有篩選選項
    const filterOptions = {
      categories: categoryStructure,
      categoryBrands: categoryBrands,
      allCategories: Object.keys(categoryBrands),
      priceRange: {
        min: priceRange[0].min_price,
        max: priceRange[0].max_price
      }
    };

    // 發送成功響應
    res.status(200).json({ status: "success", filterOptions });
  } catch (error) {
    // 錯誤處理
    console.error('資料庫查詢錯誤：', error);
    res.status(500).json({ status: "error", message: '資料庫查詢錯誤', error: error.message });
  }
});

// 獲取單個產品詳細信息的路由
router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id  // 從 URL 參數中獲取產品 ID
    // 執行 SQL 查詢獲取產品詳細信息
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
          ) AS picNameArr,  -- 獲取所有圖片名稱
           (SELECT 
              GROUP_CONCAT(prod_price_stock.sortname ORDER BY prod_price_stock.id)
           FROM 
              prod_price_stock
           WHERE 
              prod_price_stock.prod_id = product.id
          ) AS sortArr,  -- 獲取所有排序名稱
           (SELECT 
              GROUP_CONCAT(prod_price_stock.specname ORDER BY prod_price_stock.id)
           FROM 
              prod_price_stock
           WHERE 
              prod_price_stock.prod_id = product.id
          ) AS specArr,  -- 獲取所有規格名稱
           (SELECT 
              GROUP_CONCAT(prod_price_stock.stock ORDER BY prod_price_stock.id)
           FROM 
              prod_price_stock
           WHERE 
              prod_price_stock.prod_id = product.id
          ) AS stockArr,  -- 獲取所有庫存數量
          (SELECT 
              GROUP_CONCAT(prod_price_stock.price ORDER BY prod_price_stock.id) 
           FROM 
              prod_price_stock
           WHERE 
              prod_price_stock.prod_id = product.id
          ) AS priceArr  -- 獲取所有價格
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
      // 將字符串轉換為數組
      product.priceArr = product.priceArr ? product.priceArr.split(',').map(Number) : [];
      product.picNameArr = product.picNameArr ? product.picNameArr.split(',') : [];
      product.stockArr = product.stockArr ? product.stockArr.split(',') : [];
      product.sortArr = product.sortArr ? product.sortArr.split(',') : [];
      product.specArr = product.specArr ? product.specArr.split(',') : [];

      // 發送成功響應
      res.status(200).json({
        status: "success",
        message: "找到指定的商品了!",
        product
      });
    } else {
      // 如果沒有找到產品，發送 404 錯誤
      res.status(404).json({
        status: "error",
        message: "找不到該商品"
      });
    }
  } catch (error) {
    // 錯誤處理
    console.error('資料庫查詢錯誤：', error);
    res.status(500).json({ status: "error", message: '資料庫查詢錯誤', error: error.message });
  }
});

// 導出路由器
export default router;