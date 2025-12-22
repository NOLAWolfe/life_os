import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar/Navbar';
import { FinancialProvider } from './contexts/FinancialContext';
import './App.css';
import './pages/Page.css'; // Import shared page styles

// Lazy load pages
const LandingPage = lazy(() => import('./pages/LandingPage'));
const FinancialDashboard = lazy(() => import('./pages/FinancialDashboard'));
const WorkoutPage = lazy(() => import('./pages/WorkoutPage'));
const MealPlannerPage = lazy(() => import('./pages/MealPlannerPage'));
const CreativePage = lazy(() => import('./pages/CreativePage'));
const ProfessionalHubPage = lazy(() => import('./pages/ProfessionalHubPage'));

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

// Loading fallback
const PageLoader = () => (
  <div className="flex items-center justify-center h-[60vh]">
    <div className="text-lg font-medium text-[var(--text-secondary)] animate-pulse">Loading Life.io Module...</div>
  </div>
);

function App() {
  return (
    <FinancialProvider>
      <div className="App">
        <Navbar />
        <main className="main-content pt-20 pb-8 px-4 md:px-8 max-w-[1440px] mx-auto w-full box-border">
          <Suspense fallback={<PageLoader />}>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/professional-hub" element={<ProfessionalHubPage />} />
              <Route path="/workout" element={<WorkoutPage />} />
              <Route path="/meal-planner" element={<MealPlannerPage />} />
              <Route path="/finance" element={<FinancialDashboard />} />
              <Route path="/health" element={<PlaceholderPage title="Health Hub" />} />
              <Route path="/creative" element={<CreativePage />} />
            </Routes>
          </Suspense>
        </main>
      </div>
    </FinancialProvider>
  );
}

export default App;