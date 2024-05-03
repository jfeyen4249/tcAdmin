const mysql = require("mysql2");
const dotenv = require("dotenv");

dotenv.config({ path: "./.env"});

const connection = mysql.createPool({
    host: process.env.db_host,
    user: process.env.db_user,
    password: process.env.db_password,
    database: process.env.db_database,
});


connection.query(`SHOW TABLES LIKE 'ap'`, function (error, results, fields) {
    if (error) {
        throw error;
    }

    if (results.length > 0) {
        console.log('AP Table exists');
    } else {
        connection.query(
            `CREATE TABLE IF NOT EXISTS \`ap\` (
                id int NOT NULL AUTO_INCREMENT,
                make varchar(45) DEFAULT NULL,
                model varchar(45) DEFAULT NULL,
                sn varchar(45) DEFAULT NULL,
                mac varchar(45) DEFAULT NULL,
                name varchar(45) DEFAULT NULL,
                tag varchar(45) DEFAULT NULL,
                room varchar(45) DEFAULT NULL,
                building varchar(45) DEFAULT NULL,
                installed varchar(45) DEFAULT NULL,
                view varchar(45) DEFAULT NULL,
                PRIMARY KEY (id)
              ) ENGINE=InnoDB AUTO_INCREMENT=351 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;`,
            function (error, results, fields) {
              if (error) {
                  throw error;
              }
              console.log('test Table Added');
            }
          );
    }
});

connection.query(`SHOW TABLES LIKE 'buildings'`, function (error, results, fields) {
    if (error) {
        throw error;
    }

    if (results.length > 0) {
        console.log('Buidings Table exists');
    } else {
        connection.query(
            `CREATE TABLE IF NOT EXISTS \`buildings\` (
                id int NOT NULL AUTO_INCREMENT,
                name varchar(105) DEFAULT NULL,
                view varchar(45) DEFAULT NULL,
                PRIMARY KEY (id)
              ) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;`,
            function (error, results, fields) {
              if (error) {
                  throw error;
              }
              console.log('Buildings Table Added');
            }
          );
    }
});

connection.query(`SHOW TABLES LIKE 'buildings'`, function (error, results, fields) {
    if (error) {
        throw error;
    }

    if (results.length > 0) {
        console.log('Buidings Table exists');
    } else {
        connection.query(
            `CREATE TABLE \`buildings\` (
                id int NOT NULL AUTO_INCREMENT,
                name varchar(105) DEFAULT NULL,
                view varchar(45) DEFAULT NULL,
                PRIMARY KEY (id)
              ) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;`,
            function (error, results, fields) {
              if (error) {
                  throw error;
              }
              console.log('Buildings Table Added');
            }
          );
    }
});

connection.query(`SHOW TABLES LIKE 'computers'`, function (error, results, fields) {
    if (error) {
        throw error;
    }

    if (results.length > 0) {
        console.log('Computer Table exists');
    } else {
        connection.query(
            `CREATE TABLE  \`computers\` (
                id int NOT NULL AUTO_INCREMENT,
                name varchar(255) DEFAULT 'N/A',
                mac varchar(255) DEFAULT 'N/A',
                hdd varchar(45) DEFAULT 'N/A',
                ram varchar(45) DEFAULT 'N/A',
                os varchar(255) DEFAULT 'N/A',
                view varchar(45) DEFAULT 'true',
                building varchar(45) DEFAULT 'N/A',
                room varchar(45) DEFAULT 'N/A',
                processor varchar(255) DEFAULT 'N/A',
                sn varchar(45) DEFAULT 'N/A',
                type varchar(45) DEFAULT 'N/A',
                tag varchar(45) DEFAULT 'N/A',
                ip varchar(45) DEFAULT 'N/A',
                make varchar(45) DEFAULT 'N/A',
                model varchar(45) DEFAULT 'N/A',
                PRIMARY KEY (id)
              ) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;`,
            function (error, results, fields) {
              if (error) {
                  throw error;
              }
              console.log('Computers Table Added');
            }
          );
    }
});

