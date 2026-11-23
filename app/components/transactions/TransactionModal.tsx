'use client';

import { useEffect, useState, type FormEvent } from 'react';
import {
  Plus,
  ArrowDownCircle,
  ArrowUpCircle,
  Pencil,
  Trash2,
  AlertTriangle,
} from 'lucide-react';

import {
  paymentMethodOptions,
  TransactionFormData,
  TransactionType,
} from '@/app/data/types';

import ModalLayout from '@/app/components/modals/ModalLayout';
import { useTransactionData } from '@/app/components/transactions/hooks/useTransactionData';

import '@/styles/addTransactionModal.css';

export type TransactionModalMode = 'add' | 'edit' | 'delete';

export interface TransactionModalData extends TransactionFormData {
  id: string;
}

interface TransactionModalProps {
  isOpen: boolean;
  mode: TransactionModalMode;
  transaction?: TransactionModalData | null;

  onSave: (data: TransactionFormData, id?: string) => void | Promise<void>;
  onDelete: (id: string) => void | Promise<void>;
  onClose: () => void;
}

function getLocalDate() {
  const date = new Date();

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

const initialFormData = (): TransactionFormData => ({
  account_id: '',
  category_id: '',
  type: 'expense',
  amount: 0,
  description: '',
  transaction_date: getLocalDate(),
  payment_method: 'card',
  notes: '',
});
export default function TransactionModal(props: TransactionModalProps) {
  const { isOpen, mode, transaction } = props;

  return (
    <TransactionModalContent
      key={`${isOpen}-${mode}-${transaction?.id ?? 'new'}`}
      {...props}
    />
  );
}

function TransactionModalContent({
  isOpen,
  mode,
  transaction,
  onSave,
  onDelete,
  onClose,
}: TransactionModalProps) {
  const [formData, setFormData] = useState<TransactionFormData>(() => {
    if (mode === 'edit' && transaction) {
      return {
        account_id: transaction.account_id,
        category_id: transaction.category_id,
        type: transaction.type,
        amount: transaction.amount,
        description: transaction.description,
        transaction_date: transaction.transaction_date,
        payment_method: transaction.payment_method,
        notes: transaction.notes ?? '',
      };
    }

    return initialFormData();
  });

  const [amount, setAmount] = useState(() =>
    mode === 'edit' && transaction ? String(transaction.amount) : ''
  );

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const { userAccounts, categories, fetchData } = useTransactionData(false);
  useEffect(() => {
    if (isOpen && mode !== 'delete') {
      void fetchData();
    }
  }, [isOpen, mode, fetchData]);

  function updateField<K extends keyof TransactionFormData>(
    field: K,
    value: TransactionFormData[K]
  ) {
    setFormData((previous) => ({
      ...previous,
      [field]: value,
    }));
  }

  // Filter categories based on transaction type
  const filteredCategories = categories.filter(
    (category) => category.type?.toLowerCase() === formData.type
  );

  // Handle switching between income and expense
  function handleTypeChange(type: TransactionType) {
    setFormData((previous) => ({
      ...previous,
      type,
      category_id: '',
    }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');

    if (mode === 'delete') {
      if (!transaction?.id) return;

      setSaving(true);

      try {
        await onDelete(transaction.id);
        onClose();
      } catch {
        setError('Unable to delete the transaction. Please try again.');
      } finally {
        setSaving(false);
      }

      return;
    }

    const numericAmount = Number(amount);

    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      setError('Enter an amount greater than zero.');
      return;
    }

    if (!formData.description.trim()) {
      setError('Please enter a description.');
      return;
    }

    if (!formData.account_id) {
      setError('Please select an account.');
      return;
    }

    if (!formData.category_id) {
      setError('Please select a category.');
      return;
    }

    setSaving(true);

    try {
      await onSave(
        {
          ...formData,
          amount: numericAmount,
          description: formData.description.trim(),
          notes: formData.notes?.trim() ?? '',
        },
        mode === 'edit' ? transaction?.id : undefined
      );

      setFormData(initialFormData());
      setAmount('');
      onClose();
    } catch {
      setError(
        `Unable to ${mode === 'add' ? 'save' : 'update'} the transaction. Please try again.`
      );
    } finally {
      setSaving(false);
    }
  }

  // Modal configuration
  const modalConfig = {
    add: {
      title: 'Add Transaction',
      description: 'Record a new income or expense',
      icon: <Plus size={25} />,
      button: (
        <>
          <Plus size={20} /> Save Transaction
        </>
      ),
    },
    edit: {
      title: 'Edit Transaction',
      description: 'Update your transaction details',
      icon: <Pencil size={23} />,
      button: (
        <>
          <Pencil size={19} /> Update Transaction
        </>
      ),
    },
    delete: {
      title: 'Delete Transaction',
      description: 'Confirm transaction deletion',
      icon: <Trash2 size={23} />,
      button: (
        <>
          <Trash2 size={19} /> Delete Transaction
        </>
      ),
    },
  };

  const config = modalConfig[mode];

  return (
    <ModalLayout
      isOpen={isOpen}
      title={config.title}
      description={config.description}
      titleId="transaction-modal-title"
      icon={config.icon}
      onClose={onClose}
      onSubmit={handleSubmit}
      saving={saving}
      maxWidth={625}
      submitButton={<>{config.button}</>}
      footer={
        <button
          type="button"
          className="transaction-cancel-button"
          onClick={onClose}
          disabled={saving}
        >
          Cancel
        </button>
      }
    >
      <div className="transaction-modal-body">
        {/* DELETE MODE */}
        {mode === 'delete' ? (
          <div className="transaction-delete-content">
            <div className="delete-warning-icon">
              <AlertTriangle size={35} />
            </div>

            <h3>Are you sure?</h3>

            <p>
              You are about to permanently delete this transaction. This action
              cannot be undone.
            </p>

            {transaction && (
              <div className="delete-transaction-details">
                <div>
                  <span>Description</span>
                  <strong>{transaction.description}</strong>
                </div>

                <div>
                  <span>Amount</span>
                  <strong>
                    {new Intl.NumberFormat('da-DK', {
                      style: 'currency',
                      currency: 'EUR',
                    }).format(transaction.amount)}
                  </strong>
                </div>
              </div>
            )}
          </div>
        ) : (
          <>
            {/* INCOME / EXPENSE SELECTOR */}
            <div className="transaction-type-selector">
              <button
                type="button"
                className={`type-option expense-option ${
                  formData.type === 'expense' ? 'active' : ''
                }`}
                onClick={() => handleTypeChange('expense')}
                aria-pressed={formData.type === 'expense'}
              >
                <ArrowDownCircle size={19} />
                Expense
              </button>

              <button
                type="button"
                className={`type-option income-option ${
                  formData.type === 'income' ? 'active' : ''
                }`}
                onClick={() => handleTypeChange('income')}
                aria-pressed={formData.type === 'income'}
              >
                <ArrowUpCircle size={19} />
                Income
              </button>
            </div>

            <div className="transaction-form-grid">
              {/* AMOUNT */}
              <div className="form-field">
                <label htmlFor="transaction-amount">
                  Amount <span>*</span>
                </label>

                <div className="amount-input-wrapper">
                  <span className="amount-prefix">€</span>

                  <input
                    id="transaction-amount"
                    type="number"
                    min="0.01"
                    step="0.01"
                    placeholder="0.00"
                    value={amount}
                    onChange={(event) => setAmount(event.target.value)}
                    required
                  />
                </div>
              </div>

              {/* DATE */}
              <div className="form-field">
                <label htmlFor="transaction-date">
                  Date <span>*</span>
                </label>

                <input
                  id="transaction-date"
                  type="date"
                  value={formData.transaction_date}
                  onChange={(event) =>
                    updateField('transaction_date', event.target.value)
                  }
                  required
                />
              </div>

              {/* DESCRIPTION */}
              <div className="form-field full-width">
                <label htmlFor="transaction-description">
                  Description <span>*</span>
                </label>

                <input
                  id="transaction-description"
                  type="text"
                  placeholder="e.g. Grocery shopping"
                  value={formData.description}
                  onChange={(event) =>
                    updateField('description', event.target.value)
                  }
                  maxLength={200}
                  required
                />
              </div>

              {/* CATEGORY */}
              <div className="form-field">
                <label htmlFor="transaction-category">
                  Category <span>*</span>
                </label>

                <select
                  id="transaction-category"
                  value={formData.category_id ?? ''}
                  onChange={(event) =>
                    updateField('category_id', event.target.value)
                  }
                  required
                >
                  <option value="">Select category</option>

                  {filteredCategories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* ACCOUNT */}
              <div className="form-field">
                <label htmlFor="transaction-account">
                  Account <span>*</span>
                </label>

                <select
                  id="transaction-account"
                  value={formData.account_id}
                  onChange={(event) =>
                    updateField('account_id', event.target.value)
                  }
                  required
                >
                  <option value="">Select account</option>

                  {userAccounts.map((account) => (
                    <option key={account.id} value={account.id}>
                      {account.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* PAYMENT METHOD */}
              <div className="form-field full-width">
                <label htmlFor="payment-method">Payment method</label>

                <select
                  id="payment-method"
                  value={formData.payment_method}
                  onChange={(event) =>
                    updateField('payment_method', event.target.value)
                  }
                >
                  {paymentMethodOptions.map((method) => (
                    <option key={method} value={method}>
                      {method}
                    </option>
                  ))}
                </select>
              </div>

              {/* NOTES */}
              <div className="form-field full-width">
                <label htmlFor="transaction-notes">
                  Notes <span className="optional">(optional)</span>
                </label>

                <textarea
                  id="transaction-notes"
                  placeholder="Add any additional details..."
                  rows={3}
                  value={formData.notes ?? ''}
                  onChange={(event) => updateField('notes', event.target.value)}
                  maxLength={2000}
                />
              </div>
            </div>
          </>
        )}

        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}
      </div>
    </ModalLayout>
  );
}
