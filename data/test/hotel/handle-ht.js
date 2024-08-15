//====== 製作課程的購物車資料

import { resolve } from 'path';
import readJson from '../read-json.js';
import writeJson from '../write-json.js';

const pathTo = pahtStr => resolve(import.meta.dirname, pahtStr);

//====== Json =========================================
const userPath = pathTo('../user/users.json');
const userList = await readJson(userPath);

const dogPath = pathTo('../dog/dogs.json');
const dogList = await readJson(dogPath);

const hotelPath = pathTo('hotel.json');
const hotelPKG = await readJson(hotelPath);

const hotelList = hotelPKG.hotel;
const bookingList = hotelPKG.booking;

userList.shift();//排除管理者
const NUM_HT = hotelList.length;

//====== 機率 Functions ================================
/**
 * 0 ~ n - 1 的整數
 * @param {number} n 
 * @returns {number}
 */
const diceOf = n => Math.floor(Math.random() * n);

/**
 * 將陣列的順序打亂，且為平均分佈
 * @param {array} 要洗牌的陣列 
 */
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

/**
 * 亂序的旅館 ID 列表
 * from 1 to 32
 */
const ALL_INDEX = shuffle(Array(NUM_HT).fill(0).map((_, i) => i + 1));

const gaussianRandom = (mean, stddev) => {
  let u = 0,
    v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  const sample = Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);

  return sample * stddev + mean;
};

const randID = () => {
  const MD = NUM_HT / 2;//median
  const MU = NUM_HT / 6;//μ, 正負三個標準差範圍設為全範圍
  const MIN = 0;
  const MAX = NUM_HT - 1;

  let index = Math.round(gaussianRandom(MD, MU));

  while (index > MAX || index < MIN) index = Math.round(gaussianRandom(MD, MU));

  return ALL_INDEX[index];
};
//====== 時間 Functions ================================
/**
 * 將時間戳記的格式轉成指定的字串格式
 * @param {number} timeNum
 * @returns 
 */
const getTimeStr = timeNum => {
  let str = new Date(timeNum).toJSON();
  return str.split('T')[0];
}

/**
 * 將所有符合 new Date() 建構子的時間格式轉成時間戳記的格式
 * @param {*} timeLike 時間格式
 * @returns {number} 時間戳記
 */
const getTimeNum = timeLike => new Date(timeLike).getTime();

const nDaysAfter = (time, n) => {
  const day = new Date(time);
  day.setDate(day.getDate() + n);

  return getTimeNum(day);
}

const longAfter = time => {
  const t_i = getTimeNum(time);
  const t_f = getTimeNum("2024-09-09T20:00:00");
  const D_t = t_f - t_i;

  const delta = diceOf(D_t - 1) + 1;
  return t_i + delta;
}

const randDateBetween = (start, end) => {
  const t_i = getTimeNum(start);
  const t_f = getTimeNum(end);
  const D_t = t_f - t_i;

  const delta = diceOf(D_t - 1) + 1;
  return t_i + delta;
}

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
    inDateSeries.push(longAfter(refSeries[i + 1]));
    daySeries.push(randNumDay());
  }
  const resultArr = inDateSeries.map(t => getTimeStr(t));
  return [resultArr, daySeries];
}
//====== 旅館 Functions ================================

const getBookedNum = () => {
  const dice = diceOf(20);

  if (dice === 0) return 5;
  else if (dice <= 3) return 3;
  else if (dice <= 10) return 2;
  else return 1;
}
//====== 狗勾 ================================
/**
 * @param {number} uid user ID
 * @returns array of data of each dog of the user
 */
const findDogs = uid => dogList.filter(dog => dog.user_id === uid);

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

const typeOf = {
  "MINI": "S",
  "SMALL": "S",
  "MEDIUM": "M",
  "BIG": "L"
};

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
const bookRecord = [];

await Promise.all(userList.map(async u => {
  if (diceOf(2) !== 0) return;
  //全部會員二分之一在購物車有訂過旅館
  const petArr = findDogs(u.id);
  if (petArr.length === 0) return;

  const numBooked = getBookedNum();
  const hotelID = randID();
  const selectedhotel = hotelList.find(h => h.id == hotelID);
  const [dogStayList, time_ref] = handleDogList(petArr);
  const [inDateArr, daysArr] = geneTimeSeries(time_ref, numBooked);

  //================================================

  inDateArr.forEach((date, i) => {
    const checkin_date = inDateArr[i];
    const orderedDate = getTimeStr(randDateBetween(time_ref, checkin_date));
    const stayDays = daysArr[i];
    const checkout_date = getTimeStr(nDaysAfter(inDateArr[i], stayDays));

    dogStayList.forEach(dog => {
      const price = getPrice(selectedhotel, dog.bodytype);

      bookRecord.push({
        id: null,
        hotel_id: hotelID,
        user_id: u.id,
        dog_id: dog.id,
        room_type: typeOf[dog.bodytype],
        ordered_date: orderedDate,
        check_in_date: checkin_date,
        check_out_date: checkout_date,
        uni_price: price,
        total_price: price * stayDays,
        total_nights: stayDays,
        status: "confirmed",
      });
    });
  });
}));

const rslPath = pathTo('./book-record.json');
await writeJson(rslPath, JSON.stringify(bookRecord));