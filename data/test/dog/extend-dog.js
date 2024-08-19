//==========================================================================
//======================== 將狗資料增加生日與體重 ==========================
//==========================================================================

// 原先他人所作，但是中途資料欄位跑掉，導致後面超過大半資料報廢

import { diceOf } from '../lib-math.js';
import { readJson, writeJson } from '../lib-json.js';
import { randDateBetween, nYearsBefore, getDateStr, getTimeNum, getTimeStr } from "../lib-time.js";

//====== Json =========================================
const PATH_HERE = import.meta.dirname;

let dogList = await readJson(PATH_HERE, 'dogs.json');

const sample = {
  id: 564,
  name: "Zephyr",
  user_id: 296,
  gender: 2,
  age: 7,
  bodytype: "MINI",
  breed: "吉娃娃",
  created_at: "2024-09-06 19:43:48"
};

const target = {
  id: 564,
  name: "Zephyr",
  user_id: 296,
  gender: 2,
  birthday: "2014-03-23",
  bodytype: "MINI",
  weight: 3.7,
  breed: "吉娃娃",
  created_at: "2024-09-06 19:43:48"
}

//====== Function =========================================
const geneWeight = type => {
  switch (type) {
    case 'MINI':
      return diceOf(40) + 10;
    case 'SMALL':
      return diceOf(70) + 40;
    case 'MEDIUM':
      return diceOf(150) + 110;
    case 'BIG':
      return diceOf(190) + 260;
    default: throw new Error("Unknown bodytype");
  }
}

const getAge = type => {
  let dice = 0;
  switch (type) {
    case 'MINI':
    case 'SMALL':
      dice = diceOf(20);
      if (dice <= 10) return diceOf(11) + 1;
      else if (dice <= 18) return diceOf(7) + 12;
      else return diceOf(3) + 19;
    case 'MEDIUM':
      dice = diceOf(20);
      if (dice <= 10) return diceOf(11) + 1;
      else if (dice <= 18) return diceOf(4) + 12;
      else return diceOf(3) + 16;
    case 'BIG':
      dice = diceOf(20);
      if (dice <= 10) return diceOf(9) + 1;
      else if (dice <= 18) return diceOf(3) + 10;
      else return diceOf(2) + 13;
    default: throw new Error("Unknown bodytype");
  }
}

const geneDOB = age => {
  const y_1 = 2024 - age;
  const birthday = randDateBetween(
    `${y_1}-01-01 00:00:00`, `${y_1}-12-31 23:59:59`
  );
  return getDateStr(birthday);
}


//====== Main =========================================
const ONE_YEAR = 1000 * 3600 * 24 * 365.25;
const now = new Date().getTime();

dogList = dogList.map(dog => {

  const w = geneWeight(dog.bodytype) / 10;
  // console.log('bodytype: ', dog.bodytype);
  // console.log('__weight: ', w);
  // process.exit(0);

  const t_ref = getTimeNum(dog.created_at);
  let new_age = getAge(dog.bodytype);
  if (new_age * ONE_YEAR + t_ref < now) new_age = getAge(dog.bodytype);
  const birthday = geneDOB(new_age);

  // console.log('__bodytype: ', dog.bodytype);
  // console.log("_______age: ", new_age);
  // console.log("created_at: ", dog.created_at);
  // console.log("__birthday: ", birthday);

  return {

    id: dog.id,
    name: dog.name.trim(),
    user_id: dog.user_id,
    gender: dog.gender,
    dob: birthday,
    bodytype: dog.bodytype,
    weight: w,
    breed: dog.breed,
    created_at: dog.created_at,
  }
});

await writeJson(PATH_HERE, 'dogs-0819.json', dogList);
