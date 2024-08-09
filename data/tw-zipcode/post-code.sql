-- 組合名稱： 台灣郵遞區號
-- 簡介： 台灣北中南東區域表、縣市表、郵遞區號表
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
-- 資料庫： `temporary`
--

-- --------------------------------------------------------

--
-- 資料表結構 `tw_areas`
--

CREATE TABLE `tw_areas` (
  `id` tinyint(1) UNSIGNED NOT NULL,
  `name` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- 傾印資料表的資料 `tw_areas`
--

INSERT INTO `tw_areas` (`id`, `name`) VALUES
(1, '北部區域'),
(2, '中部區域'),
(3, '南部區域'),
(4, '東部區域'),
(5, '金馬區域');

-- --------------------------------------------------------

--
-- 資料表結構 `tw_citys`
--

CREATE TABLE `tw_citys` (
  `id` tinyint(2) UNSIGNED NOT NULL,
  `name` varchar(8) NOT NULL,
  `area_id` tinyint(1) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- 傾印資料表的資料 `tw_citys`
--

INSERT INTO `tw_citys` (`id`, `name`, `area_id`) VALUES
(1, '台北市', 1),
(2, '新北市', 1),
(3, '基隆市', 1),
(4, '桃園市', 1),
(5, '新竹市', 1),
(6, '新竹縣', 1),
(7, '苗栗縣', 2),
(8, '台中市', 2),
(9, '彰化縣', 2),
(10, '南投縣', 2),
(11, '嘉義市', 3),
(12, '嘉義縣', 3),
(13, '雲林縣', 2),
(14, '台南市', 3),
(15, '高雄市', 3),
(16, '屏東縣', 3),
(17, '宜蘭縣', 1),
(18, '花蓮縣', 4),
(19, '台東縣', 4),
(20, '澎湖縣', 3),
(21, '金門縣', 5),
(22, '連江縣', 5);

-- --------------------------------------------------------

--
-- 資料表結構 `tw_dist`
--

CREATE TABLE `tw_dist` (
  `id` smallint(3) UNSIGNED NOT NULL,
  `name` varchar(14) NOT NULL,
  `zipcode` smallint(3) UNSIGNED NOT NULL,
  `area_id` tinyint(1) UNSIGNED NOT NULL,
  `city_id` tinyint(2) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- 傾印資料表的資料 `tw_dist`
--

INSERT INTO `tw_dist` (`id`, `name`, `zipcode`, `area_id`, `city_id`) VALUES
(1, '中正區', 100, 1, 1),
(2, '大同區', 103, 1, 1),
(3, '中山區', 104, 1, 1),
(4, '松山區', 105, 1, 1),
(5, '大安區', 106, 1, 1),
(6, '萬華區', 108, 1, 1),
(7, '信義區', 110, 1, 1),
(8, '士林區', 111, 1, 1),
(9, '北投區', 112, 1, 1),
(10, '內湖區', 114, 1, 1),
(11, '南港區', 115, 1, 1),
(12, '文山區', 116, 1, 1),
(13, '仁愛區', 200, 1, 3),
(14, '信義區', 201, 1, 3),
(15, '中正區', 202, 1, 3),
(16, '中山區', 203, 1, 3),
(17, '安樂區', 204, 1, 3),
(18, '暖暖區', 205, 1, 3),
(19, '七堵區', 206, 1, 3),
(20, '萬里區', 207, 1, 2),
(21, '金山區', 208, 1, 2),
(22, '板橋區', 220, 1, 2),
(23, '汐止區', 221, 1, 2),
(24, '深坑區', 222, 1, 2),
(25, '石碇區', 223, 1, 2),
(26, '瑞芳區', 224, 1, 2),
(27, '平溪區', 226, 1, 2),
(28, '雙溪區', 227, 1, 2),
(29, '貢寮區', 228, 1, 2),
(30, '新店區', 231, 1, 2),
(31, '坪林區', 232, 1, 2),
(32, '烏來區', 233, 1, 2),
(33, '永和區', 234, 1, 2),
(34, '中和區', 235, 1, 2),
(35, '土城區', 236, 1, 2),
(36, '三峽區', 237, 1, 2),
(37, '樹林區', 238, 1, 2),
(38, '鶯歌區', 239, 1, 2),
(39, '三重區', 241, 1, 2),
(40, '新莊區', 242, 1, 2),
(41, '泰山區', 243, 1, 2),
(42, '林口區', 244, 1, 2),
(43, '蘆洲區', 247, 1, 2),
(44, '五股區', 248, 1, 2),
(45, '八里區', 249, 1, 2),
(46, '淡水區', 251, 1, 2),
(47, '三芝區', 252, 1, 2),
(48, '石門區', 253, 1, 2),
(49, '宜蘭市', 260, 1, 17),
(50, '頭城鎮', 261, 1, 17),
(51, '礁溪鄉', 262, 1, 17),
(52, '壯圍鄉', 263, 1, 17),
(53, '員山鄉', 264, 1, 17),
(54, '羅東鎮', 265, 1, 17),
(55, '三星鄉', 266, 1, 17),
(56, '大同鄉', 267, 1, 17),
(57, '五結鄉', 268, 1, 17),
(58, '冬山鄉', 269, 1, 17),
(59, '蘇澳鎮', 270, 1, 17),
(60, '南澳鄉', 272, 1, 17),
(61, '釣魚台列嶼', 290, 1, 17),
(62, '（全市共用）', 300, 1, 5),
(63, '竹北市', 302, 1, 6),
(64, '湖口鄉', 303, 1, 6),
(65, '新豐鄉', 304, 1, 6),
(66, '新埔鎮', 305, 1, 6),
(67, '關西鎮', 306, 1, 6),
(68, '芎林鄉', 307, 1, 6),
(69, '寶山鄉', 308, 1, 6),
(70, '竹東鎮', 310, 1, 6),
(71, '五峰鄉', 311, 1, 6),
(72, '橫山鄉', 312, 1, 6),
(73, '尖石鄉', 313, 1, 6),
(74, '北埔鄉', 314, 1, 6),
(75, '峨眉鄉', 315, 1, 6),
(76, '中壢市', 320, 1, 4),
(77, '平鎮市', 324, 1, 4),
(78, '龍潭鄉', 325, 1, 4),
(79, '楊梅市', 326, 1, 4),
(80, '新屋鄉', 327, 1, 4),
(81, '觀音鄉', 328, 1, 4),
(82, '桃園市', 330, 1, 4),
(83, '龜山鄉', 333, 1, 4),
(84, '八德市', 334, 1, 4),
(85, '大溪鎮', 335, 1, 4),
(86, '復興鄉', 336, 1, 4),
(87, '大園鄉', 337, 1, 4),
(88, '蘆竹鄉', 338, 1, 4),
(89, '竹南鎮', 350, 2, 7),
(90, '頭份鎮', 351, 2, 7),
(91, '三灣鄉', 352, 2, 7),
(92, '南庄鄉', 353, 2, 7),
(93, '獅潭鄉', 354, 2, 7),
(94, '後龍鎮', 356, 2, 7),
(95, '通霄鎮', 357, 2, 7),
(96, '苑裡鎮', 358, 2, 7),
(97, '苗栗市', 360, 2, 7),
(98, '造橋鄉', 361, 2, 7),
(99, '頭屋鄉', 362, 2, 7),
(100, '公館鄉', 363, 2, 7),
(101, '大湖鄉', 364, 2, 7),
(102, '泰安鄉', 365, 2, 7),
(103, '銅鑼鄉', 366, 2, 7),
(104, '三義鄉', 367, 2, 7),
(105, '西湖鄉', 368, 2, 7),
(106, '卓蘭鎮', 369, 2, 7),
(107, '中區', 400, 2, 8),
(108, '東區', 401, 2, 8),
(109, '南區', 402, 2, 8),
(110, '西區', 403, 2, 8),
(111, '北區', 404, 2, 8),
(112, '北屯區', 406, 2, 8),
(113, '西屯區', 407, 2, 8),
(114, '南屯區', 408, 2, 8),
(115, '太平區', 411, 2, 8),
(116, '大里區', 412, 2, 8),
(117, '霧峰區', 413, 2, 8),
(118, '烏日區', 414, 2, 8),
(119, '豐原區', 420, 2, 8),
(120, '后里區', 421, 2, 8),
(121, '石岡區', 422, 2, 8),
(122, '東勢區', 423, 2, 8),
(123, '和平區', 424, 2, 8),
(124, '新社區', 426, 2, 8),
(125, '潭子區', 427, 2, 8),
(126, '大雅區', 428, 2, 8),
(127, '神岡區', 429, 2, 8),
(128, '大肚區', 432, 2, 8),
(129, '沙鹿區', 433, 2, 8),
(130, '龍井區', 434, 2, 8),
(131, '梧棲區', 435, 2, 8),
(132, '清水區', 436, 2, 8),
(133, '大甲區', 437, 2, 8),
(134, '外埔區', 438, 2, 8),
(135, '大安區', 439, 2, 8),
(136, '彰化市', 500, 2, 9),
(137, '芬園鄉', 502, 2, 9),
(138, '花壇鄉', 503, 2, 9),
(139, '秀水鄉', 504, 2, 9),
(140, '鹿港鎮', 505, 2, 9),
(141, '福興鄉', 506, 2, 9),
(142, '線西鄉', 507, 2, 9),
(143, '和美鎮', 508, 2, 9),
(144, '伸港鄉', 509, 2, 9),
(145, '員林鎮', 510, 2, 9),
(146, '社頭鄉', 511, 2, 9),
(147, '永靖鄉', 512, 2, 9),
(148, '埔心鄉', 513, 2, 9),
(149, '溪湖鎮', 514, 2, 9),
(150, '大村鄉', 515, 2, 9),
(151, '埔鹽鄉', 516, 2, 9),
(152, '田中鎮', 520, 2, 9),
(153, '北斗鎮', 521, 2, 9),
(154, '田尾鄉', 522, 2, 9),
(155, '埤頭鄉', 523, 2, 9),
(156, '溪州鄉', 524, 2, 9),
(157, '竹塘鄉', 525, 2, 9),
(158, '二林鎮', 526, 2, 9),
(159, '大城鄉', 527, 2, 9),
(160, '芳苑鄉', 528, 2, 9),
(161, '二水鄉', 530, 2, 9),
(162, '南投市', 540, 2, 10),
(163, '中寮鄉', 541, 2, 10),
(164, '草屯鎮', 542, 2, 10),
(165, '國姓鄉', 544, 2, 10),
(166, '埔里鎮', 545, 2, 10),
(167, '仁愛鄉', 546, 2, 10),
(168, '名間鄉', 551, 2, 10),
(169, '集集鎮', 552, 2, 10),
(170, '水里鄉', 553, 2, 10),
(171, '魚池鄉', 555, 2, 10),
(172, '信義鄉', 556, 2, 10),
(173, '竹山鎮', 557, 2, 10),
(174, '鹿谷鄉', 558, 2, 10),
(175, '斗南鎮', 630, 2, 13),
(176, '大埤鄉', 631, 2, 13),
(177, '虎尾鎮', 632, 2, 13),
(178, '土庫鎮', 633, 2, 13),
(179, '褒忠鄉', 634, 2, 13),
(180, '東勢鄉', 635, 2, 13),
(181, '臺西鄉', 636, 2, 13),
(182, '崙背鄉', 637, 2, 13),
(183, '麥寮鄉', 638, 2, 13),
(184, '斗六市', 640, 2, 13),
(185, '林內鄉', 643, 2, 13),
(186, '古坑鄉', 646, 2, 13),
(187, '莿桐鄉', 647, 2, 13),
(188, '西螺鎮', 648, 2, 13),
(189, '二崙鄉', 649, 2, 13),
(190, '北港鎮', 651, 2, 13),
(191, '水林鄉', 652, 2, 13),
(192, '口湖鄉', 653, 2, 13),
(193, '四湖鄉', 654, 2, 13),
(194, '元長鄉', 655, 2, 13),
(195, '（全市共用）', 600, 3, 11),
(196, '番路鄉', 602, 3, 12),
(197, '梅山鄉', 603, 3, 12),
(198, '竹崎鄉', 604, 3, 12),
(199, '阿里山鄉', 605, 3, 12),
(200, '中埔鄉', 606, 3, 12),
(201, '大埔鄉', 607, 3, 12),
(202, '水上鄉', 608, 3, 12),
(203, '鹿草鄉', 611, 3, 12),
(204, '太保市', 612, 3, 12),
(205, '朴子市', 613, 3, 12),
(206, '東石鄉', 614, 3, 12),
(207, '六腳鄉', 615, 3, 12),
(208, '新港鄉', 616, 3, 12),
(209, '民雄鄉', 621, 3, 12),
(210, '大林鎮', 622, 3, 12),
(211, '溪口鄉', 623, 3, 12),
(212, '義竹鄉', 624, 3, 12),
(213, '布袋鎮', 625, 3, 12),
(214, '中西區', 700, 3, 14),
(215, '東區', 701, 3, 14),
(216, '南區', 702, 3, 14),
(217, '北區', 704, 3, 14),
(218, '安平區', 708, 3, 14),
(219, '安南區', 709, 3, 14),
(220, '永康區', 710, 3, 14),
(221, '歸仁區', 711, 3, 14),
(222, '新化區', 712, 3, 14),
(223, '左鎮區', 713, 3, 14),
(224, '玉井區', 714, 3, 14),
(225, '楠西區', 715, 3, 14),
(226, '南化區', 716, 3, 14),
(227, '仁德區', 717, 3, 14),
(228, '關廟區', 718, 3, 14),
(229, '龍崎區', 719, 3, 14),
(230, '官田區', 720, 3, 14),
(231, '麻豆區', 721, 3, 14),
(232, '佳里區', 722, 3, 14),
(233, '西港區', 723, 3, 14),
(234, '七股區', 724, 3, 14),
(235, '將軍區', 725, 3, 14),
(236, '學甲區', 726, 3, 14),
(237, '北門區', 727, 3, 14),
(238, '新營區', 730, 3, 14),
(239, '後壁區', 731, 3, 14),
(240, '白河區', 732, 3, 14),
(241, '東山區', 733, 3, 14),
(242, '六甲區', 734, 3, 14),
(243, '下營區', 735, 3, 14),
(244, '柳營區', 736, 3, 14),
(245, '鹽水區', 737, 3, 14),
(246, '善化區', 741, 3, 14),
(247, '大內區', 742, 3, 14),
(248, '山上區', 743, 3, 14),
(249, '新市區', 744, 3, 14),
(250, '安定區', 745, 3, 14),
(251, '新興區', 800, 3, 15),
(252, '前金區', 801, 3, 15),
(253, '苓雅區', 802, 3, 15),
(254, '鹽埕區', 803, 3, 15),
(255, '鼓山區', 804, 3, 15),
(256, '旗津區', 805, 3, 15),
(257, '前鎮區', 806, 3, 15),
(258, '三民區', 807, 3, 15),
(259, '楠梓區', 811, 3, 15),
(260, '小港區', 812, 3, 15),
(261, '左營區', 813, 3, 15),
(262, '仁武區', 814, 3, 15),
(263, '大社區', 815, 3, 15),
(264, '岡山區', 820, 3, 15),
(265, '路竹區', 821, 3, 15),
(266, '阿蓮區', 822, 3, 15),
(267, '田寮區', 823, 3, 15),
(268, '燕巢區', 824, 3, 15),
(269, '橋頭區', 825, 3, 15),
(270, '梓官區', 826, 3, 15),
(271, '彌陀區', 827, 3, 15),
(272, '永安區', 828, 3, 15),
(273, '湖內區', 829, 3, 15),
(274, '鳳山區', 830, 3, 15),
(275, '大寮區', 831, 3, 15),
(276, '林園區', 832, 3, 15),
(277, '鳥松區', 833, 3, 15),
(278, '大樹區', 840, 3, 15),
(279, '旗山區', 842, 3, 15),
(280, '美濃區', 843, 3, 15),
(281, '六龜區', 844, 3, 15),
(282, '內門區', 845, 3, 15),
(283, '杉林區', 846, 3, 15),
(284, '甲仙區', 847, 3, 15),
(285, '桃源區', 848, 3, 15),
(286, '那瑪夏區', 849, 3, 15),
(287, '茂林區', 851, 3, 15),
(288, '茄萣區', 852, 3, 15),
(291, '馬公市', 880, 3, 20),
(292, '西嶼鄉', 881, 3, 20),
(293, '望安鄉', 882, 3, 20),
(294, '七美鄉', 883, 3, 20),
(295, '白沙鄉', 884, 3, 20),
(296, '湖西鄉', 885, 3, 20),
(297, '屏東市', 900, 3, 16),
(298, '三地門鄉', 901, 3, 16),
(299, '霧臺鄉', 902, 3, 16),
(300, '瑪家鄉', 903, 3, 16),
(301, '九如鄉', 904, 3, 16),
(302, '里港鄉', 905, 3, 16),
(303, '高樹鄉', 906, 3, 16),
(304, '鹽埔鄉', 907, 3, 16),
(305, '長治鄉', 908, 3, 16),
(306, '麟洛鄉', 909, 3, 16),
(307, '竹田鄉', 911, 3, 16),
(308, '內埔鄉', 912, 3, 16),
(309, '萬丹鄉', 913, 3, 16),
(310, '潮州鎮', 920, 3, 16),
(311, '泰武鄉', 921, 3, 16),
(312, '來義鄉', 922, 3, 16),
(313, '萬巒鄉', 923, 3, 16),
(314, '崁頂鄉', 924, 3, 16),
(315, '新埤鄉', 925, 3, 16),
(316, '南州鄉', 926, 3, 16),
(317, '林邊鄉', 927, 3, 16),
(318, '東港鄉', 928, 3, 16),
(319, '琉球鄉', 929, 3, 16),
(320, '佳冬鄉', 931, 3, 16),
(321, '新園鄉', 932, 3, 16),
(322, '枋寮鄉', 940, 3, 16),
(323, '枋山鄉', 941, 3, 16),
(324, '春日鄉', 942, 3, 16),
(325, '獅子鄉', 943, 3, 16),
(326, '車城鄉', 944, 3, 16),
(327, '牡丹鄉', 945, 3, 16),
(328, '恆春鄉', 946, 3, 16),
(329, '滿州鄉', 947, 3, 16),
(330, '臺東市', 950, 4, 19),
(331, '綠島鄉', 951, 4, 19),
(332, '蘭嶼鄉', 952, 4, 19),
(333, '延平鄉', 953, 4, 19),
(334, '卑南鄉', 954, 4, 19),
(335, '鹿野鄉', 955, 4, 19),
(336, '關山鎮', 956, 4, 19),
(337, '海端鄉', 957, 4, 19),
(338, '池上鄉', 958, 4, 19),
(339, '東河鄉', 959, 4, 19),
(340, '成功鎮', 961, 4, 19),
(341, '長濱鄉', 962, 4, 19),
(342, '太麻里鄉', 963, 4, 19),
(343, '金峰鄉', 964, 4, 19),
(344, '大武鄉', 965, 4, 19),
(345, '達仁鄉', 966, 4, 19),
(346, '花蓮市', 970, 4, 18),
(347, '新城鄉', 971, 4, 18),
(348, '秀林鄉', 972, 4, 18),
(349, '吉安鄉', 973, 4, 18),
(350, '壽豐鄉', 974, 4, 18),
(351, '鳳林鎮', 975, 4, 18),
(352, '光復鄉', 976, 4, 18),
(353, '豐濱鄉', 977, 4, 18),
(354, '瑞穗鄉', 978, 4, 18),
(355, '萬榮鄉', 979, 4, 18),
(356, '玉里鎮', 981, 4, 18),
(357, '卓溪鄉', 982, 4, 18),
(358, '富里鄉', 983, 4, 18),
(359, '金沙鎮', 890, 5, 21),
(360, '金湖鎮', 891, 5, 21),
(361, '金寧鄉', 892, 5, 21),
(362, '金城鎮', 893, 5, 21),
(363, '烈嶼鄉', 894, 5, 21),
(364, '烏坵鄉', 896, 5, 21),
(365, '南竿鄉', 209, 5, 22),
(366, '北竿鄉', 210, 5, 22),
(367, '莒光鄉', 211, 5, 22),
(368, '東引鄉', 212, 5, 22);

--
-- 已傾印資料表的索引
--

--
-- 資料表索引 `tw_areas`
--
ALTER TABLE `tw_areas`
  ADD PRIMARY KEY (`id`);

--
-- 資料表索引 `tw_citys`
--
ALTER TABLE `tw_citys`
  ADD PRIMARY KEY (`id`);

--
-- 資料表索引 `tw_dist`
--
ALTER TABLE `tw_dist`
  ADD PRIMARY KEY (`id`);

--
-- 在傾印的資料表使用自動遞增(AUTO_INCREMENT)
--

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `tw_areas`
--
ALTER TABLE `tw_areas`
  MODIFY `id` tinyint(1) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `tw_citys`
--
ALTER TABLE `tw_citys`
  MODIFY `id` tinyint(2) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `tw_dist`
--
ALTER TABLE `tw_dist`
  MODIFY `id` smallint(3) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=369;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
