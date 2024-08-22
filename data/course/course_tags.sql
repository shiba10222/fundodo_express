-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- 主機： 127.0.0.1
-- 產生時間： 2024-08-22 00:49:03
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
-- 資料表結構 `course_tags`
--

CREATE TABLE `course_tags` (
  `id` int(5) UNSIGNED NOT NULL,
  `course_id` int(5) UNSIGNED NOT NULL,
  `tag_id` int(5) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- 傾印資料表的資料 `course_tags`
--

INSERT INTO `course_tags` (`id`, `course_id`, `tag_id`) VALUES
(1, 1, 1),
(2, 2, 9),
(3, 3, 9),
(4, 3, 8),
(5, 4, 9),
(6, 4, 8),
(7, 5, 9),
(8, 5, 8),
(9, 6, 3),
(10, 6, 5),
(11, 7, 6),
(12, 7, 9),
(13, 8, 2),
(14, 8, 3),
(15, 8, 6),
(16, 8, 7),
(17, 9, 9),
(18, 10, 6),
(19, 10, 7),
(20, 11, 9),
(21, 12, 6),
(22, 12, 7),
(23, 13, 6),
(24, 13, 7),
(25, 14, 4),
(26, 14, 7),
(27, 15, 4),
(28, 15, 7),
(29, 16, 4),
(30, 16, 7),
(31, 17, 3),
(32, 17, 5),
(33, 17, 7),
(34, 18, 8),
(35, 19, 7),
(36, 20, 2),
(37, 20, 3),
(38, 20, 5),
(39, 21, 2),
(40, 21, 3),
(41, 21, 1),
(42, 22, 8),
(43, 23, 2),
(44, 23, 7),
(45, 1, 2),
(46, 24, 0),
(49, 25, 0);

--
-- 已傾印資料表的索引
--

--
-- 資料表索引 `course_tags`
--
ALTER TABLE `course_tags`
  ADD PRIMARY KEY (`id`);

--
-- 在傾印的資料表使用自動遞增(AUTO_INCREMENT)
--

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `course_tags`
--
ALTER TABLE `course_tags`
  MODIFY `id` int(5) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=50;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
