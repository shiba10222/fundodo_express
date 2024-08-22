-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- 主機： 127.0.0.1
-- 產生時間： 2024-08-22 00:48:35
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
-- 資料表結構 `course_lessons`
--

CREATE TABLE `course_lessons` (
  `id` int(5) UNSIGNED NOT NULL,
  `chapter_id` int(5) NOT NULL,
  `name` varchar(50) NOT NULL,
  `duration` varchar(5) NOT NULL,
  `video_path` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- 傾印資料表的資料 `course_lessons`
--

INSERT INTO `course_lessons` (`id`, `chapter_id`, `name`, `duration`, `video_path`) VALUES
(1, 1, '建立良好的互動模式', '16', 'training1.mp4'),
(2, 1, '理解狗狗的行為', '13', 'training3.mp4'),
(3, 1, '與狗狗的互動遊戲', '19', 'training2.mp4'),
(4, 2, '選擇合適的遊戲', '16', 'training1.mp4'),
(5, 2, '遊戲中增進互動', '12', 'training3.mp4'),
(6, 2, '使用玩具進行互動', '14', 'training2.mp4'),
(7, 3, '正向教養的基礎', '12', 'training2.mp4'),
(8, 3, '狗狗行為分析', '20', 'training3.mp4'),
(9, 3, '改善狗狗行為', '20', 'training4.mp4'),
(10, 4, '實作教養技巧介紹', '11', 'training1.mp4'),
(11, 4, '實際操作演練', '17', 'training3.mp4'),
(12, 4, '應對常見行為問題', '12', 'training4.mp4'),
(13, 5, '行為觀察與分析', '19', 'training3.mp4'),
(14, 5, '改善飲食習慣', '16', 'training4.mp4'),
(15, 5, '進食中的注意事項', '16', 'training2.mp4'),
(16, 6, '洗澡的準備工作', '20', 'training2.mp4'),
(17, 6, '美容前的準備', '12', 'training3.mp4'),
(18, 6, '選擇合適的美容工具', '10', 'training2.mp4'),
(19, 7, '美容過程中的安全', '15', 'training2.mp4'),
(20, 7, '應對美容中的突發狀況', '12', 'training3.mp4'),
(21, 7, '美容後的護理', '20', 'training2.mp4'),
(22, 8, '看醫生前的準備工作', '10', 'training2.mp4'),
(23, 8, '如何讓狗狗適應診療', '14', 'training3.mp4'),
(24, 8, '診療過程中的注意事項', '19', 'training1.mp4'),
(25, 9, '診療過程中的應對策略', '10', 'training2.mp4'),
(26, 9, '診療後的護理措施', '16', 'training2.mp4'),
(27, 9, '看醫生的注意事項', '18', 'training4.mp4'),
(28, 10, '玩具選擇與使用', '13', 'training2.mp4'),
(29, 10, '狗狗的食物管理', '10', 'training2.mp4'),
(30, 10, '玩具與食物的安全管理', '12', 'training3.mp4'),
(31, 11, '高階訓練前的準備', '10', 'training3.mp4'),
(32, 11, '高階訓練技術的介紹', '17', 'training2.mp4'),
(33, 11, '進階技術的實踐應用', '14', 'training2.mp4'),
(34, 12, '狗狗需求的認識', '17', 'training3.mp4'),
(35, 12, '滿足狗狗需求的方法', '12', 'training4.mp4'),
(36, 12, '提升狗狗的安全感', '10', 'training2.mp4'),
(37, 13, '初階訓練的基礎概念', '15', 'training3.mp4'),
(38, 13, '初階訓練的實戰演練', '13', 'training1.mp4'),
(39, 13, '訓練中的常見問題', '13', 'training2.mp4'),
(40, 14, '狗狗吠叫的原因分析', '16', 'training3.mp4'),
(41, 14, '吠叫行為的觀察', '10', 'training3.mp4'),
(42, 14, '如何有效應對吠叫', '14', 'training2.mp4'),
(43, 15, '中階訓練前的準備', '20', 'training2.mp4'),
(44, 15, '中階訓練技術的介紹', '14', 'training2.mp4'),
(45, 15, '中階技術的實踐應用', '14', 'training4.mp4'),
(46, 16, '狗狗肢體語言的觀察', '19', 'training3.mp4'),
(47, 16, '肢體語言的解析', '19', 'training3.mp4'),
(48, 16, '如何理解肢體語言', '17', 'training2.mp4'),
(49, 17, '壓力來源的認識', '10', 'training3.mp4'),
(50, 17, '壓力應對策略的介紹', '12', 'training3.mp4'),
(51, 17, '壓力管理技巧的應用', '20', 'training3.mp4'),
(52, 18, '狗狗社交行為的觀察', '10', 'training4.mp4'),
(53, 18, '社交行為的解析', '12', 'training4.mp4'),
(54, 18, '建立良好的社交習慣', '11', 'training4.mp4'),
(55, 19, '狗狗社交行為的應對', '11', 'training1.mp4'),
(56, 19, '社交行為的管理技巧', '12', 'training1.mp4'),
(57, 19, '如何提升狗狗的社交能力', '19', 'training3.mp4'),
(58, 20, '社交行為的全面解析', '14', 'training1.mp4'),
(59, 20, '建立良好的社交習慣', '16', 'training2.mp4'),
(60, 20, '如何應對社交中的挑戰', '19', 'training2.mp4'),
(61, 21, '嗅聞遊戲的設計介紹', '13', 'training2.mp4'),
(62, 21, '嗅聞遊戲的實踐應用', '12', 'training3.mp4'),
(63, 21, '如何增強嗅聞能力', '20', 'training1.mp4'),
(64, 22, '專注力訓練的準備', '12', 'training1.mp4'),
(65, 22, '專注力訓練的技術介紹', '13', 'training2.mp4'),
(66, 22, '實戰中的專注力訓練', '18', 'training3.mp4'),
(67, 23, '理解青少年狗行為', '10', 'training2.mp4'),
(68, 23, '青少年狗行為的應對', '17', 'training1.mp4'),
(69, 23, '青少年狗行為的管理技巧', '15', 'training4.mp4'),
(70, 24, '教導狗狗玩玩具的方法', '14', 'training4.mp4'),
(71, 24, '提升狗狗的拾回能力', '17', 'training3.mp4'),
(72, 24, '玩具與拾回行為的管理', '11', 'training3.mp4'),
(73, 25, '戶外遊戲設計與實施', '16', 'training3.mp4'),
(74, 25, '增強遊戲中的互動', '18', 'training2.mp4'),
(75, 25, '使用遊戲來增強訓練', '18', 'training3.mp4'),
(76, 26, 'STAY指令的教學方法', '17', 'training1.mp4'),
(77, 26, '召回指令的訓練步驟', '11', 'training4.mp4'),
(78, 26, 'STAY與召回的鞏固', '17', 'training2.mp4'),
(79, 27, '出國準備工作介紹', '10', 'training2.mp4'),
(80, 27, '狗狗健康檢查與準備', '20', 'training2.mp4'),
(81, 27, '國外環境適應技巧', '19', 'training1.mp4'),
(82, 28, '出國中的狗狗照護', '12', 'training3.mp4'),
(83, 28, '旅途中的舒適保持', '17', 'training2.mp4'),
(84, 28, '回國後的調適與復原', '19', 'training2.mp4'),
(85, 29, 'Plenty in Life is Free 核心理念', '20', 'training3.mp4'),
(86, 29, '如何實踐無條件的生活方式', '15', 'training3.mp4'),
(87, 29, '日常生活中的應用', '16', 'training4.mp4'),
(88, 30, '理念的延伸與擴展', '12', 'training2.mp4'),
(89, 30, '引導狗狗探索新行為', '15', 'training2.mp4'),
(90, 30, '穩定性的鞏固與挑戰', '18', 'training2.mp4'),
(91, 31, '社交行為的基本原理', '15', 'training3.mp4'),
(92, 31, '狗狗社交信號的解讀', '18', 'training4.mp4'),
(93, 31, '不同品種的社交特點', '20', 'training3.mp4'),
(94, 32, '處理社交衝突的技巧', '16', 'training3.mp4'),
(95, 32, '增進狗狗社交能力的方法', '14', 'training2.mp4'),
(96, 32, '安全社交環境的創建', '17', 'training4.mp4'),
(97, 33, '嗅聞遊戲的基本原則', '12', 'training3.mp4'),
(98, 33, '室內嗅聞遊戲設計', '15', 'training2.mp4'),
(99, 33, '戶外嗅聞活動規劃', '18', 'training1.mp4'),
(100, 34, '嗅聞遊戲在訓練中的應用', '14', 'training3.mp4'),
(101, 34, '使用嗅聞遊戲緩解壓力', '16', 'training1.mp4'),
(102, 34, '高級嗅聞遊戲技巧', '20', 'training4.mp4'),
(103, 35, '理解狗狗注意力機制', '13', 'training3.mp4'),
(104, 35, '提高專注力的基礎訓練', '15', 'training2.mp4'),
(105, 35, '分心環境中的專注力練習', '18', 'training3.mp4'),
(106, 36, '長時間專注力的培養', '17', 'training2.mp4'),
(107, 36, '多重任務中的專注訓練', '19', 'training4.mp4'),
(108, 36, '專注力與服從性的結合', '16', 'training1.mp4'),
(109, 37, '青少年期狗狗的心理特點', '14', 'training3.mp4'),
(110, 37, '常見的青少年狗行為問題', '16', 'training2.mp4'),
(111, 37, '青少年狗的生理變化', '15', 'training1.mp4'),
(112, 38, '適應青少年狗的訓練方法', '18', 'training4.mp4'),
(113, 38, '管理青少年狗的過度能量', '15', 'training3.mp4'),
(114, 38, '建立青少年狗的自信心', '17', 'training2.mp4'),
(115, 39, '選擇適合的玩具', '12', 'training1.mp4'),
(116, 39, '介紹新玩具的方法', '14', 'training4.mp4'),
(117, 39, '互動性玩具的使用技巧', '16', 'training3.mp4'),
(118, 40, '拾回訓練的基礎', '15', 'training2.mp4'),
(119, 40, '增加拾回難度的方法', '18', 'training4.mp4'),
(120, 40, '實際場景中的拾回練習', '20', 'training1.mp4'),
(121, 41, '安全的戶外遊戲環境', '13', 'training3.mp4'),
(122, 41, '團體戶外遊戲的組織', '16', 'training2.mp4'),
(123, 41, '季節性戶外活動規劃', '15', 'training1.mp4'),
(124, 42, 'STAY指令的基礎訓練', '14', 'training4.mp4'),
(125, 42, '遠距離和長時間的STAY', '17', 'training3.mp4'),
(126, 42, '高干擾環境中的召回訓練', '19', 'training2.mp4'),
(127, 43, '必要的疫苗和健康檢查', '15', 'training1.mp4'),
(128, 43, '國際旅行所需文件', '18', 'training4.mp4'),
(129, 43, '為長途旅行做準備', '16', 'training3.mp4'),
(130, 44, '機場和飛機上的狗狗護理', '17', 'training2.mp4'),
(131, 44, '應對時差和環境變化', '15', 'training1.mp4'),
(132, 44, '國外緊急情況的處理', '19', 'training4.mp4'),
(133, 45, 'Plenty in Life is Free的核心理念', '16', 'training3.mp4'),
(134, 45, '日常生活中的應用實例', '18', 'training2.mp4'),
(135, 45, '克服實踐中的挑戰', '15', 'training1.mp4'),
(136, 46, '將理念應用於複雜行為問題', '20', 'training4.mp4'),
(137, 46, '創新訓練方法的開發', '17', 'training3.mp4'),
(138, 46, '社區中推廣正向教養理念', '19', 'training2.mp4');

--
-- 已傾印資料表的索引
--

--
-- 資料表索引 `course_lessons`
--
ALTER TABLE `course_lessons`
  ADD PRIMARY KEY (`id`);

--
-- 在傾印的資料表使用自動遞增(AUTO_INCREMENT)
--

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `course_lessons`
--
ALTER TABLE `course_lessons`
  MODIFY `id` int(5) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=139;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
