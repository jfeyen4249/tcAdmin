const express = require("express");
const database = require("../utils/database.js");
const session = require("../utils/session.js");

const router = express.Router();

router.get("/", session.validateSession, (req, res) => {
  console.log("test");
  res.render("server");
});

router.get("/info", session.validateSession, (req, res) => {
    database.query(
      `SELECT * FROM server_info`,
      function (error, results, fields) {
        if (error) throw error;
        res.send(results);
      }
    );
  });

module.exports = router;