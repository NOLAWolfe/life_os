import logger from './logger/logger';
import securityService from './securityService';
import { TransactionSchema, AccountSchema, DebtSchema } from './schemas';

/**
 * Validates data against a Zod schema, logging warnings but returning the data.
 * Used to ensure visibility without crashing.
 */
const validate = (schema, data, context) => {
    const result = schema.safeParse(data);
    if (!result.success) {
        logger.warn(`Schema Validation Failed: ${context}`, {
            errors: result.error.format(),
            data,
        });
    }
    return data;
};

/**
 * Robustly cleans a string representation of a number.
 */
export const cleanNum = (val) => {
    if (val === undefined || val === null || val === '') return 0;
    if (typeof val === 'number') return val;

    let strVal = String(val).trim();
    if (!strVal) return 0;

    const isNegative = strVal.includes('(') || strVal.includes('-');
    const cleaned = strVal.replace(/[^0-9.]/g, '');
    const num = cleaned === '' ? 0 : parseFloat(cleaned);

    return isNegative ? -num : num;
};

// --- API Integrations (The New Standard) ---

/**
 * API Integration: Fetch all accounts from SQLite.
 */
export const fetchAccountsFromDb = async (userId) => {
    const query = userId ? `?userId=${userId}` : '';
    const res = await fetch(`/api/finance/accounts${query}`);
    if (!res.ok) throw new Error('Failed to fetch accounts from DB');
    const data = await res.json();
    if (!data || !Array.isArray(data)) return [];

    return data.map((acc) =>
        validate(
            AccountSchema,
            {
                account_id: acc.id,
                name: securityService.sanitize(acc.name),
                institution: acc.institution || 'Unknown',
                type: acc.type || 'Other',
                balances: {
                    current: acc.balance,
                },
                class: acc.class?.toUpperCase() || 'ASSET',
                lastUpdate: acc.lastUpdated,
            },
            `Account: ${acc.name}`
        )
    );
};

/**
 * API Integration: Fetch all transactions from SQLite.
 */
export const fetchTransactionsFromDb = async (userId) => {
    const query = userId ? `?userId=${userId}` : '';
    const res = await fetch(`/api/finance/txns${query}`);
    if (!res.ok) throw new Error('Failed to fetch transactions from DB');
    const data = await res.json();
    if (!data || !Array.isArray(data)) return [];

    return data.map((t) =>
        validate(
            TransactionSchema,
            {
                id: t.id,
                date: t.date,
                name: securityService.sanitize(t.description),
                amount: Math.abs(t.amount),
                type: t.type,
                category: t.category || 'Uncategorized',
                accountName: securityService.sanitize(t.account?.name) || 'Unknown',
                institution: t.account?.institution || 'N/A',
                isLateral: t.isLateral,
                isSideHustle: t.isSideHustle,
            },
            `Transaction: ${t.description}`
        )
    );
};

/**
 * API Integration: Fetch all debt items from SQLite.
 */
export const fetchDebtsFromDb = async (userId) => {
    const query = userId ? `?userId=${userId}` : '';
    const res = await fetch(`/api/finance/debts${query}`);
    if (!res.ok) throw new Error('Failed to fetch debts from DB');
    const data = await res.json();
    if (!data || !Array.isArray(data)) return [];

    return data.map((d) =>
        validate(
            DebtSchema,
            {
                name: d.name,
                originalName: d.name,
                interestRate: d.interestRate,
                minPayment: d.minPayment,
                currentBalance: d.balance,
                payoffMonth: d.dueDate || 'Unknown',
                active: true,
                priority: d.priority,
            },
            `Debt: ${d.name}`
        )
    );
};

/**
 * API Integration: Upload parsed account data to backend.
 */
export const uploadAccountsToDb = async (accounts, userId) => {
    const res = await fetch('/api/finance/accounts/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-User-ID': userId },
        body: JSON.stringify(accounts),
    });
    return await res.json();
};

/**
 * API Integration: Upload parsed transaction data to backend.
 */
export const uploadTransactionsToDb = async (transactions, userId) => {
    const res = await fetch('/api/finance/txns/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-User-ID': userId },
        body: JSON.stringify(transactions),
    });
    return await res.json();
};

// --- Client-Side Analytics Helpers ---

