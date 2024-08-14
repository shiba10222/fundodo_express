-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- 主機： 127.0.0.1
-- 產生時間： 2024-08-14 16:12:26
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
-- 資料表結構 `course_chapters`
--

CREATE TABLE `course_chapters` (
  `id` int(5) UNSIGNED NOT NULL,
  `course_id` int(5) NOT NULL,
  `name` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- 傾印資料表的資料 `course_chapters`
--

INSERT INTO `course_chapters` (`id`, `course_id`, `name`) VALUES
(1, 1, '建立與狗狗的良好互動'),
(2, 1, '增進遊戲中的互動'),
(3, 2, '狗狗教養的基本概念'),
(4, 2, '實作教養技巧'),
(5, 3, '吃飯啃咬的行為分析'),
(6, 3, '改善狗狗的飲食習慣'),
(7, 4, '洗澡和美容的準備'),
(8, 4, '美容過程中的安全考量'),
(9, 5, '看醫生前的準備'),
(10, 5, '診療過程中的應對'),
(11, 6, '玩具使用的正確方式'),
(12, 6, '狗狗的食物及玩具管理'),
(13, 7, '高階訓練的準備工作'),
(14, 7, '進階訓練技術'),
(15, 8, '狗狗需求的基本介紹'),
(16, 8, '滿足狗狗需求的方法'),
(17, 9, '初階訓練的基礎'),
(18, 9, '訓練的實戰應用'),
(19, 10, '狗狗吠叫的原因'),
(20, 10, '如何有效應對吠叫'),
(21, 11, '中階訓練的準備'),
(22, 11, '中階訓練技術'),
(23, 12, '肢體語言的觀察技巧'),
(24, 12, '肢體語言的解析'),
(25, 13, '壓力來源分析'),
(26, 13, '壓力應對策略'),
(27, 14, '狗狗社交行為的觀察'),
(28, 14, '狗狗社交行為的分析'),
(29, 15, '社交行為的應對策略'),
(30, 15, '建立良好的社交習慣'),
(31, 16, '完整社交行為解析'),
(32, 16, '社交行為的應對策略'),
(33, 17, '嗅聞遊戲的設計'),
(34, 17, '嗅聞遊戲的應用'),
(35, 18, '穩定狗狗的專注力'),
(36, 18, '專注力訓練的技巧'),
(37, 19, '青少年狗行為的理解'),
(38, 19, '青少年狗行為的管理'),
(39, 20, '教導狗兒玩玩具'),
(40, 20, '如何提升狗兒拾回能力'),
(41, 21, '戶外遊戲的設計與實施'),
(42, 21, 'STAY及召回指令的訓練'),
(43, 22, '帶狗出國的準備工作'),
(44, 22, '出國中的狗狗照護'),
(45, 23, '理念與實踐'),
(46, 23, '理念的延伸與擴展');

--
-- 已傾印資料表的索引
--

--
-- 資料表索引 `course_chapters`
--
ALTER TABLE `course_chapters`
  ADD PRIMARY KEY (`id`);

--
-- 在傾印的資料表使用自動遞增(AUTO_INCREMENT)
--

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `course_chapters`
--
ALTER TABLE `course_chapters`
  MODIFY `id` int(5) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=47;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
