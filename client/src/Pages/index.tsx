import React from 'react';
import { Routes, Route, Navigate } from "react-router";
import Map from './Map';
import NewShelters from './NewShelters';
import { Link } from 'react-router-dom';
import './styles.css';

export default function MainPage() {
  return (
    <div id="wd-mainpage">
      <nav className="navbar navbar-expand-lg navbar-light custom-bg">
        <div className="container">
          <div className="navbar-nav mx-auto flex-row">
            <Link className="nav-item nav-link mx-2 custom-nav-link" to="/shelterform">Shelter Form</Link>
            <Link className="nav-item nav-link mx-2 custom-nav-link" to="/map">Map</Link>
          </div>
        </div>
      </nav>
      <div>
        <Routes>
          <Route path="/" element={<Navigate to="/newshelters" />} />
          <Route path="/map" element={<Map />} />
          <Route path="/shelterform" element={<NewShelters />} />
        </Routes>
      </div>
    </div>
  );
}
