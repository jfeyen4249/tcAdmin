
const express = require("express");

const database = require("../utils/database.js");
const session = require("../utils/session.js");

const router = express.Router();

router.get("/");

router.get("/list", session.validateSession,  (req, res) => {
    const limit = parseInt(req.query.limit, 10) || 30; // Set default limit to 30
    const page = parseInt(req.query.page, 10) || 1;
    const offset = (page - 1) * limit;
    database.query(
        `SELECT * FROM printers WHERE view = 'true' ORDER BY building ASC Limit ?, ?`,[offset, limit],
        function (error, results, fields) {
        if (error) throw error;
        res.send(results);
        }
    );
});

router.get("/search", session.validateSession,  (req, res) => {
    const searchQuery = req.query.search;
    database.query(`SELECT * FROM printers WHERE view = 'true' AND (name LIKE ? OR make LIKE ? OR model LIKE ? OR mac LIKE ? OR room LIKE ? OR building LIKE ? OR ip LIKE ? OR date LIKE ?) ORDER By building ASC`,
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

router.get("/printer", session.validateSession,  (req, res) => {
    database.query(
        `SELECT * FROM printers WHERE id = ? LIMIT 1`, [req.query.id],
        function (error, results, fields) {
        if (error) throw error;
        res.send(results);
        }
    );
});

router.post("/printer", session.validateSession,  (req, res) => {
    database.query(`UPDATE printers SET ? WHERE id = ?`, [req.body, req.query.id], function (error, results, fields) {
        if (error) throw error;
        res.send('saved');
        }
    );
});

router.put("/printer", session.validateSession,  (req, res) => {
    database.query(
        `INSERT INTO printers SET ?`, [req.body],
        function (error, results, fields) {
        if (error) throw error;
        res.send('added');
        }
    );
});

router.delete("/printer", session.validateSession,  (req, res) => {
    let id = req.query.id
    database.query(
        `UPDATE printers SET view = 'false' WHERE id = ?`, [id],
        function (error, results, fields) {
        if (error) throw error;
        res.send('deleted');
        }
    );
});

router.get("/make", session.validateSession,  (req, res) => {
    database.query(
        `SELECT DISTINCT make FROM makes WHERE view = 'true' AND type = 'printer' ORDER BY make ASC`,
        function (error, results, fields) {
        if (error) throw error;
        res.send(results);
        }
    );
});

router.get("/model", session.validateSession,  (req, res) => {
    database.query(
        `SELECT model FROM makes WHERE view = 'true' AND make = ? and type = 'printer' ORDER BY make ASC`, [req.query.make],
        function (error, results, fields) {
        if (error) throw error;
        res.send(results);
        }
    );
});



module.exports = router;