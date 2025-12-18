import React, { useMemo } from 'react';
import { useFinancials } from '../../contexts/FinancialContext';
import './SmallWinWidget.css';

const SmallWinWidget = () => {
    const { debtAccounts } = useFinancials();

    const priorityDebt = useMemo(() => {
        if (!debtAccounts || debtAccounts.length === 0) return null;
        
        // Find the most urgent debt (highest interest rate as default priority)
        return [...debtAccounts]
            .filter(d => d.currentBalance > 0)
            .sort((a, b) => b.interestRate - a.interestRate)[0];
    }, [debtAccounts]);

    if (!priorityDebt) {
        return (
            <div className="small-win-widget empty">
                <h4>Financial Goal</h4>
                <p>Upload debt data to see your next small win!</p>
            </div>
        );
    }

    return (
        <div className="small-win-widget">
            <div className="widget-header">
                <h4>Next Small Win</h4>
                <span className="badge">Active Goal</span>
            </div>
            <div className="win-content">
                <p>Focus your next payment on:</p>
                <h3 className="debt-name">{priorityDebt.name}</h3>
                <div className="win-stats">
                    <div className="stat">
                        <span className="label">Balance</span>
                        <span className="value">${priorityDebt.currentBalance.toLocaleString()}</span>
                    </div>
                    <div className="stat">
                        <span className="label">Interest</span>
                        <span className="value">{priorityDebt.interestRate}%</span>
                    </div>
                </div>
                <div className="recommendation">
                    Pay <strong>${(priorityDebt.minPayment + 50).toLocaleString()}</strong> this week to save significantly on interest.
                </div>
            </div>
        </div>
    );
};

export default SmallWinWidget;
