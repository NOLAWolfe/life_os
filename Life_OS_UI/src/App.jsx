import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import LandingPage from './pages/LandingPage';
import FinancialDashboard from './pages/FinancialDashboard';
import WorkoutPage from './pages/WorkoutPage';
import MealPlannerPage from './pages/MealPlannerPage';
import CreativePage from './pages/CreativePage';
import ProfessionalHubPage from './pages/ProfessionalHubPage';
import { FinancialProvider } from './contexts/FinancialContext';
import './App.css';
import './pages/Page.css'; // Import shared page styles

// Placeholder component for pages we haven't built yet
const PlaceholderPage = ({ title }) => (
  <div className="page-container">
    <header>
        <h1>{title}</h1>
    </header>
    <main>
        <p>This page is under construction.</p>
    </main>
  </div>
);

function App() {
  return (
    <FinancialProvider>
      <div className="App">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/professional-hub" element={<ProfessionalHubPage />} />
            <Route path="/workout" element={<WorkoutPage />} />
            <Route path="/meal-planner" element={<MealPlannerPage />} />
            <Route path="/finance" element={<FinancialDashboard />} />
            <Route path="/health" element={<PlaceholderPage title="Health Hub" />} />
            <Route path="/creative" element={<CreativePage />} />
          </Routes>
        </main>
      </div>
    </FinancialProvider>
  );
}

export default App;