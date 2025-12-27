import React, { useMemo, useState, useEffect } from 'react';
import { useFinancials } from '../../../hooks/useFinancialData';

const LeakDetector = () => {
    const { transactions } = useFinancials();
    const [ghostBills, setGhostBills] = useState(() => {
        const saved = localStorage.getItem('ghostBills');
        return saved ? JSON.parse(saved) : [];
    });

    // Form state for new ghost bill
    const [newBillName, setNewBillName] = useState('');
    const [newBillAmount, setNewBillAmount] = useState('');
    const [newBillFrequency, setNewBillFrequency] = useState(6); // Default 6 months

    useEffect(() => {
        localStorage.setItem('ghostBills', JSON.stringify(ghostBills));
    }, [ghostBills]);

    // 1. Analyze "Death by 1000 Cuts" (Transactions < $30)
    const smallTransactions = useMemo(() => {
        if (!transactions) return { total: 0, count: 0, average: 0 };

        // Filter for expenses (debit) under $30, excluding transfers/payments
        const smalls = transactions.filter(
            (t) =>
                t.type === 'debit' &&
                t.amount < 30 &&
                t.amount > 0 &&
                !t.category.includes('Transfers') &&
                !t.category.includes('Credit Card Payment')
        );

        const total = smalls.reduce((sum, t) => sum + t.amount, 0);
        return {
            total,
            count: smalls.length,
            average: smalls.length ? total / smalls.length : 0,
            items: smalls,
        };
    }, [transactions]);

    // 2. Frequency Analyzer (Top Merchants by Count)
    const frequentMerchants = useMemo(() => {
        if (!transactions) return [];

        const merchantMap = new Map();

        transactions.forEach((t) => {
            if (
                t.type !== 'debit' ||
                t.category.includes('Transfers') ||
                t.category.includes('Credit Card Payment')
            )
                return;

            // Simple normalization
            const name = t.name.split(/\s(Start|End|Date|XX|\d{4,})/)[0].trim();

            if (!merchantMap.has(name)) {
                merchantMap.set(name, { name, count: 0, total: 0 });
            }
            const m = merchantMap.get(name);
            m.count += 1;
            m.total += t.amount;
        });

        return Array.from(merchantMap.values())
            .sort((a, b) => b.count - a.count)
            .slice(0, 5); // Top 5
    }, [transactions]);

    // 3. Amortization Logic
    const monthlyAmortization = ghostBills.reduce((sum, bill) => {
        return sum + bill.amount / bill.frequency;
    }, 0);

    const addGhostBill = (e) => {
        e.preventDefault();
        if (!newBillName || !newBillAmount) return;

        const newBill = {
            id: Date.now(),
            name: newBillName,
            amount: parseFloat(newBillAmount),
            frequency: parseInt(newBillFrequency),
        };

        setGhostBills([...ghostBills, newBill]);
        setNewBillName('');
        setNewBillAmount('');
    };

    const removeGhostBill = (id) => {
        setGhostBills(ghostBills.filter((b) => b.id !== id));
    };

    const formatCurrency = (val) =>
        new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(val);

    return (
        <div className="widget-card h-full flex flex-col">
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-[var(--border-color)]">
                <h2 className="text-xl font-bold text-[var(--accent-color)] flex items-center gap-2">
                    🔍 Leak Detector
                </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1 overflow-y-auto">
                {/* Section 1: The Small Cuts */}
                <div className="p-4 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-color)]">
                    <h3 className="font-semibold text-lg">Death by 1000 Cuts</h3>
                    <p className="text-sm text-[var(--text-secondary)]">Transactions under $30</p>
                    <div className="text-2xl font-bold my-2">
                        {formatCurrency(smallTransactions.total)}
                    </div>
                    <div className="text-xs text-[var(--text-secondary)]">
                        Across {smallTransactions.count} purchases
                        <br />
                        (~{formatCurrency(smallTransactions.average)} / each)
                    </div>
                </div>

                {/* Section 2: Frequency Analyzer */}
                <div className="p-4 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-color)]">
                    <h3 className="font-semibold text-lg">Habitual Spenders</h3>
                    <p className="text-sm text-[var(--text-secondary)]">
                        Top Merchants by Frequency
                    </p>
                    <ul className="mt-2 space-y-2">
                        {frequentMerchants.map((m, idx) => (
                            <li
                                key={idx}
                                className="flex justify-between items-center text-sm border-b border-[var(--border-color)] last:border-0 pb-1"
                            >
                                <span className="font-medium truncate mr-2">{m.name}</span>
                                <div className="text-right text-xs text-[var(--text-secondary)] shrink-0">
                                    <div>{m.count}x times</div>
                                    <div>{formatCurrency(m.total)}</div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Section 3: The Invisible Bills (Amortization) */}
                <div className="col-span-1 md:col-span-2 p-4 rounded-lg bg-[var(--bg-primary)] border border-[var(--border-color)]">
                    <h3 className="font-semibold text-lg">👻 Ghost Bills (Amortization)</h3>
                    <p className="text-sm text-[var(--text-secondary)]">
                        Add large, irregular bills to see monthly impact
                    </p>

                    <div className="text-xl font-bold text-red-500 my-2">
                        -{formatCurrency(monthlyAmortization)} / mo
                    </div>
                    <p className="text-xs text-[var(--text-secondary)] mb-4">
                        Hidden deduction from your surplus
                    </p>

                    <div className="space-y-2 mb-4">
                        {ghostBills.map((bill) => (
                            <div
                                key={bill.id}
                                className="flex justify-between items-center p-2 bg-[var(--bg-secondary)] rounded border border-[var(--border-color)] text-sm"
                            >
                                <span>
                                    {bill.name} ({formatCurrency(bill.amount)} / {bill.frequency}{' '}
                                    mo)
                                </span>
                                <button
                                    onClick={() => removeGhostBill(bill.id)}
                                    className="text-red-500 hover:text-red-400 font-bold px-2"
                                >
                                    ×
                                </button>
                            </div>
                        ))}
                    </div>

                    <form onSubmit={addGhostBill} className="flex gap-2">
                        <input
                            className="flex-1 min-w-0 bg-[var(--input-bg)] border border-[var(--border-color)] rounded px-2 py-1 text-sm"
                            placeholder="Bill Name (e.g. Car Ins)"
                            value={newBillName}
                            onChange={(e) => setNewBillName(e.target.value)}
                        />
                        <input
                            className="w-20 bg-[var(--input-bg)] border border-[var(--border-color)] rounded px-2 py-1 text-sm"
                            type="number"
                            placeholder="$"
                            value={newBillAmount}
                            onChange={(e) => setNewBillAmount(e.target.value)}
                        />
                        <select
                            className="w-20 bg-[var(--input-bg)] border border-[var(--border-color)] rounded px-1 py-1 text-sm"
                            value={newBillFrequency}
                            onChange={(e) => setNewBillFrequency(e.target.value)}
                        >
                            <option value="3">Qtly</option>
                            <option value="6">Bi-An</option>
                            <option value="12">Yrly</option>
                        </select>
                        <button
                            type="submit"
                            className="bg-blue-600 hover:bg-blue-700 text-white rounded px-3 py-1 text-sm font-medium transition-colors"
                        >
                            Add
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default LeakDetector;
