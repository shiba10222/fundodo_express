import express from 'express';
import cors from 'cors';
import logger from 'morgan';
import { readdir } from 'fs/promises';
import { dirname, resolve } from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import path from 'path';
import dotenv from 'dotenv';
//================== 初始化 =======================//
const app = express();
dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

//================== 中介軟體設定 ==================//
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(express.static('public'));

app.use('/public', express.static(resolve(__dirname, 'public')));

//=== 設置靜態文件夾 ===//
// console.log('Static files directory:', resolve(__dirname, 'public/upload'));
// console.log('Public upload directory path:', resolve(__dirname, 'public/upload'));
app.use('/upload', express.static(resolve(__dirname, 'public/upload')));
// console.log('Static files directory:', resolve(__dirname, 'public/upload_dog'));
// console.log('Public upload directory path:', resolve(__dirname, 'public/upload_dog'));
app.use('/upload_dog', express.static(resolve(__dirname, 'public/upload_dog')));
app.use('/videos', express.static(path.join(__dirname, 'public/upload/crs_videos')));
app.use('/images', express.static(path.join(__dirname, 'public/upload/crs_images')));


//=== CORS ===
const whitelist = [
  "http://127.0.0.1",
  "http://localhost:5500",
  "http://localhost:3000",
  "https://147.92.159.21",
  "https://147.92.159.68",
  "https://emap.pcsc.com.tw/ecmap/default.aspx",
  undefined];
const corsOptions = {
  credentials: true,
  origin(origin, callback) {
    if (!origin || origin === 'null') return callback(null, true);
    if (whitelist.indexOf(origin) === -1) {
      logger.warn('origin ' + origin + ' 不在白名單內');
      return callback(new Error('根據同源政策，YOU SHALL NOT PASS'), false);
    }
    return callback(null, true);
  }
};
app.use(cors(corsOptions));

//=== morgan | 伺服器的使用紀錄 ===
app.use(logger('dev'));

//================== 設置路由架構 ==================//
//=== 路由之根
app.get('/', (_, res) => {
  res.status(301).json({
    status: 'success',
    message: '歡迎使用翻肚肚伺服器，請使用 api 路由以使用服務。'
  });
});

//=== 讀取 routes 資料夾中的全部路由檔 ===
const dirPath = resolve(__dirname, 'routes');
const routerFileNames = await readdir(dirPath);

for (const nameStr of routerFileNames) {
  const path2this = resolve(dirPath, nameStr);
  if (nameStr.endsWith('.js')) {
    //== JS 檔 ==//
    const filePath = pathToFileURL(path2this);
    const routeFile = await import(filePath);

    // 確保 routeFile.default 是一個有效的中介軟體函數
    if (typeof routeFile.default === 'function') {
      let slug = nameStr.split('.')[0];
      slug = (slug === 'index') ? '' : slug;

      app.use(`/api/${slug}`, routeFile.default);
    } else {
      console.error(`路由模組 ${nameStr} 未正確導出為中介軟體函數`);
    }
  } else {
    //== 資料夾 ==//
    if (nameStr.indexOf('.') >= 0) continue; // 非 JS 檔與非資料夾者一律跳過

    const subfileNames = await readdir(path2this);

    for (const subNameStr of subfileNames) {
      if (!subNameStr.endsWith('.js')) continue; // 第二層子資料夾與非 JS 檔者一律跳過

      const filePath = pathToFileURL(resolve(path2this, subNameStr));
      const routeFile = await import(filePath);

      if (typeof routeFile.default === 'function') {
        let slug = subNameStr.split('.')[0];
        slug = (slug === 'index') ? '' : slug;

        const routePath = ['', 'api', nameStr, slug].join('/');
        app.use(routePath, routeFile.default);
      } else {
        console.error(`路由模組 ${subNameStr} 未正確導出為中介軟體函數`);
      }
    }
  }
}

//================== 沒有設定到的路由皆捕捉為 404 ===
app.all('*', (_, res) => {
  res.status(404).json({
    status: 'error',
    message: '您欲造訪的路由不存在'
  });
});

//================== 匯出 ========================
export default app;
