import { diceOf } from '../lib-math.js';
import { readJson, writeJson } from '../lib-json.js';
import { getTimeNum, randTimeBetween, nDaysAfter, getTimeStr_DB } from '../lib-time.js';
import geneCode from '../../../routes/coupon/_aux/geneCode.js';

//========= Json ====================================================
const PATH_HERE = import.meta.dirname;

let userList = await readJson(PATH_HERE, '../user/users.json');
userList = userList.map(u => ({ ...u, t_ref: getTimeNum(u.created_at) }));

let cpList = await readJson(PATH_HERE, 'coupon.json');
cpList = cpList.map(cp => ({ ...cp, t_ref: getTimeNum(cp.created_at) }));
// let index equal to ID
cpList.unshift({});

let hotelOrderList = await readJson(PATH_HERE, '../hotel/book-record.json');

let prevOrder = {
  user_id: 0,
  ordered_date: '',
  t_ref: 0
};

hotelOrderList = hotelOrderList.map((o, i, arr) => {
  const user_id = o.user_id;
  if (i === 0 || user_id !== arr[i - 1].user_id
    || o.ordered_date !== arr[i - 1].ordered_date) {
    const t_0 = getTimeNum(o.ordered_date);
    const t_1 = nDaysAfter(t_0, 1);
    const t_ref = randTimeBetween(t_0, t_1);

    prevOrder = {
      user_id,
      ordered_date: getTimeStr_DB(t_ref),
      t_ref
    };
  }

  return prevOrder;
});
//t_ref | 增加方便比較用的時間值

// 排除管理員帳號
userList.shift();

//========= Func ====================================================

/** 變成該月的第一天之第一刻 */
const toFirstDate = (t) => {
  const time = new Date(t);
  time.setDate(1);
  time.setHours(0);
  time.setMinutes(0);
  time.setSeconds(0);

  return time;
}
/** 變成該月的最後一天之最後一刻 */
const toLastDate = (t) => {
  const time = new Date(t);
  time.setMonth(time.getMonth() + 1);
  time.setDate(0);
  time.setHours(23);
  time.setMinutes(59);
  time.setSeconds(59);

  return time;
}
const toLastSecAfterNDays = (t_0, n) => {
  const t_1 = nDaysAfter(t_0, n);
  const time = new Date(t_1);
  time.setHours(23);
  time.setMinutes(59);
  time.setSeconds(59);

  return getTimeNum(time);
}

/**
  * 搜尋第一個適用優惠券的該筆訂單
  * @param {object[]} orderList 
  * @returns {number} 訂單在 orderList 中的 index
  */
const getminMax = (orderList, t_line) => {
  const line = getTimeNum(t_line);
  for (let i = 0; i < orderList.length - 1; i++) {
    if (getTimeNum(orderList[i].ordered_date) > line) return i;
  }
  return -1;
}

const findNextTime = (orderList, now) => {
  const timeList = orderList.map(o => o.ordered_date);
  const index = timeList.lastIndexOf(now);

  if (index === orderList.length - 1) return null;
  else return orderList[index + 1].ordered_date;

}

//========= Main ====================================================
/**
* @description
* - 註冊發放: 4, 10
* - 生日發放: 7
* - 消費發放: 11
* - 長期發放: 1, 2, 3, 5, 6, 12, 13
* - 期間限定: 8, 14, 15, 16, 17, 18, 19
* - 自行領取: 9
 */
let cpIndexList = [
  [4, 10],
  [7],
  [11],
  [1, 2, 3, 5, 6, 12, 13],
  [8, 14, 15, 16, 17, 18, 19],
  [9]
];

const newArr = [];
const checkList = [];

