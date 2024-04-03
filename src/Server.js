const express = require("express");
const mysql = require("mysql");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5001;

app.use(bodyParser.json());
app.use(cors());

// MySQL Connection
const db = mysql.createConnection({
  host: "localhost:3306",
  user: "stewie",
  password: "ChickenStewie@7",
  database: "taskmanager",
});

db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log("MySQL connected");
});

// Login Status
let LoggedInUser = null;

// Signup Endpoint
app.post("/signup", (req, res) => {
  const { username, email, password } = req.body;

  // Check if the username or email already exists in the database
  const CHECK_EXISTENCE_QUERY = `SELECT * FROM users WHERE username = ? OR email = ?`;
  db.query(CHECK_EXISTENCE_QUERY, [username, email], (err, result) => {
    if (err) {
      res.status(500).send("Error checking user existence");
      return;
    }

    // If user with the same username or email already exists, throw an error
    if (result.length > 0) {
      res
        .status(400)
        .send("User with the same Username or Email already exists");
      return;
    }

    // If user doesn't exist, proceed to insert
    const INSERT_USER_QUERY = `INSERT INTO users (username, email, password) VALUES (?, ?, ?)`;
    db.query(INSERT_USER_QUERY, [username, email, password], (err, result) => {
      if (err) {
        res.status(500).send("Error Signing Up");
        return;
      }
      res.status(200).send("Signed up successfully");
    });
  });
});

// Login Endpoint
app.post("/login", (req, res) => {
  const { email, password } = req.body;
  const SELECT_USER_QUERY = `SELECT * FROM users WHERE email = ? AND password = ?`;
  db.query(SELECT_USER_QUERY, [email, password], (err, result) => {
    if (err) {
      res.status(500).send("Error logging in");
      return;
    }
    if (result.length === 0) {
      res.status(401).send("Invalid Email or Password");
      return;
    }
    LoggedInUser = email;
    res.status(200).send("Logged in successfully");
  });
});

// Logout Endpoint
app.post("/logout", (req, res) => {
  LoggedInUser = null;
  res.status(200).send("Logged out successfully");
});

// Check Login Status Endpoint
app.get("/checkLoginStatus", (req, res) => {
  res.status(200).send(LoggedInUser);
  console.log(res);
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
