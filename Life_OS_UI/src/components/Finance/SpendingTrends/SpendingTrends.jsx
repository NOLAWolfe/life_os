import React, { useMemo, useState } from 'react';
import { useFinancials } from '../../../hooks/useFinancialData';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import './SpendingTrends.css';

ChartJS.register(ArcElement, Tooltip, Legend);

const SpendingTrends = () => {
    const { transactions, loading, error } = useFinancials();
    const [timeRange, setTimeRange] = useState('last30'); // 'thisMonth', 'lastMonth', 'last30', 'last90', 'ytd', 'all'

    const spendingData = useMemo(() => {
        if (loading || error || !transactions || transactions.length === 0) {
            return { table: [], chart: { labels: [], datasets: [] }, total: 0 };
        }

        const now = new Date();
        const currentYear = now.getFullYear();
        const currentMonth = now.getMonth();

        // Filter transactions based on Time Range
        const filteredTransactions = transactions.filter((t) => {
            if (t.type !== 'debit' || t.isLateral) return false;

            const tDate = new Date(t.date);
            if (isNaN(tDate)) return false;

            switch (timeRange) {
                case 'thisMonth':
                    return tDate.getFullYear() === currentYear && tDate.getMonth() === currentMonth;
                case 'lastMonth': {
                    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
                    const lastMonthYear = currentMonth === 0 ? currentYear - 1 : currentYear;
                    return tDate.getFullYear() === lastMonthYear && tDate.getMonth() === lastMonth;
                }
                case 'last30': {
                    const thirtyDaysAgo = new Date();
                    thirtyDaysAgo.setDate(now.getDate() - 30);
                    return tDate >= thirtyDaysAgo;
                }
                case 'last90': {
                    const ninetyDaysAgo = new Date();
                    ninetyDaysAgo.setDate(now.getDate() - 90);
                    return tDate >= ninetyDaysAgo;
                }
                case 'ytd':
                    return tDate.getFullYear() === currentYear;
                case 'all':
                default:
                    return true;
            }
        });

        const trends = {};
        let total = 0;

        filteredTransactions.forEach((transaction) => {
            const category = transaction.category[0] || 'Uncategorized';
            trends[category] = (trends[category] || 0) + transaction.amount;
            total += transaction.amount;
        });

        const sortedSpending = Object.entries(trends)
            .map(([category, amount]) => ({ category, amount }))
            .sort((a, b) => b.amount - a.amount);

        const topCategories = sortedSpending.slice(0, 8);
        const otherCategories = sortedSpending.slice(8);
        const otherTotal = otherCategories.reduce((sum, item) => sum + item.amount, 0);

        if (otherTotal > 0) {
            topCategories.push({ category: 'Other', amount: otherTotal });
        }

        const chartLabels = topCategories.map((item) => item.category);
        const chartData = topCategories.map((item) => item.amount);

        const chart = {
            labels: chartLabels,
            datasets: [
                {
                    label: 'Spending',
                    data: chartData,
                    backgroundColor: [
                        '#FF6384',
                        '#36A2EB',
                        '#FFCE56',
                        '#4BC0C0',
                        '#9966FF',
                        '#FF9F40',
                        '#E7E9ED',
                        '#767676',
                    ],
                    borderWidth: 0,
                },
            ],
        };

        return { table: sortedSpending, chart, total };
    }, [transactions, loading, error, timeRange]);

    if (loading) return <div className="widget-card loading">Loading trends...</div>;
    if (error) return <div className="widget-card error">Error: {error}</div>;

    return (
        <div className="spending-trends-container widget-card">
            <div className="widget-header flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">Spending Trends</h3>
                <select
                    className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded px-2 py-1 text-xs"
                    value={timeRange}
                    onChange={(e) => setTimeRange(e.target.value)}
                >
                    <option value="thisMonth">This Month</option>
                    <option value="lastMonth">Last Month</option>
                    <option value="last30">Last 30 Days</option>
                    <option value="last90">Last 90 Days</option>
                    <option value="ytd">YTD ({new Date().getFullYear()})</option>
                    <option value="all">All Time</option>
                </select>
            </div>

            {spendingData.table.length > 0 ? (
                <div className="spending-content">
                    <div className="chart-section flex flex-col items-center justify-center p-4 relative">
                        <div className="h-48 w-48 relative">
                            <Doughnut
                                data={spendingData.chart}
                                options={{
                                    cutout: '70%',
                                    plugins: { legend: { display: false } },
                                }}
                            />
                            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                <span className="text-xs text-[var(--text-secondary)]">Total</span>
                                <span className="text-lg font-bold">
                                    {new Intl.NumberFormat('en-US', {
                                        style: 'currency',
                                        currency: 'USD',
                                        maximumFractionDigits: 0,
                                    }).format(spendingData.total)}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="table-section mt-4 max-h-60 overflow-y-auto pr-2">
                        <table className="w-full text-sm">
                            <tbody>
                                {spendingData.table.map(({ category, amount }) => (
                                    <tr
                                        key={category}
                                        className="border-b border-[var(--border-color)] last:border-0 hover:bg-[var(--bg-secondary)]"
                                    >
                                        <td className="py-2">{category}</td>
                                        <td className="py-2 text-right font-mono">
                                            {new Intl.NumberFormat('en-US', {
                                                style: 'currency',
                                                currency: 'USD',
                                            }).format(amount)}
                                        </td>
                                        <td className="py-2 text-right text-xs text-[var(--text-secondary)] w-12">
                                            {((amount / spendingData.total) * 100).toFixed(1)}%
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center h-48 text-[var(--text-secondary)]">
                    <p>No spending found for this period.</p>
                </div>
            )}
        </div>
    );
};

export default SpendingTrends;
