const express = require("express");
const cookieParser = require("cookie-parser");
const mysql = require("mysql2");
const path = require("path"); // Import path module
const fs = require("fs"); // Import fs module
const dotenv = require("dotenv");
const bcrypt = require("bcryptjs");

dotenv.config({ path: "./.env" });

const crypto = require("crypto");

// Encryption function
function encrypt(text) {
  const iv = crypto.randomBytes(16);
  const keyBuffer = Buffer.from(process.env.key, "hex");
  const cipher = crypto.createCipheriv("aes-256-cbc", keyBuffer, iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString("hex") + ":" + encrypted.toString("hex");
}

// Decryption function
function decrypt(text) {
  const parts = text.split(":");
  const iv = Buffer.from(parts.shift(), "hex");
  const encryptedText = Buffer.from(parts.join(":"), "hex");
  const keyBuffer = Buffer.from(process.env.key, "hex");
  const decipher = crypto.createDecipheriv("aes-256-cbc", keyBuffer, iv);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}

// console.log(encrypt('xH7rRue5'))

// const dateString = new Date().toDateString();
// console.log(dateString);

const app = express();
const port = 80;

// Create a MySQL connection pool for your application database
const connection = mysql.createPool({
  host: process.env.db_host,
  user: process.env.db_user,
  password: process.env.db_password,
  database: process.env.db_database,
});

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.json());
app.set("view engine", "hbs");
app.use(express.static(path.join(__dirname, "./public")));

function validateSession(req, res, next) {
  const sessionID = req.cookies.session_id;

  if (sessionID) {
    // Check if the session ID exists in the user table
    db.query(
      "SELECT * FROM session WHERE session_id = ? AND status = ?",
      [sessionID, "Active"],
      (err, results) => {
        if (err) {
          console.error(err);
          res.redirect("/");
        } else if (results.length === 1) {
          // If the session is valid, continue to the next middleware or route handler
          next();
        } else {
          res.redirect("/");
        }
      }
    );
  } else {
    res.redirect("/");
  }
}

app.get("/scan", (req, res) => {
  res.render("scan");
});

app.get("/", (req, res) => {
  res.render("login");
});

app.get("/passwords", (req, res) => {
  res.render("passwords");
});

app.get("/server", (req, res) => {
  res.render("server");
});

app.get("/docs", (req, res) => {
  res.render("documents");
});

app.get("/docs/:page", (req, res) => {
  let page = req.params.page;
  console.log(page);
  res.render("docs");
});

app.get("/inventory", (req, res) => {
  res.render("inventory");
});

app.get("/inventory/wireless", (req, res) => {
  res.render("wireless");
});

app.get("/inventory/macbook", (req, res) => {
  res.render("macbook");
});

app.get("/inventory/ipad", (req, res) => {
  res.render("ipad");
});

app.get("/epass", (req, res) => {
  let newpassword = encrypt(req.query.password);
  res.send(newpassword.toString());
});

app.get("/dpass", (req, res) => {
  console.log(req.body.password);
  let newpassword = decrypt(req.body.password);
  res.send(newpassword);
});

// Data API Calls

