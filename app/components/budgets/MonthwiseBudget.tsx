'use client';

import { useState } from 'react';

import { BudgetItem } from '@/app/data/types';
import { getCategoryIconn } from '@/lib/supabase/budget/action';
import { currency } from '@/lib/supabase/helper';
import '@/styles/budget.css';

interface MonthlyBudgetProps {
  data?: BudgetItem[];
}

export default function MonthwiseBudget({ data = [] }: MonthlyBudgetProps) {
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });

  const monthOptions = Array.from({ length: 2 }, (_, index) => {
    const date = new Date();
    date.setDate(1);
    date.setMonth(date.getMonth() - index);

    const value = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      '0'
    )}`;

    const label = date.toLocaleDateString('en-US', {
      month: 'short',
      year: 'numeric',
    });

    return { value, label };
  });

  return (
    <section className="section-card">
      <div className="panel-header">
        <h2 className="panel-title">Monthly Budget</h2>

        <select
          className="budget-month-select"
          value={selectedMonth}
          onChange={(event) => setSelectedMonth(event.target.value)}
          aria-label="Select budget month"
        >
          {monthOptions.map((month) => (
            <option key={month.value} value={month.value}>
              {month.label}
            </option>
          ))}
        </select>
      </div>

      <div className="budget-list">
        {data.map((budget) => {
          const Icon = getCategoryIconn(budget.icon);
          const percentage =
            budget.limit > 0
              ? Math.round((budget.spent / budget.limit) * 100)
              : 0;

          return (
            <div className="budget-item" key={budget.category}>
              <div className="budget-icon">
                <Icon size={21} />
              </div>

              <div className="budget-details">
                <div className="budget-info">
                  <span className="budget-category">{budget.category}</span>

                  <span className="budget-amount">
                    {currency.format(budget.spent)} /{' '}
                    {currency.format(budget.limit)}
                  </span>

                  <span className="budget-percentage">{percentage}%</span>
                </div>

                <div
                  className="budget-progress-track"
                  role="progressbar"
                  aria-label={`${budget.category} budget usage`}
                  aria-valuenow={percentage}
                  aria-valuemin={0}
                  aria-valuemax={100}
                >
                  <div
                    className="budget-progress-fill"
                    style={{
                      width: `${Math.min(percentage, 100)}%`,
                      backgroundColor: budget.color,
                    }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
