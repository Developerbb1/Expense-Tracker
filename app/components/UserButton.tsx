'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { UserCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';

export default function UserButton() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(({ data, error }) => {
      if (!error) {
        setUser(data.user);
      }
    });
  }, []);

  const avatarUrl = user?.user_metadata?.avatar_url;
  const username = user?.user_metadata?.user_name.slice(0, 8).toUpperCase();

  return (
    <>
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
          <>
            <UserCircle size={20} />
          </>
        )}
      </button>
    </>
  );
}
