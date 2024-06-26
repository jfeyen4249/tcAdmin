
CREATE TABLE `alert_log` (
  `id` int NOT NULL AUTO_INCREMENT,
  `down_time` int DEFAULT NULL,
  `up_time` int DEFAULT NULL,
  `total` varchar(45)  DEFAULT NULL,
  `device_id` varchar(45)  DEFAULT NULL,
  PRIMARY KEY (`id`)
); 

CREATE TABLE `ap` (
  `id` int NOT NULL AUTO_INCREMENT,
  `make` varchar(45)  DEFAULT NULL,
  `model` varchar(45)  DEFAULT NULL,
  `sn` varchar(45)  DEFAULT NULL,
  `mac` varchar(45)  DEFAULT NULL,
  `name` varchar(45)  DEFAULT NULL,
  `tag` varchar(45)  DEFAULT NULL,
  `room` varchar(45)  DEFAULT NULL,
  `building` varchar(45)  DEFAULT NULL,
  `installed` varchar(45)  DEFAULT NULL,
  `view` varchar(45)  DEFAULT NULL,
  PRIMARY KEY (`id`)
);

CREATE TABLE `buildings` (
  `id` int NOT NULL AUTO_INCREMENT,
  `acronymn` varchar(105)  NOT NULL,
  `view` varchar(45)  DEFAULT NULL,
  `name` varchar(45)  NOT NULL,
  `return_building` varchar(45)  NOT NULL DEFAULT 'false',
  `building_code` varchar(45)  NOT NULL,
  `color` varchar(45)  DEFAULT 'bg-white',
  PRIMARY KEY (`id`)
) ;

CREATE TABLE `chromebook_log` (
  `id` int NOT NULL AUTO_INCREMENT,
  `chromebook_id` varchar(45)  DEFAULT NULL,
  `date` varchar(45)  DEFAULT NULL,
  `log` longtext ,
  `action` longtext  NOT NULL,
  PRIMARY KEY (`id`)
) ;

CREATE TABLE `chromebook_makes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `make` varchar(45)  DEFAULT NULL,
  `model` varchar(45)  DEFAULT NULL,
  `screen` varchar(45)  DEFAULT NULL,
  `cost` varchar(45)  DEFAULT NULL,
  `updates` varchar(45)  DEFAULT NULL,
  `status` varchar(45)  DEFAULT 'true',
  PRIMARY KEY (`id`)
) ;



CREATE TABLE `chromebook_repairs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `serial` varchar(45)  NOT NULL,
  `school` varchar(45)  NOT NULL,
  `reasonLong` varchar(45)  NOT NULL,
  `reason` varchar(45)  NOT NULL,
  `comment` longtext ,
  `explaination` longtext ,
  `isReturned` varchar(45)  NOT NULL DEFAULT 'False',
  `schoolName` varchar(45)  NOT NULL,
  PRIMARY KEY (`id`)
) ;

CREATE TABLE `chromebooks` (
  `id` int NOT NULL AUTO_INCREMENT,
  `model_id` int NOT NULL,
  `date_added` varchar(45)  DEFAULT NULL,
  `tag` varchar(45)  DEFAULT NULL,
  `building` varchar(45)  DEFAULT NULL,
  `status` varchar(45)  DEFAULT 'true',
  `sn` varchar(45)  DEFAULT NULL,
  `device_status` varchar(45)  DEFAULT NULL,
  `student` varchar(245)  DEFAULT NULL,
  `student_year` varchar(45)  DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `chromebooks_model_id_fkey` (`model_id`),
  CONSTRAINT `chromebooks_model_id_fkey` FOREIGN KEY (`model_id`) REFERENCES `chromebook_makes` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ;

CREATE TABLE `computers` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255)  DEFAULT 'N/A',
  `mac` varchar(255)  DEFAULT 'N/A',
  `hdd` varchar(45)  DEFAULT 'N/A',
  `ram` varchar(45)  DEFAULT 'N/A',
  `os` varchar(255)  DEFAULT 'N/A',
  `view` varchar(45)  DEFAULT 'true',
  `building` varchar(45)  DEFAULT 'N/A',
  `room` varchar(45)  DEFAULT 'N/A',
  `processor` varchar(255)  DEFAULT 'N/A',
  `sn` varchar(45)  DEFAULT 'N/A',
  `type` varchar(45)  DEFAULT 'N/A',
  `tag` varchar(45)  DEFAULT 'N/A',
  `ip` varchar(45)  DEFAULT 'N/A',
  `make` varchar(45)  DEFAULT 'N/A',
  `model` varchar(45)  DEFAULT 'N/A',
  `alert` varchar(45)  DEFAULT '0',
  PRIMARY KEY (`id`)
); 

