const express = require("express");

const database = require("../utils/database.js");
const session = require("../utils/session.js");
const encryption = require("../utils/encryption.js");

const speakeasy = require('speakeasy');
const moment = require('moment');

const router = express.Router();

router.get("/");

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

  router.get("/", session.validateSession, (req, res) => {
    res.render("passwords");
  });


  router.get("/password-list", session.validateSession,  (req, res) => {
    database.query(
      `SELECT id,info,service,updated,url,username,category FROM passwords WHERE view = 'true' ORDER BY service ASC`,
      function (error, results, fields) {
        if (error) throw error;
        res.send(results);
      }
    );
  });
  
  router.post("/password-list", session.validateSession,  (req, res) => {
    database.query(
      `SELECT id,info,service,updated,url,username,category FROM passwords WHERE view = 'true' AND id = ? LIMIT 1`,
      [req.query.id],
      function (error, results, fields) {
        if (error) throw error;
        res.send(results);
      }
    );
  });
  
  router.put("/password-list", session.validateSession,  (req, res) => {
    const searchQuery = req.query.search;
    database.query(
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
  
  router.get("/password", session.validateSession,  (req, res) => {
    database.query(
      `SELECT password FROM passwords WHERE view = 'true' and id = ?`,
      [req.query.id],
      function (error, results, fields) {
        if (error) throw error;
        res.send(encryption.decrypt(results[0].password));
      }
    );
  });
  
  router.post("/password", session.validateSession, (req, res) => {
    let data = {
      service: req.body.service,
      url: req.body.url,
      username: req.body.username,
      password: encryption.encrypt(req.body.password),
      otp : req.body.otp.replace(/\s/g, ""),
      category: req.body.category,
      updated: req.body.updated,
      view: "True",
      info: req.body.info,
    };
    database.query(
      `INSERT INTO passwords SET ?`,
      [data],
      function (error, results, fields) {
        if (error) throw error;
        console.log(results);
        res.send(results);
      }
    );
  });
  
  router.post("/password-update", session.validateSession, (req, res) => {
    database.query(
      `SELECT password FROM passwords WHERE id = ?`,
      [req.body.id],
      function (error, results, fields) {
        if (error) throw error;
  
        if (
          req.body.password === encryption.decrypt(results[0].password) ||
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
          database.query(
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
  
        if (req.body.password !== encryption.decrypt(results[0].password)) {
          let data = {
            service: req.body.service,
            url: req.body.url,
            username: req.body.username,
            password: encryption.encrypt(req.body.password),
            category: req.body.category,
            updated: req.body.updated,
            view: "True",
            info: req.body.info,
          };
          database.query(
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
  
  router.get("/password-cat", session.validateSession, (req, res) => {
    database.query(
      `SELECT category FROM password_cat ORDER BY category ASC`,
      function (error, results, fields) {
        if (error) throw error;
        res.send(results);
      }
    );
  });
  
  router.get('/otp', (req, res) => {
    try {
      database.query(
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