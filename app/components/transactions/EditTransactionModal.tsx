'use client';

import { useState, useEffect, type FormEvent } from 'react';
import { Plus, ArrowDownCircle, ArrowUpCircle, Pencil } from 'lucide-react';

import {
  paymentMethodOptions,
  TransactionFormData,
  TransactionType,
} from '@/app/data/types';
import ModalLayout from '@/app/components/modals/ModalLayout';
import { useTransactionData } from '@/app/components/transactions/hooks/useTransactionData';

import '@/styles/addTransactionModal.css';

interface EditTransactionModalProps {
  isOpen: boolean;
  transaction?: TransactionFormData | null;
  onSubmit: (data: TransactionFormData) => void | Promise<void>;
  onClose: () => void;
}

function getLocalDate() {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

export default function EditTransactionModal({
  isOpen,
  transaction,
  onSubmit,
  onClose,
}: EditTransactionModalProps) {
  const [id, setId] = useState('');
  const [type, settype] = useState<TransactionType>('expense');
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [transactionDate, setTransactionDate] = useState(getLocalDate);
  const [categoryId, setCategoryId] = useState('');
  const [accountId, setAccountId] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const { userAccounts, categories, fetchData } = useTransactionData(false);

  useEffect(() => {
    if (!isOpen || !transaction) return;

    setId(transaction.id || '');
    settype(transaction.type);
    setDescription(transaction.description || '');
    setAmount(transaction.amount.toString());
    setNotes(transaction.notes || '');
    setError('');
    // Date
    setTransactionDate(
      transaction.transaction_date?.slice(0, 10) || getLocalDate()
    );
    // Select values
    setCategoryId(transaction.category_id || '');
    setAccountId(transaction.account_id || '');
    // Payment method must match an option exactly
    setPaymentMethod(transaction.payment_method || 'Cash');
  }, [isOpen, transaction]);

  useEffect(() => {
    if (isOpen) {
      void fetchData();
    }
  }, [isOpen, fetchData]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');

    const numericAmount = Number(amount);

    if (!Number.isFinite(numericAmount) || numericAmount <= 0) {
      setError('Enter an amount greater than zero.');
      return;
    }

    if (!accountId) {
      setError('Please select an account.');
      return;
    }

    setSaving(true);

    try {
      await onSubmit({
        id: id,
        account_id: accountId,
        category_id: categoryId,
        type,
        amount: numericAmount,
        description: description.trim(),
        transaction_date: transactionDate,
        payment_method: paymentMethod,
        notes: notes.trim(),
      });

      setAmount('');
      setDescription('');
      setTransactionDate(getLocalDate());
      setCategoryId('');
      setAccountId('');
      setPaymentMethod('card');
      setNotes('');
      settype('expense');
      setError('');

      onClose();
    } catch {
      setError('Unable to save the transaction. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <ModalLayout
      isOpen={isOpen}
      title="Edit Transaction"
      description="Update transaction"
      titleId="transaction-modal-title"
      icon={<Pencil size={25} />}
      onClose={onClose}
      onSubmit={handleSubmit}
      saving={saving}
      maxWidth={625}
      submitButton={
        <>
          <Plus size={20} />
          {saving ? 'Saving...' : 'Update Transaction'}
        </>
      }
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
        <div className="transaction-type-selector">
          <button
            type="button"
            className={`type-option expense-option ${
              type === 'expense' ? 'active' : ''
            }`}
            onClick={() => settype('expense')}
            aria-pressed={type === 'expense'}
          >
            <ArrowDownCircle size={19} />
            Expense
          </button>

          <button
            type="button"
            className={`type-option income-option ${
              type === 'income' ? 'active' : ''
            }`}
            onClick={() => settype('income')}
            aria-pressed={type === 'income'}
          >
            <ArrowUpCircle size={19} />
            Income
          </button>
        </div>

        <div className="transaction-form-grid">
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

          <div className="form-field">
            <label htmlFor="transaction-date">
              Date <span>*</span>
            </label>

            <input
              id="transaction-date"
              type="date"
              value={transactionDate}
              onChange={(event) => setTransactionDate(event.target.value)}
              required
            />
          </div>

          <div className="form-field full-width">
            <label htmlFor="transaction-description">
              Description <span>*</span>
            </label>

            <input
              id="transaction-description"
              type="text"
              placeholder="e.g. Grocery shopping"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              maxLength={200}
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor="transaction-category">
              Category <span>*</span>
            </label>

            <select
              id="transaction-category"
              value={categoryId}
              onChange={(event) => setCategoryId(event.target.value)}
              required
            >
              <option value="">Select category</option>

              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-field">
            <label htmlFor="transaction-account">
              Account <span>*</span>
            </label>

            <select
              id="transaction-account"
              value={accountId}
              onChange={(event) => {
                setAccountId(event.target.value);
              }}
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

          <div className="form-field full-width">
            <label htmlFor="payment-method">Payment method</label>

            <select
              id="payment-method"
              value={paymentMethod}
              onChange={(event) => setPaymentMethod(event.target.value)}
            >
              {paymentMethodOptions.map((method) => (
                <option key={method} value={method}>
                  {method}
                </option>
              ))}
            </select>
          </div>

          <div className="form-field full-width">
            <label htmlFor="transaction-notes">
              Notes <span className="optional">(optional)</span>
            </label>

            <textarea
              id="transaction-notes"
              placeholder="Add any additional details..."
              rows={3}
              value={notes}
              onChange={(event) => setNotes(event.target.value)}
              maxLength={2000}
            />
          </div>
        </div>

        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}
      </div>
    </ModalLayout>
  );
}
