import readJSON from './read-json.mjs'
import { resolve } from 'path'
import writeJSON from './write-json.mjs'
import { stringify } from 'querystring'

const path = resolve(import.meta.dirname, "prod/prod_price_stock.json")
const pkg = await readJSON(path)

const dataArr = pkg.data;

// console.log(dataArr[0]);
const dice = () => Math.floor(Math.random()*2);

const newArr = dataArr.map((v, i)=>{
  let price_sp = 0;
  if(dice() === 0) return {...v, price_sp: null};

  if (dice() === 1) {
    price_sp = Math.ceil(v.price*0.8)

  }else{
    price_sp = (v.price-10)
  }
  return {...v, price_sp}
})

// console.log(newArr.slice(0, 15));
const path1 = resolve(import.meta.dirname, "prod/prod_price_stock1.json")

writeJSON(path1, JSON.stringify(newArr))

