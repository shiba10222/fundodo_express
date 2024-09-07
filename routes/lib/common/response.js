/** 請求已成功執行
 * @description status 設定為 success
 */
const res200Json = (res, message, result = undefined) => {
  if (result === undefined)
    res.status(200).json({
      status: "success",
      message
    });
  else
    res.status(200).json({
      status: "success",
      message,
      result
    });
  console.info('┌─→ ' + message);
}

/** 拒絕請求
 * @description status 設定為 rejected
 */
const res400Json = (res, message, result = undefined) => {
  if (result === undefined)
    res.status(400).json({
      status: "rejected",
      message
    });
  else
    res.status(400).json({
      status: "rejected",
      message,
      result
    });
  console.error('┌─→ ' + message);
}

export {
  res200Json,
  res400Json
}