export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { clearSession, getServerSession } from '@/lib/auth';
import { logAuditEvent } from '@/lib/audit';

export async function POST() {
  const session = await getServerSession();
  if (session) {
    await logAuditEvent({
      userId: session.id,
      action: 'LOGOUT',
      entity: 'USER',
      entityId: session.id,
    });
  }
  await clearSession();
  return NextResponse.json({ success: true });
}
