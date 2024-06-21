
const express = require("express");

const database = require("../utils/database.js");
const session = require("../utils/session.js");
const { decode } = require('html-entities');
const logs = require("../utils/logs.js");
const { v4: uuidv4 } = require('uuid');
const router = express.Router();

const currentDate = new Date();
const year = currentDate.getFullYear();
const month = currentDate.getMonth() + 1; // Months are zero-based (0 = January)
const day = currentDate.getDate();

const hours = currentDate.getHours()
const minutes = currentDate.getMinutes()

const formattedTime = `${hours}:${minutes < 10 ? '0' : ''}${minutes}`

const formattedDate = `${month < 10 ? '0' : ''}${month}-${day < 10 ? '0' : ''}${day}-${year}`;


router.get("/", session.validateSession, (req, res) => {
  res.render("guide");
});


  router.get("/list", session.validateSession, (req, res) => {
    const limit = parseInt(req.query.limit, 10) || 30; // Set default limit to 30
    const page = parseInt(req.query.page, 10) || 1;
    const offset = (page - 1) * limit;
    let id = req.query.id
    database.query(
      `SELECT * FROM guides WHERE status = 'true' Limit ?, ?`,[offset, limit],
      function (error, results, fields) {
        if (error) throw error;
        res.send(results);
      }
    );
  });

  router.get("/guide", session.validateSession, (req, res) => {
    let id = req.query.id

    database.query(
      `SELECT * FROM guides WHERE id = ? AND status = 'true'`, [id],
      function (error, results, fields) {
        if (error) throw error;
        const blobData = results[0].content;
        const base64Data = blobData.toString('base64')
        let data = {
          id: results[0].id,
          name:results[0].name,
          content: base64Data,

        }
        res.json(data);
      }
    );
  });

  router.get("/view/:id", (req, res) => {
    let id = req.params.id;
    console.log(id);

    database.query(`SELECT * FROM guides WHERE link = ? AND status = 'true'`, [id],
      function (error, results, fields) {
        if (error) throw error;
        const blobData = results[0].content;
        const htmlContent = decode(blobData.toString('utf-8'));
        const data = {
          title: `${results[0].name}`,
          description: htmlContent,
      };
      res.render('guide_view', data);
      }
    );
  });
  
  

  router.get("/link", session.validateSession, (req, res) => {
    let id = req.query.id

    database.query(`SELECT link FROM guides WHERE id = ? AND status = 'true'`, [id],
      function (error, results, fields) {
        if (error) throw error;
        let fullLink = `http://${process.env.base_url}:5500/guide/view/${results[0].link}`
        console.log(fullLink)
        res.send(fullLink)
      }
    );
  });






  router.put("/guide", session.validateSession, (req, res) => {

    let data = {
      name : req.body.name,
      content : req.body.content,
      link: uuidv4()
    }
    database.query(
      `INSERT INTO guides SET ?`, [data],
      function (error, results, fields) {
        if (error) throw error;
        logs.SystemLog(`${req.body.name} was added to user guides.`, req.cookies.username)
        console.log(data)
        res.send(results);
      }
    );
  });

  router.post("/guide", session.validateSession, (req, res) => {
    let data = {
      name : req.body.name,
      content : req.body.content,
    }
    database.query(
      `UPDATE guides SET ? WHERE id = ?`, [data, req.body.id],
      function (error, results, fields) {
        if (error) throw error;
        logs.SystemLog(`${req.body.doc} was updated.`, req.cookies.username)
        res.send(results);
      }
    );
  });

  router.delete("/guide", session.validateSession, (req, res) => {
    database.query(
      `UPDATE guides SET status = 'false' WHERE id = ?`, [req.query.id],
      function (error, results, fields) {
        if (error) throw error;
        logs.SystemLog(`User guide was delete from guides.`, req.cookies.username)
        res.send(results);
      }
    );
  });

  router.get("/search", session.validateSession,  (req, res) => {
    const searchQuery = req.query.search;
    database.query(`SELECT * FROM guides WHERE status = 'true' AND (name LIKE ?) ORDER By name ASC`,
      [
        `%${searchQuery}%`,
      ],
      function (error, results, fields) {
        if (error) throw error;
        res.send(results);
      }
    );
});

module.exports = router;