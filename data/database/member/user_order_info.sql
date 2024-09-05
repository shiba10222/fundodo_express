-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- 主機： 127.0.0.1
-- 產生時間： 2024-08-30 04:05:54
-- 伺服器版本： 10.4.32-MariaDB
-- PHP 版本： 8.2.20

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
-- 資料表結構 `user_order_info`
--

CREATE TABLE `user_order_info` (
  `id` int(7) NOT NULL,
  `user_id` int(7) NOT NULL,
  `name` varchar(10) NOT NULL,
  `email` varchar(30) NOT NULL,
  `tel` varchar(20) NOT NULL,
  `city_id` tinyint(2) NOT NULL,
  `zipcode` smallint(3) NOT NULL,
  `order_address` varchar(50) NOT NULL,
  `ps` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- 傾印資料表的資料 `user_order_info`
--

INSERT INTO `user_order_info` (`id`, `user_id`, `name`, `email`, `tel`, `city_id`, `zipcode`, `order_address`, `ps`) VALUES
(13, 111, '徐勳善', 'duncan639@hotmail.com', '0972654130', 14, 710, '復華六街40號之4', '請上午送，謝謝'),
(15, 211, '卓悦晶', 'hillary6941@gmail.com', '0925230026', 18, 972, '富世76號之18', '謝謝送貨大哥'),
(16, 211, '卓悦晶', 'hillary6941@gmail.com', '0925230026', 18, 972, '富世76號之18', '謝謝送貨大哥'),
(17, 210, '戴利晏', 'gunter4552@gmail.com', '0963104462', 5, 300, '新安路44號', '由管理員代收'),
(18, 210, '戴利晏', 'gunter4552@gmail.com', '0963104462', 5, 300, '新安路44號', '由管理員代收'),
(19, 62, '黃泓煒', 'walton9811@gmail.com', '0953034560', 5, 300, '金山十五街59號3樓之18', '下午才有人收貨'),
(20, 112, '唐冉升', 'burton6934@yahoo.com', '0918401940', 14, 702, '福吉四街90號', '白天都有人收'),
(21, 190, '嚴威育', 'stefan8000@gmail.com', '0927907358', 18, 973, '建國路２段54號', '白天都有人收'),
(22, 191, '李宛蓓', 'carey1378@gmail.com', '0952349332', 14, 733, '瓦厝子21號之16', '下午送才有人'),
(23, 228, '朱夕娜', 'jimenez3248@gmail.com', '0988013085', 4, 338, '南華一街48號9樓', '南華一街48號9樓'),
(24, 237, '彭凰潮', 'roy1124@outlook.com', '0986586716', 16, 940, '玉泉路82號', '上午沒有人，下午才能送'),
(26, 239, '鄧懿晴', 'samantha4340@gmail.com', '0915502876', 8, 439, '中山南路25號10樓', '中山南路25號10樓'),
(27, 237, '林建翊', 'stacie2316@gmail.com', '0922661907', 14, 720, '後潭路35號之15', NULL),
(28, 164, '范禎蒨', 'spielberg3056@outlook.com', '0956296378', 15, 842, '志華巷79號', '希望盡快出貨，謝謝'),
(42, 163, '張嘉常', 'mike8845@gmail.com', '0924540888', 1, 103, '民權西路80號之13', '請管理員代收'),
(43, 163, '張嘉常', 'mike8845@gmail.com', '0924540888', 1, 103, '民權西路80號之13', '請管理員代收'),
(46, 165, '林美舒', 'shields6629@gmail.com', '0988712155', 16, 913, '上利路63號', ''),
(47, 165, '林美舒', 'shields6629@gmail.com', '0988712155', 16, 913, '上利路63號', '');

--
-- 已傾印資料表的索引
--

--
-- 資料表索引 `user_order_info`
--
ALTER TABLE `user_order_info`
  ADD PRIMARY KEY (`id`);

--
-- 在傾印的資料表使用自動遞增(AUTO_INCREMENT)
--

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `user_order_info`
--
ALTER TABLE `user_order_info`
  MODIFY `id` int(7) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=48;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
