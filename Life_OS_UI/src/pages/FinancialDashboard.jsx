import React, { useState, Suspense, lazy } from 'react';
import './FinancialDashboard.css';

// Lazy load widgets
const BalancesWidget = lazy(() => import('../components/Finance/BalancesWidget/BalancesWidget'));
const SpendingTrends = lazy(() => import('../components/Finance/SpendingTrends/SpendingTrends'));
const BudgetVsActuals = lazy(() => import('../components/Finance/BudgetVsActuals/BudgetVsActuals'));
const DebtPayoffPlanner = lazy(() => import('../components/Finance/DebtPayoffPlanner/DebtPayoffPlanner'));
const LeakDetector = lazy(() => import('../components/Finance/LeakDetector/LeakDetector'));
const PaymentFlow = lazy(() => import('../components/Finance/PaymentFlow/PaymentFlow'));
const IncomeStreams = lazy(() => import('../components/Finance/IncomeStreams/IncomeStreams'));
const BankConnection = lazy(() => import('../components/Finance/BankConnection/BankConnection'));
const TransactionMapper = lazy(() => import('../components/Finance/TransactionMapper/TransactionMapper'));
const DataDebugger = lazy(() => import('../components/System/DataDebugger/DataDebugger'));

// Loading fallback for widgets
const WidgetLoader = () => (
    <div className="flex items-center justify-center min-h-[200px] w-full bg-[var(--bg-secondary)] rounded-lg border border-[var(--border-color)]">
        <div className="text-sm text-[var(--text-secondary)] animate-pulse">Initializing Widget...</div>
    </div>
);

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
                            <button className={`sub-tab-button ${subTab === 'debug' ? 'active' : ''}`} onClick={() => setSubTab('debug')}>🕵️ Data Debugger</button>
                        </>
                    )}
                </div>

                {/* Content Areas */}
                <div className="dashboard-content">
                    <Suspense fallback={<WidgetLoader />}>
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
                                        <h2 className="text-xl font-bold text-orange-400">Sync Management</h2>
                                        <div className="p-6 bg-[var(--bg-secondary)] rounded-lg border border-[var(--border-color)]">
                                            <p className="mb-4 text-sm text-[var(--text-secondary)]">
                                                Direct CSV uploads have been deprecated in favor of the **Tiller Live Sync Engine**. 
                                            </p>
                                            <p className="text-sm text-[var(--text-secondary)]">
                                                Use the **Bank Connect** tab to configure your live feed, or trigger a manual sync via the CLI.
                                            </p>
                                        </div>
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
                                {subTab === 'debug' && (
                                    <div className="h-full">
                                        <DataDebugger />
                                    </div>
                                )}
                            </div>
                        )}
                    </Suspense>
                </div>
            </div>
        </div>
    );
};

export default FinancialDashboard;
