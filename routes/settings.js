
const express = require("express");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const database = require("../utils/database.js");
const session = require("../utils/session.js");
const logs = require("../utils/logs.js");
const axios = require('axios');
const router = express.Router();


router.get("/");

router.get("/", (req, res) => {
  res.render("settings");
});

router.get("/device-type", session.validateSession, (req, res) => {
  database.query(
    `SELECT * FROM devices WHERE status = 'true' ORDER BY device ASC`,
    function (error, results, fields) {
      if (error) throw error;
      res.send(results);
    }
  );
});

router.get("/devices", session.validateSession, (req, res) => {
  database.query(
    `SELECT * FROM makes WHERE view = 'true'`,
    function (error, results, fields) {
      if (error) throw error;
      res.send(results);
    }
  );
});

router.get("/color", session.validateSession, (req, res) => {
  database.query(
    `SELECT id,color FROM buildings WHERE name = ?`,[req.query.building] ,
    function (error, results, fields) {
      if (error) throw error;
      res.send(results);
    }
  );
});


router.get("/buildings", session.validateSession, (req, res) => {
  database.query(
    `SELECT * FROM buildings WHERE view = 'true' ORDER BY name ASC`,
    function (error, results, fields) {
      if (error) throw error;

      res.send(results);
    }
  );
});

router.put("/buildings", session.validateSession, (req, res) => {
  let data = {
    name : req.query.building,
    view : 'true',
    color : req.query.color,
    acronymn : "",
    building_code : ''
  }
  database.query(
    `INSERT INTO buildings SET ?`, [data],
    function (error, results, fields) {
      if (error) throw error;
      logs.SystemLog(`${req.query.building} building was added.`, req.cookies.username)
      res.send('added');
    }
  );
});

router.post("/buildings", session.validateSession, (req, res) => {
  let data = {
    name : req.query.name,
    view : 'true',
    color : req.query.color,
    acronymn : "",
    building_code : ''
  }

  database.query(
    `UPDATE buildings SET ? WHERE id = ?`, [data, req.query.id],
    function (error, results, fields) {
      if (error) throw error;
      logs.SystemLog(`${req.query.name} building was updated.`, req.cookies.username)
      res.send('updated');
    }
  );
});

router.delete("/buildings", session.validateSession, (req, res) => {
  database.query(
    `UPDATE buildings SET view = 'false' WHERE id = ?`, [req.query.id],
    function (error, results, fields) {
      if (error) throw error;
      logs.SystemLog(`${req.query.name} building was deleted.`, req.cookies.username)
      res.send('deleted');
    }
  );
});

//  **********************************************************************************************************************
// ***********************************************************************************************************************

router.get("/device", session.validateSession, (req, res) => {
  database.query(
    `SELECT * FROM makes WHERE view = 'true' AND id = ? ORDER BY make ASC`,[req.query.id],
    function (error, results, fields) {
      if (error) throw error;
      res.send(results);
    }
  );
});

router.put("/device", session.validateSession, (req, res) => {
  let data = {
    make : req.query.make,
    model : req.query.model,
    type : req.query.type,
    View : 'true'
  }
  database.query(
    `INSERT INTO makes SET ?`, [data],
    function (error, results, fields) {
      if (error) throw error;
      logs.SystemLog(`${req.query.make} ${req.query.model} (${req.query.type}) was added.`, req.cookies.username)
      res.send('added');
    }
  );
});

router.post("/device", session.validateSession, (req, res) => {
  let data = {
    make : req.query.make,
    model : req.query.model,
    type : req.query.type,
    View : 'true'
  }
  database.query(
    `UPDATE makes SET ? WHERE id = ?`, [data, req.query.id],
    function (error, results, fields) {
      if (error) throw error;
      logs.SystemLog(`${req.query.make} ${req.query.model} (${req.query.type}) was added.`, req.cookies.username)
      res.send('updated');
    }
  );
});

router.delete("/device", session.validateSession, (req, res) => {
  database.query(
    `UPDATE makes SET view = 'false' WHERE id = ?`, [req.query.id],
    function (error, results, fields) {
      if (error) throw error;
      logs.SystemLog(`${req.query.make} ${req.query.model} (${req.query.type}) was added.`, req.cookies.username)
      res.send('deleted');
    }
  );
});

//  **********************************************************************************************************************
// ***********************************************************************************************************************

