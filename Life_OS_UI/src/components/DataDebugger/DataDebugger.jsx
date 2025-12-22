import React from 'react';
import { useFinancials } from '../../contexts/FinancialContext';
import './DataDebugger.css';

const DataDebugger = () => {
    const { transactions, debtAccounts, accounts } = useFinancials();
    const lateralTxns = transactions.filter(t => t.isLateral);

    return (
        <div className="data-debugger space-y-6">
            <header className="flex justify-between items-end border-b border-[var(--border-color)] pb-4">
                <div>
                    <h2 className="text-xl font-bold text-orange-400">🕵️ Data Debugger</h2>
                    <p className="text-sm text-[var(--text-secondary)]">System Integrity & Logic Audit</p>
                </div>
                <div className="text-[10px] uppercase font-bold text-gray-500">Source: <span className="text-blue-400">SQLite Database</span></div>
            </header>

            <div className="animate-fade-in space-y-8">
                {/* DB Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-[var(--bg-secondary)] rounded border border-[var(--border-color)]">
                        <p className="text-[10px] uppercase font-bold text-gray-500">Total Transactions</p>
                        <p className="text-2xl font-bold text-blue-400">{transactions.length}</p>
                    </div>
                    <div className="p-4 bg-[var(--bg-secondary)] rounded border border-[var(--border-color)]">
                        <p className="text-[10px] uppercase font-bold text-gray-500">Lateral Transfers</p>
                        <p className="text-2xl font-bold text-purple-400">{lateralTxns.length}</p>
                        <p className="text-[10px] text-gray-500">Excluded from Cash Flow</p>
                    </div>
                    <div className="p-4 bg-[var(--bg-secondary)] rounded border border-[var(--border-color)]">
                        <p className="text-[10px] uppercase font-bold text-gray-500">Debt Items</p>
                        <p className="text-2xl font-bold text-red-400">{debtAccounts.length}</p>
                    </div>
                </div>

                {/* Lateral Audit */}
                <div className="bg-[var(--bg-secondary)] rounded-lg p-6 border border-[var(--border-color)]">
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                        <span>🛡️</span> Lateral Movement Audit
                    </h3>
                    <p className="text-sm text-[var(--text-secondary)] mb-4">
                        Transactions matching keywords like 'Zelle', 'Transfer', or 'CC Payment' are flagged to prevent skewed income/expense data.
                    </p>
                    
                    <div className="max-h-[300px] overflow-y-auto border border-[var(--border-color)] rounded bg-[var(--bg-primary)]">
                        <table className="w-full text-left text-xs">
                            <thead className="sticky top-0 bg-[var(--bg-secondary)] text-gray-500 uppercase">
                                <tr>
                                    <th className="p-2">Date</th>
                                    <th className="p-2">Description</th>
                                    <th className="p-2 text-right">Amount</th>
                                    <th className="p-2">Category</th>
                                </tr>
                            </thead>
                            <tbody>
                                {lateralTxns.map((t, idx) => (
                                    <tr key={idx} className="border-t border-[var(--border-color)] hover:bg-white/5">
                                        <td className="p-2 text-gray-400">{new Date(t.date).toLocaleDateString()}</td>
                                        <td className="p-2 font-medium">{t.name}</td>
                                        <td className="p-2 text-right font-mono">${t.amount.toLocaleString()}</td>
                                        <td className="p-2"><span className="bg-purple-900/30 text-purple-300 px-1.5 py-0.5 rounded">{t.category[0]}</span></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DataDebugger;

