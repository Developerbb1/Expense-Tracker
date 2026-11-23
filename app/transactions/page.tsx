import AppLayout from '@/app/components/AppLayout';
import TransactionSummaryCards from '@/app/components/transactions/TransactionSummaryCards';
import AllTransactions from '@/app/components/transactions/AllTransactions';
import TransactionsHeader from '@/app/components/transactions/TransactionsHeader';
import { authenticateUser } from '@/lib/supabase/actions';
import '@/styles/all-transactions.css';

export default async function Transactions() {
  await authenticateUser();

  return (
    <AppLayout>
      <main className="main-page">
        <TransactionsHeader />
        <TransactionSummaryCards />
        <div className="allTransactions">
          {' '}
          <AllTransactions />{' '}
        </div>
      </main>
    </AppLayout>
  );
}
