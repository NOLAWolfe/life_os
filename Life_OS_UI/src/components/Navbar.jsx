import React from 'react';
import { NavLink } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <NavLink to="/">
          <img src="/logo.svg" alt="Life.io Logo" />
          <span>Life.io</span>
        </NavLink>
      </div>
      <ul className="navbar-links">
        <li><NavLink to="/finance">Finance</NavLink></li>
        <li><NavLink to="/health">Health</NavLink></li>
        <li><NavLink to="/creative">Creative</NavLink></li>
      </ul>
    </nav>
  );
};

export default Navbar;
