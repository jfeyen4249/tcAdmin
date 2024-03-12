const express = require("express");
const bcrypt = require("bcryptjs");
const mysql = require("mysql2");
const crypto = require("crypto");
const dotenv = require("dotenv");

dotenv.config({ path: "./.env" });

const router = express.Router();

const connection = mysql.createPool({
    host: process.env.db_host,
    user: process.env.db_user,
    password: process.env.db_password,
    database: process.env.db_database,
  });

router.get("/");

router.get("/", (req, res) => {
    connection.query(
      `SELECT * FROM server_info`,
      function (error, results, fields) {
        if (error) throw error;
        res.send(results);
      }
    );
  });

module.exports = router;