//====== 製作課程的購物車資料

import { resolve } from 'path';
import readJson from '../read-json.js';
import writeJson from '../write-json.js';

const pathTo = pahtStr => resolve(import.meta.dirname, pahtStr);

//====== Json ================================
const userPath = pathTo('../user/users.json');
const userList = await readJson(userPath);

const crsPath = pathTo('courses.json');
const crsList = await readJson(crsPath);

const crsPermPath = pathTo('crs-perm.json');
const crsPermList = await readJson(crsPermPath);
//====== 時間 Functions ================================
/**
 * 0 ~ n - 1 的整數
 * @param {number} n 
 * @returns {number}
 */
const diceOf = n => Math.floor(Math.random() * n);

/**
 * 將時間戳記的格式轉成指定的字串格式
 * @param {number} timeNum
 * @returns 
 */
const getTimeStr = timeNum => {
  let str = new Date(timeNum).toJSON();
  return str.replace(/T/, ' ').slice(0, str.length - 5);
}

/**
 * 將所有符合 new Date() 建構子的時間格式轉成時間戳記的格式
 * @param {*} timeLike 時間格式
 * @returns {number} 時間戳記
 */
const getTimeNum = timeLike => new Date(timeLike).getTime();

const shortAfter = time => {
  const new_time = new Date(time);
  const d_min = diceOf(8) + 2;
  const d_sec = diceOf(30) + 25;
  new_time.setMinutes(new_time.getMinutes() + d_min);
  new_time.setSeconds(new_time.getSeconds() + d_sec);

  return getTimeNum(new_time);
}

const longAfter = time => {
  const t_i = getTimeNum(time);
  const t_f = getTimeNum("2024-09-09T20:00:00");
  const D_t = t_f - t_i;

  const delta = Math.floor(Math.random() * (D_t - 1) + 1);
  return t_i + delta;
}

/**
 * 
 * @param {number} t_ref 起算的基準時間
 * @param {number} N 資料筆數
 * @returns {number[]} 長度 N 的時間戳記陣列
 */
const geneTimeSeries = (t_ref, N) => {
  const t_0 = getTimeNum(t_ref);
  const t_1 = longAfter(t_0);

  if (N === 1) return [t_1];

  const timeSeries = [t_1];
  for (let i = 1; i < N; i++) {
    if (diceOf(5) === 0) timeSeries.push(longAfter(timeSeries[i - 1]));
    else timeSeries.push(shortAfter(timeSeries[i - 1]));
  }

  return timeSeries;
}
//====== 課程 Functions ================================

const geneIndexArr = (arr, N) => {
  const length = arr.length;
  const i_0 = diceOf(length);
  if (N === 1) return [i_0];
  const delta = diceOf(5) + 1;
  const iArr = Array(N).fill(i_0).map((v, i) => v + i * delta);
  return iArr.map(index => Number(crsList[index % 23].id));
}

const getCrsNum = () => {
  const dice = diceOf(10);
  if (dice === 0) return 5;
  else if (dice <= 2) return 3;
  else if (dice <= 4) return 2;
  else return 1;
}
//====== Main ================================
const crsCartResult = [];
const INDEX_ARR = Array(23).fill(0).map((_, i) => i + 1);

userList.forEach(u => {
  if (diceOf(3) !== 0) return;//全部會員三分之一在購物車有課程

  const numCrs = getCrsNum();
  const usedCrsID = crsPermList
    .filter(item => item.user_id === u.id)
    .flatMap(item => item.crs_id);
  const unusedCrsID = INDEX_ARR.filter(j => usedCrsID.indexOf(j) === -1);

  let indexList = geneIndexArr(unusedCrsID, numCrs);
  if (indexList.length === 3) {
    indexList = indexList.map((_, i, arr) => arr[(i + 1) % arr.length])
  } else if (indexList.length > 3) {
    indexList = indexList.map((_, i, arr) => arr[(i + 3) % arr.length]);
  }
  const timeArr = geneTimeSeries(u.created_at, numCrs);

  indexList.forEach((crs_id, i) => {
    crsCartResult.push({
      id: null,
      user_id: u.id,
      buy_sort: 'CR',
      buy_id: crs_id,
      quantity: null,
      amount: null,
      created_at: timeArr[i],
      deleted_at: null
    });
  })
});

const rslPath = pathTo('./crs-cart.json');
writeJson(rslPath, JSON.stringify(crsCartResult));