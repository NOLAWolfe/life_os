import React, { createContext, useState, useContext, useMemo } from 'react';
import tillerService from '../services/tillerService';
import { useAccounts, useTransactions, useDebts } from '../hooks/useFinancialData';

const FinancialContext = createContext();

export const useFinancials = () => {
    return useContext(FinancialContext);
};

export const FinancialProvider = ({ children }) => {
    const {
        data: accounts = [],
        isLoading: accountsLoading,
        refetch: refetchAccounts,
    } = useAccounts();
    const {
        data: transactions = [],
        isLoading: txnsLoading,
        refetch: refetchTxns,
    } = useTransactions();
    const { data: debtAccounts = [], isLoading: debtsLoading, refetch: refetchDebts } = useDebts();

    const [categories, setCategories] = useState([]);
    const [summaryBalances, setSummaryBalances] = useState(null);
    const [error, setError] = useState(null);

    const loading = accountsLoading || txnsLoading || debtsLoading;

    /**
     * Master Sync: Triggers React Query refetch for all financial data.
     */
    const refreshFromDb = async () => {
        await Promise.all([refetchAccounts(), refetchTxns(), refetchDebts()]);
    };

    // Update income streams and cash flow whenever transactions change
    const incomeStreams = useMemo(() => {
        if (transactions.length === 0) return [];
        return tillerService.processIncomeData(transactions);
    }, [transactions]);

    const cashFlow = useMemo(() => {
        if (transactions.length === 0) return { monthlyIncome: 0, monthlyExpenses: 0, surplus: 0 };
        return tillerService.calculateCashFlow(transactions);
    }, [transactions]);

    const handleBalancesUpload = (data) => {
        setSummaryBalances(data);
    };

    const handleCategoriesUpload = (data) => {
        try {
            const processedCategories = tillerService.processCategoriesData(data);
            setCategories(processedCategories || []);
            setError(null);
        } catch (e) {
            setError(e.message);
            console.error('Error processing Tiller categories data:', e);
        }
    };

    const value = useMemo(
        () => ({
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
            refreshFromDb,
        }),
        [
            accounts,
            transactions,
            incomeStreams,
            cashFlow,
            categories,
            debtAccounts,
            summaryBalances,
            loading,
            error,
        ]
    );

    return <FinancialContext.Provider value={value}>{children}</FinancialContext.Provider>;
};
