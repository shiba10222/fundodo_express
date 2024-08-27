import conn from "../../../db.js";

//=== 參考格式
const sample_f = {
  name: 'Plus+機能保健系列 泌尿道紓壓保健',
  pic_path: 'PR0000001611.jpg',
  sort_name: '',
  spec_name: '1.5g x 30入',
  price: 450,
  qty: 1,
  key: '拿 prod item id'
};
const sample_b = {
  id: null,
  user_id: 8,
  dog_id: null,
  buy_sort: "PD",
  buy_id: 309,
  quantity: 1,
  amount: null,
  room_type: null,
  check_in_date: null,
  check_out_date: null,
  created_at: "2022-07-30 17:36:28",
  deleted_at: null
};

//================================================================
const getSubProd = id => new Promise(async (resolve, reject) => {
  const [rows] = await conn.query(
    `SELECT * FROM prod_price_stock WHERE id = ?`,
    [id]
  );
  if (rows.length === 0) {
    reject(new Error(`發生了未預期的結果：找不到 prod_price_stock id: ${id} 的品項`));
    return;
  } else if (rows.length > 1) {
    reject(new Error(`發生了未預期的結果：prod_price_stock id: ${id} 非唯一`));
    return;
  }
  resolve(rows[0]);
});

const getProdName = id => new Promise(async (resolve, reject) => {
  const [rows] = await conn.query(
    `SELECT name FROM product WHERE id = ?`,
    [id]
  );
  if (rows.length === 0) {
    reject(new Error(`發生了未預期的結果：找不到 id: ${id} 的 product`));
    return;
  } else if (rows.length > 1) {
    reject(new Error(`發生了未預期的結果：product id: ${id} 非唯一`));
    return;
  }
  resolve(rows[0]['name']);
});

const getProdPic = id => new Promise(async (resolve, reject) => {
  const [rows] = await conn.query(
    "SELECT pic_name FROM prod_picture WHERE prod_id = ?",
    [id]
  );
  if (rows.length === 0) {
    reject(new Error(`發生了未預期的結果：找不到 product id: ${id} 的圖片`));
    return;
  }
  resolve(rows[0]['pic_name']);
});

/**
 * 打包商品部份的購物車資料
 * @param {object} cartData from database cart
 * @description key 為 cart 之 ID
 * @returns {{
 *  key: number,
 *  prod_name: string,
 *  pic_name: string,
 *  sort_name: string,
 *  spec_name: string,
 *  price: number,
 *  quantity: number,
 *  isOutOfStock: boolean,
 *  stock_when_few: (number|null)
 *  }}
 */
export default async function (cartData) {
  return new Promise(async (resolve, reject) => {
    const cartList = await Promise.all(
      cartData.map(async cartItem => {
        //== 2-1 查詢 prod_price_stock
        const subProdObj = await getSubProd(cartItem.buy_id);
        const isSpecial = subProdObj.price_sp && subProdObj.price_sp > 0;
        //== 2-2 查詢 product
        const prodName = await getProdName(subProdObj.prod_id);
        //== 2-3 查詢 prod_picture
        const picName = await getProdPic(subProdObj.prod_id);

        return ({
          cart_id: cartItem.id,
          buy_id: cartItem.buy_id,/* 結帳環節串接用 */
          prod_name: prodName,
          pic_name: picName,
          sort_name: subProdObj.sortname,
          spec_name: subProdObj.specname,
          price: isSpecial ? subProdObj.price_sp : subProdObj.price,
          quantity: cartItem.quantity,
          isOutOfStock: subProdObj.stock === 0,
          stock_when_few: (subProdObj.stock < 20) ? subProdObj.stock : null,
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