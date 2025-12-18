import React from 'react';
import Calendar from '../components/Calendar/Calendar';
import BalancesWidget from '../components/BalancesWidget/BalancesWidget';
import ObsidianConnector from '../components/ObsidianConnector/ObsidianConnector';
import SmallWinWidget from '../components/SmallWinWidget/SmallWinWidget';
import './LandingPage.css';

const LandingPage = () => {
  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Your Daily Dashboard</h1>
        <p>A quick view of your life.</p>
      </div>
      <div className="dashboard-grid">
        <div className="dashboard-widget widget-calendar">
          <Calendar />
        </div>
        <div className="dashboard-widget widget-small-win">
          <SmallWinWidget />
        </div>
        <div className="dashboard-widget widget-balances">
          <BalancesWidget />
        </div>
        <div className="dashboard-widget widget-obsidian">
          <ObsidianConnector />
        </div>
        {/* Other widgets will go here */}
      </div>
    </div>
  );
};

export default LandingPage;
