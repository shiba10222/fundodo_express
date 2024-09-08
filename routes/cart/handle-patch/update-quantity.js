import conn from "../../../db.js";
import { res200Json, res400Json } from '../../lib/common/response.js';

export default async function (res, cartID, newQty) {
  const [result] = await conn.query('SELECT buy_sort FROM `cart` WHERE id = ?', [cartID])
    if (result.length === 0) {
      res400Json(res, "刪除的請求成功地失敗了，查無指定的 cart ID");
      return;
    }
    if (result[0].buy_sort !== 'PD') {
      res400Json(res, "刪除的請求成功地失敗了，此類商品的數量不允許更改");
      return;
    }

    newQty = Number(newQty);

    try {
      await conn.execute(
        "UPDATE `cart` SET `quantity` = ? WHERE id = ?",
        [newQty, cartID]
      );
    } catch (e) {
      res.status(500).json({ status: "failure", message: "更新失敗，請稍後再嘗試" });
      console.error(e);
      return;
    };

    res200Json(res, `成功更新 ID ${cartID} 之購物車項目`);
    return;
}