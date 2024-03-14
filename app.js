const express = require("express");
const cookieParser = require("cookie-parser");
const path = require("path");
const speakeasy = require('speakeasy');
const moment = require('moment');

const database = require("./utils/database.js");
const session = require("./utils/session.js");
const encryption = require("./utils/encryption.js");

//Routes
//const user = require('./routes/user.js');
const servers = require('./routes/servers.js');
const inventory = require('./routes/inventory.js');
const serverConnection = require('./routes/connection.js');
//End of Routes


function generateTimeBasedCode(secret) {
  return speakeasy.totp({
      secret,
      encoding: 'base32', // Make sure to specify the encoding
  });
}

// Function to calculate the remaining time until the current time-based code expires
function calculateRemainingTime(secret) {
  const remainingSeconds = speakeasy.totp.verifyDelta({
      secret,
      encoding: 'ascii',
      token: generateTimeBasedCode(secret),
      window: 1, // Set window to 1 to ensure accuracy
  });

  // If remainingSeconds is -1, it means the current code has expired
  // We return 0 in that case to indicate no remaining time
  if (remainingSeconds === -1) {
      return 0;
  }

  // Otherwise, calculate the remaining time until the next code generation
  const timeRemaining = 30 - (moment().unix() % 30);
  return timeRemaining;
}

const app = express();
const port = 80;

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.json());
app.set("view engine", "hbs");
app.use(express.static(path.join(__dirname, "./public")));

// ************************************************************************************************************************
// ************************************************************************************************************************
// ********************************************         Page Rendering         ********************************************
// ************************************************************************************************************************
// ************************************************************************************************************************

app.get("/scan", (req, res) => {
  res.render("scan");
});

