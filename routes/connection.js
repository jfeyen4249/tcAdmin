const express = require("express");
const bcrypt = require("bcryptjs");
const mysql = require("mysql2");
const crypto = require("crypto");
const dotenv = require("dotenv");
const { v4: uuidv4 } = require("uuid");

dotenv.config({ path: "./.env" });

const router = express.Router();

const connection = mysql.createPool({
    host: process.env.db_host,
    user: process.env.db_user,
    password: process.env.db_password,
    database: process.env.db_database,
  });

router.get("/");

router.post("/login", async (req, res) => {
    const { username, password } = req.body;
    connection.query(
      "SELECT password FROM users WHERE username = ? AND status = ?",
      [username, "Active"],
      (err, results) => {
        console.log(results);
  
        bcrypt.compare(password, results[0].password, function (err, isMatch) {
          if (err) {
            throw err;
          } else if (!isMatch) {
            res.send("Incorrect username or password!");
            // console.log("fail")
          } else {
            const sessionID = uuidv4();
            connection.query(
              "UPDATE users SET session = ? WHERE username = ?",
              [sessionID, username],
              (err) => {
                if (err) {
                  console.error(err);
                } else {
                  const currentDate = new Date();
                  // Add one year
                  currentDate.setFullYear(currentDate.getFullYear() + 1);
                  // Set the session ID as a cookie with the name 'session_id' and max-age set to never expire
                  res.cookie("session_id", sessionID, {
                    maxAge: currentDate,
                    httpOnly: true,
                    secure: false,
                    sameSite: "strict",
                  });
                  res.cookie("username", username, {
                    maxAge: currentDate,
                    httpOnly: true,
                    secure: true,
                    sameSite: "none",
                  });
                  //console.log('Pass')
                  res.send("Pass");
                }
              }
            );
          }
        });
      }
    );
  });


router.get("/logout", validateSession,  (req, res) => {
    const username = req.cookies.username;
    connection.query(
      `UPDATE users SET session = '' WHERE username = ?`,
      [username],
      function (error, results, fields) {
        if (error) throw error;
        res.send('logged out')
      }
    );
});
  
router.get("/login-check", (req, res) => {
    console.log("connection/login-check hit");
    const username = req.cookies.username;
    const sessionID = req.cookies.session_id;
    connection.query(`SELECT * FROM users WHERE username = ? AND session = ?`, [username, sessionID],function (error, results, fields) {
        if (error) throw error;
        res.send('Pass')
        }
    );
});

function validateSession(req, res, next) {
    const sessionID = req.cookies.session_id;
    const username = req.cookies.username;

    if (sessionID) {
        // Check if the session ID exists in the user table
        connection.query(
        "SELECT * FROM users WHERE session = ? AND username = ?",
        [sessionID, username],
        (err, results) => {
            if (err) {
            console.error(err);
            res.redirect("/");
            } else if (results.length === 1) {
            // If the session is valid, continue to the next middleware or route handler
            next();
            } else {
            res.redirect("/");
            }
        }
        );
    } else {
        res.redirect("/");
    }
}

module.exports = router;