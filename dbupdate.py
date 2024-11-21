import mysql.connector
from mysql.connector import errorcode
from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

def connect_to_db():
    return mysql.connector.connect(
        host=os.getenv("db_host"),
        user=os.getenv("db_user"),
        password=os.getenv("db_password"),
        database=os.getenv("db_database"),
    )

def table_exists(cursor, table_name):
    cursor.execute(f"SHOW TABLES LIKE '{table_name}'")
    return cursor.fetchone() is not None

def create_table(cursor, create_table_sql):
    print("Creating table: " + create_table_sql)
    cursor.execute(create_table_sql)

def get_table_columns(cursor, table_name):
    cursor.execute(f"DESCRIBE {table_name}")
    return {row[0]: row[1] for row in cursor.fetchall()}

def add_missing_columns(cursor, table_name, existing_columns, required_columns):
    for col, datatype in required_columns.items():
        if col not in existing_columns:
            try:
                datatype = datatype.rstrip(",")  # Remove any trailing comma
                sql = f"ALTER TABLE {table_name} ADD COLUMN {col} {datatype}"
                print(f"Executing SQL: {sql}")  # Debug statement to print the SQL being executed
                cursor.execute(sql)
            except mysql.connector.errors.ProgrammingError as e:
                print(f"Error adding column '{col}' with datatype '{datatype}' to table '{table_name}': {e}")
                raise