/**
 * Extracts income streams from transactions.
 * Uses pre-calculated isSideHustle and isLateral flags.
 */
export const processIncomeData = (transactions) => {
    if (!transactions || !Array.isArray(transactions) || transactions.length === 0) return [];

    const dates = transactions.map((t) => new Date(t.date)).filter((d) => !isNaN(d));
    let monthsDivisor = 1;
    if (dates.length > 0) {
        const newest = new Date(); // Use TODAY as the anchor for averaging
        const oldest = new Date(Math.min(...dates));
        const diffInMs = newest - oldest;
        const diffInDays = diffInMs / (1000 * 60 * 60 * 24);
        
        // Use a minimum of 1 month, otherwise calculate true month count
        monthsDivisor = Math.max(diffInDays / 30.44, 1);
    }

    const incomeTransactions = transactions.filter((t) => {
        if (t.type !== 'credit') return false;
        
        const isLateral = t.isLateral;
        const isSideHustle = t.isSideHustle;
        
        // Treat anything categorized as 'Income' or 'Salary' or 'Paycheck' as income
        const cat = String(t.category || '').toLowerCase();
        const isIncomeCat = cat.includes('income') || cat.includes('salary') || cat.includes('paycheck');
        
        const shouldInclude = isSideHustle || (isIncomeCat && !isLateral) || (!isLateral);
        
        if (!shouldInclude) {
            console.log('[IncomeProcessing] Excluding Credit:', { 
                desc: t.name, 
                cat: t.category, 
                isLateral, 
                isSideHustle 
            });
        }

        return shouldInclude;
    });

    const streamsMap = new Map();

    incomeTransactions.forEach((t) => {
        let source = t.category;
        if (Array.isArray(source)) source = source[0];
        if (!source || source === 'Uncategorized') source = 'Other Income';

        if (t.isSideHustle) {
            source = 'DJ Business / Side Hustle';
        }

        if (!streamsMap.has(source)) {
            streamsMap.set(source, {
                name: source,
                total: 0,
                count: 0,
                transactions: [],
                accounts: new Set(),
            });
        }

        const stream = streamsMap.get(source);
        stream.total += t.amount;
        stream.count += 1;
        stream.transactions.push(t);
        if (t.accountName) stream.accounts.add(t.accountName);
    });

    return Array.from(streamsMap.values())
        .map((stream) => ({
            ...stream,
            average: stream.total / stream.count,
            monthlyAvg: stream.total / monthsDivisor,
            primaryAccount: Array.from(stream.accounts)[0] || 'Unknown',
        }))
        .sort((a, b) => b.total - a.total);
};

/**
 * Calculates monthly cash flow (Income vs Expenses).
 * Explicitly excludes Lateral Transfers.
 */
export const calculateCashFlow = (transactions) => {
    if (!transactions || transactions.length === 0) {
        return { income: 0, expenses: 0, surplus: 0, months: 0 };
    }

    const dates = transactions.map((t) => new Date(t.date)).filter((d) => !isNaN(d));
    if (dates.length < 2) return { income: 0, expenses: 0, surplus: 0, months: 1 };

    const newest = new Date(Math.max(...dates));
    const oldest = new Date(Math.min(...dates));
    const diffInMs = newest - oldest;
    const diffInDays = diffInMs / (1000 * 60 * 60 * 24);
    const months = Math.max(diffInDays / 30.44, 1);

    let totalIncome = 0;
    let totalExpenses = 0;

    transactions.forEach((t) => {
        if (t.type === 'credit') {
            if (t.isSideHustle) {
                totalIncome += t.amount;
            } else if (!t.isLateral) {
                totalIncome += t.amount;
            }
        } else if (t.type === 'debit') {
            if (!t.isLateral) {
                totalExpenses += t.amount;
            }
        }
    });

    const monthlyIncome = totalIncome / months;
    const monthlyExpenses = totalExpenses / months;

    return {
        monthlyIncome,
        monthlyExpenses,
        surplus: monthlyIncome - monthlyExpenses,
        months,
    };
};

const tillerService = {
    fetchAccountsFromDb,
    fetchTransactionsFromDb,
    fetchDebtsFromDb,
    uploadAccountsToDb,
    uploadTransactionsToDb,
    processIncomeData,
    calculateCashFlow,
    cleanNum,
};

export default tillerService;
