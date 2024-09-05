//*=====================  格式轉換  ======================

/**
 * 將時間戳記的格式轉成指定的字串格式
 * @param {number} timeNum
 * @example 2024-08-18
 */
const getDateStr = timeNum => {
  let str = new Date(timeNum).toJSON();
  return str.split('T')[0];
}
/**
 * 將時間戳記的格式轉成指定的字串格式
 * @param {number} timeNum
 * @example 2024/08/18 12:00:55
 */
const getTimeStr = timeNum => {
  let str = new Date(timeNum).toLocaleString('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
    timeZone: 'Asia/Taipei',
  });
  //! 不使用 Asia/Taipei，因為顯示的都以 UTC 為本位
  // 例如：台灣（+8）的 0 點會顯示成（+0）的 8 點
  return str;
}
/**
 * 將時間戳記的格式轉成指定的字串格式
 * @param {number} timeNum
 * @example 2024-08-18 12:00:55
 */
const getTimeStr_DB = timeNum => {
  let str = new Date(timeNum).toLocaleString('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
    timeZone: 'Asia/Taipei',
  });
  //! 不使用 Asia/Taipei，因為顯示的都以 UTC 為本位
  // 例如：台灣（+8）的 0 點會顯示成（+0）的 8 點
  str = str.replaceAll('/', '-');
  return str;
}

/**
 * 將所有符合 new Date() 建構子的時間格式轉成時間戳記的格式
 * @param {*} timeLike 時間格式
 * @returns {number} 時間戳記
 */
const getTimeNum = timeLike => new Date(timeLike).getTime();


//*=====================  機率方法  ======================
/**
 * 0 ~ n - 1 的整數
 * @param {number} n 
 * @returns {number}
 */
const diceOf = n => Math.floor(Math.random() * n);




//*=====================  日期跳轉  ======================

/**
 * @param {number} time new Date() 可以接受的時間格式
 * @param {number} n 欲得多少天後的時間點
 * @returns 
 */
const nDaysAfter = (time, n = 0) => {
  const day = new Date(time);
  day.setDate(day.getDate() + n);

  return getTimeNum(day);
}

const nYearsBefore = (time, n) => {
  const ano_toki = new Date(time);
  ano_toki.setFullYear(ano_toki.getFullYear() - n);

  return getTimeNum(ano_toki);
}

const randTimeBetween = (start, end) => {
  const t_i = getTimeNum(start);
  const t_f = getTimeNum(end);
  const D_t = t_f - t_i;

  if(D_t === 0) return t_i;
  else if(D_t < 0) {
    console.log('t_i: ', getTimeStr(t_i));
    console.log('t_f: ', getTimeStr(t_f));
    throw new Error('Ahhhh');
  }

  const delta = diceOf(D_t - 1) + 1;
  return t_i + delta;
}

/**
 * 
 * @param {time} time new Date() 可以接受的時間格式
 * @param {number} bound 幾天以內的範圍
 * @returns 
 */
const longAfter = (time, bound) => {
  const t_i = getTimeNum(time);
  const t_f = nDaysAfter(time, bound);
  return randTimeBetween(t_i, t_f);
}

export {
  getTimeStr,
  getTimeStr_DB,
  getDateStr,
  getTimeNum,
  nDaysAfter,
  nYearsBefore,
  randTimeBetween,
  longAfter
}