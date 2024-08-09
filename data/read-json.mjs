import { readFile } from 'fs/promises';

/**
 * @param path 檔案的路徑，建議使用 reslove 解析過的路徑
 * @description 此函數為 promise 型態，使用時請記得使用 await
 */
export default async path => {
  const content = await readFile(path);
  return JSON.parse(content);
}