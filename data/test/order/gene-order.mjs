import { resolve } from 'path';
import readJson from '../read-json.mjs';
import writeJson from '../write-json.mjs';

const userPath = resolve(import.meta.dirname, '../user/users.json');
const userList = await readJson(userPath);
const prodPath = resolve(import.meta.dirname, '../prod/all-tables.json');
const prodPkg = await readJson(prodPath);

const prodItemList = prodPkg.tables.prod_price_stock;
const num_items = prodItemList.length;

userList.shift();

/**
 * 0 ~ n - 1 的整數
 * @param {number} n 
 * @returns {number}
 */
const diceOf = n => Math.floor(Math.random() * n);

//============================================================
const randQty = () => {
  const dice = diceOf(100);
  if (dice === 0) return diceOf(7) + 4;
  else if (dice <= 25) return diceOf(2) + 2;
  else return 1;
}

/**
 * 生成一連串的品項序列
 */
const geneArray = () => {
  const a_1 = diceOf(num_items - 1);//首項
  const step = 2 * diceOf(500) + 1;// 公差
  const num_in_cart = diceOf(7) + 1;// 項數

  const cartList = [{ prod_id: a_1, qty: randQty() }];
  for (let i = 1; i < num_in_cart; i++) {
    const prev = cartList[i - 1].prod_id;
    const next = (prev + step) % num_items;
    cartList.push({ prod_id: next, qty: randQty() });
  }
  return cartList;
}
//============================================================
/**
 * 將所有符合 new Date() 建構子的時間格式轉成時間戳記的格式
 * @param {*} timeLike 時間格式
 * @returns {number} 時間戳記
 */
const getTimeNum = timeLike => new Date(timeLike).getTime();

/**
 * 將時間戳記的格式轉成指定的字串格式
 * @param {number} timeNum 
 * @returns 
 */
const getTimeStr = timeNum => {
  let str = new Date(timeNum).toJSON();
  return str.replace(/T/, ' ').slice(0, str.length - 5);
}

const longAfter = time => {
  const t_i = getTimeNum(time);
  const t_f = getTimeNum("2024-09-09T20:00:00");
  const D_t = t_f - t_i;

  const delta = Math.floor(Math.random() * (D_t - 1) + 1);
  const new_time = new Date(t_i + delta).toJSON();
  return new_time;
}
const shortAfter = time => {
  const new_time = new Date(time);
  const d_min = diceOf(8) + 2;
  const d_sec = diceOf(30) + 25;
  new_time.setMinutes(new_time.getMinutes() + d_min);
  new_time.setSeconds(new_time.getSeconds() + d_sec);

  return new_time.toJSON();
}

const geneTimeSeries = (t_ref, N) => {
  const t_1 = longAfter(t_ref);

  if (N === 1) return [getTimeStr(t_1)];

  const timeSeries = [t_1];
  for (let i = 1; i < N; i++) {
    if (diceOf(5) === 0) timeSeries.push(longAfter(timeSeries[i - 1]));
    else timeSeries.push(shortAfter(timeSeries[i - 1]));
  }

  return timeSeries.map(t => getTimeStr(t));
}

//============================================================
const orderArr = [];

for (let user of userList) {
  if (diceOf(6) % 3 === 0) continue; //三分之二的使用者有存放購物車

  let buyList = geneArray();

  const timeStr = geneTimeSeries(user.created_at, buyList.length);

  buyList = buyList.map((d, i) => ({
    user_id: user.id,
    prod_id: d.prod_id,
    qty: d.qty,
    created_at: timeStr[i]
  }));

  orderArr.push(...buyList);
}

const outputPath = resolve(import.meta.dirname, 'cart.json');
writeJson(outputPath, JSON.stringify(orderArr));