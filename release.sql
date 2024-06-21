
CREATE TABLE `alert_log` (
  `id` int NOT NULL AUTO_INCREMENT,
  `down_time` int DEFAULT NULL,
  `up_time` int DEFAULT NULL,
  `total` varchar(45) COLLATE  DEFAULT NULL,
  `device_id` varchar(45) COLLATE  DEFAULT NULL,
  PRIMARY KEY (`id`)
); 

CREATE TABLE `ap` (
  `id` int NOT NULL AUTO_INCREMENT,
  `make` varchar(45) COLLATE  DEFAULT NULL,
  `model` varchar(45) COLLATE  DEFAULT NULL,
  `sn` varchar(45) COLLATE  DEFAULT NULL,
  `mac` varchar(45) COLLATE  DEFAULT NULL,
  `name` varchar(45) COLLATE  DEFAULT NULL,
  `tag` varchar(45) COLLATE  DEFAULT NULL,
  `room` varchar(45) COLLATE  DEFAULT NULL,
  `building` varchar(45) COLLATE  DEFAULT NULL,
  `installed` varchar(45) COLLATE  DEFAULT NULL,
  `view` varchar(45) COLLATE  DEFAULT NULL,
  PRIMARY KEY (`id`)
);

CREATE TABLE `buildings` (
  `id` int NOT NULL AUTO_INCREMENT,
  `acronymn` varchar(105) COLLATE  NOT NULL,
  `view` varchar(45) COLLATE  DEFAULT NULL,
  `name` varchar(45) COLLATE  NOT NULL,
  `return_building` varchar(45) COLLATE  NOT NULL DEFAULT 'false',
  `building_code` varchar(45) COLLATE  NOT NULL,
  `color` varchar(45) COLLATE  DEFAULT 'bg-white',
  PRIMARY KEY (`id`)
) ;

CREATE TABLE `chromebook_log` (
  `id` int NOT NULL AUTO_INCREMENT,
  `chromebook_id` varchar(45) COLLATE  DEFAULT NULL,
  `date` varchar(45) COLLATE  DEFAULT NULL,
  `log` longtext COLLATE ,
  `action` longtext COLLATE  NOT NULL,
  PRIMARY KEY (`id`)
) ;

CREATE TABLE `Chromebook_makes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `make` varchar(45) COLLATE  DEFAULT NULL,
  `model` varchar(45) COLLATE  DEFAULT NULL,
  `screen` varchar(45) COLLATE  DEFAULT NULL,
  `cost` varchar(45) COLLATE  DEFAULT NULL,
  `updates` varchar(45) COLLATE  DEFAULT NULL,
  `status` varchar(45) COLLATE  DEFAULT 'true',
  PRIMARY KEY (`id`)
) ;



CREATE TABLE `chromebook_repairs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `serial` varchar(45) COLLATE  NOT NULL,
  `school` varchar(45) COLLATE  NOT NULL,
  `reasonLong` varchar(45) COLLATE  NOT NULL,
  `reason` varchar(45) COLLATE  NOT NULL,
  `comment` longtext COLLATE ,
  `explaination` longtext COLLATE ,
  `isReturned` varchar(45) COLLATE  NOT NULL DEFAULT 'False',
  `schoolName` varchar(45) COLLATE  NOT NULL,
  PRIMARY KEY (`id`)
) ;

CREATE TABLE `Chromebooks` (
  `id` int NOT NULL AUTO_INCREMENT,
  `model_id` int NOT NULL,
  `date_added` varchar(45) COLLATE  DEFAULT NULL,
  `tag` varchar(45) COLLATE  DEFAULT NULL,
  `building` varchar(45) COLLATE  DEFAULT NULL,
  `status` varchar(45) COLLATE  DEFAULT 'true',
  `sn` varchar(45) COLLATE  DEFAULT NULL,
  `device_status` varchar(45) COLLATE  DEFAULT NULL,
  `student` varchar(245) COLLATE  DEFAULT NULL,
  `student_year` varchar(45) COLLATE  DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `Chromebooks_model_id_fkey` (`model_id`),
  CONSTRAINT `Chromebooks_model_id_fkey` FOREIGN KEY (`model_id`) REFERENCES `Chromebook_makes` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ;

CREATE TABLE `computers` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE  DEFAULT 'N/A',
  `mac` varchar(255) COLLATE  DEFAULT 'N/A',
  `hdd` varchar(45) COLLATE  DEFAULT 'N/A',
  `ram` varchar(45) COLLATE  DEFAULT 'N/A',
  `os` varchar(255) COLLATE  DEFAULT 'N/A',
  `view` varchar(45) COLLATE  DEFAULT 'true',
  `building` varchar(45) COLLATE  DEFAULT 'N/A',
  `room` varchar(45) COLLATE  DEFAULT 'N/A',
  `processor` varchar(255) COLLATE  DEFAULT 'N/A',
  `sn` varchar(45) COLLATE  DEFAULT 'N/A',
  `type` varchar(45) COLLATE  DEFAULT 'N/A',
  `tag` varchar(45) COLLATE  DEFAULT 'N/A',
  `ip` varchar(45) COLLATE  DEFAULT 'N/A',
  `make` varchar(45) COLLATE  DEFAULT 'N/A',
  `model` varchar(45) COLLATE  DEFAULT 'N/A',
  `alert` varchar(45) COLLATE  DEFAULT '0',
  PRIMARY KEY (`id`)
); 

