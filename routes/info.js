const express = require("express");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const { v4: uuidv4 } = require("uuid");
const logs = require("../utils/logs.js");
const database = require("../utils/database.js");
const session = require("../utils/session.js");

dotenv.config({ path: "./.env" });

const router = express.Router();

function getMake(make) {

  if(make == "Dell Inc."){
    console.log('Make: ' + make)
    return "Dell"
  } else {
    return make
  }

}

router.get("/");

router.post("/pc",  (req, res) => {

  database.query(
    `SELECT * FROM makes WHERE make = ? AND model = ? and View = 'true'`, [getMake(req.body.make), req.body.model],
    function (error, results, fields) {
      // console.log(data)
      if(results.length == 1){
        if (error) throw error;
        commitDB(results[0].type)
      }else{
        console.log("Model Not found!")
        res.send("Model Not Found!!")
      }
    }
  );



function commitDB(PCtype) {

  let data = {
    name : req.body.hostname,
    hdd : req.body.total_disk_size_gb + '/' + req.body.free_disk_space_gb,
    ram : req.body.total_memory_gb + '/' + req.body.used_memory_gb,
    os : req.body.os,
    processor: req.body.processor,
    type : PCtype,
    ip: req.body.local_ip,
    make : getMake(req.body.make),
    model: req.body.model,
    sn : req.body.serial_number
  }
  console.log(data)
  database.query(
    `SELECT * FROM computers WHERE make = ? AND model = ? and View = 'true' AND sn = ?`, [getMake(req.body.make), req.body.model, req.body.serial_number],
    function (error, results, fields) {
      if (error) throw error;
      if(results.length == 1) {
        database.query(
          `UPDATE computers SET ? WHERE id = ?`, [data, results[0].id],
          function (error, results, fields) {
              if (error) throw error;
              res.send('Updated in database')
            }
          );
      } else {
        database.query(
          `INSERT INTO computers SET ?`, [data],
          function (error, results, fields) {
              if (error) throw error;
              res.send('Added to database')
            }
          );
      }
    }
  );

}

});


router.post("/mac",  (req, res) => {
  let cpu = req.body.processor
  let data = {
    name : req.body.hostname.replace('.local', ''),
    hdd : req.body.total_disk_size_gb.replace('GB', '') + '/' + req.body.free_disk_space_gb.replace('G', ''),
    ram : req.body.total_memory_gb + '/' + req.body.used_memory_gb,
    os : req.body.macos_name + ' ' + req.body.macos_version,
    processor: req.body.processor,
    type : 'mac',
    ip: req.body.local_ip,
    make : req.body.make,
    model: req.body.model + ' ' + cpu.replace('Apple ', ''),
    sn : req.body.serial_number

  }
  // console.log(data)
  database.query(
    `SELECT * FROM makes WHERE make = 'Apple' AND model = ? and view = 'true'`, [req.body.model + ' ' + cpu.replace('Apple ', '')],
    function (error, results, fields) {
      if(results.length == 1){
        if (error) throw error;
        database.query(
          `SELECT * FROM computers WHERE make = 'Apple' AND model = ? and View = 'true' AND sn = ?`, [req.body.model + ' ' + cpu.replace('Apple ', ''), req.body.serial_number],
          function (error, results, fields) {
            if (error) throw error;
            console.log(results.length)
            //console.log(req.body)
            if(results.length > 0) {
              database.query(
                  `UPDATE computers SET ? WHERE id = ?`, [data, results[0].id],
                  function (error, results, fields) {
                      if (error) throw error;
                      res.send('Updated in database')
                    }
                  );
            } else {
              database.query(
                  `INSERT INTO computers SET ?`, [data],
                  function (error, results, fields) {
                      if (error) throw error;
                      res.send('Added to database')
                    }
                  );
                  
                  // res.send(data)
            }
          }
        );

      }else{
        console.log(`${data.make} ${data.model} is not found in the database!`)
        res.send(`${data.make} ${data.model} is not found in the deviace list!`)
      }
    }
  );








});


module.exports = router;