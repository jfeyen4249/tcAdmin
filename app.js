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
const wifi = require('./routes/wifi.js');
const passwords = require('./routes/passwords.js');
const docs = require('./routes/docs.js');
//End of Routes

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




app.use("/inventory", session.validateSession, inventory);
app.use("/wifi", session.validateSession, wifi);
app.use("/docs", session.validateSession, docs);
app.use("/servers", session.validateSession, servers)
app.use("/connection", serverConnection);
app.use("/passwords", passwords);


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