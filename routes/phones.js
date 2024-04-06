
const express = require("express");

const database = require("../utils/database.js");
const session = require("../utils/session.js");

const router = express.Router();

router.get("/");

router.get("/list", session.validateSession,  (req, res) => {
    database.query(
        `SELECT * FROM phones WHERE view = 'true' ORDER BY building ASC`,
        function (error, results, fields) {
        if (error) throw error;
        res.send(results);
        }
    );
});

router.get("/search", session.validateSession,  (req, res) => {
    const searchQuery = req.query.search;
    database.query(`SELECT * FROM phones WHERE view = 'true' AND (make LIKE ? OR model LIKE ? OR mac LIKE ? OR room LIKE ? OR tag LIKE ? OR building LIKE ? OR room LIKE ? OR extention LIKE ?) ORDER By building ASC`,
      [
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

router.get("/phone", session.validateSession,  (req, res) => {
    database.query(
        `SELECT * FROM phones WHERE id = ? LIMIT 1`, [req.query.id],
        function (error, results, fields) {
        if (error) throw error;
        res.send(results);
        }
    );
});

router.post("/phone", session.validateSession,  (req, res) => {
    database.query(`UPDATE phones SET ? WHERE id = ?`, [req.body, req.query.id], function (error, results, fields) {
        if (error) throw error;
        res.send('saved');
        }
    );
});

router.put("/phone", session.validateSession,  (req, res) => {
    database.query(
        `INSERT INTO phones SET ?`, [req.body],
        function (error, results, fields) {
        if (error) throw error;
        res.send('added');
        }
    );
});


router.delete("/phone", session.validateSession,  (req, res) => {
    database.query(
        `UPDATE phones SET view = 'false' WHERE id = ?`, [req.query.id],
        function (error, results, fields) {
        if (error) throw error;
        res.send('deleted');
        }
    );
});


router.get("/make", session.validateSession,  (req, res) => {
    database.query(
        `SELECT DISTINCT make FROM makes WHERE view = 'true' AND type = 'phone' ORDER BY make ASC`,
        function (error, results, fields) {
        if (error) throw error;
        res.send(results);
        }
    );
});

router.get("/model", session.validateSession,  (req, res) => {
    database.query(`SELECT * FROM makes WHERE view = 'true' AND type = 'phone' AND make = ? ORDER BY model ASC`, [req.query.make],
        function (error, results, fields) {
        if (error) throw error;
        console.log(results)
        res.send(results);
        }
    );
});



module.exports = router;