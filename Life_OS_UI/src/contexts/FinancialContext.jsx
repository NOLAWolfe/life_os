import React, { createContext, useState, useContext, useEffect, useCallback, useMemo } from 'react';
import tillerService from '../services/tillerService';

const FinancialContext = createContext();

export const useFinancials = () => {
    return useContext(FinancialContext);
};

export const FinancialProvider = ({ children }) => {
    const [accounts, setAccounts] = useState([]); 
    const [transactions, setTransactions] = useState([]);
    const [categories, setCategories] = useState([]);
    const [debtAccounts, setDebtAccounts] = useState([]);
    const [summaryBalances, setSummaryBalances] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    /**
     * Master Sync: Fetches latest data from the modular backend.
     */
    const refreshFromDb = useCallback(async () => {
        try {
            console.log("Syncing with modular backend...");
            const [dbAccounts, dbTxns] = await Promise.all([
                tillerService.fetchAccountsFromDb(),
                tillerService.fetchTransactionsFromDb()
            ]);
            
            if (dbAccounts) setAccounts(dbAccounts);
            if (dbTxns) setTransactions(dbTxns);
            
            console.log("Backend sync complete.");
        } catch (err) {
            console.warn("Backend sync failed. Using local state only.", err);
        }
    }, []);

    // Update income streams and cash flow whenever transactions change
    const incomeStreams = useMemo(() => {
        if (transactions.length === 0) return [];
        return tillerService.processIncomeData(transactions);
    }, [transactions]);

    const cashFlow = useMemo(() => {
        if (transactions.length === 0) return { monthlyIncome: 0, monthlyExpenses: 0, surplus: 0 };
        return tillerService.calculateCashFlow(transactions);
    }, [transactions]);

    // Initial Load Sequence
    useEffect(() => {
        const init = async () => {
            setLoading(true);
            
            // 1. Try to load local fallback files (for troubleshooting/offline)
            const loadFile = async (name, url, setter, processor, hasHeader = true) => {
                try {
                    const data = await tillerService.fetchAndParseCsv(url, hasHeader);
                    if (data) {
                        const processed = processor ? processor(data) : data;
                        setter(processed);
                    }
                } catch (err) { /* Silent fail for auto-load */ }
            };

            await Promise.all([
                loadFile('Accounts', '/Accounts.csv', setAccounts, tillerService.processAccountsData),
                loadFile('Transactions', '/Transactions.csv', (processed) => setTransactions(processed.transactions), tillerService.processTillerData),
                loadFile('Debt Payoff', '/Debt Payoff Planner.csv', setDebtAccounts, tillerService.processDebtData, false),
                loadFile('Categories', '/Categories.csv', setCategories, tillerService.processCategoriesData),
                loadFile('Balances', '/Balances.csv', setSummaryBalances)
            ]);

            // 2. Refresh from the modular backend (Source of Truth)
            await refreshFromDb();

            setLoading(false);
        };

        init();
    }, [refreshFromDb]);

    const handleTransactionsUpload = async (data) => {
        setLoading(true);
        try {
            // Send raw CSV JSON to backend for processing and storage
            const result = await tillerService.uploadTransactionsToDb(data);
            console.log("Transaction upload result:", result);
            
            // Refresh state from DB to get normalized data
            await refreshFromDb();
            setError(null);
        } catch (e) {
            setError(e.message);
            console.error("Error uploading transactions:", e);
        } finally {
            setLoading(false);
        }
    };

    const handleAccountsUpload = async (data) => {
        setLoading(true);
        try {
            const result = await tillerService.uploadAccountsToDb(data);
            console.log("Account upload result:", result);
            
            await refreshFromDb();
            setError(null);
        } catch (e) {
            setError(e.message);
            console.error("Error uploading accounts:", e);
        } finally {
            setLoading(false);
        }
    };

    const handleBalancesUpload = (data) => {
        setSummaryBalances(data);
    };

    const handleCategoriesUpload = (data) => {
        setLoading(true);
        try {
            const processedCategories = tillerService.processCategoriesData(data);
            setCategories(processedCategories || []);
            setError(null);
        } catch (e) {
            setError(e.message);
            console.error("Error processing Tiller categories data:", e);
        } finally {
            setLoading(false);
        }
    };

    const handleDebtUpload = (data) => {
        setLoading(true);
        try {
            const processedDebt = tillerService.processDebtData(data);
            setDebtAccounts(processedDebt || []);
            setError(null);
        } catch (e) {
            setError(e.message);
            console.error("Error processing Tiller debt data:", e);
        } finally {
            setLoading(false);
        }
    };

    const value = useMemo(() => ({
        accounts,
        transactions,
        incomeStreams,
        cashFlow,
        categories,
        debtAccounts,
        summaryBalances,
        loading,
        error,
        handleTransactionsUpload,
        handleAccountsUpload,
        handleBalancesUpload,
        handleCategoriesUpload,
        handleDebtUpload,
        refreshFromDb
    }), [
        accounts,
        transactions,
        incomeStreams,
        cashFlow,
        categories,
        debtAccounts,
        summaryBalances,
        loading,
        error,
        refreshFromDb
    ]);

    return (
        <FinancialContext.Provider value={value}>
            {children}
        </FinancialContext.Provider>
    );
};
