import React from 'react';
import { Routes, Route, Navigate } from "react-router";
import { UserCircle } from "lucide-react";
import Map from './Map';
import NewShelters from './NewShelters';
import { Link } from 'react-router-dom';
import './styles.css';

export default function MainPage() {
  return (
    <div id="wd-mainpage">
      <nav className="navbar navbar-expand-lg navbar-light custom-bg">
        <div className="container position-relative">
          {/* Center navigation items */}
          <div className="navbar-nav position-absolute start-50 translate-middle-x flex-row">
            <Link className="nav-item nav-link mx-2 custom-nav-link" to="/shelterform">Shelter Form</Link>
            <Link className="nav-item nav-link mx-2 custom-nav-link" to="/map">Map</Link>
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
      
      <div>
        <Routes>
          <Route path="/" element={<Navigate to="/shelterform" />} />
          <Route path="/map" element={<Map />} />
          <Route path="/shelterform/*" element={<NewShelters />} />
          <Route path="/login" element={<Navigate to="/login" />} />
        </Routes>
      </div>
    </div>
  );
}