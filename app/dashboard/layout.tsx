/**
 * This layout:

Checks the user's authentication claims on the server.

Redirects unauthenticated users to /login.

Protects all pages nested under /dashboard.

Provides a shared place for dashboard navigation and layout components later.

*/

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data, error } = await supabase.auth.getClaims();

  if (error || !data?.claims?.sub) {
    redirect('/login');
  }

  return <>{children}</>;
}