userList.forEach(user => {
  const orderHistory = hotelOrderList.filter(order => order.user_id === user.id);

  // checkList.push({
  //   user_id: user.id,
  //   u_from: user.created_at,
  //   orderHistory: orderHistory.map(order => order.ordered_date)
  // });

  //*========== 註冊發放 (4, 10) ======================
  cpIndexList[0].forEach(i_cp => {
    const coupon = cpList[i_cp];
    if (user.t_ref >= coupon.t_ref) {
      //===== 通用
      const createTime = user.created_at;
      const expiredTime = toLastSecAfterNDays(createTime, coupon.time_span);

      newArr.push({
        code: geneCode(),
        user_id: user.id,
        cp_id: coupon.id,
        created_at: getTimeStr_DB(createTime),
        applied_at: null,
        expired_at: getTimeStr_DB(expiredTime),
        t_ref: getTimeNum(createTime)
      });
    } else {
      //===== 旅館
      //確定只有 id 10 的進得來
      //而 id 11 的旅館回購九折券，下個階段統一處理
      if (orderHistory.length === 0 || getTimeNum(orderHistory[0].ordered_date) >= getTimeNum(coupon.created_at)) {
        const createTime = getTimeNum(coupon.start_date);
        const expiredTime = toLastSecAfterNDays(createTime, coupon.time_span);
        const usedIndex = getminMax(orderHistory, "2022-04-10 00:00:00");

        let applied_at = null;
        if (usedIndex > -1) {
          const probablyUseTime = getTimeNum(orderHistory[usedIndex].ordered_date);
          applied_at = ((usedIndex > -1) && (probablyUseTime <= expiredTime))
            ? getTimeStr_DB(probablyUseTime) : null;
        }

        newArr.push({
          code: geneCode(),
          user_id: user.id,
          cp_id: coupon.id,
          created_at: getTimeStr_DB(createTime),
          applied_at,
          expired_at: getTimeStr_DB(expiredTime),
          t_ref: getTimeNum(createTime)
        });
      }
    }
  });
  //*========== 生日發放 (7) ======================
  const cp_b = cpList[cpIndexList[1][0]];//from 2023-01-01 00:00:00
  let ptr_b = new Date(user.dob);
  let ptr_u = new Date(user.created_at);
  //== 2023
  ptr_b.setFullYear(2023);
  if (getTimeNum(ptr_b) >= getTimeNum(ptr_u)) {
    let ptr_0 = toFirstDate(ptr_b);
    ptr_0 = Math.max(getTimeNum(ptr_0), getTimeNum(user.created_at));
    let ptr_1 = toLastDate(ptr_b);
    newArr.push({
      code: geneCode(),
      user_id: user.id,
      cp_id: cp_b.id,
      created_at: getTimeStr_DB(ptr_0),
      applied_at: diceOf(2) ? getTimeStr_DB(randTimeBetween(ptr_0, ptr_1)) : null,
      expired_at: getTimeStr_DB(ptr_1),
      t_ref: getTimeNum(ptr_0)
    });
  }
  //== 2024
  ptr_b.setFullYear(2024);
  if (
    getTimeNum(ptr_b) >= getTimeNum(ptr_u)
    && getTimeNum(ptr_b) < getTimeNum('2024-10-01 00:00:00')
  ) {
    let ptr_0 = toFirstDate(ptr_b);
    let ptr_1 = toLastDate(ptr_b);
    ptr_0 = Math.max(getTimeNum(ptr_0), getTimeNum(user.created_at));
    newArr.push({
      code: geneCode(),
      user_id: user.id,
      cp_id: cp_b.id,
      created_at: getTimeStr_DB(ptr_0),
      applied_at: diceOf(2) ? getTimeStr_DB(randTimeBetween(ptr_0, ptr_1)) : null,
      expired_at: getTimeStr_DB(ptr_1),
      t_ref: getTimeNum(ptr_0)
    });
  }
  //*========== 旅館訂購觸發 (11) ======================

  if (orderHistory.length > 0) {
    const cp_h = cpList[cpIndexList[2][0]];//from 2024-04-01 00:00:00
    const j_firstApplicable = getminMax(orderHistory, '2024-04-01 00:00:00');
    let t_create = null;
    let t_used = null;
    if (j_firstApplicable === 0) {
      t_create = getTimeStr_DB(orderHistory[0].ordered_date);
      t_used = findNextTime(orderHistory, t_create);

      // if (user.id === 15) {
      //   console.log(orderHistory);
      //   console.log('t_create: ' + t_create);
      //   console.log('t_used: ' + t_used);
      //   process.exit(0);
      // }
    } else {
      t_create = cp_h.created_at;

      //avoid NOT FOUND 
      t_used = (j_firstApplicable > 0)
        ? getTimeNum(orderHistory[j_firstApplicable].ordered_date)
        : null;
    }

    t_create = t_create ? getTimeStr_DB(t_create) : null;
    let t_expired = t_create
      ? getTimeStr_DB(toLastSecAfterNDays(t_create, cp_h.time_span)) : null;
    t_used = t_used && getTimeNum(t_used) < getTimeNum(t_expired)
      ? getTimeStr_DB(t_used) : null;

    newArr.push({
      code: geneCode(),
      user_id: user.id,
      cp_id: cp_h.id,
      created_at: t_create,
      applied_at: t_used,
      expired_at: t_expired,
      t_ref: getTimeNum(t_create)
    });
  }

  //*========== 長期發放 (1, 2, 3, 5, 6, 12, 13) ======================

  /** 大量發放的規劃 */
  const dist_plan = [
    ["2022-05-10 10:00:00", 1],
    ["2022-10-10 10:00:00", 2],
    ["2023-01-08 10:00:00", 3],
    ["2023-03-08 10:00:00", 3],
    ["2023-04-10 10:00:00", 5],
    ["2023-06-08 10:00:00", 3],
    ["2023-07-10 10:00:00", 6],
    ["2023-09-08 10:00:00", 3],
    ["2023-10-10 10:00:00", 1],
    ["2023-11-04 10:00:00", 3],
    ["2023-12-10 10:00:00", 3],
    ["2024-01-08 10:00:00", 3],
    ["2024-02-10 10:00:00", 5],
    ["2024-04-08 10:00:00", 3],
    ["2024-06-10 10:00:00", 6],
    ["2024-07-10 10:00:00", 12],
    ["2024-07-10 10:30:00", 13]
  ];

  dist_plan.forEach(plan => {
    const dist_time = getTimeNum(plan[0]);
    const coupon = cpList[plan[1]];

    if (user.t_ref <= dist_time) {
      const t_f = toLastSecAfterNDays(dist_time, coupon.time_span);

      newArr.push({
        code: geneCode(),
        user_id: user.id,
        cp_id: coupon.id,
        created_at: getTimeStr_DB(dist_time),
        applied_at: diceOf(2) ? getTimeStr_DB(randTimeBetween(dist_time, t_f)) : null,
        expired_at: getTimeStr_DB(t_f),
        t_ref: dist_time
      });
    }
  });

  //*========== 長期發放 (8, 14, 15, 16, 17, 18, 19) ======================

  [8, 14, 15, 16, 17, 18, 19].forEach(cp_id => {
    const coupon = cpList[cp_id];
    const distTime = getTimeNum(coupon.start_date);

    if (user.t_ref <= distTime) {
      const t_f = getTimeNum(coupon.end_date);

      newArr.push({
        code: geneCode(),
        user_id: user.id,
        cp_id: coupon.id,
        created_at: getTimeStr_DB(distTime),
        applied_at: diceOf(2) ? getTimeStr_DB(randTimeBetween(distTime, t_f)) : null,
        expired_at: getTimeStr_DB(t_f),
        t_ref: distTime
      });
    }
  })
});
// let j = 294;
// console.log('====================== checkList');
// console.log(checkList[j]);
// console.log('====================== couponList');
// console.log(newArr.filter(obj => obj.user_id === j + 2));
// process.exit(0);
//========= Sort ====================================================

newArr.sort((a, b) => {
  if (a.t_ref !== b.t_ref) return a.t_ref - b.t_ref;
  if (a.user_id !== b.user_id) return a.user_id - b.user_id;
  return a.cp_id - b.cp_id;
});

const result = newArr.map(obj => {
  const { t_ref, ...others } = obj;
  return others;
})

await writeJson(PATH_HERE, 'coupon-user.json', result);
