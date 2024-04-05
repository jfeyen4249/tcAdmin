const express = require("express");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const dotenv = require("dotenv");

const database = require("../utils/database.js");
const session = require("../utils/session.js");

dotenv.config({ path: "./.env" });

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

router.get("/desktop",  (req, res) => {
    res.render("desktop");
});

router.get("/laptop",  (req, res) => {
    res.render("laptop");
});

// router.get("/password-list", sessions.validateSessions,  (req, res) => {
//     database.query(
//       `SELECT id,info,service,updated,url,username,category FROM passwords WHERE view = 'true'`,
//       function (error, results, fields) {
//         if (error) throw error;
//         res.send(results);
//       }
//     );
// });
  
// router.post("/password-list", sessions.validateSessions,  (req, res) => {
//     database.query(
//       `SELECT id,info,service,updated,url,username,category FROM passwords WHERE view = 'true' AND id = ? LIMIT 1`,
//       [req.query.id],
//       function (error, results, fields) {
//         if (error) throw error;
//         res.send(results);
//       }
//     );
// });
  
// router.put("/password-list", sessions.validateSessions,  (req, res) => {
//     const searchQuery = req.query.search;
//     database.query(
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
  
// router.get("/password", sessions.validateSessions,  (req, res) => {
//     database.query(
//       `SELECT password FROM passwords WHERE view = 'true' and id = ?`,
//       [req.query.id],
//       function (error, results, fields) {
//         if (error) throw error;
//         res.send(decrypt(results[0].password));
//       }
//     );
// });
  
// router.post("/password", session.validateSession, (req, res) => {
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
//     database.query(
//       `INSERT INTO passwords SET ?`,
//       [data],
//       function (error, results, fields) {
//         if (error) throw error;
//         console.log(results);
//         res.send(results);
//       }
//     );
// });
  
// router.post("/password-update", session.validateSession, (req, res) => {
//     database.query(
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
//           database.query(
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
//           database.query(
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
  
// router.get("/password-cat", session.validateSession, (req, res) => {
//     database.query(
//       `SELECT category FROM password_cat ORDER BY category ASC`,
//       function (error, results, fields) {
//         if (error) throw error;
//         res.send(results);
//       }
//     );
// });


module.exports = router;