router.get("/rooms", session.validateSession, (req, res) => {

  database.query(
    `SELECT * FROM rooms WHERE view = 'true' AND building = ? ORDER BY room ASC`,[req.query.building],
    function (error, results, fields) {
      if (error) throw error;
      res.send(results);
    }
  );
});

router.put("/room", session.validateSession, (req, res) => {
  let data = {
    room : req.query.room,
    building : req.query.building,
  }
  database.query(
    `INSERT INTO rooms SET ?`, [data],
    function (error, results, fields) {
      if (error) throw error;
      logs.SystemLog(`${req.query.room} in ${req.query.building} was added.`, req.cookies.username)
      res.send('added');
    }
  );
});

router.post("/room", session.validateSession, (req, res) => {
  let data = {
    room : req.query.room,
    building : req.query.building,
  }
  database.query(
    `UPDATE rooms SET ? WHERE id = ?`, [data, req.query.id],
    function (error, results, fields) {
      if (error) throw error;
      logs.SystemLog(`${req.query.room} in ${req.query.building} was updated.`, req.cookies.username)
      res.send('added');
    }
  );
});

router.delete("/room", session.validateSession, (req, res) => {
  database.query(
    `UPDATE rooms SET view = 'false' WHERE id = ?`, [req.query.id],
    function (error, results, fields) {
      if (error) throw error;
      logs.SystemLog(`${req.query.room} room was deleted.`, req.cookies.username)
      res.send('deleted');
    }
  );
});

//  **********************************************************************************************************************
// ***********************************************************************************************************************
router.get("/chrome-list", session.validateSession, (req, res) => {
  database.query(
    `SELECT * FROM chromebook_makes WHERE status = 'true'`,
    function (error, results, fields) {
      if (error) throw error;
      res.send(results);
    }
  );
});

router.get("/chrome", session.validateSession, (req, res) => {
  database.query(
    `SELECT * FROM chromebook_makes WHERE status = 'true' AND id = ? ORDER BY make ASC`,[req.query.id],
    function (error, results, fields) {
      if (error) throw error;
      res.send(results);
    }
  );
});

router.put("/chrome", session.validateSession, (req, res) => {
  let data = {
    make : req.query.make,
    model : req.query.model,
    screen : req.query.screen,
    cost : req.query.cost,
    updates : req.query.update,
    status : 'true'
  }
  console.log(data)
  database.query(
    `INSERT INTO chromebook_makes SET ?`, [data],
    function (error, results, fields) {
      if (error) throw error;
      logs.SystemLog(`${req.query.make} ${req.query.model} chromebook was added.`, req.cookies.username)
      res.send('added');
    }
  );
});

router.post("/chrome", session.validateSession, (req, res) => {
  let data = {
    make : req.query.make,
    model : req.query.model,
    screen : req.query.screen,
    cost : req.query.cost,
    updates : req.query.updates,
    status : 'true'
  }
  database.query(
    `UPDATE chromebook_makes SET ? WHERE id = ?`, [data, req.query.id],
    function (error, results, fields) {
      if (error) throw error;
      logs.SystemLog(`${req.query.make} ${req.query.model} chromebook was updated.`, req.cookies.username)
      res.send('updated');
    }
  );
});

router.delete("/chrome", session.validateSession, (req, res) => {
  database.query(
    `UPDATE chromebook_makes SET status = 'false' WHERE id = ?`, [req.query.id],
    function (error, results, fields) {
      if (error) throw error;
      logs.SystemLog(`${req.query.make} ${req.query.model} chromebook was deleted.`, req.cookies.username)
      res.send('deleted');
    }
  );
});

//  **********************************************************************************************************************
// ***********************************************************************************************************************

router.get("/user-list", session.validateSession, (req, res) => {
  database.query(
    `SELECT id,name FROM users`,
    function (error, results, fields) {
      if (error) throw error;
      res.send(results);
    }
  );
});

router.get("/user", session.validateSession, (req, res) => {
  database.query(
    `SELECT id,name,username,phone,status FROM users WHERE id = ?`, [req.query.id],
    function (error, results, fields) {
      if (error) throw error;
      res.send(results);
    }
  );
});

router.put("/user", session.validateSession, (req, res) => {
  let data = {
    username : req.query.username,
    name : req.query.name,
    phone : req.query.phone,
    status : 'Active'
  }
  console.log(data)
  database.query(
    `INSERT INTO users SET ?`, [data],
    function (error, results, fields) {
      if (error) throw error;
      logs.SystemLog(`${data.name}'s account was created`, req.cookies.username)
      res.send('added');
    }
  );
});

