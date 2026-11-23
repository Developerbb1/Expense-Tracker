'use server';

import { createClient } from '@/lib/supabase/server';
import { Category } from '@/app/data/types';
import { authenticateUser, getAuthenticatedUser } from '@/lib/supabase/actions';
import { CategoryFormData } from '@/app/data/types';
import { error } from 'console';

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
): Promise<{ success: boolean; error: any }> {
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

    const { data: newCategory, error: insertError } = await supabase
      .from('categories')
      .insert({
        user_id: user.id,
        name: data.name.trim(),
        type: normalizedType,
        icon: data.icon || null,
        color: data.color || null,
        is_default: data.is_default ?? false,
      })
      .select()
      .single();
    if (insertError) {
      console.log(insertError);
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
): Promise<{ success: boolean; error: any }> {
  authenticateUser();

  try {
    await authenticateUser();

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
      console.log(updateError.message);
      return { success: false, error: updateError };
    }

    if (!updatedCategory) {
      console.log(
        'Category not found or you do not have permission to update it.'
      );
      return {
        success: false,
        error: error,
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
): Promise<{ success: boolean; error: any }> {
  authenticateUser();

  try {
    await authenticateUser();

    const supabase = await createClient();

    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', categoryId)
      .eq('user_id', userid)
      .eq('is_default', false);

    if (error) {
      console.log(error.message);
      return { success: false, error: error };
    }

    return { success: true, error: null };
  } catch (error) {
    console.error('Failed to update category:', error);
    throw error;
  }
}
