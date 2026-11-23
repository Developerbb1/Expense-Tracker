'use client';

import { useState } from 'react';
import { FaGithub } from 'react-icons/fa';

import { createClient } from '@/lib/supabase/client';

export default function GithubLoginButton() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleLogin() {
    setLoading(true);
    setError('');

    const supabase = createClient();

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'github',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setError(error.message);
      console.error('GitHub login error:', error);
      setLoading(false);
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={handleLogin}
        disabled={loading}
        className="flex w-full items-center justify-center gap-2 rounded-lg border px-4 py-3 font-medium hover:bg-gray-50 disabled:opacity-60"
      >
        <FaGithub size={20} />
        {loading ? 'Redirecting...' : 'Continue with GitHub'}
      </button>

      {error && (
        <p role="alert" className="mt-2 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
