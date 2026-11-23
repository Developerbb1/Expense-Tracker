'use client';

import { useCallback, useState } from 'react';
import { toast } from 'react-hot-toast';

import { Account, Category, TransactionWithDetails } from '@/app/data/types';

import { authenticateUser } from '@/lib/supabase/actions';
import { getAccounts } from '@/lib/supabase/accounts/actions';
import { getCategories } from '@/lib/supabase/categories/actions';
import { fetchTransactions } from '@/lib/supabase/transaction/actions';

export function useTransactionData(recentTransaction: boolean = false) {
  const [userAccounts, setUserAccounts] = useState<Account[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [transactions, setTransactions] = useState<TransactionWithDetails[]>(
    []
  );
  const [loading, setLoading] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);

    try {
      await authenticateUser();

      const [accountsResult, categoriesResult, transactionResult] =
        await Promise.all([
          getAccounts(),
          getCategories(),
          fetchTransactions(),
        ]);

      setUserAccounts(accountsResult.accounts);
      setCategories(categoriesResult.categories);

      const allTransactions = transactionResult.transactions;

      setTransactions(
        recentTransaction ? allTransactions.slice(0, 4) : allTransactions
      );
    } catch (error) {
      console.error('Error fetching transaction data:', error);

      toast.error('Failed to load accounts and categories. Please try again.', {
        className: 'error-toast',
      });
    } finally {
      setLoading(false);
    }
  }, [recentTransaction]);

  return {
    loading,
    userAccounts,
    categories,
    transactions,
    fetchData,
  };
}
