# 購物車 API 路由規劃


# GET

## 查詢指定用戶購物車資料
（全部）

相對路由：`/:id` - user ID

### 輸入格式

（無）

### 輸出格式

```JS
{
  status: "success",
  message: "查詢成功",
  result: {
    PD: rows_PD,
    CR: rows_CR,
    HT: rows_HT,
  }
}
```
---
# POST

## 新增指定用戶購物車資料
（針對單個產品 ID）

相對路由：`/`

詳[文件](./購物車%20API%20文件.md)

---
# PATCH

## 指定用戶購物車指定資料
（針對單個購物車項目 ID）

適用情形：軟刪除、恢復軟刪除，及其他單條更改

相對路由：`/:id` - cart item ID

---
# UPDATE

## 購物車大存檔
（針對多個購物車項目 ID）

相對路由：`/:id` - user ID


---
# DELETE

## 硬刪除指定用戶購物車指定資料
（針對多個購物車項目 ID）

相對路由：`/`