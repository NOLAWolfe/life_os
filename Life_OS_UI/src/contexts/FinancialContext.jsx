import React, { useState, useMemo } from 'react';
import tillerService from '../services/tillerService';
import strategyService from '../services/strategyService';
import { useAccounts, useTransactions, useDebts } from '../hooks/useFinancialData';
import { FinancialContext } from './contextRegistry';

export const FinancialProvider = ({ children }) => {
    const {
        data: accounts = [],
        isLoading: accountsLoading,
        isError: accountsError,
        error: accountsErrorDetails,
        refetch: refetchAccounts,
    } = useAccounts();
    const {
        data: transactions = [],
        isLoading: txnsLoading,
        isError: txnsError,
        error: txnsErrorDetails,
        refetch: refetchTxns,
    } = useTransactions();
    const { 
        data: debtAccounts = [], 
        isLoading: debtsLoading, 
        isError: debtsError,
        error: debtsErrorDetails,
        refetch: refetchDebts 
    } = useDebts();

    const [categories, setCategories] = useState([]);
    const [summaryBalances, setSummaryBalances] = useState(null);
    const [error, setError] = useState(null);

    const loading = accountsLoading || txnsLoading || debtsLoading;
    
    // Combine errors
    const combinedError = error || 
                         (accountsError ? `Accounts: ${accountsErrorDetails?.message}` : null) ||
                         (txnsError ? `Transactions: ${txnsErrorDetails?.message}` : null) ||
                         (debtsError ? `Debts: ${debtsErrorDetails?.message}` : null);

    if (combinedError) {
        console.error('FinancialContext Error:', combinedError);
    }

    /**
     * Master Sync: Triggers React Query refetch for all financial data.
     */
    const refreshFromDb = React.useCallback(async () => {
        await Promise.all([refetchAccounts(), refetchTxns(), refetchDebts()]);
    }, [refetchAccounts, refetchTxns, refetchDebts]);

    // Update income streams and cash flow whenever transactions change
    const incomeStreams = useMemo(() => {
        if (transactions.length === 0) return [];
        return tillerService.processIncomeData(transactions);
    }, [transactions]);

    const cashFlow = useMemo(() => {
        if (transactions.length === 0) return { monthlyIncome: 0, monthlyExpenses: 0, surplus: 0 };
        return tillerService.calculateCashFlow(transactions);
    }, [transactions]);

    const hottestDollar = useMemo(() => {
        // 1. Get Mapped Bill Averages (from Sorting Hat rules)
        // We need to pull rules from localStorage here to match the strategy view
        const savedRules = JSON.parse(localStorage.getItem('paymentFlowRules') || '{}');
        const savedNodes = JSON.parse(localStorage.getItem('paymentFlowNodes') || '[]');
        
        const { totalMonthlyCommitments } = strategyService.calculateNodeStats(
            savedNodes,
            accounts,
            transactions,
            savedRules,
            debtAccounts
        );

        return strategyService.calculateHottestDollar(incomeStreams, totalMonthlyCommitments);
    }, [incomeStreams, debtAccounts, transactions, accounts]);

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
            hottestDollar,
            categories,
            debtAccounts,
            summaryBalances,
            loading,
            error: combinedError,
            handleBalancesUpload,
            handleCategoriesUpload,
            refreshFromDb,
        }),
        [
            accounts,
            transactions,
            incomeStreams,
            cashFlow,
            hottestDollar,
            categories,
            debtAccounts,
            summaryBalances,
            loading,
            combinedError,
            refreshFromDb,
        ]
    );

    return <FinancialContext.Provider value={value}>{children}</FinancialContext.Provider>;
};
