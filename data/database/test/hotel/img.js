import { resolve } from 'path';
import writeJson from '../write-json.js';

const pathTo = pahtStr => resolve(import.meta.dirname, pahtStr);

const t ={
  id: null,
  hotel_id: 1,
  path: 'HT000011.jpg' 
  
}

const arr = [];


for ( let id = 1 ; id <= 32 ; id++ ){
  const str = `${id}`.padStart(5, '0');
  for ( let i = 1 ; i <= 3 ; i++ ){
    const obj ={
      id: null,
      hotel_id: id,
      path: `HT${str}${i}.jpg` 
      
    }
    arr.push(obj)
  }
}

await writeJson(pathTo('hotel_img.json'), JSON.stringify(arr))