/**
 * 0 ~ n - 1 的整數
 * @param {number} n 
 * @returns {number}
 */
const diceOf = n => Math.floor(Math.random() * n);

/**
 * 將陣列的順序打亂，且為平均分佈
 * @param {array} 要洗牌的陣列 
 */
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = diceOf(i + 1);
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}


const gaussianRandom = (mean, stddev) => {
  let u = 0,
    v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  const sample = Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);

  return sample * stddev + mean;
};

/**
 * 給定範圍內以常態分佈抽出一個整數
 * @param {number} min 允許的最小整數
 * @param {number} max 允許的最大整數
 * @returns {number} 單個整數
 */
const normalRandInt = (min, max) => {
  // 若遇到不允許情形，則輸出 0.5
  if (min > max || (max - min) <= 6 || min % 1 || max % 1) return 0.5;

  const num_possible = max - min + 1;
  const MD = num_possible / 2;//median
  const MU = num_possible / 6;//μ, 正負三個標準差範圍設為全範圍

  let result = Math.round(gaussianRandom(MD, MU));

  while (result > max || result < min) result = Math.round(gaussianRandom(MD, MU));

  return result;
};

export { diceOf, shuffle, normalRandInt }