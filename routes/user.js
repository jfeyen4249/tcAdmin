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

router.post("/", async (req, res) => {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    connection.query(
      `SELECT username FROM users WHERE username = ?`,
      [req.body.username],
      (err, results) => {
        if (err) {
          console.error(err);
        } else if (results.length > 0) {
          res.send("This email is already in use!");
        } else {
          connection.query(`INSERT INTO users SET username = ?, password = ?, name = ?, phone = ?`, [req.body.username, hashedPassword, req.body.name, req.body.phone], (err, results) => {
              if (err) {
                console.error(err);
              } else {
                res.send("Your account has been created and pending approval!");
              }
            }
          );
        }
      }
    );
  });

module.exports = router;
