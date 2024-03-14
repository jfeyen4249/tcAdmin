const express = require("express");
const database = require("../utils/database.js");

const router = express.Router();

router.get("/");

router.get("/", (req, res) => {
    database.query(
      `SELECT * FROM server_info`,
      function (error, results, fields) {
        if (error) throw error;
        res.send(results);
      }
    );
  });

module.exports = router;