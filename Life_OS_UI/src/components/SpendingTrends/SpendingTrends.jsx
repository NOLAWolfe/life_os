import React, { useMemo } from 'react';
import { useFinancials } from '../../contexts/FinancialContext';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import './SpendingTrends.css';

ChartJS.register(ArcElement, Tooltip, Legend);

const SpendingTrends = () => {
    const { transactions, loading, error } = useFinancials();

    const spendingData = useMemo(() => {
        if (loading || error || !transactions || transactions.length === 0) {
            return { table: [], chart: { labels: [], datasets: [] } };
        }

        const trends = {};
        transactions.forEach(transaction => {
            if (transaction.type === 'debit' && !transaction.isLateral) {
                const category = transaction.category[0] || 'Uncategorized';
                trends[category] = (trends[category] || 0) + transaction.amount;
            }
        });

        const sortedSpending = Object.entries(trends)
            .map(([category, amount]) => ({ category, amount }))
            .sort((a, b) => b.amount - a.amount);
            
        const chartLabels = sortedSpending.map(item => item.category);
        const chartData = sortedSpending.map(item => item.amount);
        
        const chart = {
            labels: chartLabels,
            datasets: [{
                label: 'Spending',
                data: chartData,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.7)', 'rgba(54, 162, 235, 0.7)',
                    'rgba(255, 206, 86, 0.7)', 'rgba(75, 192, 192, 0.7)',
                    'rgba(153, 102, 255, 0.7)', 'rgba(255, 159, 64, 0.7)',
                    'rgba(99, 255, 132, 0.7)', 'rgba(235, 54, 162, 0.7)',
                ],
                borderColor: '#fff',
                borderWidth: 1,
            }]
        };

        return { table: sortedSpending, chart };
    }, [transactions, loading, error]);

    if (loading) return <p>Loading spending trends...</p>;
    if (error) return <p className="error-message">Error: {error}</p>;
    if (transactions.length === 0) return null;

    return (
        <div className="spending-trends-container">
            <h3>Spending Trends by Category</h3>
            {spendingData.table.length > 0 ? (
                <div className="spending-grid">
                    <div className="spending-chart">
                        <Doughnut data={spendingData.chart} />
                    </div>
                    <div className="spending-table">
                        <table>
                            <thead>
                                <tr>
                                    <th>Category</th>
                                    <th className="amount-header">Total Spent</th>
                                </tr>
                            </thead>
                            <tbody>
                                {spendingData.table.map(({ category, amount }) => (
                                    <tr key={category}>
                                        <td>{category}</td>
                                        <td className="amount-cell">
                                            {new Intl.NumberFormat('en-US', {
                                                style: 'currency', currency: 'USD'
                                            }).format(amount)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <p>No spending recorded for the selected period.</p>
            )}
        </div>
    );
};

export default SpendingTrends;
