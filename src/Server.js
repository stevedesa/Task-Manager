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

// Create Task Endpoint
app.post("/createTask", (req, res) => {
  const { title, comment, dueDate, status } = req.body;

  // Retrieve user_id using LoggedInUser email
  const SELECT_USER_ID_QUERY = `SELECT user_id FROM users WHERE email = ?`;
  db.query(SELECT_USER_ID_QUERY, [LoggedInUser], (err, userResult) => {
    if (err) {
      console.error("Error retrieving user_id:", err);
      res.status(500).send("Error retrieving user_id");
      return;
    }

    // Extract user_id from the result
    const user_id = userResult[0].user_id;

    // Insert the task into the tasks table with the retrieved user_id
    const INSERT_TASK_QUERY = `INSERT INTO tasks (user_id, title, comments, due_date_time, status) VALUES (?, ?, ?, ?, ?)`;
    db.query(
      INSERT_TASK_QUERY,
      [user_id, title, comment, dueDate, status],
      (err, result) => {
        if (err) {
          console.error("Error creating task:", err);
          res.status(500).send("Error creating task");
          return;
        }
        console.log("Task created successfully");
        res.status(200).send("Task created successfully");
      }
    );
  });
});

// Retrieve Tasks Endpoint
app.get("/getTasks", (req, res) => {
  // Check if a user is logged in
  if (!LoggedInUser) {
    res.status(401).send("Unauthorized");
    return;
  }

  // Retrieve user_id using LoggedInUser email
  const SELECT_USER_ID_QUERY = `SELECT user_id FROM users WHERE email = ?`;
  db.query(SELECT_USER_ID_QUERY, [LoggedInUser], (err, userResult) => {
    if (err) {
      console.error("Error retrieving user_id:", err);
      res.status(500).send("Error retrieving user_id");
      return;
    }

    // Extract user_id from the result
    const user_id = userResult[0].user_id;

    // Update tasks that are overdue
    const UPDATE_OVERDUE_TASKS_QUERY = `
      UPDATE tasks
      SET status = 'OverDue'
      WHERE user_id = ? AND due_date_time < NOW() AND status != 'Completed'
    `;
    db.query(UPDATE_OVERDUE_TASKS_QUERY, [user_id], (err, updateResult) => {
      if (err) {
        console.error("Error updating overdue tasks:", err);
        res.status(500).send("Error updating overdue tasks");
        return;
      }

      // Retrieve tasks ordered by status and due date
      const SELECT_TASKS_QUERY = `
        SELECT *
        FROM tasks
        WHERE user_id = ?
        ORDER BY
          CASE 
            WHEN status = 'OverDue' THEN 1
            WHEN status = 'To-Be-Completed' THEN 2
            WHEN status = 'Completed' THEN 3
          END,
          due_date_time;
      `;
      db.query(SELECT_TASKS_QUERY, [user_id], (err, tasksResult) => {
        if (err) {
          console.error("Error retrieving tasks:", err);
          res.status(500).send("Error retrieving tasks");
          return;
        }

        // Send the retrieved tasks as a response
        res.status(200).json(tasksResult);
      });
    });
  });
});

// Update Task Endpoint
app.put("/updateTask/:taskId", (req, res) => {
  const taskId = req.params.taskId;
  const { status } = req.body;

  const UPDATE_TASK_QUERY = `UPDATE tasks SET status = ? WHERE task_id = ?`;
  db.query(UPDATE_TASK_QUERY, [status, taskId], (err, result) => {
    if (err) {
      console.error("Error updating task:", err);
      res.status(500).send("Error updating task");
      return;
    }
    console.log("Task updated successfully");
    res.status(200).send("Task updated successfully");
  });
});

// Delete Task Endpoint
app.delete("/deleteTask/:taskId", (req, res) => {
  const taskId = req.params.taskId;

  const DELETE_TASK_QUERY = `DELETE FROM tasks WHERE task_id = ?`;
  db.query(DELETE_TASK_QUERY, [taskId], (err, result) => {
    if (err) {
      console.error("Error deleting task:", err);
      res.status(500).send("Error deleting task");
      return;
    }
    console.log("Task deleted successfully");
    res.status(200).send("Task deleted successfully");
  });
});

