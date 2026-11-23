'use client';

import { useState, type FormEvent } from 'react';
import { Plus, Wallet, Check } from 'lucide-react';

import ModalLayout from '@/app/components/modals/ModalLayout';

import { AccountType, AddAccountModalProps } from '@/app/data/types';

export default function AddAccountModal({
  isOpen,
  onSubmit,
  onClose,
}: AddAccountModalProps) {
  const [name, setName] = useState('');
  const [accountType, setAccountType] = useState<AccountType>('bank');
  const [openingBalance, setOpeningBalance] = useState('0.00');
  const [currency, setCurrency] = useState('DKK');
  const [isActive, setIsActive] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');

    const balance = Number(openingBalance);

    if (!name.trim()) {
      setError('Please enter an account name.');
      return;
    }

    if (
      openingBalance.trim() === '' ||
      !Number.isFinite(balance) ||
      balance < 0
    ) {
      setError('Please enter a valid opening balance.');
      return;
    }

    setSaving(true);

    try {
      await onSubmit({
        name: name.trim(),
        account_type: accountType,
        balance: balance,
        currency,
        is_active: isActive,
      });

      setName('');
      setAccountType('bank');
      setOpeningBalance('0.00');
      setCurrency('DKK');
      setIsActive(true);
      onClose();
    } catch {
      setError('Unable to create the account. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <ModalLayout
      isOpen={isOpen}
      title="Add New Account"
      description="Create an account to organize your transactions."
      titleId="modal-title"
      icon={<Plus size={25} />}
      onClose={onClose}
      onSubmit={handleSubmit}
      saving={saving}
      maxWidth={621}
      submitButton={
        <>
          <Plus size={18} />
          {saving ? 'Saving...' : 'Create Account'}
        </>
      }
      footer={
        <button
          type="button"
          className="cancel-button"
          onClick={onClose}
          disabled={saving}
        >
          Cancel
        </button>
      }
    >
      <div className="modal-body">
        <div className="form-grid">
          <div className="form-field">
            <label htmlFor="account-name">
              Account Name <span>*</span>
            </label>
            <input
              id="account-name"
              type="text"
              placeholder="e.g. Main Bank Account"
              value={name}
              onChange={(event) => setName(event.target.value)}
              maxLength={100}
              required
              autoFocus
            />
          </div>

          <div className="form-field">
            <label htmlFor="account-type">
              Account Type <span>*</span>
            </label>
            <select
              id="account-type"
              value={accountType}
              onChange={(event) =>
                setAccountType(event.target.value as AccountType)
              }
              required
            >
              <option value="bank">Main Account</option>
              <option value="savings">Savings Account</option>
            </select>
          </div>

          <div className="form-field">
            <label htmlFor="opening-balance">
              Opening Balance <span>*</span>
            </label>
            <input
              id="opening-balance"
              type="number"
              min="0"
              step="0.01"
              placeholder="0.00"
              value={openingBalance}
              onChange={(event) => setOpeningBalance(event.target.value)}
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor="account-currency">
              Currency <span>*</span>
            </label>
            <select
              id="account-currency"
              value={currency}
              onChange={(event) => setCurrency(event.target.value)}
              required
            >
              <option value="DKK">DKK — Danish Krone</option>
              <option value="EUR">EUR — Euro</option>
              <option value="USD">USD — US Dollar</option>
              <option value="GBP">GBP — British Pound</option>
            </select>
          </div>
        </div>

        <div className="status-field">
          <div className="status-info">
            <div
              className={`status-icon ${
                isActive ? 'is-active' : 'is-inactive'
              }`}
            >
              {isActive ? <Check size={18} /> : <Wallet size={18} />}
            </div>

            <div>
              <p className="status-title">Active Account</p>
              <p className="status-description">
                {isActive
                  ? 'This account is available for transactions.'
                  : 'This account is currently inactive.'}
              </p>
            </div>
          </div>

          <button
            type="button"
            role="switch"
            aria-checked={isActive}
            aria-label="Account active status"
            onClick={() => setIsActive((current) => !current)}
            disabled={saving}
            className={`status-toggle ${isActive ? 'is-active' : ''}`}
          >
            <span className="status-toggle-thumb" />
          </button>
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
