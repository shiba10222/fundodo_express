import { resolve } from 'path';
import readJson from '../read-json.js';
import writeJson from '../write-json.js';
import { create } from 'domain';

const pathTo = pathStr => resolve(import.meta.dirname, pathStr);

const orderList = await readJson(pathTo('cart.json'));

const sample = {
  user_id: 2,
  prod_id: 462,
  qty: 1,
  created_at: "2023-09-29 22:33:11"
};

const target = {
  id: null,
  user_id: 2,
  buy_sort: 'PD',
  buy_id: 462,
  quantity: 1,
  amount: null,
  created_at: "2023-09-29 22:33:11",
  deleted_at: null
};

const newList = orderList.map(pkg => ({
  id: null,
  user_id: pkg.user_id,
  buy_sort: 'PD',
  buy_id: pkg.prod_id,
  quantity: pkg.qty,
  amount: null,
  created_at: pkg.created_at,
  deleted_at: null
}))

writeJson(pathTo('cart-pd-temp.json'), JSON.stringify(newList));
