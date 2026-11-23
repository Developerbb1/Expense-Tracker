'use client';

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import TransactionsList from '@/app/components/transactions/TransactionsList';

export default function RecentTransactions() {
  return (
    <section className="dashboard-panel transactions-panel">
      <div className="panel-header">
        <h2 className="panel-title">Recent Transactions</h2>

        <Link href="/transactions" className="view-all-link">
          View all <ArrowRight size={16} />
        </Link>
      </div>
      <TransactionsList recentTransactions={true} />
    </section>
  );
}
