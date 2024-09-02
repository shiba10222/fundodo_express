import { getTimeNum } from '../lib-time.js';

const t_a = "2024-09-27 13:44:51";
const t_b = "2024-09-18 00:34:27";

const n_a = getTimeNum(t_a);
const n_b = getTimeNum(t_b);

console.log("t_a: " + t_a, " --> ", n_a);
console.log("t_b: " + t_b, " --> ", n_b);

console.log(getTimeNum(t_a) - getTimeNum(t_b) > 0
  ? "t_a 比較晚" : "t_b 比較晚");