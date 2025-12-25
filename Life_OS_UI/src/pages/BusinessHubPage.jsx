import React, { useState } from 'react';
import SetlistCritic from '../components/SocialHub/SetlistCritic/SetlistCritic';
import ClientManager from '../components/SocialHub/ClientManager/ClientManager';
import InvoiceManager from '../components/SocialHub/InvoiceManager/InvoiceManager';
import BarManager from '../components/SocialHub/BarManager/BarManager';
import ContentFactory from '../components/SocialHub/ContentFactory/ContentFactory';
import '../pages/Page.css';

const BusinessHubPage = () => {
    const [activeTab, setActiveTab] = useState('ops'); // 'ops' or 'music'

    return (
        <div className="page-container">
            {/* ... (rest same until music tab) ... */}
            {activeTab === 'music' && (
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 h-full animate-fade-in">
                    <div className="flex flex-col gap-8">
                        <SetlistCritic />
                    </div>
                    
                    <div className="flex flex-col gap-8">
                        <ContentFactory />
                        <div className="p-6 bg-[var(--bg-card)] rounded-xl border border-[var(--border-color)] border-dashed">
                            <h3 className="text-lg font-bold mb-2 text-[var(--text-primary)]">🚀 Trend Jacker (Coming Soon)</h3>
                            <p className="text-sm text-[var(--text-secondary)]">
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
