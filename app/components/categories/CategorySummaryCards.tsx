import { TrendingUp, TrendingDown, Tag } from 'lucide-react';
import Card from '../common/Card';
import { getCategories } from '@/lib/supabase/categories/actions';

export default async function CategorySummaryCards() {
  const result = await getCategories();

  const totalCategories = result.categories.length;

  const totalIncome = result.categories.filter(
    (category) => category.type === 'income'
  ).length;

  const totalExpense = result.categories.filter(
    (category) => category.type === 'expense'
  ).length;

  return (
    <section className="summary-cards">
      <Card
        title="Total Categories"
        value={totalCategories.toString()}
        change={0}
        Icon={Tag}
        iconClass="icon-blue"
      />
      <Card
        title="Expense Categories"
        value={totalExpense.toString()}
        change={0}
        Icon={TrendingDown}
        iconClass="icon-purple"
      />
      <Card
        title="Income Categories"
        value={totalIncome.toString()}
        change={0}
        Icon={TrendingUp}
        iconClass="icon-green"
      />
    </section>
  );
}
