//==========================================================================
//========================= 將訂單資料重新排序 ================================
//==========================================================================

import { readJson, writeJson } from '../lib-json.js';
import { getTimeNum } from '../lib-time.js';

//====== Json =========================================
const PATH_HERE = import.meta.dirname;
const orderList = await readJson(PATH_HERE, './book-record-unsorted.json');

//====== sorting =========================================

orderList.sort((a, b) => {
  const t_a = getTimeNum(a.ordered_date);
  const t_b = getTimeNum(b.ordered_date);
  if (t_a !== t_b) return t_a - t_b;

  const u_a = a.user_id;
  const u_b = b.user_id;
  if (u_a !== u_b) return u_a - u_b;

  if ((!a.dog_id && !b.dog_id)) {
    const sizeList = ['S', 'M', 'L'];
    const index_a = sizeList.indexOf(a.room_type);
    const index_b = sizeList.indexOf(b.room_type);
    return index_a - index_b;
  } else if (a.dog_id || b.dog_id) {
    return a.dog_id ? 1 : -1;
  } else {
    return a.dog_id - b.dog_id
  }
});

const bookRecord = orderList;

await writeJson(PATH_HERE, './book-record.json', bookRecord);
