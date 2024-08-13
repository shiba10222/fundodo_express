Table product {
id               int(9) [primary key]
name             varchar(200)
brand_id         smallint(4)// pr_brand的id
cate_1_id        tinyint(1)// category_1的id
cate_2_id        smallint(4)// category_2的id
is_near_expired  tinyint(1)
is_refurbished   tinyint(1)
description      varchar(2000)
}

Table prod_age {
id               int(10) [primary key]
prod_id          int(9)          // product的id
age_id           tinyint(1)
}

Table prod_body {
id               int(10) [primary key]
prod_id          int(9)          // product的id
body_id          tinyint(1)
}

Table prod_picture {
id               bigint(11) [primary key]
prod_id          int(9)         // product的id
name             varchar(20)
}

Table prod_price_stock {
id               bigint(13) [primary key]
prod_id          int(9)         // product的id
sort_id          bigint(10)     // pr_sort的id
spec_id          bigint(10)     // pr_spec的id
price            mediumint(7)
stock            smallint(4)
}

Table prod_tag {
id       bigint(11) [primary key]
prod_id  int(9)          // product的id
tag_id   int(9)          // pr_tag的id
}