import { Router } from 'express';
import multer from 'multer';
import moment from 'moment';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';
import { resolve } from "path";
import conn from '../db.js';

// 參數
const secretKey = process.argv[2];
const envMode = process.argv[3];//dev or dist
const blackList = [];

// 模組物件
const router = Router();
const upload = multer();

// 資料表
// const defaultDB = { users: [], products: [] };
// const path = resolve(import.meta.dirname, '../data/database.json')
// const DB = new Low(new JSONFile(path), defaultDB);
// await DB.read();
// if (envMode === 'dev') {
//   console.log("(users.mjs) json 資料筆數");
//   console.log('users: ', DB.data.users.length);
//   console.log('products: ', DB.data.products.length);
//   console.log('cart: ', DB.data.carts.length);
// }
//================================= 設置中介函數
/**
 * 解析 TOKEN | 中介函數
 * @description 處理 token 驗證失敗之情形
 */
const checkToken = (req, res, next) => {
  if (envMode === 'dev') next();

  let token = req.get("Authorization");
  const headStr = "Bearer ";

  if (token && token.startsWith(headStr)) {
    token = req.get("Authorization").slice(headStr.length);

    //================================================================
    // 類似 SESSION 的作法，但僅能用於單次測試，因為 blacklist 在重啟後就會跟著重置
    // if(blackList.includes(token)) {
    //   return res.status(401).json({
    //     status: '401',
    //     message: '登入驗證已失效，請重新登入'
    //   })
    // }
    //================================================================

    jwt.verify(token, secretKey, (err, decoded) => {
      if (err) {
        res.status(401).json({ status: 'failed', message: '登入驗證已失效，請重新登入。' });
      } else {
        // 讓成功的應對由不同路由各自處理，回傳 decoded
        req.decoded = decoded;
        // next 以離開中介，返回路由流程
        next();
      }
    });
    res.status(200).json({ status: 'success', message: '驗證成功。' });
  } else {
    res.status(401).json({ status: 'unauthorized', message: '驗證失敗，請重新登入。' });
    next();
  }
}
//==================================================
//================== 設置路由架構 ====================
//==================================================

//======== 讀取全部 ==========//
router.get('/', async (req, res) => {
  try {
    const [data] = await conn.execute("SELECT * FROM `users`");
    //console.log(data);
    res.status(200).send({ status: "success", message: '回傳所有使用者資料', data });
  } catch (error) {
    console.error('資料庫查詢錯誤：', error);
    res.status(500).json({ status: "error", message: '資料庫查詢錯誤', error: error.message });
  }
});

//======== 搜尋指定 ==========//
// 必須在讀取前，否則會被攔截
//* test pnum = 1003
router.get('/prod', (req, res) => {
  const pnum = Number(req.query.pnum);

  // let result = DB.data.carts.filter(item => item.prod_item_id === pnum);

  // if (!result) {
  //   res.status(404).json({ status: "failed", message: `查無型號 ${pnum} 商品品項之購物車資料` });
  //   return;
  // }

  res.status(200).json({ status: "success", message: "查詢成功", result });
});

//======== 讀取指定(uuid) ==========//
//* test id=302 uuid = 1eaf3f71-0568-4541-86fe-c6e9f0108636 網址 = http://localhost:3005/api/member/1eaf3f71-0568-4541-86fe-c6e9f0108636
router.get('/:uuid', async (req, res) => {
  const { uuid } = req.params; // 從路由參數中取得 uuid

  if (!uuid) {
    return res.status(400).json({ status: 'failed', message: 'UUID 參數缺失' });
  }

  try {
    // 查詢資料庫中的用戶資料
    const [rows] = await conn.execute('SELECT * FROM users WHERE uuid = ?', [uuid]);

    if (rows.length === 0) {
      // 沒有找到對應的用戶
      return res.status(404).json({ status: 'failed', message: '用戶未找到' });
    }

    // 返回查詢結果
    res.status(200).json({
      status: 'success',
      message: '查詢成功',
      result: rows[0] // 返回查詢到的第一筆資料
    });
  } catch (error) {
    console.error('資料庫查詢錯誤：', error);
    res.status(500).json({ status: 'error', message: '資料庫查詢錯誤', error: error.message });
  }
});