def main():
    db = connect_to_db()
    cursor = db.cursor()

    tables = {
        "alert_log": """
            CREATE TABLE `alert_log` (
                `id` int NOT NULL AUTO_INCREMENT,
                `down_time` int DEFAULT NULL,
                `up_time` int DEFAULT NULL,
                `total` varchar(45) DEFAULT NULL,
                `device_id` varchar(45) DEFAULT NULL,
                `info` LONGTEXT DEFAULT NULL,
                PRIMARY KEY (`id`)
            );
        """,
        "ap": """
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
            );
        """,
        "buildings": """
            CREATE TABLE `buildings` (
                `id` int NOT NULL AUTO_INCREMENT,
                `acronymn` varchar(105) NOT NULL,
                `view` varchar(45) DEFAULT NULL,
                `name` varchar(45) NOT NULL,
                `return_building` varchar(45) NOT NULL DEFAULT 'false',
                `building_code` varchar(45) NOT NULL,
                `color` varchar(45) DEFAULT 'bg-white',
                PRIMARY KEY (`id`)
            );
        """,
        "chromebook_log": """
            CREATE TABLE `chromebook_log` (
                `id` int NOT NULL AUTO_INCREMENT,
                `chromebook_id` varchar(45) DEFAULT NULL,
                `date` varchar(45) DEFAULT NULL,
                `log` longtext,
                `action` longtext NOT NULL,
                PRIMARY KEY (`id`)
            );
        """,
        "chromebook_makes": """
            CREATE TABLE `chromebook_makes` (
                `id` int NOT NULL AUTO_INCREMENT,
                `make` varchar(45) DEFAULT NULL,
                `model` varchar(45) DEFAULT NULL,
                `screen` varchar(45) DEFAULT NULL,
                `cost` varchar(45) DEFAULT NULL,
                `updates` varchar(45) DEFAULT NULL,
                `status` varchar(45) DEFAULT 'true',
                PRIMARY KEY (`id`)
            );
        """,
        "chromebook_repairs": """
            CREATE TABLE `chromebook_repairs` (
                `id` int NOT NULL AUTO_INCREMENT,
                `serial` varchar(45) NOT NULL,
                `school` varchar(45) NOT NULL,
                `reasonLong` varchar(45) NOT NULL,
                `reason` varchar(45) NOT NULL,
                `comment` longtext,
                `explaination` longtext,
                `isReturned` varchar(45) NOT NULL DEFAULT 'False',
                `schoolName` varchar(45) NOT NULL,
                PRIMARY KEY (`id`)
            );
        """,
        "chromebooks": """
            CREATE TABLE `chromebooks` (
                `id` int NOT NULL AUTO_INCREMENT,
                `model_id` int NOT NULL,
                `date_added` varchar(45) DEFAULT NULL,
                `tag` varchar(45) DEFAULT NULL,
                `building` varchar(45) DEFAULT NULL,
                `status` varchar(45) DEFAULT 'true',
                `sn` varchar(45) DEFAULT NULL,
                `device_status` varchar(45) DEFAULT NULL,
                `student` varchar(245) DEFAULT NULL,
                `student_year` varchar(45) DEFAULT NULL,
                PRIMARY KEY (`id`),
                KEY `chromebooks_model_id_fkey` (`model_id`),
                CONSTRAINT `chromebooks_model_id_fkey` FOREIGN KEY (`model_id`) REFERENCES `chromebook_makes` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
            );
        """,
        "computers": """
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
                `sn` varchar(255) DEFAULT 'N/A',
                `type` varchar(45) DEFAULT 'N/A',
                `tag` varchar(45) DEFAULT 'N/A',
                `ip` varchar(45) DEFAULT 'N/A',
                `make` varchar(45) DEFAULT 'N/A',
                `model` varchar(45) DEFAULT 'N/A',
                `alert` varchar(45) DEFAULT '0',
                `user` varchar(245) DEFAULT ' N/A',

                PRIMARY KEY (`id`)
            );
        """,
        "contacts": """
            CREATE TABLE `contacts` (
                `id` int NOT NULL AUTO_INCREMENT,
                `name` varchar(245) DEFAULT NULL,
                `company` varchar(245) DEFAULT NULL,
                `title` varchar(245) DEFAULT NULL,
                `website` varchar(45) DEFAULT NULL,
                `email` varchar(45) DEFAULT NULL,
                `phone` varchar(45) DEFAULT NULL,
                `cell` varchar(45) DEFAULT NULL,
                `fax` varchar(45) DEFAULT NULL,
                `info` longtext,
                `status` varchar(45) DEFAULT 'true',
                PRIMARY KEY (`id`)
            );
        """,
        "devices": """
            CREATE TABLE `devices` (
                `id` int NOT NULL AUTO_INCREMENT,
                `device` varchar(115) DEFAULT NULL,
                `status` varchar(45) DEFAULT 'true',
                PRIMARY KEY (`id`)
            );
        """,
        "docs": """
            CREATE TABLE `docs` (
                `id` int NOT NULL AUTO_INCREMENT,
                `doc` varchar(255) DEFAULT NULL,
                `doc_body` longblob,
                `date` varchar(45) DEFAULT NULL,
                `status` varchar(45) DEFAULT 'true',
                PRIMARY KEY (`id`)
            );
        """,
        "ipad": """
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
            );
        """,
        "guides": """
            CREATE TABLE `guides` (
                `id` int NOT NULL AUTO_INCREMENT,
                `name` varchar(45) DEFAULT NULL,
                `content` longblob,
                `status` varchar(45) DEFAULT 'true',
                `link` longtext,
                PRIMARY KEY (`id`)
            );
        """,
        "logs": """
            CREATE TABLE `logs` (
                `id` int NOT NULL AUTO_INCREMENT,
                `date` varchar(45) DEFAULT NULL,
                `time` varchar(45) DEFAULT NULL,
                `log` longtext,
                `user` varchar(45) DEFAULT NULL,
                PRIMARY KEY (`id`)
            );
        """,
        "makes": """
            CREATE TABLE `makes` (
                `id` int NOT NULL AUTO_INCREMENT,
                `make` varchar(45) DEFAULT NULL,
                `model` varchar(45) DEFAULT NULL,
                `View` varchar(45) DEFAULT NULL,
                `type` varchar(45) DEFAULT NULL,
                PRIMARY KEY (`id`)
            );
        """,
        "maps": """
            CREATE TABLE `maps` (
                `id` int NOT NULL AUTO_INCREMENT,
                `file` varchar(255) DEFAULT NULL,
                `building` varchar(45) DEFAULT NULL,
                `type` varchar(45) DEFAULT NULL,
                `view` varchar(45) DEFAULT 'true',
                PRIMARY KEY (`id`)
            );
        """,
        "monitoring": """
            CREATE TABLE `monitoring` (
                `id` int NOT NULL AUTO_INCREMENT,
                `port` varchar(45) DEFAULT 'none',
                `ip` varchar(45) DEFAULT NULL,
                `trys` int DEFAULT '3',
                `view` varchar(45) DEFAULT 'true',
                `alerted` int DEFAULT '0',
                `alert_time` varchar(45) DEFAULT NULL,
                `time` varchar(45) DEFAULT NULL,
                `date` varchar(45) DEFAULT NULL,
                `status` varchar(45) DEFAULT 'up',
                `count` int DEFAULT '1',
                `log_id` varchar(45) DEFAULT NULL,
                `name` varchar(45) DEFAULT NULL,
                `type` varchar(45) DEFAULT 'ping',
                PRIMARY KEY (`id`)
            );
        """,
        "networking": """
            CREATE TABLE `networking` (
                `id` int NOT NULL AUTO_INCREMENT,
                `make` varchar(45) DEFAULT NULL,
                `model` varchar(45) DEFAULT NULL,
                `type` varchar(200) DEFAULT NULL,
                `ip` varchar(45) DEFAULT NULL,
                `hostname` varchar(45) DEFAULT NULL,
                `sn` varchar(45) DEFAULT NULL,
                `tag` varchar(45) DEFAULT NULL,
                `date` varchar(45) DEFAULT NULL,
                `building` varchar(45) DEFAULT NULL,
                `view` varchar(45) DEFAULT 'true',
                `room` varchar(45) DEFAULT NULL,
                `username` varchar(45) DEFAULT NULL,
                `password` varchar(255) DEFAULT NULL,
                `backup` varchar(45) DEFAULT '0',
                `config` longblob,
                PRIMARY KEY (`id`)
            );
        """,
        "misc_inventory": """
        create table misc_inventory
        (
            id           int auto_increment
                primary key,
            assignedUser varchar(255) null,
            itemName     varchar(255) not null,
            assetTag     varchar(255) not null,
            serialNumber varchar(255) not null,
            info         longtext     null
        );
        """,
        "misc_inventory_logs": """
        create table misc_inventory_logs
        (
            id      int auto_increment
                primary key,
            misc_id int         not null,
            date    varchar(45) not null,
            log     longtext    null,
            action  longtext    not null,
            constraint table_name_misc_inventory_id_fk
                foreign key (misc_id) references misc_inventory (id)
                    on delete cascade
        );
        """,
        "parts": """
            CREATE TABLE `parts` (
                `id` int NOT NULL AUTO_INCREMENT,
                `partName` varchar(255) NOT NULL,
                `partSKU` varchar(255) NOT NULL,
                `partCount` int NOT NULL DEFAULT '0',
                `partUrl` mediumtext NOT NULL,
                `partComputerModel` varchar(45) NOT NULL,
                PRIMARY KEY (`id`)
            );
        """,
        "parts_log": """
            CREATE TABLE `parts_log` (
                `id` int NOT NULL AUTO_INCREMENT,
                `part_id` varchar(45) DEFAULT NULL,
                `date` varchar(45) DEFAULT NULL,
                `log` longtext,
                `action` longtext NOT NULL,
                PRIMARY KEY (`id`)
            );
        """,
        "password_cat": """
            CREATE TABLE `password_cat` (
                `id` int NOT NULL AUTO_INCREMENT,
                `category` varchar(145) NOT NULL,
                PRIMARY KEY (`id`),
                UNIQUE KEY `category_UNIQUE` (`category`)
            );
        """,
        "password_history": """
            CREATE TABLE `password_history` (
                `id` int NOT NULL AUTO_INCREMENT,
                `password_id` int DEFAULT NULL,
                `password` longtext,
                `date` varchar(45) DEFAULT NULL,
                `time` varchar(45) DEFAULT NULL,
                `user` varchar(45) DEFAULT NULL,
                PRIMARY KEY (`id`)
            );
        """,
        "passwords": """
            CREATE TABLE `passwords` (
                `id` int NOT NULL AUTO_INCREMENT,
                `service` varchar(255) DEFAULT NULL,
                `url` varchar(255) DEFAULT NULL,
                `username` varchar(255) DEFAULT NULL,
                `password` longtext,
                `otp` varchar(200) DEFAULT 'none',
                `category` varchar(255) DEFAULT NULL,
                `updated` varchar(40) DEFAULT NULL,
                `view` varchar(45) DEFAULT NULL,
                `info` longtext,
                PRIMARY KEY (`id`)
            );
        """,
        "phones": """
            CREATE TABLE `phones` (
                `id` int NOT NULL AUTO_INCREMENT,
                `make` varchar(45) DEFAULT NULL,
                `model` varchar(45) DEFAULT NULL,
                `sn` varchar(45) DEFAULT NULL,
                `mac` varchar(45) DEFAULT NULL,
                `tag` varchar(45) DEFAULT NULL,
                `building` varchar(45) DEFAULT NULL,
                `room` varchar(45) DEFAULT NULL,
                `date` varchar(45) DEFAULT NULL,
                `view` varchar(45) DEFAULT NULL,
                `extention` varchar(45) DEFAULT NULL,
                PRIMARY KEY (`id`)
            );
        """,
        "printers": """
            CREATE TABLE `printers` (
                `id` int NOT NULL AUTO_INCREMENT,
                `name` varchar(255) DEFAULT NULL,
                `make` varchar(145) DEFAULT NULL,
                `model` varchar(145) DEFAULT NULL,
                `sn` varchar(45) DEFAULT NULL,
                `date` varchar(45) DEFAULT NULL,
                `mac` varchar(45) DEFAULT NULL,
                `ip` varchar(45) DEFAULT NULL,
                `building` varchar(45) DEFAULT NULL,
                `room` varchar(45) DEFAULT NULL,
                `view` varchar(45) DEFAULT NULL,
                PRIMARY KEY (`id`)
            );
        """,
        "projectors": """
            CREATE TABLE `projectors` (
                `id` int NOT NULL AUTO_INCREMENT,
                `make` varchar(45) DEFAULT NULL,
                `model` varchar(45) DEFAULT NULL,
                `sn` varchar(45) DEFAULT NULL,
                `tag` varchar(45) DEFAULT NULL,
                `building` varchar(45) DEFAULT NULL,
                `room` varchar(45) DEFAULT NULL,
                `bulb` varchar(45) DEFAULT NULL,
                `view` varchar(45) DEFAULT NULL,
                `date` varchar(45) DEFAULT NULL,
                PRIMARY KEY (`id`)
            );
        """,
        "renewals": """
            CREATE TABLE `renewals` (
                `id` int NOT NULL AUTO_INCREMENT,
                `start` varchar(45) DEFAULT NULL,
                `renewal_date` varchar(45) DEFAULT NULL,
                `cost` varchar(45) DEFAULT NULL,
                `po` varchar(45) DEFAULT NULL,
                `status` varchar(45) DEFAULT 'Active',
                `service` varchar(45) DEFAULT NULL,
                `year` varchar(45) DEFAULT NULL,
                `company` varchar(45) DEFAULT NULL,
                `contact` varchar(45) DEFAULT NULL,
                PRIMARY KEY (`id`)
            );
        """,
        "repair_reasons": """
            CREATE TABLE `repair_reasons` (
                `id` int NOT NULL,
                `reason` varchar(45) NOT NULL,
                `value` varchar(45) NOT NULL,
                PRIMARY KEY (`id`)
            );
        """,
        "rooms": """
            CREATE TABLE `rooms` (
                `id` int NOT NULL AUTO_INCREMENT,
                `room` varchar(45) DEFAULT NULL,
                `building` varchar(45) DEFAULT NULL,
                `view` varchar(45) DEFAULT 'true',
                PRIMARY KEY (`id`)
            );
        """,
        "servers": """
            CREATE TABLE `servers` (
                `id` int NOT NULL AUTO_INCREMENT,
                `name` varchar(145) DEFAULT NULL,
                `mac` varchar(45) DEFAULT NULL,
                `ip` varchar(45) DEFAULT NULL,
                `hdd` varchar(45) DEFAULT NULL,
                `ram` varchar(45) DEFAULT NULL,
                `os` varchar(45) DEFAULT NULL,
                `role` longtext,
                `view` varchar(45) DEFAULT NULL,
                PRIMARY KEY (`id`)
            );
        """,
        "settings": """
            CREATE TABLE `tcadmin`.`settings` (
                `id` INT NOT NULL AUTO_INCREMENT,
                `settingName` VARCHAR(255) NOT NULL,
                `enabled` INT NULL DEFAULT 0,
                PRIMARY KEY (`id`)
            );
        """,
        "slack": """
            CREATE TABLE `slack` (
                `id` int NOT NULL AUTO_INCREMENT,
                `hook` varchar(225) DEFAULT NULL,
                `network` varchar(10) DEFAULT 'false',
                `renewals` varchar(45) DEFAULT 'fales',
                `pc` varchar(45) DEFAULT 'false',
                PRIMARY KEY (`id`)
            );
        """,
        "smartboards": """
            CREATE TABLE `smartboards` (
                `id` int NOT NULL AUTO_INCREMENT,
                `make` varchar(45) DEFAULT NULL,
                `model` varchar(45) DEFAULT NULL,
                `sn` varchar(45) DEFAULT NULL,
                `tag` varchar(45) DEFAULT NULL,
                `building` varchar(45) DEFAULT NULL,
                `room` varchar(45) DEFAULT NULL,
                `size` varchar(45) DEFAULT NULL,
                `view` varchar(45) DEFAULT 'true',
                `date` varchar(45) DEFAULT NULL,
                PRIMARY KEY (`id`)
            );
        """,
        "staff": """
            CREATE TABLE `staff` (
                `id` int NOT NULL AUTO_INCREMENT,
                `name` varchar(245) DEFAULT NULL,
                `building` varchar(45) DEFAULT NULL,
                `room` varchar(45) DEFAULT NULL,
                `view` varchar(45) DEFAULT NULL,
                `title` varchar(145) DEFAULT 'true',
                PRIMARY KEY (`id`)
            );
        """,
        "students": """
            CREATE TABLE `students` (
                `id` int NOT NULL AUTO_INCREMENT,
                `student` varchar(245) DEFAULT NULL,
                `year` varchar(45) DEFAULT NULL,
                `status` varchar(45) DEFAULT 'true',
                PRIMARY KEY (`id`)
            );
        """,
        "users": """
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
            );
        """,
        "wifi": """
            CREATE TABLE `wifi` (
                `id` int NOT NULL AUTO_INCREMENT,
                `ssid` longtext,
                `password` longtext,
                `status` varchar(45) DEFAULT 'true',
                PRIMARY KEY (`id`)
            );
        """, 
        "hotspot": """
            CREATE TABLE `tcadmin`.`hotspot` (
                `id` INT NOT NULL AUTO_INCREMENT,
                `make` VARCHAR(245) NULL,
                `model` VARCHAR(245) NULL,
                `tag` VARCHAR(45) NULL,
                `sn` VARCHAR(45) NULL,
                `building` VARCHAR(45) NULL,
                `status` VARCHAR(45) NULL DEFAULT 'true',
                PRIMARY KEY (`id`));
        """, 
        "hotspot_log": """
            CREATE TABLE `tcadmin`.`hotspot_log` (
                `id` INT NOT NULL AUTO_INCREMENT,
                `hotspot_id` VARCHAR(245) NULL,
                `date` VARCHAR(245) NULL,
                `log` LONGTEXT NULL,
                PRIMARY KEY (`id`));
        """, 
    }

    for table_name, create_sql in tables.items():
        if not table_exists(cursor, table_name):
            create_table(cursor, create_sql)
        else:
            columns = {
                line.strip().split()[0].strip('`'): ' '.join(line.strip().split()[1:])
                for line in create_sql.splitlines()
                if line.strip().startswith("`")
            }
            existing_columns = get_table_columns(cursor, table_name)
            add_missing_columns(cursor, table_name, existing_columns, columns)

    db.commit()
    cursor.close()
    db.close()

if __name__ == "__main__":
    main()
