import { useContext } from 'react';
import { useQuery } from '@tanstack/react-query';
import tillerService from '../services/tillerService';
import { FinancialContext, UserContext } from '../contexts/contextRegistry';

export const useAccounts = (userId) => {
    return useQuery({
        queryKey: ['accounts', userId],
        queryFn: () => tillerService.fetchAccountsFromDb(userId),
        staleTime: 1000 * 60 * 5, // 5 minutes
    });
};

export const useTransactions = (userId) => {
    return useQuery({
        queryKey: ['transactions', userId],
        queryFn: () => tillerService.fetchTransactionsFromDb(userId),
        staleTime: 1000 * 60 * 5,
    });
};

export const useDebts = (userId) => {
    return useQuery({
        queryKey: ['debts', userId],
        queryFn: () => tillerService.fetchDebtsFromDb(userId),
        staleTime: 1000 * 60 * 5,
    });
};

export const useFinancials = () => {
    return useContext(FinancialContext);
};

export const useUser = () => {
    return useContext(UserContext);
};