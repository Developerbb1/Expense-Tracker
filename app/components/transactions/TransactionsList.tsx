'use client';

import { useTransactionData } from '../transactions/hooks/useTransactionData';
import { useEffect } from 'react';
import { currency, dateFormatter } from '@/lib/supabase/helper';
import { getCategoryIcon } from '@/app/data/types';

interface TransactionsListProps {
  recentTransactions?: boolean;
}
export default function TransactionsList({
  recentTransactions,
}: TransactionsListProps) {
  const { loading, fetchData, transactions } = useTransactionData(
    recentTransactions ?? false
  );

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  return (
    <>
      <div>
        <div className="table-wrapper">
          <table className="list-table">
            <thead>
              <tr>
                <th>Transaction</th>
                <th>Date</th>
                <th>Category</th>
                <th>Amount</th>
                <th>Account</th>
                <th>Type</th>
              </tr>
            </thead>
            {loading ? (
              <tbody>
                <tr>
                  <td colSpan={5} className="empty">
                    <div className="flex items-center justify-center gap-2 py-6">
                      <span className="loading-spinner" />
                    </div>
                  </td>
                </tr>
              </tbody>
            ) : transactions.length === 0 ? (
              <tbody>
                <tr>
                  <td colSpan={5}>
                    <h1>No transactions found</h1>
                    <p>Try again.</p>
                  </td>
                </tr>
              </tbody>
            ) : (
              <>
                <tbody>
                  {transactions.map((transaction, idx) => {
                    const index = idx + 1;

                    // const Icon = getTransactionIcon(transaction);
                    const Icon = getCategoryIcon(transaction.icon);
                    const formattedDate = dateFormatter.format(
                      new Date(`${transaction.transaction_date}T12:00:00`)
                    );
                    const incomeStyle =
                      transaction.type === 'income'
                        ? 'transaction-icon-income'
                        : 'transaction-icon-expense';
                    return (
                      <tr
                        key={transaction.id}
                        className={index % 2 === 0 ? 'bg-white' : 'bg-blue-50'}
                      >
                        <td>
                          <div className="transaction-description">
                            <span className={`transaction-icon ${incomeStyle}`}>
                              {' '}
                              <Icon size={17} />
                            </span>
                            <span>{transaction.description}</span>
                          </div>
                        </td>
                        <td className="transaction-date">{formattedDate}</td>
                        <td>
                          <span
                            className={`transaction-type-badge  ${incomeStyle}`}
                          >
                            {transaction.category_name}
                          </span>
                        </td>
                        <td>
                          {transaction.type === 'income' ? '+' : '-'}
                          {currency.format(transaction.amount)}
                        </td>
                        <td>
                          <span>{transaction.account_name}</span>
                        </td>
                        <td>
                          <span
                            className={`transaction-type-badge  ${incomeStyle}`}
                          >
                            {transaction.type}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </>
            )}
          </table>
        </div>
      </div>
    </>
  );
}
