import { useState } from "react";

//Navigate component redirects users to the right place 
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";


import Ducks from "./Ducks";
import Login from "./Login";
import MyProfile from "./MyProfile";
import Register from "./Register";
import ProtectedRoute from "./ProtectedRoute";
import * as auth from '../utils/auth';
import "./styles/App.css";


function App() {
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
            <MyProfile />
          </ProtectedRoute>
        }
      />
      <Route path="/ducks" element={<Ducks />} />
      <Route path="/my-profile" element={<MyProfile />} />
      <Route
        path="/login"
        element={
          <div className="loginContainer">
            <Login />
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
