import React from 'react';
import './BankConnection.css';

const BankConnection = () => {
    return (
        <div className="bank-connection-card">
            <div className="connection-header">
                <div className="icon-wrapper">
                    <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="bank-icon"
                    >
                        <path d="M3 21h18M5 21V7l8-4 8 4v14M19 10a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2" />
                    </svg>
                </div>
                <h3>Connect Your Bank</h3>
            </div>
            <p className="connection-desc">
                Securely link your financial accounts to automatically import transactions and
                balances.
            </p>

            <div className="connection-features">
                <div className="feature">
                    <span className="check">✓</span> 12,000+ Institutions
                </div>
                <div className="feature">
                    <span className="check">✓</span> Real-time Sync
                </div>
                <div className="feature">
                    <span className="check">✓</span> Bank-level Security
                </div>
            </div>

            <button className="connect-btn" onClick={() => alert('Plaid Integration Coming Soon!')}>
                Link Account via Plaid
            </button>

            <p className="secure-badge">🔒 Encrypted & Secure</p>
        </div>
    );
};

export default BankConnection;
