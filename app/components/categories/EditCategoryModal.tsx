'use client';

import { useState, type FormEvent } from 'react';
import { Tag, ArrowDownCircle, ArrowUpCircle } from 'lucide-react';

import ModalLayout from '@/app/components/modals/ModalLayout';
import {
  categoryIcons,
  categoryColors,
  Category,
  CategoryType,
  CategoryFormData,
} from '@/app/data/types';

interface EditCategoryModalProps {
  isOpen: boolean;
  category: Category | null;
  onSubmit: (data: CategoryFormData) => void | Promise<void>;
  onClose: () => void;
}

export default function EditCategoryModal(props: EditCategoryModalProps) {
  const { isOpen, category } = props;

  return (
    <EditCategoryModalContent
      key={`${isOpen}-${category?.id ?? 'none'}`}
      {...props}
    />
  );
}

function EditCategoryModalContent({
  isOpen,
  category,
  onSubmit,
  onClose,
}: EditCategoryModalProps) {
  const [id] = useState(() => category?.id ?? '');
  const [name, setName] = useState(() => category?.name ?? '');
  const [type, setType] = useState<CategoryType>(
    () => category?.type ?? 'expense'
  );
  const [icon, setIcon] = useState(() => category?.icon || 'Tag');
  const [color, setColor] = useState(
    () => category?.color || categoryColors[0]
  );
  const [isDefault, setIsDefault] = useState(
    () => category?.is_default ?? false
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');

    if (!category) {
      setError('No category selected.');
      return;
    }

    if (!name.trim()) {
      setError('Please enter a category name.');
      return;
    }

    setSaving(true);

    try {
      await onSubmit({
        id,
        name: name.trim(),
        type,
        icon,
        color,
        is_default: isDefault,
      });

      setError('');
      onClose();
    } catch (err) {
      console.error('Unable to update category:', err);

      const message = err instanceof Error ? err.message : '';

      if (
        message.includes('unique_category_per_user') ||
        message.includes('duplicate key')
      ) {
        setError('A category with this name and type already exists.');
      } else {
        setError('Unable to update the category. Please try again.');
      }
    } finally {
      setSaving(false);
    }
  }

  const SelectedIcon =
    categoryIcons.find((item) => item.name === icon)?.Icon ?? Tag;

  return (
    <ModalLayout
      isOpen={isOpen}
      title="Edit Category"
      description="Update your category details"
      titleId="edit-modal-title"
      icon={<Tag size={25} />}
      onClose={onClose}
      onSubmit={handleSubmit}
      saving={saving}
      maxWidth={620}
      submitButton={
        <>
          <Tag size={20} />
          {saving ? 'Saving...' : 'Update Category'}
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
          <label htmlFor="edit-name">
            Category Name <span>*</span>
          </label>

          <input
            id="edit-name"
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
          <label htmlFor="edit-icon">
            Icon <small>(optional)</small>
          </label>

          <select
            id="edit-icon"
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
                className={`color-option ${
                  color.toLowerCase() === option.toLowerCase() ? 'selected' : ''
                }`}
                style={{ backgroundColor: option }}
                onClick={() => setColor(option)}
                aria-label={`Choose color ${option}`}
                aria-pressed={color.toLowerCase() === option.toLowerCase()}
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
