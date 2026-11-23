const styles = {
  section:
    'w-full min-w-0 overflow-hidden rounded-xl border border-blue-100 bg-white p-3 shadow-sm sm:rounded-2xl sm:p-5',

  header:
    'mb-4 flex min-w-0 flex-col gap-3 min-[421px]:flex-row min-[421px]:flex-wrap min-[1101px]:flex-nowrap',
  title: 'text-lg font-bold tracking-tight text-blue-800 sm:text-xl',
  subtitle: 'mt-1 text-xs text-slate-500 sm:text-sm',

  filters: 'mb-4 flex min-w-0 flex-wrap items-center gap-3',
  select:
    'w-full min-w-0 rounded-lg border border-blue-100 bg-white px-3 py-2.5 text-sm text-slate-600 outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 sm:w-auto sm:flex-1',
  dateContainer:
    'flex min-w-0 w-full items-center gap-2 rounded-lg border border-blue-100 bg-white px-3 py-2.5 sm:w-auto sm:flex-1',
  dateInput:
    'w-full min-w-0 flex-1 bg-transparent text-xs text-slate-600 outline-none',

  tabs: 'flex items-center gap-4 border-b border-slate-100 sm:gap-5',
  tabBase:
    'flex items-center gap-2 border-b-2 px-1 py-3 text-sm font-medium transition',
  tabActive: 'border-blue-600 text-blue-700',
  tabInactive: 'border-transparent text-slate-500 hover:text-blue-600',
  countBadge: 'rounded-full bg-blue-50 px-2 py-0.5 text-xs text-blue-700',
  filterLabel:
    'ml-auto hidden items-center gap-1.5 pb-3 text-sm text-slate-500 sm:flex',

  list: 'mt-2 w-full min-w-0',

  gridColumns:
    'grid grid-cols-[minmax(0,1fr)_auto] md:grid-cols-[minmax(170px,1.2fr)_minmax(60px,1fr)_minmax(50px,1fr)_minmax(75px,0.8fr)_minmax(60px,1fr)_minmax(50px,auto)_minmax(60px,auto)]',

  gridColumnsHeader:
    'grid grid-cols-[minmax(0,1fr)_auto] md:grid-cols-[minmax(190px,1.2fr)_minmax(60px,1fr)_minmax(50px,1fr)_minmax(75px,0.8fr)_minmax(60px,1fr)_minmax(50px,auto)_minmax(90px,auto)]  text-slate-500 font-bold  ',

  row: 'items-center gap-x-3 gap-y-2 border-b border-slate-50 px-1 py-4 transition-colors hover:bg-blue-50 sm:px-3 md:gap-3',

  transactionInfo: 'flex min-w-0 items-center gap-3',
  categoryIcon:
    'flex h-9 w-9 shrink-0 items-center justify-center rounded-xl sm:h-10 sm:w-10',
  incomeIcon: 'bg-emerald-50 text-emerald-600',
  expenseIcon: 'bg-red-50 text-red-500',

  transactionDetails: 'min-w-0 flex-1',
  transactionTitle: 'truncate text-sm font-semibold text-blue-800',
  mobileMeta: 'mt-1 truncate text-xs text-slate-500 md:hidden',
  mobileDate: 'mt-1 text-xs text-slate-500 md:hidden',

  desktopDate: 'hidden whitespace-nowrap text-xs text-slate-500 md:block',
  desktopCategory: 'hidden min-w-0 md:block',
  categoryBadge:
    'inline-block max-w-full truncate rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700',
  desktopAccount: 'hidden truncate text-xs text-slate-500 md:block',
  desktopType: 'hidden md:block',
  typeBadge:
    'inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium',
  incomeBadge: 'bg-emerald-50 text-emerald-700',
  expenseBadge: 'bg-red-50 text-red-600',

  amountContainer: 'flex min-w-0 flex-col items-end justify-center gap-1',
  amount: 'whitespace-nowrap text-xs font-semibold sm:text-sm',
  incomeAmount: 'text-emerald-600',
  expenseAmount: 'text-red-500',

  mobileTypeBadge:
    'inline-flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-medium md:hidden',

  mobileActions: 'flex shrink-0 items-center gap-1 md:hidden',
  desktopActions: 'hidden shrink-0 items-center gap-1 md:flex',

  editButton:
    'rounded-lg p-1.5 text-slate-700 transition hover:bg-blue-50 hover:text-blue-600',
  deleteButton:
    'rounded-lg p-1.5 text-slate-700 transition hover:bg-red-50 hover:text-red-600',

  loading: 'flex items-center justify-center gap-2 py-10',
  spinner:
    'size-5 animate-spin rounded-full border-2 border-blue-200 border-t-blue-600',
  loadingText: 'text-sm text-blue-700',

  emptyState:
    'flex flex-col items-center justify-center gap-2 py-12 text-center',
  emptyTitle: 'font-semibold text-slate-700',
  emptyText: 'text-sm text-slate-500',

  pagination:
    'mt-4 flex flex-col items-start justify-between gap-3 border-t border-slate-100 pt-4 sm:flex-row sm:items-center sm:gap-4',
  paginationText: 'text-xs leading-5 text-slate-500',
  paginationControls: 'flex w-full items-center justify-end gap-1 sm:w-auto',
  pageButton:
    'flex h-8 min-w-8 items-center justify-center rounded-lg text-sm transition',
  pageButtonInactive: 'text-slate-600 hover:bg-blue-50 hover:text-blue-700',
  pageButtonActive: 'bg-blue-600 font-semibold text-white shadow-sm',
  navigationButton:
    'flex h-8 min-w-8 items-center justify-center rounded-lg text-sm text-slate-600 transition hover:bg-blue-50 hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-40',
  ellipsis: 'px-1 text-slate-400',
  searchWrapper:
    'flex h-[38px] w-full items-center gap-2 rounded-lg border border-blue-100 bg-white px-3 transition-colors focus-within:border-blue-300 focus-within:ring-2 focus-within:ring-blue-50',

  searchIcon: 'h-4 w-4 shrink-0 text-slate-600',

  searchInput:
    'h-full min-w-0 flex-1 border-0 bg-transparent p-0 text-sm text-slate-700 outline-none placeholder:text-slate-400 focus:outline-none focus:ring-0',
};

export default styles;
