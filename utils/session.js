const database = require("./database.js");

function validateSession(req, res, next) {
  const sessionID = req.cookies.session_id;
  const username = req.cookies.username;

  if (!sessionID || !username) {
      return res.redirect("/login"); // Redirect if session ID or username is missing
  }

  // Check if the session ID exists in the user table
  database.query(
      "SELECT * FROM users WHERE session = ? AND username = ?",
      [sessionID, username],
      (err, results) => {
          if (err) {
              console.error(err);
              return res.status(500).send("Internal Server Error"); // Handle database query error
          }

          if (results.length === 1) {
              // If the session is valid, continue to the next middleware or route handler
              next();
          } else {
              return res.redirect("/login"); // Redirect if session is not valid
          }
      }
  );
}


module.exports = {
    validateSession
}