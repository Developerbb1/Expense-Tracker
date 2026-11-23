import { Account } from '@/app/data/types';
import { Wallet, Landmark } from 'lucide-react';

export default function AccountDetails({ account }: { account: Account }) {
  const isSavings = account.account_type === 'savings';
  const Icon = isSavings ? Wallet : Landmark;

  return (
    <div className="flex min-w-0 items-center gap-3">
      <div className={isSavings ? 'icon icon-purple' : 'icon icon-green'}>
        <Icon size={21} />
      </div>

      <div className="flex min-w-0 flex-col gap-1">
        <h1 className="m-0 truncate">{account.name}</h1>
        <span className="text-sm text-slate-500">
          {isSavings ? 'Savings Account' : 'Bank Account'}
        </span>
      </div>
    </div>
  );
}
