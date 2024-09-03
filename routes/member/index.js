import { Router } from 'express';
import multer from 'multer';
import moment from 'moment';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';
import { resolve } from "path";
import conn from '../../db.js';
import authenticateToken from './auth/authToken.js';
import mailRouter from './mail.js';
import orderFormRouter from './order-form.js';
import google_login from './google_login.js';

// 參數
const secretKey = process.argv[2];
const envMode = process.argv[3];//dev or dist
const blackList = [];

// 模組物件
const router = Router();
//const upload = multer();

//其他路由檔
router.use('/email', mailRouter);
router.use('/order-form', orderFormRouter);
router.use('/google_login', google_login);

//特定路由區要修改 upload = multer();
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/upload'); // 文件存儲路徑
  },
  filename: (req, file, cb) => {
    const uuid = req.params.uuid; // 從路由參數獲取用戶 ID
    cb(null, `${uuid}.png`); // 文件名稱
  }
});


const upload = multer({ storage });

const uploadAvatar = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'public/upload');
    },
    filename: (req, file, cb) => {
      const uuid = req.params.uuid;
      cb(null, `${uuid}.png`);
    }
  }),
  // 只接受 'avatar' 字段
  fileFilter: (req, file, cb) => {
    if (file.fieldname === 'avatar') {
      cb(null, true);
    } else {
      cb(new MulterError('Unexpected field'));
    }
  }
});

//狗狗圖片;
const storage2 = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/upload_dog'); // 文件存儲路徑
  },
  filename: (req, file, cb) => {
    const id = req.params.id; // 從路由參數獲取用戶 ID
    cb(null, `${id}.png`); // 文件名稱
  }
});

const uploadAvatar2 = multer({
  storage: storage2,
  fileFilter: (req, file, cb) => {
    if (file.fieldname === 'avatar') {
      cb(null, true);
    } else {
      cb(new MulterError('Unexpected field'));
    }
  }
});

//導向email
// app.use('/api/mail', mailRouter);


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

//======== 讀取指定會員(uuid) ==========//
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

//======== 讀取指定狗狗資料(uuid) ==========//
router.get('/dog/:uuid', authenticateToken, async (req, res) => {
  const userId = req.user.userId;
  const { uuid } = req.params;

  if (!uuid) {
    return res.status(400).json({ status: 'failed', message: 'UUID 參數缺失' });
  }

  if (!userId) {
    return res.status(400).json({ status: 'failed', message: 'userId 參數缺失' });
  }

  try {
    // 查詢資料庫中的用戶資料
    const [rows] = await conn.execute('SELECT * FROM dogs WHERE user_id = ?', [userId]);

    if (rows.length === 0) {
      // 沒有找到對應的用戶
      return res.status(404).json({ status: 'failed', message: '狗狗未找到' });
    }

    // 返回查詢結果
    res.status(200).json({
      status: 'success',
      message: '查詢成功',
      result: rows
    });
  } catch (error) {
    console.error('資料庫查詢錯誤：', error);
    res.status(500).json({ status: 'error', message: '資料庫查詢錯誤', error: error.message });
  }
});

//======== 讀取指定圖片 ==========//
//* test id=302 uuid = 1eaf3f71-0568-4541-86fe-c6e9f0108636 網址 = http://localhost:3005/api/member/1eaf3f71-0568-4541-86fe-c6e9f0108636
router.get('/upload/:uuid.png', async (req, res) => {
  const { uuid } = req.params;
  const filePath = path.resolve(__dirname, 'public/upload', `${uuid}.png`);

  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      // 文件不存在
      res.status(404).json({ message: 'File not found' });
    } else {
      // 文件存在，將其發送到客戶端
      res.sendFile(filePath);
    }
  });
});

