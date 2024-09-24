const express = require("express");
const dotenv = require("dotenv");
const { v4: uuidv4 } = require("uuid");
const logs = require("../utils/logs.js");
const database = require("../utils/database.js");
const session = require("../utils/session.js");
const axios = require('axios');
const { totp } = require("otplib");

dotenv.config({ path: "./.env" });

const currentDate = new Date();
const year = currentDate.getFullYear();
const month = currentDate.getMonth() + 1; // Months are zero-based (0 = January)
const day = currentDate.getDate();

const hours = currentDate.getHours()
const minutes = currentDate.getMinutes()
const seconds = currentDate.getSeconds()

const formattedTime = `${hours}:${minutes < 10 ? '0' : ''}${minutes}:${seconds}`

const formattedDate = `${month < 10 ? '0' : ''}${month}-${day < 10 ? '0' : ''}${day}-${year}`;

const router = express.Router();
// const localTime = new Date();
// const unixTime = Math.floor(localTime.getTime() / 1000);

async function getSlackHook() {
  return new Promise((resolve, reject) => {
    database.query(
      `SELECT hook FROM slack WHERE id = '1'`,
      function (error, results, fields) {
        if (error) {
          reject(error);
        } else {
          resolve(results[0].hook);
        }
      }
    );
  });
}

async function slack(text) {
  try {
    const hook = await getSlackHook();
    const response = await axios.post(
      hook,
      { text: text },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data;
  } catch (error) {
    console.log('Slack Error:', error.response ? error.response.data : error.message);
  }
}


function getMake(make) {

  if(make == "Dell Inc."){
    //console.log('Make: ' + make)
    return "Dell"
  } else {
    return make
  }

}

function updateTime(id) {
//   database.query(
//     `UPDATE monitoring SET time = '' WHERE id = ?`, [id],
//     function (error, results, fields) {
//       if (error) {
//         console.error('Error updating time:', error);
//       } else {
//         console.log('Time updated successfully:');
//       }
//     }
//   );

const localTime = new Date();
const unixTime = Math.floor(localTime.getTime() / 1000);

  database.query(
    `UPDATE monitoring SET time = ? WHERE id = ?`, [unixTime, id],
    function (error, results, fields) {
      if (error) {
        console.error('Error updating time:', error);
      } else {
        //console.log('Time updated successfully:', unixTime);
      }
    }
  );
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

  // Function to calculate the percentage
  function calculatePercentage(total, used) {
    return (used / total) * 100;
  }

  // Extract the values from req.body
  const totalDiskSizeGB = parseFloat(req.body.total_disk_size_gb);
  const freeDiskSpaceGB = parseFloat(req.body.free_disk_space_gb);
  const usedDiskSpaceGB = totalDiskSizeGB - freeDiskSpaceGB;
  const totalMemoryGB = parseFloat(req.body.total_memory_gb);
  const usedMemoryGB = parseFloat(req.body.used_memory_gb);

  // Calculate percentages
  const hddUsagePercentage = calculatePercentage(totalDiskSizeGB, usedDiskSpaceGB);
  const ramUsagePercentage = calculatePercentage(totalMemoryGB, usedMemoryGB);

  // Function to call if usage is above 90%
  function handleHighUsage(type, percentage) {
    //console.log(`${type} usage is above 90%: ${percentage.toFixed(2)}%`);
    database.query(
      `SELECT pc FROM slack WHERE id = '1'`, 
      function (error, results, fields) {
          if (error) throw error;
          if(results[0].pc == '1') {
            
            database.query(
              `SELECT alert FROM computers WHERE sn = ?`, [data.sn] , 
              function (error, results, fields) {
                  if (error) throw error;
                  if(results[0].alert == '0') {                    
                    database.query(
                      `UPDATE computers SET alert = '1' WHERE sn = ?`, [data.sn] , 
                      function (error, results, fields) {
                          if (error) throw error;
                          slack(`${req.body.hostname} has high ${type} usage: ${percentage.toFixed(2)}%`)
                        }
                      );
                  }
                }
              );
          }
        }
      );
  }

  function clearHighUsage() {
    database.query(
      `UPDATE computers SET alert = '0' WHERE sn = ?`, [data.sn] , 
      function (error, results, fields) {
          if (error) throw error;
        }
      );
  }

  // Check if HDD or RAM usage is above 90%
  if (hddUsagePercentage > 90) {
    handleHighUsage('HDD', hddUsagePercentage);
  }else {
    clearHighUsage()
  }

  if (ramUsagePercentage > 90) {
    handleHighUsage('RAM', ramUsagePercentage);
  } else {
    clearHighUsage()
  }

  function getType(make, model) { 
    database.query(
      `SELECT type FROM makes WHERE make = ? AND model = ?`, [make, model],
      function (error, results, fields) {
        if (error) throw error;
        return results[0].type
      }
    )
  }


  //console.log(data)
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
              let pctype = getType(data.make, data.model)
              database.query(
                `UPDATE computers SET type = ? WHERE id = ?`, [pctype, results.insertId],
              )
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
            //console.log(results.length)
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
        //console.log(`${data.make} ${data.model} is not found in the database!`)
        res.send(`${data.make} ${data.model} is not found in the deviace list!`)
      }
    }
  );

});

