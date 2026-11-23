'use server';
import {
  BalanceSummary,
  ExpenseSummary,
  IncomeSummary,
  SavingsSummary,
  TransactionFormData,
} from '@/app/data/types';
import { getAuthenticatedUser } from '../actions';
import { createClient } from '../server';

export async function addTransaction(
  data: TransactionFormData
): Promise<{ success: boolean; error: string | null }> {
  try {
    const user = await getAuthenticatedUser();
    const supabase = await createClient();

    // 1. Create transaction
    const { data: newTransaction, error: insertError } = await supabase
      .from('transactions')
      .insert({
        user_id: user.id,
        account_id: data.account_id,
        category_id: data.category_id,
        type: data.type,
        amount: data.amount,
        description: data.description.trim(),
        transaction_date: data.transaction_date,
        payment_method: data.payment_method,
        notes: data.notes?.trim() || null,
      })
      .select()
      .single();

    if (insertError) {
      console.error('Failed to create transaction:', insertError);

      return {
        success: false,
        error: insertError.message,
      };
    }

    if (!newTransaction) {
      return {
        success: false,
        error: 'Transaction was not created.',
      };
    }

    // 2. Calculate balance adjustment
    let balanceChange = 0;

    if (data.type === 'income') {
      balanceChange = data.amount;
    } else if (data.type === 'expense') {
      balanceChange = -data.amount;
    } else if (data.type === 'transfer') {
      // Transfers should be handled separately
      // when you have source and destination accounts.
      balanceChange = 0;
    }
    // 3. Update account balance

    // Update account balance
    if (balanceChange !== 0) {
      console.log('STEP 4: Calling balance RPC...');

      const { error: accountError } = await supabase.rpc(
        'adjust_account_balance',
        {
          p_account_id: data.account_id,
          p_user_id: user.id,
          p_amount: balanceChange,
        }
      );

      if (accountError) {
        console.error('STEP 5: RPC FAILED:', accountError);
        throw accountError;
      }

      console.log('STEP 6: Account balance updated successfully');
    }

    return {
      success: true,
      error: null,
    };
  } catch (error) {
    console.error('Failed to create transaction:', error);

    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Failed to create transaction.',
    };
  }
}

