import { Wallet, ArrowDownToLine, ArrowUp, PiggyBank } from 'lucide-react';
import { currency } from '@/lib/supabase/helper';
import { fetchBalanceSummary } from '@/lib/supabase/transaction/actions';
import Card from '../common/Card';

export default async function TransactionSummaryCards() {
  const { summary, income, expense, savings } = await fetchBalanceSummary();

  return (
    <section className="summary-cards">
      <Card
        title="Total Balance"
        value={currency.format(summary.totalBalance)}
        change={summary.percentageChange}
        trend={summary.trend}
        Icon={Wallet}
        iconClass="icon-blue"
        cardPage="transactions"
      />
      <Card
        title="Income This Month"
        value={currency.format(income.monthlyIncome)}
        change={income.percentageChange}
        trend={income.trend}
        Icon={ArrowDownToLine}
        iconClass="icon-green"
        cardPage="transactions"
      />
      <Card
        title="Expenses This Month"
        value={currency.format(expense.monthlyExpense)}
        change={expense.percentageChange}
        trend={expense.trend}
        Icon={ArrowUp}
        iconClass="icon-red"
        cardPage="transactions"
      />

      <Card
        title="Savings Rate"
        value={savings?.savingsRate?.toFixed(1) + '%'}
        change={savings?.percentageChange}
        trend={savings?.trend}
        Icon={PiggyBank}
        iconClass="icon-purple"
        cardPage="transactions"
      />
    </section>
  );
}
