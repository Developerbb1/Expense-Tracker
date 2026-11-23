'use server';
import { createClient } from '@/lib/supabase/server';
import { getAuthenticatedUser } from '../actions';
import { Account, AccountFormData } from '@/app/data/types';

export async function getAccounts(): Promise<{
  userId: string;
  accounts: Account[];
}> {
  const user = await getAuthenticatedUser();
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('accounts')
    .select(
      'id, user_id, name, account_type, balance, currency, is_active, created_at, updated_at'
    )
    .eq('user_id', user.id)
    .order('created_at', { ascending: true });

  if (error) {
    throw new Error(`Failed to fetch accounts: ${error.message}`);
  }

  return {
    userId: user.id,
    accounts: (data ?? []) as Account[],
  };
}

export async function addAccount(
  data: AccountFormData
): Promise<{ success: boolean; error: string | null }> {
  try {
    const user = await getAuthenticatedUser();
    const supabase = await createClient();

    const { data: newAccount, error: insertError } = await supabase
      .from('accounts')
      .insert({
        user_id: user.id,
        name: data.name.trim(),
        account_type: data.account_type,
        balance: data.balance,
        currency: data.currency,
        is_active: data.is_active,
      })
      .select()
      .single();

    if (insertError) {
      console.error('Failed to create account:', insertError);

      return {
        success: false,
        error: insertError.message,
      };
    }

    if (!newAccount) {
      return {
        success: false,
        error: 'Account was not created.',
      };
    }

    return {
      success: true,
      error: null,
    };
  } catch (error) {
    console.error('Failed to create account:', error);

    return {
      success: false,
      error:
        error instanceof Error ? error.message : 'Failed to create account.',
    };
  }
}
