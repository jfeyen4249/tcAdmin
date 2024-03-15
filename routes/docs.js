const express = require("express");

const database = require("../utils/database.js");
const session = require("../utils/session.js");

const router = express.Router();

router.get("/", (req, res) => {
  res.render("docs");
});

router.get("/", session.validateSession, (req, res) => {
    res.render("docs");
  });

  router.get("/list", session.validateSession, (req, res) => {
    let id = req.query.id
    database.query(
      "SELECT * FROM docs WHERE status = 'true' ",
      function (error, results, fields) {
        if (error) throw error;
        res.send(results);
      }
    );
  });

  router.get("/", session.validateSession, (req, res) => {
    let id = req.query.id
    database.query(
      `SELECT * FROM docs WHERE id = ? AND status = 'true'`, [id],
      function (error, results, fields) {
        if (error) throw error;
        res.send(results);
      }
    );
  });

  router.put("/", session.validateSession, (req, res) => {
    let data = {
      doc : req.body.doc,
      doc_body : req.body.body,
      date : new Date().toDateString()
    }
    database.query(
      `INSERT INTO docs SET ?`, [data],
      function (error, results, fields) {
        if (error) throw error;
        res.send(results);
      }
    );
  });

  router.post("/", session.validateSession, (req, res) => {
    let data = {
      doc : req.body.doc,
      doc_body : req.body.body,
      date : new Date().toDateString()
    }
    database.query(
      `UPDATE docs SET ? WHERE id = ?`, [data, req.body.id],
      function (error, results, fields) {
        if (error) throw error;
        res.send(results);
      }
    );
  });

  router.delete("/", session.validateSession, (req, res) => {
    database.query(
      `UPDATE docs SET status = 'false' WHERE id = ?`, [req.query.id],
      function (error, results, fields) {
        if (error) throw error;
        res.send(results);
      }
    );
  });

module.exports = router;