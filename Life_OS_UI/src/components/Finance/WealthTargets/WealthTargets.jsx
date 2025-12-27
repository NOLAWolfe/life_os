import React from 'react';
import { useFinancials } from '../../../hooks/useFinancialData';
import './WealthTargets.css';

const WealthTargets = () => {
    const { incomeStreams, accounts } = useFinancials();

    // 10X Goals
    const INCOME_GOAL = 1000000; // $1M Annual
    const NET_WORTH_GOAL = 5000000; // $5M Net Worth

    // 1. Calculate Current Net Worth
    const currentNetWorth = React.useMemo(() => {
        if (!accounts) return 0;
        return accounts.reduce((sum, acc) => {
            return sum + (acc.balances?.current || 0);
        }, 0);
    }, [accounts]);

    // 2. Calculate annual run rate
    const annualRunRate = React.useMemo(() => {
        if (!incomeStreams || incomeStreams.length === 0) return 0;
        const totalMonthly = incomeStreams.reduce((acc, s) => acc + (s.monthlyAvg || 0), 0);
        return totalMonthly * 12;
    }, [incomeStreams]);

    const incomeProgress = Math.min((annualRunRate / INCOME_GOAL) * 100, 100);
    const nwProgress = Math.min((currentNetWorth / NET_WORTH_GOAL) * 100, 100);

    return (
        <div className="wealth-targets-widget widget-card">
            <div className="widget-header flex justify-between items-center mb-6">
                <h2 className="widget-title">10X Targets</h2>
                <div className="flex gap-2">
                    <span className="badge moonshot">Moonshot</span>
                    <span className="badge defensive">Offense-Only</span>
                </div>
            </div>

            <div className="targets-grid space-y-8">
                {/* Metric 1: Annual Income */}
                <div className="target-item">
                    <div className="flex justify-between items-end mb-2">
                        <div className="label-group">
                            <span className="label text-[10px] uppercase font-bold text-gray-500">Annual Run Rate</span>
                            <h3 className="value text-2xl font-black text-white">
                                ${Math.round(annualRunRate).toLocaleString()}
                            </h3>
                        </div>
                        <div className="goal-status text-right">
                            <span className="text-[10px] text-gray-500 block uppercase">Target</span>
                            <span className="text-xs font-bold text-green-400">${(INCOME_GOAL/1000000).toFixed(1)}M</span>
                        </div>
                    </div>
                    <div className="progress-container h-2 bg-gray-800 rounded-full overflow-hidden border border-white/5">
                        <div 
                            className="progress-fill h-full bg-gradient-to-r from-green-600 to-green-400" 
                            style={{ width: `${incomeProgress}%` }}
                        ></div>
                    </div>
                    <p className="text-[9px] text-gray-500 mt-1 uppercase tracking-wider font-bold">
                        {incomeProgress.toFixed(2)}% of 10X Line
                    </p>
                </div>

                {/* Metric 2: Net Worth */}
                <div className="target-item">
                    <div className="flex justify-between items-end mb-2">
                        <div className="label-group">
                            <span className="label text-[10px] uppercase font-bold text-gray-500">Total Net Worth</span>
                            <h3 className={`value text-2xl font-black ${currentNetWorth < 0 ? 'text-red-400' : 'text-blue-400'}`}>
                                ${Math.round(currentNetWorth).toLocaleString()}
                            </h3>
                        </div>
                        <div className="goal-status text-right">
                            <span className="text-[10px] text-gray-500 block uppercase">Target</span>
                            <span className="text-xs font-bold text-blue-400">${(NET_WORTH_GOAL/1000000).toFixed(1)}M</span>
                        </div>
                    </div>
                    <div className="progress-container h-2 bg-gray-800 rounded-full overflow-hidden border border-white/5">
                        <div 
                            className="progress-fill h-full bg-gradient-to-r from-blue-600 to-blue-400" 
                            style={{ width: `${Math.max(0, nwProgress)}%` }}
                        ></div>
                    </div>
                    <p className="text-[9px] text-gray-500 mt-1 uppercase tracking-wider font-bold">
                        {Math.max(0, nwProgress).toFixed(2)}% Scaled
                    </p>
                </div>
            </div>

            <div className="strategy-note mt-8 pt-4 border-t border-white/5 text-[10px] italic text-gray-500">
                "Go small, stay small. 10X your targets. The actions required are different." - Grant Cardone
            </div>
        </div>
    );
};

export default WealthTargets;