CREATE TABLE `contacts` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(245)  DEFAULT NULL,
  `company` varchar(245)  DEFAULT NULL,
  `title` varchar(245)  DEFAULT NULL,
  `website` varchar(45)  DEFAULT NULL,
  `email` varchar(45)  DEFAULT NULL,
  `phone` varchar(45)  DEFAULT NULL,
  `cell` varchar(45)  DEFAULT NULL,
  `fax` varchar(45)  DEFAULT NULL,
  `info` longtext ,
  `status` varchar(45)  DEFAULT 'true',
  PRIMARY KEY (`id`)
) ;

CREATE TABLE `devices` (
  `id` int NOT NULL AUTO_INCREMENT,
  `device` varchar(115)  DEFAULT NULL,
  `status` varchar(45)  DEFAULT 'true',
  PRIMARY KEY (`id`)
) ;

INSERT INTO `devices` VALUES 
(1,'Desktop','true'),
(2,'Laptop','true'),
(3,'mac','true'),
(4,'smartboard','true'),
(5,'chromebook','true'),
(6,'ap','true'),
(7,'phone','true'),
(8,'printer','true'),
(9,'server','true'),
(10,'networking','true'),
(11,'projector','true');



CREATE TABLE `docs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `doc` varchar(255)  DEFAULT NULL,
  `doc_body` longblob,
  `date` varchar(45)  DEFAULT NULL,
  `status` varchar(45)  DEFAULT 'true',
  PRIMARY KEY (`id`)
) ;


CREATE TABLE `ipad` (
  `id` int NOT NULL AUTO_INCREMENT,
  `model` varchar(45)  DEFAULT NULL,
  `sn` varchar(45)  DEFAULT NULL,
  `building` varchar(45)  DEFAULT NULL,
  `date` varchar(45)  DEFAULT NULL,
  `room` varchar(45)  DEFAULT NULL,
  `staff` varchar(45)  DEFAULT NULL,
  `view` varchar(45)  DEFAULT NULL,
  `storage` varchar(45)  DEFAULT NULL,
  `screen` varchar(45)  DEFAULT NULL,
  `tag` varchar(45)  DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `sn_UNIQUE` (`sn`)
) ;


CREATE TABLE `guides` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(45)  DEFAULT NULL,
  `content` longblob,
  `status` varchar(45)  DEFAULT 'true',
  `link` longtext,
  PRIMARY KEY (`id`)
) ;

CREATE TABLE `logs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `date` varchar(45)  DEFAULT NULL,
  `time` varchar(45)  DEFAULT NULL,
  `log` longtext ,
  `user` varchar(45)  DEFAULT NULL,
  PRIMARY KEY (`id`)
) ;