router.post("/user", session.validateSession, (req, res) => {
  let data = {
    username : req.query.username,
    name : req.query.name,
    phone : req.query.phone,
    status : req.query.status
  }
  database.query(
    `UPDATE users SET ? WHERE id = ?`, [data, req.query.id],
    function (error, results, fields) {
      if (error) throw error;
      logs.SystemLog(`${req.query.name}'s account was updated out by ${req.cookies.username}.`, req.cookies.username)
      res.send('updated');
    }
  );
});

router.delete("/user", session.validateSession, (req, res) => {
  database.query(
    `UPDATE users SET session = '' WHERE id = ?`, [req.query.id],
    function (error, results, fields) {
      if (error) throw error;
      logs.SystemLog(`${req.query.name}'s was logged out by ${req.cookies.username}.`, req.cookies.username)
      res.send('logged out');
    }
  );
});

router.post("/password", session.validateSession, (req, res) => {
  database.query(
    `UPDATE users SET password ='$2a$10$i9.PCv3J2GhXBSJuKI6lt.tekoijyCPf0mKLWneGFuuYWuSh3EG/W' WHERE id = ?`, [req.query.id],
    function (error, results, fields) {
      if (error) throw error;
      logs.SystemLog(`${req.query.name}'s password was reset by ${req.cookies.username}.`, req.cookies.username)
      res.send('logged out');
    }
  );
});

router.get("/down-devices", session.validateSession, (req, res) => {
  database.query(`SELECT monitoring.name, alert_log.down_time FROM monitoring JOIN alert_log ON monitoring.log_id = alert_log.id WHERE monitoring.status = 'down';`,
    function (error, results, fields) {
      if (error) throw error;
      const downDevices = results.map(result => {
        const differenceInSeconds = Math.abs(Number(Math.floor(Date.now() / 1000)) - Number(result.down_time));
        const down_hours = Math.floor(differenceInSeconds / 3600);
        const down_minutes = Math.floor((differenceInSeconds % 3600) / 60);

        function hours() {
          if (down_hours == 0) {
            return "";
          } else if (down_hours == 1) {
            return `${down_hours} hour`;
          } else {
            return `${down_hours} hours`;
          }
        }

        return {
          name: result.name,
          down_time: hours(down_hours) + ' ' + down_minutes + ` minutes`
        };
      });

      res.send(JSON.stringify(downDevices));
    }
  );
});


router.get("/log", session.validateSession, (req, res) => {
  logs.ReadLog((error, results) => {
    if (error) {
      // Handle error appropriately
      res.status(500).send("Internal Server Error");
      return;
    }
    res.send(results);
  });
});



//  **********************************************************************************************************************
// ***********************************************************************************************************************

router.get("/slack", session.validateSession, (req, res) => {
  database.query(`SELECT * FROM slack WHERE id = 1`, [req.query.id],
    function (error, results, fields) {
      if (error) throw error;
      res.send(results);
    }
  );
});

router.put("/slack", session.validateSession, (req, res) => {
  database.query(`UPDATE slack SET ? WHERE id = 1`, [req.body],
    function (error, results, fields) {
      if (error) throw error;
      res.send(results);
    }
  );
});

router.post("/slack", session.validateSession, async (req, res) => {
  try {
    const response = await axios.post(req.body.url,
      req.body,
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    console.log(response.data);
    res.send(response.data);
  } catch (error) {
    res.status(500).send(error.message);
  }

});


//  **********************************************************************************************************************
//  Feature Disable/Enable
// ***********************************************************************************************************************

router.put("/toggleRepairFeature", session.validateSession, async (req,res) =>{
  const featureQuery = database.query("SELECT * FROM settings WHERE settingName = 'chromebookRepairs'",
    function(error, results) {
        if(error) throw error;
        FEATURE_ENABLED = results[0].enabled;
        if(FEATURE_ENABLED) { 
            const updateQuery = database.query("UPDATE settings SET enabled = 0 WHERE settingName = 'chromebookRepairs'",
            function(error, results) {
              if(error) throw error;
          });
        } else {
          const updateQuery = database.query("UPDATE settings SET enabled = 0 WHERE settingName = 'chromebookRepairs'",
          function(error, results) {
            if(error) throw error;
          });
        }
    });
});

module.exports = router;
