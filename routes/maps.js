const express = require("express");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const axios = require('axios');
const Parser = require('rss-parser');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const { v4: uuidv4 } = require('uuid');

const database = require("../utils/database.js");
const session = require("../utils/session.js");
const logs = require("../utils/logs.js");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/img/maps'); // specify the destination folder
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname); // keep the original file name
  }
});
const upload = multer({ storage: storage });

const router = express.Router();

router.get("/");

router.get("/", (req, res) => {
  res.render("maps");
});


router.get("/type", session.validateSession, (req, res) => {
  let building = req.query.building;
  database.query(
    `SELECT * FROM maps WHERE view = 'true' AND building = ?`, [building],
    function (error, results, fields) {
      if (error) throw error;
      //console.log(results)
      res.send(results);
    }
  );
});

router.get("/image", session.validateSession, (req, res) => {
  let id = req.query.id
  database.query(
    `SELECT * FROM maps WHERE id = ?`, [id],
    function (error, results, fields) {
      if (error) throw error;
      //console.log(results)
      res.send(results);
    }
  );
});

router.put("/image", session.validateSession, upload.single('file'), (req, res) => {
  const { buildingName, description } = req.body;
  const fileExtension = req.file.originalname.split('.').pop(); // Get file extension
  const fileName = `${uuidv4()}.${fileExtension}`; // Generate unique file name using uuid

  const imageUrl = req.file ? `/img/maps/${fileName}` : null;

  // Rename uploaded file
  // file deepcode ignore PT: <please specify a reason of ignoring this>
  fs.renameSync(req.file.path, path.join(req.file.destination, fileName));

  let data = {
    file: imageUrl,
    building: buildingName,
    type: description
  }

  database.query(
    `INSERT INTO maps SET ?`, [data],
    function (error, results, fields) {
      if (error) {
        console.error('Error inserting data into MySQL:', error);
        res.status(500).send('Internal Server Error');
        return;
      }
      logs.SystemLog(`${data.type} was added to maps`, req.cookies.username)
      res.send('added');
    }
  );
});

router.delete("/image", session.validateSession, (req, res) => {
  let id = req.query.id;
  database.query(
    `UPDATE maps SET view = 'false' WHERE id = ?`, [id],
    function (error, results, fields) {
      if (error) throw error;
      logs.SystemLog(`${data.type} was deleted to maps`, req.cookies.username)
      //console.log(results)
      res.send('deleted');
    }
  );
});


module.exports = router;