connection.query(`SHOW TABLES LIKE 'docs'`, function (error, results, fields) {
    if (error) {
        throw error;
    }

    if (results.length > 0) {
        console.log('Docs Table exists');
    } else {
        connection.query(
            `CREATE TABLE \`docs\` (
                id int NOT NULL AUTO_INCREMENT,
                doc varchar(255) DEFAULT NULL,
                doc_body longtext,
                date varchar(45) DEFAULT NULL,
                status varchar(45) DEFAULT 'true',
                PRIMARY KEY (id)
              ) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;`,
            function (error, results, fields) {
              if (error) {
                  throw error;
              }
              console.log('Docs Table Added');
            }
          );
    }
});

connection.query(`SHOW TABLES LIKE 'ipad'`, function (error, results, fields) {
    if (error) {
        throw error;
    }

    if (results.length > 0) {
        console.log('ipad Table exists');
    } else {
        connection.query(
            `CREATE TABLE \`ipad\` (
                id int NOT NULL AUTO_INCREMENT,
                model varchar(45) DEFAULT NULL,
                sn varchar(45) DEFAULT NULL,
                building varchar(45) DEFAULT NULL,
                date varchar(45) DEFAULT NULL,
                room varchar(45) DEFAULT NULL,
                staff varchar(245) DEFAULT NULL,
                view varchar(45) DEFAULT NULL,
                storage varchar(45) DEFAULT NULL,
                screen varchar(45) DEFAULT NULL,
                tag varchar(45) DEFAULT NULL,
                PRIMARY KEY (id),
              ) ENGINE=InnoDB AUTO_INCREMENT=19 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;`,
            function (error, results, fields) {
              if (error) {
                  throw error;
              }
              console.log('ipda Table Added');
            }
          );
    }
});

connection.query(`SHOW TABLES LIKE 'makes'`, function (error, results, fields) {
    if (error) {
        throw error;
    }

    if (results.length > 0) {
        console.log('ipad Table exists');
    } else {
        connection.query(
            `CREATE TABLE \`makes\` (
                id int NOT NULL AUTO_INCREMENT,
                make varchar(45) DEFAULT NULL,
                model varchar(45) DEFAULT NULL,
                View varchar(45) DEFAULT NULL,
                type varchar(45) DEFAULT NULL,
                PRIMARY KEY (id)
              ) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;`,
            function (error, results, fields) {
              if (error) {
                  throw error;
              }
              console.log('make Table Added');
            }
          );
    }
});

connection.query(`SHOW TABLES LIKE 'maps'`, function (error, results, fields) {
    if (error) {
        throw error;
    }

    if (results.length > 0) {
        console.log('maps Table exists');
    } else {
        connection.query(
            `CREATE TABLE \`maps\` (
                id int NOT NULL AUTO_INCREMENT,
                file varchar(245) DEFAULT NULL,
                building varchar(245) DEFAULT NULL,
                view varchar(45) DEFAULT NULL,
                type varchar(45) DEFAULT NULL,
                PRIMARY KEY (id)
              ) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;`,
            function (error, results, fields) {
              if (error) {
                  throw error;
              }
              console.log('maps Table Added');
            }
          );
    }
});

connection.query(`SHOW TABLES LIKE 'password_cat'`, function (error, results, fields) {
    if (error) {
        throw error;
    }

    if (results.length > 0) {
        console.log('password_cat Table exists');
    } else {
        connection.query(
            `CREATE TABLE \`password_cat\` (
                id int NOT NULL AUTO_INCREMENT,
                category varchar(145) NOT NULL,
                PRIMARY KEY (id),
              ) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;`,
            function (error, results, fields) {
              if (error) {
                  throw error;
              }
              console.log('password_cat Table Added');
              connection.query(`INSERT INTO password_cat VALUES (7,'AD'),(8,'Backup'),(13,'Desktop Software'),(10,'DNS'),(6,'Firewall'),(5,'Printers'),(12,'Remote Desktop'),(9,'Security'),(1,'Server'),(2,'Switch'),(4,'Voice Gateway'),(11,'Website'),(3,'Wireless');
              `, function (error, results, fields) {
                  if (error) {throw error;

                  }
                  console.log('password categories added');
                }
              );
            }
          );
    }
});

