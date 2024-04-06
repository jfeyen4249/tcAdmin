
const express = require("express");

const database = require("../utils/database.js");
const session = require("../utils/session.js");

const router = express.Router();

router.get("/");

router.get("/list", session.validateSession,  (req, res) => {
    database.query(
        `SELECT * FROM computers WHERE view = 'true' AND type = 'server' ORDER BY building ASC`,
        function (error, results, fields) {
        if (error) throw error;
        res.send(results);
        }
    );
});

router.get("/search", session.validateSession,  (req, res) => {
    const searchQuery = req.query.search;
    database.query(`SELECT * FROM computers WHERE view = 'true' AND type = 'server' AND (name LIKE ? OR make LIKE ? OR model LIKE ? OR mac LIKE ? OR room LIKE ? OR tag LIKE ? OR building LIKE ? OR ip LIKE ? OR os LIKE ?) ORDER By building ASC`,
      [
        `%${searchQuery}%`,
        `%${searchQuery}%`,
        `%${searchQuery}%`,
        `%${searchQuery}%`,
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

router.get("/computer", session.validateSession,  (req, res) => {
    database.query(
        `SELECT * FROM computers WHERE id = ? LIMIT 1`, [req.query.id],
        function (error, results, fields) {
        if (error) throw error;
        res.send(results);
        }
    );
});



router.post("/computer", session.validateSession,  (req, res) => {
    database.query(`UPDATE computers SET ? WHERE id = ?`, [req.body, req.query.id], function (error, results, fields) {
        if (error) throw error;
        res.send('saved');
        }
    );
});

router.put("/computer", session.validateSession,  (req, res) => {
    database.query(
        `INSERT INTO computers SET ?`, [req.body],
        function (error, results, fields) {
        if (error) throw error;
        res.send('added');
        }
    );
});


router.delete("/computer", session.validateSession,  (req, res) => {
    database.query(
        `UPDATE computers SET view = 'false' WHERE id = ?`, [req.query.id],
        function (error, results, fields) {
        if (error) throw error;
        res.send('deleted');
        }
    );
});


router.get("/make", session.validateSession,  (req, res) => {
    database.query(
        `SELECT DISTINCT make FROM makes WHERE view = 'true' AND type = 'server' ORDER BY make ASC`,
        function (error, results, fields) {
        if (error) throw error;
        res.send(results);
        }
    );
});

router.get("/model", session.validateSession,  (req, res) => {
    database.query(
        `SELECT model FROM makes WHERE view = 'true' AND make = ? ORDER BY make ASC`, [req.query.make],
        function (error, results, fields) {
        if (error) throw error;
        res.send(results);
        }
    );
});



module.exports = router;