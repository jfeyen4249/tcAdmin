const express = require("express");

const database = require("../utils/database.js");
const session = require("../utils/session.js");

const logs = require("../utils/logs.js");

const router = express.Router();

router.get("/");


router.get("/ipads", session.validateSession, (req, res) => {
  const limit = parseInt(req.query.limit, 10) || 30; // Set default limit to 30
    const page = parseInt(req.query.page, 10) || 1;
    const offset = (page - 1) * limit;
    database.query(
      `SELECT * FROM ipad WHERE view = 'true' Limit ?, ?`,[offset, limit],
      function (error, results, fields) {
        if (error) throw error;
        res.send(results);
      }
    );
  });

  router.get("/ipad-details", session.validateSession, (req, res) => {
    database.query(
      `SELECT * FROM ipad WHERE id = ?`, [req.query.id],
      function (error, results, fields) {
        if (error) throw error;
        res.send(results);
      }
    );
  });
  
  router.post("/ipad", session.validateSession, (req, res) => {
    let data = {
      model: req.body.model,
      sn: req.body.sn,
      building: req.body.building,
      date: logs.formattedDate,
      room: req.body.room,
      staff: req.body.staff,
      view: "true",
      storage: req.body.storage,
      screen: req.body.screen,
      tag: req.body.tag,
    };
    database.query(
      `INSERT INTO ipad Set ?`,
      [data],
      function (error, results, fields) {
        if (error) throw error;
        logs.SystemLog(`iPad (sn:${req.body.sn}) was was added.`, req.cookies.username)
        res.send(results);
      }
    );
  });
  
  router.put("/ipad", session.validateSession, (req, res) => {
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
    database.query(
      `UPDATE ipad Set ? WHERE id = ?`,
      [data, req.query.id],
      function (error, results, fields) {
        if (error) throw error;
        logs.SystemLog(`iPad (sn:${req.body.sn}) was was updated.`, req.cookies.username)
        res.send(results);
      }
    );
  });
  
  router.get("/model", session.validateSession, (req, res) => {
    database.query(
      `SELECT * FROM makes WHERE View = 'true' AND type = 'ipad'`,
      function (error, results, fields) {
        if (error) throw error;
        //console.log(results)
        res.send(results);
      }
    );
  });
  
  router.get("/search", session.validateSession, (req, res) => {
    const searchQuery = req.query.search;
    database.query(
      `SELECT * FROM ipad WHERE view = 'true' AND (sn LIKE ? OR building LIKE ? OR staff LIKE ? OR tag LIKE ? OR storage LIKE ? OR room LIKE ?)`,
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

module.exports = router;