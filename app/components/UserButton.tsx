'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { UserCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import type { User } from '@supabase/supabase-js';

export default function UserButton() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const supabase = createClient();
    let isMounted = true;

    async function getUser() {
      const { data, error } = await supabase.auth.getUser();

      if (!error && isMounted) {
        setUser(data.user);
      }
    }

    void getUser();

    return () => {
      isMounted = false;
    };
  }, []);

  const avatarUrl = user?.user_metadata?.avatar_url as string | undefined;
  const username =
    user?.user_metadata?.user_name?.slice(0, 8).toUpperCase() ??
    user?.email?.slice(0, 4).toUpperCase() ??
    'USER';

  return (
    <button className="user-button" type="button" title={username}>
      {avatarUrl ? (
        <Image
          src={avatarUrl}
          alt="User profile"
          width={32}
          height={32}
          className="user-button"
        />
      ) : (
        <UserCircle size={20} />
      )}
    </button>
  );
}
