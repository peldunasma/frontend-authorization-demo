import { useState, useEffect } from "react";

//Navigate component redirects users to the right place 
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";

import Ducks from "./Ducks";
import Login from "./Login";
import MyProfile from "./MyProfile";
import Register from "./Register";
import ProtectedRoute from "./ProtectedRoute";
import * as auth from '../utils/auth';
import * as api from "../utils/api";
import { setToken, getToken } from "../utils/token";
import "./styles/App.css";


function App() {
  const [userData, setUserData] = useState({ username: "", email: "" });
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const navigate = useNavigate();

  const handleRegistration = ({
    username,
    email,
    password,
    confirmPassword,
  }) => {
    if (password === confirmPassword) {
      auth.register(username, password, email)
       .then(() => {
          // Navigate user to login page.
          navigate("/login");
        })
        .catch(console.error);
    }
  };

  // handleLogin accepts one parameter: an object with two properties.
const handleLogin = ({ username, password }) => {
  if (!username || !password) {
    return;
  }    
  // We pass the username and password as positional arguments. The 
 // authorize function is set up to rename `username` to `identifier`  
 // before sending a request to the server, because that is what the
 // API is expecting.
 auth
 .authorize(username, password)
   .then((data) => {
    // Verify that a jwt is included before logging the user in.
    if (data.jwt) {
      setToken(data.jwt);
      setUserData(data.user);  // save user's data to state
      setIsLoggedIn(true);    // log the user in
      navigate("/ducks");    // send them to /ducks
    }   
   })
   .catch(console.error);
};

useEffect(() => {
  const jwt = getToken();

  if (!jwt) {
    return;
  }

  api
    .getUserInfo(jwt)
    .then(({ username, email }) => {
      // If the response is successful, log the user in, save their
      // data to state, and navigate them to /ducks.
      setIsLoggedIn(true);
      setUserData({ username, email });
      navigate("/ducks");
    })
    .catch(console.error);
}, []);

  return (
    <Routes>
      {/* Wrap Ducks in ProtectedRoute and pass isLoggedIn as a prop. */}
      <Route
        path="/ducks"
        element={
          <ProtectedRoute isLoggedIn={isLoggedIn}>
            <Ducks />
          </ProtectedRoute>
        }
      />

      {/* Wrap MyProfile in ProtectedRoute and pass isLoggedIn as a prop. */}
      <Route
        path="/my-profile"
        element={
          <ProtectedRoute isLoggedIn={isLoggedIn}>
            <MyProfile userData={userData} />
          </ProtectedRoute>
        }
      />
      <Route path="/ducks" element={<Ducks />} />
      <Route path="/my-profile" element={<MyProfile />} />
      <Route
        path="/login"
        element={
          <div className="loginContainer">
            <Login handleLogin={handleLogin} />
          </div>
        }
      />
      <Route
        path="/register"
        element={
          <div className="registerContainer">
            <Register handleRegistration={handleRegistration} />
          </div>
        }
      />
      <Route
        path="*" //adding * to the path attribute catches all the routes that haven't been specified already
        element={
          isLoggedIn ? (
            <Navigate to="/ducks" replace />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
    </Routes>
  );
}

export default App;
