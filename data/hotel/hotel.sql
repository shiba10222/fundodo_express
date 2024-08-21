-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- 主機： localhost
-- 產生時間： 2024 年 08 月 16 日 06:48
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
-- 資料表結構 `hotel`
--

CREATE TABLE `hotel` (
  `id` mediumint(6) NOT NULL,
  `location_id` smallint(3) NOT NULL,
  `name` varchar(50) NOT NULL,
  `description` varchar(300) NOT NULL,
  `address` varchar(50) NOT NULL,
  `Latitude` decimal(11,8) NOT NULL,
  `Longitude` decimal(11,8) NOT NULL,
  `main_img_path` varchar(30) NOT NULL,
  `price_s` decimal(6,0) NOT NULL,
  `price_m` decimal(6,0) NOT NULL,
  `price_l` decimal(6,0) NOT NULL,
  `service_food` tinyint(1) NOT NULL,
  `service_bath` tinyint(1) NOT NULL,
  `service_live_stream` tinyint(1) NOT NULL,
  `service_playground` tinyint(1) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `valid` tinyint(1) NOT NULL DEFAULT 1
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- 傾印資料表的資料 `hotel`
--

INSERT INTO `hotel` (`id`, `location_id`, `name`, `description`, `address`, `Latitude`, `Longitude`, `main_img_path`, `price_s`, `price_m`, `price_l`, `service_food`, `service_bath`, `service_live_stream`, `service_playground`, `created_at`, `valid`) VALUES
(1, 1, 'W SPA寵物旅館', 'W SPA 寵物旅館位於台電大樓附近，以寵物美容、SPA、住宿安親服務為主，提供貓咪超大獨立挑高空間，而狗狗則採不關籠半開方式照顧，並都提供24H監視器（有夜視鏡功能），讓飼主可隨時觀看毛孩動態。消費者表示：「狗狗在這邊玩得很開心，環境乾淨」、「保姆姐姐對我們家小朋友超級好！！很仔細照顧毛孩子們」、「公館一帶，寵物住宿首選！！乾淨，有耐心，可雲端監控毛孩狀況」、「收費合理，並且很細心的照顧毛小孩」。', '台北市中正區羅斯福路三段139號1F', 25.02186590, 121.52720700, 'HT0000011.jpg', 380, 570, 780, 1, 1, 0, 1, '2024-07-25 17:41:01', 1),
(2, 1, '有間狗旅精品度假中心', '有間狗旅位於中正紀念堂站附近，強調專注狗狗房與公共空間的設計，除了備有基本的 24 小時全天候監視器外，甚至還有狗狗行為諮商師駐館，協助狗狗們快速安穩地適應環境，服務相當貼心。家長大力推薦：「老闆非常細心，對於狗狗的動向都有仔細掌握」、「整體氛圍感覺非常溫馨悠閒，老闆也非常的專業」、「環境很漂亮整潔，服務也非常專業細心」、「很用心了解寵物的喜好及需求，有問題的時候回覆也都很即時」。', '台北市中正區南昌路一段14號二樓', 25.03224660, 121.51631640, 'HT0000021.jpg', 330, 575, 677, 1, 1, 0, 1, '2024-03-18 15:22:09', 1),
(3, 1, 'VERY旺寵物旅館', 'VERY旺以打造市中心的寵物樂園為出發點，提供貓狗美容、SPA、住宿、安親臨托等，也有販售寵物用品及鮮食，旅館除了採貓狗獨立分層空間外，最大特色就是頂樓有設計戶外運動場，能讓住宿的狗狗自由自在奔跑玩耍。住過都說讚：「是真心愛寵物的寵物旅館，住宿價格很實惠，還有狗狗們的放風時間」、「每天回報狗狗狀態，可以視訊看寶貝狀況，頂樓有空地可以讓寶貝放風」、「保姆都非常細心 帶寶貝來住宿都很放心」、「服務好，對待毛寶貝們都很友善」。', '台北市松山區八德路二段429號2樓', 25.04830810, 121.54664640, 'HT0000031.jpg', 348, 542, 735, 0, 0, 1, 1, '2024-03-17 20:08:40', 1),
(4, 1, '家裡寵物旅館-幼幼館', '家裡寵物旅館是全台唯一專門收幼犬的寵物旅館，主打為幼犬、小型犬提供寄宿、安親、美容、訓練等服務，環境相當溫馨自由，尤其在遊戲安親班的活動，更是採一對一引導，而不是團體一起玩，這樣才能避免寵物之間產生護食引起衝突，從細節可見其用心。飼主好評不斷：「環境乾淨沒有異味，看得出來非常用心維護」、「環境溫馨舒適，狗狗都很安心住在這邊」、「對狗勾非常親切有耐心，並且認真觀察每隻狗狗狀況」、「非常細心體貼的寵物旅館，很放心把家裡寶貝交給她們」、「保姆非常細心，住宿過很多次，從來沒有失望過」。', '台北市中山區長安東路二段195號1樓', 25.04836000, 121.54326350, 'HT0000041.jpg', 323, 534, 725, 1, 1, 1, 1, '2024-04-19 18:00:45', 1),
(5, 1, '狗窩窩愛犬旅社', '希望所有毛小孩來到狗窩窩愛犬旅社能可以像「在家」一般，這是狗窩窩的理念，主要提供美容、住宿、安親等服務，並採不關籠的寄宿方式，讓每個毛孩都有自己的小房間可以睡覺，且保姆也都是經驗豐富的狗奴才，飼主再也不怕狗狗寄宿受委屈！推薦理由：「服務很貼心，每次預約都有配合我們的需求，值得推薦的店家」、「挺好的，狗狗去安親有時他們都會幫狗狗拍照片」、「保姆回訊息都很快， 24  小時監視器，都看的到，也都會回報狗狗的狀況」、「每次我們家狗狗去了都很開心」、「裡面小姐都很客氣而已很有耐心」。', '台北市松山區民生東路五段137巷2-5號', 25.05926260, 121.56175090, 'HT0000051.jpg', 342, 551, 690, 1, 0, 0, 1, '2024-01-18 00:18:15', 1),
(6, 1, '好時光寵物旅館', '鄰近內湖四期重劃住宅區的好時光寵物旅館，會依照毛小孩的體型、個性分區照顧，每天還有帶去公園散步、放風的戶外活動時間，甚至連睡覺都是一隻一間獨立空間，讓毛小孩休息不會互相影響。另外，寵物住宿也都備有攝影機，讓飼主可遠端連線觀看！飼主紛紛表示：「對人、寵物都很親切，也會定時回報狀況」、「讓人放心的專業店家、保姆」、「保姆超級貼心，定時回報寵物的狀況，還會陪玩拍照錄影片」、「難得碰到這麽細心的寵物旅館，把毛小孩照顧得很好」、「愛犬住了都不想回家了」。', '台北市內湖區民權東路六段170號1F', 25.06830650, 121.59159340, 'HT0000061.jpg', 369, 541, 624, 1, 0, 1, 1, '2024-05-11 02:25:41', 1),
(7, 1, 'D&Y 寵物美容時尚旅店', 'D&Y不僅提供寵物旅館服務，還有協助狗狗中途，尤其在旅館住宿方面，老闆堅持提供毛小孩24小時專業照顧，確保狗狗身旁有寵物保姆，而且會隨時記錄、主動告知飼主毛小孩狀況，飼主也能透過手機視訊查看自己寶貝的現況，環境相當令人安心。狗奴們激推：「我家狗狗超愛這裡的」、「空間舒適，保姆姐姐們都超有耐心又細心」、「每次都很期待保姆分享狗狗在那邊的照片」、「找不到比這裡更讓我們放心的旅館了」、「寶貝交給D&Y 我們很放心」、「非常用心照顧狗狗，住宿期間常傳狗狗狀況」。', '台北市中山區中山北路三段55巷22號', 25.06786070, 121.52389360, 'HT0000071.jpg', 342, 526, 740, 1, 1, 0, 1, '2024-07-10 15:43:39', 1),
(8, 1, 'FamilyDog-宜家宜犬', '宜家宜犬有提供安親、住宿、才藝訓練、居家照護、生日派對等服務，並引進韓國寵物美容，不少明星寵物也都曾在這裡住宿過，主打「專人照顧毛孩」，且還能讓狗狗學習社會化，也有協助羅志祥母親照顧救援回來的狗狗，是許多毛小孩的第二個家。狗狗飼主都推薦：「待人親切，狗狗顧得很好」、「看到狗狗每次來都頭也不回的跑進去，就知道來這裡有多開心」、「環境乾淨明亮，照顧狗狗也很細心」、「老闆對狗狗的照顧是發自內心的愛」、「在宜家可以享受陪伴照護、學習社會化，一舉數得」。', '台北市松山區八德路四段259號', 25.04907940, 121.56527600, 'HT0000081.jpg', 376, 545, 748, 1, 1, 0, 1, '2024-04-24 04:34:37', 1),
(9, 1, 'Happy愛犬屋', '位於大安捷運站附近的Happy愛犬屋，沒來過的狗狗都須先安親一次，進而讓訓練師評估狗狗狀態是否合適半開放式的居住空間，並強調每日都會去公園遛狗陪玩，依照每一隻毛孩的個性安排適當社交，更厲害是還會把基礎服從，社會化及減敏訓練融入寵物照護， 讓毛孩住宿兼學習！奴才都愛送主子到這寄宿：「台北市狗狗安親住宿最佳體驗」、「老闆娘很親切，也隨時傳圖片讓我們知道我家狗狗入住的很開心」、「孩子們能在住宿的地方開懷笑，都要感謝愛犬屋的照顧」、「毛寶貝每回入住都是一股勁地搖尾巴，我開心也放心」。', '台北市大安區復興南路一段321號6樓', 25.03404830, 121.54385100, 'HT0000091.jpg', 333, 561, 747, 0, 1, 1, 1, '2024-05-03 09:44:15', 1),
(10, 1, '就甘心Ponpon寵物旅館', '提供寬敞的活動空間和舒適的住宿設施，讓狗狗們在這裡度過愉快的時光。我們的專業團隊全天候照顧，確保您的毛孩得到最好的待遇。「這裡的服務真的很棒，狗狗每天都很開心」、「有專業的保姆全天照顧，讓我很放心」、「即時影像功能讓我能隨時看到毛孩的狀況，安心不少」、「環境非常適合狗狗，真的是毛孩的天堂」。', '台北市中山區新生北路二段60巷16號4樓', 25.05566880, 121.52680320, 'HT0000101.jpg', 345, 550, 658, 1, 1, 0, 0, '2024-03-30 07:52:46', 1),
(11, 4, '柴町寵物旅舍', '擁有豪華的住宿設施和貼心的服務，為狗狗們提供一個舒適、安全的居所。我們的專業團隊24小時照顧，確保每隻狗狗都能得到最好的待遇。「這裡的環境非常優美，狗狗可以盡情玩耍」、「員工們都很有愛心，讓我非常放心」、「看到狗狗在這裡玩得那麼開心，我也很安心」、「每次來這裡，狗狗都不想回家」。', '桃園市桃園區文中路10號', 24.99610300, 121.29479900, 'HT0000111.jpg', 325, 553, 733, 1, 1, 1, 0, '2024-05-04 17:54:30', 1),
(12, 1, '狗狗日常寵物旅館', '提供溫馨的居住環境，配備先進的設施和專業的照顧團隊，讓您的狗狗享受最優質的住宿體驗。「旅舍環境乾淨整潔，狗狗在這裡玩得很開心」、「保姆非常細心，讓我很放心」、「有即時影像功能，隨時都能看到毛孩的狀況，安心不少」、「這裡的服務非常周到，真的很棒」。', '台北市文山區羅斯福路六段85號', 24.99858240, 121.54052830, 'HT0000121.jpg', 365, 578, 757, 1, 1, 1, 1, '2024-04-25 17:03:21', 1),
(13, 2, 'Fun Pet Resort', '位於板橋區的Fun Pet Resort，致力於為您的毛小孩提供如家一般的溫馨環境。我們的專業團隊確保每位客人都能享受到貼心的照顧和豐富的活動，讓寵物在這裡度過愉快的時光。旅館設施先進，讓寵物們可以盡情玩耍與放鬆，是許多飼主的首選。', '新北市板橋區中山路二段331號', 25.01892860, 121.47924240, 'HT0000131.jpg', 355, 540, 780, 0, 1, 1, 0, '2024-01-20 23:14:02', 1),
(14, 2, '狗狗村', '狗狗村位於新莊區，擁有寬敞的活動空間和專業的照護服務，為您的毛孩子提供一個安全且舒適的居住環境。這裡的工作人員非常細心，會根據每隻狗狗的需求提供個性化服務，讓寵物和飼主都感到滿意和安心。「這裡的服務真的很棒，狗狗每天都很開心」、「有專業的保姆全天照顧，讓我很放心」、「即時影像功能讓我能隨時看到毛孩的狀況，安心不少」、「環境非常適合狗狗，真的是毛孩的天堂」。', '新北市新莊區中正路432號', 25.03381130, 121.44056880, 'HT0000141.jpg', 338, 572, 658, 0, 1, 1, 1, '2024-05-05 08:23:15', 1),
(15, 2, '毛小孩之家', '毛小孩之家位於三重區，是一個專門為寵物設計的舒適空間。這裡不僅有貼心的服務，還有多樣的娛樂設施，讓您的毛孩子可以在旅途中放鬆身心。許多顧客稱讚這裡的環境乾淨，服務周到，是毛小孩度假時的理想選擇。「這裡的環境很棒，狗狗和我都很喜歡」、「工作人員非常有愛心，狗狗在這裡過得很開心」、「有即時影像功能，讓我可以隨時看到狗狗的狀況，很安心」、「這裡的服務非常周到，真的很棒」。', '新北市三重區重新路五段543號', 25.04625120, 121.47076790, 'HT0000151.jpg', 373, 539, 768, 1, 1, 1, 1, '2024-02-19 21:53:32', 1),
(16, 2, 'Pet Stay', 'Pet Stay坐落於永和區，以其現代化的設施和貼心的服務著稱。這裡提供24小時全天候的照顧，確保您的寵物在離家期間得到最好的關愛。無論是短期還是長期住宿，Pet Stay都能滿足不同飼主的需求，是寵物們的第二個家。', '新北市永和區中山路一段275號', 25.00710020, 121.50723420, 'HT0000161.jpg', 341, 549, 662, 1, 1, 0, 0, '2024-04-07 18:39:30', 1),
(17, 2, '寵物天堂', '位於汐止區的寵物天堂是一家深受飼主信賴的寵物旅館。這裡的設施完備，環境乾淨，提供全方位的照顧服務。飼主們對這裡的專業服務和溫暖的氛圍讚不絕口，讓寵物們在這裡度過一段快樂的時光。這裡的服務真的很棒，狗狗每天都很開心」、「有專業的保姆全天照顧，讓我很放心」、「即時影像功能讓我能隨時看到毛孩的狀況，安心不少」、「環境非常適合狗狗，真的是毛孩的天堂」。', '新北市汐止區大同路一段268號', 25.05726900, 121.63387860, 'HT0000171.jpg', 320, 574, 652, 1, 0, 1, 1, '2024-02-09 12:39:15', 1),
(18, 2, '幸福寵物之家', '幸福寵物之家位於永和區，專為愛寵們打造了一個溫馨的居住環境。旅館注重每個細節，提供個性化的照護服務，讓每位毛孩子都能感受到家的溫暖。這裡的員工專業且富有愛心，深受顧客的信賴與喜愛。狗奴們激推：「我家狗狗超愛這裡的」、「空間舒適，保姆姐姐們都超有耐心又細心」、「每次都很期待保姆分享狗狗在那邊的照片」、「找不到比這裡更讓我們放心的旅館了」、「寶貝交給D&Y 我們很放心」、「非常用心照顧狗狗，住宿期間常傳狗狗狀況」。', '新北市永和區竹林路168號', 25.01010800, 121.52023910, 'HT0000181.jpg', 322, 524, 639, 1, 0, 1, 1, '2024-03-27 22:02:16', 1),
(19, 2, '汪星人渡假村', '汪星人渡假村位於板橋區，是狗狗們的天堂。這裡設施齊全，提供多樣的娛樂活動和舒適的住宿環境，讓每隻狗狗都能享受一段愉快的假期。許多飼主表示，汪星人渡假村是他們放安心愛寵物的首選地點。', '新北市板橋區文化路二段12號', 25.02414970, 121.46893080, 'HT0000191.jpg', 324, 527, 712, 1, 1, 0, 1, '2024-04-01 19:50:04', 1),
(20, 4, '柴町寵物旅舍', '柴町寵物旅舍提供寬敞舒適的居住環境，專為狗狗設計，讓牠們享受家一般的溫暖。我們有專業的保姆24小時照顧，每天帶狗狗們散步，確保牠們得到充分的運動和關愛。客戶評價：「旅舍環境乾淨整潔，狗狗在這裡玩得很開心」、「保姆非常細心，讓我很放心」、「有即時影像功能，隨時都能看到毛孩的狀況，安心不少」。', '桃園市桃園區文中路10號', 24.99610300, 121.29479900, 'HT0000201.jpg', 369, 563, 716, 0, 1, 1, 1, '2024-04-18 08:53:50', 1),
(21, 4, '花居寵物生活別館', '花居寵物生活別館融合自然景觀與現代設施，為狗狗提供一個放鬆的度假勝地。每日的戶外活動和專業的照顧服務讓狗狗們充滿活力和快樂。「這裡的環境非常優美，狗狗可以盡情玩耍」、「員工們都很有愛心，讓我非常放心」、「看到狗狗在這裡玩得那麼開心，我也很安心」、「每次來這裡，狗狗都不想回家」。', '桃園市桃園區中正三街389號', 25.00283670, 121.29895450, 'HT0000211.jpg', 364, 522, 747, 1, 1, 1, 1, '2024-04-15 06:19:13', 1),
(22, 4, '快樂尾巴寵物旅館', '快樂尾巴寵物旅館致力於讓每一隻狗狗都感受到快樂與愛。我們提供不關籠的自由空間和全天候的專業照顧，讓您的毛孩在這裡享受一個愉快的假期。「這裡的服務真的很棒，狗狗每天都很開心」、「有專業的保姆全天照顧，讓我很放心」、「即時影像功能讓我能隨時看到毛孩的狀況，安心不少」、「環境非常適合狗狗，真的是毛孩的天堂」。', '桃園市桃園區中正路348號', 24.99843080, 121.30883890, 'HT0000221.jpg', 366, 575, 750, 1, 1, 1, 1, '2024-03-23 15:03:16', 1),
(23, 4, '萊恩寵物美容住宿 Lion Pets', ' Lion Pets結合美容與住宿服務，為狗狗提供全方位的呵護。我們擁有專業的美容師和24小時的照顧團隊，確保您的狗狗在這裡得到最好的待遇。「這裡的美容服務很專業，狗狗每次都變得很漂亮」、「環境舒適，狗狗在這裡住得很開心」、「保姆照顧得非常細心，讓我很放心」、「有即時影像功能，可以隨時看到毛孩，真是太好了」。', '桃園市桃園區文中三路60號', 24.99716350, 121.28879270, 'HT0000231.jpg', 367, 547, 675, 1, 1, 0, 1, '2024-05-15 21:33:43', 1),
(24, 4, '汪森市寵物友善咖啡廳&寵物旅館', '汪森市寵物友善咖啡廳&寵物旅館是狗狗們的快樂樂園，我們不僅提供舒適的住宿環境，還有寵物友善的咖啡廳，讓飼主和狗狗都能享受愉快的時光。「這裡的環境很棒，狗狗和我都很喜歡」、「工作人員非常有愛心，狗狗在這裡過得很開心」、「有即時影像功能，讓我可以隨時看到狗狗的狀況，很安心」、「這裡的服務非常周到，真的很棒」。', '桃園市桃園區延壽街162號', 24.99423700, 121.28974800, 'HT0000241.jpg', 329, 558, 675, 1, 0, 0, 0, '2024-05-04 10:10:32', 1),
(25, 4, '捲毛叔叔寵物美容旅館', '寵物美容旅館提供頂級的美容和住宿服務，讓狗狗們在這裡享受全方位的呵護。我們的專業團隊確保每隻狗狗都得到最好的照顧和美容。「美容師非常專業，狗狗每次都變得很漂亮」、「環境乾淨舒適，狗狗在這裡住得很開心」、「保姆照顧得非常細心，讓我很放心」、「即時影像功能讓我隨時都能看到毛孩的狀況，安心不少」。', '桃園市中壢區龍岡路二段71號', 24.94645850, 121.22912900, 'HT0000251.jpg', 372, 551, 653, 0, 1, 1, 1, '2024-01-18 23:32:21', 1),
(26, 4, '布居寵物生活別館', '布居寵物生活別館擁有寬敞的活動空間和舒適的住宿設施，讓狗狗們在這裡度過愉快的時光。我們的專業團隊24小時照顧，確保您的毛孩得到最好的待遇。「這裡的環境非常適合狗狗們玩耍」、「員工們都很有愛心，讓我非常放心」、「看到狗狗在這裡玩得那麼開心，我也很安心」、「每次來這裡，狗狗都不想回家」。', '桃園市桃園區同安街576號1F', 25.02258670, 121.29886700, 'HT0000261.jpg', 341, 521, 685, 0, 1, 1, 0, '2024-03-24 12:03:31', 1),
(27, 4, '悠遊狗寵物旅館', '提供自由的活動空間和貼心的照顧服務，讓狗狗們在這裡享受快樂的假期。我們的專業團隊確保每隻狗狗都能得到充分的關愛和運動。「這裡的服務真的很棒，狗狗每天都很開心」、「有專業的保姆全天照顧，讓我很放心」、「即時影像功能讓我能隨時看到毛孩的狀況，安心不少」、「環境非常適合狗狗，真的是毛孩的天堂」。', '桃園市觀音區崙坪里12鄰崙坪210-6號', 25.01574180, 121.15636320, 'HT0000271.jpg', 325, 580, 736, 1, 1, 1, 1, '2024-01-03 17:34:44', 1),
(28, 4, 'DoDo寵物沙龍旅館', '旅館結合了高品質的美容和舒適的住宿服務，為狗狗提供全方位的呵護。我們擁有專業的美容師和全天候的照顧團隊，確保您的狗狗在這裡得到最好的待遇。「這裡的美容服務很專業，狗狗每次都變得很漂亮」、「環境舒適，狗狗在這裡住得很開心」、「保姆照顧得非常細心，讓我很放心」、「有即時影像功能，可以隨時看到毛孩，真是太好了」。', '桃園市觀音區德一街92號', 25.04617770, 121.13776190, 'HT0000281.jpg', 347, 527, 662, 1, 1, 0, 1, '2024-04-30 13:16:07', 1),
(29, 4, '陽陽寵物 YangYangPet', '提供寬敞舒適的住宿空間，配備先進的設施和專業的照顧團隊，讓您的狗狗享受最優質的住宿體驗。「旅舍環境乾淨整潔，狗狗在這裡玩得很開心」、「保姆非常細心，讓我很放心」、「有即時影像功能，隨時都能看到毛孩的狀況，安心不少」、「這裡的服務非常周到，真的很棒」。', '桃園市蘆竹區後面坑路', 25.08755780, 121.30602330, 'HT0000291.jpg', 352, 560, 727, 1, 0, 1, 1, '2024-07-07 04:31:00', 1),
(30, 4, '阿曼達寵物精品旅館-平鎮店', '擁有豪華的住宿設施和貼心的服務，為狗狗們提供一個舒適、安全的居所。我們的專業團隊24小時照顧，確保每隻狗狗都能得到最好的待遇。「這裡的環境非常優美，狗狗可以盡情玩耍」、「員工們都很有愛心，讓我非常放心」、「看到狗狗在這裡玩得那麼開心，我也很安心」、「每次來這裡，狗狗都不想回家」。', '桃園市平鎮區上海路311號', 24.91645570, 121.20593750, 'HT0000301.jpg', 362, 552, 711, 0, 1, 1, 1, '2024-01-28 00:04:46', 1),
(31, 4, '2014 pet salon hotel', '提供寬敞舒適的住宿環境，配備高級設施，讓您的狗狗享受最優質的住宿體驗。我們有專業的美容師和24小時的照顧團隊，確保您的愛犬得到最好的待遇。「這裡的美容服務非常專業，狗狗每次都變得很漂亮」、「環境舒適，狗狗在這裡住得很開心」、「保姆照顧得非常細心，讓我很放心」、「有即時影像功能，可以隨時看到毛孩，真是太好了」', '桃園市中壢區慈惠三街142號', 24.96454400, 121.22596900, 'HT0000311.jpg', 325, 549, 632, 1, 1, 0, 1, '2024-04-26 22:04:04', 1),
(32, 4, 'So Sweet 真貼心寵物美容旅館', '擁有溫馨的環境和先進的設施，讓狗狗們感受到家的溫暖。我們的專業保姆24小時照顧，確保您的狗狗得到充分的關愛和運動。「這裡的環境非常舒適，狗狗在這裡玩得很開心」、「工作人員非常有愛心，讓我非常放心」、「有即時影像功能，讓我能隨時看到狗狗的狀況，安心不少」、「每次來這裡，狗狗都不想回家」。', '桃園市中壢區新生路36號2樓', 24.95799140, 121.22273560, 'HT0000321.jpg', 340, 571, 650, 1, 1, 1, 1, '2024-04-02 14:55:25', 1);

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
-- 資料表索引 `hotel`
--
ALTER TABLE `hotel`
  ADD PRIMARY KEY (`id`);

  --
-- 資料表索引 `hotel`
--
ALTER TABLE `hotel_img`
  ADD PRIMARY KEY (`id`);



--
-- 在傾印的資料表使用自動遞增(AUTO_INCREMENT)
--

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `hotel`
--
ALTER TABLE `hotel`
  MODIFY `id` mediumint(6) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=33;

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `hotel_img`
--
ALTER TABLE `hotel_img`
  MODIFY `id` int(7) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=97;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
