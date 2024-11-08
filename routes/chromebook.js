const express = require("express");

const database = require("../utils/database.js");
const session = require("../utils/session.js");

const logs = require("../utils/logs.js");

const router = express.Router();

let FEATURE_ENABLED = 0;

// const featureQuery = database.query("SELECT * FROM settings WHERE settingName = 'chromebookRepairs'",
//     function(error, results) {
//         if(error) throw error;
//         FEATURE_ENABLED = results[0].enabled;
//     });

router.get("/");

router.get("/list", session.validateSession,  (req, res) => {
    const limit = parseInt(req.query.limit, 10) || 30; // Set default limit to 30
    const page = parseInt(req.query.page, 10) || 1;
    const offset = (page - 1) * limit;
    database.query(
        `SELECT chromebooks.id, chromebooks.model_id, chromebooks.date_added, chromebooks.tag, chromebooks.building, chromebooks.status, chromebooks.sn, chromebooks.device_status, chromebook_makes.make, chromebook_makes.model, chromebook_makes.screen, chromebook_makes.cost, chromebook_makes.updates
        FROM chromebooks INNER JOIN chromebook_makes ON chromebooks.model_id = chromebook_makes.id
        WHERE chromebooks.status = 'true' ORDER BY chromebooks.building ASC Limit ?, ?`,[offset, limit],
        function (error, results, fields) {
        if (error) throw error;
        res.send(results);
        }
    );
});

router.get("/years", session.validateSession,  (req, res) => {
    database.query(
        `SELECT DISTINCT year FROM students;`,
        function (error, results, fields) {
        if (error) throw error;
        res.send(results);
        }
    );
});

router.get("/students", session.validateSession,  (req, res) => {
    database.query(
        `SELECT * FROM students WHERE year = ?`, [req.query.id],
        function (error, results, fields) {
        if (error) throw error;
        res.send(results);
        }
    );
});

router.get("/makes", session.validateSession,  (req, res) => {
    database.query(
        `SELECT * FROM chromebook_makes WHERE status = 'true';`,
        function (error, results, fields) {
        if (error) throw error;
        res.send(results);
        }
    );
});

