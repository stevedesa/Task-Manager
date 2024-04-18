import React, { useEffect, useState } from "react";
import "./TasksPage.css";
import Plus from "./plusicon.gif";
import axios from "axios";

function TasksPage() {
  const [tasks, setTasks] = useState([]);
  const [TaskBox, setTaskBox] = useState(null);
  const [TaskBoxResponse, setTaskBoxResponse] = useState(null);
  const [TaskBoxError, setTaskBoxError] = useState(null);
  const [noteText, setNoteText] = useState("");

  const [newTaskData, setNewTaskData] = useState({
    title: "",
    comment: "",
    dueDate: "",
    status: "To-Be-Completed",
  });

  const [TaskStats, setTaskStats] = useState({
    completed_tasks: 0,
    incomplete_tasks: 0,
    overdue_tasks: 0,
    next_task_id: 0,
  });

  const [UpcomingTaskDetails, setUpcomingTaskDetails] = useState({
    title: "",
    due_date_time: "",
  });

  const openTaskBox = (index) => {
    setTaskBox(index);
  };

  const closeTaskBox = () => {
    setTaskBox(null);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      fetchTasks();
      fetchTaskStats();
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    fetchNote();
  }, []);

  const fetchTasks = () => {
    axios
      .get("http://localhost:5001/getTasks")
      .then((response) => {
        setTasks(response.data);
      })
      .catch((error) => {
        console.error("Error fetching tasks:", error);
      });
  };

  const handleNewTaskSubmit = () => {
    axios
      .post("http://localhost:5001/createTask", {
        ...newTaskData,
        dueDate: newTaskData.dueDate, // Assuming it's already in the correct format
      })
      .then((response) => {
        console.log(response.data);
        setTaskBoxResponse(response.data);
        setTaskBoxError(null);
        closeTaskBox();
      })
      .catch((error) => {
        setTaskBoxResponse(null);
        setTaskBoxError(error.response ? error.response.data : "Network Error");
      });
  };

  function formatDate(dateTimeString) {
    const date = new Date(dateTimeString);
    const options = {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    };
    return date.toLocaleString("en-US", options);
  }

  const handleUpdateTask = (taskId) => {
    axios
      .put(`http://localhost:5001/updateTask/${taskId}`, {
        title: newTaskData.title,
        comment: newTaskData.comment,
        dueDate: newTaskData.dueDate,
        status: newTaskData.status,
      })
      .then((response) => {
        console.log(response.data);
        setTaskBoxResponse(response.data);
        setTaskBoxError(null);
        closeTaskBox();
      })
      .catch((error) => {
        setTaskBoxResponse(null);
        setTaskBoxError(error.response ? error.response.data : "Network Error");
      });
  };

  const handleDeleteTask = (taskId) => {
    axios
      .delete(`http://localhost:5001/deleteTask/${taskId}`)
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.error("Error deleting task:", error);
      });
  };

  const fetchTaskStats = () => {
    axios
      .post("http://localhost:5001/updateTaskStats")
      .then((response) => {
        setTaskStats(response.data);
        setTimeout(() => {
          fetchUpcomingTaskStats(response.data.next_task_id);
        }, 100);
      })
      .catch((error) => {
        console.error("Error updating task stats:", error);
      });
  };

  const fetchUpcomingTaskStats = (taskId) => {
    axios
      .get(`http://localhost:5001/getUpcomingTaskDetails/${taskId}`)
      .then((response) => {
        setUpcomingTaskDetails(response.data);
      })
      .catch((error) => {
        console.error("Error updating task stats:", error);
      });
  };

  const fetchNote = () => {
    axios
      .get(`http://localhost:5001/getNote`)
      .then((response) => {
        setNoteText(response.data[0].note || "");
      })
      .catch((error) => {
        console.error("Error fetching note:", error);
      });
  };

  const handleNoteChange = (event) => {
    const newText = event.target.value;
    setNoteText(newText);
    saveNoteToDB(newText);
  };

  const saveNoteToDB = (text) => {
    axios
      .post("http://localhost:5001/saveNote", { noteText: text })
      .then((response) => {})
      .catch((error) => {
        console.error("Error saving note:", error);
      });
  };

  return (
    <div className="TasksPage">
      <div className="EventManager">
        <button className="NewTask" onClick={() => openTaskBox(234)}>
          <img src={Plus} alt="Plus" className="GifTag" />
          Create New Task
        </button>
        <div className="EventsStats">
          <div className="TasksLeft">
            <div className="Labels">
              <label className="TasksLabel">Tasks</label>
              <label className="TasksLabel">To Complete</label>
            </div>
            <h2 className="break">{"=>"}</h2>
            <button className="TasksButton Left">
              {TaskStats.incomplete_tasks}
            </button>
          </div>
          <div className="TasksLeft">
            <div className="Labels">
              <label className="TasksLabel">Tasks</label>
              <label className="TasksLabel">OverDue</label>
            </div>
            <h2 className="break">{"=>"}</h2>
            <button className="TasksButton Over">
              {TaskStats.overdue_tasks}
            </button>
          </div>
          <div className="TasksLeft">
            <div className="Labels">
              <label className="TasksLabel">Tasks</label>
              <label className="TasksLabel">Completed</label>
            </div>
            <h2 className="break">{"=>"}</h2>
            <button className="TasksButton Done">
              {TaskStats.completed_tasks}
            </button>
          </div>
          <div className="TasksLeft">
            <div className="Labels">
              <label className="TasksLabel">Upcoming</label>
              <label className="TasksLabel">Task</label>
            </div>
            <h2 className="break">{"=>"}</h2>
            <button className="UpcomingTask">
              <label className="TasksLabel C">Task {"->"} </label>
              <label className="TasksLabel B">
                {UpcomingTaskDetails.title}
              </label>
              <label className="TasksLabel A">{"|"}</label>
              <label className="TasksLabel C">Due {"->"} </label>
              <label className="TasksLabel B">
                {formatDate(UpcomingTaskDetails.due_date_time)}
              </label>
            </button>
          </div>
        </div>
      </div>
      <div className="TableDiv">
        <h2 className="TasksTag">
          {"-> "}To-Do List{" <-"}
        </h2>
        <div className="TasksTable">
          {tasks.map((task, index) => (
            <div key={index} className={`TableEntry T${task.status}`}>
              <div className="TLeftContent">
                <button className={`EventStatus ${task.status}`}>
                  {task.status === "To-Be-Completed"
                    ? "O"
                    : task.status === "OverDue"
                    ? "!"
                    : "X"}
                </button>
                <button className={`EventName ${task.status}`}>
                  Title {"->"} {task.title}
                </button>
                <button className={`EventName ${task.status}`}>
                  Due {"->"} {formatDate(task.due_date_time)}
                </button>
                <button className={`EventName ${task.status}`}>
                  Comments {"->"} {task.comments}
                </button>
              </div>
              <div className="TRightContent">
                <button
                  className="EditButton"
                  onClick={() => openTaskBox(task.task_id)}
                >
                  Edit
                </button>
                <button
                  className="DeleteButton"
                  onClick={() => handleDeleteTask(task.task_id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="NotesSection">
        <h2 className="NotesTag">
          {"-> "}Notes{" <-"}
        </h2>
        <textarea
          className="NoteInput"
          placeholder="Write Your Notes Here..."
          value={noteText}
          onChange={handleNoteChange}
        ></textarea>
      </div>

      {TaskBox === 234 && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="headinglayout">
              <h2 className="modal-heading">Create New Task</h2>
              <button
                className="heading-button"
                onClick={() => closeTaskBox(234)}
              >
                X
              </button>
            </div>
            <hr className="break-line" />
            <div className="modal-inner-content">
              <div>
                {TaskBoxError && (
                  <p className="ErrorMessage">{"=> " + TaskBoxError + " <="}</p>
                )}
              </div>
              <div className="inner-content-w-label">
                <label className="InputLabel">Task Title</label>
                <input
                  className="InputBox"
                  type="text"
                  placeholder="Enter Task Title"
                  value={newTaskData.title}
                  onChange={(e) =>
                    setNewTaskData({ ...newTaskData, title: e.target.value })
                  }
                />
              </div>
              <div className="inner-content-w-label">
                <label className="InputLabel">Task Comments</label>
                <input
                  className="InputBox"
                  type="text"
                  placeholder="Enter Task Comments"
                  value={newTaskData.comment}
                  onChange={(e) =>
                    setNewTaskData({ ...newTaskData, comment: e.target.value })
                  }
                />
              </div>
              <div className="inner-content-w-label">
                <label className="InputLabel">Task Due Date</label>
                <input
                  className="InputBox"
                  type="datetime-local"
                  placeholder="Enter Due Date"
                  value={newTaskData.dueDate}
                  onChange={(e) =>
                    setNewTaskData({ ...newTaskData, dueDate: e.target.value })
                  }
                />
              </div>
              <div className="inner-content-w-label">
                <label className="InputLabel">Task Status</label>
                <select
                  name="TaskStatus"
                  id="TaskStatus"
                  value={newTaskData.status}
                  onChange={(e) =>
                    setNewTaskData({ ...newTaskData, status: e.target.value })
                  }
                >
                  <option value="To-Be-Completed">To Be Completed</option>
                  <option value="OverDue">OverDue</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
              <button
                className="modal-button-taskclose"
                onClick={() => handleNewTaskSubmit()}
              >
                Create Task
              </button>
            </div>
          </div>
        </div>
      )}
      {TaskBox !== null && TaskBox !== 234 && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="headinglayout">
              <h2 className="modal-heading">Edit Task: #{TaskBox}</h2>
              <button
                className="heading-button"
                onClick={() => closeTaskBox(TaskBox)}
              >
                X
              </button>
            </div>
            <hr className="break-line" />
            <div className="modal-inner-content">
              <div>
                {TaskBoxError && (
                  <p className="ErrorMessage">{"=> " + TaskBoxError + " <="}</p>
                )}
              </div>
              <div className="inner-content-w-label">
                <label className="InputLabel">Task Status</label>
                <select
                  name="TaskStatus"
                  id="TaskStatus"
                  value={newTaskData.status}
                  onChange={(e) =>
                    setNewTaskData({ ...newTaskData, status: e.target.value })
                  }
                >
                  <option value="To-Be-Completed">To Be Completed</option>
                  <option value="OverDue">OverDue</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
              <button
                className="modal-button-taskclose"
                onClick={() => handleUpdateTask(TaskBox)}
              >
                Edit Task
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TasksPage;