router.get("/monitor",  (req, res) => {
  database.query(
      `SELECT * FROM monitoring WHERE view = 'true'`,
      function (error, results, fields) {
      if (error) throw error;
      res.json(results);
      }
  );
});

router.post("/monitor", (req, res) => {
  const localTime = new Date();
  const unixTime = Math.floor(localTime.getTime() / 1000);
  let device_info = [];


  database.query(`SELECT * FROM monitoring WHERE id = ?`, [req.body.id], function (error, results, fields) {
    if (error) {
      return res.status(500).send('Database query error');
    }
    device_info = results[0];
    if(req.body.status == 'passed' && device_info.status == 'up' && device_info.count == 1 && device_info.alerted == 0) {
      //  **********************************************************************************************************************
      //  ******************************        Device is up and reporting UP status            ********************************
      // ***********************************************************************************************************************
      console.log(`${device_info.name} is up!`)
      let data = {
        alerted: 0,
        count: 1,
        alert_time: ''

      }

      database.query(`UPDATE monitoring SET ? WHERE id = ?`, [data, device_info.id], function (error, results, fields) {
        //console.log(results)
      });
      
    } else if(req.body.status == 'failed' && device_info.count < device_info.trys && device_info.alerted == 0) {
      //  *********************************************************************************************************************
     //  ************               Device is down but the alert has not been sent               ******************************
     // ***********************************************************************************************************************
      console.log(`${device_info.name} is down, but retry limit has not been reached!`)
      
      let data1 = {
        count: device_info.count + 1,

      }

      database.query(`UPDATE monitoring SET ? WHERE id = ?`, [data1, req.body.id], function (error, results, fields) {

      });

    } 
    
    else if(req.body.status == 'degraded' && device_info.count < device_info.trys && device_info.alerted == 0) {
      //  *********************************************************************************************************************
     //  ************             Device is degread but the alert has not been sent             ******************************
     // ***********************************************************************************************************************
      console.log(`${device_info.name} is degraded, but retry limit has not been reached!`)
      
      let data1 = {
        count: device_info.count + 1,

      }

      database.query(`UPDATE monitoring SET ? WHERE id = ?`, [data1, req.body.id], function (error, results, fields) {

      });

    } else if(req.body.status == 'failed' && device_info.count === device_info.trys && device_info.alerted == 0) {
     //  *********************************************************************************************************************
     //  ************                 Device is down and the alert is being sent                 ******************************
     // ***********************************************************************************************************************
      console.log(`${device_info.name} is down. Slack alert is being sent!`)
      const localTime = new Date();
      const unixTime = Math.floor(localTime.getTime() / 1000);
        let logdata = {
          device_id: device_info.id,
          down_time: unixTime,
          info: 'Device is down',
        }
        database.query(`INSERT INTO alert_log SET ?`, [logdata], function (error, results, fields) {
          let data = {
            alerted: 1,
            count: device_info.count + 1,
            alert_time: unixTime,
            status: 'down',
            log_id: results.insertId
          }
    
          database.query(`UPDATE monitoring SET ? WHERE id = ?`, [data, device_info.id], function (error, results1, fields) {

          database.query(`SELECT * FROM slack WHERE id = '1'`, function (error, results, fields) {
            
            if(results[0].network == 1) {
              slack(`${device_info.name} is not responding.`)
            } else {
              console.log('Slack alert are not enabled!')
            }
          });
              
        });
      }
    );
    } else if(req.body.status == 'degraded' && device_info.count === device_info.trys && device_info.alerted == 0) {
      //  *********************************************************************************************************************
      //  ************                 Device is degraded and the alert is being sent            ******************************
      // ***********************************************************************************************************************
       
      console.log(`${device_info.name} services are degraded. Slack alert is being sent!`)
       const localTime = new Date();
        const unixTime = Math.floor(localTime.getTime() / 1000);
         let logdata = {
           device_id: device_info.id,
           down_time: unixTime,
           info: req.body.message
         }
         database.query(`INSERT INTO alert_log SET ?`, [logdata], function (error, results, fields) {
           let data = {
             alerted: 1,
             count: device_info.count + 1,
             alert_time: unixTime,
             status: 'degraded',
             log_id: results.insertId,
           }
     
           database.query(`UPDATE monitoring SET ? WHERE id = ?`, [data, device_info.id], function (error, results1, fields) {
 
           database.query(`SELECT * FROM slack WHERE id = '1'`, function (error, results, fields) {
             
             if(results[0].network == 1) {
               slack(`${device_info.name} is degraded: ${req.body.message}`)
             } else {
               //console.log('Slack alert are not enabled!')
             }
           });
               
         });
       }
     );
     } else if(req.body.status === 'passed' && device_info.status !== 'up') {
      //  **********************************************************************************************************************
      //  ************                     Device was down but has come back up                   ******************************
      // ***********************************************************************************************************************
      console.log(`${device_info.name} came back up!`)
      //console.log(`${device_info.name} is up`)
      let data4 = {
        alerted: 0,
        count: 1,
        alert_time: '',
        log_id: '',
        status: 'up'
      }

      database.query(`UPDATE monitoring SET ? WHERE id = ?`, [data4, req.body.id], function (error, results, fields) {
          
      database.query(
        'SELECT * FROM alert_log WHERE id = ?', [device_info.log_id],
        function (error, results, fields) {
          if (error) {
            console.error('Database query error:', error);
            return;
          }
      
          if (results.length > 0) {
            const down_time = results[0].down_time;
            //console.log('Databaste down_time: ' + down_time);
      
            // Ensure down_time and unixTime are valid numbers before proceeding
            if (down_time && unixTime) {
              const differenceInSeconds = Math.abs(Number(Math.floor(Date.now() / 1000)) - Number(down_time));
              const down_hours = Math.floor(differenceInSeconds / 3600);
              const down_minutes = Math.floor((differenceInSeconds % 3600) / 60);
              
              const total_down_time = `${down_hours}:${down_minutes}`;
              //console.log(`Difference: ${down_hours} hours and ${down_minutes} minutes`);
      
              const data = {
                up_time: Math.floor(Date.now() / 1000),
                total: total_down_time,
              };
      
              // Update the alert_log with the calculated total downtime
              database.query('UPDATE alert_log SET ? WHERE id = ?', [data, device_info.log_id], function (updateError, updateResults, updateFields) {
                if (updateError) {
                  console.error('Database update error:', updateError);
                  return;
                }
                //console.log('Alert log updated successfully');
              });
              

              database.query(`SELECT * FROM slack WHERE id = '1'`, function (error, results, fields) {
            
                if(results[0].network == 1) {
                  slack(`${device_info.name} is backing up and responding. Total downtime: ${down_hours} hours and ${down_minutes} minutes.`);
                } else {
                  console.log('Slack alert are not enabled!')
                }
              });

            } else {
              console.error('Invalid down_time or unixTime value');
            }
          } else {
            console.error('No results found for the given log_id');
          }
        }
      );

      });
    }  else if(req.body.status === 'passed' && device_info.status == 'degraded') {
      //  **********************************************************************************************************************
      //  ************                 Device was degraded but has come back up                   ******************************
      // ***********************************************************************************************************************
      console.log(`${device_info.name}  came back up All ports that were down are now up!`)
      //console.log(`${device_info.name} is up`)
      let data4 = {
        alerted: 0,
        count: 1,
        alert_time: '',
        log_id: '',
        status: 'up'
      }

      database.query(`UPDATE monitoring SET ? WHERE id = ?`, [data4, req.body.id], function (error, results, fields) {
          
      database.query(
        'SELECT * FROM alert_log WHERE id = ?', [device_info.log_id],
        function (error, results, fields) {
          if (error) {
            console.error('Database query error:', error);
            return;
          }
      
          if (results.length > 0) {
            const down_time = results[0].down_time;
            //console.log('Databaste down_time: ' + down_time);
      
            // Ensure down_time and unixTime are valid numbers before proceeding
            if (down_time && unixTime) {
              const differenceInSeconds = Math.abs(Number(Math.floor(Date.now() / 1000)) - Number(down_time));
              const down_hours = Math.floor(differenceInSeconds / 3600);
              const down_minutes = Math.floor((differenceInSeconds % 3600) / 60);
              
              const total_down_time = `${down_hours}:${down_minutes}`;
              //console.log(`Difference: ${down_hours} hours and ${down_minutes} minutes`);
      
              const data = {
                up_time: Math.floor(Date.now() / 1000),
                total: total_down_time
              };
      
              // Update the alert_log with the calculated total downtime
              database.query('UPDATE alert_log SET ? WHERE id = ?', [data, device_info.log_id], function (updateError, updateResults, updateFields) {
                if (updateError) {
                  console.error('Database update error:', updateError);
                  return;
                }
                //console.log('Alert log updated successfully');
              });
              

              database.query(`SELECT * FROM slack WHERE id = '1'`, function (error, results, fields) {
            
                if(results[0].network == 1) {
                  slack(`${device_info.name} is no longer degraded. All ports are up. Total downtime: ${down_hours} hours and ${down_minutes} minutes.`);
                } else {
                  console.log('Slack alert are not enabled!')
                }
              });

            } else {
              console.error('Invalid down_time or unixTime value');
            }
          } else {
            console.error('No results found for the given log_id');
          }
        }
      );

      });
    }else if(device_info.status == 'down' &&  device_info.count >= 4 ){
      console.log(`${device_info.name} is down and alert was sent already!`)
      //  *********************************************************************************************************************
      //  ************             Device is down alert was sent but has not come back up        ******************************
      // ***********************************************************************************************************************
      
      let data1 = {
        count: device_info.count + 1,
      }

      database.query(`UPDATE monitoring SET ? WHERE id = ?`, [data1, req.body.id], function (error, results, fields) {

      });
    }
      


    updateTime(req.body.id);
      res.send('Updated');
});

});

router.get("/renewal",  (req, res) => {
  database.query(
      `SELECT id,renewal_date FROM renewals WHERE status = 'Active'`,
      function (error, results, fields) {
      if (error) throw error;
      res.json(results);
      }
  );
});

router.post("/renewal",  (req, res) => {
  //console.log(req.body)
  database.query(
      `SELECT * FROM slack WHERE id = '1'`,
      function (error, results, fields) {
      if (error) throw error;
        if(results[0].renewals == '1') {
          database.query(
            `SELECT * FROM renewals WHERE id = ?`, [req.query.id],
            function (error, results, fields) {
            if (error) throw error;
              slack(`${results[0].service} will expire in ${req.body.days_left} days.`)
              //console.log(`${results[0].service} will expire in ${req.body.days_left} days.`)
              res.json('sent');
            }
        );

          console.log('Slack message sent')
        } else {
          console.log("Slack alerts are not enabled for service renewals.")
        }
      }
  );
});

module.exports = router;