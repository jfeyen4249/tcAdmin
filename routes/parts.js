const express = require("express");

const database = require("../utils/database.js");
const session = require("../utils/session.js");

const logs = require("../utils/logs.js");
const req = require("express/lib/request");

const router = express.Router();

router.get("/");

router.get("/list", session.validateSession,  (req, res) => {
    database.query(`SELECT * FROM parts;`,
        function (error, results, fields) {
        if (error) throw error;
        res.send(results);
        }
    );
});

router.get("/getById", session.validateSession, (req, res) => {
    database.query(`SELECT * FROM parts WHERE id = ?`, [req.query.id],
        function (error, results, fields) {
        if (error) throw error;
        res.send(results);
        }
    );
});

router.post("/log", session.validateSession,  (req, res) => {
    const reqBody = req.body;
    reqBody.log = reqBody.log.replace("@@@", req.cookies.username);

    database.query('INSERT INTO parts_log SET ?', [reqBody])
})

router.get("/log", session.validateSession,  (req, res) => {
    console.log("hit");
    database.query(
        `SELECT * FROM parts_log WHERE part_id = ? ORDER BY id desc`, [req.query.id],
        function (error, results, fields) {
            if (error) throw error;
            res.send(results);
        }
    );
})

router.put("/updatePart", session.validateSession, (req,res) => {
    database.query(`UPDATE parts SET ? WHERE id = ?`, [req.body, req.query.id],
        function (error, results, fields) {
        if (error) throw error;
        logs.SystemLog(`Part was updated in the parts inventory.`, req.cookies.username)
        res.send('updated');
    });
});

router.post("/addPart", session.validateSession, (req, res) => {
    database.query(`INSERT INTO parts SET ?`, [req.body],
        function (error, results, fields) {
        if (error) throw error;
        logs.SystemLog(`A part was added to the part inventory.`, req.cookies.username)
        res.send('added');
        }
    );
})

router.delete("/deletePart", session.validateSession, (req, res) => {
    const partID = req.query.id;
    getPartName(partID, (err, results, fields) => {
        if(err) throw err;

        const partInfo = results[0];

        database.query('DELETE FROM parts WHERE id = ?', [partID],
            async function(error, results, fields) {
                if(error) throw error;
                logs.SystemLog(`Part: ${partInfo.partName},${partInfo.partSKU} was deleted from the part inventory.`, req.cookies.username)
                res.send('removed');
            });
    });
})

router.put("/usePart/:chromebook", session.validateSession, (req, res) => {

    const partID = req.query.id;
    const chromebookSN = req.params?.chromebook;

    getPartName(partID, (err, results, fields) => {
       if(err) throw err;

       const partInfo = results[0];

        database.query(`UPDATE parts SET partCount = partCount - 1 WHERE id = ?`, [partID],
            function (error, results, fields) {
                if (error) throw error;
                logs.SystemLog(`Part: ${partInfo.partName},${partInfo.partSKU} was used from the part inventory on chromebook: ${chromebookSN}`, req.cookies.username)
                res.send('used');
            }
        );
    });
});

function getPartName(partId, callback) {
    database.query(`SELECT partName, partSKU FROM parts WHERE id = ?`, [partId], callback);
}

module.exports = router;