router.get("/search", session.validateSession,  (req, res) => {
    const searchQuery = req.query.search;
    database.query(
    `SELECT chromebooks.id, chromebooks.model_id, chromebooks.date_added, chromebooks.tag, chromebooks.building, chromebooks.status, chromebooks.sn, chromebooks.device_status, chromebook_makes.make, chromebook_makes.model, chromebook_makes.screen, chromebook_makes.cost, chromebook_makes.updates
    FROM chromebooks
    INNER JOIN chromebook_makes ON chromebooks.model_id = chromebook_makes.id
    WHERE chromebooks.status = 'true'
    AND (chromebooks.tag LIKE ? OR chromebook_makes.make LIKE ? OR chromebook_makes.model LIKE ? OR chromebooks.sn LIKE ? OR chromebooks.building LIKE ? OR chromebooks.device_status LIKE ?)
    ORDER BY chromebooks.building ASC Limit 30`,
    [
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

router.get("/chromebook", session.validateSession,  (req, res) => {
    database.query(
        `SELECT * FROM chromebooks WHERE id = ? LIMIT 1`, [req.query.id],
        function (error, results, fields) {
        if (error) throw error;
        res.send(results);
        }
    );
});
//gh
router.post("/chromebook", session.validateSession,  (req, res) => {
    database.query(`UPDATE chromebooks SET ? WHERE id = ?`, [req.body, req.query.id], function (error, results, fields) {
        if (error) throw error;
        logs.SystemLog(`Chromebook was updated in the chromebook inventory.`, req.cookies.username)
        res.send('updated');
        }
    );
});

router.put("/chromebook", session.validateSession,  (req, res) => {
    database.query(
        `INSERT INTO chromebooks SET ?`, [req.body],
        function (error, results, fields) {
        if (error) throw error;
        logs.SystemLog(`A chromebook was added to the chromebook inventory.`, req.cookies.username)
        res.send('added');
        }
    );
});


router.delete("/chromebook", session.validateSession, (req, res) => {
    // Update the row
    database.query(
        `UPDATE chromebooks SET status = 'false' WHERE id = ?`, [req.query.id],
        function (error, updateResults, fields) {
            if (error) {
                throw error;
            }

            database.query(
                `SELECT  chromebooks.sn, Chromebook_makes.make, chromebook_makes.model
                FROM Chromebooks
                INNER JOIN chromebook_makes ON chromebooks.model_id = chromebook_makes.id
                WHERE chromebooks.id = ?`,[req.query.id],
                function (error, selectResults, fields) {
                    if (error) {
                        throw error;
                    }
                   
                    logs.SystemLog(`${selectResults[0].make} ${selectResults[0].model} (sn:${selectResults[0].sn}) was deleted from the chromebook inventory.`, req.cookies.username)
                    res.send('deleted');
                }
            );
        }
    );
});

router.post("/student", session.validateSession,  (req, res) => {
    database.query(`UPDATE chromebooks SET ? WHERE id = ?`, [req.body, req.query.id], function (error, results, fields) {
        if (error) throw error;
        res.send('updated');
        }
    );
});

router.get("/log", session.validateSession,  (req, res) => {
    database.query(
        `SELECT * FROM chromebook_log WHERE chromebook_id = ? ORDER BY id desc`, [req.query.id],
        function (error, results, fields) {
        if (error) throw error;
        res.send(results);
        }
    );
});

router.put("/log", session.validateSession,  (req, res) => {

    const reqBody = req.body;
    reqBody.log = reqBody.log.replace("@@@", req.cookies.username);

    database.query(
        `INSERT INTO chromebook_log SET ?`, [reqBody],
        function (error, results, fields) {
        if (error) throw error;
        res.send('added');
        }
    );
});

// router.put("/repair", session.validateSession,  (req, res) => {
//     database.query(`UPDATE chromebooks SET device_status = 'Out for Repair' WHERE id = ?`, [req.query.id], function (error, results, fields) {
//         if (error) throw error;
//         res.send('updated');
//         }
//     );
// });

router.post("/repair", session.validateSession,  (req, res) => {
    let data = {
        serial: req.query.id,
        reason: req.body.reason,
    }
    database.query(`INSERT INTO chromebook_repairs SET ?`, [data], function (error, results, fields) {
        if (error) throw error;
        res.send('updated');
        }
    );
});

router.put("/return", session.validateSession, (req, res) => {
    database.query(`UPDATE chromebook_repairs SET isReturned = 'true' WHERE serial = ?`, [req.query.serial])
});

router.get("/repairInfo/:serial", session.validateSession, async (req, res) => {
    database.query("SELECT * FROM chromebook_repairs WHERE serial = ?", [req.query.serial],
        function(error, results, fields) {
            if(error) throw error;
            res.send(results);
        }
    );
});

router.get("/getAllRepairs", session.validateSession, async (req, res) => {
    let repairData = 0;
    const dbQuery = database.query(`SELECT count(*) as count FROM chromebook_repairs WHERE isReturned = 'False'`,
        function (error, results) {
            if (error) throw error;
            repairData = results[0].count;
            res.send({allRepairs: repairData});
        });
});

router.get("/getRepairsBySchool", session.validateSession, async(req, res) => {
    let returnData = [];
    let schoolName = req.query.school.replaceAll("*", " ");
    const dbQuery = database.query(`SELECT count(*) as count FROM chromebook_repairs WHERE schoolName = ? AND isReturned = 'False'`, [schoolName],
        function(error, results) {
            if(error) throw error;
            returnData.push(results[0].count);

            res.send(returnData);
        });
});

router.get("/getSchoolNames", session.validateSession, async (req, res) => {
    const schoolNames = [];
    const dbQuery = database.query(`SELECT DISTINCT schoolName FROM chromebook_repairs WHERE isReturned = 'False'`,
        function (error, results) {
            if (error) throw error;
            for(let i = 0; i < results.length; i++) {
                schoolNames.push(results[i].schoolName);
            }
            res.send(schoolNames);
        });
});

router.get("/getSerialNumber", session.validateSession, (req, res) => {
    const chromebookID = req.query.id;
    database.query(
        'SELECT sn FROM chromebooks WHERE id = ?', [chromebookID],
        function (error, results, fields) {
            if(error) throw error;
            res.send(results[0]);
        }
    );
})

router.get("/reason", session.validateSession, (req, res) => {
    database.query("SELECT * FROM repair_reasons", function(error, results, fields) {
        if(error) throw error;
        res.send(results);
    });
})


module.exports = router;