
const express = require("express");
const bcrypt = require("bcryptjs");
const mysql = require("mysql2");
const crypto = require("crypto");
const dotenv = require("dotenv");
const passport = require("passport");

dotenv.config({ path: "./.env" });

// Encryption function
function encrypt(text) {
  const iv = crypto.randomBytes(16);
  const keyBuffer = Buffer.from(process.env.key, "hex");
  const cipher = crypto.createCipheriv("aes-256-cbc", keyBuffer, iv);
  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  return iv.toString("hex") + ":" + encrypted.toString("hex");
}

// Decryption function
function decrypt(text) {
  const parts = text.split(":");
  const iv = Buffer.from(parts.shift(), "hex");
  const encryptedText = Buffer.from(parts.join(":"), "hex");
  const keyBuffer = Buffer.from(process.env.key, "hex");
  const decipher = crypto.createDecipheriv("aes-256-cbc", keyBuffer, iv);
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  return decrypted.toString();
}

const connection = mysql.createPool({
    host: process.env.db_host,
    user: process.env.db_user,
    password: process.env.db_password,
    database: process.env.db_database,
  });

  function validateSession(req, res, next) {
    const sessionID = req.cookies.session_id;
    const username = req.cookies.username;
  
    if (sessionID) {
      // Check if the session ID exists in the user table
      connection.query(
        "SELECT * FROM users WHERE session = ? AND username = ?",
        [sessionID, username],
        (err, results) => {
          if (err) {
            console.error(err);
            res.redirect("/login");
          } else if (results.length === 1) {
            // If the session is valid, continue to the next middleware or route handler
            next();
          } else {
            res.redirect("/login");
          }
        }
      );
    } else {
      res.redirect("/");
    }
  }

const router = express.Router();

router.get("/", validateSession, (req, res) => {
    res.render("docs");
  });

  router.get("/doc-list", validateSession, (req, res) => {
    let id = req.query.id
    connection.query(
      "SELECT * FROM docs WHERE status = 'true' ",
      function (error, results, fields) {
        if (error) throw error;
        res.send(results);
      }
    );
  });

  router.get("/doc", validateSession, (req, res) => {
    let id = req.query.id
    connection.query(
      `SELECT * FROM docs WHERE id = ? AND status = 'true'`, [id],
      function (error, results, fields) {
        if (error) throw error;
        res.send(results);
      }
    );
  });

  router.put("/doc", validateSession, (req, res) => {
    let data = {
      doc : req.body.doc,
      doc_body : req.body.body,
      date : new Date().toDateString()
    }
    connection.query(
      `INSERT INTO docs SET ?`, [data],
      function (error, results, fields) {
        if (error) throw error;
        res.send(results);
      }
    );
  });

  router.post("/doc", validateSession, (req, res) => {
    let data = {
      doc : req.body.doc,
      doc_body : req.body.body,
      date : new Date().toDateString()
    }
    connection.query(
      `UPDATE docs SET ? WHERE id = ?`, [data, req.body.id],
      function (error, results, fields) {
        if (error) throw error;
        res.send(results);
      }
    );
  });

  router.delete("/doc", validateSession, (req, res) => {
    connection.query(
      `UPDATE docs SET status = 'false' WHERE id = ?`, [req.query.id],
      function (error, results, fields) {
        if (error) throw error;
        res.send(results);
      }
    );
  });

module.exports = router;