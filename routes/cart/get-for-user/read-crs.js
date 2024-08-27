import conn from "../../../db.js";

//================================================================
const getCourse = id => new Promise(async (resolve, reject) => {
  const [rows] = await conn.query(
    "SELECT * FROM courses WHERE id = ?",
    [id]
  );
  if (rows.length === 0) {
    reject(new Error(`發生了未預期的結果：找不到 courses id: ${id} 的品項`));
    return;
  } else if (rows.length > 1) {
    reject(new Error(`courses id: ${id} 非唯一`));
    return;
  }
  resolve(rows[0]);
});

/**
 * 打包課程部份的購物車資料
 * @param {object} cartData from database cart
 * @description key 為 cart 之 ID
 * @returns {{
 * key: number, prod_name: string, pic_name: string, price: number
 * }}
 */
export default async function (cartData) {
  return new Promise(async (resolve, reject) => {
    const cartList = await Promise.all(
      cartData.map(async cartItem => {
        //== 查詢 courses
        const crsObj = await getCourse(cartItem.buy_id);
        const isSpecial = crsObj.sale_price && crsObj.sale_price > 0;
        const price = isSpecial ? crsObj.sale_price : crsObj.original_price;
        return ({
          cart_id: cartItem.id,
          buy_id: cartItem.buy_id,/* 結帳環節串接用 */
          prod_name: crsObj.title,
          pic_name: crsObj.img_path,
          price: Number(price),
          deleted_at: cartItem.deleted_at
        })
      })
    );

    if (cartList.length === 0) reject('怎麼沒有東西');
    resolve(cartList);
  }).then(result => result.filter(obj => !!obj))
    .catch(err => {
      console.error(err);
      reject(null);
    });
}