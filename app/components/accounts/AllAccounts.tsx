'use client';
import { useCallback, useEffect, useState } from 'react';
import { authenticateUser } from '@/lib/supabase/actions';
import { getAccounts } from '@/lib/supabase/accounts/actions';
import { Account } from '@/app/data/types';
import toast from 'react-hot-toast';
import BalanceDetails from './BalanceDetails';
import AccountDetails from './AccountDetails';

export default function AllAccounts() {
  const [accounts, setAccounts] = useState<Account[]>([]);

  const fetchAccounts = useCallback(async () => {
    authenticateUser();
    try {
      const result = await getAccounts();
      setAccounts(result.accounts);
      console.log(accounts);
    } catch (error) {
      console.error('Error fetching account:', error);
      toast.error('Failed to get your accounts. Please try again.', {
        className: 'error-toast',
      });
    }
  }, []);
  useEffect(() => {
    void fetchAccounts();
  }, [fetchAccounts]);

  return (
    <section className="section-card">
      {/*  Accounts table */}
      <div className="table-wrapper">
        <table className="list-table">
          <tbody>
            {accounts.map((account) => {
              return (
                <tr key={account.id} className="table-tr-box">
                  <td>
                    <AccountDetails account={account} />
                  </td>
                  <td>
                    <BalanceDetails account={account} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
    </section>
  );
}
