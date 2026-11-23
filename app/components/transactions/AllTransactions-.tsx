'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import * as LucideIcons from 'lucide-react';

import { useTransactionData } from '@/app/components/transactions/hooks/useTransactionData';
import SearchPanel from '../common/SearchPanel';
import { getCategoryIcon } from '@/app/data/types';
import styles from '@/styles/AllTransactions.styles';
import { dateFormatter, currency } from '@/lib/supabase/helper';

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
        transaction.title,
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

  return (
    <section className={styles.section}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>All Transactions</h2>
          <p className={styles.subtitle}>
            View, search and manage your transactions.
          </p>
        </div>
      </div>

      {/* Search and filters */}
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

      {/* Transaction list */}
      <div className={styles.list}>
        {/* Desktop headings */}
        <div className="hidden md:block">
          <div className={`${styles.gridColumnsHeader}  `}>
            <div>Transaction</div>
            <div>Date</div>
            <div>Category</div>
            <div>Account</div>
            <div>Type</div>
            <div className="text-right">Amount</div>
            <div className="text-right"></div>
          </div>
        </div>

        {loading ? (
          <div className={styles.loading}>
            <span className={styles.spinner} />
            <span className={styles.loadingText}>Loading transactions...</span>
          </div>
        ) : visibleTransactions.length === 0 ? (
          <div className={styles.emptyState}>
            <LucideIcons.Search size={26} className="text-slate-300" />
            <h3 className={styles.emptyTitle}>No transactions found</h3>
            <p className={styles.emptyText}>
              Try changing your search or filter criteria.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {visibleTransactions.map((transaction) => {
              const Icon = getCategoryIcon(transaction.icon);

              const isIncome =
                String(transaction.type).toLowerCase() === 'income';

              const formattedDate = dateFormatter.format(
                new Date(`${transaction.date}T12:00:00`)
              );

              const iconStyle = isIncome
                ? styles.incomeIcon
                : styles.expenseIcon;

              const badgeStyle = isIncome
                ? styles.incomeBadge
                : styles.expenseBadge;

              const amountStyle = isIncome
                ? styles.incomeAmount
                : styles.expenseAmount;

              return (
                <div
                  key={transaction.id}
                  className={`${styles.gridColumns} ${styles.row}`}
                >
                  {/* Transaction title and icon */}
                  <div className={styles.transactionInfo}>
                    <div className={`${styles.categoryIcon} ${iconStyle}`}>
                      <Icon size={19} />
                    </div>

                    <div className={styles.transactionDetails}>
                      <p className={styles.transactionTitle}>
                        {transaction.title}
                      </p>

                      <p className={styles.mobileMeta}>
                        {transaction.category} · {transaction.account}
                      </p>

                      <p className={styles.mobileDate}>{formattedDate}</p>
                    </div>
                  </div>

                  {/* Desktop date */}
                  <div className={styles.desktopDate}>{formattedDate}</div>

                  {/* Desktop category */}
                  <div className={styles.desktopCategory}>
                    <span className={`${styles.desktopAccount}`}>
                      {transaction.category}
                    </span>
                  </div>

                  {/* Desktop account */}
                  <div className={styles.desktopAccount}>
                    {transaction.account}
                  </div>

                  {/* Desktop transaction type */}
                  <div className={styles.desktopType}>
                    <span className={`${styles.typeBadge} ${badgeStyle}`}>
                      {isIncome ? (
                        <LucideIcons.ArrowDownLeft size={14} />
                      ) : (
                        <LucideIcons.ArrowUpRight size={14} />
                      )}
                      {transaction.type}
                    </span>
                  </div>

                  {/* Amount, type and mobile actions */}
                  <div className={styles.amountContainer}>
                    <strong className={`${styles.amount} ${amountStyle}`}>
                      {isIncome ? '+' : '-'}
                      {currency.format(transaction.amount)}
                    </strong>

                    <span className={`${styles.mobileTypeBadge} ${badgeStyle}`}>
                      {transaction.type}
                    </span>

                    {/* Mobile actions: below amount and badge */}
                    <div className={styles.mobileActions}>
                      <button
                        type="button"
                        className={styles.editButton}
                        aria-label={`Edit ${transaction.title}`}
                        title="Edit transaction"
                        onClick={() => {
                          console.log('Edit transaction:', transaction.id);
                        }}
                      >
                        <LucideIcons.Pencil size={16} />
                      </button>

                      <button
                        type="button"
                        className={styles.deleteButton}
                        aria-label={`Delete ${transaction.title}`}
                        title="Delete transaction"
                        onClick={() => {
                          console.log('Delete transaction:', transaction.id);
                        }}
                      >
                        <LucideIcons.Trash2 size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Desktop actions: seventh grid column */}
                  <div className={styles.desktopActions}>
                    <button
                      type="button"
                      className={styles.editButton}
                      aria-label={`Edit ${transaction.title}`}
                      title="Edit transaction"
                      onClick={() => {
                        console.log('Edit transaction:', transaction.id);
                      }}
                    >
                      <LucideIcons.Pencil size={16} />
                    </button>

                    <button
                      type="button"
                      className={styles.deleteButton}
                      aria-label={`Delete ${transaction.title}`}
                      title="Delete transaction"
                      onClick={() => {
                        console.log('Delete transaction:', transaction.id);
                      }}
                    >
                      <LucideIcons.Trash2 size={16} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className={styles.pagination}>
        <p className={styles.paginationText}>
          Showing{' '}
          {filteredTransactions.length === 0
            ? 0
            : (currentPage - 1) * ITEMS_PER_PAGE + 1}
          –{Math.min(currentPage * ITEMS_PER_PAGE, filteredTransactions.length)}{' '}
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
    </section>
  );
}
