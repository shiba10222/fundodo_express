import readJson from '../read-json.js';
import writeJson from '../write-json.js';
import { resolve } from 'path';
const __dirpath = import.meta.dirname

//====== Json ================================
const dPath = resolve(__dirpath, './dog-results.json');
const dogArr = await readJson(dPath);

//====== Main ================================

dogArr.sort((a, b) => a.timeStamp - b.timeStamp);

const dogResult = dogArr.map((d, i) => {
  const {timeStamp, ...others} = d;
  return {
    id: i + 1,
    ...others
  }
});

// console.log(dogResult.slice(0, 5));

const rslPath = resolve(__dirpath, 'dog-final.json');
await writeJson(rslPath, JSON.stringify(dogResult));