//======== 登入指定 ==========//
//* test id=302 uuid = 1eaf3f71-0568-4541-86fe-c6e9f0108636 網址 = http://localhost:3005/api/member/1eaf3f71-0568-4541-86fe-c6e9f0108636
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const loginUser = req.body
  // 檢查從前端來的資料哪些為必要
  if (!loginUser.email || !loginUser.password) {
    return res.json({ status: 'fail', data: null })
  }

  try {

    // 查詢資料庫中的用戶
    const [users] = await conn.execute('SELECT * FROM users WHERE email = ?', [email]);

    if (users.length === 0) {
      // 用戶不存在
      return res.status(401).json({ status: 'fail', message: '電子郵件或密碼錯誤' });
    }

    const user = users[0];

    // 驗證密碼
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);

    if (!isPasswordValid) {
      // 密碼錯誤
      return res.status(401).json({ status: 'fail', message: '電子郵件或密碼錯誤' });
    }

    // 登入成功，創建 JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // 返回成功訊息和 token
    res.status(200).json({
      status: 'success',
      message: '登入成功',
      token: token,
      user: {
        id: user.id,
        nickname: user.nickname,
        email: user.email,
        uuid: user.uuid
      }
    });

  }

  catch (error) {
    console.error('Server Error:', error);
    res.status(500).json({ status: 'fail', message: '服務器錯誤' });
  }

});

//======== 新增 (會員完工)==========//
router.post('/register', upload.none(), async (req, res, next) => {
  console.log('Received request body:', req.body); // 記錄接收到的請求體

  const { nickname, email, password } = req.body;

  if (!nickname || !email || !password) {
    return res.status(400).json({ status: "error", message: "必填欄位缺失", receivedData: req.body });
  }

  try {
    // 檢查郵件是否已經註冊過
    const [existingUser] = await conn.execute('SELECT * FROM users WHERE email = ?', [email]);
    if (existingUser.length > 0) {
      return res.status(400).json({ status: "error", message: "該郵件地址已經註冊過" });
    }

    // 密碼加密
    const saltRounds = 10;
    const password_hash = await bcrypt.hash(password, saltRounds);

    // 生成 UUID
    const uuidValue = uuidv4();

    const sql = 'INSERT INTO users (nickname, email, password_hash, uuid) VALUES (?, ?, ?, ?)';
    const values = [nickname, email, password_hash, uuidValue];

    console.log('Executing SQL:', sql);
    console.log('With values:', values);

    const [result] = await conn.execute(sql, values);



    console.log('Insert result:', result);

    if (result.insertId) {
      // 成功插入數據
      res.status(201).json({
        status: "success",
        message: "註冊成功",
        id: result.insertId,
        redirectUrl: 'http://localhost:3000/member/login'
      });
    } else {
      throw new Error('註冊失敗：未能插入數據');
    }
  } catch (error) {
    console.error('資料庫操作錯誤:', error);
    res.status(500).json({
      status: "error",
      message: '註冊失敗，請聯絡系統管理員',
      error: error.message
    });
  }
});

//======== 更新 ==========//
router.put('/:id', upload.none(), async (req, res) => {
  let user;//todo: remove this
  // const id = req.params.id;
  // const user = DB.data.users.find(u => u.id === id);
  if (!user) {
    res.status(404).json({ status: "failed", message: "查無此使用者，請檢查輸入的 ID 是否有誤" });
    return;
  }
  // 將修改後的資料更新到 user
  // console.log(req.body);
  // const {
  //   account,
  //   password,
  //   name,
  //   email,
  //   telephone,
  //   dob,
  //   address,
  // } = req.body;
  // const newData = {
  //   account,
  //   password,
  //   name,
  //   email,
  //   telephone,
  //   dob,
  //   address,
  // };
  // // console.log(newData);
  // DB.data.users = DB.data.users.map(
  //   u => (u.id === id) ? { ...u, ...newData } : u
  // );
  // await DB.write();
  // res.status(200).json({
  //   status: "success",
  //   message: "更新成功",
  //   result: req.body
  // });
});

router.patch('/:id', upload.none(), (req, res) => {
  const id = req.params.id;

  res.status(200).send(`部份更新 ID ${id} 的使用者`);
});

//======== 刪除 ==========//
router.delete('/:id', upload.none(), async (req, res) => {
  let user;//todo: remove this
  const id = req.params.id;
  // const user = DB.data.users.find(u => u.id === id);
  if (!user) {
    res.status(404).json({ status: "failed", message: "查無此使用者，請檢查輸入的 ID 是否有誤" });
    return;
  }
  //使用軟刪除，設定 deleteTime
  // DB.data.users = DB.data.users.map(
  //   u => (u.id === id) ? { ...u, deleteTime: Date.now() } : u
  // );
  // await DB.write();
  // res.status(200).json({
  //   status: "success",
  //   message: "刪除成功",
  //   result: req.body
  // });
});

//======== handle 404

router.all("*", (req, res) => {
  res.send('Send Tree Pay: 404');
})

//================== 匯出
export default router;