'use client';

import { useState } from 'react';
import PageHeader from '@/app/components/PageHeader';
import AddAccountModal from '@/app/components/accounts/AddAccountModal';
import { addAccount } from '@/lib/supabase/accounts/actions';
import { AccountFormData } from '@/app/data/types';
import { toast } from 'react-hot-toast';

export default function AccountsHeader() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  function handleAddAccounts() {
    setIsModalOpen(true);
  }

  async function handleCreateAccount(data: AccountFormData) {
    const result = await addAccount(data);

    if (!result?.success) {
      toast.error(result?.error ?? 'Failed to create account.');
      return;
    }

    toast.success('Account created successfully!');

    setIsModalOpen(false);
    window.location.reload();
  }

  return (
    <>
      <PageHeader
        pageTitle="Accounts"
        pageDescription="Manage all of your accounts."
        isPageHeaderButton={true}
        pageHeaderButtonText="+ Add Account"
        pageHeaderButtonOnClick={handleAddAccounts}
      />

      <AddAccountModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateAccount}
      />
    </>
  );
}
