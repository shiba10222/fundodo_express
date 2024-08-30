import { resolve } from 'path';
import readJson from '../read-json.js';
import writeJson from '../write-json.js';

const pathTo = pahtStr => resolve(import.meta.dirname, pahtStr);

//====== Json ================================
const permPath = pathTo('crs-perm-old.json');
const permList = await readJson(permPath);

//====== Json ================================

permList.sort((a, b) => a.timeStamp - b.timeStamp);

const results = permList.map(d => {
  const {timeStamp, ...others} = d;
  others.start_date = others.start_date.slice(0, 10);
  others.id = null;
  return others;
})

// console.log(results.slice(0, 3));
const rslPath = pathTo('./crs-perm.json');
writeJson(rslPath, JSON.stringify(results));