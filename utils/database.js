const mysql = require("mysql2");
const dotenv = require("dotenv");

dotenv.config({ path: "./.env"});

const connection = mysql.createPool({
    host: process.env.db_host,
    user: process.env.db_user,
    password: process.env.db_password,
    database: process.env.db_database,
});



module.exports = connection;