CREATE TABLE `contacts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(245) COLLATE  DEFAULT NULL,
  `company` varchar(245) COLLATE  DEFAULT NULL,
  `title` varchar(245) COLLATE  DEFAULT NULL,
  `website` varchar(45) COLLATE  DEFAULT NULL,
  `email` varchar(45) COLLATE  DEFAULT NULL,
  `phone` varchar(45) COLLATE  DEFAULT NULL,
  `cell` varchar(45) COLLATE  DEFAULT NULL,
  `fax` varchar(45) COLLATE  DEFAULT NULL,
  `info` longtext COLLATE ,
  `status` varchar(45) COLLATE  DEFAULT 'true',
  PRIMARY KEY (`id`)
) ;

CREATE TABLE `devices` (
  `id` int NOT NULL AUTO_INCREMENT,
  `device` varchar(115) COLLATE  DEFAULT NULL,
  `status` varchar(45) COLLATE  DEFAULT 'true',
  PRIMARY KEY (`id`)
) ;


LOCK TABLES `devices` WRITE;
/*!40000 ALTER TABLE `devices` DISABLE KEYS */;
INSERT INTO `devices` VALUES (1,'Desktop','true'),(2,'Laptop','true'),(3,'mac','true'),,(4,'smartboard','true'),(5,'chromebook','true'),(6,'ap','true'),(7,'phone','true'),(8,'printer','true'),(9,'server','true'),(9,'networking','true'),(10,'projector','true');
/*!40000 ALTER TABLE `devices` ENABLE KEYS */;
UNLOCK TABLES;


CREATE TABLE `docs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `doc` varchar(255) COLLATE  DEFAULT NULL,
  `doc_body` longblob,
  `date` varchar(45) COLLATE  DEFAULT NULL,
  `status` varchar(45) COLLATE  DEFAULT 'true',
  PRIMARY KEY (`id`)
) ;


CREATE TABLE `ipad` (
  `id` int NOT NULL AUTO_INCREMENT,
  `model` varchar(45) COLLATE  DEFAULT NULL,
  `sn` varchar(45) COLLATE  DEFAULT NULL,
  `building` varchar(45) COLLATE  DEFAULT NULL,
  `date` varchar(45) COLLATE  DEFAULT NULL,
  `room` varchar(45) COLLATE  DEFAULT NULL,
  `staff` varchar(45) COLLATE  DEFAULT NULL,
  `view` varchar(45) COLLATE  DEFAULT NULL,
  `storage` varchar(45) COLLATE  DEFAULT NULL,
  `screen` varchar(45) COLLATE  DEFAULT NULL,
  `tag` varchar(45) COLLATE  DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `sn_UNIQUE` (`sn`)
) ;

CREATE TABLE `logs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `date` varchar(45) COLLATE  DEFAULT NULL,
  `time` varchar(45) COLLATE  DEFAULT NULL,
  `log` longtext COLLATE ,
  `user` varchar(45) COLLATE  DEFAULT NULL,
  PRIMARY KEY (`id`)
) ;

CREATE TABLE `makes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `make` varchar(45) COLLATE  DEFAULT NULL,
  `model` varchar(45) COLLATE  DEFAULT NULL,
  `View` varchar(45) COLLATE  DEFAULT NULL,
  `type` varchar(45) COLLATE  DEFAULT NULL,
  PRIMARY KEY (`id`)
);

