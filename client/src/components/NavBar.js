import React from 'react';
import { Link } from 'react-router-dom';

const NavBar = () => {
  return (
    <nav>
      <ul>
        <li><Link to="/">Main Page</Link></li>
        <li><Link to="/search">Search Page</Link></li>
      </ul>
    </nav>
  );
};

export default NavBar;