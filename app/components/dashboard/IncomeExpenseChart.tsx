'use client';

import { useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';

type Period = '6M' | '3M' | '1Y';

const chartData = {
  '6M': [
    { month: 'May', income: 4500, expenses: 2300 },
    { month: 'Jun', income: 3600, expenses: 2100 },
    { month: 'Jul', income: 4300, expenses: 3000 },
    { month: 'Aug', income: 4800, expenses: 3500 },
    { month: 'Sep', income: 3900, expenses: 3000 },
    { month: 'Oct', income: 4600, expenses: 3400 },
  ],
  '3M': [
    { month: 'Aug', income: 4800, expenses: 3500 },
    { month: 'Sep', income: 3900, expenses: 3000 },
    { month: 'Oct', income: 4600, expenses: 3400 },
  ],
  '1Y': [
    { month: 'Nov', income: 3200, expenses: 2200 },
    { month: 'Dec', income: 4000, expenses: 2900 },
    { month: 'Jan', income: 3500, expenses: 2400 },
    { month: 'Feb', income: 4200, expenses: 2800 },
    { month: 'Mar', income: 3900, expenses: 2600 },
    { month: 'Apr', income: 4400, expenses: 3100 },
    { month: 'May', income: 4500, expenses: 2300 },
    { month: 'Jun', income: 3600, expenses: 2100 },
    { month: 'Jul', income: 4300, expenses: 3000 },
    { month: 'Aug', income: 4800, expenses: 3500 },
    { month: 'Sep', income: 3900, expenses: 3000 },
    { month: 'Oct', income: 4600, expenses: 3400 },
  ],
};

const currency = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

export default function IncomeExpenseChart() {
  const [period, setPeriod] = useState<Period>('6M');

  return (
    <section className="chart-card">
      <div className="chart-header">
        <h2 className="chart-title">Income vs Expenses</h2>

        <div className="chart-periods">
          {(['6M', '3M', '1Y'] as Period[]).map((item) => (
            <button
              key={item}
              type="button"
              className={`chart-period ${
                period === item ? 'chart-period-active' : ''
              }`}
              onClick={() => setPeriod(item)}
              aria-pressed={period === item}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <div className="bar-chart-container">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData[period]}
            margin={{ top: 12, right: 8, left: 4, bottom: 0 }}
          >
            <CartesianGrid stroke="#e5edf7" vertical={false} />

            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#64748b', fontSize: 12 }}
              dy={8}
            />

            <YAxis
              axisLine={false}
              tickLine={false}
              width={58}
              tick={{ fill: '#64748b', fontSize: 12 }}
              tickFormatter={(value) => `$${Number(value) / 1000}k`}
            />

            <Tooltip
              formatter={(value, name) => [
                currency.format(Number(value)),
                name === 'income' ? 'Income' : 'Expenses',
              ]}
              contentStyle={{
                borderRadius: 10,
                border: '1px solid #dbeafe',
              }}
            />

            <Legend
              verticalAlign="bottom"
              iconType="circle"
              wrapperStyle={{
                fontSize: 12,
                paddingTop: 14,
              }}
              formatter={(value) =>
                value === 'income' ? 'Income' : 'Expenses'
              }
            />

            <Bar
              dataKey="income"
              fill="#35b99a"
              radius={[3, 3, 0, 0]}
              maxBarSize={30}
            />

            <Bar
              dataKey="expenses"
              fill="#4385f5"
              radius={[3, 3, 0, 0]}
              maxBarSize={30}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
