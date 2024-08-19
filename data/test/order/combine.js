//==========================================================================
//======================== 將旅館購物車轉換為正式格式 ==========================
//==========================================================================

import { readJson, writeJson } from '../lib-json.js';
import { getTimeNum, getTimeStr, randDateBetween, nDaysAfter } from "../lib-time.js";

//====== Json =========================================
const PATH_HERE = import.meta.dirname;

let cartHT = await readJson(PATH_HERE, 'cart-ht-temp.json');
let cartCR = await readJson(PATH_HERE, 'cart-crs-temp.json');
let cartPD = await readJson(PATH_HERE, 'cart-pd-temp.json');
let crsList = await readJson(PATH_HERE, '../course/courses.json');

//====== 更新格式
const timeCovert = t_orig => {
  const t_new = randDateBetween(t_orig, nDaysAfter(t_orig, 1));
  return getTimeStr(t_new);
}

const priceList = crsList.map(d => Number(d.price));
priceList.unshift(0);

cartHT = cartHT.map(d => {
  const newTime = timeCovert(d.created_at);

  return {
    ...d,
    created_at: newTime
  }
});
cartCR = cartCR.map(d => ({
  id: null,
  user_id: d.user_id,
  dog_id: null,
  buy_sort: d.buy_sort,
  buy_id: d.buy_id,
  quantity: 1,
  amount: priceList[d.buy_id],/* 此行經過事後修正 */
  room_type: null,
  check_in_date: null,
  check_out_date: null,
  created_at: timeCovert(d.created_at),
  deleted_at: null
}));


cartPD = cartPD.map(d => ({
  id: null,
  user_id: d.user_id,
  dog_id: null,
  buy_sort: d.buy_sort,
  buy_id: d.buy_id,
  quantity: d.quantity,
  amount: null,
  room_type: null,
  check_in_date: null,
  check_out_date: null,
  created_at: d.created_at,
  deleted_at: null
}));

const cartArr = [...cartHT, ...cartPD, ...cartCR];

cartArr.sort((a, b) => getTimeNum(a.created_at) - getTimeNum(b.created_at))

await writeJson(PATH_HERE, 'cart-whole.json', cartArr);
