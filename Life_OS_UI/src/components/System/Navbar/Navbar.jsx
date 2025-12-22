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
        <li><NavLink to="/professional-hub">Professional</NavLink></li>
        <li><NavLink to="/finance">Finance</NavLink></li>
        <li className="dropdown">
          <a href="#health" className="dropbtn">Health & Fitness</a>
          <div className="dropdown-content">
            <NavLink to="/workout">Workout Tracker</NavLink>
            <NavLink to="/meal-planner">Meal Planner</NavLink>
          </div>
        </li>
        <li><NavLink to="/creative">Creative</NavLink></li>
      </ul>
    </nav>
  );
};

export default Navbar;
