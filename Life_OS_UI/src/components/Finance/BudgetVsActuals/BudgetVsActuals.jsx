import React, { useMemo, useState } from 'react';
import { useFinancials } from '../../../hooks/useFinancialData';
import './BudgetVsActuals.css';

const BudgetVsActuals = () => {
    const { transactions, categories, loading, error } = useFinancials();

    // Date Selection State
    const today = new Date();
    const [selectedDate, setSelectedDate] = useState({
        month: today.getMonth(), // 0-11
        year: today.getFullYear(),
    });

    const handleMonthChange = (e) => {
        const [year, month] = e.target.value.split('-').map(Number);
        setSelectedDate({ month: month - 1, year }); // HTML month is 1-12
    };

    const budgetData = useMemo(() => {
        if (loading || error || transactions.length === 0 || categories.length === 0) {
            return { items: [], totalBudget: 0, totalActual: 0 };
        }

        const targetMonthName = new Date(selectedDate.year, selectedDate.month).toLocaleString(
            'default',
            { month: 'short' }
        );
        const targetYear = selectedDate.year;

        // Helper to find the budget column for the target month
        const findBudgetAmount = (categoryRow) => {
            // Tiller formats: "Jan 2025", "1/1/2025", "2025-01"
            const patterns = [
                `${targetMonthName} ${targetYear}`, // "Dec 2025"
                `${selectedDate.month + 1}/1/${targetYear}`, // "12/1/2025"
                targetMonthName, // Just "Dec"
            ];

            for (const pattern of patterns) {
                const val =
                    categoryRow[pattern] ||
                    categoryRow[`${pattern}_1`] ||
                    categoryRow[`${pattern}_2`];
                if (val !== undefined)
                    return parseFloat(String(val).replace(/[^0-9.-]+/g, '') || 0);
            }
            return 0;
        };

        // Calculate actual spending by category for the target month
        const actuals = {};
        transactions.forEach((t) => {
            const tDate = new Date(t.date);
            if (
                t.type === 'debit' &&
                tDate.getMonth() === selectedDate.month &&
                tDate.getFullYear() === selectedDate.year &&
                !t.isLateral
            ) {
                const category = t.category[0] || 'Uncategorized';
                actuals[category] = (actuals[category] || 0) + t.amount;
            }
        });

        let totalBudget = 0;
        let totalActual = 0;

        // Map budget data to actuals
        const items = categories
            .filter((cat) => cat.Type === 'Expense' && !cat.isHidden) // Only include active expense categories
            .map((cat) => {
                const budgetAmount = findBudgetAmount(cat);
                const actualAmount = actuals[cat.Category] || 0;
                const difference = budgetAmount - actualAmount;

                totalBudget += budgetAmount;
                totalActual += actualAmount;

                return {
                    category: cat.Category,
                    group: cat.group,
                    budget: budgetAmount,
                    actual: actualAmount,
                    difference: difference,
                    percent: budgetAmount > 0 ? (actualAmount / budgetAmount) * 100 : 0,
                };
            })
            .filter((item) => item.budget > 0 || item.actual > 0)
            .sort((a, b) => b.actual - a.actual); // Sort by highest spending

        return { items, totalBudget, totalActual };
    }, [transactions, categories, loading, error, selectedDate]);

    // Generate last 12 months for dropdown
    const monthOptions = useMemo(() => {
        const options = [];
        for (let i = 0; i < 12; i++) {
            const d = new Date();
            d.setMonth(d.getMonth() - i);
            const value = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
            const label = d.toLocaleString('default', { month: 'long', year: 'numeric' });
            options.push({ value, label });
        }
        return options;
    }, []);

    if (loading) return <div className="widget-card">Loading budget...</div>;
    if (error) return null;
    if (categories.length === 0)
        return (
            <div className="widget-card">
                <p>Please upload 'Categories.csv'.</p>
            </div>
        );

    return (
        <div className="budget-vs-actuals-container widget-card">
            <div className="widget-header flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Budget vs Actuals</h3>
                <select
                    className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded px-2 py-1 text-xs"
                    onChange={handleMonthChange}
                    value={`${selectedDate.year}-${String(selectedDate.month + 1).padStart(2, '0')}`}
                >
                    {monthOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                            {opt.label}
                        </option>
                    ))}
                </select>
            </div>

            {/* Summary Bar */}
            <div className="budget-summary flex justify-between items-center bg-[var(--bg-secondary)] p-3 rounded mb-4">
                <div className="text-center">
                    <p className="text-xs text-[var(--text-secondary)] uppercase">Budgeted</p>
                    <p className="font-bold">
                        {new Intl.NumberFormat('en-US', {
                            style: 'currency',
                            currency: 'USD',
                            maximumFractionDigits: 0,
                        }).format(budgetData.totalBudget)}
                    </p>
                </div>
                <div className="text-center">
                    <p className="text-xs text-[var(--text-secondary)] uppercase">Spent</p>
                    <p
                        className={`font-bold ${budgetData.totalActual > budgetData.totalBudget ? 'text-red-400' : 'text-green-400'}`}
                    >
                        {new Intl.NumberFormat('en-US', {
                            style: 'currency',
                            currency: 'USD',
                            maximumFractionDigits: 0,
                        }).format(budgetData.totalActual)}
                    </p>
                </div>
                <div className="text-center">
                    <p className="text-xs text-[var(--text-secondary)] uppercase">Remaining</p>
                    <p
                        className={`font-bold ${budgetData.totalBudget - budgetData.totalActual < 0 ? 'text-red-400' : 'text-blue-400'}`}
                    >
                        {new Intl.NumberFormat('en-US', {
                            style: 'currency',
                            currency: 'USD',
                            maximumFractionDigits: 0,
                        }).format(budgetData.totalBudget - budgetData.totalActual)}
                    </p>
                </div>
            </div>

            <div className="budget-table-wrapper max-h-[400px] overflow-y-auto">
                <table className="w-full text-sm border-collapse">
                    <thead className="sticky top-0 bg-[var(--bg-primary)] z-10 shadow-sm">
                        <tr>
                            <th className="text-left py-2">Category</th>
                            <th className="text-right py-2 w-24">Budget</th>
                            <th className="text-right py-2 w-24">Actual</th>
                            <th className="text-right py-2 w-24">Diff</th>
                        </tr>
                    </thead>
                    <tbody>
                        {budgetData.items.map((item) => (
                            <tr
                                key={item.category}
                                className="border-b border-[var(--border-color)] hover:bg-[var(--bg-secondary)] transition-colors group"
                            >
                                <td className="py-2 pl-2">
                                    <div className="font-medium">{item.category}</div>
                                    <div className="w-full bg-gray-700 h-1 mt-1 rounded overflow-hidden">
                                        <div
                                            className={`h-full ${item.actual > item.budget ? 'bg-red-500' : 'bg-green-500'}`}
                                            style={{ width: `${Math.min(item.percent, 100)}%` }}
                                        />
                                    </div>
                                </td>
                                <td className="text-right py-2 font-mono text-gray-400">
                                    {new Intl.NumberFormat('en-US', {
                                        style: 'decimal',
                                        minimumFractionDigits: 0,
                                        maximumFractionDigits: 0,
                                    }).format(item.budget)}
                                </td>
                                <td className="text-right py-2 font-mono font-medium">
                                    {new Intl.NumberFormat('en-US', {
                                        style: 'decimal',
                                        minimumFractionDigits: 0,
                                        maximumFractionDigits: 0,
                                    }).format(item.actual)}
                                </td>
                                <td
                                    className={`text-right py-2 font-mono pr-2 ${item.difference >= 0 ? 'text-green-400' : 'text-red-400'}`}
                                >
                                    {item.difference > 0 ? '+' : ''}
                                    {new Intl.NumberFormat('en-US', {
                                        style: 'decimal',
                                        minimumFractionDigits: 0,
                                        maximumFractionDigits: 0,
                                    }).format(item.difference)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default BudgetVsActuals;
