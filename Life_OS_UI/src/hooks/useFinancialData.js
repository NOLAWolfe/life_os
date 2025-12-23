import { useQuery } from '@tanstack/react-query';
import tillerService from '../services/tillerService';

export const useAccounts = () => {
  return useQuery({
    queryKey: ['accounts'],
    queryFn: tillerService.fetchAccountsFromDb,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
};

export const useTransactions = () => {
  return useQuery({
    queryKey: ['transactions'],
    queryFn: tillerService.fetchTransactionsFromDb,
    staleTime: 1000 * 60 * 5,
  });
};

export const useDebts = () => {
  return useQuery({
    queryKey: ['debts'],
    queryFn: tillerService.fetchDebtsFromDb,
    staleTime: 1000 * 60 * 5,
  });
};
