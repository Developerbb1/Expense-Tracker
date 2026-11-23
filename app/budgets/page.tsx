import AppLayout from '@/app/components/AppLayout';
import BudgetsHeader from '@/app/components/budgets/BudgetsHeader';
import { authenticateUser } from '@/lib/supabase/actions';
import { getMonthwiseBudget } from '@/lib/supabase/budget/action';
import MonthwiseBudget from '@/app/components/budgets/MonthwiseBudget';
import BudgetSummaryCard from '@/app/components/budgets/BudgetSummaryCards';

import '@/styles/all-transactions.css';
import '@/styles/dashboard-charts.css';

export default async function Budgets() {
  await authenticateUser();
  const data = await getMonthwiseBudget();

  return (
    <AppLayout>
      <main className="main-page">
        <BudgetsHeader />
        <BudgetSummaryCard />

        <MonthwiseBudget data={data} />
      </main>
    </AppLayout>
  );
}
