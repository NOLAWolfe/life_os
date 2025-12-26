import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/System/Navbar/Navbar';
import { FinancialProvider } from './contexts/FinancialContext';
import { UserProvider } from './contexts/UserContext';
import './App.css';
import './pages/Page.css'; // Import shared page styles
import HottestDollarBar from './components/Finance/HottestDollarBar/HottestDollarBar';

// Lazy load pages
const LandingPage = lazy(() => import('./pages/LandingPage'));
const DashboardPage = lazy(() => import('./pages/DashboardPage')); // Renamed from LandingPage
const FinancialDashboard = lazy(() => import('./pages/FinancialDashboard'));
const WorkoutPage = lazy(() => import('./pages/WorkoutPage'));
const MealPlannerPage = lazy(() => import('./pages/MealPlannerPage'));
const CreativePage = lazy(() => import('./pages/CreativePage'));
const ProfessionalHubPage = lazy(() => import('./pages/ProfessionalHubPage'));
const BusinessHubPage = lazy(() => import('./pages/BusinessHubPage'));
const ToolStorePage = lazy(() => import('./pages/ToolStorePage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));

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
        <div className="text-lg font-medium text--text-secondary animate-pulse">
            Loading Vantage OS Module...
        </div>
    </div>
);

// Layout wrapper for authenticated app routes
const AppLayout = ({ children }) => (
    <>
        <Navbar />
        <main className="main-content pt-20 pb-8 px-4 md:px-8 max-w-360 mx-auto w-full box-border">
            {children}
        </main>
    </>
);

function App() {
    return (
        <UserProvider>
            <FinancialProvider>
                <div className="App">
                    <Suspense fallback={<PageLoader />}>
                        <Routes>
                            {/* Public Route */}
                            <Route path="/" element={<LandingPage />} />

                            {/* Private App Routes (Nested under /app for clearer separation) */}
                            <Route
                                path="/app"
                                element={
                                    <AppLayout>
                                        <DashboardPage />
                                    </AppLayout>
                                }
                            />
                            <Route
                                path="/app/finance"
                                element={
                                    <AppLayout>
                                        <FinancialDashboard />
                                    </AppLayout>
                                }
                            />
                            <Route
                                path="/app/professional-hub"
                                element={
                                    <AppLayout>
                                        <ProfessionalHubPage />
                                    </AppLayout>
                                }
                            />
                            <Route
                                path="/app/workout"
                                element={
                                    <AppLayout>
                                        <WorkoutPage />
                                    </AppLayout>
                                }
                            />
                            <Route
                                path="/app/meal-planner"
                                element={
                                    <AppLayout>
                                        <MealPlannerPage />
                                    </AppLayout>
                                }
                            />
                            <Route
                                path="/app/creative"
                                element={
                                    <AppLayout>
                                        <CreativePage />
                                    </AppLayout>
                                }
                            />
                            <Route
                                path="/app/business"
                                element={
                                    <AppLayout>
                                        <BusinessHubPage />
                                    </AppLayout>
                                }
                            />
                            <Route
                                path="/app/store"
                                element={
                                    <AppLayout>
                                        <ToolStorePage />
                                    </AppLayout>
                                }
                            />
                            <Route
                                path="/app/profile"
                                element={
                                    <AppLayout>
                                        <ProfilePage />
                                    </AppLayout>
                                }
                            />
                            <Route
                                path="/app/health"
                                element={
                                    <AppLayout>
                                        <PlaceholderPage title="Health Hub" />
                                    </AppLayout>
                                }
                            />

                            {/* Legacy Redirects (Handle old bookmarks) */}
                            <Route
                                path="/finance"
                                element={<Navigate to="/app/finance" replace />}
                            />
                            <Route
                                path="/professional-hub"
                                element={<Navigate to="/app/professional-hub" replace />}
                            />
                            <Route
                                path="/app/dj-world"
                                element={<Navigate to="/app/business" replace />}
                            />
                        </Routes>
                    </Suspense>
                </div>
            </FinancialProvider>
        </UserProvider>
    );
}

export default App;