// Calculate and update task statistics
app.post("/updateTaskStats", (req, res) => {
  // Retrieve user_id using LoggedInUser email
  const SELECT_USER_ID_QUERY = `SELECT user_id FROM users WHERE email = ?`;
  db.query(SELECT_USER_ID_QUERY, [LoggedInUser], (err, userResult) => {
    if (err) {
      console.error("Error retrieving user_id:", err);
      res.status(500).send("Error retrieving user_id");
      return;
    }
    const user_id = userResult[0].user_id;

    // Calculate task stats here
    // Query the database to get the relevant task information
    const CALCULATE_TASK_STATS_QUERY = `
      SELECT COUNT(*) AS completed_tasks,
      (SELECT COUNT(*) FROM tasks WHERE status = 'To-Be-Completed' AND user_id = ?) AS incomplete_tasks,
      (SELECT COUNT(*) FROM tasks WHERE status = 'OverDue' AND user_id = ?) AS overdue_tasks,
      (SELECT task_id FROM tasks WHERE status = 'To-Be-Completed' AND due_date_time > NOW() AND user_id = ? ORDER BY due_date_time ASC LIMIT 1) AS next_task_id
      FROM tasks WHERE status = 'Completed' AND user_id = ?
    `;

    db.query(
      CALCULATE_TASK_STATS_QUERY,
      [user_id, user_id, user_id, user_id],
      (err, result) => {
        if (err) {
          console.error("Error calculating task statistics:", err);
          res.status(500).send("Error calculating task statistics");
          return;
        }
        const taskStats = result[0];
        // Update task stats table
        const UPDATE_TASK_STATS_QUERY = `
          INSERT INTO taskstats (user_id, completed_tasks, incomplete_tasks, overdue_tasks, next_task_id)
          VALUES (?, ?, ?, ?, ?)
          ON DUPLICATE KEY UPDATE
          completed_tasks = VALUES(completed_tasks),
          incomplete_tasks = VALUES(incomplete_tasks),
          overdue_tasks = VALUES(overdue_tasks),
          next_task_id = VALUES(next_task_id)
        `;
        db.query(
          UPDATE_TASK_STATS_QUERY,
          [
            user_id,
            taskStats.completed_tasks,
            taskStats.incomplete_tasks,
            taskStats.overdue_tasks,
            taskStats.next_task_id,
          ],
          (err, result) => {
            if (err) {
              console.error("Error updating task statistics:", err);
              res.status(500).send("Error updating task statistics");
              return;
            }
            res.status(200).json(taskStats);
          }
        );
      }
    );
  });
});

// Endpoint to get title and due date time by task_id
app.get("/getUpcomingTaskDetails/:taskId", (req, res) => {
  const taskId = req.params.taskId;

  // Check if a user is logged in
  if (!LoggedInUser) {
    res.status(401).send("Unauthorized");
    return;
  }

  // Retrieve user_id using LoggedInUser email
  const SELECT_USER_ID_QUERY = `SELECT user_id FROM users WHERE email = ?`;
  db.query(SELECT_USER_ID_QUERY, [LoggedInUser], (err, userResult) => {
    if (err) {
      console.error("Error retrieving user_id:", err);
      res.status(500).send("Error retrieving user_id");
      return;
    }

    // Extract user_id from the result
    const user_id = userResult[0].user_id;

    // Retrieve task details based on task_id and user_id
    const SELECT_TASK_DETAILS_QUERY = `
      SELECT title, due_date_time
      FROM tasks
      WHERE task_id = ? AND user_id = ?
    `;
    db.query(SELECT_TASK_DETAILS_QUERY, [taskId, user_id], (err, result) => {
      if (err) {
        console.error("Error retrieving task details:", err);
        res.status(500).send("Error retrieving task details");
        return;
      }
      if (result.length === 0) {
        res.status(404).send("Task not found");
        return;
      }

      // Send the task details as a response
      res.status(200).json(result[0]);
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
