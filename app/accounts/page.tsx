import AppLayout from '@/app/components/AppLayout';
import AccountsHeader from '@/app/components/accounts/AccountsHeader';
import AllAccounts from '@/app/components/accounts/AllAccounts';
import { authenticateUser } from '@/lib/supabase/actions';
import '@/styles/all-transactions.css';

export default async function Accounts() {
  await authenticateUser();

  return (
    <AppLayout>
      <main className="main-page">
        <AccountsHeader />
        <AllAccounts />
      </main>
    </AppLayout>
  );
}
