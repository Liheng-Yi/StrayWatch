import React from "react";
import { Routes, Route, Navigate } from "react-router";
import { UserCircle } from "lucide-react";
import Map from "./Map";
import Landing from "./Landing";
import { Link } from "react-router-dom";
import SignIn from "./Signin/signin";
import SignUp from "./Signin/signup";
import "./styles.css";
import Profile  from "./Profile";
import { Sign } from "crypto";

export default function MainPage() {
  return (
    <div id="wd-mainpage" className="main-page-bg flex flex-col">
      <nav className="navbar navbar-expand-lg custom-bg">
        <div className="container position-relative">
          {/* Center navigation items */}
          <div className="navbar-nav position-absolute start-50 translate-middle-x flex-row">
            <Link
              className="nav-item nav-link mx-2 custom-nav-link"
              to="/home"
            >
              Shelter Form
            </Link>
            <Link className="nav-item nav-link mx-2 custom-nav-link" to="/map">
              Map
            </Link>
          </div>

          {/* Right side login link */}
          <div className="navbar-nav ms-auto flex-row">
            <Link
              className="nav-item nav-link mx-2 custom-nav-link flex items-center"
              to="/login"
            >
              <UserCircle className="w-6 h-6 mr-1" />
              <span>Sign in</span>
            </Link>
          </div>
        </div>
      </nav>

      <div className="flex-1 ">
        <Routes>
          <Route path="/" element={<Navigate to="/home" />} />
          <Route path="/map" element={<Map />} />
          <Route path="/home/*" element={<Landing />} />
          <Route path="/login" element={<SignIn />} />
          <Route path="/profile" element={<Profile/>}/>
          <Route path="/signup" element={<SignUp />} />{" "}
          {/* Route for SignUp component */}
        </Routes>
      </div>
    </div>
  );
}
