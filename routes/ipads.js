const express = require("express");

const database = require("../utils/database.js");
const session = require("../utils/session.js");

const router = express.Router();

router.get("/");


router.get("/", session.validateSession, (req, res) => {
    database.query(
      `SELECT * FROM ipad WHERE view = 'true'`,
      function (error, results, fields) {
        if (error) throw error;
        res.send(results);
      }
    );
  });
  
  router.post("/", session.validateSession, (req, res) => {
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
    database.query(
      `INSERT INTO ipad Set ?`,
      [data],
      function (error, results, fields) {
        if (error) throw error;
  
        res.send(results);
      }
    );
  });
  
  router.put("/", session.validateSession, (req, res) => {
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
    database.query(
      `UPDATE ipad Set ? WHERE id = ?`,
      [data, req.query.id],
      function (error, results, fields) {
        if (error) throw error;
  
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
  
  router.get("/details", session.validateSession, (req, res) => {
    console.log(req.query.id);
    database.query(
      `SELECT * FROM ipad WHERE id = ?`,
      [req.query.id],
      function (error, results, fields) {
        if (error) throw error;
        console.log(results);
        res.send(results);
      }
    );
  });
  
  router.get("/search", session.validateSession, (req, res) => {
    const searchQuery = req.query.search;
    database.query(
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

module.exports = router;