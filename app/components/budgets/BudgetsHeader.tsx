'use client';

import { useState } from 'react';
import PageHeader from '@/app/components/PageHeader';
import AddTransactionModal from '@/app/components/modals/AddTransactionModal';
import { addTransaction } from '@/lib/supabase/transaction/actions';
import { TransactionFormData } from '@/app/data/types';
import { toast } from 'react-hot-toast';

export default function BudgetsHeader({}) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  function handleAddTransaction() {
    setIsModalOpen(true);
  }

  async function handleCreateTransaction(data: TransactionFormData) {
    const result = await addTransaction(data);

    if (!result?.success) {
      toast.error(result?.error ?? 'Failed to create transaction');
      return;
    }
    toast.success('Transaction created successfully', { duration: 3000 });
    setIsModalOpen(false);
    window.location.reload();
  }

  return (
    <>
      <PageHeader
        pageTitle="Budgets"
        pageDescription="Manage and track all transactions here."
        isPageHeaderButton={true}
        pageHeaderButtonText="+ Add Budget"
        pageHeaderButtonOnClick={handleAddTransaction}
      />

      <AddTransactionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateTransaction}
      />
    </>
  );
}
