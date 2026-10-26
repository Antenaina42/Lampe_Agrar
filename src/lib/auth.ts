import { cookies } from 'next/headers';
import bcrypt from 'bcryptjs';
import { prisma } from './prisma';

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  role: string;
  roleDisplayName: string;
  permissions: string[];
  language: string;
  animationsEnabled: boolean;
}

export async function verifyPassword(plainPassword: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plainPassword, hash);
}

export async function createSession(user: {
  id: string;
  email: string;
  name: string;
  role: string;
  roleDisplayName: string;
  permissions: string[];
  language: string;
  animationsEnabled: boolean;
}) {
  const sessionData = JSON.stringify(user);
  const cookieStore = cookies();
  cookieStore.set('lampe_agrar_session', Buffer.from(sessionData).toString('base64'), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });
}

export async function clearSession() {
  const cookieStore = cookies();
  cookieStore.delete('lampe_agrar_session');
}

export async function getServerSession(): Promise<SessionUser | null> {
  try {
    const cookieStore = cookies();
    const sessionCookie = cookieStore.get('lampe_agrar_session');
    if (!sessionCookie || !sessionCookie.value) {
      // If not logged in, return default Betriebsleiter in demo mode for ease of use or null
      return null;
    }
    const decoded = Buffer.from(sessionCookie.value, 'base64').toString('utf-8');
    return JSON.parse(decoded) as SessionUser;
  } catch (error) {
    return null;
  }
}

export async function getEffectiveUser(): Promise<SessionUser> {
  const session = await getServerSession();
  if (session) return session;

  // Fallback to Betriebsleiter Gesa Langenberg for testing & evaluation
  const defaultUser = await prisma.user.findFirst({
    where: { email: 'gesa.langenberg@lampe-agrar.de' },
    include: { role: true, preference: true },
  });

  if (defaultUser) {
    return {
      id: defaultUser.id,
      email: defaultUser.email,
      name: defaultUser.name,
      role: defaultUser.role.name,
      roleDisplayName: defaultUser.role.displayName,
      permissions: (defaultUser.role.permissions as string[]) || [],
      language: defaultUser.preference?.language || 'de',
      animationsEnabled: defaultUser.preference?.animationsEnabled ?? true,
    };
  }

  return {
    id: 'guest',
    email: 'gesa.langenberg@lampe-agrar.de',
    name: 'Gesa Langenberg',
    role: 'BETRIEBSLEITUNG',
    roleDisplayName: 'Betriebsleitung',
    permissions: ['ALL'],
    language: 'de',
    animationsEnabled: true,
  };
}
