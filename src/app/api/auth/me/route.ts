export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getEffectiveUser } from '@/lib/auth';

export async function GET() {
  const user = await getEffectiveUser();
  return NextResponse.json({ user });
}
