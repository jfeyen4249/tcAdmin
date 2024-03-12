const express = require("express");
const bcrypt = require("bcryptjs");
const mysql = require("mysql2");
const crypto = require("crypto");
const dotenv = require("dotenv");

dotenv.config({ path: "./.env" });

const connection = mysql.createPool({
    host: process.env.db_host,
    user: process.env.db_user,
    password: process.env.db_password,
    database: process.env.db_database,
  });

const router = express.Router();

router.get("/", (req, res) => {
    res.render("inventory");
});

router.get("/macbook", (req, res) => {
    res.render("macbook");
});

router.get("/wireless", (req, res) => {
    res.render("wireless");
});

router.get("/ipad",  (req, res) => {
    res.render("ipad");
});

// router.get("/password-list", validateSession,  (req, res) => {
//     connection.query(
//       `SELECT id,info,service,updated,url,username,category FROM passwords WHERE view = 'true'`,
//       function (error, results, fields) {
//         if (error) throw error;
//         res.send(results);
//       }
//     );
// });
  
// router.post("/password-list", validateSession,  (req, res) => {
//     connection.query(
//       `SELECT id,info,service,updated,url,username,category FROM passwords WHERE view = 'true' AND id = ? LIMIT 1`,
//       [req.query.id],
//       function (error, results, fields) {
//         if (error) throw error;
//         res.send(results);
//       }
//     );
// });
  
// router.put("/password-list", validateSession,  (req, res) => {
//     const searchQuery = req.query.search;
//     connection.query(
//       `SELECT id, info, service, updated, url, username, category 
//                         FROM passwords 
//                         WHERE view = 'true' 
//                         AND (info LIKE ? OR service LIKE ? OR url LIKE ? OR username LIKE ? OR category LIKE ?)`,
//       [
//         `%${searchQuery}%`,
//         `%${searchQuery}%`,
//         `%${searchQuery}%`,
//         `%${searchQuery}%`,
//         `%${searchQuery}%`,
//       ],
//       function (error, results, fields) {
//         if (error) throw error;
//         res.send(results);
//       }
//     );
// });
  
// router.get("/password", validateSession,  (req, res) => {
//     connection.query(
//       `SELECT password FROM passwords WHERE view = 'true' and id = ?`,
//       [req.query.id],
//       function (error, results, fields) {
//         if (error) throw error;
//         res.send(decrypt(results[0].password));
//       }
//     );
// });
  
// router.post("/password",  validateSession, (req, res) => {
//     let data = {
//       service: req.body.service,
//       url: req.body.url,
//       username: req.body.username,
//       password: encrypt(req.body.password),
//       category: req.body.category,
//       updated: req.body.updated,
//       view: "True",
//       info: req.body.info,
//     };
//     connection.query(
//       `INSERT INTO passwords SET ?`,
//       [data],
//       function (error, results, fields) {
//         if (error) throw error;
//         console.log(results);
//         res.send(results);
//       }
//     );
// });
  
// router.post("/password-update",  validateSession, (req, res) => {
//     connection.query(
//       `SELECT password FROM passwords WHERE id = ?`,
//       [req.body.id],
//       function (error, results, fields) {
//         if (error) throw error;
  
//         if (
//           req.body.password === decrypt(results[0].password) ||
//           req.body.password.length == 0
//         ) {
//           let data = {
//             service: req.body.service,
//             url: req.body.url,
//             username: req.body.username,
//             category: req.body.category,
//             updated: req.body.updated,
//             view: "True",
//             info: req.body.info,
//           };
//           connection.query(
//             `UPDATE passwords SET ? WHERE id = ?`,
//             [data, req.body.id],
//             function (error, results, fields) {
//               if (error) throw error;
//               //console.log(results)
//               res.send("Updated");
//             }
//           );
//           return;
//         }
  
//         if (req.body.password !== decrypt(results[0].password)) {
//           let data = {
//             service: req.body.service,
//             url: req.body.url,
//             username: req.body.username,
//             password: encrypt(req.body.password),
//             category: req.body.category,
//             updated: req.body.updated,
//             view: "True",
//             info: req.body.info,
//           };
//           connection.query(
//             `UPDATE passwords SET ? WHERE id = ?`,
//             [data, req.body.id],
//             function (error, results, fields) {
//               if (error) throw error;
//               //console.log(results)
//               res.send(results);
//             }
//           );
//           return;
//         }
//       }
//     );
  
//     //
// });
  
// router.get("/password-cat",  validateSession, (req, res) => {
//     connection.query(
//       `SELECT category FROM password_cat ORDER BY category ASC`,
//       function (error, results, fields) {
//         if (error) throw error;
//         res.send(results);
//       }
//     );
// });


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