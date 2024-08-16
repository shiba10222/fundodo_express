import { LuPlus, LuMinus } from "react-icons/lu";

/**
 * 數量控制面板
 * @param {number} quantity 數量的初始值
 * @param {function} setFunc 數量所搭配的 useState set函數
 * @param {number} index 若 useState 設定為數值陣列，此面板控制的數在該陣列中的編號；若 useState 設定為（單獨）數值，則此參數不用設定
 * @param {string} className 自訂樣式
 * @description 若有數量歸零的特殊處遇，本函數沒有提供相關機制；請另以 useEffect 追蹤與限制該 useState
 */
export const NumberPanel = ({
  quantity = 1,
  setFunc = () => { },
  index = -1,
  className = {}
}) => {
  const changeBy = delta => {
    if (index === -1) setFunc(n => n + delta);
    else setFunc(arr => arr.map((d, j) => (j === index) ? (d + delta) : d));
  }

  return (
    <div className={`hstack mx-auto p-2 ${className}`} style={{ width: '8rem', height: '3rem', border: '1px solid #787473' }}>
      <div className='fx-center' onClick={() => changeBy(-1)}>
        <LuMinus />
      </div>
      <div className='flex-grow-1 tx-center'>{quantity}</div>
      <div className='fx-center' onClick={() => changeBy(1)}>
        <LuPlus />
      </div>
    </div>
  );
}