//======== 登入指定(會員完工) ==========//
//* test id=302 uuid = 1eaf3f71-0568-4541-86fe-c6e9f0108636 網址 = http://localhost:3005/api/member/1eaf3f71-0568-4541-86fe-c6e9f0108636
router.post('/login', upload.none(), async (req, res) => {
  const { email, password } = req.body;
  const loginUser = req.body

  console.log('Email:', email);
  console.log('Password:', password);
  // 檢查從前端來的資料哪些為必要
  // if (!loginUser.email || !loginUser.password) {
  //   return res.json({ status: 'fail', data: null })
  // }

  try {

    // 查詢資料庫中的用戶
    const [users] = await conn.execute('SELECT * FROM users WHERE email = ?', [email]);
    console.log('Users:', users);

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
      { userId: user.id, email: user.email, uuid: user.uuid, nickname: user.nickname, user_level: user.user_level, avatar_file: user.avatar_file },
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
        uuid: user.uuid,
        name: user.name,
        nickname: user.nickname,
        gender: user.gender,
        user_level: user.user_level,
        dob: user.dob,
        tel: user.tel,
        email: user.email,
        avatar_file: user.avatar_file,
        address: user.address,
      }
    });

  }

  catch (error) {
    console.error('Server Error:', error);
    res.status(500).json({ status: 'fail', message: '服務器錯誤' });
  }

});

