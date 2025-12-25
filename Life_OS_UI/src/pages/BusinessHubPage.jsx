import React, { useState } from 'react';
import SetlistCritic from '../components/SocialHub/SetlistCritic/SetlistCritic';
import ClientManager from '../components/SocialHub/ClientManager/ClientManager';
import InvoiceManager from '../components/SocialHub/InvoiceManager/InvoiceManager';
import BarManager from '../components/SocialHub/BarManager/BarManager';
import ContentFactory from '../components/SocialHub/ContentFactory/ContentFactory';
import BookingAgent from '../components/SocialHub/BookingAgent/BookingAgent';
import '../pages/Page.css';

const BusinessHubPage = () => {
    const [activeTab, setActiveTab] = useState('ops'); // 'ops' or 'music'

    return (
        <div className="page-container">
            <header className="mb-8 flex justify-between items-center">
                <div>
                    <h1>Business Hub</h1>
                    <p>Enterprise Resource Planning & Creative Operations</p>
                </div>
                <div className="flex bg-card rounded p-1 border border-border">
                    <button
                        onClick={() => setActiveTab('ops')}
                        className={`px-4 py-2 text-sm rounded transition-all ${activeTab === 'ops' ? 'bg-accent text-white font-bold shadow-lg' : 'text-secondary hover:text-primary'}`}
                    >
                        Operations
                    </button>
                    <button
                        onClick={() => setActiveTab('music')}
                        className={`px-4 py-2 text-sm rounded transition-all ${activeTab === 'music' ? 'bg-accent text-white font-bold shadow-lg' : 'text-secondary hover:text-primary'}`}
                    >
                        Music & Content
                    </button>
                </div>
            </header>

            {activeTab === 'ops' && (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 h-full animate-fade-in">
                    <div className="flex flex-col gap-8">
                        <InvoiceManager />
                        <ClientManager />
                    </div>
                    <div className="flex flex-col gap-8">
                        <BarManager />
                        <BookingAgent />
                    </div>
                </div>
            )}

            {activeTab === 'music' && (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 h-full animate-fade-in">
                    <div className="flex flex-col gap-8">
                        <SetlistCritic />
                    </div>
                    
                    <div className="flex flex-col gap-8">
                        <ContentFactory />
                        <div className="p-6 bg-card rounded-xl border border-border border-dashed">
                            <h3 className="text-lg font-bold mb-2 text-primary">🚀 Trend Jacker (Coming Soon)</h3>
                            <p className="text-sm text-secondary">
                                Automated TikTok/X Hashtag Scraping & Content Proposals.
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BusinessHubPage;