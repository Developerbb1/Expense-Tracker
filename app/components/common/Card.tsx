import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import type { CardProps } from '@/app/data/types';

export default function Card({
  title,
  value,
  change,
  trend,
  Icon,
  iconClass,
  cardPage,
}: CardProps) {
  const TrendIcon =
    trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;

  // Dynamic footer text
  const footerText =
    title === 'Total Budget'
      ? 'Monthly allocated budget'
      : title === 'Total Spent'
        ? 'Total expenses this month'
        : title === 'Remaining'
          ? 'Available budget balance'
          : 'Budget overview';

  return (
    <article className="summary-card">
      <div className="summary-card-header">
        <div className={`icon ${iconClass}`}>
          <Icon size={25} strokeWidth={2} />
        </div>

        <span className="summary-card-title">{title}</span>
      </div>

      <h2 className="summary-card-value">{value}</h2>

      {cardPage === 'transactions' && (
        <div className="summary-card-footer">
          <span
            className={`summary-trend ${
              trend === 'up'
                ? 'summary-trend-up'
                : trend === 'down'
                  ? 'summary-trend-down'
                  : 'summary-trend-neutral'
            }`}
          >
            <TrendIcon size={16} />
            {change !== null ? `${Math.abs(change)}%` : 'N/A'}
          </span>

          <span className="summary-comparison">vs. last month</span>
        </div>
      )}

      {cardPage === 'budget' && (
        <div className="summary-card-footer">
          <span className="summary-comparison">{footerText}</span>
        </div>
      )}
    </article>
  );
}
