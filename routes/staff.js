const express = require("express");

const database = require("../utils/database.js");
const session = require("../utils/session.js");

const router = express.Router();

router.get("/", session.validateSession, (req, res) =>{
    res.render("staff");
});

router.get("/list", session.validateSession,  (req, res) => {
    database.query(
        `SELECT * FROM staff WHERE view = 'true'`,
        function (error, results, fields) {
        if (error) throw error;
        res.send(results);
        }
    );
});
  
router.post("/add", session.validateSession, (req, res) => {
    let data = {
        name: req.body.name,
        room: req.body.room,
        building: req.body.building,
        view: "true",
    };
    database.query(
        `INSERT INTO staff SET ?`,
        [data],
        function (error, results, fields) {
        if (error) throw error;
        res.send(results);
        }
    );
});
  
router.get("/search", session.validateSession, (req, res) => {
    const searchQuery = req.query.search;
    database.query(
        `SELECT *
                        FROM staff 
                        WHERE view = 'true' 
                        AND (name LIKE ? OR building LIKE ? OR room LIKE ? )`,
        [
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

module.exports = router;