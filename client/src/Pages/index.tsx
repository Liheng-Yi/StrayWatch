import React, { useEffect } from "react";
import { Routes, Route, Navigate, Link } from "react-router-dom";
import { UserCircle, PawPrint } from "lucide-react";
import { useAppSelector, useAppDispatch } from "../store/hooks";
import Map from "./Map";
import Landing from "./Landing";
import SignIn from "./NavBar/Signin/signin";
import SignUp from "./NavBar/Signin/signup";
import Profile from "./NavBar/Profile/index";
import AddPet from "./NavBar/Profile/AddPet";
import PetSearch from "./PetDatabase";
import Shelter from "./Shelter";
import "./styles.css";
import { logout } from "./NavBar/Signin/reducer";

export default function MainPage() {
  const currentUser = useAppSelector((state) => state.user.currentUser);
  const dispatch = useAppDispatch();
  console.log("--currentUser", currentUser);
  const handleSignOut = () => {
    dispatch(logout());
    localStorage.removeItem("currentUser");
    window.location.href = "/home";
  };

  return (
    <div
      id="wd-mainpage"
      className="min-vh-100 d-flex flex-column main-container"
    >
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
                <Link
                  className="nav-link mx-2 custom-nav-link"
                  to="/petdatabase"
                >
                  Lost Pets
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link mx-2 custom-nav-link" to="/map">
                  Nearby Shelters
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link mx-2 custom-nav-link" to="/shelter">
                  Shelters
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
                    Welcome, {currentUser.username}
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
          <Route path="/shelter" element={<Shelter />} />
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
          <Route path="/profile/:userId" element={<Profile />} />
          <Route path="/add-pet" element={<AddPet />} />
        </Routes>
      </div>
    </div>
  );
}
