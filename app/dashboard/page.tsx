import AppLayout from '@/app/components/AppLayout';
import PageHeader from '@/app/components/PageHeader';
import TransactionSummaryCards from '@/app/components/transactions/TransactionSummaryCards';
import IncomeExpenseChart from '@/app/components/dashboard/IncomeExpenseChart';
import SpendingCategoryChart from '@/app/components/dashboard/SpendingCategoryChart';
import RecentTransactions from '@/app/components/dashboard/RecentTransactions';
import '@/styles/dashboard-charts.css';
import { authenticateUser } from '@/lib/supabase/actions';
import { getCategorySpending } from '@/lib/supabase/transaction/actions';
import MonthwiseBudget from '../components/budgets/MonthwiseBudget';
import { getMonthwiseBudget } from '@/lib/supabase/budget/action';

export default async function Dashboard() {
  await authenticateUser();
  const data = await getCategorySpending();

  const budget = await getMonthwiseBudget();
  return (
    <AppLayout>
      <main className="main-page">
        <PageHeader
          pageTitle="Dashboard"
          pageDescription="Browse accounts and review your activity."
          isPageHeaderButton={false}
        />
        <TransactionSummaryCards />
        <div className="dashboard-charts">
          <IncomeExpenseChart />

          <SpendingCategoryChart data={data} />
        </div>
        <div className="dashboard-Transaction-Budget">
          <RecentTransactions />
          <MonthwiseBudget data={budget} />
        </div>
      </main>
    </AppLayout>
  );
}
