
const express = require("express");

const database = require("../utils/database.js");
const session = require("../utils/session.js");
const {encrypt, decrypt} = require("../utils/encryption.js");

const router = express.Router();

router.get("/");

router.get("/", session.validateSession, (req, res) => {
    res.render("wifi");
  });

router.get("/list", session.validateSession, (req, res) => {
  database.query(`SELECT id, ssid FROM wifi WHERE status = 'true'`, function (error, results, fields) {
      if (error) {
          console.error("Error retrieving WiFi list:", error);
          res.status(500).json({ error: "Internal server error" });
          return;
      }
      if (results.length === 0) {
          console.error("WiFi list is empty");
          res.status(404).json({ error: "WiFi list is empty" });
          return;
      }
      // Constructing an array with objects for each result
      let data = results.map(result => {
          return {
              ssid: decrypt(result.ssid),
              id: result.id
          };
      });
      res.json(data);
  });
});

  router.get("/password", session.validateSession, (req, res) => {
    let id = req.query.id;
    //console.log(id);
    database.query(`SELECT ssid,password FROM wifi WHERE id = ? AND status = 'true'`, [id], function (error, results, fields) {
        if (error) {
            console.error("Error retrieving WiFi details:", error);
            res.status(500).json({ error: "Internal server error" });
            return;
        }

        if (results.length === 0) {
            console.error("WiFi details not found for ID:", id);
            res.status(404).json({ error: "WiFi details not found" });
            return;
        }

        // Constructing an array with objects for each result
        let data = results.map(result => {
            return {
                ssid: decrypt(result.ssid),
                password: decrypt(result.password)
            };
        });

        res.json(data);
    });
});

router.post("/add", session.validateSession, (req, res) => {
  const {ssid, wifipassword} = req.body
  let data = {ssid : encrypt(ssid), password : encrypt(wifipassword)}
  database.query(`INSERT INTO wifi SET ?`,[data], function (error, results, fields) {
      if (error) throw error;
      //console.log(results);
      res.send('added');
    }
  );
});

router.post("/edit", session.validateSession, (req, res) => {
  const {id, ssid, wifipassword} = req.body
  console.log(id)
  let data = {ssid : encrypt(ssid), password : encrypt(wifipassword)}
  database.query(`UPDATE wifi SET ? WHERE id = ?`,[data, id], function (error, results, fields) {
      if (error) throw error;
       console.log(results);
      res.send('added');
    }
  );
});


module.exports = router;