const express = require("express");

const database = require("../utils/database.js");
const session = require("../utils/session.js");

const logs = require("../utils/logs.js");
const req = require("express/lib/request");

const router = express.Router();

router.get("/");

router.get("/list", session.validateSession,  (req, res) => {
    database.query(`SELECT * FROM misc_inventory;`,
        function (error, results, fields) {
        if (error) throw error;
        return res.send(results);
        }
    );
});

router.get("/getById", session.validateSession, (req, res) => {
    database.query(`SELECT * FROM misc_inventory WHERE id = ?`, [req.query.id],
        function (error, results, fields) {
        if (error) throw error;
            return res.send(results);
        }
    );
});

router.post("/log", session.validateSession,  (req, res) => {
    const reqBody = req.body;
    reqBody.log = reqBody.log.replace("@@@", req.cookies.username);

    database.query('INSERT INTO misc_inventory_logs SET ?', [reqBody],
        function (error, results, fields) {
            if (error) throw error;
            return res.send("Logged");
        });

});

router.get("/log", session.validateSession,  (req, res) => {
    database.query(
        `SELECT * FROM misc_inventory_logs WHERE id = ? ORDER BY id desc`, [req.query.id],
        function (error, results, fields) {
            if (error) throw error;
            return res.send(results);
        }
    );
})

router.put("/updateMisc", session.validateSession, (req,res) => {
    const reqBody = req.body;
    console.log(reqBody.log);
    reqBody.log = reqBody.log.replace("@@@", req.cookies.username);

    database.query(`UPDATE misc_inventory SET ? WHERE id = ?`, [reqBody, req.query.id],
        function (error, results, fields) {
        if (error) throw error;
        logs.SystemLog(`Item: ${req.query.id} was updated in the misc inventory.`, req.cookies.username)
        return res.send('updated');
    });
});

router.post("/addMisc", session.validateSession, (req, res) => {
    database.query(`INSERT INTO misc_inventory SET ?`, [req.body],
        function (error, results, fields) {
            if (error) throw error;
            logs.SystemLog(`An item was added to the misc inventory.`, req.cookies.username)
            return res.send('added');
        }
    );
})

router.delete("/deleteMisc", session.validateSession, (req, res) => {
    const miscId = req.query.id;
    const itemName = req.body.itemName;
    const serialNumber = req.body.serialNumber;

    database.query('DELETE FROM misc_inventory WHERE id = ?', [miscId],
        function (error, results, fields) {
            if (error) throw error;
            logs.SystemLog(`Item: ${itemName},${serialNumber} was deleted from the misc inventory.`, req.cookies.username);
            return res.send('deleted');
        });
});


function getMiscName(miscId, callback) {
    database.query(`SELECT itemName, serialNumber FROM misc_inventory WHERE id = ?`, [miscId], callback);
}

module.exports = router;