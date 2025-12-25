import React, { useState, useMemo } from 'react';
import { useFinancials } from '../../../contexts/FinancialContext';
import { calculatePayoff } from '../../../services/debtService';
import './DebtPayoffPlanner.css';

const DebtPayoffPlanner = () => {
    const { debtAccounts } = useFinancials();
    const [strategy, setStrategy] = useState('avalanche');
    const [extraPayment, setExtraPayment] = useState(0);

    const payoffInfo = useMemo(() => {
        return calculatePayoff(debtAccounts, extraPayment, strategy);
    }, [debtAccounts, extraPayment, strategy]);

    if (!debtAccounts || debtAccounts.length === 0) {
        return (
            <div className="debt-planner-empty">
                <h3>Debt Payoff Planner</h3>
                <p>Upload your Tiller Debt Payoff CSV to see your plan.</p>
            </div>
        );
    }

    const totalCurrentDebt = debtAccounts.reduce((sum, acc) => sum + acc.currentBalance, 0);

    return (
        <div className="debt-planner-container">
            <header className="debt-planner-header">
                <h3>Debt Payoff Planner</h3>
                <div className="total-debt-badge">
                    Total Debt: $
                    {totalCurrentDebt.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                    })}
                </div>
            </header>

            <div className="planner-controls">
                <div className="control-group">
                    <label>Strategy:</label>
                    <select value={strategy} onChange={(e) => setStrategy(e.target.value)}>
                        <option value="avalanche">Avalanche (Highest Interest)</option>
                        <option value="snowball">Snowball (Smallest Balance)</option>
                        <option value="hybrid">Hybrid (Small Win First)</option>
                    </select>
                </div>
                <div className="control-group">
                    <label>Monthly Extra:</label>
                    <div className="input-with-symbol">
                        <span>$</span>
                        <input
                            type="number"
                            value={extraPayment}
                            onChange={(e) => setExtraPayment(Number(e.target.value))}
                            min="0"
                            step="10"
                        />
                    </div>
                </div>
            </div>

            {payoffInfo?.status === 'NEGATIVE_AMORTIZATION' || payoffInfo?.isInfinite ? (
                <div className="debt-warning-alert">
                    <h4>ℹ️ Strategic Note: Long-term Debt Structure</h4>
                    <p>
                        Some of your loans (possibly student loans) are structured with minimum
                        payments that barely cover interest. This is a common predatory tactic.
                    </p>
                    {payoffInfo.trapDebts.length > 0 && (
                        <p>
                            Focus area: <strong>{payoffInfo.trapDebts.join(', ')}</strong>
                        </p>
                    )}
                    <p>
                        To see these balances actually decrease, we recommend a small "Active Plan"
                        adjustment of at least <strong>$50-$100</strong> extra per month when your
                        budget allows.
                    </p>
                </div>
            ) : payoffInfo ? (
                <div className="payoff-summary">
                    <div className="summary-card">
                        <span className="summary-label">Estimated Payoff Date</span>
                        <span className="summary-value highlight">{payoffInfo.payoffDate}</span>
                    </div>
                    <div className="summary-card">
                        <span className="summary-label">Total Interest to Pay</span>
                        <span className="summary-value">
                            {payoffInfo.totalInterest > 1000000
                                ? `$${(payoffInfo.totalInterest / 1000000).toFixed(1)}M`
                                : `$${payoffInfo.totalInterest.toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
                        </span>
                    </div>
                    <div className="summary-card">
                        <span className="summary-label">Months to Freedom</span>
                        <span className="summary-value">
                            {payoffInfo.totalMonths >= 720 ? '720+' : payoffInfo.totalMonths}
                        </span>
                    </div>
                </div>
            ) : null}

            <div className="debt-list">
                <h4>Your Debts</h4>
                <div className="debt-grid-header">
                    <span>Account</span>
                    <span>Balance</span>
                    <span>Rate</span>
                    <span>Min Pay</span>
                </div>
                {debtAccounts
                    .filter((d) => d.currentBalance > 0)
                    .map((debt, index) => (
                        <div key={index} className="debt-row">
                            <span className="debt-name">{debt.name}</span>
                            <span className="debt-balance">
                                ${debt.currentBalance.toLocaleString()}
                            </span>
                            <span className="debt-rate">{debt.interestRate}%</span>
                            <span className="debt-min">${debt.minPayment}</span>
                        </div>
                    ))}
            </div>

            <div className="ai-recommendation">
                <h4>Active Plan Recommendation</h4>
                <p>
                    {strategy === 'avalanche'
                        ? 'The Avalanche method is mathematically superior, saving you the most in interest.'
                        : strategy === 'snowball'
                          ? 'The Snowball method focuses on psychological wins by clearing small balances fast.'
                          : 'The Hybrid method gives you a quick psychological win before switching to interest optimization.'}
                    {extraPayment > 0
                        ? ` Your extra $${extraPayment} is being applied to your highest priority debt first.`
                        : ' Consider adding even $50/month to see how much faster you could be debt-free.'}
                </p>
            </div>
        </div>
    );
};

export default DebtPayoffPlanner;
