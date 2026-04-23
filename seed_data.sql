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
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `booking`
--

LOCK TABLES `booking` WRITE;
/*!40000 ALTER TABLE `booking` DISABLE KEYS */;
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
) ENGINE=InnoDB AUTO_INCREMENT=54 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `food`
--

LOCK TABLES `food` WRITE;
/*!40000 ALTER TABLE `food` DISABLE KEYS */;
INSERT INTO `food` VALUES (2,'Chả giò truyền thống nhân thịt heo, miến, nấm mèo chiên vàng giòn rụm','https://images.unsplash.com/photo-1544025162-d76694265947?w=400','Chả giò chiên giòn',65000.00,'AVAILABLE',1),(3,'Ngó sen giòn trộn cùng tôm, thịt heo luộc, rau thơm, nước mắm chua ngọt','https://images.unsplash.com/photo-1551326844-4df70f78d0e9?w=400','Gỏi ngó sen tôm thịt',75000.00,'AVAILABLE',1),(4,'Súp cua thơm ngon với trứng bắc thảo, nấm đông cô','https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400','Súp cua trứng bắc thảo',60000.00,'AVAILABLE',1),(5,'Bánh tôm chiên giòn kiểu Hà Nội, ăn kèm rau sống','https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400','Bánh tôm Hồ Tây',70000.00,'AVAILABLE',1),(6,'Nem chua rán giòn tan, chấm tương ớt','https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400','Nem chua rán',55000.00,'AVAILABLE',1),(7,'Phở bò truyền thống với nước dùng hầm xương 12 tiếng, thịt bò tái và nạm','https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=400','Phở bò tái nạm',65000.00,'AVAILABLE',2),(8,'Phở với thịt bò tái xào tỏi thơm lừng trên mặt','https://images.unsplash.com/photo-1555126634-323283e090fa?w=400','Phở bò tái lăn',70000.00,'AVAILABLE',2),(9,'Phở gà nước trong, thịt gà ta xé sợi mềm ngọt','https://images.unsplash.com/photo-1576577445504-6af96477db52?w=400','Phở gà',60000.00,'AVAILABLE',2),(10,'Bún bò Huế cay nồng đặc trưng với giò heo, chả cua','https://images.unsplash.com/photo-1569058242567-93de6f36f8e6?w=400','Bún bò Huế',70000.00,'AVAILABLE',2),(11,'Bún chả nướng than hoa kiểu Hà Nội, kèm rau sống và nước chấm','https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=400','Bún chả Hà Nội',65000.00,'AVAILABLE',2),(12,'Bún riêu cua đồng với gạch cua, đậu hũ, cà chua','https://images.unsplash.com/photo-1583032015879-e5022cb87c3b?w=400','Bún riêu cua',60000.00,'AVAILABLE',2),(13,'Hủ tiếu nước trong với tôm, thịt, gan, trứng cút','https://images.unsplash.com/photo-1555126634-323283e090fa?w=400','Hủ tiếu Nam Vang',65000.00,'AVAILABLE',2),(14,'Cơm tấm Sài Gòn với sườn nướng, bì, chả trứng, đồ chua','https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400','Cơm tấm sườn bì chả',65000.00,'AVAILABLE',3),(15,'Cơm chiên với tôm, lạp xưởng, trứng, đậu hà lan','https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=400','Cơm chiên Dương Châu',60000.00,'AVAILABLE',3),(16,'Cơm gà Hải Nam da giòn, cơm nấu nước luộc gà thơm ngậy','https://images.unsplash.com/photo-1569058242567-93de6f36f8e6?w=400','Cơm gà Hải Nam',75000.00,'AVAILABLE',3),(17,'Cơm rang với thịt bò xào dưa cải, hành lá','https://images.unsplash.com/photo-1596797038530-2c107229654b?w=400','Cơm rang dưa bò',70000.00,'AVAILABLE',3),(18,'Cơm niêu đất với tôm, thịt kho, cháy giòn đáy nồi','https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400','Cơm niêu tôm thịt',85000.00,'AVAILABLE',3),(19,'Cơm trắng kèm bò lúc lắc xào tiêu đen, khoai tây chiên','https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400','Cơm bò lúc lắc',80000.00,'AVAILABLE',3),(20,'Lẩu Thái chua cay với tôm sú, mực, nấm, rau','https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400','Lẩu Thái Tom Yum',250000.00,'AVAILABLE',4),(21,'Lẩu gà ta nấu với lá é Đà Lạt thơm lừng','https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400','Lẩu gà lá é',220000.00,'AVAILABLE',4),(22,'Lẩu giấm chua nhẹ nhúng thịt bò tươi, rau sống','https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400','Lẩu bò nhúng giấm',280000.00,'AVAILABLE',4),(23,'Lẩu hải sản tổng hợp: tôm, cua, mực, cá, nghêu','https://images.unsplash.com/photo-1559847844-5315695dadae?w=400','Lẩu hải sản',320000.00,'AVAILABLE',4),(24,'Lẩu nấm thập cẩm với đậu hũ, rau củ tươi','https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400','Lẩu nấm chay',180000.00,'AVAILABLE',4),(25,'Tôm sú tươi nướng muối ớt kiểu Thái','https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=400','Tôm sú nướng muối ớt',180000.00,'AVAILABLE',5),(26,'Mực tươi tẩm bột chiên giòn, chấm sốt mayonnaise','https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=400','Mực chiên giòn',120000.00,'AVAILABLE',5),(27,'Cua biển rang với sốt me chua ngọt đậm đà','https://images.unsplash.com/photo-1559847844-5315695dadae?w=400','Cua rang me',350000.00,'AVAILABLE',5),(28,'Cá lóc nướng trui cuốn bánh tráng, rau sống','https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400','Cá lóc nướng trui',150000.00,'AVAILABLE',5),(29,'Nghêu hấp sả ớt thơm nức, nước chấm gừng','https://images.unsplash.com/photo-1565680018434-b513d5e5fd47?w=400','Nghêu hấp sả',90000.00,'AVAILABLE',5),(30,'Ốc hương rang muối ớt giòn thơm','https://images.unsplash.com/photo-1559847844-5315695dadae?w=400','Ốc hương rang muối',160000.00,'AVAILABLE',5),(31,'Sườn non heo ướp sốt BBQ nướng than hoa','https://images.unsplash.com/photo-1544025162-d76694265947?w=400','Sườn non nướng BBQ',150000.00,'AVAILABLE',6),(32,'Gà ta nướng mật ong giòn da, thơm ngọt','https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=400','Gà nướng mật ong',180000.00,'AVAILABLE',6),(33,'Bò Úc áp chảo medium rare, sốt tiêu đen','https://images.unsplash.com/photo-1600891964092-4316c288032e?w=400','Bò bít tết',200000.00,'AVAILABLE',6),(34,'Thịt ba chỉ kho tàu trứng cút, nước dừa','https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400','Thịt kho tàu',85000.00,'AVAILABLE',6),(35,'Gà ta xối mỡ giòn rụm da vàng ươm','https://images.unsplash.com/photo-1598103442097-8b74394b95c6?w=400','Gà xối mỡ',160000.00,'AVAILABLE',6),(36,'Bò Úc xào lúc lắc tiêu đen, hành tây, ớt chuông','https://images.unsplash.com/photo-1600891964092-4316c288032e?w=400','Bò xào lúc lắc',140000.00,'AVAILABLE',6),(37,'Đậu hũ chiên giòn sốt cà chua chua ngọt','https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400','Đậu hũ sốt cà chua',50000.00,'AVAILABLE',7),(38,'Rau củ thập cẩm xào tỏi: bông cải, cà rốt, đậu Hà Lan','https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400','Rau xào thập cẩm',55000.00,'AVAILABLE',7),(39,'Nấm đùi gà xào bơ tỏi thơm béo ngậy','https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400','Nấm đùi gà xào bơ tỏi',70000.00,'AVAILABLE',7),(40,'Canh khổ qua nhồi nấm đông cô, thanh mát','https://images.unsplash.com/photo-1547592166-23ac45744acd?w=400','Canh khổ qua nhồi nấm',60000.00,'AVAILABLE',7),(41,'Cơm chiên với nấm, đậu hũ, rau củ các loại','https://images.unsplash.com/photo-1512058564366-18510be2db19?w=400','Cơm chiên chay',55000.00,'AVAILABLE',7),(42,'Chè khúc bạch mát lạnh với nhãn, vải, thạch lá dứa','https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400','Chè khúc bạch',35000.00,'AVAILABLE',8),(43,'Bánh flan mềm mịn với caramel đắng nhẹ','https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400','Bánh flan caramel',30000.00,'AVAILABLE',8),(44,'Kem dừa tươi phục vụ trong trái dừa non','https://images.unsplash.com/photo-1501443762994-82bd5dace89a?w=400','Kem dừa trái dừa',45000.00,'AVAILABLE',8),(45,'Đĩa trái cây tươi theo mùa','https://images.unsplash.com/photo-1490474418585-ba9bad8fd0ea?w=400','Trái cây theo mùa',40000.00,'AVAILABLE',8),(46,'Chè bưởi nước cốt dừa béo ngậy','https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400','Chè bưởi',30000.00,'AVAILABLE',8),(47,'Trà đào cam sả tươi mát, thanh nhiệt','https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400','Trà đào cam sả',40000.00,'AVAILABLE',9),(48,'Cà phê phin truyền thống Việt Nam pha sữa đặc','https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400','Cà phê sữa đá',30000.00,'AVAILABLE',9),(49,'Sinh tố bơ sáp Đắk Lắk béo ngậy','https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=400','Sinh tố bơ',45000.00,'AVAILABLE',9),(50,'Nước ép cam tươi 100% nguyên chất','https://images.unsplash.com/photo-1534353473418-4cfa6c56fd38?w=400','Nước ép cam tươi',35000.00,'AVAILABLE',9),(51,'Bia Sài Gòn Special lon 330ml','https://images.unsplash.com/photo-1535958636474-b021ee887b13?w=400','Bia Sài Gòn',25000.00,'AVAILABLE',9),(52,'Nước khoáng thiên nhiên 500ml','https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=400','Nước suối',15000.00,'AVAILABLE',9),(53,'Trà hoa sen thơm nhẹ, hậu ngọt','https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400','Trà sen vàng',35000.00,'AVAILABLE',9);
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `invoice`
--

