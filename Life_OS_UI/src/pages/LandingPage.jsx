import React from "react";
import Calendar from "../components/LifeAdmin/Calendar/Calendar";
import BalancesWidget from "../components/Finance/BalancesWidget/BalancesWidget";
import ObsidianConnector from "../components/System/ObsidianConnector/ObsidianConnector";
import SmallWinWidget from "../components/Finance/SmallWinWidget/SmallWinWidget";
import WealthTargets from "../components/Finance/WealthTargets/WealthTargets";
import WealthMentor from "../components/Finance/WealthMentor/WealthMentor";
import DailyReads from "../components/LifeAdmin/DailyReads/DailyReads";
import ToDoTracker from "../components/LifeAdmin/TodoTracker/TodoTracker";
import "./LandingPage.css";

const LandingPage = () => {
  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Your Daily Dashboard</h1>
        <p>A quick view of your life.</p>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <WealthTargets />
          <WealthMentor />
        </div>
        <div>
          <DailyReads />
        </div>
        <div className="lg:row-span-2">
          <Calendar />
        </div>
        <div>
          <SmallWinWidget />
        </div>
        <div>
          <BalancesWidget />
        </div>
        <div className="lg:col-span-2">
          <ObsidianConnector />
        </div>
        <div className="lg:col-span-2">
          <ToDoTracker />
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
