import {
  Wallet,
  ArrowDownToLine,
  ArrowUp,
  PiggyBank,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';

interface SummaryCardsProps {
  totalBalance?: number;
  monthlyIncome?: number;
  monthlyExpenses?: number;
  savingsRate?: number;
}

const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

export default function SummaryCards({
  totalBalance = 12480.5,
  monthlyIncome = 4250,
  monthlyExpenses = 2180.75,
  savingsRate = 48.7,
}: SummaryCardsProps) {
  const cards = [
    {
      title: 'Total Balance',
      value: currency.format(totalBalance),
      change: '12%',
      trend: 'up',
      Icon: Wallet,
      iconClass: 'icon-blue',
    },
    {
      title: 'Income This Month',
      value: currency.format(monthlyIncome),
      change: '8%',
      trend: 'up',
      Icon: ArrowDownToLine,
      iconClass: 'icon-green',
    },
    {
      title: 'Expenses This Month',
      value: currency.format(monthlyExpenses),
      change: '6%',
      trend: 'down',
      Icon: ArrowUp,
      iconClass: 'icon-red',
    },
    {
      title: 'Savings Rate',
      value: `${savingsRate.toFixed(1)}%`,
      change: '5.2%',
      trend: 'up',
      Icon: PiggyBank,
      iconClass: 'icon-purple',
    },
  ];

  return (
    <section className="summary-cards">
      {cards.map((card) => {
        const Icon = card.Icon;
        const TrendIcon = card.trend === 'up' ? TrendingUp : TrendingDown;

        return (
          <article className="summary-card" key={card.title}>
            <div className="summary-card-header">
              <div className={`icon ${card.iconClass}`}>
                <Icon size={25} strokeWidth={2} />
              </div>

              <span className="summary-card-title">{card.title}</span>
            </div>

            <h2 className="summary-card-value">{card.value}</h2>

            <div className="summary-card-footer">
              <span
                className={`summary-trend ${
                  card.trend === 'up'
                    ? 'summary-trend-up'
                    : 'summary-trend-down'
                }`}
              >
                <TrendIcon size={16} />
                {card.change}
              </span>

              <span className="summary-comparison">vs. last month</span>
            </div>
          </article>
        );
      })}
    </section>
  );
}
