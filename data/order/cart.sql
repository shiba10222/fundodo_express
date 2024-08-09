-- 資料表標題： Fundodo 訂單資料
-- 摘要：根據會員總表與商品總表生成的訂單資料

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+08:00";

-- --------------------------------------------------------

--
-- 資料表結構 `cart`
--

CREATE TABLE IF NOT EXISTS `cart` (
    `user_id` int(7) UNSIGNED NOT NULL,
    `prod_id` INT UNSIGNED NOT NULL,
    `qty` INT UNSIGNED NOT NULL,
    `created_at` DATETIME
); ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- 傾印資料表的資料 `cart`
--

INSERT INTO `cart` VALUES
  (2,462,1,'2023-09-29 22:33:11'),
	(2,641,1,'2024-02-25 23:40:06'),
	(2,820,1,'2024-03-08 11:23:31'),
	(4,709,1,'2022-08-17 21:43:55'),
	(4,550,1,'2022-08-17 21:53:33'),
	(4,391,1,'2022-08-17 22:01:00'),
	(4,232,1,'2022-12-02 05:48:44'),
	(4,73,1,'2022-12-02 05:52:19'),
	(4,938,1,'2022-12-02 13:08:26'),
	(4,779,1,'2022-12-02 13:12:01'),
	(5,116,2,'2022-10-25 23:28:08'),
	(5,431,1,'2022-10-25 23:34:42'),
	(5,746,1,'2022-10-25 23:41:32'),
	(5,37,1,'2022-10-25 23:49:21'),
	(6,413,1,'2023-07-14 06:12:00'),
	(6,340,1,'2023-07-14 06:17:37'),
	(6,267,1,'2023-07-14 06:27:15'),
	(6,194,1,'2023-07-14 06:36:00'),
	(6,121,1,'2023-07-14 06:38:25'),
	(7,277,2,'2023-01-16 23:01:59'),
	(7,346,1,'2023-01-16 23:04:50'),
	(8,309,1,'2022-07-30 17:36:28'),
	(8,156,1,'2022-07-30 17:42:14'),
	(8,3,2,'2023-12-23 04:55:58'),
	(8,874,1,'2024-06-19 17:57:11'),
	(8,721,1,'2024-07-04 03:40:49'),
	(9,464,3,'2023-01-01 21:22:39'),
	(9,677,1,'2023-01-01 21:30:25'),
	(9,890,1,'2023-06-24 09:25:09'),
	(10,832,2,'2022-10-19 17:57:15'),
	(10,453,1,'2022-10-19 17:59:58'),
	(10,74,1,'2022-10-19 18:06:41'),
	(10,719,1,'2022-10-19 18:11:11'),
	(10,340,1,'2022-10-19 18:17:50'),
	(10,985,1,'2022-10-19 18:20:40'),
	(10,606,3,'2022-10-19 18:26:31'),
	(12,865,1,'2023-09-14 19:20:18'),
	(12,600,1,'2024-03-01 10:20:00'),
	(12,335,1,'2024-03-01 10:28:40'),
	(12,70,3,'2024-03-01 10:32:21'),
	(13,466,1,'2023-02-01 14:40:47'),
	(13,439,3,'2023-02-01 14:48:13'),
	(14,128,1,'2023-12-24 07:12:41'),
	(14,371,1,'2023-12-24 07:15:08'),
	(14,614,3,'2023-12-24 07:20:55'),
	(14,857,1,'2023-12-24 07:27:29'),
	(14,76,1,'2023-12-24 07:34:15'),
	(14,319,1,'2023-12-24 07:40:49'),
	(14,562,3,'2023-12-24 07:45:35'),
	(17,797,1,'2022-11-02 22:41:47'),
	(17,46,3,'2024-04-17 07:56:22'),
	(17,319,2,'2024-07-06 11:13:12'),
	(19,110,1,'2022-08-02 19:29:15'),
	(19,743,1,'2022-08-02 19:37:58'),
	(19,352,1,'2022-08-02 19:42:34'),
	(19,985,1,'2022-08-02 19:48:19'),
	(20,380,1,'2022-10-07 02:18:58'),
	(20,897,1,'2022-10-07 02:28:48'),
	(20,390,1,'2022-10-07 02:35:28'),
	(20,907,1,'2022-10-07 02:41:22'),
	(20,400,1,'2023-09-13 23:41:12'),
	(20,917,1,'2024-06-16 02:37:58'),
	(20,410,1,'2024-06-16 02:40:42'),
	(22,689,1,'2023-08-26 20:14:46'),
	(22,820,1,'2023-08-26 20:19:14'),
	(22,951,1,'2023-08-26 20:24:46'),
	(25,826,3,'2022-08-17 07:16:08'),
	(25,421,3,'2022-11-02 15:32:33'),
	(25,16,2,'2022-11-02 15:36:18'),
	(26,459,1,'2024-08-22 05:08:00'),
	(26,938,1,'2024-08-22 05:17:48'),
	(26,393,3,'2024-08-22 05:26:34'),
	(27,125,2,'2022-12-20 15:26:03'),
	(27,538,1,'2023-06-12 15:33:13'),
	(27,951,1,'2023-06-12 15:39:59'),
	(27,340,1,'2023-06-12 15:46:26'),
	(27,753,1,'2023-06-12 15:55:07'),
	(27,142,1,'2023-06-12 15:59:49'),
	(27,555,1,'2023-06-12 16:06:24'),
	(29,366,1,'2023-02-07 08:13:40'),
	(29,1009,1,'2023-02-07 08:23:26'),
	(29,628,1,'2023-02-07 08:27:18'),
	(29,247,1,'2023-02-07 08:33:51'),
	(29,890,3,'2023-02-07 08:37:21'),
	(29,509,1,'2023-02-07 08:41:04'),
	(29,128,1,'2023-02-07 08:48:43'),
	(30,938,1,'2023-01-17 13:44:02'),
	(31,883,1,'2023-12-10 13:08:45'),
	(31,654,1,'2023-12-10 13:13:14'),
	(32,615,1,'2023-08-04 00:29:28'),
	(34,889,1,'2022-08-14 20:52:23'),
	(34,512,1,'2022-08-14 20:58:03'),
	(34,135,1,'2024-05-14 04:40:47'),
	(34,782,1,'2024-05-14 04:47:32'),
	(34,405,1,'2024-05-14 04:50:05'),
	(37,48,1,'2023-01-04 01:30:45'),
	(38,336,1,'2023-04-14 17:08:42'),
	(38,901,1,'2023-04-14 17:16:12'),
	(40,75,1,'2023-06-20 01:59:36'),
	(40,1002,1,'2023-06-20 02:06:13'),
	(40,905,1,'2023-06-20 02:13:50'),
	(40,808,1,'2023-06-20 02:18:21'),
	(40,711,2,'2023-06-20 02:20:55'),
	(40,614,2,'2024-03-24 22:17:20'),
	(41,608,1,'2023-05-19 14:06:12'),
	(41,181,1,'2023-05-19 14:12:43'),
	(41,778,1,'2023-05-19 14:18:28'),
	(42,635,1,'2024-05-02 01:35:51'),
	(42,694,2,'2024-07-25 11:49:53'),
	(42,753,1,'2024-07-25 11:54:47'),
	(42,812,1,'2024-07-25 12:02:27'),
	(42,871,3,'2024-07-25 12:11:05'),
	(42,930,1,'2024-07-25 12:20:51'),
	(45,832,3,'2023-12-03 01:10:29'),
	(45,669,1,'2023-12-03 01:15:10'),
	(45,506,1,'2023-12-03 01:21:39'),
	(45,343,1,'2023-12-03 01:30:11'),
	(45,180,1,'2023-12-03 01:32:42'),
	(45,17,3,'2023-12-03 01:41:29'),
	(45,878,1,'2024-08-26 11:05:10'),
	(47,512,1,'2024-03-20 09:40:17'),
	(47,475,1,'2024-03-20 09:42:43'),
	(48,889,1,'2024-05-11 15:14:07'),
	(48,228,2,'2024-05-11 15:22:55'),
	(48,591,3,'2024-05-11 15:31:48'),
	(48,954,1,'2024-05-11 15:34:38'),
	(48,293,1,'2024-05-11 15:39:14'),
	(48,656,3,'2024-08-19 08:27:21'),
	(48,1019,1,'2024-08-19 08:35:15'),
	(49,475,1,'2023-05-05 09:44:18'),
	(51,934,1,'2023-02-13 01:17:06'),
	(51,483,2,'2023-02-13 01:24:41'),
	(55,512,3,'2024-08-15 09:36:40'),
	(55,397,1,'2024-08-29 08:22:32'),
	(55,282,1,'2024-08-29 08:25:08'),
	(55,167,1,'2024-08-29 08:27:57'),
	(55,52,3,'2024-08-29 08:37:42'),
	(55,961,1,'2024-08-29 08:44:07'),
	(55,846,1,'2024-08-29 08:46:32'),
	(56,645,1,'2023-08-06 20:32:26'),
	(56,852,1,'2024-06-08 05:24:41'),
	(56,35,1,'2024-06-08 05:27:31'),
	(56,242,1,'2024-06-08 05:37:03'),
	(56,449,1,'2024-06-20 14:42:55'),
	(56,656,1,'2024-06-20 14:46:35'),
	(56,863,1,'2024-06-20 14:53:07'),
	(57,510,1,'2023-11-24 00:23:31'),
	(57,963,1,'2024-03-04 15:25:28'),
	(57,392,2,'2024-03-04 15:29:01'),
	(59,979,1,'2023-04-16 08:19:42'),
	(59,288,1,'2023-12-09 10:59:53'),
	(59,621,2,'2023-12-09 11:04:40'),
	(59,954,2,'2023-12-09 11:08:29'),
	(59,263,1,'2023-12-09 11:15:54'),
	(59,596,3,'2024-04-24 07:55:53'),
	(60,567,1,'2023-10-28 11:09:53'),
	(60,580,1,'2023-10-28 11:13:18'),
	(60,593,1,'2023-10-28 11:22:43'),
	(60,606,1,'2023-10-28 11:31:29'),
	(60,619,1,'2023-10-28 11:38:17'),
	(60,632,2,'2024-09-08 02:57:11'),
	(61,612,1,'2023-01-20 00:28:06'),
	(61,807,1,'2023-02-25 21:43:25'),
	(61,1002,1,'2023-02-25 21:49:01'),
	(61,173,1,'2023-02-25 21:52:30'),
	(61,368,3,'2023-02-25 22:00:05'),
	(61,563,1,'2023-02-25 22:03:40'),
	(61,758,1,'2023-02-25 22:08:09'),
	(63,732,1,'2023-02-13 04:05:00'),
	(63,733,1,'2023-04-08 05:51:30'),
	(63,734,2,'2023-04-08 05:57:59'),
	(63,735,1,'2023-04-08 06:01:50'),
	(65,868,2,'2023-02-26 16:52:30'),
	(65,343,1,'2023-02-26 16:56:10'),
	(65,842,1,'2023-02-26 17:00:57'),
	(65,317,2,'2023-02-26 17:07:48'),
	(65,816,3,'2023-08-06 07:02:42'),
	(65,291,2,'2023-08-06 07:05:14'),
	(66,865,2,'2024-09-09 04:58:02'),
	(66,146,3,'2024-09-09 05:06:45'),
	(66,451,2,'2024-09-09 05:16:28'),
	(67,758,1,'2023-03-25 20:32:10'),
	(68,519,1,'2023-09-21 10:30:06'),
	(68,138,1,'2023-09-21 10:40:00'),
	(68,781,1,'2024-01-26 06:38:04'),
	(68,400,1,'2024-01-26 06:44:37'),
	(68,19,1,'2024-01-26 06:50:30'),
	(68,662,4,'2024-04-24 01:42:08'),
	(69,615,1,'2023-04-18 17:15:42'),
	(70,593,1,'2024-05-17 01:55:16'),
	(70,890,1,'2024-05-17 02:05:01'),
	(70,163,1,'2024-07-24 16:22:40'),
	(73,822,1,'2023-11-25 04:04:23'),
	(73,323,1,'2023-11-25 04:12:09'),
	(73,848,1,'2023-11-25 04:19:43'),
	(73,349,1,'2023-11-25 04:28:09'),
	(75,137,1,'2024-01-01 02:14:02'),
	(75,490,1,'2024-01-01 02:17:49'),
	(75,843,3,'2024-02-04 07:15:12'),
	(75,172,2,'2024-02-04 07:20:52'),
	(75,525,1,'2024-02-04 07:24:24'),
	(76,664,2,'2024-04-18 18:27:20'),
	(76,217,2,'2024-04-18 18:35:00'),
	(76,794,1,'2024-04-18 18:43:44'),
	(76,347,1,'2024-04-18 18:50:21'),
	(76,924,1,'2024-04-18 19:00:02'),
	(77,625,2,'2023-08-19 02:13:37'),
	(77,1002,1,'2023-08-19 02:23:19'),
	(77,355,3,'2023-08-19 02:29:48'),
	(77,732,1,'2023-10-25 00:55:39'),
	(77,85,1,'2023-10-25 01:01:20'),
	(77,462,1,'2024-07-07 13:53:46'),
	(78,568,1,'2023-03-24 02:51:12'),
	(78,681,1,'2023-03-24 02:56:48'),
	(79,716,1,'2024-05-18 09:40:27'),
	(79,567,1,'2024-05-18 09:48:11'),
	(79,418,1,'2024-05-18 09:50:36'),
	(79,269,2,'2024-05-18 10:00:22'),
	(80,857,1,'2023-03-16 16:07:04'),
	(80,346,3,'2023-03-16 16:10:48'),
	(80,859,3,'2023-03-16 16:18:28'),
	(80,348,1,'2023-03-16 16:22:09'),
	(84,536,1,'2023-04-24 18:22:39'),
	(84,751,1,'2023-04-24 18:32:06'),
	(84,966,1,'2023-04-24 18:41:56'),
	(84,157,3,'2023-04-24 18:45:23'),
	(84,372,1,'2023-04-24 18:52:13'),
	(84,587,1,'2023-04-24 19:00:01'),
	(85,487,1,'2023-12-25 09:24:09'),
	(85,426,1,'2023-12-25 09:33:46'),
	(86,235,1,'2023-10-07 05:23:13'),
	(86,948,1,'2023-10-07 05:27:03'),
	(86,637,8,'2023-10-07 05:35:46'),
	(89,90,1,'2024-04-22 11:15:32'),
	(89,591,2,'2024-04-22 11:25:20'),
	(89,68,1,'2024-04-22 11:28:52'),
	(89,569,1,'2024-04-22 11:32:40'),
	(89,46,1,'2024-04-22 11:37:19'),
	(89,547,4,'2024-04-22 11:41:00'),
	(89,24,1,'2024-04-22 11:43:35'),
	(90,402,3,'2023-06-30 17:30:21'),
	(90,469,3,'2023-06-30 17:38:51'),
	(90,536,3,'2023-06-30 17:48:24'),
	(90,603,1,'2023-06-30 17:56:17'),
	(90,670,3,'2023-12-02 15:48:25'),
	(90,737,1,'2024-05-14 16:42:59'),
	(91,513,3,'2024-08-20 00:01:35'),
	(91,784,3,'2024-09-01 14:34:31'),
	(91,31,1,'2024-09-01 14:42:07'),
	(91,302,1,'2024-09-01 14:44:46');
