'use client';

import { useState } from 'react';
import { Utensils, CarFront, ShoppingCart } from 'lucide-react';

interface BudgetItem {
  category: string;
  spent: number;
  limit: number;
  color: string;
  Icon: typeof Utensils;
}

const budgets: BudgetItem[] = [
  {
    category: 'Food',
    spent: 399.02,
    limit: 600,
    color: 'budget-bar-blue',
    Icon: Utensils,
  },
  {
    category: 'Transport',
    spent: 278.18,
    limit: 400,
    color: 'budget-bar-green',
    Icon: CarFront,
  },
  {
    category: 'Shopping',
    spent: 189.86,
    limit: 300,
    color: 'budget-bar-purple',
    Icon: ShoppingCart,
  },
];

const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

export default function MonthlyBudget() {
  const [selectedMonth, setSelectedMonth] = useState('2025-10');

  return (
    <section className="dashboard-panel budget-panel">
      <div className="panel-header">
        <h2 className="panel-title">Monthly Budget</h2>

        <select
          className="budget-month-select"
          value={selectedMonth}
          onChange={(event) => setSelectedMonth(event.target.value)}
          aria-label="Select budget month"
        >
          <option value="2025-08">Aug 2025</option>
          <option value="2025-09">Sep 2025</option>
          <option value="2025-10">Oct 2025</option>
          <option value="2025-11">Nov 2025</option>
          <option value="2025-12">Dec 2025</option>
        </select>
      </div>

      <div className="budget-list">
        {budgets.map((budget) => {
          const Icon = budget.Icon;
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
                    className={`budget-progress-fill ${budget.color}`}
                    style={{
                      width: `${Math.min(percentage, 100)}%`,
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
