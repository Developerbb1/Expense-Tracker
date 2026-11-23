import { currency } from '@/lib/supabase/helper';
import { Account } from '@/app/data/types';

export default function BalanceDetails({ account }: { account: Account }) {
  const isSavings = account.account_type === 'savings';
  const balanceStyle = isSavings ? 'balance-savings' : 'balance-bank';
  const accountDesc = isSavings ? 'Savings' : 'Income Expenses';

  return (
    <div className="balance-amt-display">
      <span className={`transaction-mobile-amount ${balanceStyle}`}>
        <strong>{currency.format(account.balance)}</strong>

        {account.is_active ? (
          <span>Active</span>
        ) : (
          <span className="account-inactive">Inactive</span>
        )}

        <span className="text-slate-500">{accountDesc}</span>
      </span>
    </div>
  );
}
