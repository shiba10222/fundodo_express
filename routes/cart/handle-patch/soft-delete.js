import { getTimeStr_DB } from '../../../data/test/lib-time.js';

// 統一格式
// {'deleted_at': 1} <- truly
// {'deleted_at': 0} <- falsy

export default async function (res, conn, cartID, value) {
  //== 模式判斷
  const goDel = value !== 'null' && value !== 'NULL';
  const keyword = goDel ? "刪除" : "還原";
  
  //== 基本檢驗
  const [result] = await conn.query('SELECT deleted_at FROM `cart` WHERE id = ?', [cartID])
  if (result.length === 0) {
    res.status(200).json({ status: "success", message: "任務成功地失敗了，查無指定的 cart ID" });
    return;
  }
  if (result.length > 1) {
    res.status(200).json({ status: "error", message: "指定的 cart ID 有兩筆以上" });
    return;
  }

  //== 模式判斷
  const prev_value = result[0].deleted_at;
  if (goDel) {
    if (prev_value) {
      res.status(200).json({ status: "rejected", message: "指定的 cart ID 已被刪除，請求已被成功拒絕" });
      return;
    }
    
    const timeObj = new Date().getTime();
    value = getTimeStr_DB(timeObj);
  } else {
    if (!prev_value) {
      res.status(200).json({ status: "rejected", message: "指定的 cart ID 並非刪除狀態，請求已被成功拒絕" });
      return;
    }
    value = null;
  }

  try {
    await conn.execute(
      "UPDATE `cart` SET `deleted_at` = ? WHERE id = ?",
      [value, cartID]
    );
  } catch (e) {
    res.status(500).json({ status: "failure", message: `${keyword}失敗，請稍後再嘗試` });
    console.error(e);
    return;
  };

  res.json({ status: "success", message: `成功${keyword} ID ${cartID} 之購物車項目` });
}