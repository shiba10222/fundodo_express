//此檔案宣告 express 的 app，與集合眾路由
import express from 'express';
import cors from 'cors';
import logger from "morgan";
import { readdir } from "fs/promises";
import { resolve } from 'path';
import { pathToFileURL } from "url";
//================== 初始化 =======================//
const app = express();

//================== 中介軟體設定 ==================//
express.json();
app.use(express.urlencoded({ extended: true }));
//=== CORS
let whitelist = ["http://127.0.0.1", "http://localhost:5500", "http://localhost:3000", undefined];
let corsOptions = {
  credentials: true,
  origin(origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('根據同源政策，拒絕不被允許的傳輸'))
    }
  }
}
app.use(cors(corsOptions));

//=== morgan | 伺服器的使用紀錄
app.use(logger('dev'));

//================== 設置路由架構 ==================//
//=== 路由之根
app.get('/', (_, res) => {
  res.status(301).json({
    status: 'nothing here', message: '歡迎使用翻肚肚伺服器，請使用 api 路由以使用服務。'
  });
});

//=== 讀取 routes 資料夾中的全部路由檔
const dirPath = resolve(import.meta.dirname, 'routes');
const routerFileNames = await readdir(dirPath)

for (const filename of routerFileNames) {
  const filePath = pathToFileURL(resolve(dirPath, filename));
  //由於 import 的格式搖求，必須使用 url.pathToFileURL 路徑才能被讀到
  const routeFile = await import(filePath);

  let slug = filename.split('.')[0];
  slug = (slug === 'index') ? '' : slug;

  app.use(`/api/${slug}`, routeFile.default);
  // .default 為將每個路由檔的 default export
}

//================== 沒有設定到的路由皆捕捉為 404
app.all("*", (_, res) => {
  res.status(404).json({
    status: 'error', message: '您欲造訪的路由不存在'
  });
})

//================== 匯出
export default app;
