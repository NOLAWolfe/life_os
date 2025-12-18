import React, { useMemo } from 'react';
import { useFinancials } from '../../contexts/FinancialContext';
import './BudgetVsActuals.css';

const BudgetVsActuals = () => {
    const { transactions, categories, loading, error } = useFinancials();

    const budgetData = useMemo(() => {
        if (loading || error || transactions.length === 0 || categories.length === 0) {
            return [];
        }

        const currentMonth = new Date().toLocaleString('default', { month: 'short' });
        const currentYear = new Date().getFullYear();
        const budgetColumn = `${currentMonth} ${currentYear}`; // e.g., "Dec 2025"

        // Calculate actual spending by category for the current month
        const actuals = {};
        transactions.forEach(t => {
            const transactionMonth = new Date(t.date).toLocaleString('default', { month: 'short' });
            if (t.type === 'debit' && transactionMonth === currentMonth) {
                const category = t.category[0] || 'Uncategorized';
                actuals[category] = (actuals[category] || 0) + t.amount;
            }
        });

        // Map budget data to actuals
        return categories
            .filter(cat => cat.Type === 'Expense') // Only include expense categories
            .map(cat => {
                const budgetAmount = parseFloat(cat[budgetColumn]?.replace(/[^0-9.-]+/g, "") || 0);
                const actualAmount = actuals[cat.Category] || 0;
                const difference = budgetAmount - actualAmount;
                return {
                    category: cat.Category,
                    budget: budgetAmount,
                    actual: actualAmount,
                    difference: difference,
                };
            })
            .filter(item => item.budget > 0 || item.actual > 0); // Only show items with a budget or spending

    }, [transactions, categories, loading, error]);

    if (loading) return <p>Calculating budget...</p>;
    if (error) return null;
    if (categories.length === 0) return <p>Please upload your 'Categories' CSV to see budget data.</p>;
    if (transactions.length === 0) return <p>No transactions loaded to compare against budget.</p>;

    return (
        <div className="budget-vs-actuals-container">
            <h3>Budget vs. Actuals (Current Month)</h3>
            <table>
                <thead>
                    <tr>
                        <th>Category</th>
                        <th className="amount-header">Budgeted</th>
                        <th className="amount-header">Actual</th>
                        <th className="amount-header">Difference</th>
                    </tr>
                </thead>
                <tbody>
                    {budgetData.map(({ category, budget, actual, difference }) => (
                        <tr key={category}>
                            <td>{category}</td>
                            <td className="amount-cell">
                                {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(budget)}
                            </td>
                            <td className="amount-cell">
                                {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(actual)}
                            </td>
                            <td className={`amount-cell ${difference >= 0 ? 'positive' : 'negative'}`}>
                                {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(difference)}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default BudgetVsActuals;
