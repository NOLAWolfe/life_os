import React from 'react';
import { useFinancials } from '../../contexts/FinancialContext';
import './BalancesWidget.css';

const BalancesWidget = () => {
    const { accounts, loading, error } = useFinancials();

    // Grouping by Class (Asset vs Liability) then by Type
    const groupedByClass = accounts.reduce((acc, account) => {
        // Normalizing class name (Asset, Liability)
        let className = account.class ? account.class.charAt(0).toUpperCase() + account.class.slice(1).toLowerCase() : 'Other';
        
        // Fallback: Infer from type if class is missing
        if (className === 'Other' && account.type) {
            const t = account.type.toLowerCase();
            if (t.includes('check') || t.includes('save') || t.includes('invest') || t.includes('cash')) className = 'Asset';
            else if (t.includes('card') || t.includes('loan') || t.includes('debt')) className = 'Liability';
        }

        if (!acc[className]) {
            acc[className] = [];
        }
        acc[className].push(account);
        return acc;
    }, {});

    const getBadgeColor = (type) => {
        const t = type?.toLowerCase() || '';
        if (t.includes('checking') || t.includes('savings') || t.includes('asset')) return 'bg-green-100 text-green-800';
        if (t.includes('credit') || t.includes('loan') || t.includes('liability')) return 'bg-red-100 text-red-800';
        return 'bg-blue-100 text-blue-800';
    };

    return (
        <div className="balances-widget">
            <h3 className="text-xl font-bold mb-4">Account Balances</h3>
            {loading && <p>Processing data...</p>}
            {error && <p className="error-message">Error: {error}</p>}
            
            {!loading && !error && (accounts.length > 0 ? (
                <div className="balances-container space-y-6">
                    {Object.entries(groupedByClass).sort(([a], [b]) => a.localeCompare(b)).map(([className, group]) => (
                        <div key={className} className="account-class-group">
                            <h4 className={`text-sm font-semibold uppercase tracking-wider mb-2 pb-1 border-b ${className === 'Asset' ? 'text-green-600 border-green-200' : 'text-red-600 border-red-200'}`}>
                                {className}s
                            </h4>
                            <ul className="balances-list divide-y divide-gray-100">
                                {group.map((account, idx) => (
                                    <li key={account.account_id || idx} className="flex justify-between items-center py-3">
                                        <div className="account-info flex flex-col">
                                            <div className="flex items-center gap-2">
                                                <span className="account-name font-medium">{account.name || 'Unnamed Account'}</span>
                                                <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${getBadgeColor(account.type)}`}>
                                                    {account.type}
                                                </span>
                                            </div>
                                            <span className="institution-name text-xs text-gray-500">{account.institution}</span>
                                        </div>
                                        <span className={`account-balance font-mono font-semibold ${className === 'Liability' || account.balances?.current < 0 ? 'text-red-500' : 'text-green-600'}`}>
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
                <p className="no-data-message text-center text-gray-500 py-4">Upload a CSV on the Finance page to see balances.</p>
            ))}
        </div>
    );
};

export default BalancesWidget;
