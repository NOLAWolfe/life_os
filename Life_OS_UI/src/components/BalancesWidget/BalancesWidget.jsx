import React from 'react';
import { useFinancials } from '../../contexts/FinancialContext';
import './BalancesWidget.css';

const BalancesWidget = () => {
    const { accounts, loading, error } = useFinancials();

    return (
        <div className="balances-widget">
            <h3>Account Balances</h3>
            {loading && <p>Processing data...</p>}
            {error && <p className="error-message">Error: {error}</p>}
            
            {!loading && !error && (accounts.length > 0 ? (
                <ul className="balances-list">
                    {accounts.map((account, idx) => (
                        <li key={account.account_id || idx}>
                            <span className="account-name">{account.name || 'Unnamed Account'}</span>
                            <span className="account-balance">
                                {new Intl.NumberFormat('en-US', {
                                    style: 'currency',
                                    currency: 'USD',
                                }).format(account.balances?.current || 0)}
                            </span>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="no-data-message">Upload a CSV on the Finance page to see balances.</p>
            ))}
        </div>
    );
};

export default BalancesWidget;
