import readJson from '../read-json.js';
import writeJson from '../write-json.js';
import { resolve } from 'path';
const __dirpath = import.meta.dirname

//====== Json ================================
const uPath = resolve(__dirpath, '../user/users.json');
const userArr = await readJson(uPath);

const dPath = resolve(__dirpath, './dogs.json');
const dogList = await readJson(dPath);


//====== Functions ================================
/**
 * 0 ~ n - 1 的整數
 * @param {number} n 
 * @returns {number}
 */
const diceOf = n => Math.floor(Math.random() * n);

/**
 * 以指定的機率分佈隨機生成寵物隻數
 * @returns {number} 使用者的登記寵物數量 0 ~ 5
 */
const getPetNum = () => {
  const dice = diceOf(17);
  if (dice === 1) return 0;
  else if (dice <= 7) return 1;
  else if (dice <= 11) return 2;
  else if (dice <= 14) return 3;
  else if (dice <= 16) return 4;
  else return 5;
}

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
 * @param {number} N 寵物隻數
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

//====== Main ================================
const targetFormat = {
  user_id: Number,
  timeStamp: Number,
  createdAt: String,
  gender: Number,
  age: Number,
  bodytype: String,
  breed: String,
  name: String,
}

let j_dog = 0;
const next_dog = i => {
  i = (i + 19) % dogList.length;
  return i;
}

const dogResult = [];

userArr.forEach(u => {
  const numPets = getPetNum();
  if (numPets === 0) return null;

  const timeArr = geneTimeSeries(u.created_at, numPets);

  timeArr.forEach(stamp => {
    const newDog = {
      user_id: u.id,
      timeStamp: stamp,
      createdAt: getTimeStr(stamp),
      gender: dogList[j_dog].gender,
      age: diceOf(15) + 1,
      bodytype: dogList[j_dog].bodytype,
      breed: dogList[j_dog].breed,
      name: dogList[j_dog].name,
    }
    dogResult.push(newDog);
    j_dog = next_dog(j_dog);
  });
});

// console.log(dogResult);

const rslPath = resolve(__dirpath, 'dog-results.json');
await writeJson(rslPath, JSON.stringify(dogResult));