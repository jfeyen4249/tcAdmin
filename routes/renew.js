const express = require("express");

const database = require("../utils/database.js");
const session = require("../utils/session.js");

const router = express.Router();

const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/img/maps'); // specify the destination folder
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // keep the original file name
  }
});
const upload = multer({ storage: storage });

router.get("/", session.validateSession, (req, res) =>{
    res.render("renew");
});

router.get("/list", session.validateSession,  (req, res) => {
    const limit = parseInt(req.query.limit, 10) || 30; // Set default limit to 30
    const page = parseInt(req.query.page, 10) || 1;
    const offset = (page - 1) * limit;
    database.query(
        `SELECT * FROM renewals WHERE status = 'active' Limit ?, ?`,[offset, limit],
        function (error, results, fields) {
        if (error) throw error;
            res.send(results);
        }
    );
});

router.get("/service", session.validateSession,  (req, res) => {
    database.query(
        
        `SELECT * FROM renewals WHERE id = ?`,[req.query.id] ,
        function (error, results, fields) {
        if (error) throw error;
        res.send(results);
        }
    );
});

router.get("/history", session.validateSession,  (req, res) => {
    database.query(
        
        `SELECT * FROM renewals WHERE service = ? Order By year ASC`,[req.query.service] ,
        function (error, results, fields) {
        if (error) throw error;
        res.send(results);
        }
    );
});
  
router.put("/service", session.validateSession, (req, res) => {
    database.query(
        `INSERT INTO renewals SET ?`, [req.body],
        function (error, results, fields) {
        if (error) throw error;
        res.send('added');
        }
    );
});
  
router.post("/service", session.validateSession, (req, res) => {
    database.query(
        `UPDATE renewals SET ? WHERE id = ?`, [req.body, req.query.id],
        function (error, results, fields) {
        if (error) throw error;
        res.send('added');
        }
    );
});

router.delete("/service", session.validateSession, (req, res) => {
    database.query(
        `UPDATE renewals SET status = 'false' WHERE id = ?`, [req.query.id],
        function (error, results, fields) {
        if (error) throw error;
        res.send('deleted');
        }
    );
});


router.get("/search", session.validateSession, (req, res) => {
    const searchQuery = req.query.search;
    database.query(`SELECT * FROM students WHERE status = 'true' AND (student LIKE ? OR year LIKE ? ) ORDER BY year ASC, student ASC`, [`%${searchQuery}%`,`%${searchQuery}%`,],
        function (error, results, fields) {
        if (error) throw error;
        res.send(results);
        }
    );
});

module.exports = router;