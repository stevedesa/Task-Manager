import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";
import ToDoList from "./list.png";
import WP from "./wp.jpg";
import TasksPage from "./Components/TasksPage";

function App() {
  const [loginSignupBox, setLoginSignupBox] = useState(null);
  const [loginSignupResponse, setLoginSignupResponse] = useState(null);
  const [loginSignupError, setLoginSignupError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");

  useEffect(() => {
    const checkLoginStatus = () => {
      axios
        .get("http://localhost:5001/checkLoginStatus")
        .then((response) => {
          console.log(response.data);
          if (response.data) {
            setIsLoggedIn(true);
            setUsername(response.data);
          } else {
            setIsLoggedIn(false);
            setUsername("");
          }
        })
        .catch((error) => {
          console.error("Error checking login status: ", error);
        });
    };

    checkLoginStatus();
  }, []);

  const openLoginSignup = (index) => {
    setLoginSignupBox(index);
  };

  const closeLoginSignup = () => {
    setLoginSignupBox(null);
    setLoginSignupResponse(null);
    setLoginSignupError(null);
  };

  const [signupData, setSignupData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const handleSignup = () => {
    axios
      .post("http://localhost:5001/signup", signupData)
      .then((response) => {
        setLoginSignupResponse(response.data);
        setLoginSignupError(null);
        closeLoginSignup();
      })
      .catch((error) => {
        setLoginSignupResponse(null);
        setLoginSignupError(
          error.response ? error.response.data : "Network Error"
        );
      });
  };

  const handleLogin = () => {
    axios
      .post("http://localhost:5001/login", loginData)
      .then((response) => {
        setLoginSignupResponse(response.data.message);
        setLoginSignupError(null);
        setIsLoggedIn(true);
        setUsername(loginData.email);
        closeLoginSignup();
      })
      .catch((error) => {
        setLoginSignupResponse(null);
        setLoginSignupError(
          error.response ? error.response.data : "Network Error"
        );
      });
  };

  const handleLogout = () => {
    axios
      .post("http://localhost:5001/logout")
      .then(() => {
        setUsername(null);
        setIsLoggedIn(false);
      })
      .catch((error) => {
        console.error("Error logging out: ", error);
      });
  };

  return (
    <div className="AppPage">
      <div className={`NavBar ${isLoggedIn ? "Y" : "N"}`}>
        <div className="LeftContent">
          <img className="ToDoLogo" src={ToDoList} alt="Logo" />
          <h2 className="TitleName">To-Do List Manager</h2>
        </div>
        <div className="RightContent">
          {isLoggedIn ? (
            <>
              <button className="UserTag">{username}</button>
              <button className="Logout Button" onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <button
                className="Login Button"
                onClick={() => openLoginSignup(123)}
              >
                Login
              </button>
              <button
                className="Register Button"
                onClick={() => openLoginSignup(321)}
              >
                Register
              </button>
            </>
          )}
        </div>
        {loginSignupBox === 123 && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="headinglayout">
                <h2 className="modal-heading">Login</h2>
                <button
                  className="heading-button"
                  onClick={() => closeLoginSignup(123)}
                >
                  X
                </button>
              </div>

              <hr className="break-line" />
              <div className="modal-inner-content">
                <div>
                  {loginSignupResponse && <p>{loginSignupResponse}</p>}
                  {loginSignupError && (
                    <p className="ErrorMessage">
                      {"=> " + loginSignupError + " <="}
                    </p>
                  )}
                </div>
                <div className="inner-content-w-label">
                  <label className="InputLabel">Email</label>
                  <input
                    className="InputBox"
                    type="email"
                    placeholder="Enter Email ID"
                    value={loginData.email}
                    onChange={(e) =>
                      setLoginData({ ...loginData, email: e.target.value })
                    }
                  />
                </div>
                <div className="inner-content-w-label">
                  <label className="InputLabel">Password</label>
                  <input
                    className="InputBox"
                    type="password"
                    placeholder="Enter Password"
                    value={loginData.password}
                    onChange={(e) =>
                      setLoginData({ ...loginData, password: e.target.value })
                    }
                  />
                </div>
                <button className="modal-button" onClick={handleLogin}>
                  Login
                </button>
              </div>
            </div>
          </div>
        )}
        {loginSignupBox === 321 && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="headinglayout">
                <h2 className="modal-heading">Register</h2>
                <button
                  className="heading-button"
                  onClick={() => closeLoginSignup(321)}
                >
                  X
                </button>
              </div>

              <hr className="break-line" />
              <div className="modal-inner-content">
                <div>
                  {loginSignupResponse && <p>{loginSignupResponse}</p>}
                  {loginSignupError && (
                    <p className="ErrorMessage">
                      {"=> " + loginSignupError + " <="}
                    </p>
                  )}
                </div>
                <div className="inner-content-w-label">
                  <label className="InputLabel">Username</label>
                  <input
                    className="InputBox"
                    type="text"
                    placeholder="Enter Username"
                    value={signupData.username}
                    onChange={(e) =>
                      setSignupData({ ...signupData, username: e.target.value })
                    }
                  />
                </div>
                <div className="inner-content-w-label">
                  <label className="InputLabel">Email</label>
                  <input
                    className="InputBox"
                    type="email"
                    placeholder="Enter Email ID"
                    value={signupData.email}
                    onChange={(e) =>
                      setSignupData({ ...signupData, email: e.target.value })
                    }
                  />
                </div>
                <div className="inner-content-w-label">
                  <label className="InputLabel">Password</label>
                  <input
                    className="InputBox"
                    type="password"
                    placeholder="Enter Password"
                    value={signupData.password}
                    onChange={(e) =>
                      setSignupData({ ...signupData, password: e.target.value })
                    }
                  />
                </div>
                <button className="modal-button" onClick={handleSignup}>
                  Register
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="TaskListDiv">{isLoggedIn && <TasksPage />}</div>
      {!isLoggedIn && (
        <div className="ImageDiv">
          <img src={WP} className="WP" alt="Task Manager" />
        </div>
      )}
    </div>
  );
}

export default App;
