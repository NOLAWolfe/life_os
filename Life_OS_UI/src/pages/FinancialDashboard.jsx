import React, { useState } from 'react';
import CsvUploader from '../components/CsvUploader/CsvUploader';
import BalancesWidget from '../components/BalancesWidget/BalancesWidget';
import SpendingTrends from '../components/SpendingTrends/SpendingTrends';
import BudgetVsActuals from '../components/BudgetVsActuals/BudgetVsActuals';
import DebtPayoffPlanner from '../components/DebtPayoffPlanner/DebtPayoffPlanner';
import LeakDetector from '../components/LeakDetector/LeakDetector';
import PaymentFlow from '../components/PaymentFlow/PaymentFlow';
import IncomeStreams from '../components/IncomeStreams/IncomeStreams';
import BankConnection from '../components/BankConnection/BankConnection';
import TransactionMapper from '../components/TransactionMapper/TransactionMapper';
import './FinancialDashboard.css';

const FinancialDashboard = () => {
    const [activeTab, setActiveTab] = useState('strategy');
    const [subTab, setSubTab] = useState('map'); // Default sub-tab

    // Reset sub-tab when main tab changes
    const handleMainTabChange = (tab) => {
        setActiveTab(tab);
        if (tab === 'strategy') setSubTab('map');
        if (tab === 'analytics') setSubTab('overview');
        if (tab === 'data') setSubTab('upload');
    };

    return (
        <div className="financial-dashboard">
            <header className="page-header mb-6">
                <h1>Financial Dashboard</h1>
                <p>Track your balances, spending, and debt payoff progress.</p>
            </header>

            {/* Main Dashboard Card Container */}
            <div className="dashboard-wrapper">
                {/* TIER 1 TABS (Main Sections) */}
                <div className="dashboard-tabs">
                    <button 
                        className={`tab-button ${activeTab === 'strategy' ? 'active' : ''}`}
                        onClick={() => handleMainTabChange('strategy')}
                    >
                        🗺️ Strategy & Planning
                    </button>
                    <button 
                        className={`tab-button ${activeTab === 'analytics' ? 'active' : ''}`}
                        onClick={() => handleMainTabChange('analytics')}
                    >
                        📊 Analytics & Trends
                    </button>
                    <button 
                        className={`tab-button ${activeTab === 'data' ? 'active' : ''}`}
                        onClick={() => handleMainTabChange('data')}
                    >
                        💾 Data Management
                    </button>
                </div>

                {/* TIER 2 TABS (Sub-sections) */}
                <div className="sub-tabs">
                    {activeTab === 'strategy' && (
                        <>
                            <button className={`sub-tab-button ${subTab === 'map' ? 'active' : ''}`} onClick={() => setSubTab('map')}>Visual Map</button>
                            <button className={`sub-tab-button ${subTab === 'plan' ? 'active' : ''}`} onClick={() => setSubTab('plan')}>Written Plan</button>
                            <button className={`sub-tab-button ${subTab === 'bills' ? 'active' : ''}`} onClick={() => setSubTab('bills')}>Bills List</button>
                        </>
                    )}
                    {activeTab === 'analytics' && (
                        <>
                            <button className={`sub-tab-button ${subTab === 'overview' ? 'active' : ''}`} onClick={() => setSubTab('overview')}>Overview</button>
                            <button className={`sub-tab-button ${subTab === 'income' ? 'active' : ''}`} onClick={() => setSubTab('income')}>Income</button>
                            <button className={`sub-tab-button ${subTab === 'spending' ? 'active' : ''}`} onClick={() => setSubTab('spending')}>Spending</button>
                            <button className={`sub-tab-button ${subTab === 'debt' ? 'active' : ''}`} onClick={() => setSubTab('debt')}>Debt & Leaks</button>
                        </>
                    )}
                    {activeTab === 'data' && (
                        <>
                            <button className={`sub-tab-button ${subTab === 'upload' ? 'active' : ''}`} onClick={() => setSubTab('upload')}>Upload Files</button>
                            <button className={`sub-tab-button ${subTab === 'connect' ? 'active' : ''}`} onClick={() => setSubTab('connect')}>Bank Connect</button>
                            <button className={`sub-tab-button ${subTab === 'mapper' ? 'active' : ''}`} onClick={() => setSubTab('mapper')}>🧙‍♂️ Sorting Hat</button>
                        </>
                    )}
                </div>

                {/* Content Areas */}
                <div className="dashboard-content">
                    
                    {/* STRATEGY VIEW */}
                    {activeTab === 'strategy' && (
                        <div className="h-full flex flex-col">
                            {/* Hero Section: The Strategy Map */}
                            <div className="w-full flex-1 min-h-[700px]">
                                <PaymentFlow viewMode={subTab} setViewMode={setSubTab} />
                            </div>
                        </div>
                    )}

                    {/* ANALYTICS VIEW */}
                    {activeTab === 'analytics' && (
                        <div className="space-y-8">
                            {subTab === 'overview' && (
                                <>
                                    {/* Top Row: Offense & Defense */}
                                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                                        <IncomeStreams />
                                        <SpendingTrends />
                                    </div>
                                    
                                    {/* Middle Row: Strategy Widgets (Moved here) */}
                                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                                        <LeakDetector />
                                        <DebtPayoffPlanner />
                                    </div>

                                    {/* Bottom Row: Details */}
                                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                                        <div className="xl:col-span-2">
                                            <BudgetVsActuals />
                                        </div>
                                        <div>
                                            <BalancesWidget />
                                        </div>
                                    </div>
                                </>
                            )}
                            {subTab === 'income' && (
                                <div className="xl:col-span-3">
                                    <IncomeStreams />
                                </div>
                            )}
                            {subTab === 'spending' && (
                                <div className="xl:col-span-3 space-y-8">
                                    <SpendingTrends />
                                    <BudgetVsActuals />
                                </div>
                            )}
                            {subTab === 'debt' && (
                                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                                    <LeakDetector />
                                    <DebtPayoffPlanner />
                                </div>
                            )}
                        </div>
                    )}

                    {/* DATA VIEW */}
                    {activeTab === 'data' && (
                        <div className="h-full">
                            {subTab === 'upload' && (
                                <div className="max-w-2xl mx-auto space-y-4">
                                    <h2 className="text-xl font-bold">Data Ingestion</h2>
                                    <div className="p-4 bg-[var(--bg-secondary)] rounded-lg text-sm text-[var(--text-secondary)] mb-4">
                                        <p>Upload your Tiller exports here to update the dashboard.</p>
                                    </div>
                                    <CsvUploader />
                                </div>
                            )}
                            {subTab === 'connect' && (
                                <div className="h-full flex items-center justify-center">
                                    <BankConnection />
                                </div>
                            )}
                            {subTab === 'mapper' && (
                                <div className="h-full">
                                    <TransactionMapper />
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default FinancialDashboard;
