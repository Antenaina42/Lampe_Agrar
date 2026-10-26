export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { getServerSession } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const session = await getServerSession();
    if (!session || !session.id || session.id === 'guest') {
      return NextResponse.json({ success: true, guest: true });
    }

    const { language, animationsEnabled } = await request.json();

    const dataToUpdate: any = {};
    if (language && ['de', 'en', 'fr'].includes(language)) {
      dataToUpdate.language = language;
    }
    if (typeof animationsEnabled === 'boolean') {
      dataToUpdate.animationsEnabled = animationsEnabled;
    }

    if (Object.keys(dataToUpdate).length > 0) {
      await prisma.userPreference.upsert({
        where: { userId: session.id },
        update: dataToUpdate,
        create: {
          userId: session.id,
          language: dataToUpdate.language || 'de',
          animationsEnabled: dataToUpdate.animationsEnabled ?? true,
        },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Error updating preference:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
