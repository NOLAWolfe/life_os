import React from 'react';
import TodoTracker from '../components/TodoTracker';
import './Page.css';

const LandingPage = () => {
  return (
    <div className="page-container">
      <div className="landing-header">
        <h1>Welcome to Life.io</h1>
        <p>Your personal and professional life assistant, built by you, for you.</p>
      </div>
      <TodoTracker />
    </div>
  );
};

export default LandingPage;
