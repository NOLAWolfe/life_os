import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import FinancialDashboard from './pages/FinancialDashboard';
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
    <div className="App">
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/finance" element={<FinancialDashboard />} />
          <Route path="/health" element={<PlaceholderPage title="Health Hub" />} />
          <Route path="/creative" element={<PlaceholderPage title="Creative & Social" />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;