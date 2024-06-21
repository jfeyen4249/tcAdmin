const express = require("express");

const database = require("../utils/database.js");
const session = require("../utils/session.js");

const logs = require("../utils/logs.js");

const router = express.Router();

router.get("/list", session.validateSession, (req, res) => {
  const limit = parseInt(req.query.limit, 10) || 30; // Set default limit to 30
    const page = parseInt(req.query.page, 10) || 1;
    const offset = (page - 1) * limit;
    database.query(
      `SELECT * FROM monitoring WHERE view = 'true' ORDER By name ASC LIMIT ?, ?`,[offset, limit],
      function (error, results, fields) {
        if (error) throw error;
        res.send(results);
      }
    );
  });
  
  router.post("/device", session.validateSession, (req, res) => {
    database.query(
      `SELECT * FROM monitoring WHERE id = ?`, [req.query.id],
      function (error, results, fields) {
        if (error) throw error;
        res.send(results);
      }
    );
  });
  
  router.put("/", session.validateSession, (req, res) => {
    const searchQuery = req.query.search;
    database.query(
      `SELECT * FROM monitoring WHERE view = 'true' AND (name LIKE ? OR status LIKE ? OR ip LIKE ?) ORDER By name ASC`,
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
  
  
  router.post("/add", session.validateSession, (req, res) => {
    
    database.query(
      `INSERT INTO monitoring SET ?`, [req.body],
      function (error, results, fields) {
        if (error) throw error;
        logs.SystemLog(`${req.body.name} was added in networking monitoring.`, req.cookies.username)
        res.send(results);
      }
    );
  });
  
  router.post("/edit", session.validateSession, (req, res) => {
    let id = req.query.id;
    database.query(
      `UPDATE monitoring SET ? WHERE id = ?`,
      [req.body, id],
      function (error, results, fields) {
        if (error) throw error;
        logs.SystemLog(`${req.body.name} was updated in networking monitoring.`, req.cookies.username)
        res.send(results);
      }
    );
  });
  
  router.post("/delete", session.validateSession, (req, res) => {
    let id = req.query.id;
    database.query(
      `UPDATE monitoring SET view = 'false' WHERE id = ?`,
      [id],
      function (error, results, fields) {
        if (error) throw error;
        logs.SystemLog(`${req.body.name} was deleted from networking monitoring.`, req.cookies.username);
        res.send(results);
      }
    );
  });
  
  router.get("/logs", session.validateSession, (req, res) => {
      database.query(
        `SELECT alert_log.*, monitoring.name FROM alert_log JOIN monitoring ON alert_log.device_id = monitoring.id WHERE monitoring.id = ?`, [req.query.id],
        function (error, results, fields) {
          if (error) throw error;
          res.send(results);
        }
      );
    });
  
  module.exports = router;