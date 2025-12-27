import React, { useState, useEffect, useMemo } from 'react';
import { useFinancials } from '../../../contexts/FinancialContext';
import './WealthMentor.css';

const WealthMentor = () => {
    const { hottestDollar, debtAccounts, incomeStreams } = useFinancials();

    const advice = useMemo(() => {
        const surplus = hottestDollar?.surplus || 0;
        const totalDebt = (debtAccounts || []).reduce((sum, d) => sum + (d.currentBalance || 0), 0);
        const activeIncome = (incomeStreams || [])
            .filter(s => s.type === 'active')
            .reduce((sum, s) => sum + (s.monthlyAvg || 0), 0);

        // 1. Critical Debt Logic (High Interest Priority)
        const highInterestDebt = (debtAccounts || []).find(d => d.interestRate > 20);
        if (highInterestDebt && surplus > 0) {
            return {
                quote: "Interest is the penalty you pay for waiting. Kill the debt, then buy the assets.",
                action: `Dump your $${Math.round(surplus).toLocaleString()} surplus into ${highInterestDebt.name} today. It's bleeding you at ${highInterestDebt.interestRate}%.`
            };
        }

        // 2. Expansion Logic (Healthy Surplus)
        if (surplus > 1500) {
            return {
                quote: "Cash is trash. Cash flow is king.",
                action: `You have $${Math.round(surplus).toLocaleString()} in attack capital. Don't let it sit in checking. Identify one income-producing asset to buy this week.`
            };
        }

        // 3. Offense Logic (Low Surplus)
        if (surplus < 500) {
            return {
                quote: "You don't have a spending problem, you have an income problem.",
                action: "Your monthly surplus is thin. Stop focusing on saving pennies and start 10X-ing your income activities. Reach out to 5 new potential clients or leads today."
            };
        }

        // Default / Balanced
        return {
            quote: "Success is your duty, obligation, and responsibility.",
            author: "Grant Cardone",
            action: "Review your 10X Targets. Are your daily actions matching the scale of your goals?"
        };
    }, [hottestDollar, debtAccounts, incomeStreams]);

    return (
        <div className="wealth-mentor-widget widget-card border-l-4 border-accent">
            <header className="flex justify-between items-start mb-4">
                <h2 className="widget-title m-0 text-primary">The Wealth Mentor</h2>
                <span className="text-[10px] bg-accent/10 text-accent px-2 py-0.5 rounded font-black uppercase">10X Active</span>
            </header>
            
            <div className="quote-container mb-6 italic border-l-2 border-white/5 pl-4 py-2">
                <p className="quote text-sm text-gray-300">"{advice.quote}"</p>
                <p className="author text-[10px] text-gray-500 mt-1">— Grant Cardone</p>
            </div>

            <div className="action-step p-4 bg-accent/5 rounded-lg border border-accent/10">
                <span className="label text-[10px] uppercase font-bold text-accent block mb-2">Tactical 10X Action:</span>
                <p className="action text-sm font-medium text-white leading-relaxed">
                    {advice.action}
                </p>
            </div>
        </div>
    );
};

export default WealthMentor;
