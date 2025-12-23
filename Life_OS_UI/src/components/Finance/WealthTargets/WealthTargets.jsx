import React from 'react';
import { useFinancials } from '../../../contexts/FinancialContext';
import './WealthTargets.css';

const WealthTargets = () => {
    const { incomeStreams, transactions } = useFinancials();
    
    // Moonshot goal: $1,000,000 annual income
    const MOONSHOT_GOAL = 1000000;
    
    // Calculate annual run rate based on the date range of transactions
    const annualRunRate = React.useMemo(() => {
        if (!transactions || transactions.length === 0) return 0;

        const totalIncome = incomeStreams.reduce((acc, stream) => acc + stream.total, 0);
        
        // Find date range
        const dates = transactions.map(t => new Date(t.date)).filter(d => !isNaN(d));
        if (dates.length < 2) return totalIncome * 12; // Fallback

        const newest = new Date(Math.max(...dates));
        const oldest = new Date(Math.min(...dates));
        
        // Calculate difference in months (min 1 month to avoid division by zero)
        const diffInMs = newest - oldest;
        const diffInDays = diffInMs / (1000 * 60 * 60 * 24);
        const diffInMonths = Math.max(diffInDays / 30.44, 1); // 30.44 is avg month length
        
        return (totalIncome / diffInMonths) * 12;
    }, [incomeStreams, transactions]);
    
    const progressPercent = Math.min((annualRunRate / MOONSHOT_GOAL) * 100, 100);

    return (
        <div className="wealth-targets-widget widget-card">
            <div className="widget-header">
                <h2 className="widget-title">10X Target (Offense)</h2>
                <span className="badge moonshot">Moonshot</span>
            </div>
            
            <div className="target-metric">
                <span className="label">Annual Run Rate</span>
                <span className="value">${annualRunRate.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
            </div>

            <div className="progress-section">
                <div className="progress-labels">
                    <span>$0</span>
                    <span className="goal-text">Target: ${MOONSHOT_GOAL.toLocaleString()}</span>
                </div>
                <div className="main-progress-bar">
                    <div 
                        className="progress-fill" 
                        style={{ width: `${progressPercent}%` }}
                    >
                        <span className="percent-label">{progressPercent.toFixed(1)}%</span>
                    </div>
                </div>
            </div>

            <div className="strategy-note">
                "You cannot hit a target you do not see." - Grant Cardone
            </div>
        </div>
    );
};

export default WealthTargets;
