import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from '@/lib/auth';
import { logAuditEvent } from '@/lib/audit';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function POST() {
  try {
    const session = await getServerSession();
    // Run seed script
    await execAsync('node scripts/seed.mjs');

    await logAuditEvent({
      userId: session?.id,
      action: 'RESET_DEMO_DATA',
      entity: 'SYSTEM',
    });

    return NextResponse.json({ success: true, message: 'Demonstrationsdaten erfolgreich zurückgesetzt.' });
  } catch (error: any) {
    console.error('Demo data reset error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    const session = await getServerSession();
    // Delete transactions and invoices marked as demo
    await prisma.transaction.deleteMany({ where: { isDemo: true } });
    await prisma.invoice.deleteMany({ where: { isDemo: true } });

    await logAuditEvent({
      userId: session?.id,
      action: 'CLEAR_DEMO_DATA',
      entity: 'SYSTEM',
    });

    return NextResponse.json({ success: true, message: 'Demonstrationsdaten erfolgreich entfernt.' });
  } catch (error: any) {
    console.error('Demo data clear error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
