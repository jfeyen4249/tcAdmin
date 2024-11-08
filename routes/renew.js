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
        `UPDATE renewals SET status = 'Inactive' WHERE id = ?`, [req.query.id],
        function (error, results, fields) {
        if (error) throw error;
        res.send('deleted');
        }
    );
});


router.post("/renew", session.validateSession, (req, res) => {
    database.query(
        `SELECT * FROM renewals WHERE id = ?`, [req.body.id],
        function (error, results, fields) {
        if (error) throw error;
        let data = {
            service: results[0].service,
            start: results[0].renewal_date,
            renewal_date: req.body.date,
            year: req.body.date.split('-')[2],
            cost: req.body.cost,
            po: req.body.po,
            company: results[0].company,
            contact: results[0].contact,
        }

        console.log(data)

        database.query(
            `INSERT INTO renewals SET ?`, [data],
            function (error, results, fields) {
            if (error) throw error;
                database.query(
                    `UPDATE renewals SET status = 'false' WHERE id = ?`, [req.body.id],
                    function (error, results, fields) {
                    if (error) throw error;
                        res.send('renewed')
                    }
                );
            }
        );
        }
    );
});


router.get("/search", session.validateSession, (req, res) => {
    const searchQuery = req.query.search;
    database.query(`SELECT * FROM renewals WHERE status = 'active' AND (service LIKE ? OR cost LIKE ? OR po LIKE ?) ORDER BY service ASC`, [`%${searchQuery}%`,`%${searchQuery}%`, `%${searchQuery}%`,],
        function (error, results, fields) {
        if (error) throw error;
        res.send(results);
        }
    );
});


router.get("/upcoming", session.validateSession, (req, res) => {
    
    database.query(`SELECT * FROM renewals WHERE STR_TO_DATE(renewal_date, '%m-%d-%Y') BETWEEN CURDATE() AND CURDATE() + INTERVAL 90 DAY AND status = 'active' ORDER BY renewal_date ASC`,
        function (error, results, fields) {
        if (error) throw error;
        res.send(results);
        }
    );
});

module.exports = router;