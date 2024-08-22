-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- 主機： 127.0.0.1
-- 產生時間： 2024-08-22 00:39:49
-- 伺服器版本： 10.4.32-MariaDB
-- PHP 版本： 8.0.30

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
-- 資料表結構 `course_imgs`
--

CREATE TABLE `course_imgs` (
  `id` int(5) UNSIGNED NOT NULL,
  `course_id` int(5) NOT NULL,
  `path` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- 傾印資料表的資料 `course_imgs`
--

INSERT INTO `course_imgs` (`id`, `course_id`, `path`) VALUES
(1, 1, 'detail_info.jpg'),
(2, 1, 'massage.jpg'),
(3, 2, 'right.jpg'),
(4, 2, 'safe.jpg'),
(5, 2, 'teach1.jpg'),
(6, 3, 'right2.jpg'),
(7, 3, 'safe2.jpg'),
(8, 4, 'safe3.jpg'),
(9, 4, 'tips5.jpg'),
(10, 4, 'touch.jpg'),
(11, 5, 'detail_info.jpg'),
(12, 5, 'safe.jpg'),
(13, 6, 'massage.jpg'),
(14, 6, 'right2.jpg'),
(15, 6, 'safe2.jpg'),
(16, 7, 'safe3.jpg'),
(17, 7, 'teach1.jpg'),
(18, 8, 'tips5.jpg'),
(19, 8, 'touch.jpg'),
(20, 9, 'right.jpg'),
(21, 9, 'safe3.jpg'),
(22, 10, 'detail_info.jpg'),
(23, 10, 'massage.jpg'),
(24, 11, 'right2.jpg'),
(25, 11, 'safe.jpg'),
(26, 11, 'touch.jpg'),
(27, 12, 'teach1.jpg'),
(28, 12, 'safe2.jpg'),
(29, 13, 'safe3.jpg'),
(30, 13, 'tips5.jpg'),
(31, 14, 'detail_info.jpg'),
(32, 14, 'right.jpg'),
(33, 15, 'massage.jpg'),
(34, 15, 'right2.jpg'),
(35, 15, 'teach1.jpg'),
(36, 16, 'safe.jpg'),
(37, 16, 'touch.jpg'),
(38, 17, 'detail_info.jpg'),
(39, 17, 'safe2.jpg'),
(40, 18, 'safe3.jpg'),
(41, 18, 'tips5.jpg'),
(42, 19, 'right.jpg'),
(43, 19, 'teach1.jpg'),
(44, 19, 'safe.jpg'),
(45, 20, 'right2.jpg'),
(46, 20, 'touch.jpg'),
(47, 21, 'detail_info.jpg'),
(48, 21, 'massage.jpg'),
(49, 21, 'safe2.jpg'),
(50, 22, 'safe3.jpg'),
(51, 22, 'right.jpg'),
(52, 23, 'teach1.jpg'),
(53, 23, 'safe.jpg');

--
-- 已傾印資料表的索引
--

--
-- 資料表索引 `course_imgs`
--
ALTER TABLE `course_imgs`
  ADD PRIMARY KEY (`id`);

--
-- 在傾印的資料表使用自動遞增(AUTO_INCREMENT)
--

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `course_imgs`
--
ALTER TABLE `course_imgs`
  MODIFY `id` int(5) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=54;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
