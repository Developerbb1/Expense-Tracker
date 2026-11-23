import {
  LayoutDashboard,
  ArrowLeftRight,
  Wallet,
  ChartPie,
  BadgeDollarSign,
  House,
  Utensils,
  Bus,
  ShoppingCartIcon,
  Zap,
  FerrisWheel,
} from 'lucide-react';

import * as LucideIcons from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export function getCategoryIcon(
  iconName: string | null | undefined
): LucideIcon {
  if (!iconName || !(iconName in LucideIcons)) {
    return LucideIcons.Tag;
  }

  const icon = LucideIcons[iconName as keyof typeof LucideIcons];

  // Ensure the export is a React component, not a string or other value.
  if (typeof icon === 'object' || typeof icon === 'function') {
    return icon as LucideIcon;
  }

  return LucideIcons.Tag;
}

export const categoryIconMap = {
  Wallet,
  BadgeDollarSign,
  House,
  Utensils,
  Bus,
  ShoppingCartIcon,
  Zap,
};
export const sidebarMenus = [
  {
    title: 'Overview',
    items: [
      {
        label: 'Dashboard',
        href: '/dashboard',
        icon: LayoutDashboard,
      },
    ],
  },
  {
    title: 'Manage Finances',
    items: [
      {
        label: 'Transactions',
        href: '/transactions',
        icon: ArrowLeftRight,
      },
      {
        label: 'Accounts',
        href: '/accounts',
        icon: Wallet,
      },
      {
        label: 'Categories',
        href: '/categories',
        icon: LucideIcons.Tags,
      },
      {
        label: 'Budgets',
        href: '/budgets',
        icon: ChartPie,
      },
    ],
  },
  /* {
    title: 'Insights',
    items: [
      {
        label: 'Reports',
        href: '/reports',
        icon: ChartNoAxesCombined,
      },
      {
        label: 'Recurring Expenses',
        href: '/recurring-expenses',
        icon: CalendarDays,
      },
    ],
  },
  {
    title: 'Preferences',
    items: [
      {
        label: 'Settings',
        href: '/settings',
        icon: Settings,
      },
      {
        label: 'Profile',
        href: '/profile',
        icon: UserRound,
      },
      {
        label: 'Logout',
        href: '#',
        icon: LogOut,
      }, 
    ],
  },*/
];

export interface CardProps {
  title: string;
  value: string;
  change: number | null;
  trend?: 'up' | 'down' | 'neutral';
  Icon: LucideIcon;
  iconClass: string;
  cardPage?: string;
}

export interface SelectOption {
  value: string;
  label: string;
}

export interface NameIdPair {
  id: string;
  name: string;
}

export const transactionCategories: NameIdPair[] = [
  { id: '1', name: 'Salary' },
  { id: '2', name: 'Housing' },
  { id: '3', name: 'Shopping' },
  { id: '4', name: 'Utilities' },
  { id: '5', name: 'Recreation' },
];

export type TransactionAccount = 'Main account' | 'Credit card';

export const paymentMethodOptions = [
  'Cash',
  'Credit Card',
  'Debit Card',
  'Bank Transfer',
  'Mobile Payment',
];

export type transactionType = 'Income' | 'Expense' | 'Transfer';

/** Types for Categories table */

export const categoryIcons = [
  { name: 'Income', Icon: BadgeDollarSign },
  { name: 'Transportation', Icon: Bus },
  { name: 'Housing', Icon: House },
  { name: 'Shopping', Icon: ShoppingCartIcon },
  { name: 'Food', Icon: Utensils },
  { name: 'Recreation', Icon: FerrisWheel },
];
/* 
export function getCategoryIcon(iconName: string | null, categoryName: string) {
  if (iconName) {
    const savedIcon = categoryIcons.find((item) => item.name === iconName);

    if (savedIcon) return savedIcon.Icon;
  }

  // Fallback: find an icon based on the category name.
  const normalizedName = categoryName?.toLowerCase();

  const category = categoryIcons.find(
    (item) => item.name.toLowerCase() === normalizedName
  );

  return category?.Icon ?? Layers;
}
 */
export const categoryColors = [
  '#2563eb',
  '#10b981',
  '#f59e0b',
  '#ef4444',
  '#8b5cf6',
  '#06b6d4',
];

export type CategoryType = 'income' | 'expense';

export interface Category {
  id: string;
  user_id: string;
  name: string;
  type: CategoryType;
  icon: string | null;
  color: string | null;
  description: string | null;
  is_default: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}
export interface CategoryFormData {
  id?: string;
  name: string;
  type: CategoryType;
  icon: string;
  color: string;
  is_default: boolean;
}

export interface AddCategoryModalProps {
  isOpen: boolean;
  onSubmit: (data: CategoryFormData) => void | Promise<void>;
  onClose: () => void;
}

/** Types for Accounts table */

export type AccountType = 'bank' | 'savings';

export interface Account {
  id: string;
  user_id: string;
  name: string;
  account_type: string;
  balance: number;
  currency: string | null;
  is_active: boolean;
  created_at: string;
}
export interface AccountFormData {
  name: string;
  account_type: AccountType;
  balance: number;
  currency: string;
  is_active: boolean;
}

export interface AddAccountModalProps {
  isOpen: boolean;
  onSubmit: (data: AccountFormData) => void | Promise<void>;
  onClose: () => void;
}

/** Types for Transaction table */

export type TransactionType = 'expense' | 'income';

export interface Transaction {
  id: string;
  user_id: string;
  account_id: string;
  category_id: string | null;
  type: TransactionType;
  amount: number;
  description: string;
  transaction_date: string;
  payment_method: string;
  notes: string;
}

export interface TransactionFormData {
  id?: string;
  account_id: string;
  category_id: string | null;
  type: TransactionType;
  amount: number;
  description: string;
  transaction_date: string;
  payment_method: string;
  notes: string;
  icon?: string;
  category_name?: string;
  account_name?: string;
}
export interface TransactionWithDetails extends TransactionFormData {
  category: string;
  account: string;
  date: string;
  title: string;
}

export type BalanceSummary = {
  totalBalance: number;
  percentageChange: number;
  trend: 'up' | 'down' | 'neutral';
};

export type IncomeSummary = {
  monthlyIncome: number;
  percentageChange: number;
  trend: 'up' | 'down' | 'neutral';
};

export type ExpenseSummary = {
  monthlyExpense: number;
  percentageChange: number;
  trend: 'up' | 'down' | 'neutral';
};

export interface SavingsSummary {
  monthlySavings: number;
  savingsRate: number;
  percentageChange: number;
  trend: 'up' | 'down' | 'neutral';
}

export interface CategorySpending {
  category_name: string;
  amount: number;
}

export interface BudgetItem {
  category: string;
  spent: number;
  limit: number;
  color: string;
  icon: string;
}
