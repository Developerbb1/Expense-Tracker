'use client';

import { useState, type FormEvent } from 'react';
import { Trash2, Tag } from 'lucide-react';

import ModalLayout from '@/app/components/modals/ModalLayout';
import type { Category } from '@/app/data/types';

interface DeleteCategoryModalProps {
  isOpen: boolean;
  category: Category | null;
  isSaving: boolean;
  onSubmit: (category: Category) => void | Promise<void>;
  onClose: () => void;
}

export default function DeleteCategoryModal({
  isOpen,
  category,
  isSaving,
  onSubmit,
  onClose,
}: DeleteCategoryModalProps) {
  const [error, setError] = useState('');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');

    if (!category) {
      setError('No category selected.');
      return;
    }

    try {
      await onSubmit(category);
      onClose();
    } catch (err) {
      console.error('Unable to delete category:', err);
      setError(
        'Unable to delete this category. It may be used by transactions.'
      );
    }
  }

  if (!isOpen || !category) return null;

  return (
    <ModalLayout
      isOpen={isOpen}
      title="Delete Category"
      description="This action cannot be undone."
      titleId="delete-modal-title"
      icon={<Trash2 size={23} />}
      onClose={onClose}
      onSubmit={handleSubmit}
      saving={isSaving}
      maxWidth={520}
      actionType="delete"
      submitButton={isSaving ? 'Deleting...' : 'Delete Category'}
      footer={
        <button
          type="button"
          className="cancel-button"
          onClick={onClose}
          disabled={isSaving}
        >
          Cancel
        </button>
      }
    >
      <div className="modal-body">
        <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600">
            <Tag size={20} />
          </span>

          <div className="min-w-0">
            <p className="text-sm text-slate-700">
              Are you sure you want to delete this category?
            </p>

            <p className="mt-2 break-words font-semibold text-slate-900">
              {category.name}
            </p>

            <span
              className={`mt-2 inline-flex items-center justify-center badge ${
                category.type === 'income' ? 'income' : 'expense'
              }`}
            >
              {category.type === 'income' ? 'Income' : 'Expense'}
            </span>
          </div>
        </div>

        {category.is_default && (
          <p className="mt-3 text-sm text-amber-700" role="alert">
            This is a default category and may not be deletable.
          </p>
        )}

        {error && (
          <p className="form-error mt-3" role="alert">
            {error}
          </p>
        )}
      </div>
    </ModalLayout>
  );
}
