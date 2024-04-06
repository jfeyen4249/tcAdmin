const express = require("express");
const cookieParser = require("cookie-parser");
const path = require("path");
const session = require("./utils/session.js");
const bcrypt = require("bcryptjs");

//Routes

const servers = require('./routes/servers.js');
const inventory = require('./routes/inventory.js');
const serverConnection = require('./routes/connection.js');
const wifi = require('./routes/wifi.js');
const passwords = require('./routes/passwords.js');
const docs = require('./routes/docs.js');
const ap = require('./routes/ap.js');
const macbooks = require('./routes/macbooks.js');
const ipad = require('./routes/ipads.js');
const staff = require('./routes/staff.js');
const desktop = require('./routes/desktop.js');
const news = require('./routes/news.js');
const maps = require('./routes/maps.js');
const laptop = require('./routes/laptop.js');
const settings = require('./routes/settings.js');
const printers = require('./routes/printers.js');
const projectors = require('./routes/projectors.js');
const phones = require('./routes/phones.js');
//End of Routes

const app = express();
const port = 5500;

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.json());
app.set("view engine", "hbs");
app.use(express.static(path.join(__dirname, "./public")));

app.get("/scan", (req, res) => {
  res.render("scan");
});

app.get("/", session.validateSession, (req, res) => {
  res.render("index");
});

app.get("/login", (req, res) => {
  res.render("login");
});


app.use("/inventory", session.validateSession, inventory);
app.use("/wifi", session.validateSession, wifi);
app.use("/docs", session.validateSession, docs);
app.use("/ap", session.validateSession, ap);
app.use("/macbook", session.validateSession, macbooks);
app.use("/ipad", session.validateSession, ipad);
app.use("/servers", servers);
app.use("/staff", session.validateSession, staff);
app.use("/passwords", session.validateSession, passwords);
app.use("/desktop", session.validateSession, desktop);
app.use("/connection", serverConnection);
app.use("/news", news);
app.use("/maps", maps);
app.use("/laptop", laptop);
app.use("/settings", settings);
app.use("/printers", printers);
app.use("/projectors", projectors);
app.use("/phones", phones);


const server = app.listen(port, () => {
  console.log("listening at http://localhost");
});