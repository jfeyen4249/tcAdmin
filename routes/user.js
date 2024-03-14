const express = require("express");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const database = require("../utils/database.js");
const session = require("../utils/session.js");

const router = express.Router();

router.get("/");

router.post("/", async (req, res) => {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    database.query(
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
