'use client';

import { useState, type FormEvent } from 'react';
import { Plus, Tag, ArrowDownCircle, ArrowUpCircle } from 'lucide-react';

import ModalLayout from '@/app/components/modals/ModalLayout';
import {
  categoryIcons,
  categoryColors,
  CategoryType,
  AddCategoryModalProps,
} from '@/app/data/types';

export default function AddCategoryModal({
  isOpen,
  onSubmit,
  onClose,
}: AddCategoryModalProps) {
  const [name, setName] = useState('');
  const [type, setType] = useState<CategoryType>('expense');
  const [icon, setIcon] = useState('Tag');
  const [color, setColor] = useState(categoryColors[0]);
  const [isDefault, setIsDefault] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Please enter a category name.');
      return;
    }

    setSaving(true);

    try {
      await onSubmit({
        name: name.trim(),
        type,
        icon,
        color,
        is_default: isDefault,
      });

      setName('');
      setType('expense');
      setIcon('Tag');
      setColor(categoryColors[0]);
      setIsDefault(false);
      setError('');

      onClose();
    } catch {
      setError('Unable to save the category. Please try again.');
    } finally {
      setSaving(false);
    }
  }

  const SelectedIcon =
    categoryIcons.find((item) => item.name === icon)?.Icon ?? Tag;

  return (
    <ModalLayout
      isOpen={isOpen}
      title="Add Category"
      description="Create a category to organize your transactions"
      titleId="modal-title"
      icon={<Plus size={25} />}
      onClose={onClose}
      onSubmit={handleSubmit}
      saving={saving}
      maxWidth={621}
      submitButton={
        <>
          <Plus size={20} />
          {saving ? 'Saving...' : 'Create Category'}
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
        <div className="form-field">
          <label htmlFor="name">
            Category Name <span>*</span>
          </label>

          <input
            id="name"
            type="text"
            placeholder="e.g. Groceries"
            value={name}
            onChange={(event) => setName(event.target.value)}
            maxLength={100}
            required
            autoFocus
          />
        </div>

        <div className="form-field">
          <label>
            Category Type <span>*</span>
          </label>

          <div className="type-selector">
            <button
              type="button"
              className={`type-option ${
                type === 'expense' ? 'expense-active' : ''
              }`}
              onClick={() => setType('expense')}
              aria-pressed={type === 'expense'}
            >
              <ArrowDownCircle size={25} />

              <span className="type-text">
                <strong>expense</strong>
                <small>Money going out</small>
              </span>

              {type === 'expense' && <span className="type-check">✓</span>}
            </button>

            <button
              type="button"
              className={`type-option ${
                type === 'income' ? 'income-active' : ''
              }`}
              onClick={() => setType('income')}
              aria-pressed={type === 'income'}
            >
              <ArrowUpCircle size={25} />

              <span className="type-text">
                <strong>income</strong>
                <small>Money coming in</small>
              </span>

              {type === 'income' && <span className="type-check">✓</span>}
            </button>
          </div>
        </div>

        <div className="form-field">
          <label htmlFor="icon">
            Icon <small>(optional)</small>
          </label>

          <select
            id="icon"
            value={icon}
            onChange={(event) => setIcon(event.target.value)}
          >
            {categoryIcons.map((item) => (
              <option key={item.name} value={item.name}>
                {item.name}
              </option>
            ))}
          </select>

          <div className="icon-preview">
            <SelectedIcon size={21} color={color} />
            <span>Icon preview</span>
          </div>
        </div>

        <div className="form-field">
          <label>
            Color <small>(optional)</small>
          </label>

          <div className="color-options">
            {categoryColors.map((option) => (
              <button
                key={option}
                type="button"
                className={`color-option ${color === option ? 'selected' : ''}`}
                style={{ backgroundColor: option }}
                onClick={() => setColor(option)}
                aria-label={`Choose color ${option}`}
                aria-pressed={color === option}
              />
            ))}
          </div>
        </div>

        <label className="default-option">
          <input
            type="checkbox"
            checked={isDefault}
            onChange={(event) => setIsDefault(event.target.checked)}
          />

          <span>
            <strong>Set as default category</strong>
            <small>Mark this category as a built-in option</small>
          </span>
        </label>

        {error && (
          <p className="form-error" role="alert">
            {error}
          </p>
        )}
      </div>
    </ModalLayout>
  );
}
