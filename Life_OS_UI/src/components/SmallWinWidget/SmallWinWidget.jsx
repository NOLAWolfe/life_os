import React, { useMemo } from 'react';
import { useFinancials } from '../../contexts/FinancialContext';
import './SmallWinWidget.css';

const SmallWinWidget = () => {
    const { debtAccounts, cashFlow } = useFinancials();

    const priorityDebt = useMemo(() => {
        if (!debtAccounts || debtAccounts.length === 0) return null;
        
        // Find the most urgent debt (highest interest rate as default priority)
        return [...debtAccounts]
            .filter(d => d.currentBalance > 0)
            .sort((a, b) => b.interestRate - a.interestRate)[0];
    }, [debtAccounts]);

    const recommendation = useMemo(() => {
        if (!priorityDebt) return null;

        // Default "Stub" Logic if no cash flow data
        let amount = priorityDebt.minPayment + 50;
        let message = "Pay this week to save significantly on interest.";
        let type = "standard"; // standard, warning, aggressive

        // Smart Logic if Cash Flow is available
        if (cashFlow && cashFlow.months > 0) {
            const { surplus } = cashFlow;

            if (surplus <= 0) {
                amount = priorityDebt.minPayment;
                message = "Warning: Monthly expenses exceed income. Stick to minimum payments.";
                type = "warning";
            } else {
                // Recommend 50% of surplus, but cap it if it's huge, or ensure it's at least min + 50
                const aggressivePayment = surplus * 0.5; 
                // We want to be aggressive but realistic. 
                // If 50% surplus is LESS than min payment, we have a problem, but let's assume min payment is mandatory.
                // So the "Extra" is what we are calculating.
                
                const suggestedTotal = Math.min(aggressivePayment, priorityDebt.currentBalance);
                
                if (suggestedTotal > priorityDebt.minPayment) {
                     amount = suggestedTotal;
                     message = `Based on your $${Math.floor(surplus)} monthly surplus, you can attack this debt.`;
                     type = "aggressive";
                }
            }
        }
        
        return { amount, message, type };
    }, [priorityDebt, cashFlow]);

    if (!priorityDebt) {
        return (
            <div className="small-win-widget empty">
                <h4>Financial Goal</h4>
                <p>Upload debt data to see your next small win!</p>
            </div>
        );
    }

    return (
        <div className={`small-win-widget ${recommendation?.type}`}>
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
                    Pay <strong>${Math.floor(recommendation.amount).toLocaleString()}</strong> this week.
                    <p className="rec-note">{recommendation.message}</p>
                </div>
            </div>
        </div>
    );
};

export default SmallWinWidget;
