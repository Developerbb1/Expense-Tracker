import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const secret = process.env.HEALTH_CHECK_SECRET;

  if (!secret || request.headers.get('authorization') !== `Bearer ${secret}`) {
    return NextResponse.json({ status: 'unauthorized' }, { status: 401 });
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    return NextResponse.json(
      { status: 'missing configuration' },
      { status: 500 }
    );
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });

  const { error } = await supabase.from('categories').select('id').limit(1);

  if (error) {
    return NextResponse.json(
      { status: 'database error', message: error.message },
      { status: 503 }
    );
  }

  return NextResponse.json({
    status: 'healthy',
    database: 'connected',
    checkedAt: new Date().toISOString(),
  });
}
