//====== 基本參數 =================================
const lengthCode = 10;

/** 所有可能出現的字元 */
const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

//====== 輔助函數 =================================
const charDice = () => {
  const index = Math.floor(Math.random() * charset.length);
  return charset[index];
}

/**
 * 
 * @returns {string} 13 碼優惠碼
 */
export default function () {
  let str = 'fdd';
  for (var i = 0; i < lengthCode; i++) {
    str += charDice();
  }
  return str;
}