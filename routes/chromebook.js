const express = require("express");

const database = require("../utils/database.js");
const session = require("../utils/session.js");

const logs = require("../utils/logs.js");

const router = express.Router();


let FEATURE_ENABLED = 0;

const featureQuery = database.query("SELECT * FROM settings WHERE settingName = 'chromebookRepairs'",
    function(error, results) {
        if(error) throw error;
        FEATURE_ENABLED = results[0].enabled;
        if(FEATURE_ENABLED) { 
            console.log("CHROMEBOOK REPAIRS ARE ENABLED");
        }
    });


router.get("/");

router.get("/list", session.validateSession,  (req, res) => {
    const limit = parseInt(req.query.limit, 10) || 30; // Set default limit to 30
    const page = parseInt(req.query.page, 10) || 1;
    const offset = (page - 1) * limit;
    database.query(
        `SELECT Chromebooks.id, Chromebooks.model_id, Chromebooks.date_added, Chromebooks.tag, Chromebooks.building, Chromebooks.status, Chromebooks.sn, Chromebooks.device_status, Chromebook_makes.make, Chromebook_makes.model, Chromebook_makes.screen, Chromebook_makes.cost, Chromebook_makes.updates
        FROM Chromebooks INNER JOIN Chromebook_makes ON Chromebooks.model_id = Chromebook_makes.id
        WHERE Chromebooks.status = 'true' ORDER BY Chromebooks.building ASC Limit ?, ?`,[offset, limit],
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
    `SELECT Chromebooks.id, Chromebooks.model_id, Chromebooks.date_added, Chromebooks.tag, Chromebooks.building, Chromebooks.status, Chromebooks.sn, Chromebooks.device_status, Chromebook_makes.make, Chromebook_makes.model, Chromebook_makes.screen, Chromebook_makes.cost, Chromebook_makes.updates
    FROM Chromebooks
    INNER JOIN Chromebook_makes ON Chromebooks.model_id = Chromebook_makes.id
    WHERE Chromebooks.status = 'true'
    AND (Chromebooks.tag LIKE ? OR Chromebook_makes.make LIKE ? OR Chromebook_makes.model LIKE ? OR Chromebooks.sn LIKE ? OR Chromebooks.building LIKE ? OR Chromebooks.device_status LIKE ?)
    ORDER BY Chromebooks.building ASC Limit 30`,
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
                `SELECT  Chromebooks.sn, Chromebook_makes.make, Chromebook_makes.model
                FROM Chromebooks
                INNER JOIN Chromebook_makes ON Chromebooks.model_id = Chromebook_makes.id
                WHERE Chromebooks.id = ?`,[req.query.id],
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
    database.query(
        `INSERT INTO chromebook_log SET ?`, [req.body],
        function (error, results, fields) {
        if (error) throw error;
        res.send('added');
        }
    );
});

router.put("/repair", session.validateSession,  (req, res) => {
    database.query(`UPDATE chromebooks SET device_status = 'Out for Repair' WHERE id = ?`, [req.query.id], function (error, results, fields) {
        if (error) throw error;
        res.send('updated');
        }
    );
});

router.post("/repair", session.validateSession,  (req, res) => {
    database.query(`UPDATE chromebooks SET device_status = 'In Use' WHERE id = ?`, [req.query.id], function (error, results, fields) {
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

// router.get("/getAllRepairs", session.validateSession, async (req, res) => {
//     let repairData = [];
//     let repairCounts = database.query(`SELECT count(*) FROM chromebook_repairs WHERE isReturned = 'False'`,
//         function (error, results, fields) {
//         if (error) throw error;
//         var returnData = {
//             northside: 0,
//             parkside: 0,
//             abe: 0,
//             highschool: 0,
//             middleschool: 0,
//         }
//         for(let i = 0; i < results.length; i++) {
//             let school = results[i].schoolName;
//             switch(school) {
//                 case "Monroe High School":
//                     returnData.highschool += 1;
//                     break;
//                 case "Monroe Middle School":
//                     returnData.middleschool += 1;
//                     break;
//                 case "Northside School":
//                     returnData.northside += 1;
//                     break;
//                 case "Abe School":
//                     returnData.abe += 1;
//                     break;
//                 case "Parkside School":
//                     returnData.parkside += 1;
//                     break;
//                 default:
//                     break;
//             }
//         }
//             res.send(returnData);
//     })

// });

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



module.exports = router;