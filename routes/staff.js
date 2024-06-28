const express = require("express");
const database = require("../utils/database.js");
const session = require("../utils/session.js");
const router = express.Router();
const axios = require('axios');

router.get("/", session.validateSession, (req, res) =>{
    res.render("staff");
});

router.get("/list", session.validateSession,  (req, res) => {
    const limit = parseInt(req.query.limit, 10) || 30; // Set default limit to 30
    const page = parseInt(req.query.page, 10) || 1;
    const offset = (page - 1) * limit;
    
    database.query(`SELECT * FROM staff WHERE view = 'true' ORDER BY building, room ASC, name ASC  LIMIT ?, ?`, [offset, limit],
        function (error, results, fields) {
        if (error) throw error;
        res.send(results);
        }
    );
});

router.get("/building", session.validateSession,  (req, res) => {
    database.query(`SELECT name FROM staff WHERE view = 'true' AND building = ?`, [req.query.building],
        function (error, results, fields) {
        if (error) throw error;
        res.send(results);
        }
    );
});

router.get("/room", session.validateSession,  (req, res) => {
    database.query(`SELECT room FROM rooms WHERE view = 'true' AND buildings ?`, [req.query.name],
        function (error, results, fields) {
        if (error) throw error;
        res.send(results);
        }
    );
});

router.get("/member", session.validateSession,  (req, res) => {
    database.query(
        `SELECT * FROM staff WHERE id = ?`, [req.query.id],
        function (error, results, fields) {
        if (error) throw error;
        res.send(results);
        }
    );
});

router.get("/room", session.validateSession,  (req, res) => {
    database.query(
        `SELECT * FROM rooms WHERE building = ? Order By room ASC`, [req.query.name],
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

router.post("/edit", session.validateSession, (req, res) => {
    let id = req.query.id
    let data = {
        name: req.body.name,
        room: req.body.room,
        building: req.body.building,
    };
    database.query(
        `UPDATE staff SET ? WHERE id = ?`,
        [data, id],
        function (error, results, fields) {
        if (error) throw error;
        res.send(results);
        }
    );
});
  
router.get("/search", session.validateSession, (req, res) => {
    const searchQuery = req.query.search;
    database.query(`SELECT * FROM staff WHERE view = 'true' AND (name LIKE ? OR building LIKE ? OR room LIKE ? ) ORDER BY building, room ASC, name ASC`,
        [`%${searchQuery}%`,`%${searchQuery}%`,`%${searchQuery}%`],
        function (error, results, fields) {
        if (error) throw error;
        res.send(results);
        }
    );
});


module.exports = router;