INSERT INTO `cart` VALUES (91,573,3,'2024-09-01 14:48:29'),
	(91,844,1,'2024-09-07 20:03:16'),
	(91,91,1,'2024-09-07 20:10:41'),
	(94,135,3,'2024-03-15 20:10:04'),
	(94,588,1,'2024-03-15 20:18:38'),
	(94,17,1,'2024-07-15 14:37:44'),
	(94,470,1,'2024-07-15 14:43:20'),
	(94,923,1,'2024-08-12 17:39:26'),
	(94,352,1,'2024-08-12 17:43:03'),
	(94,805,1,'2024-08-12 17:49:30'),
	(97,344,1,'2024-07-12 08:33:15'),
	(99,485,1,'2023-10-18 14:14:59'),
	(99,266,1,'2023-10-18 14:19:24'),
	(100,976,3,'2024-07-16 04:27:12'),
	(100,655,1,'2024-07-16 04:29:43'),
	(100,334,1,'2024-08-21 01:47:03'),
	(100,13,2,'2024-08-21 01:54:54'),
	(102,100,1,'2023-04-28 19:09:40'),
	(102,707,1,'2023-04-28 19:12:31'),
	(102,290,1,'2023-04-28 19:18:21'),
	(102,897,1,'2023-10-18 17:16:27'),
	(102,480,1,'2023-10-18 17:24:11'),
	(102,63,1,'2023-10-18 17:27:42'),
	(102,670,1,'2024-04-20 03:30:09'),
	(103,653,1,'2024-04-13 06:44:24'),
	(105,840,1,'2023-03-11 22:04:31'),
	(105,671,1,'2023-03-11 22:07:19'),
	(105,502,3,'2023-03-11 22:12:08'),
	(105,333,3,'2023-03-11 22:15:38'),
	(105,164,1,'2023-03-11 22:19:12'),
	(105,1019,1,'2023-03-11 22:28:50'),
	(107,986,1,'2024-03-13 14:49:30'),
	(107,955,1,'2024-03-13 14:52:21'),
	(108,1015,2,'2023-11-16 22:28:52'),
	(109,805,1,'2023-04-07 03:43:10'),
	(109,708,1,'2023-04-07 03:48:57'),
	(109,611,1,'2023-04-07 03:57:40'),
	(109,514,1,'2023-04-07 04:02:34'),
	(109,417,1,'2023-04-07 04:12:05'),
	(109,320,1,'2023-05-13 19:53:34'),
	(109,223,9,'2023-05-13 20:01:27'),
	(111,728,1,'2023-05-30 22:52:38'),
	(111,875,1,'2023-05-30 23:01:11'),
	(111,1022,2,'2023-08-16 19:37:24'),
	(111,145,1,'2023-08-16 19:42:08'),
	(113,736,1,'2023-03-04 00:31:10'),
	(113,183,1,'2023-03-04 00:36:04'),
	(113,654,1,'2023-03-04 00:39:52'),
	(113,101,1,'2023-03-04 00:42:36'),
	(113,572,1,'2023-03-04 00:46:03'),
	(113,19,1,'2023-03-04 00:52:33'),
	(113,490,3,'2023-03-04 01:02:07'),
	(114,230,1,'2023-10-01 09:37:09'),
	(114,175,1,'2024-06-04 11:20:26'),
	(114,120,2,'2024-06-04 11:27:11'),
	(114,65,1,'2024-06-04 11:31:44'),
	(114,10,1,'2024-08-23 08:23:03'),
	(114,979,1,'2024-08-23 08:32:52'),
	(115,831,3,'2023-07-05 21:42:50'),
	(115,892,1,'2023-07-05 21:48:44'),
	(116,621,1,'2024-09-01 06:35:12'),
	(116,726,1,'2024-09-01 06:37:46'),
	(116,831,3,'2024-09-01 06:41:26'),
	(116,936,1,'2024-09-01 06:44:07'),
	(116,17,1,'2024-09-01 06:46:51'),
	(116,122,9,'2024-09-01 06:56:32'),
	(116,227,1,'2024-09-01 07:06:13'),
	(117,206,1,'2024-02-05 19:40:20'),
	(117,89,1,'2024-02-05 19:43:11'),
	(117,996,1,'2024-02-05 19:51:51'),
	(122,865,1,'2024-07-27 09:26:05'),
	(122,466,1,'2024-07-27 09:30:56'),
	(122,67,1,'2024-07-27 09:34:34'),
	(122,692,1,'2024-07-27 09:40:19'),
	(122,293,1,'2024-07-27 09:45:54'),
	(122,918,3,'2024-07-27 09:50:19'),
	(122,519,1,'2024-07-27 09:53:44'),
	(128,788,1,'2023-11-25 08:49:25'),
	(130,615,1,'2024-02-15 06:34:33'),
	(130,704,1,'2024-02-15 06:43:19'),
	(130,793,1,'2024-02-15 06:46:07'),
	(130,882,1,'2024-02-15 06:50:39'),
	(130,971,1,'2024-06-03 02:10:31'),
	(130,36,1,'2024-06-03 02:14:02'),
	(130,125,1,'2024-06-03 02:18:34'),
	(131,612,1,'2023-08-30 04:35:53'),
	(131,161,1,'2023-08-30 04:43:22'),
	(131,734,1,'2023-08-30 04:53:00'),
	(131,283,1,'2023-08-30 05:02:35'),
	(131,856,2,'2023-08-30 05:07:17'),
	(131,405,1,'2023-08-30 05:14:54'),
	(132,367,2,'2024-05-08 02:08:01'),
	(132,750,1,'2024-05-08 02:15:27'),
	(132,109,1,'2024-05-08 02:24:14'),
	(133,91,1,'2024-08-12 06:12:50'),
	(137,270,1,'2023-11-11 08:59:52'),
	(137,953,1,'2023-11-11 09:09:46'),
	(137,612,1,'2023-11-11 09:17:21'),
	(139,660,1,'2024-01-18 09:46:34'),
	(139,185,2,'2024-09-03 22:37:50'),
	(140,153,1,'2024-02-03 12:57:34'),
	(140,858,1,'2024-02-03 13:07:23'),
	(140,539,1,'2024-02-03 13:17:15'),
	(141,668,3,'2023-11-01 16:14:37'),
	(141,721,2,'2023-11-01 16:22:09'),
	(141,774,1,'2023-11-01 16:28:44'),
	(142,617,2,'2024-02-05 21:10:35'),
	(142,1002,1,'2024-02-05 21:20:00'),
	(142,363,1,'2024-02-05 21:27:30'),
	(142,748,3,'2024-07-19 16:59:09'),
	(142,109,1,'2024-07-19 17:02:50'),
	(142,494,3,'2024-07-19 17:12:18'),
	(142,879,1,'2024-07-19 17:18:55'),
	(143,893,2,'2023-10-15 17:31:08'),
	(143,800,1,'2023-10-15 17:35:40'),
	(147,176,3,'2023-08-03 21:26:15'),
	(147,281,1,'2023-08-03 21:31:51'),
	(147,386,1,'2024-02-06 23:41:51'),
	(149,577,1,'2024-04-07 01:25:39'),
	(149,50,1,'2024-04-07 01:28:09'),
	(149,547,1,'2024-04-07 01:33:49'),
	(149,20,1,'2024-04-07 01:36:31'),
	(149,517,3,'2024-05-14 09:53:56'),
	(149,1014,1,'2024-05-14 09:58:27'),
	(151,461,2,'2024-03-26 18:48:07'),
	(151,302,3,'2024-03-26 18:53:46'),
	(151,143,1,'2024-03-26 19:03:14'),
	(151,1008,1,'2024-03-26 19:10:06'),
	(151,849,1,'2024-03-26 19:16:43'),
	(154,651,1,'2024-05-12 12:11:50'),
	(154,240,3,'2024-09-01 15:46:12'),
	(154,853,3,'2024-09-07 21:40:33'),
	(154,442,1,'2024-09-07 21:48:00'),
	(155,357,3,'2023-12-24 19:54:30'),
	(155,210,1,'2023-12-24 20:01:04'),
	(155,63,1,'2024-07-31 07:31:23'),
	(155,940,3,'2024-07-31 07:33:59'),
	(157,7,1,'2023-12-05 22:58:00'),
	(157,716,1,'2023-12-05 23:07:46'),
	(157,401,2,'2023-12-05 23:15:29'),
	(158,1007,1,'2023-12-07 03:06:39'),
	(159,207,1,'2024-04-15 04:41:57'),
	(161,459,1,'2023-12-29 06:08:30'),
	(162,330,1,'2024-04-15 23:16:58'),
	(163,206,1,'2024-05-18 10:20:59'),
	(163,303,1,'2024-05-18 10:24:40'),
	(163,400,1,'2024-05-18 10:34:21'),
	(163,497,1,'2024-05-18 10:39:05'),
	(163,594,1,'2024-05-18 10:47:53'),
	(163,691,1,'2024-05-18 10:55:25'),
	(163,788,2,'2024-05-18 11:03:52'),
	(164,655,3,'2024-05-26 00:38:08'),
	(164,340,1,'2024-05-26 00:47:51'),
	(164,25,1,'2024-05-26 00:52:21'),
	(165,635,1,'2024-06-04 13:05:05'),
	(165,934,3,'2024-06-04 13:07:44'),
	(165,209,1,'2024-06-04 13:11:09'),
	(165,508,3,'2024-06-11 21:50:15'),
	(165,807,3,'2024-06-11 21:57:00'),
	(165,82,1,'2024-06-11 22:02:48'),
	(167,315,2,'2024-05-31 01:08:48'),
	(167,238,3,'2024-05-31 01:14:25'),
	(167,161,1,'2024-05-31 01:19:14'),
	(168,39,1,'2024-03-01 08:34:01'),
	(168,676,8,'2024-03-01 08:39:45'),
	(168,289,1,'2024-03-01 08:46:26'),
	(168,926,3,'2024-03-01 08:52:11'),
	(168,539,1,'2024-03-01 09:01:00'),
	(168,152,2,'2024-03-01 09:05:49'),
	(170,151,1,'2024-04-21 02:06:51'),
	(170,84,2,'2024-04-21 02:14:21'),
	(170,17,1,'2024-04-21 02:24:01'),
	(170,974,1,'2024-08-09 06:44:37'),
	(170,907,1,'2024-08-12 13:15:51'),
	(172,152,1,'2024-01-24 06:11:51'),
	(172,453,2,'2024-01-24 06:20:44'),
	(172,754,4,'2024-01-24 06:29:21'),
	(172,31,2,'2024-01-24 06:34:58'),
	(173,312,3,'2024-04-17 02:04:29'),
	(173,803,1,'2024-04-17 02:11:58'),
	(173,270,1,'2024-04-17 02:19:24'),
	(173,761,1,'2024-04-17 02:29:04'),
	(174,803,2,'2023-11-05 08:22:17'),
	(174,120,2,'2023-11-05 08:30:56'),
	(174,461,1,'2023-11-05 08:40:43'),
	(174,802,1,'2023-11-05 08:50:27'),
	(174,119,2,'2023-11-05 08:59:56'),
	(174,460,3,'2023-11-05 09:06:45'),
	(176,954,1,'2023-11-01 22:26:03'),
	(176,75,1,'2024-01-07 22:00:56'),
	(176,220,1,'2024-01-07 22:08:28'),
	(177,61,1,'2023-10-11 09:42:42'),
	(177,230,1,'2024-02-02 23:47:42'),
	(177,399,1,'2024-02-02 23:57:30'),
	(178,670,1,'2023-10-13 11:09:01'),
	(180,353,1,'2024-02-15 07:56:19'),
	(180,240,1,'2024-02-15 08:00:08'),
	(182,846,1,'2024-03-02 01:38:57'),
	(182,179,1,'2024-03-02 01:41:51'),
	(182,536,2,'2024-07-02 05:48:37'),
	(182,893,1,'2024-07-02 05:53:18'),
	(182,226,1,'2024-07-02 05:56:05'),
	(182,583,1,'2024-07-02 05:58:55'),
	(182,940,1,'2024-07-31 07:36:26'),
	(185,71,1,'2023-11-30 04:53:15'),
	(185,522,1,'2023-11-30 04:56:53'),
	(185,973,1,'2023-11-30 05:05:20'),
	(185,400,1,'2023-11-30 05:13:56'),
	(186,445,2,'2024-04-07 11:19:57'),
	(186,456,3,'2024-04-07 11:26:31'),
	(186,467,1,'2024-04-07 11:32:09'),
	(186,478,2,'2024-04-07 11:39:55'),
	(186,489,10,'2024-04-07 11:47:39'),
	(186,500,1,'2024-04-07 11:53:15'),
	(187,694,1,'2024-01-16 05:16:01'),
	(187,445,3,'2024-01-16 05:22:29'),
	(189,339,1,'2024-05-17 12:32:58'),
	(189,434,2,'2024-05-23 20:08:06'),
	(189,529,1,'2024-06-09 09:21:34'),
	(189,624,1,'2024-06-14 21:16:03'),
	(189,719,1,'2024-06-14 21:19:33'),
	(189,814,1,'2024-06-14 21:27:21'),
	(190,151,2,'2023-09-30 05:04:44'),
	(191,127,3,'2024-06-23 04:41:01'),
	(191,438,1,'2024-07-17 02:32:12'),
	(192,790,1,'2024-07-17 09:13:24'),
	(192,503,1,'2024-07-17 09:17:08'),
	(192,216,2,'2024-07-17 09:23:02'),
	(192,953,2,'2024-07-17 09:26:27'),
	(193,636,1,'2023-12-10 21:43:04'),
	(193,809,1,'2024-08-01 21:23:43'),
	(193,982,1,'2024-08-01 21:33:33'),
	(193,131,3,'2024-08-13 09:51:06'),
	(193,304,5,'2024-08-13 09:56:52'),
	(194,630,1,'2024-06-26 00:45:18'),
	(194,297,1,'2024-08-11 09:02:46'),
	(194,988,1,'2024-08-30 13:44:11'),
	(196,804,3,'2023-11-28 00:57:36'),
	(197,873,1,'2024-08-26 01:56:14'),
	(197,282,1,'2024-08-26 02:05:50'),
	(197,715,1,'2024-08-26 02:15:27'),
	(198,337,1,'2024-02-09 17:49:46'),
	(199,244,2,'2024-06-02 06:13:58'),
	(199,125,1,'2024-08-13 02:26:57'),
	(199,6,1,'2024-08-13 02:32:27'),
	(199,911,1,'2024-08-13 02:40:03'),
	(199,792,1,'2024-08-13 02:42:47'),
	(199,673,1,'2024-08-13 02:45:30'),
	(201,789,1,'2024-07-23 14:58:13'),
	(201,278,1,'2024-07-23 15:06:07');
