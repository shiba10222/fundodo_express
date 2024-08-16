import conn from "../../../db.js";

//=== 參考格式
const sample_f = {
  name: '玩出好感情！與狗兒的互動遊戲課',
  pic_path: 'CR0000011.png',
  plan: '單堂線上遊戲課(5/18的重播教學)',
  price: 1200,
  key: 'semv8942lm'
};
const sample_b = {
  id: null,
  user_id: 100,
  dog_id: null,
  buy_sort: "CR",
  buy_id: 12,
  quantity: 1,
  room_type: null,
  check_in_date: null,
  check_out_date: null,
  created_at: "2024-02-25 22:44:28",
  deleted_at: null
};

//================================================================
const getCourse = id => new Promise(async (resolve, reject) => {
  const [rows] = await conn.query(
    `SELECT * FROM courses WHERE id = ?`,
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

const getProdName = id => new Promise(async (resolve, reject) => {
  const [rows] = await conn.query(
    `SELECT name FROM product WHERE id = ?`,
    [id]
  );
  if (rows.length === 0) {
    reject(new Error(`發生了未預期的結果：找不到 product id: ${id} 的品項`));
    return;
  } else if (rows.length > 1) {
    reject(new Error(`發生了未預期的結果：product id: ${id} 非唯一`));
    return;
  }
  resolve(rows[0]['name']);
});

const getProdPic = id => new Promise(async (resolve, reject) => {
  const [rows] = await conn.query(
    "SELECT name FROM prod_picture WHERE prod_id = ?",
    [id]
  );
  if (rows.length === 0) {
    reject(new Error(`發生了未預期的結果：找不到 product id: ${id} 的品項`));
    return;
  }
  resolve(rows[0]['name']);
});

export default async function (cartData) {
  return new Promise(async (resolve, reject) => {
    const cartList = await Promise.all(
      cartData.map(async cartItem => {
        //== 2-1 查詢 prod_price_stock
        const crsObj = await getCourse(cartItem.buy_id);
        //== 2-2 查詢 product
        const prodName = await getProdName(subProdObj.prod_id);
        //== 2-3 查詢 prod_picture
        const picName = await getProdPic(subProdObj.prod_id);

        return ({
          key: cartItem.buy_id,
          prod_name: prodName,
          pic_name: picName,
          sort_name: subProdObj.sortname,
          spec_name: subProdObj.specname,
          price: isSpecial ? subProdObj.price_sp : subProdObj.price,
          price_sp: subProdObj.price_sp,
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