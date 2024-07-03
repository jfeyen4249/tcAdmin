const express = require("express");

const database = require("../utils/database.js");
const session = require("../utils/session.js");

const logs = require("../utils/logs.js");

const router = express.Router();

router.get("/");

router.get("/list", session.validateSession,  (req, res) => {
    database.query(
        `SELECT * FROM parts;`,
        function (error, results, fields) {
        if (error) throw error;
        res.send(results);
        }
    );
});

router.get("/getById", session.validateSession, (req, res) => {
    database.query(
        `SELECT * FROM parts WHERE id = ?`, [req.query.id],
        function (error, results, fields) {
        if (error) throw error;
        res.send(results);
        }
    );
});

router.put("/updatePart", session.validateSession, (req,res) => {
    console.log("HIT");
    console.log(req.query.id);
    database.query(`UPDATE parts SET ? WHERE id = ?`, [req.body, req.query.id], 
    function (error, results, fields) {
        if (error) throw error;
        logs.SystemLog(`Part was updated in the parts inventory.`, req.cookies.username)
        res.send('updated');
    });
});

router.post("/addPart", session.validateSession, (req, res) => {
    database.query(
        `INSERT INTO parts SET ?`, [req.body],
        function (error, results, fields) {
        if (error) throw error;
        logs.SystemLog(`A part was added to the part inventory.`, req.cookies.username)
        res.send('added');
        }
    );
})

router.delete("/deletePart", session.validateSession, (req, res) => {
    database.query(
        'DELETE FROM parts WHERE id = ?', [req.query.id],
    function(error, results, fields) {
        if(error) throw error;
        res.send('removed');
    });

})

module.exports = router;