CREATE TABLE `maps` (
  `id` int NOT NULL AUTO_INCREMENT,
  `file` varchar(255) COLLATE  DEFAULT NULL,
  `building` varchar(45) COLLATE  DEFAULT NULL,
  `type` varchar(45) COLLATE  DEFAULT NULL,
  `view` varchar(45) COLLATE  DEFAULT 'true',
  PRIMARY KEY (`id`)
) ;


CREATE TABLE `monitoring` (
  `id` int NOT NULL AUTO_INCREMENT,
  `port` varchar(45) COLLATE  DEFAULT 'none',
  `ip` varchar(45) COLLATE  DEFAULT NULL,
  `trys` int DEFAULT '3',
  `view` varchar(45) COLLATE  DEFAULT 'true',
  `alerted` int DEFAULT '0',
  `alert_time` varchar(45) COLLATE  DEFAULT NULL,
  `time` varchar(45) COLLATE  DEFAULT NULL,
  `date` varchar(45) COLLATE  DEFAULT NULL,
  `status` varchar(45) COLLATE  DEFAULT 'up',
  `count` int DEFAULT '1',
  `log_id` varchar(45) COLLATE  DEFAULT NULL,
  `name` varchar(45) COLLATE  DEFAULT NULL,
  `type` varchar(45) COLLATE  DEFAULT 'ping',
  PRIMARY KEY (`id`)
) ;

CREATE TABLE `networking` (
  `id` int NOT NULL AUTO_INCREMENT,
  `make` varchar(45) COLLATE  DEFAULT NULL,
  `model` varchar(45) COLLATE  DEFAULT NULL,
  `type` varchar(200) COLLATE  DEFAULT NULL,
  `ip` varchar(45) COLLATE  DEFAULT NULL,
  `hostname` varchar(45) COLLATE  DEFAULT NULL,
  `sn` varchar(45) COLLATE  DEFAULT NULL,
  `tag` varchar(45) COLLATE  DEFAULT NULL,
  `date` varchar(45) COLLATE  DEFAULT NULL,
  `building` varchar(45) COLLATE  DEFAULT NULL,
  `view` varchar(45) COLLATE  DEFAULT 'true',
  `room` varchar(45) COLLATE  DEFAULT NULL,
  `username` varchar(45) COLLATE  DEFAULT NULL,
  `password` varchar(255) COLLATE  DEFAULT NULL,
  `backup` varchar(45) COLLATE  DEFAULT '0',
  PRIMARY KEY (`id`)
) ;


CREATE TABLE `password_cat` (
  `id` int NOT NULL AUTO_INCREMENT,
  `category` varchar(145) COLLATE  NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `category_UNIQUE` (`category`)
) ;


LOCK TABLES `password_cat` WRITE;
/*!40000 ALTER TABLE `password_cat` DISABLE KEYS */;
INSERT INTO `password_cat` VALUES (7,'AD'),(8,'Backup'),(13,'Desktop Software'),(10,'DNS'),(6,'Firewall'),(5,'Printers'),(12,'Remote Desktop'),(9,'Security'),(1,'Server'),(2,'Switch'),(4,'Voice Gateway'),(11,'Website'),(3,'Wireless');
/*!40000 ALTER TABLE `password_cat` ENABLE KEYS */;
UNLOCK TABLES;

CREATE TABLE `password_history` (
  `id` int NOT NULL AUTO_INCREMENT,
  `password_id` int DEFAULT NULL,
  `password` longtext COLLATE ,
  `date` varchar(45) COLLATE  DEFAULT NULL,
  `time` varchar(45) COLLATE  DEFAULT NULL,
  `user` varchar(45) COLLATE  DEFAULT NULL,
  PRIMARY KEY (`id`)
) ;

DROP TABLE IF EXISTS `passwords`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `passwords` (
  `id` int NOT NULL AUTO_INCREMENT,
  `service` varchar(255) COLLATE  DEFAULT NULL,
  `url` varchar(255) COLLATE  DEFAULT NULL,
  `username` varchar(255) COLLATE  DEFAULT NULL,
  `password` longtext COLLATE ,
  `otp` varchar(200) COLLATE  DEFAULT 'none',
  `category` varchar(255) COLLATE  DEFAULT NULL,
  `updated` varchar(40) COLLATE  DEFAULT NULL,
  `view` varchar(45) COLLATE  DEFAULT NULL,
  `info` longtext COLLATE ,
  PRIMARY KEY (`id`)
);