app.get("/servers", (req, res) => {
  connection.query(
    `SELECT * FROM server_info`,
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

app.get("/password-list", (req, res) => {
  connection.query(
    `SELECT id,info,service,updated,url,username,category FROM passwords WHERE view = 'true'`,
    function (error, results, fields) {
      if (error) throw error;
      res.send(results);
    }
  );
});

app.post("/password-list", (req, res) => {
  connection.query(
    `SELECT id,info,service,updated,url,username,category FROM passwords WHERE view = 'true' AND id = ? LIMIT 1`,
    [req.query.id],
    function (error, results, fields) {
      if (error) throw error;
      res.send(results);
    }
  );
});

app.put("/password-list", (req, res) => {
  const searchQuery = req.query.search;
  connection.query(
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

app.get("/password", (req, res) => {
  connection.query(
    `SELECT password FROM passwords WHERE view = 'true' and id = ?`,
    [req.query.id],
    function (error, results, fields) {
      if (error) throw error;
      res.send(decrypt(results[0].password));
    }
  );
});

app.post("/password", (req, res) => {
  let data = {
    service: req.body.service,
    url: req.body.url,
    username: req.body.username,
    password: encrypt(req.body.password),
    category: req.body.category,
    updated: req.body.updated,
    view: "True",
    info: req.body.info,
  };
  connection.query(
    `INSERT INTO passwords SET ?`,
    [data],
    function (error, results, fields) {
      if (error) throw error;
      console.log(results);
      res.send(results);
    }
  );
});

app.post("/password-update", (req, res) => {
  connection.query(
    `SELECT password FROM passwords WHERE id = ?`,
    [req.body.id],
    function (error, results, fields) {
      if (error) throw error;

      if (
        req.body.password === decrypt(results[0].password) ||
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
        connection.query(
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

      if (req.body.password !== decrypt(results[0].password)) {
        let data = {
          service: req.body.service,
          url: req.body.url,
          username: req.body.username,
          password: encrypt(req.body.password),
          category: req.body.category,
          updated: req.body.updated,
          view: "True",
          info: req.body.info,
        };
        connection.query(
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

  //
});

app.get("/password-cat", (req, res) => {
  connection.query(
    `SELECT category FROM password_cat ORDER BY category ASC`,
    function (error, results, fields) {
      if (error) throw error;
      res.send(results);
    }
  );
});

// ************************************************************************************************************************
// ************************************************************************************************************************
// ********************************************    AP Inventory API Calls      ********************************************
// ************************************************************************************************************************
// ************************************************************************************************************************

app.get("/ap", (req, res) => {
  connection.query(
    `SELECT * FROM ap WHERE view = 'true' ORDER By Name ASC`,
    function (error, results, fields) {
      if (error) throw error;
      res.send(results);
    }
  );
});

app.put("/ap", (req, res) => {
  const searchQuery = req.query.search;
  connection.query(
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

app.get("/apmakes", (req, res) => {
  connection.query(
    `SELECT make FROM makes WHERE view = 'true' AND type = 'AP' GROUP BY make ORDER BY make ASC;`,
    function (error, results, fields) {
      if (error) throw error;
      res.send(results);
    }
  );
});

app.get("/buildings", (req, res) => {
  connection.query(
    `SELECT * FROM buildings WHERE view = 'true' ORDER BY name ASC;`,
    function (error, results, fields) {
      if (error) throw error;
      res.send(results);
    }
  );
});

app.get("/model", (req, res) => {
  connection.query(
    `SELECT model FROM makes WHERE make = ? AND view = 'true' ORDER BY make ASC;`,
    [req.query.make],
    function (error, results, fields) {
      if (error) throw error;
      res.send(results);
    }
  );
});

app.post("/ap", (req, res) => {
  connection.query(
    `SELECT * FROM ap WHERE view = 'true' AND id = ?`,
    [req.query.id],
    function (error, results, fields) {
      if (error) throw error;
      res.send(results);
    }
  );
});

app.post("/ap-add", (req, res) => {
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
  connection.query(
    `INSERT INTO ap SET ?`,
    [data],
    function (error, results, fields) {
      if (error) throw error;
      res.send(results);
    }
  );
});

app.post("/ap-edit", (req, res) => {
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
  connection.query(
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

app.get("/macbook", (req, res) => {
  connection.query(
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

app.get("/ipad", (req, res) => {
  connection.query(
    `SELECT * FROM ipad WHERE view = 'true'`,
    function (error, results, fields) {
      if (error) throw error;
      res.send(results);
    }
  );
});

app.post("/ipad", (req, res) => {
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
  connection.query(
    `INSERT INTO ipad Set ?`,
    [data],
    function (error, results, fields) {
      if (error) throw error;

      res.send(results);
    }
  );
});

app.put("/ipad", (req, res) => {
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
  connection.query(
    `UPDATE ipad Set ? WHERE id = ?`,
    [data, req.query.id],
    function (error, results, fields) {
      if (error) throw error;

      res.send(results);
    }
  );
});

app.get("/ipad-model", (req, res) => {
  connection.query(
    `SELECT * FROM makes WHERE View = 'true' AND type = 'ipad'`,
    function (error, results, fields) {
      if (error) throw error;
      //console.log(results)
      res.send(results);
    }
  );
});

app.get("/ipad-details", (req, res) => {
  console.log(req.query.id);
  connection.query(
    `SELECT * FROM ipad WHERE id = ?`,
    [req.query.id],
    function (error, results, fields) {
      if (error) throw error;
      console.log(results);
      res.send(results);
    }
  );
});

app.get("/ipad-search", (req, res) => {
  const searchQuery = req.query.search;
  connection.query(
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

const server = app.listen(port, () => {
  console.log("listening at http://localhost");
});