connection.query(`SHOW TABLES LIKE 'passwords'`, function (error, results, fields) {
    if (error) {
        throw error;
    }

    if (results.length > 0) {
        console.log('password Table exists');
    } else {
        connection.query(
            `CREATE TABLE  \`passwords\` (
                id int NOT NULL AUTO_INCREMENT,
                service varchar(255) DEFAULT NULL,
                url varchar(255) DEFAULT NULL,
                username varchar(255) DEFAULT NULL,
                password longtext,
                otp varchar(200) DEFAULT NULL,
                category varchar(255) DEFAULT NULL,
                updated varchar(40) DEFAULT NULL,
                view varchar(45) DEFAULT NULL,
                info longtext,
                PRIMARY KEY (id)
              ) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;`,
            function (error, results, fields) {
              if (error) {
                  throw error;
              }
              console.log('password Table Added');
            }
          );
    }
});

connection.query(`SHOW TABLES LIKE 'staff'`, function (error, results, fields) {
    if (error) {
        throw error;
    }

    if (results.length > 0) {
        console.log('staff Table exists');
    } else {
        connection.query(
            `CREATE TABLE \`staff\` (
                id int NOT NULL AUTO_INCREMENT,
                name varchar(245) DEFAULT NULL,
                building varchar(45) DEFAULT NULL,
                room varchar(45) DEFAULT NULL,
                view varchar(45) DEFAULT NULL,
                PRIMARY KEY (id)
              )`,
            function (error, results, fields) {
              if (error) {
                  throw error;
              }
              console.log('staff Table Added');
            }
          );
    }
});


connection.query(`SHOW TABLES LIKE 'users'`, function (error, results, fields) {
    if (error) {
        throw error;
    }

    if (results.length > 0) {
        console.log('users Table exists');
    } else {
        connection.query(
            `CREATE TABLE \`users\` (
                id int NOT NULL AUTO_INCREMENT,
                username varchar(245) DEFAULT NULL,
                password varchar(245) DEFAULT '$2a$10$i9.PCv3J2GhXBSJuKI6lt.tekoijyCPf0mKLWneGFuuYWuSh3EG/W',
                name varchar(245) DEFAULT NULL,
                phone varchar(45) DEFAULT NULL,
                session varchar(245) DEFAULT NULL,
                status varchar(45) DEFAULT NULL,
                PRIMARY KEY (id),
                UNIQUE KEY username_UNIQUE (username),
                UNIQUE KEY phone_UNIQUE (phone)
              ) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;`,
            function (error, results, fields) {
              if (error) {
                  throw error;
              }
              console.log('users Table Added');
              connection.query(`INSERT INTO users VALUES (1,'tcadmin','$2a$10$i9.PCv3J2GhXBSJuKI6lt.tekoijyCPf0mKLWneGFuuYWuSh3EG/W','Admin','608-348-9000','','Active');`,
                function (error, results, fields) {
                  if (error) {
                      throw error;
                  }
                  console.log('tcadmin user was created');
                }
              );
            }
          );
    }
});

connection.query(`SHOW TABLES LIKE 'wifi'`, function (error, results, fields) {
    if (error) {
        throw error;
    }

    if (results.length > 0) {
        console.log('wifi Table exists');
    } else {
        connection.query(
            `CREATE TABLE \`wifi\` (
                id int NOT NULL AUTO_INCREMENT,
                ssid longtext,
                password longtext,
                status varchar(45) DEFAULT 'true',
                PRIMARY KEY (id)
              ) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;`,
            function (error, results, fields) {
              if (error) {
                  throw error;
              }
              console.log('wifi Table Added');
            }
          );
    }
});