CREATE TABLE `phones` (
  `id` int NOT NULL AUTO_INCREMENT,
  `make` varchar(45) COLLATE  DEFAULT NULL,
  `model` varchar(45) COLLATE  DEFAULT NULL,
  `sn` varchar(45) COLLATE  DEFAULT NULL,
  `mac` varchar(45) COLLATE  DEFAULT NULL,
  `tag` varchar(45) COLLATE  DEFAULT NULL,
  `building` varchar(45) COLLATE  DEFAULT NULL,
  `room` varchar(45) COLLATE  DEFAULT NULL,
  `date` varchar(45) COLLATE  DEFAULT NULL,
  `view` varchar(45) COLLATE  DEFAULT NULL,
  `extention` varchar(45) COLLATE  DEFAULT NULL,
  PRIMARY KEY (`id`)
) ;

CREATE TABLE `printers` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) COLLATE  DEFAULT NULL,
  `make` varchar(145) COLLATE  DEFAULT NULL,
  `model` varchar(145) COLLATE  DEFAULT NULL,
  `sn` varchar(45) COLLATE  DEFAULT NULL,
  `date` varchar(45) COLLATE  DEFAULT NULL,
  `mac` varchar(45) COLLATE  DEFAULT NULL,
  `ip` varchar(45) COLLATE  DEFAULT NULL,
  `building` varchar(45) COLLATE  DEFAULT NULL,
  `room` varchar(45) COLLATE  DEFAULT NULL,
  `view` varchar(45) COLLATE  DEFAULT NULL,
  PRIMARY KEY (`id`)
) ;


CREATE TABLE `projectors` (
  `id` int NOT NULL AUTO_INCREMENT,
  `make` varchar(45) COLLATE  DEFAULT NULL,
  `model` varchar(45) COLLATE  DEFAULT NULL,
  `sn` varchar(45) COLLATE  DEFAULT NULL,
  `tag` varchar(45) COLLATE  DEFAULT NULL,
  `building` varchar(45) COLLATE  DEFAULT NULL,
  `room` varchar(45) COLLATE  DEFAULT NULL,
  `bulb` varchar(45) COLLATE  DEFAULT NULL,
  `view` varchar(45) COLLATE  DEFAULT NULL,
  `date` varchar(45) COLLATE  DEFAULT NULL,
  PRIMARY KEY (`id`)
) ;


CREATE TABLE `renewals` (
  `id` int NOT NULL AUTO_INCREMENT,
  `start` varchar(45) COLLATE  DEFAULT NULL,
  `renewal_date` varchar(45) COLLATE  DEFAULT NULL,
  `cost` varchar(45) COLLATE  DEFAULT NULL,
  `po` varchar(45) COLLATE  DEFAULT NULL,
  `status` varchar(45) COLLATE  DEFAULT 'Active',
  `service` varchar(45) COLLATE  DEFAULT NULL,
  `year` varchar(45) COLLATE  DEFAULT NULL,
  PRIMARY KEY (`id`)
) ;

DROP TABLE IF EXISTS `repair_reasons`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `repair_reasons` (
  `id` int NOT NULL,
  `reason` varchar(45) COLLATE  NOT NULL,
  `value` varchar(45) COLLATE  NOT NULL,
  PRIMARY KEY (`id`)
) ;

LOCK TABLES `repair_reasons` WRITE;
/*!40000 ALTER TABLE `repair_reasons` DISABLE KEYS */;
INSERT INTO `repair_reasons` VALUES (1,'Display - Dark/Broken/Cuts Out','104'),(2,'Audio Jack - Broken','107'),(3,'Camera - failure','39'),(4,'Case/Hinge - Damage','105'),(5,'Charging Port - Broken/Does Not Charge','40'),(6,'Display - Dead','23'),(7,'Fan - Dead','42'),(8,'Hard Drive - Failure','43'),(9,'Keyboard - Does Not Respond','25'),(10,'Keyboard - Missing Keys','26'),(11,'Liquid Damage','390'),(12,'Loss/Theft','71'),(13,'Microphone - Failure','430'),(14,'Stylus - Not Functional','515'),(15,'System - No Power/Freezes/Shuts Down','102'),(16,'Touchpad - Does Not Respond','30'),(17,'TPM Error','106'),(18,'Wireless - Does Not Connect','31');
/*!40000 ALTER TABLE `repair_reasons` ENABLE KEYS */;
UNLOCK TABLES;

