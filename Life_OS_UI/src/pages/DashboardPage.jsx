import React from 'react';
import WidgetGrid from '../components/System/WidgetGrid/WidgetGrid';
import './DashboardPage.css';

const DashboardPage = () => {
    return (
        <div className="dashboard-container">
            <div className="dashboard-header flex justify-between items-center">
                <div>
                    <h1 style={{ fontFamily: 'monospace', letterSpacing: '1px' }}>VANTAGE OS // DASHBOARD</h1>
                    <p style={{ color: 'var(--text-secondary)' }}>
                        Your personal command center.
                    </p>
                </div>
                <button 
                    className="btn-secondary" 
                    onClick={() => window.location.href = '/app/store'}
                >
                    ⚙️ Configure
                </button>
            </div>
            <WidgetGrid />
        </div>
    );
};

export default DashboardPage;