app.get("/", session.validateSession, (req, res) => {
  res.render("index");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.get("/passwords", session.validateSession, (req, res) => {
  res.render("passwords");
});

app.get("/server", (req, res) => {
  res.render("server");
});

app.get("/staff", (req, res) => {
  res.render("staff");
});

app.get("/time", (req, res) => {
  res.render("time");
});

app.get("/docs", (req, res) => {
  res.render("docs");
});

app.get("/docs/:page",  session.validateSession, (req, res) => {
  let page = req.params.page;
  console.log(page);
  res.render("docs");
});

app.use("/inventory", session.validateSession, inventory);

// app.get("/epass", (req, res) => {
//   let newpassword = encryption.encrypt(req.query.password);
//   res.send(newpassword.toString());
// });

// app.get("/dpass", (req, res) => {
//   console.log(req.body.password);
//   let newpassword = encryption.decrypt(req.body.password);
//   res.send(newpassword);
// });

// Data API Calls

app.use("/servers", session.validateSession, servers);

// ************************************************************************************************************************
// ************************************************************************************************************************
// ********************************************         User API Calls         ********************************************
// ************************************************************************************************************************
// ************************************************************************************************************************

app.use("/connection", serverConnection);

// app.post("/login", async (req, res) => {
//   const { username, password } = req.body;
//   database.query(
//     "SELECT password FROM users WHERE username = ? AND status = ?",
//     [username, "Active"],
//     (err, results) => {
//       console.log(results);

//       bcrypt.compare(password, results[0].password, function (err, isMatch) {
//         if (err) {
//           throw err;
//         } else if (!isMatch) {
//           res.send("Incorrect username or password!");
//           // console.log("fail")
//         } else {
//           const sessionID = uuidv4();
//           database.query(
//             "UPDATE users SET session = ? WHERE username = ?",
//             [sessionID, username],
//             (err) => {
//               if (err) {
//                 console.error(err);
//               } else {
//                 const currentDate = new Date();
//                 // Add one year
//                 currentDate.setFullYear(currentDate.getFullYear() + 1);
//                 // Set the session ID as a cookie with the name 'session_id' and max-age set to never expire
//                 res.cookie("session_id", sessionID, {
//                   maxAge: currentDate,
//                   httpOnly: true,
//                   secure: false,
//                   sameSite: "strict",
//                 });
//                 res.cookie("username", username, {
//                   maxAge: currentDate,
//                   httpOnly: true,
//                   secure: true,
//                   sameSite: "none",
//                 });
//                 //console.log('Pass')
//                 res.send("Pass");
//               }
//             }
//           );
//         }
//       });
//     }
//   );
// });

// app.get("/logout", sessions.validateSession,  (req, res) => {
//   const username = req.cookies.username;
//   database.query(
//     `UPDATE users SET session = '' WHERE username = ?`,
//     [username],
//     function (error, results, fields) {
//       if (error) throw error;
//       res.send('logged out')
//     }
//   );
// });

// app.get("/login-check", (req, res) => {
//   const username = req.cookies.username;
//   const sessionID = req.cookies.session_id;
//   database.query(`SELECT * FROM users WHERE username = ? AND session = ?`, [username, sessionID],function (error, results, fields) {
//       if (error) throw error;
//       res.send('Pass')
//     }
//   );
// });




// ************************************************************************************************************************
// ************************************************************************************************************************
// ********************************************  Password Inventory API Calls  ********************************************
// ************************************************************************************************************************
// ************************************************************************************************************************

app.get("/password-list", session.validateSession,  (req, res) => {
  database.query(
    `SELECT id,info,service,updated,url,username,category FROM passwords WHERE view = 'true' ORDER BY service ASC`,
    function (error, results, fields) {
      if (error) throw error;
      res.send(results);
    }
  );
});

app.post("/password-list", session.validateSession,  (req, res) => {
  database.query(
    `SELECT id,info,service,updated,url,username,category FROM passwords WHERE view = 'true' AND id = ? LIMIT 1`,
    [req.query.id],
    function (error, results, fields) {
      if (error) throw error;
      res.send(results);
    }
  );
});

app.put("/password-list", session.validateSession,  (req, res) => {
  const searchQuery = req.query.search;
  database.query(
    `SELECT id, info, service, updated, url, username, category 
                      FROM passwords 
                      WHERE view = 'true' 
                      AND (info LIKE ? OR service LIKE ? OR url LIKE ? OR username LIKE ? OR category LIKE ?)`,
    [
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

app.get("/password", session.validateSession,  (req, res) => {
  database.query(
    `SELECT password FROM passwords WHERE view = 'true' and id = ?`,
    [req.query.id],
    function (error, results, fields) {
      if (error) throw error;
      res.send(encryption.decrypt(results[0].password));
    }
  );
});

app.post("/password",  session.validateSession, (req, res) => {
  let data = {
    service: req.body.service,
    url: req.body.url,
    username: req.body.username,
    password: encryption.encrypt(req.body.password),
    otp : req.body.otp.replace(/\s/g, ""),
    category: req.body.category,
    updated: req.body.updated,
    view: "True",
    info: req.body.info,
  };
  database.query(
    `INSERT INTO passwords SET ?`,
    [data],
    function (error, results, fields) {
      if (error) throw error;
      console.log(results);
      res.send(results);
    }
  );
});

app.post("/password-update", session.validateSession, (req, res) => {
  database.query(
    `SELECT password FROM passwords WHERE id = ?`,
    [req.body.id],
    function (error, results, fields) {
      if (error) throw error;

      if (
        req.body.password === encryption.decrypt(results[0].password) ||
        req.body.password.length == 0
      ) {
        let data = {
          service: req.body.service,
          url: req.body.url,
          username: req.body.username,
          category: req.body.category,
          updated: req.body.updated,
          view: "True",
          info: req.body.info,
        };
        database.query(
          `UPDATE passwords SET ? WHERE id = ?`,
          [data, req.body.id],
          function (error, results, fields) {
            if (error) throw error;
            //console.log(results)
            res.send("Updated");
          }
        );
        return;
      }

      if (req.body.password !== encryption.decrypt(results[0].password)) {
        let data = {
          service: req.body.service,
          url: req.body.url,
          username: req.body.username,
          password: encryption.encrypt(req.body.password),
          category: req.body.category,
          updated: req.body.updated,
          view: "True",
          info: req.body.info,
        };
        database.query(
          `UPDATE passwords SET ? WHERE id = ?`,
          [data, req.body.id],
          function (error, results, fields) {
            if (error) throw error;
            //console.log(results)
            res.send(results);
          }
        );
        return;
      }
    }
  );
});

// app.get("/password-cat", sessions.validateSession, (req, res) => {
//   database.query(
//     `SELECT category FROM password_cat ORDER BY category ASC`,
//     function (error, results, fields) {
//       if (error) throw error;
//       res.send(results);
//     }
//   );
// });

app.get('/otp', (req, res) => {
  try {
    database.query(
      `SELECT otp FROM passwords WHERE id = ?`, [req.query.id],
      function (error, results, fields) {
        if (error) {
          console.error("Error retrieving OTP from the database:", error);
          return res.status(500).send("Error retrieving OTP from the database");
        }

        if(results[0].otp == "none") {
          const data = {
            code: "none",
            remainingTime: 'none'
          };
          console.log(data)
          res.json(data)
        } else {
          if (results.length === 0) {
            console.error("No OTP found for the provided ID:", req.query.id);
            return res.status(404).send("OTP not found");
          }
          const secret = results[0].otp;
          const timeBasedCode = generateTimeBasedCode(secret);
          const remainingTime = calculateRemainingTime(secret);
          const data = {
            code: timeBasedCode,
            remainingTime: remainingTime
          };
          res.json(data);
        }
      }
    );
  } catch (error) {
    
  }
});

// ************************************************************************************************************************
// ************************************************************************************************************************
// ********************************************    AP Inventory API Calls      ********************************************
// ************************************************************************************************************************
// ************************************************************************************************************************

app.get("/ap", session.validateSession, (req, res) => {
  database.query(
    `SELECT * FROM ap WHERE view = 'true' ORDER By Name ASC`,
    function (error, results, fields) {
      if (error) throw error;
      res.send(results);
    }
  );
});

app.put("/ap", session.validateSession, (req, res) => {
  const searchQuery = req.query.search;
  database.query(
    `SELECT * FROM ap WHERE view = 'true' AND (model LIKE ? OR sn LIKE ? OR mac LIKE ? OR name LIKE ? OR room LIKE ? OR tag LIKE ? OR building LIKE ?) ORDER By building ASC`,
    [
      `%${searchQuery}%`,
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

app.get("/apmakes", session.validateSession, (req, res) => {
  database.query(
    `SELECT make FROM makes WHERE view = 'true' AND type = 'AP' GROUP BY make ORDER BY make ASC;`,
    function (error, results, fields) {
      if (error) throw error;
      res.send(results);
    }
  );
});

app.get("/buildings", session.validateSession, (req, res) => {
  database.query(
    `SELECT * FROM buildings WHERE view = 'true' ORDER BY name ASC;`,
    function (error, results, fields) {
      if (error) throw error;
      res.send(results);
    }
  );
});

app.get("/model", session.validateSession, (req, res) => {
  database.query(
    `SELECT model FROM makes WHERE make = ? AND view = 'true' ORDER BY make ASC;`,
    [req.query.make],
    function (error, results, fields) {
      if (error) throw error;
      res.send(results);
    }
  );
});

app.post("/ap", session.validateSession, (req, res) => {
  database.query(
    `SELECT * FROM ap WHERE view = 'true' AND id = ?`,
    [req.query.id],
    function (error, results, fields) {
      if (error) throw error;
      res.send(results);
    }
  );
});

app.post("/ap-add", session.validateSession, (req, res) => {
  let data = {
    make: req.body.make,
    model: req.body.model,
    sn: req.body.sn,
    mac: req.body.mac,
    name: req.body.name,
    tag: req.body.tag,
    room: req.body.room,
    building: req.body.building,
    installed: req.body.installed,
    view: "true",
  };
  database.query(
    `INSERT INTO ap SET ?`,
    [data],
    function (error, results, fields) {
      if (error) throw error;
      res.send(results);
    }
  );
});

app.post("/ap-edit", session.validateSession, (req, res) => {
  let id = req.query.id;
  let data = {
    make: req.body.make,
    model: req.body.model,
    sn: req.body.sn,
    mac: req.body.mac,
    name: req.body.name,
    tag: req.body.tag,
    room: req.body.room,
    building: req.body.building,
    installed: req.body.installed,
    view: "true",
  };
  database.query(
    `UPDATE ap SET ? WHERE id = ?`,
    [data, id],
    function (error, results, fields) {
      if (error) throw error;
      res.send(results);
    }
  );
});

// ************************************************************************************************************************
// ************************************************************************************************************************
// ********************************************  MacBook Inventory API Calls   ********************************************
// ************************************************************************************************************************
// ************************************************************************************************************************

app.get("/macbook", session.validateSession, (req, res) => {
  database.query(
    `SELECT * FROM computers WHERE view = 'true' and type = 'mac'`,
    function (error, results, fields) {
      if (error) throw error;
      res.send(results);
    }
  );
});

// ************************************************************************************************************************
// ************************************************************************************************************************
// ********************************************    iPad Inventory API Calls    ********************************************
// ************************************************************************************************************************
// ************************************************************************************************************************

app.get("/ipad", session.validateSession, (req, res) => {
  database.query(
    `SELECT * FROM ipad WHERE view = 'true'`,
    function (error, results, fields) {
      if (error) throw error;
      res.send(results);
    }
  );
});

app.post("/ipad", session.validateSession, (req, res) => {
  let data = {
    model: req.body.model,
    sn: req.body.sn,
    building: req.body.building,
    date: new Date().toDateString(),
    room: req.body.room,
    staff: req.body.staff,
    view: "true",
    storage: req.body.storage,
    screen: req.body.screen,
    tag: req.body.tag,
  };

  console.log(data);
  database.query(
    `INSERT INTO ipad Set ?`,
    [data],
    function (error, results, fields) {
      if (error) throw error;

      res.send(results);
    }
  );
});

app.put("/ipad", session.validateSession, (req, res) => {
  let data = {
    model: req.body.model,
    sn: req.body.sn,
    building: req.body.building,
    room: req.body.room,
    staff: req.body.staff,
    storage: req.body.storage,
    screen: req.body.screen,
    tag: req.body.tag,
  };

  console.log(data);
  database.query(
    `UPDATE ipad Set ? WHERE id = ?`,
    [data, req.query.id],
    function (error, results, fields) {
      if (error) throw error;

      res.send(results);
    }
  );
});

app.get("/ipad-model", session.validateSession, (req, res) => {
  database.query(
    `SELECT * FROM makes WHERE View = 'true' AND type = 'ipad'`,
    function (error, results, fields) {
      if (error) throw error;
      //console.log(results)
      res.send(results);
    }
  );
});

app.get("/ipad-details", session.validateSession, (req, res) => {
  console.log(req.query.id);
  database.query(
    `SELECT * FROM ipad WHERE id = ?`,
    [req.query.id],
    function (error, results, fields) {
      if (error) throw error;
      console.log(results);
      res.send(results);
    }
  );
});

app.get("/ipad-search", session.validateSession, (req, res) => {
  const searchQuery = req.query.search;
  database.query(
    `SELECT *
                    FROM ipad 
                    WHERE view = 'true' 
                    AND (sn LIKE ? OR building LIKE ? OR staff LIKE ? OR tag LIKE ? OR storage LIKE ? OR room LIKE ?)`,
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


// ************************************************************************************************************************
// ************************************************************************************************************************
// ********************************************  Password Inventory API Calls  ********************************************
// ************************************************************************************************************************
// ************************************************************************************************************************

app.get("/staff-list", session.validateSession,  (req, res) => {
  database.query(
    `SELECT * FROM staff WHERE view = 'true'`,
    function (error, results, fields) {
      if (error) throw error;
      res.send(results);
    }
  );
});

app.post("/staff-add", session.validateSession, (req, res) => {
  let data = {
    name: req.body.name,
    room: req.body.room,
    building: req.body.building,
    view: "true",
  };
  database.query(
    `INSERT INTO staff SET ?`,
    [data],
    function (error, results, fields) {
      if (error) throw error;
      res.send(results);
    }
  );
});







app.get("/staff-search", session.validateSession, (req, res) => {
  const searchQuery = req.query.search;
  database.query(
    `SELECT *
                    FROM staff 
                    WHERE view = 'true' 
                    AND (name LIKE ? OR building LIKE ? OR room LIKE ? )`,
    [
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




const server = app.listen(port, () => {
  console.log("listening at http://localhost");
});
