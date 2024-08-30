import crypto from 'crypto'
import dotenv from 'dotenv';

dotenv.config();
const { EC_HASHKEY, EC_HASHIV } = process.env;

/**
 * 生成 20 碼的交易識別用編號
 * @description fundodo 加上函數執行時間而成的字串
 * 請用 toLocaleString('zh-TW')
 * @param {string} 
 * @returns {string} 
 */
const getTradeNo = (timeStr) => {
  const strArr = timeStr.split(' ');
  return 'fdd' + strArr[0].replaceAll('/', '') + strArr[1].replaceAll(':', '');
}

function CheckMacValueGen(parameters, algorithm, digest) {
  /**
   * 
   * @param {string} string 
   * @returns 
   */
  function DotNETURLEncode(string) {
    const list = {
      '%2D': '-',
      '%5F': '_',
      '%2E': '.',
      '%21': '!',
      '%2A': '*',
      '%28': '(',
      '%29': ')',
      '%20': '+',
    }
    Object.entries(list).forEach(([encoded, decoded]) => {
      const regex = new RegExp(encoded, 'g')
      string = string.replace(regex, decoded)
    })
    return string
  }
  const Step0 = Object.entries(parameters)
    .map(([key, value]) => `${key}=${value}`)

  const Step1 = Step0
    .sort((a, b) => {
      const keyA = a.split('=')[0]
      const keyB = b.split('=')[0]
      return keyA.localeCompare(keyB)
    })
    .join('&')
  const Step2 = `HashKey=${EC_HASHKEY}&${Step1}&HashIV=${EC_HASHIV}`
  const Step3 = DotNETURLEncode(encodeURIComponent(Step2))
  const Step4 = Step3.toLowerCase()
  const Step5 = crypto.createHash(algorithm).update(Step4).digest(digest)
  const Step6 = Step5.toUpperCase()
  return Step6
}

export {
  getTradeNo,
  CheckMacValueGen
}