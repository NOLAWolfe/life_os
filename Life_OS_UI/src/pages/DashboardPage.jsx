import React from 'react';
import WidgetGrid from '../components/System/WidgetGrid/WidgetGrid';
import './DashboardPage.css';

const DashboardPage = () => {
    return (
        <div className="dashboard-container">
            <div className="dashboard-header">
                <h1 style={{ fontFamily: 'monospace', letterSpacing: '1px' }}>VANTAGE OS // DASHBOARD</h1>
                <p style={{ color: 'var(--text-secondary)' }}>
                    Your personal command center. Drag widgets to customize.
                </p>
            </div>
            <WidgetGrid />
        </div>
    );
};

export default DashboardPage;