router.post('/login_BackEnd', upload.none(), async (req, res) => {
  const { email, password } = req.body;
  const loginUser = req.body

  console.log('Email:', email);
  console.log('Password:', password);
  // 檢查從前端來的資料哪些為必要
  // if (!loginUser.email || !loginUser.password) {
  //   return res.json({ status: 'fail', data: null })
  // }

  try {

    // 查詢資料庫中的用戶
    const [users] = await conn.execute('SELECT * FROM users WHERE email = ?', [email]);
    console.log('Users:', users);

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

    if (user.user_level !== 20) {
      // 權限不足
      return res.status(403).json({ status: 'fail', message: '權限不足' });
    }
    
    // 登入成功，創建 JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email, uuid: user.uuid, nickname: user.nickname, user_level: user.user_level, avatar_file: user.avatar_file },
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
        uuid: user.uuid,
        name: user.name,
        nickname: user.nickname,
        gender: user.gender,
        user_level: user.user_level,
        dob: user.dob,
        tel: user.tel,
        email: user.email,
        avatar_file: user.avatar_file,
        address: user.address,
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

router.post('/addDog/:id', upload.none(), async (req, res, next) => {
  console.log('Received request body:', req.body); // 記錄接收到的請求體


  const { name, vaccinations, neutering, introduce, behavior } = req.body;
  const id = req.params.id;


  if (!name) {
    return res.status(400).json({ status: "error", message: "資料傳遞錯誤", receivedData: req.body });
  }

  try {
    // 檢查是否存在對應id用戶
    const [existingUser] = await conn.execute('SELECT * FROM users WHERE id = ?', [id]);
    if (existingUser.length === 0) {
      return res.status(400).json({ status: "error", message: "無此用戶" });
    }

    const [existingDog] = await conn.execute('SELECT * FROM dogs WHERE user_id = ?', [id]);
    if (existingDog.length > 4) {
      return res.status(400).json({ status: "error", message: "狗狗數量到上限" });
    }

    const sql = 'INSERT INTO dogs (name, vaccinations, neutering, introduce, behavior, user_id) VALUES (?, ?, ?, ?, ?, ?)';
    const values = [name, vaccinations, neutering, introduce, behavior, id];

    console.log('Executing SQL:', sql);
    console.log('With values:', values);

    const [result] = await conn.execute(sql, values);



    console.log('Insert result:', result);

    res.status(200).json({
      status: "success",
      message: "狗狗新增成功",
    });

  } catch (error) {
    console.error('資料庫操作錯誤:', error);
    res.status(500).json({
      status: "error",
      message: '新增狗狗失敗，請聯絡系統管理員',
      error: error.message
    });
  }
});

//======== 更新 ==========//
router.put('/:uuid', upload.none(), async (req, res) => {
  console.log('Received request body:', req.body);

  const { name, gender, dob, tel, address } = req.body;
  const uuid = req.params.uuid;

  if (!name || !gender || !dob || !tel || !address) {
    return res.status(400).json({ status: "error", message: "必填欄位缺失", receivedData: req.body });
  }

  try {
    // 檢查是否有此用戶
    const [users] = await conn.execute('SELECT * FROM users WHERE uuid = ?', [uuid]);
    if (users.length === 0) {
      return res.status(400).json({ status: "error", message: "無此用戶" });
    }
    const user = users[0];

    const sql = 'UPDATE users SET name = ?, gender = ?, dob = ?, tel = ?, address = ? WHERE uuid = ?';
    const values = [name, gender, dob, tel, address, uuid];

    console.log('Executing SQL:', sql);
    console.log('With values:', values);

    const [result] = await conn.execute(sql, values);

    console.log('Update result:', result);

    const token = jwt.sign(
      { userId: user.id, email: user.email, uuid: user.uuid, email_verified: user.email_verified },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({
      status: "success",
      message: "更新成功",
      result: req.body,
      token: token,
      user: {
        id: user.id,
        uuid: user.uuid,
        name: user.name,
        nickname: user.nickname,
        gender: user.gender,
        dob: user.dob,
        tel: user.tel,
        email: user.email,
        email_verified: user.email_verified,
        avatar_file: user.avatar_file,
        address: user.address,
      }
    });
  } catch (error) {
    console.error('Error occurred:', error);
    res.status(500).json({ status: "error", message: "伺服器錯誤" });
  }
});

router.put('/ForumMemberInfo/:uuid', upload.none(), async (req, res) => {
  const { nickname, introduce } = req.body;
  const uuid = req.params.uuid;

  if (!nickname || !introduce) {
    return res.status(400).json({ status: 'error', message: '必填欄位缺失' });
  }

  try {
    // 檢查是否有此用戶
    const [users] = await conn.execute('SELECT * FROM users WHERE uuid = ?', [uuid]);
    if (users.length === 0) {
      return res.status(400).json({ status: 'error', message: '無此用戶' });
    }

    // 更新用戶資料
    const sql = 'UPDATE users SET nickname = ?, introduce = ? WHERE uuid = ?';
    const values = [nickname, introduce, uuid];
    const [result] = await conn.execute(sql, values);

    // 重新生成 token
    const user = users[0];
    const token = jwt.sign(
      { userId: user.id, email: user.email, uuid: user.uuid, nickname: user.nickname, user_level: user.user_level, avatar_file: user.avatar_file, email_verified: user.email_verified },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({
      status: 'success',
      message: '更新成功',
      result: req.body,
      token: token,
      user: {
        id: user.id,
        uuid: user.uuid,
        nickname: user.nickname,
        introduce: user.introduce,
        avatar_file: user.avatar_file,
      }
    });
  } catch (error) {
    console.error('更新用戶資料錯誤：', error);
    res.status(500).json({ status: 'error', message: '伺服器錯誤' });
  }
});

router.post('/uploadAvatar/:uuid', uploadAvatar.single('avatar'), async (req, res) => {
  console.log('Received request body:', req.body);
  const uuid = req.params.uuid;
  try {
    if (!req.file) {
      return res.status(400).json({ status: 'error', message: '檔案上傳失敗' });
    }

    // 獲取上傳成功的檔案路徑
    const filePath = `/upload/${req.file.filename}`;
    // 獲取上傳成功的檔案路徑
    const sqlfilePath = `${req.file.filename}`;
    // 更新資料庫中的用戶資料
    const sql = 'UPDATE users SET avatar_file = ? WHERE uuid = ?';
    const values = [sqlfilePath, uuid];
    await conn.execute(sql, values);

    // 返回上傳成功的檔案路徑
    res.status(200).json({ status: 'success', filePath: filePath });
  } catch (error) {
    console.error('檔案上傳錯誤：', error);
    res.status(500).json({ status: 'error', message: '檔案上傳失敗' });
  }
});

router.put('/dogInfo/:id', upload.none(), async (req, res) => {
  const { name, gender, dob, weight, introduce, behavior, vaccinations, neutering } = req.body;
  const id = req.params.id;

  try {
    // 檢查是否有此狗
    const [dogs] = await conn.execute('SELECT * FROM dogs WHERE id = ?', [id]);
    if (!name || !gender || !dob || !weight) {
      return res.status(400).json({ status: 'error', message: '必填欄位缺失' });
    }
    if (dogs.length === 0) {
      return res.status(400).json({ status: 'error', message: '無此狗' });
    }

    // 更新用戶資料
    const sql = 'UPDATE dogs SET name = ?, gender = ?, dob = ?, weight = ?, introduce = ?, behavior = ?, vaccinations = ?, neutering  = ? WHERE id = ?';
    const values = [
      name,
      gender,
      dob,
      weight,
      introduce || '',
      behavior || '',
      vaccinations ? JSON.stringify(vaccinations) : null,
      neutering || '',
      id
    ];
    const [result] = await conn.execute(sql, values);

    // 返回成功訊息和更新後的狗狗資料
    res.status(200).json({
      status: 'success',
      message: '狗狗資料更新成功',
      data: {
        id,
        name,
        gender,
        dob,
        weight,
        introduce,
        behavior,
        vaccinations: vaccinations ? JSON.parse(vaccinations) : null,
        neutering
      }
    });

  } catch (error) {
    console.error('更新狗狗資料錯誤：', error);
    res.status(500).json({ status: 'error', message: '伺服器錯誤', error: error.message });
  }
});

router.post('/uploadAvatar_dog/:id', uploadAvatar2.single('avatar'), async (req, res) => {
  console.log('Received request body:', req.body);
  const id = req.params.id;
  try {
    if (!req.file) {
      return res.status(400).json({ status: 'error', message: '檔案上傳失敗' });
    }

    // 獲取上傳成功的檔案路徑
    const filePath = `/upload_dog/${req.file.filename}`;
    // 獲取上傳成功的檔案路徑
    const sqlfilePath = `${req.file.filename}`;
    // 更新資料庫中的用戶資料
    const sql = 'UPDATE dogs SET dog_avatar_file = ? WHERE id = ?';
    const values = [sqlfilePath, id];
    await conn.execute(sql, values);

    // 返回上傳成功的檔案路徑
    res.status(200).json({ status: 'success', filePath: filePath });
  } catch (error) {
    console.error('檔案上傳錯誤：', error);
    res.status(500).json({ status: 'error', message: '檔案上傳失敗' });
  }
});

//------ 一般修改密碼需要舊密碼
router.post('/UpdatePassword/:uuid', upload.none(), async (req, res, next) => {
  console.log('Received request body:', req.body); // 記錄接收到的請求體

  const { old_password, password } = req.body;
  const uuid = req.params.uuid;

  if (!old_password || !password) {
    return res.status(400).json({ status: "error", message: "必填欄位缺失", receivedData: req.body });
  }

  try {
    // 檢查郵件是否已經註冊過
    const [existingUser] = await conn.execute('SELECT * FROM users WHERE uuid = ?', [uuid]);
    if (existingUser.length === 0) {
      return res.status(404).json({ status: "error", message: "用戶不存在" });
    }

    const user = existingUser[0];

    const isMatch = await bcrypt.compare(old_password, user.password_hash);
    if (!isMatch) {
      return res.status(400).json({ status: "error", message: "舊密碼不正確" });
    }

    // 密碼加密
    const saltRounds = 10;
    const password_hash = await bcrypt.hash(password, saltRounds);


    const sql = 'UPDATE users SET password_hash = ? WHERE uuid = ?';
    const values = [password_hash, uuid];

    console.log('Executing SQL:', sql);
    console.log('With values:', values);

    const [result] = await conn.execute(sql, values);



    console.log('Update result:', result);

    if (result.affectedRows > 0) {
      // 成功更新
      res.status(200).json({
        status: "success",
        message: "修改成功",
      });
    } else {
        res.status(500).json({
        status: "error",
        message: "修改失敗：未能更新數據"
      });
    }
  } catch (error) {
    console.error('資料庫操作錯誤:', error);
    res.status(500).json({
      status: "error",
      message: '修改失敗，請聯絡系統管理員',
      error: error.message
    });
  }
});

//----------   otp 使用修改密碼
router.post('/ChangePassword/:uuid', upload.none(), async (req, res, next) => {
  console.log('Received request body:', req.body); // 記錄接收到的請求體

  const { password } = req.body;
  const uuid = req.params.uuid;

  if (!password) {
    return res.status(400).json({ status: "error", message: "必填欄位缺失", receivedData: req.body });
  }

  try {
    // 檢查郵件是否已經註冊過
    const [existingUser] = await conn.execute('SELECT * FROM users WHERE uuid = ?', [uuid]);
    if (existingUser.length === 0) {
      return res.status(400).json({ status: "error", message: "用戶不存在" });
    }

    // 密碼加密
    const saltRounds = 10;
    const password_hash = await bcrypt.hash(password, saltRounds);


    const sql = 'UPDATE users SET password_hash = ? WHERE uuid = ?';
    const values = [password_hash, uuid];

    console.log('Executing SQL:', sql);
    console.log('With values:', values);

    const [result] = await conn.execute(sql, values);



    console.log('Update result:', result);

    if (result.affectedRows > 0) {
      // 成功更新
      res.status(200).json({
        status: "success",
        message: "修改成功",
      });
    } else {
      throw new Error('修改失敗：未能更新數據');
    }
  } catch (error) {
    console.error('資料庫操作錯誤:', error);
    res.status(500).json({
      status: "error",
      message: '修改失敗，請聯絡系統管理員',
      error: error.message
    });
  }
});
//======== 刪除 ==========//
router.delete('/deleteUser/:uuid', async (req, res) => {
  const uuid = req.params.uuid;

  if (!uuid) {
    return res.status(400).json({ status: 'error', message: 'uuid 參數缺失' });
  }

  try {
    // 檢查是否有此用戶
    const [Userexist] = await conn.execute('SELECT * FROM users WHERE uuid = ?', [uuid]);
    if (Userexist.length === 0) {
      return res.status(404).json({ status: 'error', message: '無此用戶' });
    }

    // 刪除用戶的資料
    const sql = 'DELETE FROM users WHERE uuid = ?';
    await conn.execute(sql, [uuid]);

    res.status(200).json({ status: 'success', message: '用戶刪除成功' });
  } catch (error) {
    console.error('刪除用戶資料錯誤：', error);
    res.status(500).json({ status: 'error', message: '伺服器錯誤' });
  }
});

router.delete('/deleteDog/:id', async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ status: 'error', message: 'ID 參數缺失' });
  }

  try {
    // 檢查是否有此狗
    const [dogs] = await conn.execute('SELECT * FROM dogs WHERE id = ?', [id]);
    if (dogs.length === 0) {
      return res.status(404).json({ status: 'error', message: '無此狗' });
    }

    // 刪除狗的資料
    const sql = 'DELETE FROM dogs WHERE id = ?';
    await conn.execute(sql, [id]);

    res.status(200).json({ status: 'success', message: '狗狗刪除成功' });
  } catch (error) {
    console.error('刪除狗狗資料錯誤：', error);
    res.status(500).json({ status: 'error', message: '伺服器錯誤' });
  }
});


//======== 驗證信箱 ==========//


//======== handle 404

router.all("*", (req, res) =>
  res.status(404).json({ status: 'NOT FOUND', message: '你走錯路了。' })
);

//================== 匯出
export default router;