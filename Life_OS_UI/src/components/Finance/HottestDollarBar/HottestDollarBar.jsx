import React from 'react';
import { useFinancials } from '../../../hooks/useFinancialData';
import './HottestDollarBar.css';

const HottestDollarBar = () => {
    const { hottestDollar, loading } = useFinancials();

    if (loading || !hottestDollar) return null;

    const { amount, totalIncome, totalCommitments, status, isDeficit } = hottestDollar;

    return (
        <div className={`hottest-dollar-bar ${status.toLowerCase()}`}>
            <div className="bar-content container mx-auto px-4 flex justify-between items-center h-full">
                {/* Left: Branding & Status */}
                <div className="flex items-center gap-4">
                    <div className="status-indicator">
                        <div className="pulse-dot"></div>
                        <span className="status-text">{status}</span>
                    </div>
                    <div className="branding">
                        <span className="label text-[10px] uppercase font-bold text-gray-400">The Hottest Dollar</span>
                        <h2 className={`amount text-xl font-black ${isDeficit ? 'text-red-400' : 'text-green-400'}`}>
                            ${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </h2>
                    </div>
                </div>

                {/* Middle: Tactical Breakdown */}
                <div className="hidden md:flex gap-8 text-sm">
                    <div className="stat">
                        <span className="stat-label text-gray-500 mr-2">Monthly Income:</span>
                        <span className="stat-value font-mono text-white">${Math.round(totalIncome).toLocaleString()}</span>
                    </div>
                    <div className="stat">
                        <span className="stat-label text-gray-500 mr-2">Fixed Obligations:</span>
                        <span className="stat-value font-mono text-red-400">-${Math.round(totalCommitments).toLocaleString()}</span>
                    </div>
                </div>

                {/* Right: Attack Strategy */}
                <div className="attack-strategy text-right">
                    <p className="text-[10px] uppercase font-bold text-gray-400">Attack Capital</p>
                    <p className="strategy-recommendation text-xs text-white">
                        {isDeficit 
                            ? 'CRITICAL: Cut variable spending immediately.' 
                            : status === 'GROWTH' 
                                ? 'STRATEGY: Accelerate Debt Avalanche or Buy Assets.' 
                                : 'STRATEGY: Build Emergency Buffer.'}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default HottestDollarBar;
