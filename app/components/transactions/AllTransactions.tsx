'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import * as LucideIcons from 'lucide-react';
import { useTransactionData } from '@/app/components/transactions/hooks/useTransactionData';
import SearchPanel from '../common/SearchPanel';
import { getCategoryIcon, TransactionFormData } from '@/app/data/types';
import styles from '@/styles/AllTransactions.styles';
import { dateFormatter, currency } from '@/lib/supabase/helper';
import EditTransactionModal from '@/app/components/transactions/EditTransactionModal';
import DeleteTransactionModal from '@/app/components/transactions/DeleteTransactionModal';
import toast from 'react-hot-toast';
import {
  deleteTransaction,
  updateTransaction,
} from '@/lib/supabase/transaction/actions';
import '@/styles/transactions.css';

const ITEMS_PER_PAGE = 5;

type TransactionType = 'All' | 'Income' | 'Expense';

export default function AllTransactions() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<TransactionType>('All');
  const [page, setPage] = useState(1);
  const [category, setCategory] = useState('All');
  const [account, setAccount] = useState('All');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [editingTransaction, setEditingTransaction] =
    useState<TransactionFormData | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [saving, setSaving] = useState(false);

  const { loading, userAccounts, categories, fetchData, transactions } =
    useTransactionData(false);

  useEffect(() => {
    void fetchData();
  }, [fetchData]);

  const resetPage = useCallback(() => {
    setPage(1);
  }, []);

  const filteredTransactions = useMemo(() => {
    const query = search.trim().toLowerCase();

    return transactions.filter((transaction) => {
      const matchesSearch = [
        transaction.description,
        transaction.category,
        transaction.account,
      ].some((value) =>
        String(value ?? '')
          .toLowerCase()
          .includes(query)
      );

      const normalizedType = String(transaction.type).toLowerCase();

      const matchesType =
        filter === 'All' || normalizedType === filter.toLowerCase();

      const matchesCategory =
        category === 'All' ||
        transaction.category_id === category ||
        transaction.category ===
          categories.find((item) => item.id === category)?.name;

      const matchesAccount =
        account === 'All' ||
        transaction.account_id === account ||
        transaction.account ===
          userAccounts.find((item) => item.id === account)?.name;

      const transactionDate = String(transaction.date).slice(0, 10);

      return (
        matchesSearch &&
        matchesType &&
        matchesCategory &&
        matchesAccount &&
        (!startDate || transactionDate >= startDate) &&
        (!endDate || transactionDate <= endDate)
      );
    });
  }, [
    transactions,
    search,
    filter,
    category,
    account,
    startDate,
    endDate,
    categories,
    userAccounts,
  ]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredTransactions.length / ITEMS_PER_PAGE)
  );

  const currentPage = Math.min(page, totalPages);

  const visibleTransactions = filteredTransactions.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  function openEditModal(transaction: TransactionFormData) {
    setEditingTransaction(transaction);
    setShowEditModal(true);
  }
  function openDeleteModal(transaction: TransactionFormData) {
    setEditingTransaction(transaction);
    setShowDeleteModal(true);
  }

  async function handleUpdateTransaction(data: TransactionFormData) {
    setSaving(true);
    try {
      console.log('handle', data);
      const result = await updateTransaction(data);
      if (!result?.success) {
        toast.error(result?.error ?? 'Failed to update transaction');
        return;
      }
      toast.success('Transaction updated successfully', { duration: 3000 });
      setShowEditModal(false);
      setEditingTransaction(null);
      window.location.reload();
    } catch (error) {
      console.error('Failed to update category:', error);
      toast.error(
        error instanceof Error
          ? error.message
          : 'Failed to update Transaction.',
        { className: 'error-toast' }
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteTransactions(data: TransactionFormData) {
    setSaving(true);
    try {
      const transactionId = data?.id;
      if (!transactionId) {
        toast.error('Transaction ID is required');
        return;
      }
      const result = await deleteTransaction(transactionId);
      if (!result?.success) {
        toast.error(result?.error ?? 'Failed to delete transaction');
        return;
      }
      toast.success('Transaction deleted successfully', { duration: 3000 });
      setEditingTransaction(null);
      setShowDeleteModal(false);
      window.location.reload();
    } catch (error) {
      console.error('Failed to delete category:', error);
      toast.error(
        error instanceof Error
          ? error.message
          : 'Failed to delete Transaction.',
        { className: 'error-toast' }
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <section className={styles.section}>
      <div className={styles.filters}>
        <SearchPanel
          search={search}
          onSearchChange={(value) => {
            setSearch(value);
            resetPage();
          }}
          placeholder="Search..."
        />

        <select
          className={styles.select}
          value={category}
          onChange={(event) => {
            setCategory(event.target.value);
            resetPage();
          }}
          aria-label="Filter by category"
        >
          <option value="All">All categories</option>
          {categories.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </select>

        <select
          className={styles.select}
          value={account}
          onChange={(event) => {
            setAccount(event.target.value);
            resetPage();
          }}
          aria-label="Filter by account"
        >
          <option value="All">All accounts</option>
          {userAccounts.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </select>

        <div className={styles.dateContainer}>
          <LucideIcons.CalendarDays
            size={17}
            className="shrink-0 text-slate-400"
          />

          <input
            type="date"
            value={startDate}
            onChange={(event) => {
              setStartDate(event.target.value);
              resetPage();
            }}
            aria-label="From date"
            className={styles.dateInput}
          />

          <span className="text-slate-400">-</span>

          <input
            type="date"
            value={endDate}
            min={startDate || undefined}
            onChange={(event) => {
              setEndDate(event.target.value);
              resetPage();
            }}
            aria-label="To date"
            className={styles.dateInput}
          />
        </div>
      </div>

      {/* Transaction type tabs */}
      <div className={styles.tabs}>
        {(['All', 'Income', 'Expense'] as const).map((type) => (
          <button
            key={type}
            type="button"
            className={`${styles.tabBase} ${
              filter === type ? styles.tabActive : styles.tabInactive
            }`}
            onClick={() => {
              setFilter(type);
              resetPage();
            }}
          >
            {type}
            {type === 'All' && (
              <span className={styles.countBadge}>{transactions.length}</span>
            )}
          </button>
        ))}
      </div>
      <div className="table-wrapper hidden md:block ">
        <table className="list-table w-full table-fixed">
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="empty">
                  <div className="flex items-center justify-center gap-2 ">
                    <span className="loading-spinner" />
                    <span className="text-sm text-blue-800">
                      Loading transactions...
                    </span>
                  </div>
                </td>
              </tr>
            ) : (
              <>
                {visibleTransactions.map((transaction, idx) => {
                  const index = idx + 1;
                  const Icon = getCategoryIcon(transaction.icon);

                  const formattedDate = dateFormatter.format(
                    new Date(`${transaction.transaction_date}T12:00:00`)
                  );
                  const isIncome =
                    String(transaction.type).toLowerCase() === 'income';
                  const amtStyle = isIncome
                    ? 'amount-income'
                    : 'amount-expense';

                  const incomeStyle =
                    transaction.type === 'income'
                      ? 'transaction-icon-income'
                      : 'transaction-icon-expense';

                  return (
                    <tr
                      key={transaction.id}
                      className={index % 2 === 0 ? 'bg-white' : 'bg-blue-50'}
                    >
                      <td className="w-2/7">
                        <div className="flex min-w-0 flex-col gap-1">
                          <div className="transaction-description ">
                            <div className={`transaction-icon ${incomeStyle}`}>
                              <Icon size={21} />
                            </div>
                            <span>{transaction.description}</span>
                          </div>
                        </div>
                      </td>
                      <td className="w-1/7">
                        <span className="text-sm text-slate-500">
                          {formattedDate}
                        </span>
                      </td>
                      <td className="w-1/7">
                        <div className="flex min-w-0 flex-col gap-1">
                          <span className="text-sm text-slate-500">
                            {transaction.category_name}
                          </span>
                        </div>
                      </td>
                      <td className="w-1/7">
                        <span className=" text-slate-500">
                          {transaction.account_name}
                        </span>
                      </td>

                      <td className="w-1/7">
                        <div className="flex items-center justify-center">
                          <span
                            className={`transaction-type-badge  ${incomeStyle}`}
                          >
                            {transaction.type}
                          </span>
                        </div>
                      </td>
                      <td className="w-1/7">
                        <div className="flex min-w-0 items-center gap-3 justify-end px-2">
                          <div className="flex min-w-0 flex-col gap-1 transaction-amount">
                            <div className="flex justify-end gap-3  text-slate-500 ">
                              <span
                                className={` transaction-amount ${amtStyle}`}
                              >
                                {transaction.type === 'income' ? '+' : '-'}
                                {currency.format(transaction.amount)}
                              </span>

                              <button
                                type="button"
                                aria-label={`Edit ${transaction.description}`}
                                title={`Edit ${transaction.description}`}
                                onClick={() => openEditModal(transaction)}
                              >
                                <LucideIcons.Pencil size={16} />
                              </button>

                              <button
                                type="button"
                                aria-label={`Delete ${transaction.description}`}
                                title={`Delete ${transaction.description}`}
                                onClick={() => openDeleteModal(transaction)}
                              >
                                <LucideIcons.Trash size={16} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </>
            )}
          </tbody>
        </table>
      </div>
      {/* Transaction list for mobile */}
      <div className="table-wrapper  md:hidden ">
        <table className="list-table w-full table-fixed text-sm">
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={2} className="empty">
                  <div className="flex items-center justify-center gap-2 ">
                    <span className="loading-spinner" />
                    <span className=" text-blue-800">
                      Loading transactions...
                    </span>
                  </div>
                </td>
              </tr>
            ) : (
              <>
                {visibleTransactions.map((transaction) => {
                  const Icon = getCategoryIcon(transaction.icon);

                  const formattedDate = dateFormatter.format(
                    new Date(`${transaction.transaction_date}T12:00:00`)
                  );
                  const isIncome =
                    String(transaction.type).toLowerCase() === 'income';
                  const amtStyle = isIncome
                    ? 'amount-income'
                    : 'amount-expense';

                  const incomeStyle =
                    transaction.type === 'income'
                      ? 'transaction-icon-income'
                      : 'transaction-icon-expense';
                  return (
                    <tr key={transaction.id} className="table-tr-box">
                      <td className="w-1/2">
                        <div className="flex min-w-0 flex-col gap-1">
                          <div className="transaction-description ">
                            <div className={`transaction-icon ${incomeStyle}`}>
                              <Icon size={21} />
                            </div>
                            <span>{transaction.description}</span>
                          </div>
                        </div>
                        <div className=" text-slate-500">{formattedDate}</div>
                        <div className=" text-slate-500">
                          {transaction.account_name}
                        </div>
                      </td>

                      <td className="w-1/7">
                        <div className="flex min-w-0 items-center gap-3 justify-end px-2">
                          <div className="flex min-w-0 flex-col gap-1 transaction-amount">
                            <div className="flex justify-end gap-3  text-slate-500 ">
                              <span
                                className={` transaction-amount ${amtStyle}`}
                              >
                                {transaction.type === 'income' ? '+' : '-'}
                                {currency.format(transaction.amount)}
                              </span>
                            </div>
                            <div className="flex justify-end gap-3  text-slate-500 ">
                              <span
                                className={`transaction-type-badge  ${incomeStyle}`}
                              >
                                {transaction.type}
                              </span>
                            </div>
                            <div className="flex justify-end gap-3  text-slate-500 ">
                              <button
                                type="button"
                                aria-label={`Edit ${transaction.description}`}
                                title={`Edit ${transaction.description}`}
                                onClick={() => openEditModal(transaction)}
                              >
                                <LucideIcons.Pencil size={16} />
                              </button>

                              <button
                                type="button"
                                aria-label={`Delete ${transaction.description}`}
                                title={`Delete ${transaction.description}`}
                                onClick={() => openDeleteModal(transaction)}
                              >
                                <LucideIcons.Trash size={16} />
                              </button>
                            </div>
                          </div>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className={styles.pagination}>
        <p className={styles.paginationText}>
          Showing{' '}
          {filteredTransactions.length === 0
            ? 0
            : (currentPage - 1) * ITEMS_PER_PAGE + 1}
          -{Math.min(currentPage * ITEMS_PER_PAGE, filteredTransactions.length)}{' '}
          of {filteredTransactions.length} transactions
        </p>

        <div className={styles.paginationControls}>
          <button
            type="button"
            className={styles.navigationButton}
            disabled={currentPage === 1}
            onClick={() => setPage((previous) => Math.max(1, previous - 1))}
            aria-label="Previous page"
          >
            <LucideIcons.ChevronLeft size={18} />
          </button>

          {Array.from({ length: totalPages }, (_, index) => index + 1)
            .filter(
              (pageNumber) =>
                pageNumber === 1 ||
                pageNumber === totalPages ||
                Math.abs(pageNumber - currentPage) <= 1
            )
            .map((pageNumber, index, pages) => (
              <span className="flex items-center gap-1" key={pageNumber}>
                {index > 0 && pageNumber - pages[index - 1] > 1 && (
                  <span className={styles.ellipsis}>…</span>
                )}

                <button
                  type="button"
                  className={`${styles.pageButton} ${
                    currentPage === pageNumber
                      ? styles.pageButtonActive
                      : styles.pageButtonInactive
                  }`}
                  onClick={() => setPage(pageNumber)}
                  aria-current={currentPage === pageNumber ? 'page' : undefined}
                >
                  {pageNumber}
                </button>
              </span>
            ))}

          <button
            type="button"
            className={styles.navigationButton}
            disabled={currentPage === totalPages}
            onClick={() =>
              setPage((previous) => Math.min(totalPages, previous + 1))
            }
            aria-label="Next page"
          >
            <LucideIcons.ChevronRight size={18} />
          </button>
        </div>
      </div>
      <EditTransactionModal
        isOpen={showEditModal}
        transaction={editingTransaction}
        onClose={() => {
          setShowEditModal(false);
          setEditingTransaction(null);
        }}
        onSubmit={handleUpdateTransaction}
      />

      <DeleteTransactionModal
        isOpen={showDeleteModal}
        transaction={editingTransaction}
        isSaving={saving}
        onClose={() => {
          setShowDeleteModal(false);
          setEditingTransaction(null);
        }}
        onSubmit={handleDeleteTransactions}
      />
    </section>
  );
}
