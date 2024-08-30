//==========================================================================
//======================== 將旅館購物車轉換為正式格式 ==========================
//==========================================================================

import { readJson, writeJson } from '../lib-json.js';

//====== Json =========================================
const PATH_HERE = import.meta.dirname;

const cartList = await readJson(PATH_HERE, 'cart-hotel-raw.json');

const sample = {
  "id": null,
  "user_id": 3,
  "hotel_id": 6,
  "dog_id": 186,
  "room_type": "M",
  "created_at": "2023-12-01",
  "check_in_date": "2023-12-04",
  "check_out_date": "2023-12-20",
  "uni_price": 541,
  "total_price": 8656
};

const newList = cartList.map(pkg => ({
  id: null,
  user_id: pkg.user_id,
  dog_id: pkg.dog_id,
  buy_sort: 'HT',
  buy_id: pkg.hotel_id,
  quantity: 1,
  amount: pkg.total_price,
  room_type: pkg.room_type,
  check_in_date: pkg.check_in_date,
  check_out_date: pkg.check_out_date,
  created_at: pkg.created_at,
  deleted_at: null
}))

await writeJson(PATH_HERE, 'cart-cr-temp.json', newList);
