import { Wallet, BanknoteArrowDown, PiggyBank } from 'lucide-react';
import { FileExclamationPoint } from 'lucide-react';
import { currency } from '@/lib/supabase/helper';
import { fetchBalanceSummary } from '@/lib/supabase/transaction/actions';
import Card from '../common/Card';

export default async function TransactionSummaryCards() {
  const { summary, income, expense, savings } = await fetchBalanceSummary();

  return (
    <section className="summary-cards">
      <Card
        title="Total Budget"
        value={currency.format(12000)}
        change={summary.percentageChange}
        trend={summary.trend}
        Icon={Wallet}
        iconClass="icon-blue"
        cardPage="budget"
      />
      <Card
        title="Total Spent"
        value={currency.format(7450)}
        change={income.percentageChange}
        trend={income.trend}
        Icon={BanknoteArrowDown}
        iconClass="icon-purple"
        cardPage="budget"
      />
      <Card
        title="Remaining"
        value={currency.format(4550)}
        change={expense.percentageChange}
        trend={expense.trend}
        Icon={PiggyBank}
        iconClass="icon-green"
        cardPage="budget"
      />

      <Card
        title="At Risk"
        value="1 budget"
        change={savings?.percentageChange}
        trend={savings?.trend}
        Icon={FileExclamationPoint}
        iconClass="icon-red"
        cardPage="budget"
      />
    </section>
  );
}
