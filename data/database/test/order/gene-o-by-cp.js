import { readJson, writeJson } from '../lib-json.js';
import { v4 as uuid4 } from 'uuid'
import { getTimeNum, getTimeStr_DB } from '../lib-time.js';
import mysql from "mysql2/promise";
// dotenv.config();

//! === 公告 ===
//請在自己的電腦以 .env 檔設定以下五項資訊
const conn = mysql.createPool({
  host: "localhost",
  user: "fundodo",
  port: 3306,
  password: "fdd12345",
  database: "fundodo",
});

const PATH_HERE = import.meta.dirname;

//todo: coupon 使用紀錄
//todo: 訂單編號 20240902+uuid
//todo: 增加用戶資料 name, tel, email

let userList = await readJson(PATH_HERE, '../user/users.json');
userList.unshift('');

let orderListRaw = await readJson(PATH_HERE, 'orders-0902.json');

// console.log(userList.length);
// console.log(orderList.length);

//*=================================================
const [cityListRaw] = await conn.query(`SELECT * FROM tw_citys`);
const cityList = cityListRaw.map(c => c.name);
cityList.unshift('');
// console.log(cityList);

//*=================================================
//查詢區名
const getAddrHead = async zipcode => {
  const [results] = await conn.query(
    "SELECT name, city_id FROM `tw_dist` WHERE `zipcode` = ?",
    [zipcode]);

  const { name, city_id } = results[0];
  return cityList[city_id] + name;
}

//*=================================================
// console.log(orderListRaw[15]);
const orderP1 = orderListRaw.map(o => {
  const uid = Number(o.user_id);
  const username = o.addressee || userList[uid].name;
  const timeStr = o.created_at.split(' ')[0].replaceAll('-', '');
  const orderSeries = timeStr + uuid4().slice(-10);

  return {
    ...o,
    id: Number(o.id),
    order_id: orderSeries,
    user_id: uid,
    addressee: o.addressee || userList[uid].name,
    tel: o.tel || userList[uid].tel,
    email: o.email || userList[uid].email,
    addressee: username,
    ship_thru: 'DLV',
    pay_thru: 'EC',
    amount: Number(o.amount),
    ship_zipcode: Number(o.ship_zipcode),
  }
});
orderP1.sort((a, b) => getTimeNum(a.created_at) - getTimeNum(b.created_at));

// console.log(orderP1[7]);SELECT * FROM `tw_dist` WHERE `zipcode` =
//*=================================================

const [cpListRaw] = await conn.query(
  `SELECT user_id, cp_id, applied_at
  FROM coupon_user WHERE applied_at IS NOT NULL`
);

// console.log(cpListRaw.length);
const tmpArr = cpListRaw.map(
  cp => [cp.user_id, cp.cp_id, getTimeStr_DB(cp.applied_at)].join('H')
);

const tmpSet = new Set(tmpArr);
const cpList = Array.from(tmpSet).map(str => {
  const [user_id, cp_id, applied_at] = str.split('H');
  return {
    user_id: Number(user_id),
    cp_id: Number(cp_id),
    applied_at
  };
});

// console.log(cpList.length);
const orderP2 = await Promise.all(
  cpList.map(async cp => {
    const { user_id, applied_at } = cp;
    const u = userList[user_id];
    const timeStr = applied_at.split(' ')[0].replaceAll('-', '');
    const orderSeries = timeStr + uuid4().slice(-10);

    const zip_zipcode = u.adr_district;
    const ADR = await getAddrHead(zip_zipcode) + u.address;

    return {
      id: null,
      user_id,
      order_id: orderSeries,
      amount: 0,
      addressee: u.name,
      tel: u.tel,
      email: u.email,
      pay_thru: 'EC',
      ship_thru: 'DLV',
      zip_zipcode,
      ship_address: ADR,
      created_at: applied_at,
      deleted_at: null
    }
  })
);
orderP2.sort((a, b) => getTimeNum(a.created_at) - getTimeNum(b.created_at));
conn.end();

// console.log(orderP1[6]);
// console.log(orderP2[100]);

let orderList = [...orderP1, ...orderP2]
.map(item => ({
  ...item,
  created_at: item.created_at.replace(' 24:', ' 00:')
})).sort((a, b) => a.timeNum - b.timeNum);

writeJson(PATH_HERE, 'orders-new.json', orderList);