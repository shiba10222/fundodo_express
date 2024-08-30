Table product {
  id               int(9) [primary key]
  name             varchar(50)
  brand            varchar(20)
  cate_1           varchar(2)
  cate_2           varchar(10)
  is_near_expired  tinyint(1)
  is_refurbished   tinyint(1)
  description      varchar(2000)
}

Table prod_age {
  id        bugint(10) [primary key]
  prod_id   int(9)          // product的id
  age       varchar(10)
}

Table prod_body {
  id        int(10) [primary key]
  prod_id   int(9)          // product的id
  body      varchar(10)
}

Table prod_picture {
  id        bigint(10) [primary key]
  prod_id   int(9)         // product的id
  name      varchar(20)
}

Table prod_price_stock {
  id          bigint(11) [primary key]
  prod_id     int(9)         // product的id
  price       mediumint(7)
  price_sp    mediumint(6)
  sortname    varchar(20)
  specname    varchar(20)
  stock       mediumint(6)
}

Table prod_tag {
  id       bigint(10) [primary key]
  prod_id  int(9)          // product的id
  tag_id   varchar(20)
}