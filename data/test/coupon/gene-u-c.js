import {readJson, writeJson} from '../lib-json.js';
import geneCode from '../../../routes/coupon/auxiliary/geneCode.js';

//========= Json ====================================================
const path_here = import.meta.dirname;

const userList = await readJson(path_here, '../user/users.json');
const cpList = await readJson(path_here, 'coupon.json');


const target = {
  code     :null,
  user_id  :0,
  cp_id    :0,
  status   :'三個字'
}

console.log(geneCode());