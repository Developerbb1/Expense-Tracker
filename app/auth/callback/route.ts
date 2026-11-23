import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const code = searchParams.get('code');
  const next = searchParams.get('next');

  const destination =
    next?.startsWith('/') && !next.startsWith('//') && !next.startsWith('/\\')
      ? next
      : '/dashboard';

  if (!code) {
    console.error(
      'OAuth callback received no code:',
      searchParams.get('error'),
      searchParams.get('error_description')
    );

    return NextResponse.redirect(
      new URL('/login?error=auth_callback_failed', origin)
    );
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    console.error('OAuth code exchange failed:', error.message);

    return NextResponse.redirect(
      new URL('/login?error=auth_callback_failed', origin)
    );
  }

  return NextResponse.redirect(new URL(destination, origin));
}
