export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyPassword, createSession } from '@/lib/auth';
import { logAuditEvent } from '@/lib/audit';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'E-Mail und Passwort sind erforderlich.' },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { email: email.trim().toLowerCase() },
      include: { role: true, preference: true },
    });

    if (!user || !user.isActive) {
      return NextResponse.json(
        { error: 'Ungültige Anmeldedaten oder Benutzer deaktiviert.' },
        { status: 401 }
      );
    }

    const isMatch = await verifyPassword(password, user.passwordHash);
    if (!isMatch) {
      return NextResponse.json(
        { error: 'Ungültige Anmeldedaten.' },
        { status: 401 }
      );
    }

    const sessionUser = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role.name,
      roleDisplayName: user.role.displayName,
      permissions: (user.role.permissions as string[]) || [],
      language: user.preference?.language || 'de',
      animationsEnabled: user.preference?.animationsEnabled ?? true,
    };

    await createSession(sessionUser);
    await logAuditEvent({
      userId: user.id,
      action: 'LOGIN',
      entity: 'USER',
      entityId: user.id,
      details: { email: user.email },
    });

    return NextResponse.json({ success: true, user: sessionUser });
  } catch (error: any) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Interner Serverfehler bei der Anmeldung.' },
      { status: 500 }
    );
  }
}
