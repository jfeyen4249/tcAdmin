const express = require("express");

const database = require("../utils/database.js");
const session = require("../utils/session.js");

const router = express.Router();

router.get("/", session.validateSession, (req, res) =>{
    res.render("students");
});

router.get("/list", session.validateSession, (req, res) => {
    const limit = parseInt(req.query.limit, 10) || 30; // Set default limit to 30
    const page = parseInt(req.query.page, 10) || 1;
    const offset = (page - 1) * limit;
 
    database.query(
        `SELECT * FROM students WHERE status = 'true' ORDER BY year ASC, student ASC LIMIT ?, ?`,
        [offset, limit],
        function (error, results, fields) {
            if (error) throw error;
            res.send(results);
        }
    );
});


router.get("/student", session.validateSession,  (req, res) => {
    database.query(
        
        `SELECT * FROM students WHERE id = ?`,[req.query.id] ,
        function (error, results, fields) {
        if (error) throw error;
        res.send(results);
        }
    );
});
  
router.put("/student", session.validateSession, (req, res) => {
    database.query(
        `INSERT INTO students SET ?`, [req.body],
        function (error, results, fields) {
        if (error) throw error;
        res.send('added');
        }
    );
});
  
router.post("/student", session.validateSession, (req, res) => {
    database.query(
        `UPDATE students SET student = ?,year = ? WHERE id = ?`, [req.body.student, req.body.year, req.query.id],
        function (error, results, fields) {
        if (error) throw error;
        res.send('added');
        }
    );
});

router.delete("/student", session.validateSession, (req, res) => {
    database.query(
        `UPDATE students SET status = 'false' WHERE id = ?`, [req.query.id],
        function (error, results, fields) {
        if (error) throw error;
        res.send('deleted');
        }
    );
});

router.get("/search", session.validateSession, (req, res) => {
    const searchQuery = req.query.search;
    database.query(`SELECT * FROM students WHERE status = 'true' AND (student LIKE ? OR year LIKE ? ) ORDER BY year ASC, student ASC LIMIT 25`, [`%${searchQuery}%`,`%${searchQuery}%`,],
        function (error, results, fields) {
        if (error) throw error;
        res.send(results);
        }
    );
});

module.exports = router;