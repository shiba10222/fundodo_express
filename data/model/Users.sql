Table users{
  id            	int(6)      [primary key]
  name	          varchar(50)
  nickname	      varchar(50)
  account	        varchar(50)
  password_hash	  varchar(60)
  gender		      tinyint(1) 
--genders 的 ID
  user_level		  tinyint(1) 
--user_level 的 ID
  dob             date
  tel 	          varchar(20)
  email           varchar(50)
  avatar_file     varchar(150)
  address         varchar(100)
  adr_city_id     tinyint(2)  
--tw_citys 的 ID
  adr_dist_id     smallint(3) 
--genders tw_dist ID
  created_at    	datetime	
  deleted_at      datetime
}

-- -----------------------------------------------------
Table user_level {
id   	tinyint(2) [primary key]
name  varchar(10)
}