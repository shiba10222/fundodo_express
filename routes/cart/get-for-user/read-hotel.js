import conn from "../../../db.js";

//=== 參考格式
const sample_f = {
  hotel_name: '毛起來住寵物旅館',
  pic_path: '',
  start_date: '2024-08-16',
  end_date: '2024-08-17',
  bodytype: '大型犬',
  price: 422,
  qty: 1,
  tot: 422,
  key: 'ef53dsegkj'
};
const sample_b = {
  id: null,
  user_id: 28,
  dog_id: null,
  buy_sort: "HT",
  buy_id: 9,
  quantity: 1,
  amount: 666,
  room_type: "S",
  check_in_date: "2022-07-26",
  check_out_date: "2022-07-28",
  created_at: "2022-07-25 20:22:58",
  deleted_at: null
};

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
  resolve(rows[0]);
});

/**
 * 打包旅館部份的購物車資料
 * @param {object} cartData from database cart
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
    const cartList = await Promise.all(
      cartData.map(async cartItem => {
        //== 查詢 hotel
        const hotelObj = await getHotel(cartItem.buy_id);

        const dogName = cartItem.dog_id ? await getDogName(cartItem.dog_id) : null;

        return ({
          key: cartItem.buy_id,
          prod_name: hotelObj.name,
          pic_name: hotelObj.main_img_path,
          dog_name: dogName.name,
          bodytype: bodytypeOf[cartItem.room_type],
          check_in_date: cartItem.check_in_date,
          check_out_date: cartItem.check_out_date,
          amount: cartItem.amount,
          created_at: cartItem.created_at,
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