const express = require("express");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const { v4: uuidv4 } = require("uuid");
const logs = require("../utils/logs.js");
const database = require("../utils/database.js");
const session = require("../utils/session.js");

dotenv.config({ path: "./.env" });

const router = express.Router();

router.get("/");

function makesCheck(make, model, type) {
  database.query(
      `SELECT * FROM makes WHERE make = ? AND model = ? AND type = ? AND View = 'true'`,
      [make, model, type],
      function (error, results, fields) {
          if (error) throw error;
          if (results.length > 0) {
              console.log('Found in Database!')
          } else {
              database.query(
                  `INSERT INTO makes SET make = ?, model = ?, type = ?, View = 'true'`,
                  [make, model, type],
                  function (error, results, fields) {
                      if (error) throw error;
                      console.log("Added to Makes")
                  }
              );
          }

      }
  );
}


router.post("/login", async (req, res) => {
    const { username, password } = req.body;
    database.query(
      "SELECT password FROM users WHERE username = ? AND status = ?",
      [username, "Active"],
      (err, results) => {
        
        if(results.length !== 0) {
          bcrypt.compare(password, results[0].password, function (err, isMatch) {
            if (err) {
              throw err;
            } else if (!isMatch) {
              res.send("Incorrect username or password!");
              // console.log("fail")
            } else {
              const sessionID = uuidv4();
              database.query(
                "UPDATE users SET session = ? WHERE username = ?",
                [sessionID, username],
                (err) => {
                  if (err) {
                    console.error(err);
                  } else {
                    
                      if(password !== "P@$$Word") {
                        const currentDate = new Date();
                    // Add one year
                    currentDate.setFullYear(currentDate.getFullYear() + 1);
                    // Set the session ID as a cookie with the name 'session_id' and max-age set to never expire
                    res.cookie("session_id", sessionID, {
                      maxAge: currentDate,
                      httpOnly: true,
                      secure: false,
                      sameSite: "strict",
                    });
                    res.cookie("username", username, {
                      maxAge: currentDate,
                      httpOnly: true,
                      secure: false,
                      sameSite: "strict",
                    });
                    //console.log('Pass')
                    logs.SystemLog(`${username} logged in!`,username)
                    res.send("Pass");
                      
                      }else{
                        res.send('change')
                      }
                  }
                }
              );
            }
          });
        } else {
          logs.SystemLog(`${username} entered an incorrect password!`,username)
          res.send('Incorrect username or password.')
        }

      }
    );
  });

  router.put("/password", async  (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);
    
    database.query(
      `UPDATE users SET password = ? WHERE username = ?`,
      [hashedPassword, username],
      function (error, results, fields) {
        if (error) throw error;
        logs.SystemLog(`${username}'s password was changed!`,username)
        res.send('updated');
      }
    );
});

router.get("/logout", session.validateSession,  (req, res) => {
    const username = req.cookies.username;
    database.query(
      `UPDATE users SET session = '' WHERE username = ?`,
      [username],
      function (error, results, fields) {
        if (error) throw error;
        logs.SystemLog(`${username} logged out!`,username)
        res.redirect('/login')
      }
    );
});

router.get("/login-check", (req, res) => {
    console.log("connection/login-check hit");
    const username = req.cookies.username;
    const sessionID = req.cookies.session_id;
    database.query(`SELECT * FROM users WHERE username = ? AND session = ?`, [username, sessionID],function (error, results, fields) {
        if (error) throw error;
        res.send('Pass')
        }
    );
});

router.post("/info/desktop",  (req, res) => {
  
  function pcName(nameMake){
    console.log(nameMake)
    if(nameMake == 'Dell Inc.') {
      return 'Dell'
    } else {
      return nameMake
    }
  }

  let obj = req.body
  let data = { 
    name : obj.ComputerName,
    mac : obj.MACAddress,
    hdd : `${obj.FreeStorageSpaceInGB}/${obj.TotalStorageSpaceInGB}`,
    ram : `${obj.UsedRAMInGB}/${obj.TotalRAMInGB}`,
    os : obj.OSVersion,
    ip : obj.IPAddress,
    sn : obj.SerialNumber,
    make : pcName(obj.ComputerMake),
    model : obj.ComputerModel, 
    view : 'true',
    type : 'desktop'
  }
  // console.log('Connected')
  // console.log(req.body)
  database.query(`Select * FROM computers WHERE view = 'true' AND type = 'desktop' AND mac = ? ORDER BY make ASC`, [req.body.MACAddress],
      function (error, results, fields) {
      if (error) throw error;
      if(results.length > 0 ){
        let obj = req.body
        let updatedata = { 
          name : obj.ComputerName,
          hdd : `${obj.FreeStorageSpaceInGB}/${obj.TotalStorageSpaceInGB}`,
          ram : `${obj.UsedRAMInGB}/${obj.TotalRAMInGB}`,
          os : obj.OSVersion,
          ip : obj.IPAddress,
           
        }
        database.query(`UPDATE computers SET ? WHERE mac = ?`, [updatedata, req.body.MACAddress],
          function (error, results, fields) {
          if (error) throw error;
          }
        ); 
      } else {
        database.query(`INSERT INTO computers SET ?`, [data],
          function (error, results, fields) {
          if (error) throw error;
          }
        ); 
      }
      }
  );
  makesCheck(pcName(obj.ComputerMake), obj.ComputerModel, 'desktop' )
  res.send('Thank you')
});

