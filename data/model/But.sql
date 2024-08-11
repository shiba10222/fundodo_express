
--
-- 購物流程相關的表
--

Table carts {
  id integer [primary key]
  user_id integer
--users 的 id
  prod_item_id integer
--prod_price_stock 的 id
  crs_id integer
--course 的 id
  qty integer
  created_at datetime
}

Table orders {
  id integer [primary key]
  user_id integer
--users 的 id
  prod_item_id integer
--prod_price_stock 的 id
  crs_id integer
--course 的 id
  qty integer
  created_at datetime
}

--======================== 優惠券相關 ============================

Table cp_category {
  id tinyint(1) [primary key]
}

Table coupons {
  id         mediuminteger(5) [primary key]
  name       varchar(20)
  code       varchar(20)      
-- 優惠碼
  category   tinyint(1)       
-- 商品種類   
-- cp_category 的 ID
  discount   decimal(7,2)     
-- 包含折扣（四位整數）與折數（兩位小數）
  desc       varchar(100)     
-- 對外描述
  min_spent  mediuminteger(5) 
-- 滿額門檻
  start_date date             
-- 啟用日期（活動期間）
  end_date   date             
-- 中止日期（活動期間，null for 長期發放）
  created_at datetime         
-- 超提早情形之追蹤用
  status     tinyint(1)       
-- 臨時中止之情形使用
}

Table cp_status {
  id       tinyint(1) [primary key]
  name     varchar(12)        
-- 未領取、未使用、已使用、已過期
}

Table coupon_user {
  id       integer [primary key]
  user_id  integer           
-- users 的 ID
  cp_id    mediuminteger(5)  
-- coupons 的 ID
  status   tinyint(1)        
-- cp_status 的 ID
}