DROP TABLE IF EXISTS `rooms`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rooms` (
  `id` int NOT NULL AUTO_INCREMENT,
  `room` varchar(45) COLLATE  DEFAULT NULL,
  `building` varchar(45) COLLATE  DEFAULT NULL,
  `view` varchar(45) COLLATE  DEFAULT 'true',
  PRIMARY KEY (`id`)
) ;


DROP TABLE IF EXISTS `servers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `servers` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(145) COLLATE  DEFAULT NULL,
  `mac` varchar(45) COLLATE  DEFAULT NULL,
  `ip` varchar(45) COLLATE  DEFAULT NULL,
  `hdd` varchar(45) COLLATE  DEFAULT NULL,
  `ram` varchar(45) COLLATE  DEFAULT NULL,
  `os` varchar(45) COLLATE  DEFAULT NULL,
  `role` longtext COLLATE ,
  `view` varchar(45) COLLATE  DEFAULT NULL,
  PRIMARY KEY (`id`)
) ;


CREATE TABLE `slack` (
  `id` int NOT NULL AUTO_INCREMENT,
  `hook` varchar(225) COLLATE  DEFAULT NULL,
  `network` varchar(10) COLLATE  DEFAULT 'false',
  `renewals` varchar(45) COLLATE  DEFAULT 'fales',
  `pc` varchar(45) COLLATE  DEFAULT 'false',
  PRIMARY KEY (`id`)
) ;

LOCK TABLES `slack` WRITE;
/*!40000 ALTER TABLE `slack` DISABLE KEYS */;
INSERT INTO `slack` VALUES (,'','0','0','0');
/*!40000 ALTER TABLE `slack` ENABLE KEYS */;
UNLOCK TABLES;


CREATE TABLE `smartboards` (
  `id` int NOT NULL AUTO_INCREMENT,
  `make` varchar(45) COLLATE  DEFAULT NULL,
  `model` varchar(45) COLLATE  DEFAULT NULL,
  `sn` varchar(45) COLLATE  DEFAULT NULL,
  `tag` varchar(45) COLLATE  DEFAULT NULL,
  `building` varchar(45) COLLATE  DEFAULT NULL,
  `room` varchar(45) COLLATE  DEFAULT NULL,
  `size` varchar(45) COLLATE  DEFAULT NULL,
  `view` varchar(45) COLLATE  DEFAULT 'true',
  `date` varchar(45) COLLATE  DEFAULT NULL,
  PRIMARY KEY (`id`)
) ;

CREATE TABLE `staff` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(45) COLLATE  DEFAULT NULL,
  `building` varchar(45) COLLATE  DEFAULT NULL,
  `room` varchar(45) COLLATE  DEFAULT NULL,
  `view` varchar(45) COLLATE  DEFAULT NULL,
  PRIMARY KEY (`id`)
) ;

CREATE TABLE `students` (
  `id` int NOT NULL AUTO_INCREMENT,
  `student` varchar(245) COLLATE  DEFAULT NULL,
  `year` varchar(45) COLLATE  DEFAULT NULL,
  `status` varchar(45) COLLATE  DEFAULT 'true',
  PRIMARY KEY (`id`)
) ;

CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(245) COLLATE  DEFAULT NULL,
  `password` varchar(245) COLLATE  DEFAULT '$2a$10$i9.PCv3J2GhXBSJuKI6lt.tekoijyCPf0mKLWneGFuuYWuSh3EG/W',
  `name` varchar(245) COLLATE  DEFAULT NULL,
  `phone` varchar(45) COLLATE  DEFAULT NULL,
  `session` varchar(245) COLLATE  DEFAULT NULL,
  `status` varchar(45) COLLATE  DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username_UNIQUE` (`username`),
  UNIQUE KEY `phone_UNIQUE` (`phone`)
) ;

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'tcadmin','$2a$10$i9.PCv3J2GhXBSJuKI6lt.tekoijyCPf0mKLWneGFuuYWuSh3EG/W','Admin','608-348-9000','d4f6dd88-4d20-4818-98d2-c4df1305b3dd','Active');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;


CREATE TABLE `wifi` (
  `id` int NOT NULL AUTO_INCREMENT,
  `ssid` longtext COLLATE ,
  `password` longtext COLLATE ,
  `status` varchar(45) COLLATE  DEFAULT 'true',
  PRIMARY KEY (`id`)
) ;