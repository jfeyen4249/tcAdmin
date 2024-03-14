const database = require("./database.js");

function validateSession(req, res, next) {
    const sessionID = req.cookies.session_id;
    const username = req.cookies.username;
  
    if (sessionID) {
      // Check if the session ID exists in the user table
      database.query(
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

module.exports = {
    validateSession
}