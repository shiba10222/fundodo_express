
Table hotel_list {
  id              integer [primary key]
  location_id     integer  
--從地區資料
  name            varchar
  description     varchar
  room_type_id    integer
  address         varchar
  coordinates_id  integer
  phone           varchar
  optional_id     integer
  created_at      timestamp 
  valid           tinyint
}

Table room_category {
  id          integer [primary key]
  room_type   varchar
}


--旅館附加服務
Table optional {
  id      integer [primary key]
  service varchar
}


Table hotel_img{
  id        integer [primary key]
  hotel_id  varchar
  path      varchar
  valid     tinyint
}

Table coordinates {
  id        integer [primary key]
  latitude  double
  longitude double
}


--每個具體房間的資訊
Table room {
  id            integer [primary key]
  hotel_id      integer
  room_type_id  integer
  room_number   varchar
  is_available  boolean
  price         decimal
}


--房間訂單
Table booking {
  id              integer [primary key]
  room_id         integer
  user_id         integer 
--從會員資料
  check_in_date   date
  check_out_date  date
  status          varchar 
-- 'confirmed', 'cancelled', 'completed'
}

Table review {
  id          integer [primary key]
  hotel_id    integer 
--從旅館列表
  user_id     integer 
--從會員資料
  booking_id  integer 
--從房間訂單
  rating      integer 
-- 1-5 star
  comment     text
  created_at  timestamp
}

Ref: hotel_list.room_type_id > room_category.id 
Ref: hotel_list.location_id > area_category.id
Ref: hotel_list.coordinates_id > coordinates.id
Ref: hotel_list.optional_id > optional.id

Ref: hotel_img.hotel_id > hotel_list.id
Ref: room.hotel_id > hotel_list.id
Ref: room.room_type_id > room_category.id
Ref: booking.room_id > room.id

Ref: review.hotel_id > hotel_list.id
Ref: review.booking_id > booking.id
