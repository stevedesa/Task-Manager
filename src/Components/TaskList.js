import React from "react";
import "./TaskList.css";
import Plus from "./plusicon.gif";
import Table from "react-bootstrap/Table";

function TaskList() {
  return (
    <div className="TaskList">
      <div className="EventManager">
        <button className="NewTask">
          <img src={Plus} alt="Plus" className="GifTag" />
          Create New Task
        </button>
        <div className="EventsStats">
          <div className="TasksLeft">
            <div className="Labels">
              <label className="TasksLabel">Tasks</label>
              <label className="TasksLabel">To Complete</label>
            </div>
            <h2 className="break">=></h2>
            <button className="TasksButton Left">12</button>
          </div>
          <div className="TasksLeft">
            <div className="Labels">
              <label className="TasksLabel">Upcoming</label>
              <label className="TasksLabel">Task Due</label>
            </div>
            <h2 className="break">=></h2>
            <button className="UpcomingTask">
              <label className="TasksLabel B">Task: </label>
              <label className="TasksLabel B">Due: </label>
            </button>
          </div>
          <div className="TasksLeft">
            <div className="Labels">
              <label className="TasksLabel">Tasks</label>
              <label className="TasksLabel">Completed</label>
            </div>
            <h2 className="break">=></h2>
            <button className="TasksButton Done">12</button>
          </div>
        </div>
      </div>
      <div className="TasksTable">
        <Table>
          <thead>
            <tr>
              <th>#</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Username</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>Mark</td>
              <td>Otto</td>
              <td>@mdo</td>
            </tr>
            <tr>
              <td>2</td>
              <td>Jacob</td>
              <td>Thornton</td>
              <td>@fat</td>
            </tr>
            <tr>
              <td>3</td>
              <td colSpan={2}>Larry the Bird</td>
              <td>@twitter</td>
            </tr>
          </tbody>
        </Table>
      </div>
      <div className="NotesSection"></div>
    </div>
  );
}

export default TaskList;
