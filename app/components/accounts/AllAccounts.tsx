'use client';

import { useEffect, useState } from 'react';
import { authenticateUser } from '@/lib/supabase/actions';
import { getAccounts } from '@/lib/supabase/accounts/actions';
import { Account } from '@/app/data/types';
import toast from 'react-hot-toast';
import BalanceDetails from './BalanceDetails';
import AccountDetails from './AccountDetails';

export default function AllAccounts() {
  const [accounts, setAccounts] = useState<Account[]>([]);

  useEffect(() => {
    let isMounted = true;

    async function loadAccounts() {
      try {
        await authenticateUser();

        const result = await getAccounts();

        if (isMounted) {
          setAccounts(result.accounts);
        }
      } catch (error) {
        console.error('Error fetching accounts:', error);

        if (isMounted) {
          toast.error('Failed to get your accounts. Please try again.', {
            className: 'error-toast',
          });
        }
      }
    }

    void loadAccounts();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <section className="section-card">
      {/* Accounts table */}
      <div className="table-wrapper">
        <table className="list-table">
          <tbody>
            {accounts.map((account) => (
              <tr key={account.id} className="table-tr-box">
                <td>
                  <AccountDetails account={account} />
                </td>
                <td>
                  <BalanceDetails account={account} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
    </section>
  );
}
