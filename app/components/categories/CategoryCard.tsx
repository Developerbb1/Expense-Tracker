'use client';
import { useEffect, useState, useCallback } from 'react';
import { authenticateUser } from '@/lib/supabase/actions';
import { getCategories } from '@/lib/supabase/categories/actions';
import { Category } from '@/app/data/types';
import toast from 'react-hot-toast';
import { Layers, TrendingDown, TrendingUp } from 'lucide-react';

export default function CategoryCards() {
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<Category[]>([]);
  const fetchCategories = useCallback(async () => {
    authenticateUser();
    setLoading(true);
    try {
      const result = await getCategories();
      setCategories(result.categories);
    } catch (error) {
      console.error('Error fetching categories:', error);

      toast.error('Failed to get all categories. Please try again.', {
        className: 'error-toast',
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchCategories();
  }, [fetchCategories]);

  const incomeCount = categories.filter(
    (category) => category.type === 'income'
  ).length;

  const expenseCount = categories.filter(
    (category) => category.type === 'expense'
  ).length;

  return (
    <>
      {loading ? (
        <div className="flex items-center justify-center gap-2 py-6">
          <span className="loading-spinner" />
          <span className="text-sm text-blue-700">Loading categories...</span>
        </div>
      ) : (
        <section className="stats">
          <div className="stat-card">
            <div className="stat-icon blue">
              <Layers size={21} />
            </div>
            <div>
              <p>Total categories</p>
              <h2>{categories.length}</h2>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon red">
              <TrendingDown size={21} />
            </div>
            <div>
              <p>Expense categories</p>
              <h2>{expenseCount}</h2>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon green">
              <TrendingUp size={21} />
            </div>
            <div>
              <p>Income categories</p>
              <h2>{incomeCount}</h2>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
