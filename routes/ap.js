const express = require("express");

const database = require("../utils/database.js");
const session = require("../utils/session.js");

const logs = require("../utils/logs.js");

const router = express.Router();

router.get("/");

router.get("/", session.validateSession, (req, res) => {
  const limit = parseInt(req.query.limit, 10) || 30; // Set default limit to 30
    const page = parseInt(req.query.page, 10) || 1;
    const offset = (page - 1) * limit;
    database.query(
      `SELECT * FROM ap WHERE view = 'true' ORDER By building ASC LIMIT ?, ?`,[offset, limit],
      function (error, results, fields) {
        if (error) throw error;
        res.send(results);
      }
    );
  });

    
  router.post("/ap", session.validateSession, (req, res) => {
    database.query(
      `SELECT * FROM ap WHERE id = ?`, [req.query.id],
      function (error, results, fields) {
        if (error) throw error;
        res.send(results);
      }
    );
  });

  router.put("/", session.validateSession, (req, res) => {
    const searchQuery = req.query.search;
    database.query(
      `SELECT * FROM ap WHERE view = 'true' AND (model LIKE ? OR sn LIKE ? OR mac LIKE ? OR name LIKE ? OR room LIKE ? OR tag LIKE ? OR building LIKE ?) ORDER By building ASC LIMIT 30`,
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
  
  router.get("/makes", session.validateSession, (req, res) => {
    database.query(
      `SELECT make FROM makes WHERE view = 'true' AND type = 'AP' GROUP BY make ORDER BY make ASC;`,
      function (error, results, fields) {
        if (error) throw error;
        res.send(results);
      }
    );
  });
  
  router.get("/buildings", session.validateSession, (req, res) => {
    database.query(
      `SELECT * FROM buildings WHERE view = 'true' ORDER BY name ASC;`,
      function (error, results, fields) {
        if (error) throw error;
        res.send(results);
      }
    );
  });

  router.get("/room", session.validateSession, (req, res) => {
    database.query(
      `SELECT room FROM rooms WHERE view = 'true' AND building = ?;`, [req.query.building],
      function (error, results, fields) {
        if (error) throw error;
        res.send(results);
      }
    );
  });
  
  router.get("/model", session.validateSession, (req, res) => {
    database.query(
      `SELECT model FROM makes WHERE make = ? and type = 'AP' AND view = 'true' ORDER BY model ASC;`,
      [req.query.make],
      function (error, results, fields) {
        if (error) throw error;
        res.send(results);
      }
    );
  });
  
  router.post("/add", session.validateSession, (req, res) => {
    let data = {
      make: req.body.make,
      model: req.body.model,
      sn: req.body.sn,
      mac: req.body.mac,
      name: req.body.name,
      tag: req.body.tag,
      room: req.body.room,
      building: req.body.building,
      installed: logs.formattedDate,
      view: "true",
    };
    database.query(
      `INSERT INTO ap SET ?`,
      [data],
      function (error, results, fields) {
        if (error) throw error;
        logs.SystemLog(`${data.make} ${data.model} (sn:${data.sn}) was added the wireless access point inventory.`, req.cookies.username)
        res.send(results);
      }
    );
  });
  
  router.post("/edit", session.validateSession, (req, res) => {
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
      view: "true",
    };
    database.query(
      `UPDATE ap SET ? WHERE id = ?`,
      [data, id],
      function (error, results, fields) {
        if (error) throw error;
        logs.SystemLog(`${data.make} ${data.model} (sn:${data.sn}) was updated in the wireless access point inventory.`, req.cookies.username)
        res.send(results);
      }
    );
  });

  module.exports = router;