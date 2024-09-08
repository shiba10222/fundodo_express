//==========================================================================
//========================= 製作旅館的訂單資料 ================================
//==========================================================================

import { readJson, writeJson } from '../lib-json.js';
import { diceOf, shuffle, normalRandInt } from '../lib-math.js';
import {
  getTimeStr,
  getTimeNum,
  nDaysAfter,
  randDateBetween,
  longAfter
} from '../lib-time.js';


//====== Json =========================================
const PATH_HERE = import.meta.dirname;
const userList = await readJson(PATH_HERE, '../user/users.json');
const dogList = await readJson(PATH_HERE, '../dog/dogs.json');
const hotelPKG = await readJson(PATH_HERE, '../hotel/hotel.json');

const hotelList = hotelPKG.hotel;


userList.shift();//排除管理者
const NUM_HT = hotelList.length;

//====== 時間 Functions ================================

const randNumDay = () => {
  const dice = diceOf(20);

  if (dice <= 3) return 21 + diceOf(3);
  else if (dice <= 8) return 14 + diceOf(3);
  else if (dice <= 14) return 6 + diceOf(3);
  else return 1 + diceOf(3);
}

/**
 * @param {number} t_ref 起算的基準時間
 * @param {number} N 資料筆數
 * @returns {number[]} 長度 N 的時間戳記陣列
 */
const geneTimeSeries = (t_ref, N) => {
  let refSeries = [t_ref];
  let inDateSeries = [nDaysAfter(t_ref, randNumDay())];
  let daySeries = [randNumDay()];

  for (let i = 0; i < N; i++) {
    refSeries.push(nDaysAfter(inDateSeries[i], daySeries[i]));
    inDateSeries.push(longAfter(refSeries[i + 1], 10 * (diceOf(6) + 1)));
    daySeries.push(randNumDay());
  }
  const resultArr = inDateSeries.map(t => getTimeStr(t));
  return [resultArr, daySeries];
}
//====== 旅館 Functions ================================

const getBookedNum = () => {
  const dice = diceOf(20);

  if (dice <= 1) return 3;
  else if (dice <= 10) return 2;
  else return 1;
}
//====== 狗勾 ================================
const typeOf = {
  "MINI": "S",
  "SMALL": "S",
  "MEDIUM": "M",
  "BIG": "L"
};

/**
 * @param {number} uid user ID
 * @returns array of data of each dog of the user
 */
const findDogs = uid => dogList.filter(dog => dog.user_id === uid);

const geneDogs = (time_ref) => {
  const numPet = diceOf(3) + 1;
  const types = Object.keys(typeOf);

  //因為後面會經過 max 函數，必須提供 number
  const dogs = Array(numPet).fill(0).map(_ => ({
    id: 0,
    bodytype: types[diceOf(types.length)],
    created_at: time_ref
  }));
  return dogs;
}

const handleDogList = dogs => {
  if (dogs.length === 1) {
    const the_dog = {
      id: dogs[0].id,
      bodytype: dogs[0].bodytype
    };
    return [[the_dog], dogs[0].created_at];
  }

  let newArr = dogs.map(d => ({
    id: d.id,
    bodytype: d.bodytype,
    created_at: d.created_at
  }));
  newArr = shuffle(newArr);
  //一半的機會，有一隻狗沒有住
  if (diceOf(2)) {
    newArr.pop();
    newArr = shuffle(newArr);
  }

  const idList = newArr.flatMap(dog => dog.id);
  const lastID = Math.max(...idList);
  const lastDog = newArr.filter(dog => dog.id === lastID)[0];

  const rslArr = newArr.map(dog => {
    const { created_at, ...others } = dog;
    return others;
  });

  return [rslArr, lastDog.created_at];
}

/**
 * 
 * @param {object} hotelPkg 整包旅館資料
 * @param {string} bodytype 狗的原資料體型，單字而非單個字母
 * @returns 
 */
const getPrice = (hotelPkg, bodytype) => {
  const priceList = [
    hotelPkg.price_s,
    hotelPkg.price_m,
    hotelPkg.price_l
  ];

  let price = 0;

  switch (bodytype) {
    case "MINI":
    case "SMALL":
      price = Number(priceList[0]);
      break;
    case "MEDIUM":
      price = Number(priceList[1]);
      break;
    case "BIG":
      price = Number(priceList[2]);
      break;
    default:
      throw new Error("出事了 bodytype");
  }
  return price;
}

//====== Main ==========================================
const TIME_BOUND = "2024-09-09";
const ALL_INDEX = shuffle(Array(NUM_HT).fill(0).map((_, i) => i + 1));
const bookRecord = [];
await Promise.all(userList.map(async u => {
  if (diceOf(2) !== 0) return;
  //全部會員二分之一在購物車有訂過旅館
  let petArr = findDogs(u.id);
  if (petArr.length === 0) petArr = geneDogs(u.created_at);

  const numBooked = getBookedNum();
  const hotelID = ALL_INDEX[normalRandInt(0, NUM_HT - 1)];
  const selectedhotel = hotelList.find(h => h.id == hotelID);
  const [dogStayList, time_ref] = handleDogList(petArr);
  const [inDateArr, daysArr] = geneTimeSeries(time_ref, numBooked);

  //================================================
  inDateArr.forEach((date, i) => {
    const checkin_date = date;

    // const ref_start = Math.max(getTimeNum(time_ref), getTimeNum(TIME_BOUND));
    const ref_end = Math.min(getTimeNum(checkin_date), getTimeNum(TIME_BOUND));
    const orderedDate = getTimeStr(randDateBetween(time_ref, ref_end));
    const stayDays = daysArr[i];
    const checkout_date = getTimeStr(nDaysAfter(date, stayDays));

    dogStayList.forEach(dog => {
      const price = getPrice(selectedhotel, dog.bodytype);

      bookRecord.push({
        id: null,
        hotel_id: hotelID,
        user_id: u.id,
        dog_id: (dog.id === 0) ? null : dog.id,
        room_type: typeOf[dog.bodytype],
        created_at: orderedDate,
        check_in_date: checkin_date,
        check_out_date: checkout_date,
        uni_price: price,
        total_price: price * stayDays,
      });
    });
  });
}));

//參考，訂單的格式
// const reference = {
//   id: null,
//   hotel_id: hotelID,
//   user_id: u.id,
//   dog_id: (dog.id === 0) ? null : dog.id,
//   room_type: typeOf[dog.bodytype],
//   ordered_date: orderedDate,
//   check_in_date: checkin_date,
//   check_out_date: checkout_date,
//   uni_price: price,
//   total_price: price * stayDays,
//   total_nights: stayDays,
//   status: "confirmed",
// }

await writeJson(PATH_HERE, './book-record.json', bookRecord);