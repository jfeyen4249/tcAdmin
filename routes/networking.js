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
      `SELECT * FROM networking WHERE view = 'true' ORDER By make ASC LIMIT ?, ?`,[offset, limit],
      function (error, results, fields) {
        if (error) throw error;
        res.send(results);
      }
    );
  });

  router.post("/device", session.validateSession, (req, res) => {
    database.query(
      `SELECT * FROM networking WHERE id = ?`, [req.query.id],
      function (error, results, fields) {
        if (error) throw error;
        res.send(results);
      }
    );
  });

  router.put("/", session.validateSession, (req, res) => {
    const searchQuery = req.query.search;
    database.query(
      `SELECT * FROM networking WHERE view = 'true' AND (model LIKE ? OR sn LIKE ? OR ip LIKE ? OR hostname LIKE ? OR room LIKE ? OR tag LIKE ? OR building LIKE ? OR type LIKE ?) ORDER By building ASC`,
      [
        `%${searchQuery}%`,
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
      `SELECT make FROM makes WHERE view = 'true' AND type = 'switch' GROUP BY make ORDER BY make ASC;`,
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
      `SELECT model, type FROM makes WHERE make = ? AND type = 'switch' OR type = 'Firewall' OR type = 'Router' OR type = 'Wireless Controller' OR type = 'Wireless Bridge'  ORDER BY model ASC;`,
      [req.query.make],
      function (error, results, fields) {
        if (error) throw error;
        res.send(results);
      }
    );
  });
  
  router.post("/add", session.validateSession, (req, res) => {
    
    database.query(
      `INSERT INTO networking SET ?`, [req.body],
      function (error, results, fields) {
        if (error) throw error;
        logs.SystemLog(`${req.body.make} ${req.body.model} (sn:${req.body.sn}) was added the networking inventory.`, req.cookies.username)
        res.send(results);
      }
    );
  });
  
  router.post("/edit", session.validateSession, (req, res) => {
    let id = req.query.id;
    database.query(
      `UPDATE networking SET ? WHERE id = ?`,
      [req.body, id],
      function (error, results, fields) {
        if (error) throw error;
        logs.SystemLog(`${req.body.make} ${req.body.model} (sn:${req.query.sn}) was updated in the wireless access point inventory.`, req.cookies.username)
        res.send(results);
      }
    );
  });

  module.exports = router;