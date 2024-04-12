const express = require("express");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const { v4: uuidv4 } = require("uuid");

const database = require("../utils/database.js");
const session = require("../utils/session.js");

dotenv.config({ path: "./.env" });

const router = express.Router();

router.get("/");

router.post("/login", async (req, res) => {
    const { username, password } = req.body;

    database.query(
      "SELECT password FROM users WHERE username = ? AND status = ?",
      [username, "Active"],
      (err, results) => {
        bcrypt.compare(password, results[0].password, function (err, isMatch) {
          if (err) {
            throw err;
          } else if (!isMatch) {
            res.send("Incorrect username or password!");
            // console.log("fail")
          } else {
            const sessionID = uuidv4();
            database.query(
              "UPDATE users SET session = ? WHERE username = ?",
              [sessionID, username],
              (err) => {
                if (err) {
                  console.error(err);
                } else {
                  
                    if(password !== "P@$$Word") {
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
                    secure: false,
                    sameSite: "strict",
                  });
                  //console.log('Pass')
                  res.send("Pass");
                     
                    }else{
                      res.send('change')
                    }
                }
              }
            );
          }
        });
      }
    );
  });

  router.put("/password", async  (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    
    database.query(
      `UPDATE users SET password = ? WHERE username = ?`,
      [hashedPassword, username],
      function (error, results, fields) {
        if (error) throw error;
        res.send('updated');
      }
    );
});

router.get("/logout", session.validateSession,  (req, res) => {
    const username = req.cookies.username;
    database.query(
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
    database.query(`SELECT * FROM users WHERE username = ? AND session = ?`, [username, sessionID],function (error, results, fields) {
        if (error) throw error;
        res.send('Pass')
        }
    );
});


router.post("/info",  (req, res) => {
  
  console.log('Connected')
  console.log(req.body)
  // database.query(
  //     `UPDATE computers WHERE view = 'true' AND type = 'desktop' ORDER BY make ASC`,
  //     function (error, results, fields) {
  //     if (error) throw error;
  //     res.send(results);
  //     }
  // );
});



module.exports = router;