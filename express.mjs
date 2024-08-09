//此檔案宣告 express 的 app，與集合眾路由
import express from 'express';
import cors from 'cors';
import { readdir } from "fs/promises";
import { resolve } from 'path';

//================== 初始化
const app = express();

//================== 設定 CORS
let whitelist = ["http://127.0.0.1", "http://localhost:5500", "http://localhost:3000", undefined];
let corsOptions = {
  credentials: true,
  origin(origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('不被允許的傳輸'))
    }
  }
}
app.use(cors(corsOptions));

//================== 設置路由架構
app.get('/', (req, res) => {
  res.send('Hello, Express!');
});


//=== 讀取路由資料夾中的全部路由檔
const dirPath = resolve(import.meta.dirname, 'router');
const routerFileNames = await readdir(dirPath);

for (let filename of routerFileNames) {
  const path = resolve(dirPath, filename);
  const routeFile = await import(path);
  let slug = filename.split('.')[0];
  slug = (slug === 'index') ? '' : slug;

  app.use(`/api/${slug}`, routeFile.default);
  // 將每個路由檔的 default export 引入並使用 app.use()  匯入路由

  console.log(`引入路由 ${slug}`);
}


app.all("*", (req, res) => {
  res.send('Send Tree Pay: 404');
})

//================== 匯出
export default app;
