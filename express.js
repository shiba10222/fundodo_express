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
let whitelist = ["http://127.0.0.1", "http://localhost:5500", "http://localhost:3000", "https://emap.pcsc.com.tw", "https://emap.pcsc.com.tw/ecmap/default.aspx", undefined];
let corsOptions = {
  credentials: true,
  origin(origin, callback) {
    if (!origin || origin === 'null') return callback(null, true);
    if (whitelist.indexOf(origin) === -1) {
      logger.warn('origin ' + origin + ' 不在白名單內');
      return callback(
        new Error('根據同源政策，YOU SHALL NOT PASS'),
        false
      );
    }
    return callback(null, true)
  }
}
app.use(cors(corsOptions));

//=== morgan | 伺服器的使用紀錄
app.use(logger('dev'));

//================== 設置路由架構 ==================//
//=== 路由之根
app.get('/', (_, res) => {
  res.status(301).json({
    status: 'success', message: '歡迎使用翻肚肚伺服器，請使用 api 路由以使用服務。'
  });
});

//=== 讀取 routes 資料夾中的全部路由檔
const dirPath = resolve(import.meta.dirname, 'routes');
const routerFileNames = await readdir(dirPath)

for (const nameStr of routerFileNames) {
  const path2this = resolve(dirPath, nameStr);
  if (nameStr.endsWith('.js')) {
    //* js files
    const filePath = pathToFileURL(path2this);
    //由於 import 的格式搖求，必須使用 url.pathToFileURL 路徑才能被讀到
    const routeFile = await import(filePath);

    let slug = nameStr.split('.')[0];
    slug = (slug === 'index') ? '' : slug;

    app.use(`/api/${slug}`, routeFile.default);
    // .default 為將每個路由檔的 default export
  } else {
    //* folders
    const subfileNames = await readdir(path2this);

    for (const subNameStr of subfileNames) {
      const filePath = pathToFileURL(resolve(path2this, subNameStr));
      const routeFile = await import(filePath);

      let slug = subNameStr.split('.')[0];
      slug = (slug === 'index') ? '' : slug;

      const routePath = ['', 'api', nameStr, slug].join('/');
      console.log(routePath);
      app.use(routePath, routeFile.default);
    }
  }
}

//================== 沒有設定到的路由皆捕捉為 404
app.all("*", (_, res) => {
  res.status(404).json({
    status: 'error', message: '您欲造訪的路由不存在'
  });
})

//================== 匯出
export default app;
