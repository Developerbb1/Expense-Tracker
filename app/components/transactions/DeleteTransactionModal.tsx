'use client';

import { useState, type FormEvent } from 'react';
import { Trash2, Tag } from 'lucide-react';

import ModalLayout from '@/app/components/modals/ModalLayout';
import { TransactionFormData } from '@/app/data/types';

interface DeleteTransactionModalProps {
  isOpen: boolean;
  isSaving: boolean;
  transaction?: TransactionFormData | null;
  onSubmit: (data: TransactionFormData) => void | Promise<void>;
  onClose: () => void;
}

export default function DeleteTransactionModal({
  isOpen,
  transaction,
  isSaving,
  onSubmit,
  onClose,
}: DeleteTransactionModalProps) {
  const [error, setError] = useState('');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');

    if (!transaction) {
      setError('No transaction selected.');
      return;
    }

    try {
      await onSubmit(transaction);
      onClose();
    } catch (err) {
      console.error('Unable to delete transaction:', err);
      setError('Unable to delete this transaction. Try again later.');
    }
  }

  if (!isOpen || !transaction) return null;

  return (
    <ModalLayout
      isOpen={isOpen}
      title="Delete Transaction"
      description="This action cannot be undone."
      titleId="delete-modal-title"
      icon={<Trash2 size={25} />}
      onClose={onClose}
      onSubmit={handleSubmit}
      saving={isSaving}
      maxWidth={520}
      actionType="delete"
      submitButton={isSaving ? 'Deleting...' : 'Delete Transaction'}
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
              Are you sure you want to delete this transaction?
            </p>

            <p className="mt-2 break-words font-semibold text-slate-900">
              {transaction.description}
            </p>

            <span
              className={`mt-2 inline-flex items-center justify-center transaction-type-badge ${
                transaction.type === 'income'
                  ? 'transaction-icon-income'
                  : 'transaction-icon-expense'
              }`}
            >
              {transaction.type === 'income' ? 'Income' : 'Expense'}
            </span>
          </div>
        </div>

        {error && (
          <p className="form-error mt-3" role="alert">
            {error}
          </p>
        )}
      </div>
    </ModalLayout>
  );
}
