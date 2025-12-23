import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useUser } from '../../../contexts/UserContext';
import './Navbar.css';

const Navbar = () => {
  // Default to 'life' workspace
  const [workspace, setWorkspace] = useState(() => localStorage.getItem('activeWorkspace') || 'life');
  const { toggleGodMode, isGodMode } = useUser();

  useEffect(() => {
    document.body.setAttribute('data-workspace', workspace);
    localStorage.setItem('activeWorkspace', workspace);
  }, [workspace]);

  const toggleWorkspace = () => {
    setWorkspace(prev => prev === 'life' ? 'work' : 'life');
  };

  // Secret God Mode Trigger (Triple Click)
  const handleLogoClick = (e) => {
    if (e.detail === 3) {
      e.preventDefault();
      toggleGodMode();
    }
  };

  return (
    <nav className={`navbar ${isGodMode ? 'god-mode-active' : ''}`}>
      <div className="navbar-left">
        <div className="navbar-logo" onClick={handleLogoClick}>
          <NavLink to="/app">
            <img src="/logo.svg" alt="Life.io Logo" />
            <span>Life.io</span>
          </NavLink>
        </div>
        
        {/* Workspace Switcher */}
        <div className="workspace-toggle" onClick={toggleWorkspace} title="Switch Workspace">
          <div className={`toggle-track ${workspace}`}>
            <div className="toggle-thumb">
              {workspace === 'life' ? '🌱' : '💼'}
            </div>
          </div>
          <span className="toggle-label">{workspace === 'life' ? 'Life OS' : 'Work OS'}</span>
        </div>
      </div>

      <ul className="navbar-links">
        {workspace === 'work' ? (
          <>
            <li><NavLink to="/professional-hub" className="nav-work">Professional Hub</NavLink></li>
            <li><NavLink to="/creative" className="nav-work">Social Hub</NavLink></li>
          </>
        ) : (
          <>
            <li><NavLink to="/finance">Finance</NavLink></li>
            <li className="dropdown">
              <span className="dropbtn">Health & Fitness</span>
              <div className="dropdown-content">
                <NavLink to="/workout">Workout Tracker</NavLink>
                <NavLink to="/meal-planner">Meal Planner</NavLink>
              </div>
            </li>
            <li><NavLink to="/creative">Social Hub</NavLink></li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;
