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

router.get("/", session.validateSession, (req, res) => {
    res.render("submit_repair");
  });

router.get("/repairReasons", session.validateSession, (req, res) => {
    database.query("SELECT * FROM repair_reasons", function(error, results, fields) {
        if(error) throw error;
        res.send(results);
    });
});

router.get("/returnSchools", session.validateSession, (req, res) => {
    database.query("SELECT * FROM buildings WHERE return_building = 'true'", function(error, results, fields) {
        if(error) throw error;
        res.send(results);
    });
});

router.post("/sendRepair", session.validateSession, async (req, res) => {
    if(FEATURE_ENABLED == 0) {
        res.send({Error: "Feature Disabled"});
    }
    let reasonType = req.body.reasonType;
    let reasonValue = req.body.reason;
    let schoolValue = req.body.school;
    let serial = req.body.serial;
    let comments = req.body.comment;
    console.log(req.body);
    
    await fetch("https://tra-customer-portal.azurewebsites.net/REST/CreateTicket.cshtml/29683354", {
    "headers": {
        "accept": "application/json, text/plain, */*",
        "accept-language": "en-US,en;q=0.9",
        "content-type": "application/json",
        "sec-ch-ua": "\"Google Chrome\";v=\"123\", \"Not:A-Brand\";v=\"8\", \"Chromium\";v=\"123\"",
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": "\"macOS\"",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        "cookie": "ASP.NET_SessionId=ipbqnpwfrq2qetxbji5aw1zm; ARRAffinity=ebb4eb6dfd32b1d1da8bf88b45fc94b04325f91fb102d06d51d8ca7b8953e95f; ARRAffinitySameSite=ebb4eb6dfd32b1d1da8bf88b45fc94b04325f91fb102d06d51d8ca7b8953e95f",
        "Referer": "https://tra-customer-portal.azurewebsites.net/CreateMultipleTicketForm/",
        "Referrer-Policy": "strict-origin-when-cross-origin"
    },
    "body": "{\"counter\":1,\"contact\":\"31838647\",\"product\":\"-1\",\"issueType\":{\"Text\":\""+ reasonType + "\",\"Value\":\""+ reasonValue + "\",\"Selected\":false},\"location\":\""+ schoolValue + "\",\"notes\":\""+ comments + "\",\"serialNumber\":\""+ serial + "\",\"result\":\"\"}",
    "method": "POST"
    })
    .then(response => response.text())
    .then(data => {
        console.log(data);
        res.send(data);
    });

    database.query("INSERT INTO chromebook_repairs SET ?", [req.body],
    function(error, results, fields) {
        if(error) throw error;
    });
});

router.get("/repairInfo", session.validateSession, async (req, res) => {
    var serial = req.query.serial;
    database.query(`SELECT * FROM chromebook_repairs WHERE serial = ?`, [serial],
        function(error, results, fields) {
            if(error) throw error;
            res.send(results);
        }
    );
});

module.exports = router;