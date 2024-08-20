# 購物車 API 文件

## 新增購物車

### API information

使用前請先確認資料庫是否已經建立 cart 資料表

URL: `http://localhost:3005/api/cart`

method: `POST`

資料請用 FormData 包裝，並置於 body 屬性下。

### 商品類 Product

```js
 const format_PD = {
    "user_id": 214,
    "buy_sort": "PD",//必須填這個字串
    "buy_id": 42,// prod_price_stock 的 ID
    "quantity": 3, // 欲加入購物車之數量
  };
```

### 旅館類 Hotel

```js
 const format_HT = {
    "user_id": 116,
    "dog_id": 119,//  (optional)供使用者綁定狗勾用
    "buy_sort": "HT",//必須填這個字串
    "buy_id": 7,// hotel 的 ID
    "amount": 4788,
    "room_type": "S",// 必須為單個字元
    "check_in_date": "2023-10-18",
    "check_out_date": "2023-11-01",
  };
```

### 課程類 Course

```js
 const format_CR = {
    "user_id": 11,
    "buy_sort": "CR",//必須填這個字串
    "buy_id": 5,// courses 的 ID
  };
```