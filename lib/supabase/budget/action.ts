import { BudgetItem } from '@/app/data/types';
import { fetchCurrentMonthTransactions } from '../transaction/actions';

import {
  Utensils,
  Bus,
  ShoppingCart,
  Home,
  FerrisWheel,
  Wallet,
} from 'lucide-react';

import type { LucideIcon } from 'lucide-react';

export const getCategoryIconn = (icon: string): LucideIcon => {
  const icons: Record<string, LucideIcon> = {
    home: Home,
    'ferris-wheel': FerrisWheel,
    utensils: Utensils,
    'shopping-cart': ShoppingCart,
    bus: Bus,
    wallet: Wallet,
  };

  return icons[icon] || Wallet;
};

export async function getMonthwiseBudget(): Promise<BudgetItem[]> {
  const { transactions } = await fetchCurrentMonthTransactions();

  const categoryTotals = transactions
    .filter((transaction) => transaction.type === 'expense')
    .reduce<Record<string, number>>((acc, transaction) => {
      const category = transaction.category_name || 'Other';

      acc[category] = (acc[category] || 0) + transaction.amount;

      return acc;
    }, {});

  // Actual monthly budget limits
  const categoryLimits: Record<string, number> = {
    Food: 6000,
    Transport: 1500,
    Shopping: 4000,
    Housing: 12000,
    Recreation: 10000,
    Other: 2000,
  };

  // Category colors
  const categoryColors: Record<string, string> = {
    Food: '#10B981',
    Transport: '#EAB308',
    Shopping: '#9254FF',
    Housing: '#800000',
    Recreation: '#F97316',
    Other: '#9CA3AF',
  };

  // Category icons
  const categoryIcons: Record<string, string> = {
    Food: 'utensils',
    Transport: 'bus',
    Shopping: 'shopping-cart',
    Housing: 'home',
    Recreation: 'ferris-wheel',
    Other: 'wallet',
  };

  return Object.entries(categoryTotals)
    .map(([category, amount]) => ({
      category,
      spent: Number(amount.toFixed(2)),
      limit: categoryLimits[category] || 2000,
      color: categoryColors[category] || '#9CA3AF',
      icon: categoryIcons[category] || 'wallet',
    }))
    .sort((a, b) => b.spent - a.spent);
}
