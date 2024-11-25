import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate, Link } from "react-router-dom";
import { UserCircle, PawPrint } from "lucide-react";
import Map from "./Map";
import Landing from "./Landing";
import SignIn from "./Signin/signin";
import SignUp from "./Signin/signup";
import Profile from "./Profile/index";
import AddPet from "./Profile/AddPet";
import PetSearch from "./PetDatabase";
import "./styles.css";
import SearchBar from "./NavBar";

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
        console.error("Error parsing user data:", e);
        localStorage.removeItem("currentUser");
      }
    }
  }, []);

  // Add this function to help with debugging
  const checkCurrentUser = () => {
    console.log("Current user:", currentUser);
    console.log("LocalStorage user:", localStorage.getItem("currentUser"));
  };

  const handleSignOut = () => {
    localStorage.removeItem("currentUser");
    setCurrentUser(null);
  };

  // For debugging purposes
  useEffect(() => {
    console.log("currentUser state updated:", currentUser);
  }, [currentUser]);

  return (
    <div id="wd-mainpage" className="min-vh-100 d-flex flex-column main-container">
      <div className="background-decorations">
        <div className="paw-pattern-overlay"></div>
      </div>
      
      <nav className="navbar navbar-expand navbar-light custom-bg">
        <div className="container position-relative">
          {/* Center Links - Using position-absolute for true center */}
          <div className="position-absolute start-50 translate-middle-x">
            <ul className="custom-nav navbar-nav fs-5 d-flex flex-row">
              <li className="nav-item">
                <Link className="nav-link mx-2 custom-nav-link" to="/home">
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link mx-2 custom-nav-link" to="/petdatabase">
                  Lost Pets
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link mx-2 custom-nav-link" to="/map">
                  Map
                </Link>
              </li>
            </ul>
          </div>
          {/* Right Side Menu */}
          <ul className="navbar-nav ms-auto">
            {currentUser ? (
              <>
                <li className="nav-item">
                  <span className="nav-link">
                    Welcome, {currentUser.firstName || currentUser.username}
                  </span>
                </li>
                <li className="nav-item">
                  <Link
                    className="nav-link d-flex align-items-center"
                    to="/profile"
                  >
                    <PawPrint size={20} className="me-1" />
                    Profile
                  </Link>
                </li>
                <li className="nav-item">
                  <button
                    onClick={handleSignOut}
                    className="btn btn-outline-primary ms-2"
                  >
                    Sign Out
                  </button>
                </li>
              </>
            ) : (
              <li className="nav-item">
                <Link
                  className="nav-link d-flex align-items-center"
                  to="/login"
                >
                  <UserCircle size={20} className="me-1" />
                  Sign in
                </Link>
              </li>
            )}
          </ul>
        </div>
      </nav>

      <div className="flex-grow-1 content-container">
        <Routes>
          <Route path="/" element={<Navigate to="/home" />} />
          <Route path="/map" element={<Map />} />
          <Route path="/home/*" element={<Landing />} />
          <Route path="/petdatabase" element={<PetSearch />} />
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
             <Route path="/add-pet" element={<AddPet />} />  
        </Routes>
      </div>
    </div>
  );
}
