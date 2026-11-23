'use client';

import { handleLogout } from '@/lib/supabase/actions';
import { LogOut } from 'lucide-react';
export default function LogoutButton() {
  return (
    <button
      onClick={handleLogout}
      className="btn-action logout-button"
      title="Logout"
    >
      <LogOut size={22} />
    </button>
  );
}
