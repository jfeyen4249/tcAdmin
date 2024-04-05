
const express = require("express");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");

const database = require("../utils/database.js");
const session = require("../utils/session.js");

const router = express.Router();

router.get("/");

router.get("/", (req, res) => {
  res.render("settings");
});

module.exports = router;
