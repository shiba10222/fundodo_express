import conn from "../../../db.js";
import { getTimeNum } from '../../lib/common/time.js';

const bodytypeOf = {
  'S': "小型犬",
  'M': "中型犬",
  'L': "大型犬"
}

//================================================================
const getHotel = id => new Promise(async (resolve, reject) => {
  const [rows] = await conn.query(
    "SELECT name, main_img_path FROM hotel WHERE id = ?",
    [id]
  );
  if (rows.length === 0) {
    reject(new Error(`發生了未預期的結果：找不到 hotel id: ${id} 的旅館`));
    return;
  } else if (rows.length > 1) {
    reject(new Error(`hotel id: ${id} 非唯一`));
    return;
  }
  resolve(rows[0]);
});

const getDogName = id => new Promise(async (resolve, reject) => {
  const [rows] = await conn.query(
    "SELECT name FROM dogs WHERE id = ?",
    [id]
  );
  if (rows.length === 0) {
    reject(new Error(`發生了未預期的結果：找不到 dogs id: ${id} 的狗勾`));
    return;
  } else if (rows.length > 1) {
    reject(new Error(`dogs id: ${id} 非唯一`));
    return;
  }
  resolve(rows[0]['name']);
});

/**
 * 打包旅館部份的購物車資料
 * @param {object} cartData from database cart
 * @description key 為 cart 之 ID
 * @returns {{
 * key: number,
 * prod_name: string,
 * pic_name: string,
 * dog_name: (string | null),
 * bodytype: string,
 * check_in_date: string,
 * check_out_date: string,
 * amount: number,
 * created_at: string,
 * }}
 */
export default async function (cartData) {
  return new Promise(async (resolve, reject) => {
    cartData.sort((a, b) => {
      const d1 = getTimeNum(a.check_in_date) - getTimeNum(b.check_in_date);
      if (d1 !== 0) return d1;

      if (a.dog_id && b.dog_id) return a.dog_id - b.dog_id;
      else if (a.dog_id) return 1;
      else if (b.dog_id) return -1;
      else {
        const list = ['S', 'M', 'L'];
        return list.indexOf(a.room_type) - list.indexOf(b.room_type);
      }
    })
    
    const cartList = await Promise.all(
      cartData.map(async cartItem => {
        //== 查詢 hotel
        const hotelObj = await getHotel(cartItem.buy_id);
        const dogName = cartItem.dog_id ? await getDogName(cartItem.dog_id) : null;

        return ({
          cart_id: cartItem.id,
          buy_id: cartItem.buy_id,/* 結帳環節串接用 */
          prod_name: hotelObj.name,
          pic_name: hotelObj.main_img_path.split(',')[0],
          dog_name: dogName,
          room_type: bodytypeOf[cartItem.room_type],
          check_in_date: cartItem.check_in_date,
          check_out_date: cartItem.check_out_date,
          amount: cartItem.amount,
          created_at: cartItem.created_at,
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