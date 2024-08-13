-- 資料表標題： Fundodo 會員狗勾資料
-- 摘要：根據會員總表生成的狗勾資料

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+08:00";

-- --------------------------------------------------------

--
-- 資料表結構 `dogs`
--

CREATE TABLE IF NOT EXISTS `dogs` (
    `id` int(8) NOT NULL,
    `user_id` int(7) NOT NULL,
    `created_at` DATETIME NOT NULL,
    `gender` tinyint(1) UNSIGNED NOT NULL,
    `age` tinyint(2) UNSIGNED,
    `bodytype` VARCHAR(6) NOT NULL,
    `breed` VARCHAR(4) NOT NULL,
    `name` VARCHAR(6) NOT NULL,
    `deleted_at` DATETIME
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
INSERT INTO `dogs` VALUES
  (1,27,'2022-08-04 03:08:30',2,12,'SMALL','狐狸犬','吉利', NULL),
	(2,10,'2022-08-22 16:02:23',2,7,'SMALL','貴賓犬','球球', NULL),
	(3,40,'2022-09-23 16:07:40',1,3,'MEDIUM','米克斯','Moose', NULL),
	(4,46,'2022-10-06 13:34:38',1,11,'MEDIUM','米克斯','拿鐵', NULL),
	(5,35,'2022-10-08 11:11:12',1,4,'MINI','博美犬','Nimbus', NULL),
	(6,47,'2022-11-02 04:01:41',1,6,'SMALL','狐狸犬','Tahoe', NULL),
	(7,47,'2022-11-02 04:10:22',2,9,'SMALL','狐狸犬','布丁', NULL),
	(8,47,'2022-11-02 04:19:53',1,5,'MEDIUM','米克斯','米米', NULL),
	(9,42,'2022-11-11 01:24:36',1,13,'MEDIUM','柴犬','麻糬', NULL),
	(10,68,'2022-11-16 21:45:49',1,8,'MEDIUM','柴犬','甜不辣', NULL),
	(11,68,'2022-11-16 21:52:25',2,12,'MEDIUM','米克斯','NONO', NULL),
	(12,24,'2022-11-17 01:46:51',2,2,'MINI','約克夏','奶油', NULL),
	(13,16,'2022-11-27 00:53:13',2,5,'MINI','博美犬','糖糖', NULL),
	(14,16,'2022-11-27 01:02:40',1,11,'MEDIUM','米克斯','多多', NULL),
	(15,16,'2022-11-27 01:10:08',1,9,'MINI','博美犬','總監', NULL),
	(16,45,'2022-12-06 09:30:20',2,7,'MEDIUM','米克斯','牛奶', NULL),
	(17,45,'2022-12-06 09:35:13',2,15,'MINI','馬爾濟斯','黑輪', NULL),
	(18,45,'2022-12-06 09:43:40',2,1,'BIG','杜賓犬','Ruckus', NULL),
	(19,76,'2022-12-26 08:31:38',2,5,'MEDIUM','米克斯','Nutmeg', NULL),
	(20,76,'2022-12-26 08:38:23',2,1,'MEDIUM','米克斯','男爵', NULL),
	(21,76,'2022-12-26 08:47:12',2,11,'BIG','哈士奇','Nessie', NULL),
	(22,76,'2022-12-26 08:55:46',1,8,'MEDIUM','柯基','Jeff', NULL),
	(23,14,'2022-12-30 17:14:16',1,15,'MEDIUM','米克斯','Effie', NULL),
	(24,14,'2022-12-30 17:17:59',1,5,'BIG','哈士奇','Tug', NULL),
	(25,14,'2022-12-30 17:27:39',1,3,'SMALL','狐狸犬','甜不辣', NULL),
	(26,48,'2023-01-03 14:48:05',2,1,'MINI','吉娃娃','土豆', NULL),
	(27,48,'2023-01-03 14:50:51',1,12,'MINI','吉娃娃','Bertha ', NULL),
	(28,86,'2023-01-13 17:05:16',1,10,'SMALL','臘腸犬','天天', NULL),
	(29,86,'2023-01-13 17:10:44',2,4,'MEDIUM','柯基','Chomper', NULL),
	(30,86,'2023-01-13 17:18:30',2,15,'BIG','黃金獵犬','帥哥', NULL),
	(31,33,'2023-01-16 15:23:12',1,11,'MEDIUM','米克斯','Tequila', NULL),
	(32,33,'2023-01-16 15:29:03',1,10,'SMALL','法國鬥牛犬','妞妞', NULL),
	(33,33,'2023-01-16 15:31:29',2,6,'MEDIUM','柯基','高貴', NULL),
	(34,20,'2023-01-31 02:04:41',2,15,'MINI','博美犬','Argo', NULL),
	(35,9,'2023-02-05 03:27:51',2,8,'BIG','黃金獵犬','Maude', NULL),
	(36,9,'2023-02-05 03:34:26',1,14,'MEDIUM','米克斯','嘟嘟', NULL),
	(37,22,'2023-02-09 16:19:55',1,13,'SMALL','雪納瑞','球球', NULL),
	(38,79,'2023-02-10 10:28:59',2,1,'MEDIUM','米克斯','Lulu', NULL),
	(39,101,'2023-02-11 03:30:15',1,12,'SMALL','西施犬','帥氣 ', NULL),
	(40,93,'2023-02-18 00:39:45',1,8,'SMALL','狐狸犬','課長', NULL),
	(41,93,'2023-02-18 00:44:27',1,2,'MEDIUM','柴犬','Tug', NULL),
	(42,49,'2023-02-23 15:54:06',2,1,'SMALL','西施犬','Tugboat', NULL),
	(43,49,'2023-02-23 16:02:48',1,15,'MEDIUM','柯基','巧克力', NULL),
	(44,49,'2023-02-23 16:11:32',1,4,'MINI','約克夏','Nimbus', NULL),
	(45,49,'2023-03-07 21:29:43',2,3,'SMALL','臘腸犬','長長', NULL),
	(46,6,'2023-03-09 11:27:29',2,5,'SMALL','貴賓犬','Brynn', NULL),
	(47,6,'2023-03-09 11:30:12',1,14,'BIG','拉不拉多','可樂', NULL),
	(48,6,'2023-03-09 11:39:43',1,15,'SMALL','臘腸犬','總監', NULL),
	(49,7,'2023-03-12 13:57:06',2,14,'MINI','約克夏','Nimbus', NULL),
	(50,7,'2023-03-12 13:59:41',1,3,'MINI','吉娃娃','胖胖', NULL),
	(51,97,'2023-03-30 01:35:17',1,10,'BIG','黃金獵犬','Bertha ', NULL),
	(52,37,'2023-03-31 11:01:00',2,7,'MEDIUM','米克斯','Sweety', NULL),
	(53,37,'2023-03-31 11:08:38',1,5,'MEDIUM','柴犬','Bjorn', NULL),
	(54,112,'2023-04-04 17:52:10',1,4,'SMALL','臘腸犬','River', NULL),
	(55,87,'2023-04-09 16:35:51',1,10,'SMALL','狐狸犬','Gator', NULL),
	(56,128,'2023-04-22 21:44:38',2,9,'MEDIUM','柯基','Beckham', NULL),
	(57,26,'2023-04-24 05:43:56',2,9,'BIG','沙皮犬','白雪', NULL),
	(58,26,'2023-04-24 05:51:36',2,12,'SMALL','臘腸犬','QQ', NULL),
	(59,26,'2023-04-24 05:58:12',1,9,'MEDIUM','柴犬','Dodge', NULL),
	(60,26,'2023-04-24 06:05:01',2,12,'MEDIUM','柯基','Fisher', NULL),
	(61,40,'2023-05-02 12:57:48',1,2,'MINI','博美犬','Baylor', NULL),
	(62,56,'2023-05-02 21:17:34',2,14,'SMALL','雪納瑞','Dolce', NULL),
	(63,45,'2023-05-03 23:09:03',2,15,'MEDIUM','柯基','Conan', NULL),
	(64,2,'2023-05-09 16:53:06',1,7,'MINI','吉娃娃','Selena', NULL),
	(65,2,'2023-05-09 16:58:51',2,9,'MEDIUM','柴犬','Corduroy', NULL),
	(66,2,'2023-05-09 17:06:36',1,15,'BIG','黃金獵犬','MOMO', NULL),
	(67,2,'2023-05-09 17:12:11',2,3,'SMALL','狐狸犬','樂樂', NULL),
	(68,113,'2023-05-19 07:59:49',1,5,'MEDIUM','米克斯','拿鐵', NULL),
	(69,63,'2023-05-20 16:56:22',1,3,'MEDIUM','米克斯','Pip', NULL),
	(70,63,'2023-05-20 17:00:50',1,4,'MEDIUM','柯基','Lil Bit', NULL),
	(71,82,'2023-05-27 18:28:16',1,4,'MEDIUM','柴犬','土豆', NULL),
	(72,39,'2023-06-01 02:40:01',2,4,'BIG','哈士奇','奶油', NULL),
	(73,39,'2023-06-01 02:42:33',1,1,'BIG','黃金獵犬','Bogie', NULL),
	(74,39,'2023-06-01 02:48:10',2,3,'MEDIUM','米克斯','阿福', NULL),
	(75,52,'2023-06-05 22:57:04',2,3,'MINI','約克夏','Lil Bit', NULL),
	(76,52,'2023-06-05 23:00:43',1,9,'SMALL','狐狸犬','布丁', NULL),
	(77,52,'2023-06-05 23:08:37',1,15,'MINI','約克夏','Maxi', NULL),
	(78,52,'2023-06-05 23:16:17',2,13,'BIG','黃金獵犬','River', NULL),
	(79,32,'2023-06-08 02:53:02',1,14,'MEDIUM','柴犬','Effie', NULL),
	(80,51,'2023-06-10 09:25:33',2,3,'MINI','約克夏','Lucifer', NULL),
	(81,34,'2023-06-15 03:23:52',1,8,'SMALL','雪納瑞','Maude', NULL),
	(82,34,'2023-06-15 03:27:20',2,3,'MINI','吉娃娃','Beatrix', NULL),
	(83,34,'2023-06-15 03:31:55',2,15,'MINI','馬爾濟斯','Maude', NULL),
	(84,107,'2023-06-15 20:29:16',1,15,'SMALL','西施犬','River', NULL),
	(85,107,'2023-06-15 20:35:45',2,3,'MEDIUM','柴犬','Kai', NULL),
	(86,107,'2023-06-15 20:43:33',2,2,'MEDIUM','柯基','芝麻', NULL),
	(87,107,'2023-06-15 20:50:05',1,15,'MEDIUM','米克斯','妹妹', NULL),
	(88,5,'2023-06-24 02:51:21',2,1,'MEDIUM','柴犬','豆豆', NULL),
	(89,5,'2023-06-24 02:58:52',1,8,'MINI','博美犬','男爵', NULL),
	(90,145,'2023-06-25 03:20:29',2,7,'MEDIUM','柯基','Brynn', NULL),
	(91,145,'2023-06-25 03:24:02',1,14,'MEDIUM','柴犬','男爵', NULL),
	(92,129,'2023-06-28 12:09:24',1,6,'MINI','馬爾濟斯','Beckham', NULL),
	(93,129,'2023-06-28 12:16:50',1,1,'BIG','哈士奇','Bogie', NULL),
	(94,129,'2023-06-28 12:23:16',1,6,'SMALL','雪納瑞','Beatrix', NULL),
	(95,71,'2023-07-01 04:05:42',2,11,'MEDIUM','柴犬','柴柴', NULL),
	(96,71,'2023-07-01 04:14:28',1,10,'BIG','拉不拉多','Kiva', NULL),
	(97,69,'2023-07-05 02:07:30',1,6,'BIG','哈士奇','嘟嘟', NULL),
	(98,69,'2023-07-05 02:10:21',2,13,'MEDIUM','柴犬','Marnie', NULL),
	(99,69,'2023-07-05 02:13:46',2,5,'BIG','黃金獵犬','Nutmeg', NULL),
	(100,69,'2023-07-05 02:20:34',1,11,'MEDIUM','柴犬','豆豆', NULL),
	(101,61,'2023-07-06 06:32:09',2,9,'BIG','哈士奇','布丁', NULL),
	(102,164,'2023-07-08 09:16:30',1,13,'BIG','拉不拉多','NONO', NULL),
	(103,72,'2023-07-22 05:56:24',2,8,'MEDIUM','柴犬','MOMO', NULL),
	(104,123,'2023-07-25 03:50:16',1,10,'BIG','拉不拉多','白雪', NULL),
	(105,123,'2023-07-25 03:57:46',2,6,'BIG','大丹犬','橘子', NULL),
	(106,123,'2023-07-25 04:04:23',1,3,'SMALL','雪納瑞','Lucifer', NULL),
	(107,123,'2023-07-25 04:12:13',2,13,'MEDIUM','米克斯','Hondo', NULL),
	(108,158,'2023-07-25 13:37:30',1,4,'BIG','大丹犬','男爵', NULL),
	(109,158,'2023-07-25 13:42:21',2,5,'MEDIUM','米克斯','弟弟', NULL),
	(110,104,'2023-07-25 13:52:24',2,13,'SMALL','臘腸犬','胖胖', NULL),
	(111,104,'2023-07-25 13:59:56',1,14,'MEDIUM','柴犬','麵包', NULL),
	(112,173,'2023-07-26 01:38:49',2,12,'MEDIUM','柴犬','Story', NULL),
	(113,29,'2023-07-26 10:37:49',1,7,'MEDIUM','米克斯','Lil Bit', NULL),
	(114,29,'2023-07-26 10:41:23',1,10,'MINI','約克夏','天天', NULL),
	(115,29,'2023-07-26 10:48:01',2,14,'MEDIUM','柯基','多多', NULL),
	(116,29,'2023-07-26 10:50:34',2,2,'MEDIUM','柴犬','Kiva', NULL),
	(117,36,'2023-07-27 17:24:15',2,5,'BIG','拉不拉多','Fisher', NULL),
	(118,103,'2023-07-30 09:17:53',1,4,'MINI','馬爾濟斯','Kiki', NULL),
	(119,116,'2023-08-03 17:21:24',1,2,'SMALL','貴賓犬','Kiki', NULL),
	(120,161,'2023-08-05 21:29:38',1,14,'BIG','哈士奇','豆豆', NULL),
	(121,161,'2023-08-05 21:33:29',2,14,'SMALL','西施犬','Evee', NULL),
	(122,130,'2023-08-06 13:40:08',2,5,'MINI','博美犬','弟弟', NULL),
	(123,127,'2023-08-08 12:35:27',2,1,'BIG','黃金獵犬','Kai', NULL),
	(124,136,'2023-08-10 11:31:06',2,2,'MEDIUM','柯基','Tuck', NULL),
	(125,136,'2023-08-10 11:38:43',2,4,'BIG','拉不拉多','Zephyr', NULL),
	(126,136,'2023-08-10 11:47:15',1,8,'MEDIUM','柴犬','Cricket', NULL),
	(127,136,'2023-08-10 11:56:50',2,11,'MEDIUM','柴犬','拿鐵', NULL),
	(128,127,'2023-08-14 21:55:35',1,5,'MEDIUM','米克斯','Canyon', NULL),
	(129,146,'2023-08-19 07:49:08',1,3,'BIG','黃金獵犬','Moose', NULL),
	(130,17,'2023-08-24 14:41:47',2,11,'BIG','哈士奇','球球', NULL),
	(131,17,'2023-08-24 14:48:29',2,3,'MEDIUM','米克斯','球球', NULL),
	(132,167,'2023-08-28 16:59:58',2,2,'SMALL','臘腸犬','Cricket', NULL),
	(133,167,'2023-08-28 17:02:26',2,6,'MEDIUM','米克斯','Auto', NULL),
	(134,84,'2023-08-29 00:42:18',2,4,'SMALL','西施犬','Maxi', NULL),
	(135,130,'2023-09-03 06:20:51',2,8,'SMALL','臘腸犬','Evee', NULL),
	(136,155,'2023-09-08 23:01:34',1,1,'BIG','哈士奇','黑輪', NULL),
	(137,111,'2023-09-10 20:04:51',1,9,'MEDIUM','柯基','Argo', NULL),
	(138,84,'2023-09-12 02:58:43',1,11,'MEDIUM','柴犬','Hondo', NULL),
	(139,163,'2023-09-15 09:28:45',1,10,'MEDIUM','柴犬','球球', NULL),
	(140,163,'2023-09-15 09:35:39',2,5,'SMALL','雪納瑞','哈利', NULL),
	(141,30,'2023-09-21 10:49:25',2,6,'BIG','杜賓犬','男爵', NULL),
	(142,30,'2023-09-21 10:52:03',2,11,'SMALL','狐狸犬','白雪', NULL),
	(143,30,'2023-09-21 10:54:43',2,8,'BIG','哈士奇','June Bug', NULL),
	(144,18,'2023-09-23 01:23:29',2,2,'BIG','黃金獵犬','妹妹', NULL),
	(145,57,'2023-09-24 23:18:50',2,1,'MINI','吉娃娃','Sweet Pea', NULL),
	(146,57,'2023-09-24 23:27:31',2,15,'BIG','黃金獵犬','Palmer', NULL),
	(147,186,'2023-09-25 14:42:23',1,9,'SMALL','雪納瑞','Memphis', NULL),
	(148,190,'2023-09-27 02:43:35',2,12,'SMALL','比熊犬','Tugboat', NULL),
	(149,54,'2023-09-27 11:20:49',2,7,'MEDIUM','柴犬','Marnie', NULL),
	(150,85,'2023-09-27 12:20:26',1,6,'BIG','黃金獵犬','Dennis', NULL),
	(151,66,'2023-09-27 13:56:30',2,13,'SMALL','雪納瑞','Auto', NULL),
	(152,153,'2023-09-29 17:23:44',2,3,'MEDIUM','柴犬','Ruckus', NULL),
	(153,153,'2023-09-29 17:30:15',1,13,'BIG','黃金獵犬','高貴', NULL),
	(154,153,'2023-09-29 17:40:00',1,6,'MEDIUM','柴犬','Dolce', NULL),
	(155,195,'2023-10-04 17:57:59',2,2,'MINI','馬爾濟斯','Tequila', NULL),
	(156,195,'2023-10-04 18:06:28',2,11,'MINI','約克夏','老大', NULL),
	(157,77,'2023-10-07 09:13:43',2,15,'BIG','拉不拉多','Argo', NULL),
	(158,77,'2023-10-07 09:22:32',1,9,'BIG','黃金獵犬','可樂', NULL),
	(159,77,'2023-10-07 09:28:05',2,15,'BIG','黃金獵犬','帥氣 ', NULL),
	(160,13,'2023-10-10 07:02:29',2,11,'MEDIUM','柴犬','男爵', NULL),
	(161,190,'2023-10-10 13:13:09',2,2,'MINI','馬爾濟斯','Lightning', NULL),
	(162,135,'2023-10-16 09:31:45',2,14,'MEDIUM','柴犬','Dennis', NULL),
	(163,135,'2023-10-16 09:39:31',2,13,'MINI','博美犬','布丁', NULL),
	(164,135,'2023-10-16 09:48:16',1,7,'MEDIUM','柯基','Lil Bit', NULL),
	(165,127,'2023-10-19 19:25:36',2,6,'MEDIUM','米克斯','Wizard', NULL),
	(166,73,'2023-10-25 03:58:41',2,13,'BIG','黃金獵犬','Knight', NULL),
	(167,138,'2023-10-27 23:39:14',2,2,'SMALL','貴賓犬','可樂', NULL),
	(168,150,'2023-10-30 09:47:48',1,1,'MEDIUM','柴犬','土豆', NULL),
	(169,151,'2023-11-01 06:38:55',2,8,'BIG','拉不拉多','樂樂', NULL),
	(170,187,'2023-11-02 00:37:36',1,11,'MINI','約克夏','Canyon', NULL),
	(171,139,'2023-11-03 08:40:22',1,13,'MEDIUM','柴犬','芝麻', NULL),
	(172,139,'2023-11-03 08:49:55',1,4,'MINI','馬爾濟斯','Kenobi', NULL),
	(173,140,'2023-11-04 01:19:32',1,1,'MINI','博美犬','多多', NULL),
	(174,140,'2023-11-04 01:27:13',1,10,'SMALL','西施犬','NONO', NULL),
	(175,140,'2023-11-04 01:35:04',2,10,'MEDIUM','米克斯','Waffle', NULL),
	(176,140,'2023-11-04 01:38:42',1,8,'SMALL','臘腸犬','Lily', NULL),
	(177,132,'2023-11-04 06:51:02',2,8,'MINI','吉娃娃','弟弟', NULL),
	(178,132,'2023-11-04 06:59:41',2,13,'MEDIUM','米克斯','Kenobi', NULL),
	(179,3,'2023-11-04 11:20:29',1,3,'BIG','哈士奇','MOMO', NULL),
	(180,121,'2023-11-08 11:07:01',2,14,'MEDIUM','柯基','麻糬', NULL),
	(181,183,'2023-11-13 16:33:58',1,13,'BIG','沙皮犬','Marnie', NULL),
	(182,183,'2023-11-13 16:38:47',1,6,'MINI','博美犬','Kiki', NULL),
	(183,183,'2023-11-13 16:45:16',2,3,'MINI','約克夏','咖逼', NULL),
	(184,166,'2023-11-16 14:49:58',1,5,'SMALL','法國鬥牛犬','Gator', NULL),
	(185,58,'2023-11-19 13:30:43',1,4,'BIG','黃金獵犬','Marnie', NULL),
	(186,3,'2023-11-28 09:47:35',2,4,'MEDIUM','柴犬','Vixen', NULL),
	(187,169,'2023-11-29 07:32:00',2,14,'BIG','拉不拉多','Tuck', NULL),
	(188,169,'2023-11-29 07:40:42',1,2,'MINI','吉娃娃','Simba', NULL),
	(189,206,'2023-12-04 14:27:50',2,3,'MINI','馬爾濟斯','老闆', NULL),
	(190,23,'2023-12-06 11:49:32',2,15,'SMALL','貴賓犬','Nylah', NULL),
	(191,177,'2023-12-09 16:34:57',2,15,'MINI','馬爾濟斯','Brynn', NULL),
	(192,181,'2023-12-09 23:06:47',2,3,'MEDIUM','柴犬','橘子', NULL),
	(193,181,'2023-12-09 23:12:30',2,9,'SMALL','臘腸犬','Tahoe', NULL),
	(194,181,'2023-12-09 23:22:09',1,7,'MEDIUM','柴犬','Dennis', NULL),
	(195,15,'2023-12-16 04:18:39',2,12,'BIG','杜賓犬','雪碧', NULL),
	(196,80,'2023-12-16 12:23:04',2,10,'MEDIUM','柴犬','Tug', NULL),
	(197,216,'2023-12-20 00:09:32',2,15,'BIG','拉不拉多','甜不辣', NULL),
	(198,216,'2023-12-20 00:17:12',2,14,'MEDIUM','柯基','帥氣 ', NULL),
	(199,91,'2023-12-26 06:05:01',2,4,'MEDIUM','米克斯','Tugboat', NULL),
	(200,91,'2023-12-26 06:07:34',2,4,'SMALL','西施犬','Corduroy', NULL),
	(201,204,'2023-12-26 07:21:49',1,12,'BIG','黃金獵犬','Toaster', NULL),
	(202,204,'2023-12-26 07:27:33',1,12,'SMALL','雪納瑞','小小', NULL),
	(203,204,'2023-12-26 07:31:27',2,1,'BIG','拉不拉多','Nylah', NULL),
	(204,204,'2023-12-26 07:41:05',2,7,'MEDIUM','米克斯','Canyon', NULL),
	(205,100,'2023-12-31 14:27:40',2,3,'MEDIUM','米克斯','Story', NULL),
	(206,133,'2024-01-02 00:19:55',2,14,'MEDIUM','柯基','Ruckus', NULL),
	(207,133,'2024-01-02 00:22:46',2,15,'MEDIUM','米克斯','樂樂', NULL),
	(208,196,'2024-01-02 00:59:48',1,14,'SMALL','西高地白梗','雪糕', NULL),
	(209,196,'2024-01-02 01:04:42',1,3,'MEDIUM','柯基','麻糬', NULL),
	(210,196,'2024-01-02 01:10:27',1,1,'MEDIUM','柯基','經理', NULL),
	(211,196,'2024-01-02 01:19:52',2,8,'MEDIUM','柴犬','Nessie', NULL),
	(212,175,'2024-01-02 03:47:12',1,15,'MINI','吉娃娃','多多', NULL),
	(213,175,'2024-01-02 03:50:38',1,3,'MEDIUM','柯基','Baylor', NULL),
	(214,175,'2024-01-02 03:58:09',1,8,'MEDIUM','柴犬','Beatrix', NULL),
	(215,90,'2024-01-02 22:31:03',2,2,'MEDIUM','柯基','總監', NULL),
	(216,90,'2024-01-02 22:38:36',2,5,'MINI','約克夏','小小', NULL),
	(217,148,'2024-01-07 16:37:44',2,15,'MEDIUM','柯基','糖糖', NULL),
	(218,148,'2024-01-07 16:47:34',2,4,'SMALL','臘腸犬','雪糕', NULL),
	(219,148,'2024-01-07 16:56:05',1,4,'MINI','博美犬','課長', NULL),
	(220,115,'2024-01-08 16:05:38',1,7,'SMALL','臘腸犬','Tequila', NULL),
	(221,197,'2024-01-10 04:03:51',1,7,'MEDIUM','米克斯','Knight', NULL),
	(222,197,'2024-01-10 04:10:32',1,1,'MINI','約克夏','雪糕', NULL),
	(223,197,'2024-01-10 04:16:10',1,3,'BIG','哈士奇','雪碧', NULL),
	(224,137,'2024-01-10 11:11:40',1,9,'SMALL','巴哥犬','Kiva', NULL),
	(225,137,'2024-01-10 11:16:09',1,13,'MINI','約克夏','樂樂', NULL),
	(226,92,'2024-01-16 03:25:00',1,9,'MEDIUM','柯基','元寶', NULL),
	(227,55,'2024-01-21 13:33:29',2,8,'MINI','吉娃娃','黑輪', NULL),
	(228,55,'2024-01-21 13:40:03',1,14,'MEDIUM','柯基','Story', NULL),
	(229,55,'2024-01-21 13:42:37',2,7,'BIG','哈士奇','Kiva', NULL),
	(230,130,'2024-01-24 17:00:38',1,12,'MEDIUM','柴犬','蠟筆', NULL),
	(231,176,'2024-01-28 14:55:36',1,5,'MINI','馬爾濟斯','Chomper', NULL),
	(232,176,'2024-01-28 15:01:13',2,2,'MEDIUM','柴犬','麻糬', NULL),
	(233,118,'2024-01-29 20:13:00',2,9,'BIG','哈士奇','Selena', NULL),
	(234,89,'2024-02-03 13:37:51',2,11,'MINI','博美犬','CoCo', NULL),
	(235,89,'2024-02-03 13:46:34',2,11,'MINI','吉娃娃','芝麻', NULL),
	(236,89,'2024-02-03 13:54:06',1,5,'MEDIUM','柯基','麻糬', NULL),
	(237,83,'2024-02-04 02:22:15',2,12,'SMALL','臘腸犬','Valentine', NULL),
	(238,70,'2024-02-04 20:36:07',2,6,'MINI','約克夏','男爵', NULL),
	(239,70,'2024-02-04 20:41:36',2,6,'MINI','馬爾濟斯','Kiki', NULL),
	(240,70,'2024-02-04 20:46:30',2,7,'SMALL','臘腸犬','帥氣 ', NULL),
	(241,159,'2024-02-07 06:31:53',2,14,'MINI','博美犬','弟弟', NULL),
	(242,159,'2024-02-07 06:39:30',2,13,'SMALL','西施犬','弟弟', NULL),
	(243,159,'2024-02-07 06:42:07',2,8,'MEDIUM','柯基','Story', NULL),
	(244,159,'2024-02-07 06:51:39',1,5,'MEDIUM','柯基','Canyon', NULL),
	(245,207,'2024-02-07 06:54:10',1,11,'BIG','黃金獵犬','經理', NULL),
	(246,152,'2024-02-12 09:34:00',2,5,'MINI','博美犬','Gator', NULL),
	(247,174,'2024-02-12 12:40:40',2,10,'MINI','博美犬','課長', NULL),
	(248,174,'2024-02-12 12:49:17',2,6,'MINI','約克夏','Brynn', NULL),
	(249,41,'2024-02-12 19:21:29',1,14,'SMALL','臘腸犬','白雪', NULL),
	(250,41,'2024-02-12 19:27:06',1,4,'MINI','馬爾濟斯','Marnie', NULL);
INSERT INTO `dogs` VALUES (251,21,'2024-02-13 06:20:23',2,10,'BIG','哈士奇','Canyon', NULL),
	(252,21,'2024-02-13 06:28:03',2,6,'MEDIUM','米克斯','Scotch', NULL),
	(253,230,'2024-02-18 09:52:41',2,8,'MEDIUM','柴犬','Simba', NULL),
	(254,230,'2024-02-18 10:00:11',2,9,'BIG','黃金獵犬','MOMO', NULL),
	(255,230,'2024-02-18 10:02:57',1,9,'MINI','約克夏','布丁', NULL),
	(256,230,'2024-02-18 10:08:37',1,14,'MINI','約克夏','Corduroy', NULL),
	(257,210,'2024-02-18 10:09:16',1,2,'MINI','約克夏','樂樂', NULL),
	(258,143,'2024-02-19 18:07:40',2,3,'BIG','拉不拉多','Stash', NULL),
	(259,143,'2024-02-19 18:17:26',2,4,'MINI','吉娃娃','Chomper', NULL),
	(260,205,'2024-02-22 21:23:26',2,7,'BIG','拉不拉多','天天', NULL),
	(261,205,'2024-02-22 21:29:20',1,5,'MINI','吉娃娃','咖逼', NULL),
	(262,180,'2024-02-24 18:57:54',2,5,'BIG','哈士奇','天天', NULL),
	(263,180,'2024-02-24 19:05:39',2,10,'SMALL','貴賓犬','招財', NULL),
	(264,102,'2024-02-26 07:53:24',1,1,'BIG','哈士奇','天使', NULL),
	(265,81,'2024-02-27 05:09:24',2,6,'MEDIUM','柴犬','NANA', NULL),
	(266,31,'2024-02-27 20:00:02',2,8,'BIG','哈士奇','男爵', NULL),
	(267,31,'2024-02-27 20:02:41',2,7,'BIG','哈士奇','Waffle', NULL),
	(268,225,'2024-03-02 17:30:55',1,1,'BIG','哈士奇','Dodge', NULL),
	(269,231,'2024-03-02 20:34:29',2,3,'MINI','吉娃娃','Effie', NULL),
	(270,248,'2024-03-03 15:58:38',1,1,'MINI','馬爾濟斯','胖胖', NULL),
	(271,237,'2024-03-09 04:16:58',1,12,'MEDIUM','米克斯','雪碧', NULL),
	(272,239,'2024-03-11 07:24:44',2,2,'BIG','哈士奇','QQ', NULL),
	(273,239,'2024-03-11 07:29:23',2,5,'SMALL','雪納瑞','招財', NULL),
	(274,239,'2024-03-11 07:32:49',1,6,'MEDIUM','米克斯','小斯', NULL),
	(275,221,'2024-03-16 12:17:54',1,9,'MINI','約克夏','雪碧', NULL),
	(276,114,'2024-03-16 19:40:25',1,5,'SMALL','西施犬','Brynn', NULL),
	(277,222,'2024-03-18 21:34:16',2,13,'MINI','馬爾濟斯','Camila', NULL),
	(278,198,'2024-03-25 12:01:40',2,9,'BIG','哈士奇','Kiki', NULL),
	(279,198,'2024-03-25 12:04:06',1,3,'BIG','拉不拉多','麻糬', NULL),
	(280,235,'2024-03-26 15:56:31',2,4,'SMALL','法國鬥牛犬','牛奶', NULL),
	(281,235,'2024-03-26 16:00:24',1,14,'SMALL','雪納瑞','Bertha ', NULL),
	(282,235,'2024-03-26 16:05:03',1,4,'BIG','杜賓犬','Pip', NULL),
	(283,235,'2024-03-26 16:10:40',1,12,'MEDIUM','柯基','Beckham', NULL),
	(284,171,'2024-03-27 04:59:37',1,14,'MEDIUM','柴犬','Valentine', NULL),
	(285,171,'2024-03-27 05:02:22',1,2,'MEDIUM','柯基','樂樂', NULL),
	(286,171,'2024-03-27 05:07:07',2,10,'MEDIUM','米克斯','MOMO', NULL),
	(287,171,'2024-03-27 05:16:01',2,3,'MEDIUM','柯基','Moose', NULL),
	(288,70,'2024-03-28 02:39:52',2,11,'MINI','吉娃娃','咖逼', NULL),
	(289,94,'2024-03-28 17:02:02',2,8,'SMALL','臘腸犬','妮妮', NULL),
	(290,178,'2024-03-29 21:52:01',1,4,'SMALL','西施犬','NANA', NULL),
	(291,178,'2024-03-29 22:00:49',1,7,'MEDIUM','柯基','豆豆', NULL),
	(292,228,'2024-04-02 02:41:26',1,7,'MEDIUM','米克斯','Nimbus', NULL),
	(293,228,'2024-04-02 02:49:54',2,9,'MEDIUM','柯基','雪糕', NULL),
	(294,59,'2024-04-03 11:32:26',2,5,'BIG','大丹犬','Dolce', NULL),
	(295,59,'2024-04-03 11:42:20',2,14,'MINI','約克夏','拿鐵', NULL),
	(296,134,'2024-04-04 13:09:01',1,12,'BIG','拉不拉多','元寶', NULL),
	(297,134,'2024-04-04 13:12:32',1,2,'MEDIUM','米克斯','Tug', NULL),
	(298,134,'2024-04-04 13:20:18',2,12,'MINI','博美犬','胖胖', NULL),
	(299,261,'2024-04-07 14:15:54',2,3,'MEDIUM','柯基','男爵', NULL),
	(300,62,'2024-04-07 18:28:42',2,10,'MEDIUM','米克斯','Lil Bit', NULL),
	(301,77,'2024-04-08 02:14:25',2,8,'SMALL','雪納瑞','Patience', NULL),
	(302,193,'2024-04-11 07:06:01',1,2,'MEDIUM','米克斯','帥氣 ', NULL),
	(303,193,'2024-04-11 07:14:32',2,1,'SMALL','狐狸犬','男爵', NULL),
	(304,193,'2024-04-11 07:17:13',1,15,'MEDIUM','柴犬','招財', NULL),
	(305,203,'2024-04-16 00:02:58',2,6,'MEDIUM','柯基','奶茶', NULL),
	(306,189,'2024-04-16 10:03:44',2,1,'MEDIUM','柯基','Snoopy', NULL),
	(307,191,'2024-04-18 10:22:05',2,7,'MINI','約克夏','Beatrix', NULL),
	(308,87,'2024-04-18 13:39:28',2,4,'MEDIUM','柯基','樂樂', NULL),
	(309,175,'2024-04-20 12:19:41',1,6,'MEDIUM','柴犬','雪碧', NULL),
	(310,74,'2024-04-22 23:55:41',1,9,'MEDIUM','柴犬','糖糖', NULL),
	(311,74,'2024-04-23 00:02:08',1,8,'MINI','馬爾濟斯','Zephyr', NULL),
	(312,252,'2024-04-23 02:52:04',2,15,'MEDIUM','柴犬','Patience', NULL),
	(313,184,'2024-04-24 09:10:05',1,3,'MEDIUM','柯基','Dennis', NULL),
	(314,184,'2024-04-24 09:13:45',2,5,'SMALL','西施犬','Story', NULL),
	(315,241,'2024-04-25 01:13:23',1,10,'MEDIUM','柯基','Tug', NULL),
	(316,241,'2024-04-25 01:20:56',1,6,'MEDIUM','柴犬','Snoopy', NULL),
	(317,241,'2024-04-25 01:30:39',2,12,'SMALL','臘腸犬','巧克力', NULL),
	(318,199,'2024-04-25 16:30:35',1,6,'MEDIUM','米克斯','Brother', NULL),
	(319,4,'2024-04-26 08:41:47',1,11,'BIG','拉不拉多','NANA', NULL),
	(320,240,'2024-04-27 19:47:34',1,14,'MEDIUM','柯基','奶油', NULL),
	(321,194,'2024-04-28 03:06:53',2,14,'MEDIUM','米克斯','Moose', NULL),
	(322,194,'2024-04-28 03:09:20',2,11,'SMALL','西高地白梗','芝麻', NULL),
	(323,243,'2024-04-29 22:37:59',1,5,'MINI','馬爾濟斯','奶油', NULL),
	(324,243,'2024-04-29 22:46:30',1,12,'BIG','黃金獵犬','多多', NULL),
	(325,243,'2024-04-29 22:52:17',2,12,'BIG','杜賓犬','Patience', NULL),
	(326,141,'2024-04-30 00:58:38',1,6,'SMALL','雪納瑞','糖糖', NULL),
	(327,256,'2024-04-30 05:25:05',1,9,'SMALL','雪納瑞','Ruckus', NULL),
	(328,256,'2024-04-30 05:34:35',2,2,'MEDIUM','柴犬','Corduroy', NULL),
	(329,251,'2024-05-01 12:42:24',2,1,'MEDIUM','柴犬','Effie', NULL),
	(330,251,'2024-05-01 12:48:00',2,11,'BIG','拉不拉多','Maude', NULL),
	(331,168,'2024-05-01 20:48:44',2,7,'MEDIUM','米克斯','Pip', NULL),
	(332,259,'2024-05-03 04:51:53',1,7,'MEDIUM','柯基','CoCo', NULL),
	(333,259,'2024-05-03 04:59:46',1,8,'MEDIUM','柯基','Beatrix', NULL),
	(334,259,'2024-05-03 05:08:31',2,9,'SMALL','狐狸犬','總監', NULL),
	(335,202,'2024-05-03 19:44:28',1,4,'BIG','黃金獵犬','Gator', NULL),
	(336,149,'2024-05-07 13:01:35',2,7,'MINI','吉娃娃','甜不辣', NULL),
	(337,156,'2024-05-09 02:17:16',2,5,'MINI','馬爾濟斯','拿鐵', NULL),
	(338,170,'2024-05-10 11:33:49',1,9,'MEDIUM','柴犬','可樂', NULL),
	(339,193,'2024-05-10 15:51:07',1,3,'MINI','吉娃娃','Jeff', NULL),
	(340,203,'2024-05-11 08:14:07',1,15,'MINI','博美犬','Lulu', NULL),
	(341,119,'2024-05-12 19:52:57',1,13,'MEDIUM','柴犬','雪碧', NULL),
	(342,220,'2024-05-13 06:21:11',1,9,'MEDIUM','柴犬','QQ', NULL),
	(343,109,'2024-05-15 18:38:21',2,5,'MEDIUM','柯基','小基', NULL),
	(344,109,'2024-05-15 18:41:08',1,8,'MEDIUM','柴犬','Amaya', NULL),
	(345,179,'2024-05-19 15:25:01',2,8,'MINI','約克夏','Fabio', NULL),
	(346,211,'2024-05-19 23:53:50',1,13,'MINI','吉娃娃','Jeff', NULL),
	(347,255,'2024-05-20 09:40:00',1,6,'SMALL','雪納瑞','QQ', NULL),
	(348,96,'2024-05-20 18:33:03',1,9,'MEDIUM','米克斯','高貴', NULL),
	(349,152,'2024-05-23 01:29:22',1,1,'MEDIUM','米克斯','小米', NULL),
	(350,152,'2024-05-23 01:31:55',2,9,'MEDIUM','米克斯','Bentley ', NULL),
	(351,253,'2024-05-26 06:09:17',1,3,'MEDIUM','柯基','Scotch', NULL),
	(352,188,'2024-05-28 02:20:58',2,15,'BIG','哈士奇','黑輪', NULL),
	(353,262,'2024-06-01 16:56:02',1,11,'MEDIUM','米克斯','魚魚', NULL),
	(354,262,'2024-06-01 16:58:30',1,8,'MEDIUM','柴犬','麻糬', NULL),
	(355,262,'2024-06-01 17:03:06',2,13,'SMALL','狐狸犬','Stash', NULL),
	(356,165,'2024-06-02 14:25:49',2,4,'MINI','博美犬','博士', NULL),
	(357,165,'2024-06-02 14:30:32',2,15,'BIG','哈士奇','二哈', NULL),
	(358,226,'2024-06-05 08:46:27',2,5,'MINI','吉娃娃','公爵', NULL),
	(359,218,'2024-06-06 13:07:50',2,4,'MINI','約克夏','巧克力', NULL),
	(360,218,'2024-06-06 13:10:34',1,4,'MEDIUM','米克斯','Nutmeg', NULL),
	(361,258,'2024-06-07 14:12:39',1,2,'BIG','拉不拉多','麻糬', NULL),
	(362,229,'2024-06-07 14:37:06',2,9,'MEDIUM','柴犬','蟹蟹', NULL),
	(363,229,'2024-06-07 14:44:45',1,15,'MEDIUM','柯基','Cricket', NULL),
	(364,246,'2024-06-09 02:10:11',2,4,'MEDIUM','柯基','Argo', NULL),
	(365,72,'2024-06-14 18:06:49',2,6,'BIG','哈士奇','帥氣 ', NULL),
	(366,72,'2024-06-14 18:14:24',1,3,'MEDIUM','柯基','Beckham', NULL),
	(367,247,'2024-06-15 06:41:54',1,7,'MINI','博美犬','美美', NULL),
	(368,250,'2024-06-15 15:54:47',2,1,'MINI','馬爾濟斯','白雪', NULL),
	(369,250,'2024-06-15 15:58:21',1,12,'MEDIUM','米克斯','拿鐵', NULL),
	(370,250,'2024-06-15 16:08:01',2,14,'BIG','拉不拉多','吉利', NULL),
	(371,250,'2024-06-15 16:13:39',2,14,'BIG','拉不拉多','Maxie', NULL),
	(372,11,'2024-06-17 09:50:33',2,4,'SMALL','雪納瑞','Rollo', NULL),
	(373,108,'2024-06-19 21:06:51',2,15,'SMALL','貴賓犬','Story', NULL),
	(374,108,'2024-06-19 21:12:34',2,5,'BIG','大丹犬','Evee', NULL),
	(375,5,'2024-06-19 22:38:40',1,14,'BIG','哈士奇','Wizard', NULL),
	(376,271,'2024-06-20 07:42:55',2,1,'MEDIUM','柯基','Tugboat', NULL),
	(377,271,'2024-06-20 07:51:47',2,10,'MINI','馬爾濟斯','Camila', NULL),
	(378,271,'2024-06-20 07:59:40',1,10,'MEDIUM','柯基','吉利', NULL),
	(379,154,'2024-06-20 16:54:59',1,10,'MEDIUM','米克斯','芝麻', NULL),
	(380,154,'2024-06-20 17:03:43',1,2,'BIG','哈士奇','妞妞', NULL),
	(381,154,'2024-06-20 17:11:10',2,8,'BIG','黃金獵犬','糖糖', NULL),
	(382,154,'2024-06-20 17:20:57',1,6,'MINI','馬爾濟斯','妞妞', NULL),
	(383,182,'2024-06-22 00:46:16',1,12,'MINI','吉娃娃','Kiva', NULL),
	(384,182,'2024-06-22 00:52:52',1,11,'BIG','黃金獵犬','總監', NULL),
	(385,174,'2024-06-22 02:18:22',2,4,'SMALL','狐狸犬','Nessie', NULL),
	(386,108,'2024-06-23 01:10:22',1,9,'MEDIUM','米克斯','妮妮', NULL),
	(387,108,'2024-06-23 01:20:16',2,13,'BIG','黃金獵犬','橘子', NULL),
	(388,220,'2024-06-24 04:06:20',2,2,'MEDIUM','柯基','Tequila', NULL),
	(389,172,'2024-06-28 03:28:11',1,7,'MINI','吉娃娃','胖胖', NULL),
	(390,272,'2024-06-28 07:40:56',1,4,'MEDIUM','柯基','MOMO', NULL),
	(391,272,'2024-06-28 07:45:46',2,8,'MINI','馬爾濟斯','Rollo', NULL),
	(392,272,'2024-06-28 07:52:20',1,10,'BIG','哈士奇','Nimbus', NULL),
	(393,234,'2024-06-28 09:47:08',2,12,'MEDIUM','柴犬','Maxie', NULL),
	(394,242,'2024-07-01 02:00:49',2,7,'SMALL','狐狸犬','Corduroy', NULL),
	(395,242,'2024-07-01 02:07:22',2,7,'SMALL','貴賓犬','Evee', NULL),
	(396,273,'2024-07-01 02:31:21',2,5,'SMALL','貴賓犬','Waffle', NULL),
	(397,117,'2024-07-01 11:46:01',2,5,'MEDIUM','柴犬','騎士', NULL),
	(398,257,'2024-07-01 15:23:52',1,8,'SMALL','西施犬','Knight', NULL),
	(399,257,'2024-07-01 15:26:38',1,15,'MEDIUM','柯基','天天', NULL),
	(400,257,'2024-07-01 15:36:16',2,11,'MINI','約克夏','QQ', NULL),
	(401,110,'2024-07-03 10:26:33',1,12,'SMALL','雪納瑞','Wylie', NULL),
	(402,110,'2024-07-03 10:32:27',1,5,'BIG','哈士奇','可樂', NULL),
	(403,270,'2024-07-03 23:03:27',1,10,'SMALL','雪納瑞','妞妞', NULL),
	(404,263,'2024-07-04 00:09:43',2,1,'MEDIUM','柴犬','總柴', NULL),
	(405,244,'2024-07-04 23:41:10',1,12,'MEDIUM','柴犬','Nessie', NULL),
	(406,244,'2024-07-04 23:43:43',2,14,'MEDIUM','米克斯','男爵', NULL),
	(407,244,'2024-07-04 23:53:22',2,14,'MEDIUM','柴犬','麻糬', NULL),
	(408,274,'2024-07-06 17:06:21',1,4,'BIG','拉不拉多','招財', NULL),
	(409,142,'2024-07-08 19:11:15',1,14,'MEDIUM','柴犬','Maude', NULL),
	(410,142,'2024-07-08 19:14:01',1,12,'SMALL','狐狸犬','Selena', NULL),
	(411,142,'2024-07-08 19:23:50',2,9,'MEDIUM','柯基','Ruckus', NULL),
	(412,142,'2024-07-08 19:28:22',2,12,'SMALL','狐狸犬','Rockie', NULL),
	(413,115,'2024-07-10 04:35:34',2,4,'MINI','吉娃娃','樂樂', NULL),
	(414,119,'2024-07-11 17:23:31',2,2,'MEDIUM','柴犬','Moose', NULL),
	(415,227,'2024-07-12 02:17:53',2,10,'MEDIUM','柯基','Nylah', NULL),
	(416,67,'2024-07-15 15:54:05',2,15,'MEDIUM','米克斯','Memphis', NULL),
	(417,265,'2024-07-15 16:12:42',2,11,'SMALL','貴賓犬','Dodge', NULL),
	(418,265,'2024-07-15 16:17:30',1,8,'MEDIUM','柴犬','球球', NULL),
	(419,265,'2024-07-15 16:24:13',1,9,'SMALL','臘腸犬','Beatrix', NULL),
	(420,167,'2024-07-15 21:28:08',1,9,'MINI','吉娃娃','Conan', NULL),
	(421,167,'2024-07-15 21:33:37',1,3,'MINI','馬爾濟斯','多多', NULL),
	(422,208,'2024-07-15 23:05:01',2,14,'MEDIUM','米克斯','MOMO', NULL),
	(423,208,'2024-07-15 23:08:54',2,3,'MINI','吉娃娃','妹妹', NULL),
	(424,1,'2024-07-16 03:26:40',1,12,'MEDIUM','柴犬','蝦蝦', NULL),
	(425,251,'2024-07-17 23:12:22',1,8,'BIG','拉不拉多','Lightning', NULL),
	(426,251,'2024-07-17 23:19:02',1,5,'MEDIUM','柴犬','課長', NULL),
	(427,43,'2024-07-18 22:38:53',1,12,'MINI','吉娃娃','Rockie', NULL),
	(428,43,'2024-07-18 22:43:31',2,4,'MEDIUM','米克斯','Toaster', NULL),
	(429,147,'2024-07-20 10:30:37',2,6,'BIG','沙皮犬','白雪', NULL),
	(430,147,'2024-07-20 10:38:13',2,8,'MEDIUM','柴犬','Lil Bit', NULL),
	(431,117,'2024-07-21 11:08:45',2,10,'BIG','哈士奇','Toaster', NULL),
	(432,11,'2024-07-22 22:49:06',2,4,'BIG','杜賓犬','奶油', NULL),
	(433,264,'2024-07-24 05:34:44',2,2,'BIG','拉不拉多','Rockie', NULL),
	(434,264,'2024-07-24 05:41:09',2,11,'MINI','博美犬','Simba', NULL),
	(435,264,'2024-07-24 05:43:54',2,2,'SMALL','狐狸犬','Bjorn', NULL),
	(436,281,'2024-07-25 09:58:54',2,13,'MEDIUM','柯基','CoCo', NULL),
	(437,75,'2024-07-25 11:44:23',1,8,'SMALL','貴賓犬','Sweet Pea', NULL),
	(438,75,'2024-07-25 11:49:48',1,5,'BIG','拉不拉多','QQ', NULL),
	(439,160,'2024-07-25 16:52:10',2,3,'MINI','博美犬','MOMO', NULL),
	(440,242,'2024-07-27 22:17:48',2,3,'SMALL','雪納瑞','小白', NULL),
	(441,60,'2024-07-29 05:53:33',2,6,'MEDIUM','柯基','Chomper', NULL),
	(442,60,'2024-07-29 05:58:14',1,9,'SMALL','狐狸犬','Tuck', NULL),
	(443,280,'2024-07-29 19:29:08',1,9,'MINI','約克夏','Fisher', NULL),
	(444,280,'2024-07-29 19:38:46',2,15,'MEDIUM','柴犬','黑輪', NULL),
	(445,125,'2024-07-29 20:32:25',2,15,'MEDIUM','柴犬','奶茶', NULL),
	(446,125,'2024-07-29 20:40:14',2,3,'MINI','馬爾濟斯','NANA', NULL),
	(447,125,'2024-07-29 20:44:49',2,3,'SMALL','巴哥犬','帥氣 ', NULL),
	(448,223,'2024-07-30 14:31:32',2,2,'BIG','拉不拉多','Waffle', NULL),
	(449,223,'2024-07-30 14:34:24',1,7,'MEDIUM','柯基','Marnie', NULL),
	(450,31,'2024-07-31 00:05:20',1,10,'MEDIUM','柴犬','Tequila', NULL),
	(451,31,'2024-07-31 00:14:50',1,4,'SMALL','西施犬','Bullet', NULL),
	(452,19,'2024-07-31 01:29:01',2,4,'SMALL','西施犬','MOMO', NULL),
	(453,110,'2024-07-31 03:58:55',2,5,'MINI','約克夏','Marnie', NULL),
	(454,110,'2024-07-31 04:05:22',1,1,'MINI','吉娃娃','Maxi', NULL),
	(455,201,'2024-07-31 09:47:36',1,7,'MINI','吉娃娃','Stash', NULL),
	(456,201,'2024-07-31 09:56:17',2,5,'MEDIUM','米克斯','Tug', NULL),
	(457,201,'2024-07-31 09:58:50',1,5,'MEDIUM','柴犬','白雪', NULL),
	(458,75,'2024-07-31 17:13:13',1,7,'MINI','約克夏','Dodge', NULL),
	(459,75,'2024-07-31 17:17:44',1,10,'MINI','馬爾濟斯','Nimbus', NULL),
	(460,98,'2024-08-01 06:59:25',1,2,'SMALL','狐狸犬','Waffle', NULL),
	(461,98,'2024-08-01 07:09:09',2,5,'BIG','拉不拉多','Story', NULL),
	(462,286,'2024-08-01 19:57:22',2,13,'BIG','黃金獵犬','天天', NULL),
	(463,254,'2024-08-02 17:38:12',2,4,'MINI','吉娃娃','麻糬', NULL),
	(464,234,'2024-08-02 19:56:42',2,8,'BIG','大丹犬','帥氣 ', NULL),
	(465,236,'2024-08-02 21:13:11',2,12,'MEDIUM','柯基','麻糬', NULL),
	(466,236,'2024-08-02 21:21:03',2,1,'SMALL','西施犬','Dolce', NULL),
	(467,185,'2024-08-06 02:11:21',1,10,'BIG','黃金獵犬','布丁', NULL),
	(468,282,'2024-08-06 07:37:28',2,1,'MINI','馬爾濟斯','NANA', NULL),
	(469,282,'2024-08-06 07:46:18',1,6,'MEDIUM','米克斯','Stash', NULL),
	(470,277,'2024-08-06 11:36:10',1,3,'MEDIUM','柯基','哥哥', NULL),
	(471,111,'2024-08-06 18:55:00',2,11,'MINI','馬爾濟斯','Kiva', NULL),
	(472,111,'2024-08-06 18:58:49',1,11,'MEDIUM','米克斯','Sweet Pea', NULL),
	(473,111,'2024-08-06 19:01:19',1,7,'BIG','哈士奇','Gator', NULL),
	(474,179,'2024-08-07 07:20:54',1,4,'MEDIUM','柴犬','Tequila', NULL),
	(475,179,'2024-08-07 07:30:33',2,2,'MINI','馬爾濟斯','牛奶', NULL),
	(476,179,'2024-08-07 07:35:08',2,5,'SMALL','臘腸犬','Maxi', NULL),
	(477,269,'2024-08-07 16:12:20',2,5,'MEDIUM','柯基','Dodge', NULL),
	(478,269,'2024-08-07 16:17:55',1,10,'MEDIUM','米克斯','白雪', NULL),
	(479,275,'2024-08-09 01:49:38',1,15,'MINI','博美犬','小妞', NULL),
	(480,275,'2024-08-09 01:53:32',1,7,'MEDIUM','柯基','Memphis', NULL),
	(481,275,'2024-08-09 02:01:13',2,15,'SMALL','西施犬','巴仔', NULL),
	(482,95,'2024-08-11 07:11:56',1,1,'MEDIUM','柴犬','樂樂', NULL),
	(483,279,'2024-08-11 22:40:15',1,4,'BIG','哈士奇','Knight', NULL),
	(484,146,'2024-08-12 20:32:31',1,3,'BIG','黃金獵犬','Beatrix', NULL),
	(485,146,'2024-08-12 20:35:13',1,2,'BIG','拉不拉多','NANA', NULL),
	(486,146,'2024-08-12 20:40:48',1,8,'BIG','哈士奇','Tuck', NULL),
	(487,215,'2024-08-14 04:37:31',1,14,'BIG','黃金獵犬','Brother', NULL),
	(488,215,'2024-08-14 04:47:07',2,9,'BIG','拉不拉多','Brynn', NULL),
	(489,291,'2024-08-14 19:42:21',1,3,'SMALL','貴賓犬','Bentley ', NULL),
	(490,143,'2024-08-15 12:11:05',1,4,'MEDIUM','米克斯','Tugboat', NULL),
	(491,287,'2024-08-15 21:06:06',2,1,'BIG','拉不拉多','Tequila', NULL),
	(492,287,'2024-08-15 21:08:38',1,6,'MEDIUM','柴犬','Beatrix', NULL),
	(493,64,'2024-08-15 22:29:10',1,8,'BIG','拉不拉多','球球', NULL),
	(494,64,'2024-08-15 22:38:49',2,3,'MINI','約克夏','小克', NULL),
	(495,44,'2024-08-16 22:59:17',1,1,'SMALL','臘腸犬','Beckham', NULL),
	(496,44,'2024-08-16 23:06:55',1,14,'SMALL','貴賓犬','橘子', NULL),
	(497,44,'2024-08-16 23:11:25',2,12,'BIG','黃金獵犬','小小', NULL),
	(498,202,'2024-08-18 02:33:22',1,5,'BIG','哈士奇','弟弟', NULL),
	(499,202,'2024-08-18 09:20:47',1,12,'BIG','哈士奇','Hurricane', NULL),
	(500,202,'2024-08-18 09:28:15',1,15,'SMALL','狐狸犬','Dennis', NULL);
INSERT INTO `dogs` VALUES (501,284,'2024-08-18 20:50:20',1,6,'MEDIUM','柯基','奶油', NULL),
	(502,212,'2024-08-20 00:23:46',1,4,'MEDIUM','米克斯','Kiki', NULL),
	(503,214,'2024-08-20 12:37:01',2,2,'MEDIUM','米克斯','Aggie', NULL),
	(504,294,'2024-08-20 17:02:30',1,11,'SMALL','雪納瑞','Vixen', NULL),
	(505,294,'2024-08-20 17:07:06',2,13,'MEDIUM','柴犬','豆漿', NULL),
	(506,290,'2024-08-20 19:47:16',1,9,'MINI','約克夏','Lightning', NULL),
	(507,105,'2024-08-21 08:47:02',1,2,'MINI','馬爾濟斯','Hurricane', NULL),
	(508,238,'2024-08-22 03:50:22',2,13,'MINI','約克夏','經理', NULL),
	(509,38,'2024-08-22 13:11:21',1,14,'MEDIUM','米克斯','多多', NULL),
	(510,38,'2024-08-22 13:17:14',2,1,'SMALL','狐狸犬','Kiki', NULL),
	(511,38,'2024-08-22 13:21:55',2,5,'MINI','馬爾濟斯','黑輪', NULL),
	(512,209,'2024-08-23 14:48:02',1,5,'BIG','拉不拉多','天天', NULL),
	(513,285,'2024-08-24 05:49:21',1,14,'MINI','博美犬','發財', NULL),
	(514,285,'2024-08-24 05:56:51',2,3,'MEDIUM','柯基','多多', NULL),
	(515,285,'2024-08-24 05:59:25',2,3,'MINI','博美犬','總監', NULL),
	(516,168,'2024-08-24 15:43:45',1,13,'MEDIUM','柯基','Maxi', NULL),
	(517,192,'2024-08-24 18:43:34',1,11,'BIG','黃金獵犬','嘟嘟', NULL),
	(518,192,'2024-08-24 18:48:07',1,15,'MEDIUM','米克斯','Beatrix', NULL),
	(519,276,'2024-08-25 00:15:21',2,3,'SMALL','狐狸犬','Wizard', NULL),
	(520,224,'2024-08-25 21:53:04',1,7,'MEDIUM','米克斯','發財', NULL),
	(521,192,'2024-08-26 16:00:11',2,9,'SMALL','西施犬','Conan', NULL),
	(522,283,'2024-08-27 09:35:38',1,7,'MEDIUM','柴犬','Simba', NULL),
	(523,283,'2024-08-27 09:45:32',2,9,'SMALL','臘腸犬','妹妹', NULL),
	(524,283,'2024-08-27 09:51:08',1,4,'MEDIUM','柯基','Marnie', NULL),
	(525,201,'2024-08-27 18:30:10',2,3,'MEDIUM','柴犬','Memphis', NULL),
	(526,214,'2024-08-28 07:41:46',2,14,'SMALL','貴賓犬','Bullet', NULL),
	(527,214,'2024-08-28 07:44:18',1,8,'BIG','黃金獵犬','牛奶', NULL),
	(528,157,'2024-08-28 09:18:38',1,7,'BIG','黃金獵犬','Toaster', NULL),
	(529,157,'2024-08-28 09:22:29',1,2,'MEDIUM','米克斯','Brynn', NULL),
	(530,50,'2024-08-28 20:21:27',2,10,'MEDIUM','米克斯','小小', NULL),
	(531,50,'2024-08-28 20:27:52',1,15,'MEDIUM','柴犬','Evee', NULL),
	(532,25,'2024-09-01 03:22:45',2,3,'BIG','黃金獵犬','Tequila', NULL),
	(533,15,'2024-09-01 05:19:26',1,6,'MEDIUM','米克斯','NONO', NULL),
	(534,15,'2024-09-01 05:24:19',2,15,'MEDIUM','米克斯','Bjorn', NULL),
	(535,15,'2024-09-01 05:27:50',1,1,'MINI','約克夏','咖逼', NULL),
	(536,185,'2024-09-01 08:53:48',2,7,'SMALL','貴賓犬','Jeff', NULL),
	(537,185,'2024-09-01 09:03:29',2,2,'BIG','拉不拉多','Dolce', NULL),
	(538,185,'2024-09-01 09:13:21',2,11,'MEDIUM','柴犬','Dennis', NULL),
	(539,297,'2024-09-01 11:09:14',1,15,'SMALL','雪納瑞','拿鐵', NULL),
	(540,297,'2024-09-01 11:19:07',1,7,'MEDIUM','柴犬','Patience', NULL),
	(541,73,'2024-09-01 23:06:30',2,1,'MEDIUM','米克斯','斯斯', NULL),
	(542,288,'2024-09-02 06:43:37',2,9,'MEDIUM','米克斯','帥氣 ', NULL),
	(543,299,'2024-09-03 00:40:34',1,8,'MINI','博美犬','Dennis', NULL),
	(544,300,'2024-09-03 01:40:32',2,6,'MINI','吉娃娃','公爵', NULL),
	(545,300,'2024-09-03 01:50:18',2,15,'MEDIUM','柴犬','Lightning', NULL),
	(546,298,'2024-09-03 04:17:10',1,11,'MEDIUM','米克斯','胖胖', NULL),
	(547,298,'2024-09-03 04:25:02',2,2,'BIG','拉不拉多','元寶', NULL),
	(548,200,'2024-09-03 10:33:00',1,7,'BIG','黃金獵犬','Simba', NULL),
	(549,200,'2024-09-03 10:39:40',1,1,'BIG','拉不拉多','布丁', NULL),
	(550,200,'2024-09-03 10:46:08',1,11,'MEDIUM','米克斯','Kai', NULL),
	(551,177,'2024-09-03 12:41:33',2,14,'MINI','吉娃娃','Ruckus', NULL),
	(552,285,'2024-09-03 19:25:18',1,12,'MEDIUM','米克斯','Chomper', NULL),
	(553,297,'2024-09-03 21:17:07',2,8,'BIG','拉不拉多','Patience', NULL),
	(554,297,'2024-09-03 21:19:41',2,12,'MEDIUM','柯基','Stash', NULL),
	(555,212,'2024-09-05 11:23:05',1,8,'BIG','哈士奇','Selena', NULL),
	(556,260,'2024-09-05 15:57:39',2,8,'MEDIUM','柯基','Story', NULL),
	(557,260,'2024-09-05 16:02:32',2,6,'BIG','沙皮犬','天天', NULL),
	(558,260,'2024-09-05 16:12:17',1,13,'SMALL','法國鬥牛犬','樂樂', NULL),
	(559,260,'2024-09-05 16:21:02',2,2,'MEDIUM','柴犬','NONO', NULL),
	(560,293,'2024-09-06 02:19:23',1,15,'MINI','博美犬','胖胖', NULL),
	(561,293,'2024-09-06 02:27:04',2,2,'SMALL','雪納瑞','Wizard', NULL),
	(562,293,'2024-09-06 02:29:39',1,8,'MEDIUM','柴犬','武士', NULL),
	(563,295,'2024-09-06 07:50:19',1,5,'MEDIUM','米克斯','可樂', NULL),
	(564,296,'2024-09-06 19:43:48',2,7,'MINI','吉娃娃','Zephyr', NULL),
	(565,289,'2024-09-07 05:09:56',1,3,'BIG','拉不拉多','Argo', NULL),
	(566,200,'2024-09-07 05:28:26',1,13,'MEDIUM','柴犬','雪糕', NULL),
	(567,224,'2024-09-07 18:05:37',2,14,'SMALL','西施犬','總監', NULL),
	(568,266,'2024-09-07 20:47:41',2,2,'MEDIUM','米克斯','Beatrix', NULL),
	(569,266,'2024-09-07 20:51:21',1,11,'MEDIUM','米克斯','甜不辣', NULL),
	(570,301,'2024-09-08 02:30:06',1,6,'MEDIUM','米克斯','帥氣', NULL),
	(571,301,'2024-09-08 02:34:32',1,11,'MEDIUM','米克斯','奶茶', NULL),
	(572,301,'2024-09-08 02:38:09',1,13,'MEDIUM','柴犬','課長', NULL),
	(573,301,'2024-09-08 02:40:35',1,13,'BIG','哈士奇','拿鐵', NULL),
	(574,289,'2024-09-08 06:21:11',1,7,'SMALL','臘腸犬','Amaya', NULL),
	(575,289,'2024-09-08 06:28:54',2,2,'BIG','哈士奇','Ruckus', NULL),
	(576,289,'2024-09-08 06:35:33',2,1,'BIG','黃金獵犬','Jeff', NULL),
	(577,295,'2024-09-08 17:21:11',2,9,'SMALL','西施犬','Hurricane', NULL),
	(578,295,'2024-09-09 06:42:33',2,2,'MEDIUM','米克斯','白雪', NULL),
	(579,295,'2024-09-09 06:47:14',1,1,'MEDIUM','柯基','Evee', NULL),
	(580,78,'2024-09-09 07:29:55',2,7,'MEDIUM','柴犬','豆豆', NULL),
	(581,78,'2024-09-09 07:37:44',1,4,'MEDIUM','柯基','帥氣 ', NULL),
	(582,78,'2024-09-09 07:47:24',2,9,'MEDIUM','柯基','Hondo', NULL);
