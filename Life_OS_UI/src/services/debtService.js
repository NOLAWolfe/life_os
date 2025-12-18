/**
 * Debt Payoff Service
 * Logic for Snowball, Avalanche, and Hybrid payoff strategies.
 */

/**
 * Calculates a payoff schedule based on a specific strategy.
 * @param {Array} accounts - List of debt accounts.
 * @param {Number} monthlyExtra - Additional amount to pay each month.
 * @param {String} strategy - 'snowball', 'avalanche', or 'hybrid'.
 */
export const calculatePayoff = (accounts, monthlyExtra = 0, strategy = 'avalanche') => {
    if (!accounts || accounts.length === 0) return null;

    // Filter active debts with balance > 0
    let activeDebts = accounts
        .filter(a => a.currentBalance > 0)
        .map(a => ({ ...a, balance: a.currentBalance }));

    if (activeDebts.length === 0) return { totalMonths: 0, totalInterest: 0, schedule: [] };

    // Sort based on strategy
    if (strategy === 'snowball') {
        activeDebts.sort((a, b) => a.balance - b.balance);
    } else if (strategy === 'avalanche') {
        activeDebts.sort((a, b) => b.interestRate - a.interestRate);
    } else if (strategy === 'hybrid') {
        const smallest = [...activeDebts].sort((a, b) => a.balance - b.balance)[0];
        const others = activeDebts.filter(a => a.name !== smallest.name)
            .sort((a, b) => b.interestRate - a.interestRate);
        activeDebts = [smallest, ...others];
    }

    let totalMonths = 0;
    let totalInterestPaid = 0;
    const schedule = [];
    const currentDebts = activeDebts.map(d => ({ 
        ...d, 
        isStudentLoan: /student|loan|group id/i.test(d.name) // Tiller often groups student loans as 'Group Id'
    }));
    
    // Check for negative amortization for reporting but don't stop the simulation
    const problematicDebts = currentDebts.filter(d => {
        const monthlyRate = (d.interestRate / 100) / 12;
        return (d.balance * monthlyRate) > d.minPayment;
    });

    const totalMonthlyInterest = currentDebts.reduce((sum, d) => sum + (d.balance * (d.interestRate / 100) / 12), 0);
    const totalMinPayments = currentDebts.reduce((sum, d) => sum + d.minPayment, 0);
    
    // Hardcoded income for contextual alerts (could be moved to context later)
    const monthlyNetIncome = 5000;
    const debtToIncomeRatio = totalMinPayments / monthlyNetIncome;

    let status = 'HEALTHY';
    if (totalMonthlyInterest >= (totalMinPayments + monthlyExtra)) {
        status = 'NEGATIVE_AMORTIZATION';
    } else if (problematicDebts.length > 0) {
        status = 'SLOW_PAYOFF';
    }
    
    if (debtToIncomeRatio > 0.5) {
        status = 'UNREALISTIC_PAYMENTS';
    }

    // Simulate month by month
    // Increased max to 720 months (60 years) to accommodate predatory loan structures
    while (currentDebts.some(d => d.balance > 0) && totalMonths < 720) { 
        totalMonths++;
        let extraLeft = monthlyExtra;
        let monthlyInterestTotal = 0;

        // 1. Calculate and add interest
        for (const debt of currentDebts) {
            if (debt.balance <= 0) continue;
            const interest = debt.balance * ((debt.interestRate / 100) / 12);
            monthlyInterestTotal += interest;
            totalInterestPaid += interest;
            debt.balance += interest;
        }

        // 2. Apply minimum payments
        for (const debt of currentDebts) {
            if (debt.balance <= 0) continue;
            const payment = Math.min(debt.balance, debt.minPayment);
            debt.balance -= payment;
        }

        // 3. Apply extra payment to the priority debt
        for (const debt of currentDebts) {
            if (debt.balance > 0) {
                const extraPayment = Math.min(debt.balance, extraLeft);
                debt.balance -= extraPayment;
                extraLeft -= extraPayment;
                if (extraLeft <= 0) break;
            }
        }
    }

    return {
        totalMonths,
        totalInterest: totalInterestPaid,
        payoffDate: totalMonths >= 720 ? 'Beyond 60 Years' : calculateDate(totalMonths),
        status,
        trapDebts: problematicDebts.map(d => d.name),
        isInfinite: totalMonths >= 720
    };
};

const calculateDate = (months) => {
    const date = new Date();
    date.setMonth(date.getMonth() + months);
    return date.toLocaleString('default', { month: 'short', year: 'numeric' });
};

const debtService = {
    calculatePayoff,
};

export default debtService;
