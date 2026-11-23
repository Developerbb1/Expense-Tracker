import {
  Wallet,
  Landmark,
  ArrowDownToLine,
  ShoppingCart,
  House,
  Zap,
} from 'lucide-react';
import { Account, Transaction } from '@/app/data/types';

export const getAccountDetailDisplay = (account: Account) => {
  const isSavings = account.account_type === 'savings';

  return {
    Icon: isSavings ? Wallet : Landmark,
    iconStyle: isSavings ? 'icon icon-purple' : 'icon icon-green',
    balanceStyle: isSavings ? 'balance-savings' : 'balance-bank',
    accountDesc: isSavings ? 'Savings only' : 'Income and Expenses',
    accountHeader: isSavings ? 'Savings Account' : 'Bank Account',
  };
};
export const currency = new Intl.NumberFormat('da-DK', {
  style: 'currency',
  currency: 'DKK',
});

export const dateFormatter = new Intl.DateTimeFormat('en-GB', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
});

export function formatDate(date: string): string {
  return dateFormatter.format(new Date(`${date}T12:00:00`));
}

export function getTransactionIcon(transaction: Transaction) {
  if (transaction.type === 'income') return ArrowDownToLine;

  switch (transaction.category) {
    case 'Food':
      return ShoppingCart;
    case 'Housing':
      return House;
    case 'Utilities':
      return Zap;
    default:
      return ShoppingCart;
  }
}
