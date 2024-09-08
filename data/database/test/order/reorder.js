import { readJson, writeJson } from '../lib-json.js';
import { getTimeNum } from '../lib-time.js';

const PATH_HERE = import.meta.dirname;
let orderList = await readJson(PATH_HERE, 'orders-new.json');

orderList = orderList.sort(
  (a, b) => getTimeNum(a.created_at) - getTimeNum(b.created_at)
).map(o => {
  const {id, ...others} = o;
  return others;
});

await writeJson(PATH_HERE, 'orders-v10.json', orderList);