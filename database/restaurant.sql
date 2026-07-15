-- MySQL dump 10.13  Distrib 8.0.43, for Win64 (x86_64)
--
-- Host: localhost    Database: restaurant
-- ------------------------------------------------------
-- Server version	9.4.0

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `booked_table`
--

DROP TABLE IF EXISTS `booked_table`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `booked_table` (
  `booking_id` int NOT NULL,
  `table_id` int NOT NULL,
  KEY `FKrqfi7g0yb3anwx4r2khb09kas` (`table_id`),
  KEY `FKdg6837g098cgno0vk78mccxb0` (`booking_id`),
  CONSTRAINT `FKdg6837g098cgno0vk78mccxb0` FOREIGN KEY (`booking_id`) REFERENCES `booking` (`id`),
  CONSTRAINT `FKrqfi7g0yb3anwx4r2khb09kas` FOREIGN KEY (`table_id`) REFERENCES `res_table` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `booked_table`
--

LOCK TABLES `booked_table` WRITE;
/*!40000 ALTER TABLE `booked_table` DISABLE KEYS */;
INSERT INTO `booked_table` VALUES (2,1),(3,2),(4,3),(5,3),(6,6),(7,6),(8,1),(9,1),(10,3),(11,8),(12,2),(13,1),(14,1),(15,2);
/*!40000 ALTER TABLE `booked_table` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `booking`
--

DROP TABLE IF EXISTS `booking`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `booking` (
  `id` int NOT NULL AUTO_INCREMENT,
  `booking_time` datetime(6) NOT NULL,
  `contact_name` varchar(30) NOT NULL,
  `contact_phone` varchar(15) NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `duration_minutes` int NOT NULL,
  `guest_count` int NOT NULL,
  `note` text NOT NULL,
  `status` enum('CANCELLED','CONFIRMED','PENDING') NOT NULL,
  `user_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK7udbel7q86k041591kj6lfmvw` (`user_id`),
  CONSTRAINT `FK7udbel7q86k041591kj6lfmvw` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `booking`
--

LOCK TABLES `booking` WRITE;
/*!40000 ALTER TABLE `booking` DISABLE KEYS */;
INSERT INTO `booking` VALUES (2,'2026-05-08 20:57:00.000000','Đoàn Ngọc Quang','1234567890','2026-05-08 13:57:25.893155',120,2,'Khách đặt từ trang web','CONFIRMED',2),(3,'2026-05-25 16:31:00.000000','Đoàn Ngọc Quang','1234567890','2026-05-25 16:26:32.180440',120,2,'Khách đặt từ trang web','CONFIRMED',2),(4,'2026-05-30 17:20:00.000000','Đoàn Ngọc Quang','1234567890','2026-05-30 12:15:50.056729',120,2,'Khách đặt từ trang web','CONFIRMED',2),(5,'2026-06-06 14:18:00.000000','Đoàn Ngọc Quang','1234567890','2026-05-30 12:18:35.611435',120,2,'Khách đặt từ trang web','CONFIRMED',2),(6,'2026-06-14 16:03:00.000000','Dương Quá','01249425113','2026-06-14 16:02:15.040295',120,4,'Khách đặt từ trang web','CONFIRMED',3),(7,'2026-06-15 08:11:00.000000','Đoàn Ngọc Quang','12345690','2026-06-14 20:11:25.619005',120,4,'Khách đặt từ trang web','CONFIRMED',2),(8,'2026-06-15 08:45:00.000000','Đoàn Ngọc Quang','12345690','2026-06-14 20:45:58.117786',120,2,'Khách đặt từ trang web','CONFIRMED',2),(9,'2026-06-16 08:39:00.000000','Đoàn Ngọc Quang','12345690','2026-06-14 21:40:03.156454',120,2,'Khách đặt từ trang web','CONFIRMED',2),(10,'2026-06-16 10:41:00.000000','Đoàn Ngọc Quang','12345690','2026-06-14 21:41:38.155267',120,2,'Khách đặt từ trang web','CONFIRMED',2),(11,'2026-06-15 08:18:00.000000','Đoàn Ngọc Quang','12345690','2026-06-15 06:18:50.491575',120,4,'Khách đặt từ trang web','CONFIRMED',2),(12,'2026-06-16 10:19:00.000000','Đoàn Ngọc Quang','12345690','2026-06-15 08:20:53.015546',120,2,'Khách đặt từ trang web','CONFIRMED',2),(13,'2026-06-26 08:29:00.000000','Đoàn Ngọc Quang','12345690','2026-06-15 08:28:25.026584',120,2,'Khách đặt từ trang web','CONFIRMED',2),(14,'2027-12-03 12:00:00.000000','Super Administrator','0123456789','2026-06-15 08:41:45.053741',120,2,'Khách đặt từ trang web','CONFIRMED',4),(15,'2026-07-24 09:58:00.000000','Đoàn Ngọc Quang','12345690','2026-07-11 14:58:42.723601',120,2,'vc','CONFIRMED',2);
/*!40000 ALTER TABLE `booking` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `category`
--

DROP TABLE IF EXISTS `category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `category` (
  `id` int NOT NULL AUTO_INCREMENT,
  `description` text NOT NULL,
  `name` varchar(20) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `category`
--

LOCK TABLES `category` WRITE;
/*!40000 ALTER TABLE `category` DISABLE KEYS */;
INSERT INTO `category` VALUES (1,'Các món khai vị nhẹ nhàng, kích thích vị giác','Khai vị'),(2,'Phở, bún và các món nước truyền thống Việt Nam','Phở & Bún'),(3,'Các món cơm đa dạng phong phú','Cơm'),(4,'Các loại lẩu nóng hổi cho nhóm bạn và gia đình','Lẩu'),(5,'Hải sản tươi sống chế biến theo yêu cầu','Hải sản'),(6,'Các món thịt heo, bò, gà đặc sắc','Thịt & Gà'),(7,'Món chay thanh đạm, tốt cho sức khỏe','Chay'),(8,'Món ngọt và tráng miệng sau bữa ăn','Tráng miệng'),(9,'Nước giải khát, sinh tố, trà và cà phê','Đồ uống');
/*!40000 ALTER TABLE `category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `combo`
--

DROP TABLE IF EXISTS `combo`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `combo` (
  `id` int NOT NULL AUTO_INCREMENT,
  `description` text NOT NULL,
  `image_url` varchar(255) NOT NULL,
  `name` varchar(40) NOT NULL,
  `price` decimal(15,2) NOT NULL,
  `status` enum('AVAILABLE','OUT_OF_STOCK','UNAVAILABLE') NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `combo`
--

LOCK TABLES `combo` WRITE;
/*!40000 ALTER TABLE `combo` DISABLE KEYS */;
INSERT INTO `combo` VALUES (1,'Phở bò tái nạm + Trà đào cam sả. Bữa sáng hoàn hảo','https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=400','Combo Phở Sáng',85000.00,'AVAILABLE'),(2,'Cơm tấm sườn bì chả + Nước ép cam tươi','https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400','Combo Cơm Trưa',95000.00,'AVAILABLE'),(3,'Tôm sú nướng + Nghêu hấp sả + Bia Sài Gòn','https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=400','Combo Hải Sản Đôi',350000.00,'AVAILABLE'),(4,'Lẩu Thái Tom Yum + Cơm chiên Dương Châu + 4 Nước suối','https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400','Combo Gia Đình',550000.00,'AVAILABLE'),(5,'Lẩu hải sản + Sườn non BBQ + Gà nướng mật ong + 4 Bia','https://images.unsplash.com/photo-1559847844-5315695dadae?w=400','Combo Tiệc Nhóm',750000.00,'AVAILABLE'),(6,'Bún chả Hà Nội + Chả giò chiên giòn + Cà phê sữa đá','https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=400','Combo Bún Chả Hà Nội',90000.00,'AVAILABLE'),(7,'Bò bít tết + Gỏi ngó sen tôm thịt + 2 Sinh tố bơ + Chè khúc bạch','https://images.unsplash.com/photo-1600891964092-4316c288032e?w=400','Combo Lãng Mạn',450000.00,'AVAILABLE'),(8,'Đậu hũ sốt cà chua + Rau xào thập cẩm + Cơm chiên chay + Trà sen vàng','https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400','Combo Chay Thanh Tịnh',150000.00,'AVAILABLE'),(9,'Sườn non nướng BBQ + Bò xào lúc lắc + Cơm chiên Dương Châu + 4 Bia Sài Gòn','https://images.unsplash.com/photo-1544025162-d76694265947?w=400','Combo BBQ Party',480000.00,'AVAILABLE'),(10,'Bún bò Huế + Nem chua rán + Trà đào cam sả','https://images.unsplash.com/photo-1569058242567-93de6f36f8e6?w=400','Combo Bún Bò Huế',95000.00,'AVAILABLE'),(11,'Gà nướng mật ong + Cơm niêu tôm thịt + Gỏi ngó sen tôm thịt + 2 Nước ép cam','https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=400','Combo Gà Nướng Đặc Biệt',320000.00,'AVAILABLE'),(12,'Cua rang me + Tôm sú nướng muối ớt + Mực chiên giòn + 2 Bia Sài Gòn','https://images.unsplash.com/photo-1559847844-5315695dadae?w=400','Combo Cua Hoàng Đế',600000.00,'AVAILABLE'),(13,'Lẩu nấm chay + Nấm đùi gà xào bơ tỏi + 2 Trà sen vàng','https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400','Combo Lẩu Nấm Chay',200000.00,'AVAILABLE'),(14,'Chè khúc bạch + Bánh flan caramel + Kem dừa trái dừa + Trái cây theo mùa','https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400','Combo Tráng Miệng',120000.00,'AVAILABLE'),(15,'Lẩu bò nhúng giấm + Gà xối mỡ + Cơm chiên Dương Châu + Bánh flan caramel + 6 Nước suối','https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400','Combo Sinh Nhật',900000.00,'AVAILABLE');
/*!40000 ALTER TABLE `combo` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `combo_detail`
--

DROP TABLE IF EXISTS `combo_detail`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `combo_detail` (
  `id` int NOT NULL AUTO_INCREMENT,
  `quantity` int NOT NULL,
  `combo_id` int DEFAULT NULL,
  `food_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKs943yxk1fctp436ptss9kn5sl` (`combo_id`),
  KEY `FKprmwsmayvdxilfq8ibovm6wau` (`food_id`),
  CONSTRAINT `FKprmwsmayvdxilfq8ibovm6wau` FOREIGN KEY (`food_id`) REFERENCES `food` (`id`),
  CONSTRAINT `FKs943yxk1fctp436ptss9kn5sl` FOREIGN KEY (`combo_id`) REFERENCES `combo` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=58 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `combo_detail`
--

LOCK TABLES `combo_detail` WRITE;
/*!40000 ALTER TABLE `combo_detail` DISABLE KEYS */;
INSERT INTO `combo_detail` VALUES (1,1,1,7),(2,1,1,47),(3,1,2,14),(4,1,2,50),(5,1,3,25),(6,1,3,51),(7,1,3,29),(8,1,4,15),(9,1,4,20),(10,4,4,52),(11,1,5,23),(12,1,5,31),(13,4,5,51),(14,1,5,32),(15,1,6,48),(16,1,6,11),(17,1,6,2),(18,1,7,3),(19,1,7,33),(20,2,7,49),(21,1,7,42),(22,1,8,37),(23,1,8,38),(24,1,8,41),(25,1,8,53),(26,1,9,31),(27,1,9,36),(28,1,9,15),(29,4,9,51),(30,1,10,10),(31,1,10,6),(32,1,10,47),(36,1,11,18),(37,1,11,32),(38,1,11,3),(39,1,12,27),(40,1,12,25),(41,1,12,26),(42,2,12,51),(46,1,13,24),(47,1,13,39),(48,2,13,53),(49,1,14,42),(50,1,14,43),(51,1,14,45),(52,1,14,44),(53,1,15,22),(54,1,15,35),(55,1,15,15),(56,1,15,43),(57,6,15,52);
/*!40000 ALTER TABLE `combo_detail` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `comments`
--

DROP TABLE IF EXISTS `comments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `comments` (
  `id` int NOT NULL AUTO_INCREMENT,
  `content` text NOT NULL,
  `created_at` datetime(6) NOT NULL,
  `rating` int NOT NULL,
  `status` enum('ACTIVE','HIDDEN') NOT NULL,
  `updated_at` datetime(6) NOT NULL,
  `combo_id` int DEFAULT NULL,
  `food_id` int DEFAULT NULL,
  `user_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK92lrmsh420m2aiuce9spten32` (`combo_id`),
  KEY `FK5eb9reqw3fwfg1n5sd5jv9q18` (`food_id`),
  KEY `FK8omq0tc18jd43bu5tjh6jvraq` (`user_id`),
  CONSTRAINT `FK5eb9reqw3fwfg1n5sd5jv9q18` FOREIGN KEY (`food_id`) REFERENCES `food` (`id`),
  CONSTRAINT `FK8omq0tc18jd43bu5tjh6jvraq` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `FK92lrmsh420m2aiuce9spten32` FOREIGN KEY (`combo_id`) REFERENCES `combo` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `comments`
--

LOCK TABLES `comments` WRITE;
/*!40000 ALTER TABLE `comments` DISABLE KEYS */;
INSERT INTO `comments` VALUES (2,'ngon vãi','2026-06-14 16:00:05.567847',3,'ACTIVE','2026-06-14 16:00:05.567847',NULL,8,2),(3,'quá là ngon','2026-06-14 16:01:18.607406',5,'ACTIVE','2026-06-14 16:01:18.607406',NULL,8,3),(4,'tuyệt vời','2026-06-15 06:19:03.004751',4,'ACTIVE','2026-06-15 06:19:03.004751',5,NULL,2),(5,' bcc v','2026-07-11 14:58:55.151589',3,'ACTIVE','2026-07-11 14:58:55.151589',NULL,11,2);
/*!40000 ALTER TABLE `comments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `food`
--

DROP TABLE IF EXISTS `food`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `food` (
  `id` int NOT NULL AUTO_INCREMENT,
  `description` text NOT NULL,
  `image_url` varchar(255) NOT NULL,
  `name` varchar(40) NOT NULL,
  `price` decimal(15,2) NOT NULL,
  `status` enum('AVAILABLE','OUT_OF_STOCK','UNAVAILABLE') NOT NULL,
  `category_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKkomdx99dhk2cveaxugl2lws2u` (`category_id`),
  CONSTRAINT `FKkomdx99dhk2cveaxugl2lws2u` FOREIGN KEY (`category_id`) REFERENCES `category` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=55 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `food`
--

LOCK TABLES `food` WRITE;
/*!40000 ALTER TABLE `food` DISABLE KEYS */;
INSERT INTO `food` VALUES (2,'Chả giò truyền thống nhân thịt heo, miến, nấm mèo chiên vàng giòn rụm','https://images.unsplash.com/photo-1544025162-d76694265947?w=400','Chả giò chiên giòn',65000.00,'UNAVAILABLE',1),(3,'Ngó sen giòn trộn cùng tôm, thịt heo luộc, rau thơm, nước mắm chua ngọt','https://images.unsplash.com/photo-1551326844-4df70f78d0e9?w=400','Gỏi ngó sen tôm thịt',75000.00,'AVAILABLE',1),(4,'Súp cua thơm ngon với trứng bắc thảo, nấm đông cô','https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400','Súp cua trứng bắc thảo',60000.00,'AVAILABLE',1),(5,'Bánh tôm chiên giòn kiểu Hà Nội, ăn kèm rau sống','https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400','Bánh tôm Hồ Tây',70000.00,'AVAILABLE',1),(6,'Nem chua rán giòn tan, chấm tương ớt','https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400','Nem chua rán',55000.00,'AVAILABLE',1),(7,'Phở bò truyền thống với nước dùng hầm xương 12 tiếng, thịt bò tái và nạm','https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=400','Phở bò tái nạm',65000.00,'AVAILABLE',2),(8,'Phở với thịt bò tái xào tỏi thơm lừng trên mặt','https://images.unsplash.com/photo-1555126634-323283e090fa?w=400','Phở bò tái lăn',70000.00,'AVAILABLE',2),(9,'Phở gà nước trong, thịt gà ta xé sợi mềm ngọt','https://images.unsplash.com/photo-1576577445504-6af96477db52?w=400','Phở gà',60000.00,'AVAILABLE',2),(10,'Bún bò Huế cay nồng đặc trưng với giò heo, chả cua','https://images.unsplash.com/photo-1569058242567-93de6f36f8e6?w=400','Bún bò Huế',70000.00,'AVAILABLE',2),(11,'Bún chả nướng than hoa kiểu Hà Nội, kèm rau sống và nước chấm','https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=400','Bún chả Hà Nội',65000.00,'AVAILABLE',2),(12,'Bún riêu cua đồng với gạch cua, đậu hũ, cà chua','https://images.unsplash.com/photo-1583032015879-e5022cb87c3b?w=400','Bún riêu cua',60000.00,'AVAILABLE',2),(13,'Hủ tiếu nước trong với tôm, thịt, gan, trứng cút','https://images.unsplash.com/photo-1555126634-323283e090fa?w=400','Hủ tiếu Nam Vang',65000.00,'AVAILABLE',2),(14,'Cơm tấm Sài Gòn với sườn nướng, bì, chả trứng, đồ chua','https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400','Cơm tấm sườn bì chả',65000.00,'AVAILABLE',3),(15,'Cơm chiên với tôm, lạp xưởng, trứng, đậu hà lan','https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400','Cơm chiên Dương Châu',60000.00,'AVAILABLE',3),(16,'Cơm gà Hải Nam da giòn, cơm nấu nước luộc gà thơm ngậy','https://images.unsplash.com/photo-1569058242567-93de6f36f8e6?w=400','Cơm gà Hải Nam',75000.00,'AVAILABLE',3),(17,'Cơm rang với thịt bò xào dưa cải, hành lá','https://images.unsplash.com/photo-1596797038530-2c107229654b?w=400','Cơm rang dưa bò',70000.00,'AVAILABLE',3),(18,'Cơm niêu đất với tôm, thịt kho, cháy giòn đáy nồi','https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400','Cơm niêu tôm thịt',85000.00,'AVAILABLE',3),(19,'Cơm trắng kèm bò lúc lắc xào tiêu đen, khoai tây chiên','https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400','Cơm bò lúc lắc',80000.00,'AVAILABLE',3),(20,'Lẩu Thái chua cay với tôm sú, mực, nấm, rau','https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400','Lẩu Thái Tom Yum',250000.00,'AVAILABLE',4),(21,'Lẩu gà ta nấu với lá é Đà Lạt thơm lừng','https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400','Lẩu gà lá é',220000.00,'AVAILABLE',4),(22,'Lẩu giấm chua nhẹ nhúng thịt bò tươi, rau sống','https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400','Lẩu bò nhúng giấm',280000.00,'AVAILABLE',4),(23,'Lẩu hải sản tổng hợp: tôm, cua, mực, cá, nghêu','https://images.unsplash.com/photo-1559847844-5315695dadae?w=400','Lẩu hải sản',320000.00,'AVAILABLE',4),(24,'Lẩu nấm thập cẩm với đậu hũ, rau củ tươi','https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400','Lẩu nấm chay',180000.00,'AVAILABLE',4),(25,'Tôm sú tươi nướng muối ớt kiểu Thái','https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=400','Tôm sú nướng muối ớt',180000.00,'AVAILABLE',5),(26,'Mực tươi tẩm bột chiên giòn, chấm sốt mayonnaise','https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400','Mực chiên giòn',120000.00,'AVAILABLE',5),(27,'Cua biển rang với sốt me chua ngọt đậm đà','https://images.unsplash.com/photo-1559847844-5315695dadae?w=400','Cua rang me',350000.00,'AVAILABLE',5),(28,'Cá lóc nướng trui cuốn bánh tráng, rau sống','https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400','Cá lóc nướng trui',150000.00,'AVAILABLE',5),(29,'Nghêu hấp sả ớt thơm nức, nước chấm gừng','https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=400','Nghêu hấp sả',90000.00,'AVAILABLE',5),(30,'Ốc hương rang muối ớt giòn thơm','https://images.unsplash.com/photo-1559847844-5315695dadae?w=400','Ốc hương rang muối',160000.00,'AVAILABLE',5),(31,'Sườn non heo ướp sốt BBQ nướng than hoa','https://images.unsplash.com/photo-1544025162-d76694265947?w=400','Sườn non nướng BBQ',150000.00,'AVAILABLE',6),(32,'Gà ta nướng mật ong giòn da, thơm ngọt','https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=400','Gà nướng mật ong',180000.00,'AVAILABLE',6),(33,'Bò Úc áp chảo medium rare, sốt tiêu đen','https://images.unsplash.com/photo-1600891964092-4316c288032e?w=400','Bò bít tết',200000.00,'AVAILABLE',6),(34,'Thịt ba chỉ kho tàu trứng cút, nước dừa','https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400','Thịt kho tàu',85000.00,'AVAILABLE',6),(35,'Gà ta xối mỡ giòn rụm da vàng ươm','https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=400','Gà xối mỡ',160000.00,'AVAILABLE',6),(36,'Bò Úc xào lúc lắc tiêu đen, hành tây, ớt chuông','https://images.unsplash.com/photo-1600891964092-4316c288032e?w=400','Bò xào lúc lắc',140000.00,'AVAILABLE',6),(37,'Đậu hũ chiên giòn sốt cà chua chua ngọt','https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400','Đậu hũ sốt cà chua',50000.00,'AVAILABLE',7),(38,'Rau củ thập cẩm xào tỏi: bông cải, cà rốt, đậu Hà Lan','https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400','Rau xào thập cẩm',55000.00,'AVAILABLE',7),(39,'Nấm đùi gà xào bơ tỏi thơm béo ngậy','https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400','Nấm đùi gà xào bơ tỏi',70000.00,'AVAILABLE',7),(40,'Canh khổ qua nhồi nấm đông cô, thanh mát','https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400','Canh khổ qua nhồi nấm',60000.00,'AVAILABLE',7),(41,'Cơm chiên với nấm, đậu hũ, rau củ các loại','https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400','Cơm chiên chay',55000.00,'AVAILABLE',7),(42,'Chè khúc bạch mát lạnh với nhãn, vải, thạch lá dứa','https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400','Chè khúc bạch',35000.00,'AVAILABLE',8),(43,'Bánh flan mềm mịn với caramel đắng nhẹ','https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400','Bánh flan caramel',30000.00,'AVAILABLE',8),(44,'Kem dừa tươi phục vụ trong trái dừa non','https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=400','Kem dừa trái dừa',45000.00,'AVAILABLE',8),(45,'Đĩa trái cây tươi theo mùa','https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?w=400','Trái cây theo mùa',40000.00,'AVAILABLE',8),(46,'Chè bưởi nước cốt dừa béo ngậy','https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400','Chè bưởi',30000.00,'AVAILABLE',8),(47,'Trà đào cam sả tươi mát, thanh nhiệt','https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400','Trà đào cam sả',40000.00,'AVAILABLE',9),(48,'Cà phê phin truyền thống Việt Nam pha sữa đặc','https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400','Cà phê sữa đá',30000.00,'AVAILABLE',9),(49,'Sinh tố bơ sáp Đắk Lắk béo ngậy','https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=400','Sinh tố bơ',45000.00,'AVAILABLE',9),(50,'Nước ép cam tươi 100% nguyên chất','https://images.unsplash.com/photo-1534353473418-4cfa6c56fd38?w=400','Nước ép cam tươi',35000.00,'AVAILABLE',9),(51,'Bia Sài Gòn Special lon 330ml','https://images.unsplash.com/photo-1535958636474-b021ee887b13?w=400','Bia Sài Gòn',25000.00,'AVAILABLE',9),(52,'Nước khoáng thiên nhiên 500ml','https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=400','Nước suối',15000.00,'AVAILABLE',9),(53,'Trà hoa sen thơm nhẹ, hậu ngọt','https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400','Trà sen vàng',35000.00,'AVAILABLE',9);
/*!40000 ALTER TABLE `food` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `invoice`
--

DROP TABLE IF EXISTS `invoice`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `invoice` (
  `id` int NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) NOT NULL,
  `total_amount` decimal(12,2) NOT NULL,
  `booking_id` int DEFAULT NULL,
  `voucher_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK32ywtxrkeu1wnmivu6mlcqdid` (`booking_id`),
  KEY `FKh8mc37lrohbk7stgatwwn5doq` (`voucher_id`),
  CONSTRAINT `FK4jd6uuk7w0d72riyre2w14fl7` FOREIGN KEY (`booking_id`) REFERENCES `booking` (`id`),
  CONSTRAINT `FKh8mc37lrohbk7stgatwwn5doq` FOREIGN KEY (`voucher_id`) REFERENCES `voucher` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `invoice`
--

LOCK TABLES `invoice` WRITE;
/*!40000 ALTER TABLE `invoice` DISABLE KEYS */;
INSERT INTO `invoice` VALUES (1,'2026-05-08 13:59:24.704884',170000.00,2,NULL),(2,'2026-06-14 16:06:55.006998',65000.00,6,NULL),(3,'2026-06-14 20:11:45.806959',70000.00,7,NULL),(4,'2026-06-14 20:46:16.950261',125000.00,8,NULL),(5,'2026-06-14 21:41:49.867678',280000.00,10,4),(6,'2026-06-15 06:20:11.698832',375000.00,11,5),(7,'2026-06-15 08:42:03.368893',385000.00,14,NULL),(8,'2026-07-11 14:59:04.071319',65000.00,15,NULL);
/*!40000 ALTER TABLE `invoice` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order_detail`
--

DROP TABLE IF EXISTS `order_detail`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order_detail` (
  `id` int NOT NULL AUTO_INCREMENT,
  `price` decimal(10,2) NOT NULL,
  `quantity` int NOT NULL,
  `combo_id` int DEFAULT NULL,
  `food_id` int DEFAULT NULL,
  `order_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKtlelomj1ok21jglgntfr48j2q` (`combo_id`),
  KEY `FKiyi4bmnb8vf4hdbbcduu43kin` (`food_id`),
  KEY `FKrws2q0si6oyd6il8gqe2aennc` (`order_id`),
  CONSTRAINT `FKiyi4bmnb8vf4hdbbcduu43kin` FOREIGN KEY (`food_id`) REFERENCES `food` (`id`),
  CONSTRAINT `FKrws2q0si6oyd6il8gqe2aennc` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`),
  CONSTRAINT `FKtlelomj1ok21jglgntfr48j2q` FOREIGN KEY (`combo_id`) REFERENCES `combo` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_detail`
--

LOCK TABLES `order_detail` WRITE;
/*!40000 ALTER TABLE `order_detail` DISABLE KEYS */;
INSERT INTO `order_detail` VALUES (1,95000.00,1,2,NULL,1),(2,75000.00,1,NULL,16,1),(3,60000.00,1,NULL,15,2),(4,65000.00,1,NULL,2,3),(5,70000.00,1,NULL,8,4),(6,60000.00,1,NULL,15,5),(7,65000.00,1,NULL,7,5),(8,350000.00,1,3,NULL,6),(9,750000.00,1,5,NULL,7),(10,75000.00,3,NULL,3,8),(11,65000.00,1,NULL,7,8),(12,60000.00,1,NULL,9,8),(13,35000.00,1,NULL,53,8),(14,65000.00,1,NULL,11,9);
/*!40000 ALTER TABLE `order_detail` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `id` int NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) NOT NULL,
  `status` enum('CANCELLED','CONFIRMED','PENDING') NOT NULL,
  `total_amount` decimal(12,2) NOT NULL,
  `booking_id` int DEFAULT NULL,
  `user_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKefcisww3p65q7488c5t4l0mg5` (`booking_id`),
  KEY `FK32ql8ubntj5uh44ph9659tiih` (`user_id`),
  CONSTRAINT `FK32ql8ubntj5uh44ph9659tiih` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `FKefcisww3p65q7488c5t4l0mg5` FOREIGN KEY (`booking_id`) REFERENCES `booking` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
INSERT INTO `orders` VALUES (1,'2026-05-08 13:59:19.310208','CONFIRMED',170000.00,2,2),(2,'2026-05-30 12:18:44.857064','CONFIRMED',60000.00,5,2),(3,'2026-06-14 16:06:52.590356','CONFIRMED',65000.00,6,3),(4,'2026-06-14 20:11:36.514705','CONFIRMED',70000.00,7,2),(5,'2026-06-14 20:46:06.906136','CONFIRMED',125000.00,8,2),(6,'2026-06-14 21:41:44.646606','CONFIRMED',280000.00,10,2),(7,'2026-06-15 06:19:12.328940','CONFIRMED',375000.00,11,2),(8,'2026-06-15 08:42:00.717992','CONFIRMED',385000.00,14,4),(9,'2026-07-11 14:59:01.527056','CONFIRMED',65000.00,15,2);
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payment`
--

DROP TABLE IF EXISTS `payment`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payment` (
  `id` int NOT NULL AUTO_INCREMENT,
  `amount` decimal(12,2) NOT NULL,
  `method` enum('BANK_TRANSFER','CASH') NOT NULL,
  `paid_at` datetime(6) NOT NULL,
  `invoice_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK4l6ndm1m1iw9knbdtxd6m6fyc` (`invoice_id`),
  CONSTRAINT `FKsb24p8f52refbb80qwp4gem9n` FOREIGN KEY (`invoice_id`) REFERENCES `invoice` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payment`
--

LOCK TABLES `payment` WRITE;
/*!40000 ALTER TABLE `payment` DISABLE KEYS */;
INSERT INTO `payment` VALUES (1,170000.00,'CASH','2026-05-08 13:59:24.717272',1),(2,65000.00,'BANK_TRANSFER','2026-06-14 16:06:55.020419',2),(3,70000.00,'BANK_TRANSFER','2026-06-14 20:11:45.822158',3),(4,125000.00,'BANK_TRANSFER','2026-06-14 20:46:16.969303',4),(5,280000.00,'BANK_TRANSFER','2026-06-14 21:41:49.876678',5),(6,375000.00,'BANK_TRANSFER','2026-06-15 06:20:11.708887',6),(7,385000.00,'BANK_TRANSFER','2026-06-15 08:42:03.386697',7),(8,65000.00,'BANK_TRANSFER','2026-07-11 14:59:04.080360',8);
/*!40000 ALTER TABLE `payment` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `res_table`
--

DROP TABLE IF EXISTS `res_table`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `res_table` (
  `id` int NOT NULL AUTO_INCREMENT,
  `capacity` int NOT NULL,
  `description` text NOT NULL,
  `name` varchar(50) NOT NULL,
  `occupied_at` datetime(6) DEFAULT NULL,
  `reserved_at` datetime(6) DEFAULT NULL,
  `status` enum('AVAILABLE','OCCUPIED','RESERVED') NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `res_table`
--

LOCK TABLES `res_table` WRITE;
/*!40000 ALTER TABLE `res_table` DISABLE KEYS */;
INSERT INTO `res_table` VALUES (1,2,'Bàn đôi cạnh cửa sổ, view đẹp','Bàn 01',NULL,NULL,'AVAILABLE'),(2,2,'Bàn đôi khu vực yên tĩnh','Bàn 02','2026-07-11 15:00:49.345350',NULL,'OCCUPIED'),(3,2,'Bàn đôi lãng mạn có nến','Bàn 03',NULL,NULL,'AVAILABLE'),(4,2,'Bàn đôi gần quầy bar','Bàn 04',NULL,NULL,'AVAILABLE'),(5,2,'Bàn đôi ngoài sân vườn','Bàn 05',NULL,NULL,'AVAILABLE'),(6,4,'Bàn 4 người khu trung tâm','Bàn 06',NULL,NULL,'AVAILABLE'),(7,4,'Bàn 4 người cạnh cửa sổ','Bàn 07',NULL,NULL,'AVAILABLE'),(8,4,'Bàn 4 người khu gia đình','Bàn 08',NULL,NULL,'AVAILABLE'),(9,4,'Bàn 4 người sân vườn','Bàn 09',NULL,NULL,'AVAILABLE'),(10,4,'Bàn 4 người gần bếp mở','Bàn 10',NULL,NULL,'AVAILABLE'),(11,4,'Bàn 4 người tầng 1','Bàn 11',NULL,NULL,'AVAILABLE'),(12,4,'Bàn 4 người tầng 2','Bàn 12',NULL,NULL,'AVAILABLE'),(13,4,'Bàn 4 người khu VIP','Bàn 13',NULL,NULL,'AVAILABLE'),(14,6,'Bàn 6 người phòng riêng A','Bàn 14',NULL,NULL,'AVAILABLE'),(15,6,'Bàn 6 người phòng riêng B','Bàn 15',NULL,NULL,'AVAILABLE'),(16,6,'Bàn 6 người khu trung tâm','Bàn 16',NULL,NULL,'AVAILABLE'),(17,6,'Bàn 6 người sân thượng','Bàn 17',NULL,NULL,'AVAILABLE'),(18,6,'Bàn 6 người cạnh hồ cá','Bàn 18',NULL,NULL,'AVAILABLE'),(19,8,'Bàn 8 người phòng VIP 1','Bàn 19',NULL,NULL,'AVAILABLE'),(20,8,'Bàn 8 người phòng VIP 2','Bàn 20',NULL,NULL,'AVAILABLE'),(21,8,'Bàn 8 người sân vườn lớn','Bàn 21',NULL,NULL,'AVAILABLE'),(22,8,'Bàn 8 người tầng 2','Bàn 22',NULL,NULL,'AVAILABLE'),(23,10,'Bàn 10 người phòng tiệc A','Bàn 23',NULL,NULL,'AVAILABLE'),(24,10,'Bàn 10 người phòng tiệc B','Bàn 24',NULL,NULL,'AVAILABLE'),(25,10,'Bàn 10 người sân thượng','Bàn 25',NULL,NULL,'AVAILABLE'),(26,12,'Bàn 12 người đại tiệc 1','Bàn 26',NULL,NULL,'AVAILABLE'),(27,12,'Bàn 12 người đại tiệc 2','Bàn 27',NULL,NULL,'AVAILABLE'),(28,15,'Bàn 15 người phòng hội nghị','Bàn 28',NULL,NULL,'AVAILABLE'),(29,20,'Bàn 20 người phòng sự kiện','Bàn 29',NULL,NULL,'AVAILABLE'),(30,6,'Bàn tròn 6 người ngoài trời','Bàn 30',NULL,NULL,'AVAILABLE');
/*!40000 ALTER TABLE `res_table` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `system_log`
--

DROP TABLE IF EXISTS `system_log`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `system_log` (
  `id` int NOT NULL AUTO_INCREMENT,
  `action` tinyint NOT NULL,
  `detail` text NOT NULL,
  `logged_at` datetime(6) NOT NULL,
  `user_id` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKa4qwjkjmascolvjmsiqmg8c6s` (`user_id`),
  CONSTRAINT `FKa4qwjkjmascolvjmsiqmg8c6s` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `system_log_chk_1` CHECK ((`action` between 0 and 4))
) ENGINE=InnoDB AUTO_INCREMENT=82 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `system_log`
--

LOCK TABLES `system_log` WRITE;
/*!40000 ALTER TABLE `system_log` DISABLE KEYS */;
INSERT INTO `system_log` VALUES (1,0,'Tạo comment #1 | Food: Chả giò chiên giòn | Rating: 3','2026-05-08 13:53:16.027614',1),(2,2,'Delete comment #1','2026-05-08 13:53:29.333777',1),(3,0,'Tạo order #1 | Tổng tiền: 170000.00 | Số món: 2','2026-05-08 13:59:19.325879',2),(4,1,'Checkout created invoice #1 and payment #1 for order #1 via CASH | trạng thái order giữ ở PENDING','2026-05-08 13:59:24.722248',2),(5,0,'Tạo order #2 | Tổng tiền: 60000.00 | Số món: 1','2026-05-30 12:18:44.873185',2),(6,1,'Update order #2 status: CONFIRMED','2026-05-30 12:22:21.730527',1),(7,3,'Đăng nhập tài khoản user #1 | Email: admin@gmail.com','2026-06-14 15:36:14.973386',1),(8,1,'Xác nhận booking #5 | Số order tự động xác nhận: 1','2026-06-14 15:36:26.808844',1),(9,1,'Xác nhận booking #5 | Số order tự động xác nhận: 1','2026-06-14 15:36:28.136969',1),(10,1,'Xác nhận booking #4 | Số order tự động xác nhận: 0','2026-06-14 15:36:29.269727',1),(11,1,'Xác nhận booking #3 | Số order tự động xác nhận: 0','2026-06-14 15:36:30.708445',1),(12,0,'Upload file: 84d7c1f3-2d22-45da-8813-b95c8808e336.png | Original: 74da3f39-759b-4f08-8850-4c8f2937e81a-1_mangeshdes.png','2026-06-14 15:41:23.267830',1),(13,0,'Tạo món ăn #54 | Tên: y4','2026-06-14 15:41:39.755328',1),(14,2,'Xóa món ăn #54 | Tên: y4','2026-06-14 15:42:01.789182',1),(15,0,'Đăng ký tài khoản user #3 | Email: Duongqua@gmail.com','2026-06-14 15:45:24.172198',3),(16,3,'Đăng nhập tài khoản user #1 | Email: admin@gmail.com','2026-06-14 15:45:40.743307',1),(17,1,'Khóa tài khoản user #3 | Email: Duongqua@gmail.com','2026-06-14 15:48:08.105616',1),(18,3,'Đăng nhập tài khoản user #2 | Email: ngocquang04032005@gmail.com','2026-06-14 15:48:38.766793',2),(19,1,'Cập nhật thông tin cá nhân user #2','2026-06-14 15:48:51.026018',2),(20,3,'Đăng nhập tài khoản user #1 | Email: admin@gmail.com','2026-06-14 15:49:05.038246',1),(21,1,'Kích hoạt tài khoản user #3 | Email: Duongqua@gmail.com','2026-06-14 15:49:12.138251',1),(22,1,'Khóa tài khoản user #3 | Email: Duongqua@gmail.com','2026-06-14 15:49:16.782578',1),(23,1,'Kích hoạt tài khoản user #3 | Email: Duongqua@gmail.com','2026-06-14 15:49:21.356771',1),(24,3,'Đăng nhập tài khoản user #2 | Email: ngocquang04032005@gmail.com','2026-06-14 15:59:46.914660',2),(25,0,'Tạo comment #2 | Food: Phở bò tái lăn | Rating: 3','2026-06-14 16:00:05.572882',2),(26,3,'Đăng nhập tài khoản user #3 | Email: Duongqua@gmail.com','2026-06-14 16:00:58.341536',3),(27,0,'Tạo comment #3 | Food: Phở bò tái lăn | Rating: 5','2026-06-14 16:01:18.610476',3),(28,0,'Tạo booking #6 | Khách: Dương Quá | Số khách: 4 | Thời gian: 2026-06-14T16:03','2026-06-14 16:02:15.077277',3),(29,3,'Đăng nhập tài khoản user #2 | Email: ngocquang04032005@gmail.com','2026-06-14 16:05:24.245427',2),(30,3,'Đăng nhập tài khoản user #2 | Email: ngocquang04032005@gmail.com','2026-06-14 16:06:04.357829',2),(31,3,'Đăng nhập tài khoản user #3 | Email: Duongqua@gmail.com','2026-06-14 16:06:24.727575',3),(32,0,'Tạo order #3 | Tổng tiền: 65000.00 | Số món: 1','2026-06-14 16:06:52.606441',3),(33,1,'Checkout created invoice #2 and payment #2 for order #3 via BANK_TRANSFER | trạng thái order giữ ở PENDING','2026-06-14 16:06:55.024376',3),(34,3,'Đăng nhập tài khoản user #1 | Email: admin@gmail.com','2026-06-14 16:07:09.502670',1),(35,1,'Xác nhận booking #6 | Số order tự động xác nhận: 1','2026-06-14 16:07:37.122193',1),(36,3,'Đăng nhập tài khoản user #2 | Email: ngocquang04032005@gmail.com','2026-06-14 20:10:02.096571',2),(37,0,'Tạo booking #7 | Khách: Đoàn Ngọc Quang | Số khách: 4 | Thời gian: 2026-06-15T08:11','2026-06-14 20:11:25.681209',2),(38,0,'Tạo order #4 | Tổng tiền: 70000.00 | Số món: 1','2026-06-14 20:11:36.529214',2),(39,1,'Checkout created invoice #3 and payment #3 for order #4 via BANK_TRANSFER | trạng thái order giữ ở PENDING','2026-06-14 20:11:45.829065',2),(40,3,'Đăng nhập tài khoản user #2 | Email: ngocquang04032005@gmail.com','2026-06-14 20:45:19.858548',2),(41,0,'Tạo booking #8 | Khách: Đoàn Ngọc Quang | Số khách: 2 | Thời gian: 2026-06-15T08:45','2026-06-14 20:45:58.245338',2),(42,0,'Tạo order #5 | Tổng tiền: 125000.00 | Số món: 2','2026-06-14 20:46:06.929179',2),(43,1,'Checkout created invoice #4 and payment #4 for order #5 via BANK_TRANSFER | trạng thái order giữ ở PENDING','2026-06-14 20:46:16.974200',2),(44,3,'Đăng nhập tài khoản user #1 | Email: admin@gmail.com','2026-06-14 21:38:17.167248',1),(45,3,'Đăng nhập tài khoản user #2 | Email: ngocquang04032005@gmail.com','2026-06-14 21:39:44.703995',2),(46,0,'Tạo booking #9 | Khách: Đoàn Ngọc Quang | Số khách: 2 | Thời gian: 2026-06-16T08:39','2026-06-14 21:40:03.179989',2),(47,1,'Xác nhận booking #7 | Số order tự động xác nhận: 1','2026-06-14 21:40:32.441950',2),(48,1,'Xác nhận booking #8 | Số order tự động xác nhận: 1','2026-06-14 21:40:34.214242',2),(49,1,'Xác nhận booking #9 | Số order tự động xác nhận: 0','2026-06-14 21:40:36.709781',2),(50,0,'Tạo voucher #4 | Mã: AK12 | Số lượng: 4','2026-06-14 21:41:02.575945',2),(51,0,'Tạo booking #10 | Khách: Đoàn Ngọc Quang | Số khách: 2 | Thời gian: 2026-06-16T10:41','2026-06-14 21:41:38.186325',2),(52,0,'Tạo order #6 | Tổng tiền: 350000.00 | Số món: 1','2026-06-14 21:41:44.661727',2),(53,0,'Áp dụng Voucher AK12 cho Order #6','2026-06-14 21:41:49.848104',2),(54,1,'Checkout created invoice #5 and payment #5 for order #6 via BANK_TRANSFER | trạng thái order giữ ở PENDING','2026-06-14 21:41:49.879807',2),(55,1,'Xác nhận booking #10 | Số order tự động xác nhận: 1','2026-06-14 21:42:13.326564',2),(56,3,'Đăng nhập tài khoản user #1 | Email: admin@gmail.com','2026-06-14 21:50:33.568306',1),(57,3,'Đăng nhập tài khoản user #1 | Email: admin@gmail.com','2026-06-15 06:17:28.684718',1),(58,3,'Đăng nhập tài khoản user #2 | Email: ngocquang04032005@gmail.com','2026-06-15 06:18:25.545760',2),(59,0,'Tạo booking #11 | Khách: Đoàn Ngọc Quang | Số khách: 4 | Thời gian: 2026-06-15T08:18','2026-06-15 06:18:50.574804',2),(60,0,'Tạo comment #4 | Combo: Combo Tiệc Nhóm | Rating: 4','2026-06-15 06:19:03.009051',2),(61,0,'Tạo order #7 | Tổng tiền: 750000.00 | Số món: 1','2026-06-15 06:19:12.342206',2),(62,0,'Tạo voucher #5 | Mã: AK13 | Số lượng: 4','2026-06-15 06:19:59.443934',2),(63,0,'Áp dụng Voucher AK13 cho Order #7','2026-06-15 06:20:11.668205',2),(64,1,'Checkout created invoice #6 and payment #6 for order #7 via BANK_TRANSFER | trạng thái order giữ ở PENDING','2026-06-15 06:20:11.713014',2),(65,1,'Xác nhận booking #11 | Số order tự động xác nhận: 1','2026-06-15 06:20:56.466903',2),(66,3,'Đăng nhập tài khoản user #1 | Email: admin@gmail.com','2026-06-15 08:18:52.661469',1),(67,3,'Đăng nhập tài khoản user #2 | Email: ngocquang04032005@gmail.com','2026-06-15 08:19:04.799603',2),(68,0,'Tạo booking #12 | Khách: Đoàn Ngọc Quang | Số khách: 2 | Thời gian: 2026-06-16T10:19','2026-06-15 08:20:53.075333',2),(69,1,'Xác nhận booking #12 | Số order tự động xác nhận: 0','2026-06-15 08:22:56.716701',2),(70,1,'Cập nhật món ăn #2 | Tên: Chả giò chiên giòn','2026-06-15 08:25:09.647115',2),(71,0,'Tạo booking #13 | Khách: Đoàn Ngọc Quang | Số khách: 2 | Thời gian: 2026-06-26T08:29','2026-06-15 08:28:25.035652',2),(72,3,'Đăng nhập tài khoản user #4 | Email: admin1@gmail.com','2026-06-15 08:40:11.253098',4),(73,0,'Tạo booking #14 | Khách: Super Administrator | Số khách: 2 | Thời gian: 2027-12-03T12:00','2026-06-15 08:41:45.067655',4),(74,0,'Tạo order #8 | Tổng tiền: 385000.00 | Số món: 4','2026-06-15 08:42:00.731918',4),(75,1,'Checkout created invoice #7 and payment #7 for order #8 via BANK_TRANSFER | trạng thái order giữ ở PENDING','2026-06-15 08:42:03.390586',4),(76,1,'Xác nhận booking #14 | Số order tự động xác nhận: 1','2026-06-15 08:42:13.699850',4),(77,1,'Xác nhận booking #13 | Số order tự động xác nhận: 0','2026-06-15 08:42:15.654130',4),(78,0,'Tạo comment #5 | Food: Bún chả Hà Nội | Rating: 3','2026-07-11 14:58:55.160806',2),(79,0,'Tạo order #9 | Tổng tiền: 65000.00 | Số món: 1','2026-07-11 14:59:01.536159',2),(80,1,'Checkout created invoice #8 and payment #8 for order #9 via BANK_TRANSFER | trạng thái order giữ ở PENDING','2026-07-11 14:59:04.083323',2),(81,1,'Update order #9 status: CONFIRMED','2026-07-11 14:59:58.350980',1);
/*!40000 ALTER TABLE `system_log` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) NOT NULL,
  `email` varchar(100) NOT NULL,
  `fullname` varchar(100) NOT NULL,
  `is_active` bit(1) NOT NULL,
  `password` varchar(255) NOT NULL,
  `phone` varchar(15) NOT NULL,
  `role` enum('ADMIN','CUSTOMER') NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK6dotkott2kjsp8vw4d0m25fb7` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'2026-04-22 22:33:13.528995','admin@gmail.com','Super Administrator',_binary '','$2a$10$.8aUEWyNFZZshAGnd7llaOqqnVdL73LrrtthXPnvH/WZwOwtINvlu','0123456789','ADMIN'),(2,'2026-04-22 23:27:51.077781','ngocquang04032005@gmail.com','Đoàn Ngọc Quang',_binary '','$2a$10$N9QAbPIUliOqZXwERskSA.jDk3zjcl0n87QYtO4LHzKT2DhXiXjAO','12345690','CUSTOMER'),(3,'2026-06-14 15:45:24.161503','Duongqua@gmail.com','Dương Quá',_binary '\0','$2a$10$9p4DdIw9zCZkLKifwwN6Ce7N0T5i2LFMwHyyYbS7p8AYDZA/teuBW','01249425113','CUSTOMER'),(4,'2026-06-15 08:39:40.152066','admin1@gmail.com','Super Administrator',_binary '','$2a$10$.gRZSAzR6NmpHShHwDo.W.LwDAVUdKB33QBXBh.92FE3M3hhihCBa','0123456789','ADMIN');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `voucher`
--

DROP TABLE IF EXISTS `voucher`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `voucher` (
  `id` int NOT NULL AUTO_INCREMENT,
  `code` varchar(50) NOT NULL,
  `discount_type` enum('FIXED','PERCENT') NOT NULL,
  `discount_value` decimal(10,2) NOT NULL,
  `end_date` datetime(6) NOT NULL,
  `quantity` int NOT NULL,
  `start_date` datetime(6) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UKpvh1lqheshnjoekevvwla03xn` (`code`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `voucher`
--

LOCK TABLES `voucher` WRITE;
/*!40000 ALTER TABLE `voucher` DISABLE KEYS */;
INSERT INTO `voucher` VALUES (1,'HELLO12','PERCENT',10.00,'2026-04-30 22:45:00.000000',12,'2026-04-22 06:40:00.000000'),(2,'BLACKFRIDAY','PERCENT',40.00,'2026-04-30 04:28:00.000000',12,'2026-04-22 23:28:00.000000'),(3,'AK47','FIXED',20.00,'2026-05-29 21:16:00.000000',2,'2026-05-27 21:16:00.000000'),(4,'AK12','PERCENT',20.00,'2026-06-25 21:40:00.000000',3,'2026-06-14 21:40:00.000000'),(5,'AK13','PERCENT',50.00,'2026-06-23 06:19:00.000000',3,'2026-06-15 06:19:00.000000');
/*!40000 ALTER TABLE `voucher` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `voucher_detail`
--

DROP TABLE IF EXISTS `voucher_detail`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `voucher_detail` (
  `id` int NOT NULL AUTO_INCREMENT,
  `used` bit(1) NOT NULL,
  `used_at` datetime(6) DEFAULT NULL,
  `user_id` int DEFAULT NULL,
  `voucher_id` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKkqugm14sl5t94e7toitkc2vkp` (`user_id`),
  KEY `FKq2bwpsy6xqko0o5oakc1lmj46` (`voucher_id`),
  CONSTRAINT `FKkqugm14sl5t94e7toitkc2vkp` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `FKq2bwpsy6xqko0o5oakc1lmj46` FOREIGN KEY (`voucher_id`) REFERENCES `voucher` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `voucher_detail`
--

LOCK TABLES `voucher_detail` WRITE;
/*!40000 ALTER TABLE `voucher_detail` DISABLE KEYS */;
INSERT INTO `voucher_detail` VALUES (1,_binary '','2026-06-14 21:41:49.838052',2,4),(2,_binary '','2026-06-15 06:20:11.661668',2,5);
/*!40000 ALTER TABLE `voucher_detail` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-07-15 17:29:14
