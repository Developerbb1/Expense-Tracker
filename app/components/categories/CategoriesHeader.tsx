'use client';

import { useState } from 'react';
import PageHeader from '@/app/components/PageHeader';
import AddCategoryModal from '@/app/components/categories/AddCategoryModal';
import { addCategory } from '@/lib/supabase/categories/actions';
import { CategoryFormData } from '@/app/data/types';
import { toast } from 'react-hot-toast';

export default function CategoriesHeader() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  function handleAddCategory() {
    setIsModalOpen(true);
  }

  async function handleCreateCategory(data: CategoryFormData) {
    const result = await addCategory(data);

    if (!result?.success) {
      toast.error(result?.error ?? 'Failed to create category.');
      return;
    }

    toast.success('Category created successfully!');

    setIsModalOpen(false);
    window.location.reload();
  }

  return (
    <>
      <PageHeader
        pageTitle="Categories"
        pageDescription="Manage categories of your income and expenses."
        isPageHeaderButton={true}
        pageHeaderButtonText="+ Add Category"
        pageHeaderButtonOnClick={handleAddCategory}
      />

      <AddCategoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateCategory}
      />
    </>
  );
}
