const express = require("express");

const database = require("../utils/database.js");
const session = require("../utils/session.js");

const router = express.Router();

router.get("/");


router.get("/", session.validateSession, (req, res) => {
    database.query(
      `SELECT * FROM computers WHERE view = 'true' and type = 'mac'`,
      function (error, results, fields) {
        if (error) throw error;
        res.send(results);
      }
    );
  });

module.exports = router;