import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate, Link } from "react-router-dom";
import { UserCircle, PawPrint } from "lucide-react";
import Map from "./Map";
import Landing from "./Landing";
import SignIn from "./Signin/signin";
import SignUp from "./Signin/signup";
import Profile from "./Profile/index";
import "./styles.css";

export default function MainPage() {
  const [currentUser, setCurrentUser] = useState<any>(null);

  useEffect(() => {
    // Check for user in localStorage when component mounts
    const userStr = localStorage.getItem("currentUser");
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        setCurrentUser(user);
      } catch (e) {
        localStorage.removeItem("currentUser");
      }
    }
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem("currentUser");
    setCurrentUser(null);
    window.location.reload();
  };

  return (
    <div id="wd-mainpage" className="main-page-bg flex flex-col">
      <nav className="navbar navbar-expand-lg custom-bg">
        <div className="container position-relative">
          {/* Center navigation items */}
          <div className="navbar-nav position-absolute start-50 translate-middle-x flex-row">
            <Link className="nav-item nav-link mx-2 custom-nav-link" to="/home">
              Home
            </Link>
            <Link className="nav-item nav-link mx-2 custom-nav-link" to="/map">
              Map
            </Link>
          </div>

          {/* Right side user menu */}
          <div className="navbar-nav ms-auto flex-row">
            {currentUser ? (
              <>
                <div className="d-flex align-items-center">
                  <span className="nav-item nav-link mx-2">
                    Welcome, {currentUser.firstName}
                  </span>
                  <Link
                    className="nav-item nav-link mx-2 custom-nav-link flex items-center"
                    to="/profile"
                  >
                    <PawPrint className="w-6 h-6 mr-1" />
                    <span>Profile</span>
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="btn btn-outline-primary mx-2"
                  >
                    Sign Out
                  </button>
                </div>
              </>
            ) : (
              <Link
                className="nav-item nav-link mx-2 custom-nav-link flex items-center"
                to="/login"
              >
                <UserCircle className="w-6 h-6 mr-1" />
                <span>Sign in</span>
              </Link>
            )}
          </div>
        </div>
      </nav>

      <div className="flex-1">
        <Routes>
          <Route path="/" element={<Navigate to="/home" />} />
          <Route path="/map" element={<Map />} />
          <Route path="/home/*" element={<Landing />} />
          <Route
            path="/login"
            element={currentUser ? <Navigate to="/" /> : <SignIn />}
          />
          <Route
            path="/signup"
            element={currentUser ? <Navigate to="/" /> : <SignUp />}
          />
          <Route
            path="/profile"
            element={currentUser ? <Profile /> : <Navigate to="/login" />}
          />
        </Routes>
      </div>
    </div>
  );
}
