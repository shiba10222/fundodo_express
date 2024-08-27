-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- 主機： localhost
-- 產生時間： 2024 年 08 月 26 日 07:46
-- 伺服器版本： 10.4.28-MariaDB
-- PHP 版本： 8.1.17

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- 資料庫： `fundodo`
--

-- --------------------------------------------------------

--
-- 資料表結構 `hotel_img`
--

CREATE TABLE `hotel_img` (
  `id` int(7) UNSIGNED NOT NULL,
  `hotel_id` mediumint(6) DEFAULT NULL,
  `path` varchar(15) CHARACTER SET utf8 COLLATE utf8_general_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- 傾印資料表的資料 `hotel_img`
--

INSERT INTO `hotel_img` (`id`, `hotel_id`, `path`) VALUES
(1, 1, 'HT0000011.jpg'),
(2, 1, 'HT0000012.jpg'),
(3, 1, 'HT0000013.jpg'),
(4, 2, 'HT0000021.jpg'),
(5, 2, 'HT0000022.jpg'),
(6, 2, 'HT0000023.jpg'),
(7, 3, 'HT0000031.jpg'),
(8, 3, 'HT0000032.jpg'),
(9, 3, 'HT0000033.jpg'),
(10, 4, 'HT0000041.jpg'),
(11, 4, 'HT0000042.jpg'),
(12, 4, 'HT0000043.jpg'),
(13, 5, 'HT0000051.jpg'),
(14, 5, 'HT0000052.jpg'),
(15, 5, 'HT0000053.jpg'),
(16, 6, 'HT0000061.jpg'),
(17, 6, 'HT0000062.jpg'),
(18, 6, 'HT0000063.jpg'),
(19, 7, 'HT0000071.jpg'),
(20, 7, 'HT0000072.jpg'),
(21, 7, 'HT0000073.jpg'),
(22, 8, 'HT0000081.jpg'),
(23, 8, 'HT0000082.jpg'),
(24, 8, 'HT0000083.jpg'),
(25, 9, 'HT0000091.jpg'),
(26, 9, 'HT0000092.jpg'),
(27, 9, 'HT0000093.jpg'),
(28, 10, 'HT0000101.jpg'),
(29, 10, 'HT0000102.jpg'),
(30, 10, 'HT0000103.jpg'),
(31, 11, 'HT0000111.jpg'),
(32, 11, 'HT0000112.jpg'),
(33, 11, 'HT0000113.jpg'),
(34, 12, 'HT0000121.jpg'),
(35, 12, 'HT0000122.jpg'),
(36, 12, 'HT0000123.jpg'),
(37, 13, 'HT0000131.jpg'),
(38, 13, 'HT0000132.jpg'),
(39, 13, 'HT0000133.jpg'),
(40, 14, 'HT0000141.jpg'),
(41, 14, 'HT0000142.jpg'),
(42, 14, 'HT0000143.jpg'),
(43, 15, 'HT0000151.jpg'),
(44, 15, 'HT0000152.jpg'),
(45, 15, 'HT0000153.jpg'),
(46, 16, 'HT0000161.jpg'),
(47, 16, 'HT0000162.jpg'),
(48, 16, 'HT0000163.jpg'),
(49, 17, 'HT0000171.jpg'),
(50, 17, 'HT0000172.jpg'),
(51, 17, 'HT0000173.jpg'),
(52, 18, 'HT0000181.jpg'),
(53, 18, 'HT0000182.jpg'),
(54, 18, 'HT0000183.jpg'),
(55, 19, 'HT0000191.jpg'),
(56, 19, 'HT0000192.jpg'),
(57, 19, 'HT0000193.jpg'),
(58, 20, 'HT0000201.jpg'),
(59, 20, 'HT0000202.jpg'),
(60, 20, 'HT0000203.jpg'),
(61, 21, 'HT0000211.jpg'),
(62, 21, 'HT0000212.jpg'),
(63, 21, 'HT0000213.jpg'),
(64, 22, 'HT0000221.jpg'),
(65, 22, 'HT0000222.jpg'),
(66, 22, 'HT0000223.jpg'),
(67, 23, 'HT0000231.jpg'),
(68, 23, 'HT0000232.jpg'),
(69, 23, 'HT0000233.jpg'),
(70, 24, 'HT0000241.jpg'),
(71, 24, 'HT0000242.jpg'),
(72, 24, 'HT0000243.jpg'),
(73, 25, 'HT0000251.jpg'),
(74, 25, 'HT0000252.jpg'),
(75, 25, 'HT0000253.jpg'),
(76, 26, 'HT0000261.jpg'),
(77, 26, 'HT0000262.jpg'),
(78, 26, 'HT0000263.jpg'),
(79, 27, 'HT0000271.jpg'),
(80, 27, 'HT0000272.jpg'),
(81, 27, 'HT0000273.jpg'),
(82, 28, 'HT0000281.jpg'),
(83, 28, 'HT0000282.jpg'),
(84, 28, 'HT0000283.jpg'),
(85, 29, 'HT0000291.jpg'),
(86, 29, 'HT0000292.jpg'),
(87, 29, 'HT0000293.jpg'),
(88, 30, 'HT0000301.jpg'),
(89, 30, 'HT0000302.jpg'),
(90, 30, 'HT0000303.jpg'),
(91, 31, 'HT0000311.jpg'),
(92, 31, 'HT0000312.jpg'),
(93, 31, 'HT0000313.jpg'),
(94, 32, 'HT0000321.jpg'),
(95, 32, 'HT0000322.jpg'),
(96, 32, 'HT0000323.jpg');

--
-- 已傾印資料表的索引
--

--
-- 資料表索引 `hotel_img`
--
ALTER TABLE `hotel_img`
  ADD PRIMARY KEY (`id`);

--
-- 在傾印的資料表使用自動遞增(AUTO_INCREMENT)
--

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `hotel_img`
--
ALTER TABLE `hotel_img`
  MODIFY `id` int(7) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=97;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
