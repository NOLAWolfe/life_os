import React from 'react';
import CsvUploader from '../components/CsvUploader/CsvUploader';
import BalancesWidget from '../components/BalancesWidget/BalancesWidget';
import SpendingTrends from '../components/SpendingTrends/SpendingTrends';
import BudgetVsActuals from '../components/BudgetVsActuals/BudgetVsActuals';
import DebtPayoffPlanner from '../components/DebtPayoffPlanner/DebtPayoffPlanner';
import './FinancialDashboard.css';

const FinancialDashboard = () => {
    return (
        <div className="financial-dashboard">
            <header className="page-header">
                <h1>Financial Dashboard</h1>
                <p>Track your balances, spending, and debt payoff progress.</p>
            </header>

            <div className="dashboard-grid">
                <div className="grid-main">
                    <section className="dashboard-section">
                        <DebtPayoffPlanner />
                    </section>
                    <section className="dashboard-section">
                        <SpendingTrends />
                    </section>
                    <section className="dashboard-section">
                        <BudgetVsActuals />
                    </section>
                </div>
                <div className="grid-sidebar">
                    <section className="dashboard-section">
                        <CsvUploader />
                    </section>
                    <section className="dashboard-section">
                        <BalancesWidget />
                    </section>
                </div>
            </div>
        </div>
    );
};


export default FinancialDashboard;
