Table article{
    id 	            int(10) [primary key]
    title	          varchar(50)
    content	        longtext
    sort	          int(5) 
    -- article_sort 的 ID
    create_at 	    datetime
    userid	        int(11)
    article_delete	int(11)
}

Table article_img{
    id 	        int(11) [primary key]
    img_path	  varchar(255)
    article_id 	int(11) 
--article 的 ID
}

Table article_sort{
    id 	  int(11) [primary key] 
    sort	varchar(10)	
}

Table reply{
    id          int(11) [primary key]
    content     longtext
    create_at	  datetime
    userid	    int(11)   
--users 的 ID
    floor       int(11)
    article_id  int(11)   
--article 的 ID
}

Table reply_img{
    id 	      int(11) [primary key]
    img_path	varchar(255)
    reply_id 	int(11) 
--reply 的 ID
}