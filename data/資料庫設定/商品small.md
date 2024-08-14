//商品分類一、商品分類二、商品
Table brand_category {
  id        bigint(10) [primary key]
  category  varchar(20)
  brand     varchar(20)
}

Table category {
  id          smallint(4) [primary key]
  cate_1_name varchar(20)
  cate_1_name varchar(20)
}

//=== old version below ===

Table category_1 {
  id int(11) [primary key]
  name varchar(20)
}

Table category_2 {
  id int(11) [primary key]
  cate_1_id int(11)// category_1的id
  name varchar(20)
}

Table agetype {
  id int(11) [primary key]
  name varchar(10)
}

Table bodytype {
  id int(11) [primary key]
  name varchar(12)
}

Table pr_brand {
  id smallint(4) [primary key]
  name varchar(50)
}

Table pr_sort {
  id bigint(10) [primary key]
  name varchar(50)
}

Table pr_spec {
  id bigint(10) [primary key]
  name varchar(32)
}

Table pr_tag {
  id int(9) [primary key]
  name varchar(16)
}