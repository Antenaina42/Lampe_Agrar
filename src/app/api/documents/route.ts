export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const documents = await prisma.attachment.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ documents });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { fileName, fileUrl, fileSize, mimeType, entityType, entityId, notes } = body;

    const attachment = await prisma.attachment.create({
      data: {
        fileName: fileName || 'Beleg.pdf',
        fileUrl: fileUrl || '/uploads/beleg.pdf',
        fileSize: Number(fileSize) || 102400,
        mimeType: mimeType || 'application/pdf',
        entityType: entityType || 'INVOICE',
        entityId: entityId || 'DOC-GENERAL',
      },
    });

    return NextResponse.json({ success: true, document: attachment });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
