const express = require("express");
const cookieParser = require("cookie-parser");
const path = require("path");
const session = require("./utils/session.js");
const logs = require("./utils/logs.js");
const bodyParser = require('body-parser');

// Routes
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
const smartboards = require('./routes/smartboards.js');
const phones = require('./routes/phones.js');
const chromebook = require('./routes/chromebook.js');
const students = require('./routes/student.js');
const submit_repair = require('./routes/submit_repair.js');
const contacts = require('./routes/contacts.js');
const renew = require('./routes/renew.js');
const networking = require('./routes/networking.js');
const monitoring = require('./routes/monitoring.js');
const info = require('./routes/info.js');
const guide = require('./routes/guide.js');

const app = express();
const port = 5500;

app.use(express.static("public"));
app.use(cookieParser());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.set("view engine", "hbs");
app.use(express.static(path.join(__dirname, "./public")));

app.get("/scan", (req, res) => {
  res.render("scan");
});

app.get("/",  (req, res) => {
  res.render("index");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/macinfo", (req, res) => {
  console.log(req.body);
});

app.get("/monitoring", session.validateSession,  (req, res) => {
  res.render("monitoring");
});

app.use("/inventory", inventory);
app.use("/wifi",  wifi);
app.use("/docs",  docs);
app.use("/ap",  ap);
app.use("/macbook",  macbooks);
app.use("/ipad",  ipad);
app.use("/servers", servers);
app.use("/staff",  staff);
app.use("/passwords",  passwords);
app.use("/desktop",  desktop);
app.use("/connection", serverConnection);
app.use("/news", news);
app.use("/maps", maps);
app.use("/laptop", laptop);
app.use("/settings", settings);
app.use("/printers", printers);
app.use("/projectors", projectors);
app.use("/smartboards", smartboards);
app.use("/phones", phones);
app.use("/chromebook", chromebook);
app.use("/students", students);
app.use("/submitRepair", submit_repair);
app.use("/contacts", contacts);
app.use("/renew", renew);
app.use("/monitoring", monitoring);
app.use("/networking", networking);
app.use("/info", info);
app.use("/guide", guide);

const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});