connection.query(`SHOW TABLES LIKE 'printers'`, function (error, results, fields) {
    if (error) {
        throw error;
    }

    if (results.length > 0) {
        console.log('printers Table exists');
    } else {
        connection.query(
            `CREATE TABLE \`printers\` (
                id INT NOT NULL AUTO_INCREMENT,
                name VARCHAR(255) NULL,
                make VARCHAR(145) NULL,
                model VARCHAR(145) NULL,
                sn VARCHAR(45) NULL,
                date VARCHAR(45) NULL,
                mac VARCHAR(45) NULL,
                ip VARCHAR(45) NULL,
                building VARCHAR(45) NULL,
                room VARCHAR(45) NULL,
                view VARCHAR(45) NULL,
                PRIMARY KEY (id));`,
            function (error, results, fields) {
              if (error) {
                  throw error;
              }
              console.log('printers Table Added');
            }
          );
    }
});

connection.query(`SHOW TABLES LIKE 'projectors'`, function (error, results, fields) {
    if (error) {
        throw error;
    }

    if (results.length > 0) {
        console.log('projectors Table exists');
    } else {
        connection.query(
            `CREATE TABLE IF NOT EXISTS \`projectors\` (
                id INT NOT NULL AUTO_INCREMENT,
                name VARCHAR(255) NULL,
                make VARCHAR(145) NULL,
                mode VARCHAR(145) NULL,
                sn VARCHAR(45) NULL,
                date VARCHAR(45) NULL,
                mac VARCHAR(45) NULL,
                tag VARCHAR(45) NULL,
                building VARCHAR(45) NULL,
                room VARCHAR(45) NULL,
                bulb VARCHAR(45) NULL,
                view VARCHAR(45) NULL,
                PRIMARY KEY (id));`,
            function (error, results, fields) {
              if (error) {
                  throw error;
              }
              console.log('projectors Table Added');
            }
          );
    }
});

connection.query(`SHOW TABLES LIKE 'phones'`, function (error, results, fields) {
    if (error) {
        throw error;
    }

    if (results.length > 0) {
        console.log('phones Table exists');
    } else {
        connection.query(
            `CREATE TABLE \`phones\` (
                id INT NOT NULL AUTO_INCREMENT,
                make VARCHAR(145) NULL,
                model VARCHAR(145) NULL,
                sn VARCHAR(45) NULL,
                date VARCHAR(45) NULL,
                mac VARCHAR(45) NULL,
                tag VARCHAR(45) NULL,
                building VARCHAR(45) NULL,
                room VARCHAR(45) NULL,
                view VARCHAR(45) NULL,
                PRIMARY KEY (id));`,
            function (error, results, fields) {
              if (error) {
                  throw error;
              }
              console.log('phones Table Added');
            }
          );
    }
});

connection.query(`SHOW TABLES LIKE 'chromebook_makes'`, function (error, results, fields) {
    if (error) {
        throw error;
    }

    if (results.length > 0) {
        console.log('Chromebook_makes table exists');
    } else {
        connection.query(
            `CREATE TABLE \`chromebook_makes\` (
                id INT NOT NULL AUTO_INCREMENT,
                make VARCHAR(45) NULL,
                model VARCHAR(45) NULL,
                screen VARCHAR(45) NULL,
                cost VARCHAR(45) NULL,
                updates VARCHAR(45) NULL,      
                PRIMARY KEY (id));`,
            function (error, results, fields) {
              if (error) {
                  throw error;
              }
              console.log('Chrombook_makes table was added!');
            }
          );
    }
});


