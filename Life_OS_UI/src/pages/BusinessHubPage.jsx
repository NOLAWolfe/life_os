import React, { useState } from 'react';
import SetlistCritic from '../components/SocialHub/SetlistCritic/SetlistCritic';
import ClientManager from '../components/SocialHub/ClientManager/ClientManager';
import InvoiceManager from '../components/SocialHub/InvoiceManager/InvoiceManager';
import BarManager from '../components/SocialHub/BarManager/BarManager';
import '../pages/Page.css';

const BusinessHubPage = () => {
    const [activeTab, setActiveTab] = useState('ops'); // 'ops' or 'music'

    return (
        <div className="page-container">
            <header className="page-header mb-6 flex justify-between items-end">
                <div>
                    <h1>💼 Business Hub</h1>
                    <p>Enterprise Resource Planning: Invoices, CRM, and Forecasting.</p>
                </div>
                
                {/* Module Toggles */}
                <div className="flex bg-gray-800 p-1 rounded-lg border border-gray-700">
                    <button 
                        onClick={() => setActiveTab('ops')}
                        className={`px-4 py-2 text-sm font-bold rounded-md transition-all ${
                            activeTab === 'ops' 
                                ? 'bg-blue-600 text-white shadow-lg' 
                                : 'text-gray-400 hover:text-white'
                        }`}
                    >
                        Operations
                    </button>
                    <button 
                        onClick={() => setActiveTab('music')}
                        className={`px-4 py-2 text-sm font-bold rounded-md transition-all ${
                            activeTab === 'music' 
                                ? 'bg-purple-600 text-white shadow-lg' 
                                : 'text-gray-400 hover:text-white'
                        }`}
                    >
                        Music / Audio
                    </button>
                </div>
            </header>
            
            {activeTab === 'ops' && (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 h-full animate-fade-in">
                    {/* Left Column: Client & Money */}
                    <div className="flex flex-col gap-8">
                        <ClientManager />
                        <InvoiceManager />
                    </div>

                    {/* Right Column: Forecasting */}
                    <div className="flex flex-col gap-8">
                        <BarManager />
                    </div>
                </div>
            )}

            {activeTab === 'music' && (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 h-full animate-fade-in">
                    <div className="flex flex-col gap-8">
                        <SetlistCritic />
                    </div>
                    
                    <div className="flex flex-col gap-8">
                        <div className="p-6 bg-[var(--bg-card)] rounded-xl border border-[var(--border-color)] border-dashed">
                            <h3 className="text-lg font-bold mb-2 text-[var(--text-primary)]">🚀 Crate Digger (Coming Soon)</h3>
                            <p className="text-sm text-[var(--text-secondary)]">
                                Automated Apple Music Sync & Library Analysis.
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BusinessHubPage;