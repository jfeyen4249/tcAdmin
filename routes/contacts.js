
const express = require("express");

const database = require("../utils/database.js");
const session = require("../utils/session.js");
const logs = require("../utils/logs.js");
const router = express.Router();

router.get("/", session.validateSession,  (req, res) => {
    res.render('contacts')
});

router.get("/list", session.validateSession,  (req, res) => {
    const limit = parseInt(req.query.limit, 10) || 30; // Set default limit to 30
    const page = parseInt(req.query.page, 10) || 1;
    const offset = (page - 1) * limit;
    database.query(
        `SELECT * FROM contacts WHERE status = 'true' ORDER BY company Limit ?, ?`,[offset, limit],
        function (error, results, fields) {
        if (error) throw error;
        res.send(results);
        }
    );
});

router.get("/info", session.validateSession,  (req, res) => {
    database.query(
        `SELECT * FROM contacts WHERE id = ?`, [req.query.id],
        function (error, results, fields) {
        if (error) throw error;
        res.send(results);
        }
    );
});

router.get("/search", session.validateSession,  (req, res) => {
    const searchQuery = req.query.search;
    database.query(`SELECT * FROM contacts WHERE status = 'true' AND (company LIKE ? OR name LIKE ? OR title LIKE ? OR phone LIKE ? OR cell LIKE ? OR fax LIKE ? OR email LIKE ? OR website LIKE ? OR info LIKE ?) ORDER By company ASC`,
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


router.post("/contact", session.validateSession,  (req, res) => {
    database.query(`UPDATE contacts SET ? WHERE id = ?`, [req.body, req.query.id], function (error, results, fields) {
        if (error) throw error;
        logs.SystemLog(`${req.body.name} at ${req.body.company} was updated in contacts.`, req.cookies.username)
        res.send('saved');
        }
    );
});

router.put("/contact", session.validateSession,  (req, res) => {
    database.query(`INSERT INTO contacts SET ?`, [req.body],
        function (error, results, fields) {
        if (error) throw error;
        logs.SystemLog(`${req.body.name} at ${req.body.company} was added to contacts.`, req.cookies.username)
        res.send('added');
        }
    );
});


router.delete("/contact", session.validateSession,  (req, res) => {
    database.query(
        `UPDATE contacts SET status = 'false' WHERE id = ?`, [req.query.id],
        function (error, results, fields) {
        if (error) throw error;
        logs.SystemLog(`A contact was deleted from inventory.`, req.cookies.username)
        res.send('deleted');
        }
    );
});

module.exports = router;