export async function fetchTransactions(): Promise<{
  userId: string;
  transactions: TransactionFormData[];
}> {
  const user = await getAuthenticatedUser();
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('transactions')
    .select(
      `
      id,
      user_id,
      account_id,
      category_id,
      type,
      amount,
      description,
      transaction_date,
      payment_method,
      notes,
      accounts!transactions_account_id_fkey (
        name
      ),
      categories!transactions_category_id_fkey (
        name,
        icon
      )
    `
    )
    .eq('user_id', user.id)
    .order('transaction_date', { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch transactions: ${error.message}`);
  }

  const transactions: TransactionFormData[] = (data ?? []).map(
    (transaction) => {
      const category = Array.isArray(transaction.categories)
        ? transaction.categories[0]
        : transaction.categories;

      const account = Array.isArray(transaction.accounts)
        ? transaction.accounts[0]
        : transaction.accounts;

      return {
        id: transaction.id,
        account_id: transaction.account_id,
        category_id: transaction.category_id,
        type: transaction.type,
        amount: Number(transaction.amount),
        description: transaction.description ?? '',
        transaction_date: transaction.transaction_date,
        payment_method: transaction.payment_method,
        notes: transaction.notes,
        icon: category?.icon ?? 'Tag',
        category_name: category?.name ?? 'Uncategorized',
        account_name: account?.name ?? 'Unknown account',
      };
    }
  );

  return {
    userId: user.id,
    transactions,
  };
}

export async function updateTransactionn(
  data: TransactionFormData
): Promise<{ success: boolean; error: string | null }> {
  try {
    const user = await getAuthenticatedUser();
    const supabase = await createClient();
    console.log('Update data:', data);
    if (!data?.id || !data.account_id || !data.category_id) {
      throw new Error('Transaction ID, account, or category is missing');
    }
    const { data: updatedTransaction, error: updateError } = await supabase
      .from('transactions')
      .update({
        account_id: data.account_id,
        category_id: data.category_id,
        type: data.type,
        amount: data.amount,
        description: data.description.trim(),
        transaction_date: data.transaction_date,
        payment_method: data.payment_method,
        notes: data.notes?.trim() || null,
      })
      .eq('id', data.id)
      .eq('user_id', user.id)
      .select(
        `
        *,
        accounts (
          id,
          name
        ),
        categories (
          id,
          name,
          icon,
          color
        )
      `
      )
      .single();

    if (updateError) {
      console.error('Failed to update transaction:', updateError);

      return {
        success: false,
        error: updateError.message,
      };
    }

    if (!updatedTransaction) {
      return {
        success: false,
        error: 'Transaction was not updated.',
      };
    }

    return {
      success: true,
      error: null,
    };
  } catch (error) {
    console.error('Failed to update transaction:', error);

    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Failed to update transaction.',
    };
  }
}

export async function updateTransaction(
  data: TransactionFormData
): Promise<{ success: boolean; error: string | null }> {
  try {
    const user = await getAuthenticatedUser();
    const supabase = await createClient();

    if (!data?.id || !data.account_id || !data.category_id) {
      throw new Error('Transaction ID, account, or category is missing');
    }

    // 1. Get the existing transaction
    const { data: oldTransaction, error: fetchError } = await supabase
      .from('transactions')
      .select('*')
      .eq('id', data.id)
      .eq('user_id', user.id)
      .single();

    if (fetchError || !oldTransaction) {
      throw new Error(fetchError?.message || 'Transaction not found.');
    }

    // 2. Calculate balance adjustments
    const getBalanceChange = (type: string, amount: number) => {
      if (type === 'income') return amount;
      if (type === 'expense') return -amount;
      return 0;
    };

    const oldBalanceChange = getBalanceChange(
      oldTransaction.type,
      Number(oldTransaction.amount)
    );

    const newBalanceChange = getBalanceChange(data.type, Number(data.amount));

    // 3. Update the transaction
    const { data: updatedTransaction, error: updateError } = await supabase
      .from('transactions')
      .update({
        account_id: data.account_id,
        category_id: data.category_id,
        type: data.type,
        amount: data.amount,
        description: data.description.trim(),
        transaction_date: data.transaction_date,
        payment_method: data.payment_method,
        notes: data.notes?.trim() || null,
      })
      .eq('id', data.id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (updateError || !updatedTransaction) {
      throw new Error(updateError?.message || 'Transaction was not updated.');
    }

    // 4. Reverse the old transaction's balance effect
    const oldAccountAdjustment = -oldBalanceChange;

    // 5. Apply the new transaction's balance effect
    const newAccountAdjustment = newBalanceChange;

    // 6. Update account balances
    if (oldTransaction.account_id === data.account_id) {
      // Same account: apply only the difference
      const adjustment = oldAccountAdjustment + newAccountAdjustment;

      if (adjustment !== 0) {
        const { error: accountError } = await supabase.rpc(
          'adjust_account_balance',
          {
            p_account_id: data.account_id,
            p_user_id: user.id,
            p_amount: adjustment,
          }
        );

        if (accountError) throw accountError;
      }
    } else {
      // Different accounts: reverse old account and update new account
      if (oldAccountAdjustment !== 0) {
        const { error: oldAccountError } = await supabase.rpc(
          'adjust_account_balance',
          {
            p_account_id: oldTransaction.account_id,
            p_user_id: user.id,
            p_amount: oldAccountAdjustment,
          }
        );

        if (oldAccountError) throw oldAccountError;
      }

      if (newAccountAdjustment !== 0) {
        const { error: newAccountError } = await supabase.rpc(
          'adjust_account_balance',
          {
            p_account_id: data.account_id,
            p_user_id: user.id,
            p_amount: newAccountAdjustment,
          }
        );

        if (newAccountError) throw newAccountError;
      }
    }

    return {
      success: true,
      error: null,
    };
  } catch (error) {
    console.error('Failed to update transaction:', error);

    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Failed to update transaction.',
    };
  }
}

export async function deleteTransaction(
  id: string
): Promise<{ success: boolean; error: string | null }> {
  try {
    const user = await getAuthenticatedUser();
    const supabase = await createClient();

    if (!id) {
      throw new Error('Transaction ID is missing');
    }

    // 1. Get the existing transaction
    const { data: transaction, error: fetchError } = await supabase
      .from('transactions')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single();

    if (fetchError || !transaction) {
      throw new Error(fetchError?.message || 'Transaction not found.');
    }

    // 2. Calculate balance adjustment
    // Income: subtract amount
    // Expense: add amount back
    const amount = Number(transaction.amount);

    const adjustment =
      transaction.type === 'income'
        ? -amount
        : transaction.type === 'expense'
          ? amount
          : 0;

    // 3. Delete the transaction
    const { error: deleteError } = await supabase
      .from('transactions')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (deleteError) {
      throw deleteError;
    }

    // 4. Reverse the transaction's balance effect
    if (adjustment !== 0) {
      const { error: accountError } = await supabase.rpc(
        'adjust_account_balance',
        {
          p_account_id: transaction.account_id,
          p_user_id: user.id,
          p_amount: adjustment,
        }
      );

      if (accountError) {
        throw accountError;
      }
    }

    return {
      success: true,
      error: null,
    };
  } catch (error) {
    console.error('Failed to delete transaction:', error);

    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Failed to delete transaction.',
    };
  }
}

export async function getTotalBalanceStats() {
  try {
    const user = await getAuthenticatedUser();
    const supabase = await createClient();

    const today = new Date();

    const formatDate = (date: Date) =>
      `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

    const todayString = formatDate(today);

    const previousMonthEnd = new Date(today.getFullYear(), today.getMonth(), 0);

    const previousMonthEndString = formatDate(previousMonthEnd);

    // 1. Fetch accounts
    const { data: accounts, error: accountError } = await supabase
      .from('accounts')
      .select('id, balance, created_at')
      .eq('user_id', user.id);

    if (accountError) throw accountError;

    // 2. Fetch transactions belonging to the user
    const { data: transactions, error: transactionError } = await supabase
      .from('transactions')
      .select('account_id, amount, type, transaction_date')
      .eq('user_id', user.id)
      .lte('transaction_date', todayString);

    if (transactionError) throw transactionError;

    // 3. Calculate balance for a specific date
    const calculateBalance = (endDate: string) => {
      return (accounts ?? []).reduce((total, account) => {
        const accountStartDate = account.created_at.slice(0, 10);

        // Account did not exist at this date
        if (accountStartDate > endDate) return total;

        const accountTransactions = (transactions ?? []).filter(
          (transaction) =>
            transaction.account_id === account.id &&
            transaction.transaction_date >= accountStartDate &&
            transaction.transaction_date <= endDate
        );

        const accountBalance = accountTransactions.reduce(
          (balance, transaction) => {
            const amount = Number(transaction.amount ?? 0);

            switch (transaction.type) {
              case 'income':
                return balance + amount;

              case 'expense':
                return balance - amount;

              case 'transfer':
                return balance;

              default:
                return balance;
            }
          },
          Number(account.balance ?? 0)
        );

        return total + accountBalance;
      }, 0);
    };

    // 4. Current and previous month balances
    const totalBalance = calculateBalance(todayString);

    const previousMonthBalance = calculateBalance(previousMonthEndString);

    // 5. Percentage difference
    const difference = totalBalance - previousMonthBalance;

    const percentageChange =
      previousMonthBalance !== 0
        ? (difference / Math.abs(previousMonthBalance)) * 100
        : null;

    return {
      success: true,
      totalBalance,
      previousMonthBalance,
      difference,
      percentageChange,
      trend: difference > 0 ? 'up' : difference < 0 ? 'down' : 'neutral',
    };
  } catch (error) {
    console.error('getTotalBalanceStats:', error);

    return {
      success: false,
      totalBalance: 0,
      previousMonthBalance: 0,
      difference: 0,
      percentageChange: null,
      trend: 'neutral' as const,
    };
  }
}

export async function fetchBalanceSummary(): Promise<{
  summary: BalanceSummary;
  income: IncomeSummary;
  expense: ExpenseSummary;
  savings: SavingsSummary;
}> {
  const user = await getAuthenticatedUser();
  const supabase = await createClient();

  const formatDate = (date: Date) =>
    `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

  const now = new Date();

  const todayString = formatDate(now);

  const currentMonthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const currentMonthStartString = formatDate(currentMonthStart);

  const previousMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);

  const previousMonthEndString = formatDate(previousMonthEnd);

  // 1. Fetch active accounts
  const { data: accounts, error: accountsError } = await supabase
    .from('accounts')
    .select('id, balance, created_at')
    .eq('user_id', user.id)
    .eq('is_active', true);

  if (accountsError) {
    throw new Error(accountsError.message);
  }

  const accountList = accounts ?? [];

  const accountIds = accountList.map((account) => account.id);

  if (accountIds.length === 0) {
    return {
      summary: {
        totalBalance: 0,
        percentageChange: 0,
        trend: 'neutral',
      },
      income: {
        monthlyIncome: 0,
        percentageChange: 0,
        trend: 'neutral',
      },
      expense: {
        monthlyExpense: 0,
        percentageChange: 0,
        trend: 'neutral',
      },
    };
  }

  // 2. Fetch current month's transactions
  const { data: transactions, error: transactionsError } = await supabase
    .from('transactions')
    .select('account_id, type, amount, transaction_date')
    .eq('user_id', user.id)
    .in('account_id', accountIds)
    .gte('transaction_date', currentMonthStartString)
    .lte('transaction_date', todayString);

  if (transactionsError) {
    throw new Error(transactionsError.message);
  }

  const transactionList = transactions ?? [];

  // 3. Calculate current total balance
  const totalBalance = accountList.reduce(
    (total, account) => total + Number(account.balance ?? 0),
    0
  );

  // 4. Calculate net balance changes this month
  const getBalanceChange = (transaction: { type: string; amount: number }) => {
    if (transaction.type === 'income') {
      return Number(transaction.amount);
    }

    if (transaction.type === 'expense') {
      return -Number(transaction.amount);
    }

    return 0;
  };

  // 5. Reconstruct previous month's closing balance
  // Exclude accounts that did not exist at previous month-end.
  const previousMonthAccounts = accountList.filter(
    (account) => account.created_at.slice(0, 10) <= previousMonthEndString
  );

  const previousMonthAccountIds = new Set(
    previousMonthAccounts.map((account) => account.id)
  );

  const previousMonthCurrentBalances = previousMonthAccounts.reduce(
    (total, account) => total + Number(account.balance ?? 0),
    0
  );

  const currentMonthNetBalance = transactionList
    .filter((transaction) =>
      previousMonthAccountIds.has(transaction.account_id)
    )
    .reduce((total, transaction) => total + getBalanceChange(transaction), 0);

  const previousMonthBalance =
    previousMonthCurrentBalances - currentMonthNetBalance;

  // 6. Calculate Total Balance percentage
  const difference = currentMonthNetBalance - previousMonthBalance;
  const balancePercentageChange =
    previousMonthBalance !== 0
      ? (difference / Math.abs(previousMonthBalance)) * 100
      : totalBalance === 0
        ? 0
        : 100;

  const balanceTrend: BalanceSummary['trend'] =
    difference > 0 ? 'up' : difference < 0 ? 'down' : 'neutral';

  // 7. Calculate monthly income
  const monthlyIncome = transactionList
    .filter((t) => t.type === 'income')
    .reduce((total, t) => total + Number(t.amount), 0);

  // 8. Calculate monthly expenses
  const monthlyExpense = transactionList
    .filter((t) => t.type === 'expense')
    .reduce((total, t) => total + Number(t.amount), 0);

  // 9. Calculate previous month's income and expenses
  const { data: previousTransactions, error: previousError } = await supabase
    .from('transactions')
    .select('type, amount')
    .eq('user_id', user.id)
    .in('account_id', accountIds)
    .gte(
      'transaction_date',
      formatDate(new Date(now.getFullYear(), now.getMonth() - 1, 1))
    )
    .lte('transaction_date', previousMonthEndString);

  if (previousError) {
    throw new Error(previousError.message);
  }

  const previousList = previousTransactions ?? [];

  const previousMonthIncome = previousList
    .filter((t) => t.type === 'income')
    .reduce((total, t) => total + Number(t.amount), 0);

  const previousMonthExpense = previousList
    .filter((t) => t.type === 'expense')
    .reduce((total, t) => total + Number(t.amount), 0);

  // 10. Percentage helper
  const calculatePercentage = (current: number, previous: number) => {
    if (previous === 0) {
      return current === 0 ? 0 : 100;
    }

    return Number(
      (((current - previous) / Math.abs(previous)) * 100).toFixed(2)
    );
  };

  const incomePercentageChange = calculatePercentage(
    monthlyIncome,
    previousMonthIncome
  );

  const expensePercentageChange = calculatePercentage(
    monthlyExpense,
    previousMonthExpense
  );

  // 11. Calculate monthly savings
  const monthlySavings = monthlyIncome - monthlyExpense;

  const previousMonthSavings = previousMonthIncome - previousMonthExpense;

  // 12. Calculate savings rate
  const calculateSavingsRate = (income: number, savings: number) => {
    if (income <= 0) return 0;

    return Number(((savings / income) * 100).toFixed(2));
  };

  const savingsRate = calculateSavingsRate(monthlyIncome, monthlySavings);

  const previousMonthSavingsRate = calculateSavingsRate(
    previousMonthIncome,
    previousMonthSavings
  );

  // 13. Calculate percentage difference between savings rates
  const savingsRatePercentageChange =
    previousMonthSavingsRate !== 0
      ? Number(
          (
            ((savingsRate - previousMonthSavingsRate) /
              Math.abs(previousMonthSavingsRate)) *
            100
          ).toFixed(2)
        )
      : savingsRate === 0
        ? 0
        : 100;

  const savingsTrend: SavingsSummary['trend'] =
    savingsRatePercentageChange > 0
      ? 'up'
      : savingsRatePercentageChange < 0
        ? 'down'
        : 'neutral';

  return {
    summary: {
      totalBalance,
      percentageChange: Number(balancePercentageChange.toFixed(2)),
      trend: balanceTrend,
    },

    income: {
      monthlyIncome,
      percentageChange: incomePercentageChange,
      trend:
        incomePercentageChange > 0
          ? 'up'
          : incomePercentageChange < 0
            ? 'down'
            : 'neutral',
    },

    expense: {
      monthlyExpense,
      percentageChange: expensePercentageChange,
      trend:
        expensePercentageChange > 0
          ? 'up'
          : expensePercentageChange < 0
            ? 'down'
            : 'neutral',
    },
    savings: {
      monthlySavings,
      savingsRate,
      percentageChange: savingsRatePercentageChange,
      trend: savingsTrend,
    },
  };
}

export async function fetchCurrentMonthTransactions(): Promise<{
  userId: string;
  transactions: TransactionFormData[];
}> {
  const user = await getAuthenticatedUser();
  const supabase = await createClient();

  // Get current month's date range
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    .toISOString()
    .split('T')[0];

  const startOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1)
    .toISOString()
    .split('T')[0];

  const { data, error } = await supabase
    .from('transactions')
    .select(
      `
      id,
      user_id,
      account_id,
      category_id,
      type,
      amount,
      description,
      transaction_date,
      payment_method,
      notes,
      accounts!transactions_account_id_fkey (
        name
      ),
      categories!transactions_category_id_fkey (
        name,
        icon
      )
    `
    )
    .eq('user_id', user.id)
    .gte('transaction_date', startOfMonth)
    .lt('transaction_date', startOfNextMonth)
    .order('transaction_date', { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch transactions: ${error.message}`);
  }

  const transactions: TransactionFormData[] = (data ?? []).map(
    (transaction) => {
      const category = Array.isArray(transaction.categories)
        ? transaction.categories[0]
        : transaction.categories;

      const account = Array.isArray(transaction.accounts)
        ? transaction.accounts[0]
        : transaction.accounts;

      return {
        id: transaction.id,
        account_id: transaction.account_id,
        category_id: transaction.category_id,
        type: transaction.type,
        amount: Number(transaction.amount),
        description: transaction.description ?? '',
        transaction_date: transaction.transaction_date,
        payment_method: transaction.payment_method,
        notes: transaction.notes,
        icon: category?.icon ?? 'Tag',
        category_name: category?.name ?? 'Uncategorized',
        account_name: account?.name ?? 'Unknown account',
      };
    }
  );

  return {
    userId: user.id,
    transactions,
  };
}

export async function getCategorySpending() {
  const { transactions } = await fetchCurrentMonthTransactions();
  const categoryTotals = transactions
    .filter((transaction) => transaction.type === 'expense')
    .reduce<Record<string, number>>((acc, transaction) => {
      const category = transaction.category_name || 'Other';

      acc[category] = (acc[category] || 0) + transaction.amount;

      return acc;
    }, {});

  return Object.entries(categoryTotals)
    .map(([category_name, amount]) => ({
      category_name,
      amount: Number(amount.toFixed(2)),
    }))
    .sort((a, b) => b.amount - a.amount);
}
