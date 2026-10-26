export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      include: {
        role: true,
        preference: true,
      },
      orderBy: { createdAt: 'asc' },
    });

    const roles = await prisma.role.findMany();

    const safeUsers = users.map((u) => ({
      id: u.id,
      email: u.email,
      name: u.name,
      role: u.role,
      isActive: u.isActive,
      language: u.preference?.language || 'de',
      createdAt: u.createdAt,
    }));

    return NextResponse.json({ users: safeUsers, roles });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password, name, roleId } = body;

    if (!email || !password || !name || !roleId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({
      where: { email },
    });

    if (existing) {
      return NextResponse.json({ error: 'E-Mail existiert bereits' }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        name,
        roleId,
        isActive: true,
        preference: {
          create: {
            language: 'de',
            animationsEnabled: true,
          },
        },
      },
      include: {
        role: true,
        preference: true,
      },
    });

    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        isActive: user.isActive,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { userId, isActive, roleId } = body;

    const dataToUpdate: any = {};
    if (typeof isActive === 'boolean') dataToUpdate.isActive = isActive;
    if (roleId) dataToUpdate.roleId = roleId;

    const user = await prisma.user.update({
      where: { id: userId },
      data: dataToUpdate,
      include: { role: true },
    });

    return NextResponse.json({ success: true, user });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