LOCK TABLES `invoice` WRITE;
/*!40000 ALTER TABLE `invoice` DISABLE KEYS */;
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order_detail`
--

LOCK TABLES `order_detail` WRITE;
/*!40000 ALTER TABLE `order_detail` DISABLE KEYS */;
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payment`
--

LOCK TABLES `payment` WRITE;
/*!40000 ALTER TABLE `payment` DISABLE KEYS */;
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
INSERT INTO `res_table` VALUES (1,2,'Bàn đôi cạnh cửa sổ, view đẹp','Bàn 01','2026-04-22 23:04:49.915466',NULL,'OCCUPIED'),(2,2,'Bàn đôi khu vực yên tĩnh','Bàn 02',NULL,NULL,'AVAILABLE'),(3,2,'Bàn đôi lãng mạn có nến','Bàn 03',NULL,NULL,'AVAILABLE'),(4,2,'Bàn đôi gần quầy bar','Bàn 04',NULL,NULL,'AVAILABLE'),(5,2,'Bàn đôi ngoài sân vườn','Bàn 05',NULL,NULL,'AVAILABLE'),(6,4,'Bàn 4 người khu trung tâm','Bàn 06',NULL,NULL,'AVAILABLE'),(7,4,'Bàn 4 người cạnh cửa sổ','Bàn 07',NULL,NULL,'AVAILABLE'),(8,4,'Bàn 4 người khu gia đình','Bàn 08',NULL,NULL,'AVAILABLE'),(9,4,'Bàn 4 người sân vườn','Bàn 09',NULL,NULL,'AVAILABLE'),(10,4,'Bàn 4 người gần bếp mở','Bàn 10',NULL,NULL,'AVAILABLE'),(11,4,'Bàn 4 người tầng 1','Bàn 11',NULL,NULL,'AVAILABLE'),(12,4,'Bàn 4 người tầng 2','Bàn 12',NULL,NULL,'AVAILABLE'),(13,4,'Bàn 4 người khu VIP','Bàn 13',NULL,NULL,'AVAILABLE'),(14,6,'Bàn 6 người phòng riêng A','Bàn 14',NULL,NULL,'AVAILABLE'),(15,6,'Bàn 6 người phòng riêng B','Bàn 15',NULL,NULL,'AVAILABLE'),(16,6,'Bàn 6 người khu trung tâm','Bàn 16',NULL,NULL,'AVAILABLE'),(17,6,'Bàn 6 người sân thượng','Bàn 17',NULL,NULL,'AVAILABLE'),(18,6,'Bàn 6 người cạnh hồ cá','Bàn 18',NULL,NULL,'AVAILABLE'),(19,8,'Bàn 8 người phòng VIP 1','Bàn 19',NULL,NULL,'AVAILABLE'),(20,8,'Bàn 8 người phòng VIP 2','Bàn 20',NULL,NULL,'AVAILABLE'),(21,8,'Bàn 8 người sân vườn lớn','Bàn 21',NULL,NULL,'AVAILABLE'),(22,8,'Bàn 8 người tầng 2','Bàn 22',NULL,NULL,'AVAILABLE'),(23,10,'Bàn 10 người phòng tiệc A','Bàn 23',NULL,NULL,'AVAILABLE'),(24,10,'Bàn 10 người phòng tiệc B','Bàn 24',NULL,NULL,'AVAILABLE'),(25,10,'Bàn 10 người sân thượng','Bàn 25',NULL,NULL,'AVAILABLE'),(26,12,'Bàn 12 người đại tiệc 1','Bàn 26',NULL,NULL,'AVAILABLE'),(27,12,'Bàn 12 người đại tiệc 2','Bàn 27',NULL,NULL,'AVAILABLE'),(28,15,'Bàn 15 người phòng hội nghị','Bàn 28',NULL,NULL,'AVAILABLE'),(29,20,'Bàn 20 người phòng sự kiện','Bàn 29',NULL,NULL,'AVAILABLE'),(30,6,'Bàn tròn 6 người ngoài trời','Bàn 30',NULL,NULL,'AVAILABLE');
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `system_log`
--

