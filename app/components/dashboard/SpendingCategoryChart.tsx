'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { currency } from '@/lib/supabase/helper';

interface CategorySpending {
  category_name: string;
  amount: number;
}
/* 
const defaultData: CategorySpending[] = [
  { name: 'Housing', amount: 926.35 },
  { name: 'Food', amount: 399.02 },
  { name: 'Transport', amount: 278.18 },
  { name: 'Utilities', amount: 209.72 },
  { name: 'Shopping', amount: 189.86 },
  { name: 'Other', amount: 177.62 },
]; */

const categoryColors = [
  '#800000',
  '#a855f7',
  '#35b99a',
  '#4385f5',
  '#ff9b3d',
  '#8b5cf6',
];

export default function SpendingCategoryChart({
  data,
}: {
  data: CategorySpending[];
}) {
  console.log('SpendingCategoryChart data:', data);
  const total = data.reduce((sum, item) => sum + item.amount, 0);

  const chartData = data.map((item) => ({
    ...item,
    percentage: total > 0 ? (item.amount / total) * 100 : 0,
  }));

  return (
    <section className="chart-card category-chart-card">
      <div className="chart-header">
        <h2 className="chart-title">Spending by Category</h2>
      </div>

      {data.length === 0 || total <= 0 ? (
        <div className="category-empty">
          No expense data available for this period.
        </div>
      ) : (
        <div className="category-chart-layout">
          <div className="donut-chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="amount"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius="57%"
                  outerRadius="88%"
                  paddingAngle={2}
                  stroke="none"
                >
                  {chartData.map((item, index) => (
                    <Cell
                      key={item.category_name}
                      fill={categoryColors[index % categoryColors.length]}
                    />
                  ))}
                </Pie>

                <Tooltip
                  formatter={(value, name) => [
                    currency.format(Number(value)),
                    name,
                  ]}
                  contentStyle={{
                    borderRadius: 10,
                    border: '1px solid #dbeafe',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>

            <div className="donut-center">
              <span className="donut-total">{currency.format(total)}</span>
              <span className="donut-caption">Total Expenses</span>
            </div>
          </div>

          <div className="category-legend">
            {chartData.map((item, index) => (
              <div className="category-legend-item" key={item.category_name}>
                <span
                  className="category-dot"
                  style={{
                    backgroundColor:
                      categoryColors[index % categoryColors.length],
                  }}
                />

                <span className="category-name">{item.category_name}</span>

                <span className="category-percentage">
                  {item.percentage.toFixed(1)}%
                </span>

                <span className="category-amount">
                  {currency.format(item.amount)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
