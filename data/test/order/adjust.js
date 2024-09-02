import { readJson, writeJson } from '../lib-json.js';
import { diceOf } from '../lib-math.js';

const PATH_HERE = import.meta.dirname;
const orderList = await readJson(PATH_HERE, 'orders-v10.json');

const psChoice = [
  "請上午送",
  "請在上午送",
  "只有上午有人收",
  "上午才有人收件",
  "請下午送",
  "請在下午送",
  "只有下午有人收",
  "下午才有人收件",
  "請上午送，謝謝",
  "請在上午送，謝謝",
  "只有上午有人收，謝謝",
  "上午才有人收件，謝謝",
  "請下午送，謝謝",
  "請在下午送，謝謝",
  "只有下午有人收，謝謝",
  "下午才有人收件，謝謝",
  "謝謝送貨大哥",
  "謝謝司機大哥",
  "謝謝運將大哥",
  "有管理員代收",
  "有警衛代收",
  "有管理員就好",
  "給警衛就好",
  "有管理員代收，謝謝",
  "有警衛代收，謝謝",
  "有管理員就好，謝謝",
  "給警衛就好，謝謝",
];
const N = psChoice.length;

const diceOfPS = () => {
  if (diceOf(3) === 0) return psChoice[diceOf(N)];
  else return '';
}

const result = orderList.map(o => {
  const ship_ps = Object.prototype.hasOwnProperty
    .call(o, 'ship_ps') ? o.ship_ps : diceOfPS();
  const ship_zipcode = Object.prototype.hasOwnProperty
    .call(o, 'zip_zipcode') ? o.zip_zipcode : o.ship_zipcode;
    
  const {
    user_id,
    order_id,
    amount,
    addressee,
    tel,
    email,
    pay_thru,
    ship_thru,
    ship_address,
    created_at,
    deleted_at,
  } = o;

  return {
    user_id,
    order_id,
    amount,
    addressee,
    tel,
    email,
    pay_thru,
    ship_thru,
    ship_zipcode,
    ship_address,
    ship_ps,
    created_at,
    deleted_at,
  }
});

await writeJson(PATH_HERE, 'orders-v11.json', result);
