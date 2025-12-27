import React, { useState, useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import { useUser } from '../../../hooks/useFinancialData';
import './Navbar.css';

const Navbar = () => {
    // Default to 'life' workspace
    const [workspace, setWorkspace] = useState(
        () => localStorage.getItem('activeWorkspace') || 'life'
    );
    const { toggleGodMode, isGodMode, user } = useUser();

    useEffect(() => {
        document.body.setAttribute('data-workspace', workspace);
        localStorage.setItem('activeWorkspace', workspace);
    }, [workspace]);

    const isInstalled = (toolId) => user?.installedTools?.includes(toolId);

    const toggleWorkspace = () => {
        setWorkspace((prev) => (prev === 'life' ? 'work' : 'life'));
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
                        <img src="/logo.svg" alt="Vantage Logo" />
                        <span style={{ fontFamily: 'monospace', letterSpacing: '2px' }}>VANTAGE</span>
                    </NavLink>
                </div>

                {/* Workspace Switcher */}
                <div
                    className="workspace-toggle"
                    onClick={toggleWorkspace}
                    title="Switch Workspace"
                >
                    <div className={`toggle-track ${workspace}`}>
                        <div className="toggle-thumb">{workspace === 'life' ? '🌱' : '💼'}</div>
                    </div>
                    <span className="toggle-label">
                        {workspace === 'life' ? 'Life OS' : 'Work OS'}
                    </span>
                </div>
            </div>

            <ul className="navbar-links">
                {workspace === 'work' ? (
                    <>
                        {isInstalled('professional') && (
                            <li>
                                <NavLink to="/app/professional-hub" className="nav-work">
                                    Professional Hub
                                </NavLink>
                            </li>
                        )}
                        {isInstalled('social') && (
                            <li>
                                <NavLink to="/app/business" className="nav-work">
                                    Business
                                </NavLink>
                            </li>
                        )}
                    </>
                ) : (
                    <>
                        {isInstalled('finance') && (
                            <li>
                                <NavLink to="/app/finance">Finance</NavLink>
                            </li>
                        )}
                        {(isInstalled('health') || isInstalled('life_admin')) && (
                            <li className="dropdown">
                                <span className="dropbtn">Personal</span>
                                <div className="dropdown-content">
                                    {isInstalled('health') && <NavLink to="/app/workout">Workout Tracker</NavLink>}
                                    {isInstalled('life_admin') && <NavLink to="/app/meal-planner">Meal Planner</NavLink>}
                                </div>
                            </li>
                        )}
                    </>
                )}
                {isInstalled('social') && (
                    <li>
                        <NavLink to="/app/creative">Creative Hub</NavLink>
                    </li>
                )}
                
                {/* System Links */}
                <li>
                    <NavLink to="/app/store" className="nav-store-link" title="Tool Store">
                        <span style={{ fontSize: '1.2rem' }}>➕</span>
                    </NavLink>
                </li>
                <li>
                    <NavLink to="/app/profile" className="nav-profile-link" title="User Profile">
                        <span style={{ fontSize: '1.2rem' }}>👤</span>
                    </NavLink>
                </li>
            </ul>
        </nav>
    );
};

export default Navbar;
