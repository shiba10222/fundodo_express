import { resolve } from 'path';
import { readFile, writeFile } from 'fs/promises';

/**
 * 以 path.resolve 解析自檔案本身位置起始的路徑
 * @param {string} pahtStr 
 * @returns {string} 可供 file system 使用之路徑
 */
const pathTo = pahtStr => resolve(import.meta.dirname, pahtStr);

/**
 * 本函數會自動以 path.resolve 解析自檔案本身位置起始的路徑
 * @param dirPath 執行之檔案的路徑
 * @param path 欲讀取之檔案的路徑
 * @description 此函數為 promise 型態，使用時請記得使用 await
 */
const readJson = async (dirPath, path) => {
  const content = await readFile(resolve(dirPath, path));
  return JSON.parse(content);
}

/**
 * 本函數會自動以 path.resolve 解析自檔案本身位置起始的路徑
 * @param dirPath 執行之檔案的路徑
 * @param path 欲存檔之檔案的路徑
 * @param dataStr 欲轉檔 json 的陣列或物件
 * @description 此函數為 promise 型態，使用時請記得使用 await
 */
const writeJson = async (dirPath, path, dataStr) => {
  await writeFile(resolve(dirPath, path), JSON.stringify(dataStr))
  .catch(err => err);
  console.log('已成功轉換成 json 檔');
}

export {
  pathTo,
  readJson,
  writeJson
}