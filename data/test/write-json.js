import { writeFile } from 'fs/promises';

/**
 * @param path 檔案的路徑，建議使用 reslove 解析過的路徑
 * @param dataStr 欲轉檔 json 的字串，請確保使用過 stringify 的字串化
 * @description 此函數為 promise 型態，使用時請記得使用 await
 */
export default async (path, dataStr) => {
  await writeFile(path, dataStr).catch(err => err);
  console.log('已成功轉換成 json 檔');
}