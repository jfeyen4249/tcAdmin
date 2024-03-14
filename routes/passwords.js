const express = require("express");
const bcrypt = require("bcryptjs");
const mysql = require("mysql2");
const crypto = require("crypto");
const dotenv = require("dotenv");
const { v4: uuidv4 } = require("uuid");
const speakeasy = require('speakeasy');
const moment = require('moment');
dotenv.config({ path: "./.env" });

const router = express.Router();

const connection = mysql.createPool({
    host: process.env.db_host,
    user: process.env.db_user,
    password: process.env.db_password,
    database: process.env.db_database,
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
            res.redirect("/login");
          } else if (results.length === 1) {
            // If the session is valid, continue to the next middleware or route handler
            next();
          } else {
            res.redirect("/login");
          }
        }
      );
    } else {
      res.redirect("/");
    }
  }

  function generateTimeBasedCode(secret) {
    return speakeasy.totp({
        secret,
        encoding: 'base32', // Make sure to specify the encoding
    });
  }
  
  // Function to calculate the remaining time until the current time-based code expires
  function calculateRemainingTime(secret) {
    const remainingSeconds = speakeasy.totp.verifyDelta({
        secret,
        encoding: 'ascii',
        token: generateTimeBasedCode(secret),
        window: 1, // Set window to 1 to ensure accuracy
    });
  
    // If remainingSeconds is -1, it means the current code has expired
    // We return 0 in that case to indicate no remaining time
    if (remainingSeconds === -1) {
        return 0;
    }
  
    // Otherwise, calculate the remaining time until the next code generation
    const timeRemaining = 30 - (moment().unix() % 30);
    return timeRemaining;
  }

  function encrypt(text) {
    const iv = crypto.randomBytes(16);
    const keyBuffer = Buffer.from(process.env.key, "hex");
    const cipher = crypto.createCipheriv("aes-256-cbc", keyBuffer, iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return iv.toString("hex") + ":" + encrypted.toString("hex");
  }
  
  // Decryption function
  function decrypt(text) {
    const parts = text.split(":");
    const iv = Buffer.from(parts.shift(), "hex");
    const encryptedText = Buffer.from(parts.join(":"), "hex");
    const keyBuffer = Buffer.from(process.env.key, "hex");
    const decipher = crypto.createDecipheriv("aes-256-cbc", keyBuffer, iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
  }


  router.get("/", validateSession, (req, res) => {
    res.render("pasword");
  });


  router.get("/password-list", validateSession,  (req, res) => {
    connection.query(
      `SELECT id,info,service,updated,url,username,category FROM passwords WHERE view = 'true' ORDER BY service ASC`,
      function (error, results, fields) {
        if (error) throw error;
        res.send(results);
      }
    );
  });
  
  router.post("/password-list", validateSession,  (req, res) => {
    connection.query(
      `SELECT id,info,service,updated,url,username,category FROM passwords WHERE view = 'true' AND id = ? LIMIT 1`,
      [req.query.id],
      function (error, results, fields) {
        if (error) throw error;
        res.send(results);
      }
    );
  });
  
  router.put("/password-list", validateSession,  (req, res) => {
    const searchQuery = req.query.search;
    connection.query(
      `SELECT id, info, service, updated, url, username, category 
                        FROM passwords 
                        WHERE view = 'true' 
                        AND (info LIKE ? OR service LIKE ? OR url LIKE ? OR username LIKE ? OR category LIKE ?)`,
      [
        `%${searchQuery}%`,
        `%${searchQuery}%`,
        `%${searchQuery}%`,
        `%${searchQuery}%`,
        `%${searchQuery}%`,
      ],
      function (error, results, fields) {
        if (error) throw error;
        res.send(results);
      }
    );
  });
  
  router.get("/password", validateSession,  (req, res) => {
    connection.query(
      `SELECT password FROM passwords WHERE view = 'true' and id = ?`,
      [req.query.id],
      function (error, results, fields) {
        if (error) throw error;
        res.send(decrypt(results[0].password));
      }
    );
  });
  
  router.post("/password",  validateSession, (req, res) => {
    let data = {
      service: req.body.service,
      url: req.body.url,
      username: req.body.username,
      password: encrypt(req.body.password),
      otp : req.body.otp.replace(/\s/g, ""),
      category: req.body.category,
      updated: req.body.updated,
      view: "True",
      info: req.body.info,
    };
    connection.query(
      `INSERT INTO passwords SET ?`,
      [data],
      function (error, results, fields) {
        if (error) throw error;
        console.log(results);
        res.send(results);
      }
    );
  });
  
  router.post("/password-update",  validateSession, (req, res) => {
    connection.query(
      `SELECT password FROM passwords WHERE id = ?`,
      [req.body.id],
      function (error, results, fields) {
        if (error) throw error;
  
        if (
          req.body.password === decrypt(results[0].password) ||
          req.body.password.length == 0
        ) {
          let data = {
            service: req.body.service,
            url: req.body.url,
            username: req.body.username,
            category: req.body.category,
            updated: req.body.updated,
            view: "True",
            info: req.body.info,
          };
          connection.query(
            `UPDATE passwords SET ? WHERE id = ?`,
            [data, req.body.id],
            function (error, results, fields) {
              if (error) throw error;
              //console.log(results)
              res.send("Updated");
            }
          );
          return;
        }
  
        if (req.body.password !== decrypt(results[0].password)) {
          let data = {
            service: req.body.service,
            url: req.body.url,
            username: req.body.username,
            password: encrypt(req.body.password),
            category: req.body.category,
            updated: req.body.updated,
            view: "True",
            info: req.body.info,
          };
          connection.query(
            `UPDATE passwords SET ? WHERE id = ?`,
            [data, req.body.id],
            function (error, results, fields) {
              if (error) throw error;
              //console.log(results)
              res.send(results);
            }
          );
          return;
        }
      }
    );
  });
  
  router.get("/password-cat",  validateSession, (req, res) => {
    connection.query(
      `SELECT category FROM password_cat ORDER BY category ASC`,
      function (error, results, fields) {
        if (error) throw error;
        res.send(results);
      }
    );
  });
  
  router.get('/otp', (req, res) => {
    try {
      connection.query(
        `SELECT otp FROM passwords WHERE id = ?`, [req.query.id],
        function (error, results, fields) {
          if (error) {
            console.error("Error retrieving OTP from the database:", error);
            return res.status(500).send("Error retrieving OTP from the database");
          }
  
          if(results[0].otp == "none") {
            const data = {
              code: "none",
              remainingTime: 'none'
            };
            console.log(data)
            res.json(data)
          } else {
            if (results.length === 0) {
              console.error("No OTP found for the provided ID:", req.query.id);
              return res.status(404).send("OTP not found");
            }
            const secret = results[0].otp;
            const timeBasedCode = generateTimeBasedCode(secret);
            const remainingTime = calculateRemainingTime(secret);
            const data = {
              code: timeBasedCode,
              remainingTime: remainingTime
            };
            res.json(data);
          }
        }
      );
    } catch (error) {
      
    }
  });



  module.exports = router;