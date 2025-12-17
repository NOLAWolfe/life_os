import React from 'react';
import TodoTracker from '../components/TodoTracker';
import KateTodoList from '../components/KateTodoList';
import './Page.css';

const LandingPage = () => {
  return (
    <div className="page-container">
      <div className="landing-header">
        <h1>Welcome to Life.io</h1>
        <p>Your personal and professional life assistant, built by you, for you.</p>
      </div>
      <KateTodoList />
      <TodoTracker />
    </div>
  );
};

export default LandingPage;