LOCK TABLES `system_log` WRITE;
/*!40000 ALTER TABLE `system_log` DISABLE KEYS */;
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
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'2026-04-22 22:33:13.528995','admin@gmail.com','Super Administrator',_binary '','$2a$10$.8aUEWyNFZZshAGnd7llaOqqnVdL73LrrtthXPnvH/WZwOwtINvlu','0123456789','ADMIN'),(2,'2026-04-22 23:27:51.077781','ngocquang04032005@gmail.com','Đoàn Ngọc Quang',_binary '','$2a$10$N9QAbPIUliOqZXwERskSA.jDk3zjcl0n87QYtO4LHzKT2DhXiXjAO','1234567890','CUSTOMER');
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
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `voucher`
--

LOCK TABLES `voucher` WRITE;
/*!40000 ALTER TABLE `voucher` DISABLE KEYS */;
INSERT INTO `voucher` VALUES (1,'HELLO12','PERCENT',10.00,'2026-04-30 22:45:00.000000',12,'2026-04-22 06:40:00.000000'),(2,'BLACKFRIDAY','PERCENT',40.00,'2026-04-30 04:28:00.000000',12,'2026-04-22 23:28:00.000000');
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
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `voucher_detail`
--

LOCK TABLES `voucher_detail` WRITE;
/*!40000 ALTER TABLE `voucher_detail` DISABLE KEYS */;
/*!40000 ALTER TABLE `voucher_detail` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping routines for database 'restaurant'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-04-22 23:35:54
