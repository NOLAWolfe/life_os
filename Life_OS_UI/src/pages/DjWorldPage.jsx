import React from 'react';
import SetlistCritic from '../components/SocialHub/SetlistCritic/SetlistCritic';
import ClientManager from '../components/SocialHub/ClientManager/ClientManager';
import InvoiceManager from '../components/SocialHub/InvoiceManager/InvoiceManager';
import '../pages/Page.css';

const DjWorldPage = () => {
    return (
        <div className="page-container">
            <header className="page-header mb-6">
                <h1>🎧 DJ World: Studio Admin</h1>
                <p>Operational tools for set planning and client management.</p>
            </header>
            
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 h-full">
                {/* Operational Section */}
                <div className="flex flex-col gap-8">
                    <ClientManager />
                    <InvoiceManager />
                </div>

                {/* Performance Section */}
                <div className="flex flex-col gap-8">
                    <SetlistCritic />
                    
                    <div className="p-6 bg-[var(--bg-card)] rounded-xl border border-[var(--border-color)]">
                        <h3 className="text-lg font-bold mb-2 text-[var(--text-primary)]">🚀 Upcoming Expansion</h3>
                        <p className="text-sm text-[var(--text-secondary)]">
                            'Crate Digger' (Apple Music Sync) is coming next.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DjWorldPage;
