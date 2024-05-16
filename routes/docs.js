const express = require("express");

const database = require("../utils/database.js");
const session = require("../utils/session.js");

const logs = require("../utils/logs.js");

const router = express.Router();

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

  router.get("/doc", session.validateSession, (req, res) => {
    let id = req.query.id
    database.query(
      `SELECT * FROM docs WHERE id = ? AND status = 'true'`, [id],
      function (error, results, fields) {
        if (error) throw error;
        res.send(results);
      }
    );
  });

  router.put("/doc", session.validateSession, (req, res) => {
    let data = {
      doc : req.body.doc,
      doc_body : req.body.body,
      date : new Date().toDateString()
    }
    database.query(
      `INSERT INTO docs SET ?`, [data],
      function (error, results, fields) {
        if (error) throw error;
        logs.SystemLog(`${req.body.doc} was added to documentation.`, req.cookies.username)
        res.send(results);
      }
    );
  });

  router.post("/doc", session.validateSession, (req, res) => {
    let data = {
      doc : req.body.doc,
      doc_body : req.body.body,
      date : new Date().toDateString()
    }
    database.query(
      `UPDATE docs SET ? WHERE id = ?`, [data, req.body.id],
      function (error, results, fields) {
        if (error) throw error;
        logs.SystemLog(`${req.body.doc} was updated.`, req.cookies.username)
        res.send(results);
      }
    );
  });

  router.delete("/doc", session.validateSession, (req, res) => {
    console.log(req.query.Name)
    database.query(
      `UPDATE docs SET status = 'false' WHERE id = ?`, [req.query.id],
      function (error, results, fields) {
        if (error) throw error;
        logs.SystemLog(`${req.query.Name} was delete from documentation.`, req.cookies.username)
        res.send(results);
      }
    );
  });

  router.get("/search", session.validateSession,  (req, res) => {
    const searchQuery = req.query.search;
    database.query(`SELECT * FROM docs WHERE status = 'true' AND (doc LIKE ? OR doc_body LIKE ? ) ORDER By doc ASC`,
      [
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