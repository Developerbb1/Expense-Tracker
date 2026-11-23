'use server';

import { createClient } from '@/lib/supabase/server';
import { Category, CategoryFormData } from '@/app/data/types';
import { authenticateUser, getAuthenticatedUser } from '@/lib/supabase/actions';

type CategoryActionResult = {
  success: boolean;
  error: string | null;
};

export async function getCategories(): Promise<{
  userId: string;
  categories: Category[];
}> {
  const user = await getAuthenticatedUser();
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('categories')
    .select(
      'id, user_id, name, type, icon, color, description, is_default, is_active, created_at, updated_at'
    )
    .eq('user_id', user.id)
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch categories: ${error.message}`);
  }

  const categories: Category[] = (data ?? []).map((row) => ({
    ...row,
    type: row.type.toLowerCase() as 'income' | 'expense',
  }));

  return {
    userId: user.id,
    categories,
  };
}

export async function addCategory(
  data: CategoryFormData
): Promise<CategoryActionResult> {
  try {
    const user = await getAuthenticatedUser();
    const supabase = await createClient();

    const normalizedType =
      data.type.toLowerCase() === 'income'
        ? 'Income'
        : data.type.toLowerCase() === 'expense'
          ? 'Expense'
          : null;

    if (!normalizedType) {
      throw new Error(`Invalid category type: ${data.type}`);
    }

    const { error: insertError } = await supabase.from('categories').insert({
      user_id: user.id,
      name: data.name.trim(),
      type: normalizedType,
      icon: data.icon || null,
      color: data.color || null,
      is_default: data.is_default ?? false,
    });

    if (insertError) {
      console.error('Failed to insert category:', insertError.message);

      return {
        success: false,
        error: insertError.message,
      };
    }

    return { success: true, error: null };
  } catch (error) {
    console.error('Failed to create category:', error);

    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'Failed to create category.',
    };
  }
}

export async function updateCategory(
  data: CategoryFormData,
  userid: string
): Promise<CategoryActionResult> {
  try {
    await authenticateUser();

    if (!data.id) {
      throw new Error('Category ID is required.');
    }

    const supabase = await createClient();

    const normalizedType =
      data.type.toLowerCase() === 'income'
        ? 'Income'
        : data.type.toLowerCase() === 'expense'
          ? 'Expense'
          : null;

    if (!normalizedType) {
      throw new Error(`Invalid category type: ${data.type}`);
    }

    const { data: updatedCategory, error: updateError } = await supabase
      .from('categories')
      .update({
        name: data.name.trim(),
        type: normalizedType,
        color: data.color,
        icon: data.icon || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', data.id)
      .eq('user_id', userid)
      .select('id')
      .maybeSingle();

    if (updateError) {
      console.error('Failed to update category:', updateError.message);

      return {
        success: false,
        error: updateError.message,
      };
    }

    if (!updatedCategory) {
      return {
        success: false,
        error: 'Category not found or you do not have permission to update it.',
      };
    }

    return { success: true, error: null };
  } catch (error) {
    console.error('Failed to update category:', error);
    throw error;
  }
}

export async function deleteCategory(
  categoryId: string,
  userid: string
): Promise<CategoryActionResult> {
  try {
    await authenticateUser();

    const supabase = await createClient();

    const { error: deleteError } = await supabase
      .from('categories')
      .delete()
      .eq('id', categoryId)
      .eq('user_id', userid)
      .eq('is_default', false);

    if (deleteError) {
      console.error('Failed to delete category:', deleteError.message);

      return {
        success: false,
        error: deleteError.message,
      };
    }

    return { success: true, error: null };
  } catch (error) {
    console.error('Failed to delete category:', error);
    throw error;
  }
}