INSERT INTO `cart` VALUES (201,791,3,'2024-07-23 15:10:44'),
	(201,280,1,'2024-07-23 15:13:10'),
	(201,793,3,'2024-07-23 15:15:43'),
	(202,467,1,'2024-04-16 06:40:46'),
	(202,614,1,'2024-04-16 06:48:19'),
	(202,761,1,'2024-04-16 06:55:46'),
	(202,908,1,'2024-04-16 06:58:18'),
	(204,243,1,'2024-02-01 20:30:54'),
	(204,956,1,'2024-02-01 20:33:42'),
	(204,645,1,'2024-02-10 14:06:39'),
	(204,334,1,'2024-02-10 14:13:15'),
	(204,23,1,'2024-02-10 14:21:08'),
	(204,736,1,'2024-05-08 09:27:08'),
	(204,425,1,'2024-05-15 07:17:10'),
	(205,139,1,'2024-07-28 12:05:46'),
	(205,1016,2,'2024-07-28 12:11:27'),
	(205,869,2,'2024-08-18 11:16:46'),
	(205,722,1,'2024-08-18 11:22:33'),
	(205,575,1,'2024-08-20 18:02:59'),
	(205,428,2,'2024-08-20 18:07:39'),
	(205,281,1,'2024-08-24 20:08:29'),
	(206,907,1,'2024-03-30 22:53:36'),
	(206,450,1,'2024-05-17 20:08:32'),
	(206,1017,1,'2024-05-17 20:18:08'),
	(206,560,1,'2024-05-17 20:22:36'),
	(206,103,3,'2024-05-17 20:27:17'),
	(206,670,1,'2024-05-17 20:29:53'),
	(206,213,1,'2024-05-22 23:06:12'),
	(207,821,2,'2024-07-09 15:25:00'),
	(207,930,2,'2024-07-09 15:27:39'),
	(207,15,1,'2024-08-20 00:17:55'),
	(207,124,1,'2024-08-20 00:25:42'),
	(208,476,1,'2024-05-15 20:15:33'),
	(208,487,1,'2024-05-15 20:22:02'),
	(208,498,1,'2024-05-15 20:30:46'),
	(208,509,1,'2024-07-13 18:20:04'),
	(208,520,1,'2024-07-13 18:25:52'),
	(208,531,3,'2024-07-13 18:31:45'),
	(208,542,1,'2024-07-13 18:41:11'),
	(209,147,1,'2024-06-27 08:33:05'),
	(209,636,1,'2024-06-27 08:35:53'),
	(210,947,1,'2024-08-01 01:35:45'),
	(210,578,1,'2024-08-01 01:45:38'),
	(210,209,2,'2024-08-01 01:51:19'),
	(210,864,2,'2024-08-01 01:55:12'),
	(210,495,1,'2024-08-01 02:03:49'),
	(210,126,1,'2024-08-01 02:09:34'),
	(210,781,1,'2024-09-07 10:14:04'),
	(211,606,1,'2024-05-16 09:32:18'),
	(211,459,1,'2024-06-15 12:36:38'),
	(211,312,3,'2024-06-15 12:41:25'),
	(211,165,1,'2024-06-15 12:48:51'),
	(211,18,1,'2024-08-12 07:03:31'),
	(212,222,1,'2024-04-16 01:09:43'),
	(212,291,1,'2024-04-16 01:15:14'),
	(214,42,3,'2024-02-21 02:44:44'),
	(214,661,2,'2024-02-21 02:48:22'),
	(217,375,1,'2024-04-11 19:22:10'),
	(217,148,3,'2024-04-11 19:27:45'),
	(217,945,3,'2024-04-11 19:36:29'),
	(220,1017,1,'2024-04-18 14:14:37'),
	(220,176,1,'2024-05-28 18:58:46'),
	(220,359,1,'2024-05-28 19:02:30'),
	(220,542,1,'2024-05-28 19:09:04'),
	(220,725,1,'2024-05-28 19:17:52'),
	(220,908,1,'2024-05-28 19:26:25'),
	(220,67,1,'2024-05-28 19:36:14'),
	(221,674,1,'2024-04-15 18:15:35'),
	(221,867,2,'2024-04-15 18:19:29'),
	(221,36,1,'2024-06-30 03:29:39'),
	(221,229,1,'2024-06-30 03:33:23'),
	(221,422,1,'2024-06-30 03:39:07'),
	(221,615,1,'2024-06-30 03:43:50'),
	(222,133,1,'2024-04-25 10:33:23'),
	(222,254,1,'2024-08-31 08:52:44'),
	(222,375,1,'2024-08-31 09:02:37'),
	(222,496,6,'2024-08-31 09:07:14'),
	(222,617,1,'2024-08-31 09:11:01'),
	(224,419,1,'2024-07-15 12:41:19'),
	(224,660,2,'2024-07-15 12:51:08'),
	(224,901,1,'2024-07-29 04:25:58'),
	(225,193,1,'2024-07-30 04:09:07'),
	(225,890,3,'2024-09-08 14:57:58'),
	(225,563,1,'2024-09-08 15:06:42'),
	(225,236,1,'2024-09-08 15:16:32'),
	(226,339,1,'2024-01-18 11:14:11'),
	(226,606,1,'2024-01-18 11:21:56'),
	(228,914,1,'2024-02-05 05:29:22'),
	(229,90,1,'2024-08-08 13:57:30'),
	(229,613,2,'2024-08-08 14:04:59'),
	(229,112,2,'2024-08-08 14:12:28'),
	(229,635,1,'2024-08-23 06:43:56'),
	(229,134,3,'2024-08-23 06:52:46'),
	(230,449,1,'2024-03-27 12:45:02'),
	(231,112,1,'2024-06-02 17:01:46'),
	(231,993,1,'2024-08-16 03:03:45'),
	(231,850,1,'2024-08-16 03:09:29'),
	(231,707,1,'2024-08-16 03:17:18'),
	(232,451,1,'2024-02-10 16:39:29'),
	(232,196,1,'2024-02-10 16:48:21'),
	(232,965,1,'2024-05-02 20:04:27'),
	(236,740,1,'2024-08-24 14:19:07'),
	(236,1005,1,'2024-08-24 14:24:45'),
	(236,246,1,'2024-08-24 14:27:12'),
	(236,511,1,'2024-08-24 14:37:02'),
	(236,776,1,'2024-08-24 19:58:45'),
	(236,17,1,'2024-08-24 20:08:28'),
	(236,282,1,'2024-08-24 20:16:59'),
	(237,551,1,'2024-08-22 20:29:22'),
	(237,28,2,'2024-08-22 20:33:51'),
	(239,6,2,'2024-04-20 07:57:05'),
	(239,819,1,'2024-04-20 08:02:30'),
	(239,608,1,'2024-05-30 14:21:50'),
	(239,397,1,'2024-05-30 14:30:16'),
	(240,295,3,'2024-06-23 06:05:40'),
	(241,522,1,'2024-03-01 16:50:00'),
	(241,773,1,'2024-03-01 16:59:29'),
	(242,977,1,'2024-08-20 03:18:02'),
	(242,206,1,'2024-08-20 03:26:47'),
	(242,459,1,'2024-08-20 03:30:12'),
	(246,997,2,'2024-06-20 05:31:05'),
	(246,558,3,'2024-06-20 05:39:54'),
	(246,119,1,'2024-06-20 05:44:41'),
	(247,261,1,'2024-03-24 05:17:12'),
	(247,632,1,'2024-03-24 05:24:51'),
	(247,1003,2,'2024-03-24 05:29:16'),
	(248,609,2,'2024-05-24 04:50:47'),
	(248,422,1,'2024-05-24 04:53:39'),
	(248,235,1,'2024-05-24 05:03:17'),
	(248,48,1,'2024-05-24 05:08:56'),
	(248,885,1,'2024-05-24 05:12:27'),
	(248,698,2,'2024-05-24 05:17:11'),
	(249,480,1,'2024-05-29 18:56:07'),
	(251,809,1,'2024-06-07 12:31:15'),
	(251,470,1,'2024-06-07 12:40:52'),
	(252,778,3,'2024-06-11 00:55:31'),
	(252,147,1,'2024-06-11 01:02:10'),
	(252,540,1,'2024-07-07 10:51:26'),
	(253,201,1,'2024-04-24 03:53:48'),
	(253,830,3,'2024-04-24 04:02:38'),
	(253,435,1,'2024-04-24 04:10:13'),
	(254,839,2,'2024-04-07 12:51:22'),
	(254,362,1,'2024-04-07 13:01:05'),
	(254,909,1,'2024-05-02 17:17:37'),
	(254,432,1,'2024-05-02 17:22:06'),
	(254,979,1,'2024-05-02 17:30:43'),
	(258,187,1,'2024-08-06 21:51:18'),
	(260,866,3,'2024-06-26 03:40:39'),
	(260,839,1,'2024-06-26 03:44:29'),
	(260,812,1,'2024-06-26 03:50:05'),
	(261,138,3,'2024-06-08 22:46:41'),
	(261,695,3,'2024-06-08 22:54:20'),
	(261,228,1,'2024-06-08 22:56:58'),
	(261,785,1,'2024-06-08 23:06:38'),
	(262,528,3,'2024-05-06 10:00:16'),
	(262,825,1,'2024-05-06 10:06:10'),
	(264,165,1,'2024-07-04 05:17:34'),
	(264,610,1,'2024-08-03 04:18:31'),
	(264,31,1,'2024-08-03 04:23:08'),
	(264,476,3,'2024-08-03 04:25:43'),
	(264,921,1,'2024-08-03 04:28:27'),
	(264,342,1,'2024-08-03 04:35:08'),
	(264,787,1,'2024-08-03 04:43:33'),
	(265,253,1,'2024-05-28 20:07:40'),
	(265,622,1,'2024-05-28 20:13:20'),
	(265,991,1,'2024-05-28 20:17:05'),
	(265,336,1,'2024-06-13 14:06:58'),
	(266,132,2,'2024-08-29 20:29:35'),
	(266,153,1,'2024-09-07 02:39:08'),
	(266,174,1,'2024-09-07 02:45:59'),
	(266,195,2,'2024-09-07 02:54:47'),
	(266,216,1,'2024-09-09 00:52:19'),
	(266,237,1,'2024-09-09 00:54:53'),
	(266,258,1,'2024-09-09 00:59:45'),
	(267,241,1,'2024-06-27 16:12:00'),
	(268,987,3,'2024-05-26 18:45:15'),
	(270,769,1,'2024-08-02 11:38:08'),
	(270,406,2,'2024-08-15 06:14:34'),
	(270,43,1,'2024-08-15 06:22:15'),
	(270,704,1,'2024-08-15 12:30:04'),
	(270,341,1,'2024-08-30 10:47:18'),
	(270,1002,2,'2024-08-30 10:54:52'),
	(270,639,1,'2024-08-30 11:03:21'),
	(271,293,1,'2024-09-07 02:43:00'),
	(272,738,1,'2024-07-26 02:06:57'),
	(272,35,1,'2024-07-26 02:10:41'),
	(272,356,1,'2024-07-26 02:15:28'),
	(272,677,1,'2024-07-26 02:24:19'),
	(273,577,1,'2024-06-17 15:30:26'),
	(273,74,3,'2024-06-17 15:33:02'),
	(273,595,1,'2024-06-17 15:37:29'),
	(273,92,1,'2024-06-17 15:42:04'),
	(273,613,2,'2024-07-03 22:15:22'),
	(273,110,1,'2024-07-03 22:21:00'),
	(275,985,1,'2024-09-07 11:03:24'),
	(275,520,3,'2024-09-07 11:11:02'),
	(275,55,1,'2024-09-07 11:18:31'),
	(276,802,1,'2024-08-04 05:06:06'),
	(276,691,1,'2024-08-04 05:15:52'),
	(276,580,1,'2024-08-04 05:23:17'),
	(276,469,2,'2024-08-04 05:28:07'),
	(276,358,1,'2024-08-04 05:30:33'),
	(276,247,1,'2024-08-04 05:34:17'),
	(276,136,1,'2024-08-31 19:40:28'),
	(277,806,2,'2024-07-09 17:41:54'),
	(277,963,1,'2024-07-09 17:47:43'),
	(277,96,1,'2024-08-27 22:01:47'),
	(277,253,1,'2024-08-27 22:04:12'),
	(281,976,1,'2024-08-16 22:59:14'),
	(281,573,1,'2024-08-16 23:07:40'),
	(281,170,1,'2024-08-18 21:31:08'),
	(282,817,1,'2024-07-20 22:52:14'),
	(282,308,2,'2024-07-20 23:01:54'),
	(282,823,3,'2024-07-20 23:08:46'),
	(284,128,1,'2024-08-05 02:58:48'),
	(284,999,2,'2024-08-05 03:01:28'),
	(285,347,1,'2024-08-24 00:40:43'),
	(285,118,1,'2024-08-24 00:46:23'),
	(286,649,1,'2024-08-04 16:25:40'),
	(286,396,3,'2024-08-04 16:30:24'),
	(288,499,1,'2024-08-14 10:16:46'),
	(288,932,3,'2024-08-19 22:13:43'),
	(288,341,2,'2024-08-19 22:18:13'),
	(288,774,1,'2024-08-19 22:26:50'),
	(288,183,2,'2024-08-19 22:34:24'),
	(289,812,2,'2024-08-31 02:24:07'),
	(289,753,1,'2024-08-31 02:32:45'),
	(289,694,1,'2024-08-31 02:35:29'),
	(289,635,2,'2024-08-31 02:43:55'),
	(289,576,1,'2024-08-31 02:51:25'),
	(292,1015,1,'2024-08-20 21:21:33'),
	(292,78,1,'2024-08-20 21:29:01'),
	(292,165,1,'2024-08-20 21:36:36'),
	(292,252,3,'2024-08-20 21:45:03'),
	(292,339,1,'2024-08-20 21:47:40'),
	(294,994,1,'2024-08-28 15:34:39'),
	(295,409,2,'2024-08-27 15:47:14'),
	(295,180,2,'2024-08-27 15:50:51'),
	(295,975,1,'2024-08-29 20:54:40'),
	(295,746,1,'2024-08-29 21:04:34'),
	(297,597,1,'2024-09-07 08:01:49'),
	(297,336,1,'2024-09-07 08:07:21'),
	(297,75,1,'2024-09-07 08:13:03'),
	(297,838,2,'2024-09-07 08:18:37'),
	(299,226,1,'2024-09-05 04:01:36'),
	(300,762,2,'2024-09-05 07:17:16');