router.post("/info/laptop",  (req, res) => {
  
  function pcName(nameMake){
    // console.log(nameMake)
    if(nameMake == 'Dell Inc.') {
      return 'Dell'
    } else {
      return nameMake
    }
  }

  let obj = req.body
  let data = { 
    name : obj.ComputerName,
    mac : obj.MACAddress,
    hdd : `${obj.FreeStorageSpaceInGB}/${obj.TotalStorageSpaceInGB}`,
    ram : `${obj.UsedRAMInGB}/${obj.TotalRAMInGB}`,
    os : obj.OSVersion,
    ip : obj.IPAddress,
    sn : obj.SerialNumber,
    make : pcName(obj.ComputerMake),
    model : obj.ComputerModel, 
    view : 'true',
    type : 'laptop'
  }
  // console.log('Connected')
  // console.log(req.body)
  database.query(`Select * FROM computers WHERE view = 'true' AND type = 'desktop' AND mac = ? ORDER BY make ASC`, [req.body.MACAddress],
      function (error, results, fields) {
      if (error) throw error;
      if(results.length > 0 ){
        let obj = req.body
        let updatedata = { 
          name : obj.ComputerName,
          hdd : `${obj.FreeStorageSpaceInGB}/${obj.TotalStorageSpaceInGB}`,
          ram : `${obj.UsedRAMInGB}/${obj.TotalRAMInGB}`,
          os : obj.OSVersion,
          ip : obj.IPAddress,
           
        }
        database.query(`UPDATE computers SET ? WHERE mac = ?`, [updatedata, req.body.MACAddress],
          function (error, results, fields) {
          if (error) throw error;
          }
        ); 
      } else {
        database.query(`INSERT INTO computers SET ?`, [data],
          function (error, results, fields) {
          if (error) throw error;
          }
        ); 
      }
      }
  );
  //makesCheck(pcName(obj.ComputerMake), obj.ComputerModel, 'laptop' )
  res.send('Thanks')
});

router.post("/info/server",  (req, res) => {

  function pcName(nameMake){
    // console.log(nameMake)
    if(nameMake == 'Dell Inc.') {
      return 'Dell'
    } else {
      return nameMake
    }
  }

  let obj = req.body
  let data = { 
    name : obj.ComputerName,
    mac : obj.MACAddress,
    hdd : `${obj.FreeStorageSpaceInGB}/${obj.TotalStorageSpaceInGB}`,
    ram : `${obj.UsedRAMInGB}/${obj.TotalRAMInGB}`,
    os : obj.OSVersion,
    ip : obj.IPAddress,
    sn : obj.SerialNumber,
    make : pcName(obj.ComputerMake),
    model : obj.ComputerModel, 
    view : 'true',
    type : 'server'
  }

  // console.log('Connected')
  // console.log(req.body)
  database.query(`Select * FROM computers WHERE view = 'true' AND type = 'desktop' AND mac = ? ORDER BY make ASC`, [req.body.MACAddress],
      function (error, results, fields) {
      if (error) throw error;
      if(results.length > 0 ){
        let obj = req.body
        let updatedata = { 
          name : obj.ComputerName,
          hdd : `${obj.FreeStorageSpaceInGB}/${obj.TotalStorageSpaceInGB}`,
          ram : `${obj.UsedRAMInGB}/${obj.TotalRAMInGB}`,
          os : obj.OSVersion,
          ip : obj.IPAddress,
        }
        database.query(`UPDATE computers SET ? WHERE mac = ?`, [updatedata, req.body.MACAddress],
          function (error, results, fields) {
          if (error) throw error;
          }
        ); 
      } else {
        database.query(`INSERT INTO computers SET ?`, [data],
          function (error, results, fields) {
          if (error) throw error;
          }
        ); 
      }
      }
  );
  makesCheck(pcName(obj.ComputerMake), obj.ComputerModel, 'server' )
  res.send('Thanks')
});

router.post("/info/mac",  (req, res) => {
  
  function pcName(nameMake){
    console.log(nameMake)
    if(nameMake == 'Dell Inc.') {
      return 'Dell'
    } else {
      return nameMake
    }
  }

  let obj = req.body
  let data = { 
    name : obj.ComputerName,
    mac : obj.MACAddress,
    hdd : `${obj.FreeStorageSpaceInGB}/${obj.TotalStorageSpaceInGB}`,
    ram : `${obj.UsedRAMInGB}/${obj.TotalRAMInGB}`,
    os : obj.OSVersion,
    ip : obj.IPAddress,
    sn : obj.SerialNumber,
    make : 'Apple',
    model : obj.ComputerModel, 
    view : 'true',
    type : 'macbook'
  }
  // console.log('Connected')
  // console.log(req.body)
  database.query(`Select * FROM computers WHERE view = 'true' AND type = 'macbook' AND mac = ? ORDER BY make ASC`, [req.body.MACAddress],
      function (error, results, fields) {
      if (error) throw error;
      if(results.length > 0 ){
        let obj = req.body
        let updatedata = { 
          name : obj.ComputerName,
          hdd : `${obj.FreeStorageSpaceInGB}/${obj.TotalStorageSpaceInGB}`,
          ram : `${obj.UsedRAMInGB}/${obj.TotalRAMInGB}`,
          os : obj.OSVersion,
          ip : obj.IPAddress,
           
        }
        database.query(`UPDATE computers SET ? WHERE mac = ?`, [updatedata, req.body.MACAddress],
          function (error, results, fields) {
          if (error) throw error;
          }
        ); 
      } else {
        database.query(`INSERT INTO computers SET ?`, [data],
          function (error, results, fields) {
          if (error) throw error;
          }
        ); 
      }
      }
  );
  //makesCheck(pcName(obj.ComputerMake), obj.ComputerModel, 'desktop' )
  res.send('Thanks')
});



module.exports = router;