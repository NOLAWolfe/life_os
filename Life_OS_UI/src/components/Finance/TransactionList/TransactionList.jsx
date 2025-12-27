import React, { useState, useMemo } from 'react';
import { useFinancials } from '../../../hooks/useFinancialData';
import './TransactionList.css';

const TransactionList = () => {
    const { transactions, loading } = useFinancials();
    const [accountFilter, setAccountFilter] = useState('All');
    const [typeFilter, setTypeFilter] = useState('All');
    const [searchTerm, setSearchTerm] = useState('');

    const accounts = useMemo(() => {
        if (!transactions) return [];
        const unique = new Set(transactions.map(t => t.accountName));
        return ['All', ...Array.from(unique).sort()];
    }, [transactions]);

    const filteredTransactions = useMemo(() => {
        if (!transactions) return [];
        return transactions.filter(t => {
            const matchesAccount = accountFilter === 'All' || t.accountName === accountFilter;
            const matchesType = typeFilter === 'All' || t.type === typeFilter;
            const matchesSearch = t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                 t.category.toLowerCase().includes(searchTerm.toLowerCase());
            return matchesAccount && matchesType && matchesSearch;
        }).sort((a, b) => new Date(b.date) - new Date(a.date));
    }, [transactions, accountFilter, typeFilter, searchTerm]);

    if (loading) return <div className="p-10 text-center">Loading transactions...</div>;

    return (
        <div className="transaction-list-container widget-card">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <div>
                    <h2 className="widget-title">Transaction Ledger</h2>
                    <p className="text-xs text-gray-500">{filteredTransactions.length} records found</p>
                </div>
                
                <div className="flex flex-wrap gap-2">
                    <input 
                        type="text" 
                        placeholder="Search..." 
                        className="bg-gray-800 border border-gray-700 rounded px-3 py-1 text-sm focus:border-blue-500 outline-none"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <select 
                        value={accountFilter} 
                        onChange={(e) => setAccountFilter(e.target.value)}
                        className="bg-gray-800 border border-gray-700 rounded px-2 py-1 text-xs"
                    >
                        {accounts.map(acc => <option key={acc} value={acc}>{acc}</option>)}
                    </select>
                    <select 
                        value={typeFilter} 
                        onChange={(e) => setTypeFilter(e.target.value)}
                        className="bg-gray-800 border border-gray-700 rounded px-2 py-1 text-xs"
                    >
                        <option value="All">All Types</option>
                        <option value="debit">Debits (-)</option>
                        <option value="credit">Credits (+)</option>
                    </select>
                </div>
            </header>

            <div className="ledger-wrapper overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="text-[10px] uppercase font-bold text-gray-500 border-b border-gray-800">
                        <tr>
                            <th className="p-3">Date</th>
                            <th className="p-3">Description</th>
                            <th className="p-3">Category</th>
                            <th className="p-3">Account</th>
                            <th className="p-3 text-right">Amount</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800/50">
                        {filteredTransactions.slice(0, 100).map((t, i) => (
                            <tr key={t.id || i} className="hover:bg-white/5 transition-colors">
                                <td className="p-3 text-gray-400 font-mono text-xs">
                                    {new Date(t.date).toLocaleDateString()}
                                </td>
                                <td className="p-3">
                                    <div className="font-medium text-gray-200">{t.name}</div>
                                    {t.isLateral && <span className="text-[8px] bg-purple-900/50 text-purple-300 px-1 rounded uppercase">Lateral</span>}
                                    {t.isSideHustle && <span className="text-[8px] bg-orange-900/50 text-orange-300 px-1 rounded uppercase ml-1">Side Hustle</span>}
                                </td>
                                <td className="p-3">
                                    <span className="bg-gray-800 text-gray-400 px-2 py-0.5 rounded-full text-[10px]">
                                        {t.category}
                                    </span>
                                </td>
                                <td className="p-3">
                                    <div className="text-xs text-blue-400">{t.accountName}</div>
                                    <div className="text-[10px] text-gray-600 uppercase">{t.institution}</div>
                                </td>
                                <td className={`p-3 text-right font-mono font-bold ${t.type === 'credit' ? 'text-green-500' : 'text-gray-300'}`}>
                                    {t.type === 'credit' ? '+' : '-'}${Math.abs(t.amount).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredTransactions.length === 0 && (
                    <div className="p-20 text-center text-gray-600 italic">No transactions match your filters.</div>
                )}
                {filteredTransactions.length > 100 && (
                    <div className="p-4 text-center text-[10px] text-gray-600">Showing first 100 records only.</div>
                )}
            </div>
        </div>
    );
};

export default TransactionList;
