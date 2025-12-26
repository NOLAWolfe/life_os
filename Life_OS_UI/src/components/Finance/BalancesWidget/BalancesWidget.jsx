import React from 'react';
import { useFinancials } from '../../../contexts/FinancialContext';
import './BalancesWidget.css';

const BalancesWidget = () => {
    const { accounts, loading, error } = useFinancials();

    // Grouping by Class (Asset vs Liability) then by Type
    const groupedByClass = accounts.reduce((acc, account) => {
        // Normalizing class name (Asset, Liability)
        let className = account.class
            ? account.class.charAt(0).toUpperCase() + account.class.slice(1).toLowerCase()
            : 'Asset'; // Default to Asset if undefined

        // Force Liability if type suggests it
        const t = account.type?.toLowerCase() || '';
        const currentBalance = account.balances?.current || 0;
        if (t.includes('credit') || t.includes('loan') || t.includes('debt') || currentBalance < 0) {
            className = 'Liability';
        }

        if (!acc[className]) {
            acc[className] = [];
        }
        acc[className].push(account);
        return acc;
    }, {});

    const getBadgeColor = (type) => {
        const t = type?.toLowerCase() || '';
        if (t.includes('checking') || t.includes('savings') || t.includes('asset'))
            return 'bg-green-100 text-green-800';
        if (t.includes('credit') || t.includes('loan') || t.includes('liability'))
            return 'bg-red-100 text-red-800';
        return 'bg-blue-100 text-blue-800';
    };

    return (
        <div className="balances-widget">
            <h3 className="text-xl font-bold mb-4">Account Balances</h3>
            {loading && <p>Processing data...</p>}
            {error && <p className="error-message">Error: {error}</p>}

            {!loading &&
                !error &&
                (accounts.length > 0 ? (
                    <div className="balances-container space-y-4">
                        {Object.entries(groupedByClass)
                            .sort(([a], [b]) => a.localeCompare(b))
                            .map(([className, group]) => (
                                <div key={className} className="account-class-group">
                                    <h4
                                        className={`group-header ${className === 'Asset' ? 'text-green-600' : 'text-red-600'}`}
                                    >
                                        {className}s
                                    </h4>
                                    <ul className="balances-list">
                                        {group.map((account, idx) => (
                                            <li
                                                key={account.account_id || idx}
                                                className="flex justify-between items-center py-2 border-b border-gray-800/20 last:border-0"
                                            >
                                                <div className="account-info flex flex-col">
                                                    <div className="flex items-center gap-2">
                                                        <span className="account-name font-medium">
                                                            {account.name || 'Unnamed Account'}
                                                        </span>
                                                        <span
                                                            className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${getBadgeColor(account.type)}`}
                                                        >
                                                            {account.type}
                                                        </span>
                                                    </div>
                                                    <span className="institution-name text-xs text-gray-500">
                                                        {account.institution}
                                                    </span>
                                                </div>
                                                <span
                                                    className={`account-balance font-mono font-semibold ${className === 'Liability' || account.balances?.current < 0 ? 'text-red-500' : 'text-green-600'}`}
                                                >
                                                    {new Intl.NumberFormat('en-US', {
                                                        style: 'currency',
                                                        currency: 'USD',
                                                    }).format(account.balances?.current || 0)}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                    </div>
                ) : (
                    <p className="no-data-message text-center text-gray-500 py-4">
                        No financial data found.
                    </p>
                ))}
        </div>
    );
};

export default BalancesWidget;
