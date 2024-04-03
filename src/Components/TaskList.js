import React, { useState } from "react";
import "./TaskList.css";
import Plus from "./plusicon.gif";

function TaskList() {
  const [noteText, setNoteText] = useState("");

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
            <h2 className="break">{"=>"}</h2>
            <button className="TasksButton Left">1</button>
          </div>
          <div className="TasksLeft">
            <div className="Labels">
              <label className="TasksLabel">Tasks</label>
              <label className="TasksLabel">OverDue</label>
            </div>
            <h2 className="break">{"=>"}</h2>
            <button className="TasksButton Over">1</button>
          </div>
          <div className="TasksLeft">
            <div className="Labels">
              <label className="TasksLabel">Tasks</label>
              <label className="TasksLabel">Completed</label>
            </div>
            <h2 className="break">{"=>"}</h2>
            <button className="TasksButton Done">1</button>
          </div>
          <div className="TasksLeft">
            <div className="Labels">
              <label className="TasksLabel">Upcoming</label>
              <label className="TasksLabel">Task</label>
            </div>
            <h2 className="break">{"=>"}</h2>
            <button className="UpcomingTask">
              <label className="TasksLabel C">Task {"->"} </label>
              <label className="TasksLabel B">Database Quiz</label>
              <label className="TasksLabel A">{"|"}</label>
              <label className="TasksLabel C">Due {"->"} </label>
              <label className="TasksLabel B">10 April 2024 : 10:30 PM</label>
            </button>
          </div>
        </div>
      </div>
      <div className="TableDiv">
        <h2 className="TasksTag">
          {"-> "}To-Do List{" <-"}
        </h2>
        <div className="TasksTable">
          <div className="TableEntry TOpen">
            <div className="TLeftContent">
              <button className="EventStatus Open">O</button>
              <button className="EventName Open">Database Quiz</button>
              <button className="EventName Open">
                Due {"->"} 8 April 2024 | 12:00 PM
              </button>
              <button className="EventName Open">
                Topics: Chapters 1, 2, and 3
              </button>
            </div>
            <button className="EditButton">Edit</button>
          </div>
          <div className="TableEntry TOverDue">
            <div className="TLeftContent">
              <button className="EventStatus OverDue">!</button>
              <button className="EventName OverDue">Stats Quiz</button>
              <button className="EventName OverDue">
                Due {"->"} 4 April 2024 | 11:00 AM
              </button>
              <button className="EventName OverDue">
                Topics: Chapters 4, 5, and 6
              </button>
            </div>
            <button className="EditButton">Edit</button>
          </div>
          <div className="TableEntry TClosed">
            <div className="TLeftContent">
              <button className="EventStatus Closed">X</button>
              <button className="EventName Closed">
                Software Engineering Quiz
              </button>
              <button className="EventName Closed">
                Due {"->"} 2 April 2024 | 8:00 AM
              </button>
              <button className="EventName Closed">
                Topics: Chapters 7, 8, and 9
              </button>
            </div>
            <button className="EditButton">Edit</button>
          </div>
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
          onChange={(e) => setNoteText(e.target.value)}
        ></textarea>
      </div>
    </div>
  );
}

export default TaskList;
