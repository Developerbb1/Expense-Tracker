'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Pencil, Layers, Trash } from 'lucide-react';
import {
  CategoryType,
  Category,
  CategoryFormData,
  getCategoryIcon,
} from '@/app/data/types';
import { authenticateUser, getAuthenticatedUser } from '@/lib/supabase/actions';
import EditCategoryModal from '@/app/components/categories/EditCategoryModal';
import DeleteCategoryModal from '@/app/components/categories/DeleteCategoryModal';
import SearchPanel from '@/app/components/common/SearchPanel';
import { toast } from 'react-hot-toast';
import {
  getCategories,
  updateCategory,
  deleteCategory,
} from '@/lib/supabase/categories/actions';

type CategoryFilter = 'all' | CategoryType;

const DEFAULT_COLOR = '#2563EB';

export default function AllCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [userId, setUserId] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState('');

  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<CategoryFilter>('all');

  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [saving, setSaving] = useState(false);
  // Fetch categories belonging to the logged-in user.

  const fetchCategories = useCallback(async () => {
    authenticateUser();
    setLoading(true);
    setPageError('');
    try {
      const result = await getCategories();

      setUserId(result.userId);
      setCategories(result.categories);
      console.log(categories);
    } catch (error) {
      console.error('Error fetching categories:', error);

      toast.error('Failed to get all categories. Please try again.', {
        className: 'error-toast',
      });

      setPageError('Unable to load categories. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchCategories();
  }, [fetchCategories]);

  const filteredCategories = useMemo(() => {
    return categories.filter((category) => {
      const matchesSearch = category.name
        .toLowerCase()
        .includes(search.trim().toLowerCase());

      const matchesFilter = filter === 'all' || category.type === filter;

      return matchesSearch && matchesFilter;
    });
  }, [categories, search, filter]);

  function openEditModal(category: Category) {
    setEditingCategory(category);
    setShowEditModal(true);
  }
  function openDeleteModal(category: Category) {
    setEditingCategory(category);
    setShowDeleteModal(true);
  }

  async function handleUpdateCategory(data: CategoryFormData) {
    setSaving(true);
    try {
      const user = await getAuthenticatedUser();
      const result = await updateCategory(data, user.id);
      if (!result.success) {
        toast.error(
          typeof result.error === 'string'
            ? result.error
            : 'Failed to update category.'
        );
        return;
      }
      toast.success('Category updated successfully!', {
        className: 'category-success-toast',
      });
      setShowEditModal(false);
      setEditingCategory(null);
      await fetchCategories();
    } catch (error) {
      console.error('Failed to update category:', error);
      toast.error(
        error instanceof Error ? error.message : 'Failed to update category.',
        { className: 'error-toast' }
      );
    } finally {
      setSaving(false);
    }
  }

  async function handleDeleteCategory(category: Category) {
    setSaving(true);
    try {
      const user = await getAuthenticatedUser();
      const result = await deleteCategory(category.id, user.id);
      if (!result.success) {
        toast.error(
          typeof result.error === 'string'
            ? result.error
            : 'Failed to delete category.'
        );
        return;
      }
      toast.success('Category deleted successfully!', {
        className: 'category-success-toast',
      });
      setShowDeleteModal(false);
      await fetchCategories();
    } catch (error) {
      console.error('Failed to delete category:', error);
      toast.error(
        error instanceof Error ? error.message : 'Failed to delete category.',
        { className: 'error-toast' }
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <section className="section-card">
        <div className="list-heading">
          <div>
            <h2>All Categories</h2>
            <p>View, search and manage your categories.</p>
          </div>
        </div>
        <div className="transactions-toolbar">
          <SearchPanel
            search={search}
            onSearchChange={setSearch}
            placeholder="Search categories..."
          />
        </div>

        <div className="panel-header">
          <div className="filters">
            {(['all', 'expense', 'income'] as const).map((item) => (
              <button
                type="button"
                key={item}
                className={`filter ${filter === item ? 'active' : ''}`}
                onClick={() => setFilter(item)}
              >
                {item === 'all'
                  ? 'All'
                  : item.charAt(0).toUpperCase() + item.slice(1)}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <span className="total">
              {filteredCategories.length} categories
            </span>
          </div>
        </div>

        {pageError && (
          <div className="error" role="alert">
            <p>{pageError}</p>
            <button
              type="button"
              onClick={() => void fetchCategories()}
              className="font-medium underline"
            >
              Try again
            </button>
          </div>
        )}

        <div className="table-wrapper">
          <table className="list-table w-full table-fixed">
            <thead>
              <tr>
                <th className="w-2/4">Category</th>
                <th className="w-1/4">Type</th>
                <th className="w-1/4  justify-end">Actions</th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={3} className="empty">
                    <div className="flex items-center justify-center gap-2 py-6">
                      <span className="loading-spinner" />
                      <span className="text-sm text-blue-700">
                        Loading categories...
                      </span>
                    </div>
                  </td>
                </tr>
              ) : (
                <>
                  {filteredCategories.map((category) => {
                    //const Icon = getCategoryIcon(category.icon, category.name);
                    const Icon = getCategoryIcon(category.icon);
                    const isIncome = category.type === 'income';
                    return (
                      <tr key={category.id}>
                        <td className="w-2/4">
                          <div className="table-td-div">
                            <div
                              className={`transaction-icon ${
                                isIncome ? 'income-icon' : 'expense-icon'
                              }`}
                            >
                              <Icon size={19} />
                            </div>

                            <span>{category.name}</span>
                          </div>
                        </td>

                        <td className="w-1/4">
                          <span
                            className={`transaction-type-badge  ${
                              category.type === 'income'
                                ? 'income-type'
                                : 'expense-type'
                            }`}
                          >
                            {category.type === 'income' ? 'Income' : 'Expense'}
                          </span>
                        </td>

                        <td className="w-1/4">
                          <div className="actions">
                            <button
                              type="button"
                              onClick={() => openEditModal(category)}
                              title={`Edit ${category.name}`}
                              aria-label={`Edit ${category.name}`}
                            >
                              <Pencil size={16} />
                            </button>
                            <button
                              type="button"
                              onClick={() => openDeleteModal(category)}
                              title={`Edit ${category.name}`}
                              aria-label={`Edit ${category.name}`}
                            >
                              <Trash size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}

                  {filteredCategories.length === 0 && !pageError && (
                    <tr>
                      <td colSpan={3} className="empty">
                        <Layers size={30} />
                        <p>No categories found.</p>
                        <span>Try another search or add a category.</span>
                      </td>
                    </tr>
                  )}
                </>
              )}
            </tbody>
          </table>
        </div>
      </section>

      <EditCategoryModal
        isOpen={showEditModal}
        category={editingCategory}
        onClose={() => {
          setShowEditModal(false);
          setEditingCategory(null);
        }}
        onSubmit={handleUpdateCategory}
      />

      <DeleteCategoryModal
        isOpen={showDeleteModal}
        category={editingCategory}
        isSaving={saving}
        onClose={() => {
          setShowDeleteModal(false);
          setEditingCategory(null);
        }}
        onSubmit={handleDeleteCategory}
      />
    </>
  );
}
