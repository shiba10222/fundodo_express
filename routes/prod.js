import { Router } from "express";
import conn from '../db.js';
import authenticateToken from './member/auth/authToken.js';
import multer from 'multer';
import path from 'path';

const router = Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/upload/reviews')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname))
  }
});

const upload = multer({ storage: storage });

// 獲取產品列表的路由，支持多種篩選條件
router.get("/", async (req, res) => {
  try {
    const { category, subcategory, brand, minPrice, maxPrice, sortBy, tag, page = 1, limit = 12, search, age } = req.query;
    const offset = (parseInt(page) - 1) * parseInt(limit);

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
        ) AS priceArr,
        (SELECT 
          GROUP_CONCAT(DISTINCT prod_picture.pic_name ORDER BY prod_picture.id)
        FROM 
          prod_picture
        WHERE 
          prod_picture.prod_id = product.id
        ) AS picNameArr,
        (SELECT 
          GROUP_CONCAT(DISTINCT prod_tag.tag ORDER BY prod_tag.id)
        FROM 
          prod_tag
        WHERE 
          prod_tag.prod_id = product.id
        ) AS tagArr,
         (SELECT 
          GROUP_CONCAT(DISTINCT prod_age.age ORDER BY prod_age.id)
        FROM 
          prod_age
        WHERE 
          prod_age.prod_id = product.id
        ) AS ageArr
      FROM
        product
      WHERE 1=1
    `;

    const params = [];

    // 添加搜索條件
    if (search) {
      query += ` AND (product.name LIKE ? OR product.brand LIKE ? OR product.cate_1 LIKE ? OR product.cate_2 LIKE ?)`;
      const searchParam = `%${search}%`;
      params.push(searchParam, searchParam, searchParam, searchParam);
    }

    // 添加篩選條件
    if (category) {
      query += ` AND product.cate_1 = ?`;
      params.push(category);
    }
    if (subcategory) {
      query += ` AND product.cate_2 = ?`;
      params.push(subcategory);
    }
    if (brand) {
      query += ` AND product.brand = ?`;
      params.push(brand);
    }
    if (minPrice) {
      query += ` AND EXISTS (SELECT 1 FROM prod_price_stock pps WHERE pps.prod_id = product.id AND pps.price >= ?)`;
      params.push(minPrice);
    }
    if (maxPrice) {
      query += ` AND EXISTS (SELECT 1 FROM prod_price_stock pps WHERE pps.prod_id = product.id AND pps.price <= ?)`;
      params.push(maxPrice);
    }
    if (tag) {
      query += ` AND EXISTS (SELECT 1 FROM prod_tag pt WHERE pt.prod_id = product.id AND pt.tag = ?)`;
      params.push(tag);
    }
    if (age) {
      query += ` AND EXISTS (SELECT 1 FROM prod_age WHERE prod_age.prod_id = product.id AND prod_age.age = ?)`;
      params.push(age);
    }

    // 添加分組
    query += ` GROUP BY product.id`;

    // 添加排序
    switch (sortBy) {
      case 'price_asc':
        query += ` ORDER BY CAST(SUBSTRING_INDEX(priceArr, ',', 1) AS DECIMAL(10,2)) ASC`;
        break;
      case 'price_desc':
        query += ` ORDER BY CAST(SUBSTRING_INDEX(priceArr, ',', 1) AS DECIMAL(10,2)) DESC`;
        break;
      case 'newest':
        query += ` ORDER BY product.id DESC`;
        break;
      default:
        query += ` ORDER BY product.id ASC`;
    }

    // 添加分頁
    query += ` LIMIT ? OFFSET ?`;
    params.push(parseInt(limit), offset);

    // 執行 SQL 查詢
    const [rows] = await conn.execute(query, params);

    // 處理查詢結果
    const productList = rows.map(row => ({
      id: row.id,
      name: row.name,
      brand: row.brand,
      category: row.category,
      subcategory: row.subcategory,
      priceArr: row.priceArr ? row.priceArr.split(',').map(Number) : [],
      picNameArr: row.picNameArr ? row.picNameArr.split(',') : [],
      tagArr: row.tagArr ? row.tagArr.split(',') : [],
      ageArr: row.ageArr ? row.ageArr.split(',') : []
    }));

    // 計算總頁數
    const [countResult] = await conn.execute(
      `SELECT COUNT(DISTINCT product.id) as total FROM product WHERE 1=1 ${query.split('WHERE 1=1')[1].split('GROUP BY')[0]
      }`,
      params.slice(0, -2)
    );
    const totalCount = countResult[0].total;
    const totalPages = Math.ceil(totalCount / parseInt(limit));

    res.status(200).send({
      status: "success",
      message: '回傳篩選後的商品資料',
      productList,
      totalPages,
      currentPage: parseInt(page)
    });
  } catch (error) {
    console.error('資料庫查詢錯誤：', error);
    res.status(500).json({ status: "error", message: '資料庫查詢錯誤', error: error.message });
  }
});

// 獲取待審核的評論（用於後台）
router.get("/reviews/pending", async (req, res) => {
  try {
    const [rows] = await conn.execute(
      `SELECT * FROM product_reviews`
    );

    res.json({
      status: "success",
      pendingReviews: rows
    });
  } catch (error) {
    console.error('獲取待審核評論失敗:', error);
    res.status(500).json({ status: "error", message: '獲取待審核評論失敗', error: error.message });
  }
});

router.get("/recommended", async (req, res) => {
  try {
    const { category, excludeId, limit = 4 } = req.query;

    if (!category) {
      return res.status(400).json({ status: "error", message: "必須提供類別參數" });
    }

    const query = `
      SELECT
        product.id,
        product.name,
        product.brand,
        product.cate_1 as category,
        product.cate_2 as subcategory,
        (SELECT 
          MIN(prod_price_stock.price)
        FROM 
          prod_price_stock
        WHERE 
          prod_price_stock.prod_id = product.id
        ) AS price,
        (SELECT 
          pic_name
        FROM 
          prod_picture
        WHERE 
          prod_picture.prod_id = product.id
        LIMIT 1
        ) AS image
      FROM
        product
      WHERE
        product.cate_1 = ?
        ${excludeId ? 'AND product.id != ?' : ''}
      ORDER BY RAND()
      LIMIT ?
    `;

    const params = excludeId
      ? [category, excludeId, parseInt(limit)]
      : [category, parseInt(limit)];

    const [rows] = await conn.execute(query, params);

    // 處理查詢結果
    const recommendedProducts = rows.map(row => ({
      id: row.id,
      name: row.name,
      brand: row.brand,
      category: row.category,
      subcategory: row.subcategory,
      price: row.price,
      image: row.image
    }));

    res.status(200).json({
      status: "success",
      message: '獲取推薦產品成功',
      products: recommendedProducts
    });
  } catch (error) {
    console.error('獲取推薦產品錯誤：', error);
    res.status(500).json({ status: "error", message: '獲取推薦產品錯誤', error: error.message });
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
    const [ages] = await conn.execute(
      `SELECT DISTINCT age FROM prod_age ORDER BY age`
    );
    // 獲取價格範圍（最小值和最大值）
    const [priceRange] = await conn.execute(
      `SELECT MIN(price) as min_price, MAX(price) as max_price FROM prod_price_stock`
    );
    const [tags] = await conn.execute(
      `SELECT DISTINCT tag FROM prod_tag ORDER BY tag`
    );
    // 處理類別和子類別數據
    const categoryStructure = categories.reduce((acc, curr) => {
      if (!acc[curr.cate_1]) acc[curr.cate_1] = [];
      if (curr.cate_2 && !acc[curr.cate_1].includes(curr.cate_2)) {
        acc[curr.cate_1].push(curr.cate_2);
      }
      return acc;
    }, {});

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
      },
      ages: ages.map(age => age.age), // 新增年齡選項
      tags: tags.map(t => t.tag)
    };

    // 發送成功響應
    res.status(200).json({ status: "success", filterOptions });
  } catch (error) {
    // 錯誤處理
    console.error('資料庫查詢錯誤：', error);
    res.status(500).json({ status: "error", message: '資料庫查詢錯誤', error: error.message });
  }
});

router.get('/favorites', authenticateToken, async (req, res) => {
  const userId = req.user.userId;

  console.log('Fetching favorites for user:', userId);

  try {
    const [rows] = await conn.execute(
      `SELECT id, product_id, product_name, product_price, product_image 
       FROM favorites 
       WHERE user_id = ?`,
      [userId]
    );

    console.log('Favorites found:', rows.length);

    if (rows.length === 0) {
      return res.status(200).json({ status: "success", message: "用戶沒有收藏的商品", favorites: [] });
    }

    res.status(200).json({ status: "success", message: "成功獲取收藏商品", favorites: rows });
  } catch (error) {
    console.error('獲取收藏商品失敗:', error);
    res.status(500).json({ status: "error", message: '獲取收藏商品失敗', details: error.message });
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
              GROUP_CONCAT(DISTINCT prod_price_stock.id ORDER BY prod_price_stock.id)
           FROM 
              prod_price_stock
           WHERE 
              prod_price_stock.prod_id = product.id
          ) AS pidArr,
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
          ) AS priceArr,
           (SELECT 
          GROUP_CONCAT(DISTINCT prod_tag.tag ORDER BY prod_tag.id)
        FROM 
          prod_tag
        WHERE 
          prod_tag.prod_id = product.id
        ) AS tagArr,
         (SELECT 
          GROUP_CONCAT(DISTINCT prod_age.age ORDER BY prod_age.id)
        FROM 
          prod_age
        WHERE 
          prod_age.prod_id = product.id
        ) AS ageArr
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
      product.pidArr = product.pidArr ? product.pidArr.split(',').map(Number) : [];
      product.priceArr = product.priceArr ? product.priceArr.split(',').map(Number) : [];
      product.picNameArr = product.picNameArr ? product.picNameArr.split(',') : [];
      product.stockArr = product.stockArr ? product.stockArr.split(',') : [];
      product.sortArr = product.sortArr ? product.sortArr.split(',') : [];
      product.specArr = product.specArr ? product.specArr.split(',') : [];
      product.tagArr = product.tagArr ? product.tagArr.split(',') : [];
      product.ageArr = product.ageArr ? product.ageArr.split(',') : [];

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

router.get('/check/:productId', authenticateToken, async (req, res) => {
  const { productId } = req.params;
  const userId = req.user.userId;

  console.log('Checking favorite for user:', userId, 'product:', productId);

  if (!userId) {
    return res.status(401).json({ error: '未授權的請求' });
  }

  try {
    const [rows] = await conn.execute(
      'SELECT * FROM favorites WHERE user_id = ? AND product_id = ?',
      [userId, productId]
    );

    console.log('Query result:', rows);

    res.json({ isFavorite: rows.length > 0 });
  } catch (error) {
    console.error('檢查收藏狀態失敗:', error);
    res.status(500).json({ error: '檢查收藏狀態失敗', details: error.message });
  }
});


// 添加收藏
router.post('/', authenticateToken, async (req, res) => {
  const { productId, productData } = req.body;
  const userId = req.user.userId; // 確保這裡使用正確的 userId

  console.log('Adding favorite for user:', userId, 'product:', productId);

  try {
    await conn.execute(
      'INSERT INTO favorites (user_id, product_id, product_name, product_price, product_image) VALUES (?, ?, ?, ?, ?)',
      [userId, productId, productData.name, productData.price, productData.image]
    );

    res.status(201).json({ message: '成功加入收藏' });
  } catch (error) {
    console.error('加入收藏失敗:', error);
    res.status(500).json({ error: '加入收藏失敗', details: error.message });
  }
});

// 移除收藏
router.delete('/', authenticateToken, async (req, res) => {
  const { productId } = req.body;
  const userId = req.user.userId; // 確保這裡使用正確的 userId

  console.log('Removing favorite for user:', userId, 'product:', productId);

  try {
    await conn.execute(
      'DELETE FROM favorites WHERE user_id = ? AND product_id = ?',
      [userId, productId]
    );

    res.json({ message: '成功移除收藏' });
  } catch (error) {
    console.error('移除收藏失敗:', error);
    res.status(500).json({ error: '移除收藏失敗', details: error.message });
  }
});

// POST 路由用於創建新評論
router.post('/reviews', upload.single('image'), async (req, res) => {
  try {
    const { rating, review_text, productId, userId, userName } = req.body;
    let image_url = null;

    if (req.file) {
      // 如果上傳了圖片，設置 image_url
      image_url = `/upload/reviews/${req.file.filename}`;
    }

    // 將評論數據插入數據庫
    const [result] = await conn.execute(
      'INSERT INTO product_reviews (product_id, user_id, username, rating, review_text, image_url, status) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [productId, userId, userName, rating, review_text, image_url, 'pending']
    );

    res.status(201).json({ success: true, message: '評論已提交，等待審核' });
  } catch (error) {
    console.error('提交評論時發生錯誤:', error);
    res.status(500).json({ success: false, message: '提交評論失敗' });
  }
});

// 更新評論狀態（用於後台）
router.patch("/reviews/:reviewId/status", async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { status } = req.body;

    if (!['pending', 'approved', 'rejected'].includes(status)) {
      return res.status(400).json({ status: "error", message: "無效的狀態" });
    }

    await conn.execute(
      `UPDATE product_reviews SET status = ? WHERE id = ?`,
      [status, reviewId]
    );

    res.json({
      status: "success",
      message: "評論狀態已更新"
    });
  } catch (error) {
    console.error('更新評論狀態失敗:', error);
    res.status(500).json({ status: "error", message: '更新評論狀態失敗', error: error.message });
  }
});

// 獲取產品評論
router.get("/reviews/:productId", async (req, res) => {
  try {
    const { productId } = req.params;
    const [rows] = await conn.execute(
      `SELECT * FROM product_reviews 
       WHERE product_id = ? AND status = 'approved'
       ORDER BY created_at DESC`,
      [productId]
    );

    res.json({
      status: "success",
      reviews: rows,
    });
  } catch (error) {
    console.error('獲取評論失敗:', error);
    res.status(500).json({ status: "error", message: '獲取評論失敗', error: error.message });
  }
});

// 導出路由器
export default router;

