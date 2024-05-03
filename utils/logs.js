const express = require("express");
const database = require("./database.js");
const session = require("../utils/session.js");

const router = express.Router();

const currentDate = new Date();
const year = currentDate.getFullYear();
const month = currentDate.getMonth() + 1; // Months are zero-based (0 = January)
const day = currentDate.getDate();

const hours = currentDate.getHours()
const minutes = currentDate.getMinutes()

const formattedTime = `${hours}:${minutes < 10 ? '0' : ''}${minutes}`

const formattedDate = `${month < 10 ? '0' : ''}${month}-${day < 10 ? '0' : ''}${day}-${year}`;


function SystemLog(logData, username) {
    let data = {
        date : formattedDate,
        time : formattedTime,
        log : logData,
        user : username
    }

    database.query(`INSERT INTO logs SET ?`, [data],
        function (error, results, fields) {
          if (error) throw error;
          console.log('Logged')
        }
      );
}

function ReadLog(callback) {
    database.query(`SELECT * FROM logs ORDER BY id DESC LIMIT 200`,
        function (error, results, fields) {
          if (error) {
            callback(error, null);
            return;
          }
          callback(null, results);
        }
      );
}


module.exports = {
    SystemLog,
    ReadLog,
    formattedDate
}