CREATE TABLE `makes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `make` varchar(45)  DEFAULT NULL,
  `model` varchar(45)  DEFAULT NULL,
  `View` varchar(45)  DEFAULT NULL,
  `type` varchar(45)  DEFAULT NULL,
  PRIMARY KEY (`id`)
);

CREATE TABLE `maps` (
  `id` int NOT NULL AUTO_INCREMENT,
  `file` varchar(255)  DEFAULT NULL,
  `building` varchar(45)  DEFAULT NULL,
  `type` varchar(45)  DEFAULT NULL,
  `view` varchar(45)  DEFAULT 'true',
  PRIMARY KEY (`id`)
) ;


CREATE TABLE `monitoring` (
  `id` int NOT NULL AUTO_INCREMENT,
  `port` varchar(45)  DEFAULT 'none',
  `ip` varchar(45)  DEFAULT NULL,
  `trys` int DEFAULT '3',
  `view` varchar(45)  DEFAULT 'true',
  `alerted` int DEFAULT '0',
  `alert_time` varchar(45)  DEFAULT NULL,
  `time` varchar(45)  DEFAULT NULL,
  `date` varchar(45)  DEFAULT NULL,
  `status` varchar(45)  DEFAULT 'up',
  `count` int DEFAULT '1',
  `log_id` varchar(45)  DEFAULT NULL,
  `name` varchar(45)  DEFAULT NULL,
  `type` varchar(45)  DEFAULT 'ping',
  PRIMARY KEY (`id`)
) ;

CREATE TABLE `networking` (
  `id` int NOT NULL AUTO_INCREMENT,
  `make` varchar(45)  DEFAULT NULL,
  `model` varchar(45)  DEFAULT NULL,
  `type` varchar(200)  DEFAULT NULL,
  `ip` varchar(45)  DEFAULT NULL,
  `hostname` varchar(45)  DEFAULT NULL,
  `sn` varchar(45)  DEFAULT NULL,
  `tag` varchar(45)  DEFAULT NULL,
  `date` varchar(45)  DEFAULT NULL,
  `building` varchar(45)  DEFAULT NULL,
  `view` varchar(45)  DEFAULT 'true',
  `room` varchar(45)  DEFAULT NULL,
  `username` varchar(45)  DEFAULT NULL,
  `password` varchar(255)  DEFAULT NULL,
  `backup` varchar(45)  DEFAULT '0',
  `config` longblob,
  PRIMARY KEY (`id`)
) ;


CREATE TABLE `password_cat` (
  `id` int NOT NULL AUTO_INCREMENT,
  `category` varchar(145)  NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `category_UNIQUE` (`category`)
) ;

INSERT INTO `password_cat` VALUES 
(7,'AD'),
(8,'Backup'),
(13,'Desktop Software'),
(10,'DNS'),
(6,'Firewall'),
(5,'Printers'),
(12,'Remote Desktop'),
(9,'Security'),
(1,'Server'),
(2,'Switch'),
(4,'Voice Gateway'),
(11,'Website'),
(3,'Wireless');



CREATE TABLE `password_history` (
  `id` int NOT NULL AUTO_INCREMENT,
  `password_id` int DEFAULT NULL,
  `password` longtext ,
  `date` varchar(45)  DEFAULT NULL,
  `time` varchar(45)  DEFAULT NULL,
  `user` varchar(45)  DEFAULT NULL,
  PRIMARY KEY (`id`)
) ;


CREATE TABLE `passwords` (
  `id` int NOT NULL AUTO_INCREMENT,
  `service` varchar(255)  DEFAULT NULL,
  `url` varchar(255)  DEFAULT NULL,
  `username` varchar(255)  DEFAULT NULL,
  `password` longtext ,
  `otp` varchar(200)  DEFAULT 'none',
  `category` varchar(255)  DEFAULT NULL,
  `updated` varchar(40)  DEFAULT NULL,
  `view` varchar(45)  DEFAULT NULL,
  `info` longtext ,
  PRIMARY KEY (`id`)
);


CREATE TABLE `phones` (
  `id` int NOT NULL AUTO_INCREMENT,
  `make` varchar(45)  DEFAULT NULL,
  `model` varchar(45)  DEFAULT NULL,
  `sn` varchar(45)  DEFAULT NULL,
  `mac` varchar(45)  DEFAULT NULL,
  `tag` varchar(45)  DEFAULT NULL,
  `building` varchar(45)  DEFAULT NULL,
  `room` varchar(45)  DEFAULT NULL,
  `date` varchar(45)  DEFAULT NULL,
  `view` varchar(45)  DEFAULT NULL,
  `extention` varchar(45)  DEFAULT NULL,
  PRIMARY KEY (`id`)
) ;

CREATE TABLE `printers` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255)  DEFAULT NULL,
  `make` varchar(145)  DEFAULT NULL,
  `model` varchar(145)  DEFAULT NULL,
  `sn` varchar(45)  DEFAULT NULL,
  `date` varchar(45)  DEFAULT NULL,
  `mac` varchar(45)  DEFAULT NULL,
  `ip` varchar(45)  DEFAULT NULL,
  `building` varchar(45)  DEFAULT NULL,
  `room` varchar(45)  DEFAULT NULL,
  `view` varchar(45)  DEFAULT NULL,
  PRIMARY KEY (`id`)
) ;


CREATE TABLE `projectors` (
  `id` int NOT NULL AUTO_INCREMENT,
  `make` varchar(45)  DEFAULT NULL,
  `model` varchar(45)  DEFAULT NULL,
  `sn` varchar(45)  DEFAULT NULL,
  `tag` varchar(45)  DEFAULT NULL,
  `building` varchar(45)  DEFAULT NULL,
  `room` varchar(45)  DEFAULT NULL,
  `bulb` varchar(45)  DEFAULT NULL,
  `view` varchar(45)  DEFAULT NULL,
  `date` varchar(45)  DEFAULT NULL,
  PRIMARY KEY (`id`)
) ;


CREATE TABLE `renewals` (
  `id` int NOT NULL AUTO_INCREMENT,
  `start` varchar(45)  DEFAULT NULL,
  `renewal_date` varchar(45)  DEFAULT NULL,
  `cost` varchar(45)  DEFAULT NULL,
  `po` varchar(45)  DEFAULT NULL,
  `status` varchar(45)  DEFAULT 'Active',
  `service` varchar(45)  DEFAULT NULL,
  `year` varchar(45)  DEFAULT NULL,
  PRIMARY KEY (`id`)
) ;


CREATE TABLE `repair_reasons` (
  `id` int NOT NULL,
  `reason` varchar(45)  NOT NULL,
  `value` varchar(45)  NOT NULL,
  PRIMARY KEY (`id`)
) ;

INSERT INTO `repair_reasons` VALUES 
(1,'Display - Dark/Broken/Cuts Out','104'),
(2,'Audio Jack - Broken','107'),
(3,'Camera - failure','39'),
(4,'Case/Hinge - Damage','105'),
(5,'Charging Port - Broken/Does Not Charge','40'),
(6,'Display - Dead','23'),
(7,'Fan - Dead','42'),
(8,'Hard Drive - Failure','43'),
(9,'Keyboard - Does Not Respond','25'),
(10,'Keyboard - Missing Keys','26'),
(11,'Liquid Damage','390'),
(12,'Loss/Theft','71'),
(13,'Microphone - Failure','430'),
(14,'Stylus - Not Functional','515'),
(15,'System - No Power/Freezes/Shuts Down','102'),
(16,'Touchpad - Does Not Respond','30'),
(17,'TPM Error','106'),
(18,'Wireless - Does Not Connect','31');



CREATE TABLE `rooms` (
  `id` int NOT NULL AUTO_INCREMENT,
  `room` varchar(45)  DEFAULT NULL,
  `building` varchar(45)  DEFAULT NULL,
  `view` varchar(45)  DEFAULT 'true',
  PRIMARY KEY (`id`)
) ;



CREATE TABLE `servers` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(145)  DEFAULT NULL,
  `mac` varchar(45)  DEFAULT NULL,
  `ip` varchar(45)  DEFAULT NULL,
  `hdd` varchar(45)  DEFAULT NULL,
  `ram` varchar(45)  DEFAULT NULL,
  `os` varchar(45)  DEFAULT NULL,
  `role` longtext ,
  `view` varchar(45)  DEFAULT NULL,
  PRIMARY KEY (`id`)
) ;

CREATE TABLE `tcadmin`.`settings` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `settingName` VARCHAR(255) NOT NULL,
  `enabled` INT NULL DEFAULT 0,
  PRIMARY KEY (`id`));


CREATE TABLE `slack` (
  `id` int NOT NULL AUTO_INCREMENT,
  `hook` varchar(225)  DEFAULT NULL,
  `network` varchar(10)  DEFAULT 'false',
  `renewals` varchar(45)  DEFAULT 'fales',
  `pc` varchar(45)  DEFAULT 'false',
  PRIMARY KEY (`id`)
) ;

INSERT INTO `slack` VALUES (1, '', '0', '0', '0');


CREATE TABLE `smartboards` (
  `id` int NOT NULL AUTO_INCREMENT,
  `make` varchar(45)  DEFAULT NULL,
  `model` varchar(45)  DEFAULT NULL,
  `sn` varchar(45)  DEFAULT NULL,
  `tag` varchar(45)  DEFAULT NULL,
  `building` varchar(45)  DEFAULT NULL,
  `room` varchar(45)  DEFAULT NULL,
  `size` varchar(45)  DEFAULT NULL,
  `view` varchar(45)  DEFAULT 'true',
  `date` varchar(45)  DEFAULT NULL,
  PRIMARY KEY (`id`)
) ;

CREATE TABLE `staff` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(45)  DEFAULT NULL,
  `building` varchar(45)  DEFAULT NULL,
  `room` varchar(45)  DEFAULT NULL,
  `view` varchar(45)  DEFAULT NULL,
  PRIMARY KEY (`id`)
) ;

CREATE TABLE `students` (
  `id` int NOT NULL AUTO_INCREMENT,
  `student` varchar(245)  DEFAULT NULL,
  `year` varchar(45)  DEFAULT NULL,
  `status` varchar(45)  DEFAULT 'true',
  PRIMARY KEY (`id`)
) ;

CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(245)  DEFAULT NULL,
  `password` varchar(245)  DEFAULT '$2a$10$i9.PCv3J2GhXBSJuKI6lt.tekoijyCPf0mKLWneGFuuYWuSh3EG/W',
  `name` varchar(245)  DEFAULT NULL,
  `phone` varchar(45)  DEFAULT NULL,
  `session` varchar(245)  DEFAULT NULL,
  `status` varchar(45)  DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username_UNIQUE` (`username`),
  UNIQUE KEY `phone_UNIQUE` (`phone`)
) ;


INSERT INTO `users` VALUES (1,'tcadmin','$2a$10$i9.PCv3J2GhXBSJuKI6lt.tekoijyCPf0mKLWneGFuuYWuSh3EG/W','Admin','608-348-9000','d4f6dd88-4d20-4818-98d2-c4df1305b3dd','Active');



CREATE TABLE `wifi` (
  `id` int NOT NULL AUTO_INCREMENT,
  `ssid` longtext ,
  `password` longtext ,
  `status` varchar(45)  DEFAULT 'true',
  PRIMARY KEY (`id`)
) ;