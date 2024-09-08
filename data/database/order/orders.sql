-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- 主機： 127.0.0.1
-- 產生時間： 2024-08-30 11:48:04
-- 伺服器版本： 10.4.32-MariaDB
-- PHP 版本： 8.2.20

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+08:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- 資料庫： `fundodo`
--

-- --------------------------------------------------------

--
-- 資料表結構 `orders`
--

CREATE TABLE `orders` (
  `id` bigint(13) UNSIGNED NOT NULL,
  `user_id` int(7) UNSIGNED NOT NULL,
  `amount` mediumint(6) UNSIGNED NOT NULL COMMENT '已結算之總金額，並計入運費、優惠券',
  `addressee` varchar(10) NOT NULL COMMENT '收件人姓名',
  `tel` varchar(30) DEFAULT NULL COMMENT '收件人聯絡電話',
  `email` varchar(50) DEFAULT NULL COMMENT '收件人聯絡信箱',
  `ship_thru` varchar(3) NOT NULL COMMENT '宅配 | DLV ; 超商 | CVS',
  `pay_thru` varchar(10) NOT NULL COMMENT 'EC, LINE',
  `ship_zipcode` smallint(3) NOT NULL COMMENT '郵遞區號',
  `ship_address` varchar(100) NOT NULL COMMENT '完整地址',
  `ship_ps` varchar(100) DEFAULT NULL,
  `created_at` datetime NOT NULL,
  `deleted_at` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- 傾印資料表的資料 `orders`
--

INSERT INTO `orders` (`id`, `user_id`, `amount`, `addressee`, `tel`, `email`, `ship_thru`, `pay_thru`, `ship_zipcode`, `ship_address`, `ship_ps`, `created_at`, `deleted_at`) VALUES
(1, 210, 18102, '', NULL, NULL, 'DLV', '', 300, '新竹市新安路44號', NULL, '2024-08-29 14:35:09', NULL),
(2, 62, 29581, '', NULL, NULL, 'DLV', '', 300, '新竹市金山十五街59號3樓之18', NULL, '2024-08-29 14:49:28', NULL),
(3, 62, 29581, '', NULL, NULL, 'DLV', '', 300, '新竹市金山十五街59號3樓之18', NULL, '2024-08-29 14:51:22', NULL),
(4, 62, 29581, '', NULL, NULL, 'DLV', '', 300, '新竹市金山十五街59號3樓之18', NULL, '2024-08-29 14:56:53', NULL),
(5, 112, 2720, '', NULL, NULL, 'DLV', '', 702, '台南市南區福吉四街90號', NULL, '2024-08-29 15:03:29', NULL),
(6, 190, 22054, '', NULL, NULL, 'DLV', '', 973, '花蓮縣吉安鄉建國路２段54號', NULL, '2024-08-29 15:09:29', NULL),
(7, 191, 4461, '', NULL, NULL, 'DLV', '', 733, '台南市東山區瓦厝子21號之16', NULL, '2024-08-29 15:24:39', NULL),
(8, 191, 4461, '', NULL, NULL, 'DLV', '', 733, '台南市東山區瓦厝子21號之16', NULL, '2024-08-29 15:26:06', NULL),
(9, 228, 25379, '', NULL, NULL, 'DLV', '', 338, '桃園市蘆竹鄉南華一街48號9樓', NULL, '2024-08-29 16:05:22', NULL),
(10, 228, 25379, '', NULL, NULL, 'DLV', '', 338, '桃園市蘆竹鄉南華一街48號9樓', NULL, '2024-08-29 16:06:05', NULL),
(11, 237, 8276, '', NULL, NULL, 'DLV', '', 940, '屏東縣枋寮鄉玉泉路82號', NULL, '2024-08-29 16:08:54', NULL),
(12, 238, 4915, '', NULL, NULL, 'DLV', '', 600, '嘉義市fffff', NULL, '2024-08-29 16:21:36', NULL),
(13, 238, 4915, '', NULL, NULL, 'DLV', '', 600, '嘉義市fffff', NULL, '2024-08-29 16:22:06', NULL),
(14, 239, 3394, '', NULL, NULL, 'DLV', '', 439, '台中市大安區中山南路25號10樓', NULL, '2024-08-29 16:23:51', NULL),
(15, 237, 341, '', NULL, NULL, 'DLV', '', 720, '台南市官田區後潭路35號之15', NULL, '2024-08-29 16:27:22', NULL),
(16, 128, 19359, '', NULL, NULL, 'DLV', '', 338, '桃園市蘆竹鄉海山中街79號', '警衛代收', '2024-08-30 15:02:45', NULL),
(17, 128, 640, '葉聖蓓', '0963391906', 'lakshmi2412@gmail.com', 'DLV', '0', 338, '桃園市蘆竹鄉海山中街79號', '警衛代收', '2024-08-30 15:29:40', NULL),
(18, 128, 620, '葉聖蓓', '0963391906', 'lakshmi2412@gmail.com', 'DLV', '0', 338, '桃園市蘆竹鄉海山中街79號', '警衛代收', '2024-08-30 15:41:00', NULL);

--
-- 已傾印資料表的索引
--

--
-- 資料表索引 `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`);

--
-- 在傾印的資料表使用自動遞增(AUTO_INCREMENT)
--

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `orders`
--
ALTER TABLE `orders`
  MODIFY `id` bigint(13) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
