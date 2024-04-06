


CREATE TABLE `ap` (
  `id` int NOT NULL AUTO_INCREMENT,
  `make` varchar(45) DEFAULT NULL,
  `model` varchar(45) DEFAULT NULL,
  `sn` varchar(45) DEFAULT NULL,
  `mac` varchar(45) DEFAULT NULL,
  `name` varchar(45) DEFAULT NULL,
  `tag` varchar(45) DEFAULT NULL,
  `room` varchar(45) DEFAULT NULL,
  `building` varchar(45) DEFAULT NULL,
  `installed` varchar(45) DEFAULT NULL,
  `view` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=351 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `buildings` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(105) DEFAULT NULL,
  `view` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `computers` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(255) DEFAULT 'N/A',
  `mac` varchar(255) DEFAULT 'N/A',
  `hdd` varchar(45) DEFAULT 'N/A',
  `ram` varchar(45) DEFAULT 'N/A',
  `os` varchar(255) DEFAULT 'N/A',
  `view` varchar(45) DEFAULT 'true',
  `building` varchar(45) DEFAULT 'N/A',
  `room` varchar(45) DEFAULT 'N/A',
  `processor` varchar(255) DEFAULT 'N/A',
  `sn` varchar(45) DEFAULT 'N/A',
  `type` varchar(45) DEFAULT 'N/A',
  `tag` varchar(45) DEFAULT 'N/A',
  `ip` varchar(45) DEFAULT 'N/A',
  `make` varchar(45) DEFAULT 'N/A',
  `model` varchar(45) DEFAULT 'N/A',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `docs` (
  `id` int NOT NULL AUTO_INCREMENT,
  `doc` varchar(255) DEFAULT NULL,
  `doc_body` longtext,
  `date` varchar(45) DEFAULT NULL,
  `status` varchar(45) DEFAULT 'true',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `ipad` (
  `id` int NOT NULL AUTO_INCREMENT,
  `model` varchar(45) DEFAULT NULL,
  `sn` varchar(45) DEFAULT NULL,
  `building` varchar(45) DEFAULT NULL,
  `date` varchar(45) DEFAULT NULL,
  `room` varchar(45) DEFAULT NULL,
  `staff` varchar(45) DEFAULT NULL,
  `view` varchar(45) DEFAULT NULL,
  `storage` varchar(45) DEFAULT NULL,
  `screen` varchar(45) DEFAULT NULL,
  `tag` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `sn_UNIQUE` (`sn`)
) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


CREATE TABLE `makes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `make` varchar(45) DEFAULT NULL,
  `model` varchar(45) DEFAULT NULL,
  `View` varchar(45) DEFAULT NULL,
  `type` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `password_cat` (
  `id` int NOT NULL AUTO_INCREMENT,
  `category` varchar(145) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `category_UNIQUE` (`category`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `password_cat` VALUES (7,'AD'),(8,'Backup'),(13,'Desktop Software'),(10,'DNS'),(6,'Firewall'),(5,'Printers'),(12,'Remote Desktop'),(9,'Security'),(1,'Server'),(2,'Switch'),(4,'Voice Gateway'),(11,'Website'),(3,'Wireless');


CREATE TABLE `passwords` (
  `id` int NOT NULL AUTO_INCREMENT,
  `service` varchar(255) DEFAULT NULL,
  `url` varchar(255) DEFAULT NULL,
  `username` varchar(255) DEFAULT NULL,
  `password` longtext,
  `otp` varchar(200) DEFAULT NULL,
  `category` varchar(255) DEFAULT NULL,
  `updated` varchar(40) DEFAULT NULL,
  `view` varchar(45) DEFAULT NULL,
  `info` longtext,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `staff` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(45) DEFAULT NULL,
  `building` varchar(45) DEFAULT NULL,
  `room` varchar(45) DEFAULT NULL,
  `view` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `users` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(245) DEFAULT NULL,
  `password` varchar(245) DEFAULT '$2a$10$i9.PCv3J2GhXBSJuKI6lt.tekoijyCPf0mKLWneGFuuYWuSh3EG/W',
  `name` varchar(245) DEFAULT NULL,
  `phone` varchar(45) DEFAULT NULL,
  `session` varchar(245) DEFAULT NULL,
  `status` varchar(45) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `username_UNIQUE` (`username`),
  UNIQUE KEY `phone_UNIQUE` (`phone`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO `users` VALUES (1,'tcadmin','$2a$10$i9.PCv3J2GhXBSJuKI6lt.tekoijyCPf0mKLWneGFuuYWuSh3EG/W','Admin','608-348-9000','','Active');

CREATE TABLE `wifi` (
  `id` int NOT NULL AUTO_INCREMENT,
  `ssid` longtext,
  `password` longtext,
  `status` varchar(45) DEFAULT 'true',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `tcadmin`.`maps` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `file` VARCHAR(255) NULL,
  `building` VARCHAR(45) NULL,
  `type` VARCHAR(45) NULL,
  `view` VARCHAR(45) NULL DEFAULT 'true',
  PRIMARY KEY (`id`));

  CREATE TABLE `tcadmin`.`servers` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(145) NULL,
  `mac` VARCHAR(45) NULL,
  `ip` VARCHAR(45) NULL,
  `hdd` VARCHAR(45) NULL,
  `ram` VARCHAR(45) NULL,
  `os` VARCHAR(45) NULL,
  `role` LONGTEXT NULL,
  `view` VARCHAR(45) NULL,
  PRIMARY KEY (`id`));


CREATE TABLE `tcadmin`.`printers` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NULL,
  `make` VARCHAR(145) NULL,
  `model` VARCHAR(145) NULL,
  `sn` VARCHAR(45) NULL,
  `date` VARCHAR(45) NULL,
  `mac` VARCHAR(45) NULL,
  `ip` VARCHAR(45) NULL,
  `building` VARCHAR(45) NULL,
  `room` VARCHAR(45) NULL,
  `view` VARCHAR(45) NULL,
  PRIMARY KEY (`id`));



CREATE TABLE `tcadmin`.`phones` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `make` VARCHAR(145) NULL,
  `model` VARCHAR(145) NULL,
  `sn` VARCHAR(45) NULL,
  `date` VARCHAR(45) NULL,
  `mac` VARCHAR(45) NULL,
  `tag` VARCHAR(45) NULL,
  `building` VARCHAR(45) NULL,
  `room` VARCHAR(45) NULL,
  `view` VARCHAR(45) NULL,
  PRIMARY KEY (`id`));
