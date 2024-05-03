

const express = require("express");

const database = require("../utils/database.js");
const session = require("../utils/session.js");

const router = express.Router();

router.get("/");

router.get("/list", session.validateSession,  (req, res) => {
    database.query(
        `SELECT Chromebooks.id, Chromebooks.model_id, Chromebooks.date_added, Chromebooks.tag, Chromebooks.building, Chromebooks.status, Chromebooks.sn, Chromebooks.device_status, Chromebook_makes.make, Chromebook_makes.model, Chromebook_makes.screen, Chromebook_makes.cost, Chromebook_makes.updates
        FROM Chromebooks
        INNER JOIN Chromebook_makes ON Chromebooks.model_id = Chromebook_makes.id
        WHERE Chromebooks.status = 'true' ORDER BY Chromebooks.building ASC;`,
        function (error, results, fields) {
        if (error) throw error;
        res.send(results);
        }
    );
});

router.get("/makes", session.validateSession,  (req, res) => {
    database.query(
        `SELECT * FROM chromebook_makes;`,
        function (error, results, fields) {
        if (error) throw error;
        res.send(results);
        }
    );
});

router.get("/search", session.validateSession,  (req, res) => {
    const searchQuery = req.query.search;
    database.query(
    `SELECT Chromebooks.id, Chromebooks.model_id, Chromebooks.date_added, Chromebooks.tag, Chromebooks.building, Chromebooks.status, Chromebooks.sn, Chromebooks.device_status, Chromebook_makes.make, Chromebook_makes.model, Chromebook_makes.screen, Chromebook_makes.cost, Chromebook_makes.updates
    FROM Chromebooks
    INNER JOIN Chromebook_makes ON Chromebooks.model_id = Chromebook_makes.id
    WHERE Chromebooks.status = 'true'
    AND (Chromebooks.tag LIKE ? OR Chromebook_makes.make LIKE ? OR Chromebook_makes.model LIKE ? OR Chromebooks.sn LIKE ? OR Chromebooks.building LIKE ?)
    ORDER BY Chromebooks.building ASC`,
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

router.get("/chromebook", session.validateSession,  (req, res) => {
    database.query(
        `SELECT * FROM chromebooks WHERE id = ? LIMIT 1`, [req.query.id],
        function (error, results, fields) {
        if (error) throw error;
        res.send(results);
        }
    );
});

router.post("/chromebook", session.validateSession,  (req, res) => {
    database.query(`UPDATE chromebooks SET ? WHERE id = ?`, [req.body, req.query.id], function (error, results, fields) {
        if (error) throw error;
        res.send('updated');
        }
    );
});

router.put("/chromebook", session.validateSession,  (req, res) => {
    database.query(
        `INSERT INTO chromebooks SET ?`, [req.body],
        function (error, results, fields) {
        if (error) throw error;
        res.send('added');
        }
    );
});

router.delete("/chromebook", session.validateSession,  (req, res) => {
    database.query(
        `UPDATE chromebooks SET status = 'false' WHERE id = ?`, [req.query.id],
        function (error, results, fields) {
        if (error) throw error;
        res.send('deleted');
        }
    );
});




module.exports = router;