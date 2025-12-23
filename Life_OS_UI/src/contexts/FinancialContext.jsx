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
            const [dbAccounts, dbTxns, dbDebts] = await Promise.all([
                tillerService.fetchAccountsFromDb(),
                tillerService.fetchTransactionsFromDb(),
                tillerService.fetchDebtsFromDb()
            ]);
            
            if (dbAccounts) setAccounts(dbAccounts);
            if (dbTxns) setTransactions(dbTxns);
            if (dbDebts) setDebtAccounts(dbDebts);
            
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
            
            // Refresh from the modular backend (Source of Truth)
            await refreshFromDb();

            setLoading(false);
        };

        init();
    }, [refreshFromDb]);

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
        handleBalancesUpload,
        handleCategoriesUpload,
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