connection.query(`SHOW TABLES LIKE 'chromebook_log'`, function (error, results, fields) {
    if (error) {
        throw error;
    }

    if (results.length > 0) {
        console.log('Chromebook_log table exists');
    } else {
        connection.query(
            `CREATE TABLE \`chromebook_log\` (
                id INT NOT NULL AUTO_INCREMENT,
                chromebook_id VARCHAR(45) NULL,
                action VARCHAR(45) NULL,
                date VARCHAR(45) NULL,
                log LONGTEXT NULL,
                PRIMARY KEY (id));`,
            function (error, results, fields) {
              if (error) {
                  throw error;
              }
              console.log('Chrombook_log table was added!');
            }
          );
    }
});

connection.query(`SHOW TABLES LIKE 'chromebooks'`, function (error, results, fields) {
    if (error) {
        throw error;
    }

    if (results.length > 0) {
        console.log('Chromebooks table exists');
    } else {
        connection.query(
            `CREATE TABLE \`chromebooks\` (
                id INT NOT NULL AUTO_INCREMENT,
                model_id VARCHAR(145) NULL,
                date_added VARCHAR(45) NULL,
                tag VARCHAR(45) NULL,
                building VARCHAR(45) NULL,
                status VARCHAR(45) NULL DEFAULT 'true',
                sn VARCHAR(45) NULL,
                device_status VARCHAR(45) NULL DEFAULT 'In Use',
                student VARCHAR(245) NULL,
                student_year VARCHAR(45) NULL,
                PRIMARY KEY (id));`,
            function (error, results, fields) {
              if (error) {
                  throw error;
              }
              console.log('Chrombooks table was added!');
            }
          );
    }
});

connection.query(`SHOW TABLES LIKE 'students'`, function (error, results, fields) {
    if (error) {
        throw error;
    }

    if (results.length > 0) {
        console.log('Students table exists');
    } else {
        connection.query(
            `CREATE TABLE \`students\` (
                id INT NOT NULL AUTO_INCREMENT,
                student VARCHAR(245) NULL,
                year VARCHAR(45) NULL,
                status VARCHAR(45) NULL DEFAULT 'true',
                PRIMARY KEY (id));`,
            function (error, results, fields) {
              if (error) {
                  throw error;
              }
              console.log('Chrombook table was added!');
            }
          );
    }
});



// CREATE TABLE `tcadmin`.`devices` (
//     `id` INT NOT NULL AUTO_INCREMENT,
//     `device` VARCHAR(115) NULL,
//     `status` VARCHAR(45) NULL DEFAULT 'true',
//     PRIMARY KEY (`id`));
  
// INSERT INTO `devices` (`device`) VALUES ('desktop');
// INSERT INTO `devices` (`device`) VALUES ('laptop');
// INSERT INTO `devices` (`device`) VALUES ('Macbook');
// INSERT INTO `devices` (`device`) VALUES ('ap');
// INSERT INTO `devices` (`device`) VALUES ('iPad');
// INSERT INTO `devices` (`device`) VALUES ('Projector');
// INSERT INTO `devices` (`device`) VALUES ('switch');
// INSERT INTO `devices` (`device`) VALUES ('server');
// INSERT INTO `devices` (`device`) VALUES ('Phone');
// INSERT INTO `devices` (`device`) VALUES ('Printer');
// INSERT INTO `devices` (`device`) VALUES ('Smartboard');


// CREATE TABLE `tcadmin`.`rooms` (
//     `id` INT NOT NULL AUTO_INCREMENT,
//     `room` VARCHAR(45) NULL,
//     `building` VARCHAR(45) NULL,
//     `view` VARCHAR(45) NULL DEFAULT 'true',
//     PRIMARY KEY (`id`));
  


// CREATE TABLE `tcadmin`.`logs` (
//     `id` INT NOT NULL AUTO_INCREMENT,
//     `dat` VARCHAR(45) NULL,
//     `time` VARCHAR(45) NULL,
//     `log` LONGTEXT NULL,
//     PRIMARY KEY (`id`));
  
