import { getTimeStr_DB } from '../../lib/common/time.js';
import { res200Json, res400Json } from '../../lib/common/response.js';
import conn from "../../../db.js";

// 統一格式
// {'deleted_at': 1} <- truly
// {'deleted_at': 0} <- falsy

export default async function (res, cartID, value) {
  //== 模式判斷
  const goDel = value !== 'null' && value !== 'NULL';
  const keyword = goDel ? "刪除" : "還原";

  //== 基本檢驗
  const [result] = await conn.query(
    'SELECT deleted_at FROM `cart` WHERE id = ?',
    [cartID]
  );

  if (result.length === 0)
    return res400Json(res, `查無指定的 ID ${cartID} 之購物車項目`);
  if (result.length > 1)
    return res400Json(res, `見鬼了！ID ${cartID} 之購物車項目有兩筆以上`);

  //== 模式判斷
  const prev_value = result[0].deleted_at;
  if (goDel) {
    if (prev_value)
      return res400Json(res, `ID ${cartID} 之購物車項目已被刪除，請求已被成功拒絕`);

    const timeObj = new Date().getTime();
    value = getTimeStr_DB(timeObj);
  } else {
    if (!prev_value)
      return res400Json(res, `ID ${cartID} 之購物車項目並未被刪除，請求已被成功拒絕`);
    value = null;
  }

  await conn.execute(
    "UPDATE `cart` SET `deleted_at` = ? WHERE id = ?",
    [value, cartID]
  ).catch(err => {
    res.status(500).json({ status: "failure", message: `${keyword}失敗，請稍後再嘗試` });
    console.error(err);
    return;
  });

  res200Json(res, `成功${keyword} ID ${cartID} 之購物車項目` );
}