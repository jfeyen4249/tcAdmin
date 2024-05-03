const express = require("express");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const dotenv = require("dotenv");

const database = require("../utils/database.js");
const session = require("../utils/session.js");

dotenv.config({ path: "./.env" });

const router = express.Router();

router.get("/", (req, res) => {
    res.render("inventory");
});

router.get("/macbook", (req, res) => {
    res.render("macbook");
});

router.get("/wireless", (req, res) => {
    res.render("wireless");
});

router.get("/ipad",  (req, res) => {
    res.render("ipad");
});

router.get("/desktop",  (req, res) => {
    res.render("desktop");
});

router.get("/laptop",  (req, res) => {
    res.render("laptop");
});

router.get("/printers",  (req, res) => {
    res.render("printers");
});

router.get("/printers",  (req, res) => {
    res.render("printers");
});

router.get("/projectors",  (req, res) => {
    res.render("projectors");
});

router.get("/phones",  (req, res) => {
    res.render("phones");
});

router.get("/server",  (req, res) => {
    res.render("servers");
});

router.get("/chromebook",  (req, res) => {
    res.render("chromebook");
});



module.exports = router;