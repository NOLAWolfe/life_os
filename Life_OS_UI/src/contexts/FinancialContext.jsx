import React, { createContext, useState, useContext, useEffect } from 'react';
import tillerService from '../services/tillerService';

const FinancialContext = createContext();

export const useFinancials = () => {
    return useContext(FinancialContext);
};

export const FinancialProvider = ({ children }) => {
    const [accounts, setAccounts] = useState([]); // Master accounts list
    const [transactions, setTransactions] = useState([]);
    const [categories, setCategories] = useState([]);
    const [debtAccounts, setDebtAccounts] = useState([]);
    const [summaryBalances, setSummaryBalances] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Auto-load files on mount for troubleshooting
    useEffect(() => {
        const loadInitialData = async () => {
            setLoading(true);
            const loadFile = async (name, url, setter, processor, hasHeader = true) => {
                try {
                    const data = await tillerService.fetchAndParseCsv(url, hasHeader);
                    if (data) {
                        const processed = processor ? processor(data) : data;
                        setter(processed);
                        console.log(`${name} auto-loaded successfully`);
                    }
                } catch (err) {
                    console.warn(`Failed to auto-load ${name}:`, err);
                    // We don't set a global error here to allow manual recovery
                }
            };

            await Promise.all([
                loadFile('Accounts', '/Accounts.csv', setAccounts, tillerService.processAccountsData),
                loadFile('Transactions', '/Transactions.csv', (processed) => setTransactions(processed.transactions), tillerService.processTillerData),
                loadFile('Debt Payoff', '/Debt Payoff Planner.csv', setDebtAccounts, tillerService.processDebtData, false), // hasHeader = false
                loadFile('Categories', '/Categories.csv', setCategories),
                loadFile('Balances', '/Balances.csv', setSummaryBalances)
            ]);

            setLoading(false);
        };

        loadInitialData();
    }, []);

    const handleTransactionsUpload = (data) => {
        setLoading(true);
        try {
            const { transactions: processedTransactions } = tillerService.processTillerData(data);
            setTransactions(processedTransactions || []);
            setError(null);
        } catch (e) {
            setError(e.message);
            console.error("Error processing Tiller transactions data:", e);
        } finally {
            setLoading(false);
        }
    };

    const handleAccountsUpload = (data) => {
        setLoading(true);
        try {
            const processedAccounts = tillerService.processAccountsData(data);
            setAccounts(processedAccounts || []);
            setError(null);
        } catch (e) {
            setError(e.message);
            console.error("Error processing Tiller accounts data:", e);
        } finally {
            setLoading(false);
        }
    };

    const handleBalancesUpload = (data) => {
        // Balances.csv is mostly summary info
        setSummaryBalances(data);
    };

    const handleCategoriesUpload = (data) => {
        setCategories(data);
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

    const value = {
        accounts,
        transactions,
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
    };

    return (
        <FinancialContext.Provider value={value}>
            {children}
        </FinancialContext.Provider>
    );
};
