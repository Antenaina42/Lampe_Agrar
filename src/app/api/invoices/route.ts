import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from '@/lib/auth';
import { logAuditEvent } from '@/lib/audit';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const status = searchParams.get('status');

    const whereClause: any = {};
    if (type && (type === 'OUTGOING' || type === 'INCOMING')) {
      whereClause.type = type;
    }
    if (status && status !== 'ALL') {
      whereClause.status = status;
    }

    const invoices = await prisma.invoice.findMany({
      where: whereClause,
      include: {
        customer: true,
        supplier: true,
        lines: true,
        payments: true,
      },
      orderBy: { issueDate: 'desc' },
    });

    return NextResponse.json({ invoices });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession();
    const data = await request.json();

    const {
      type = 'OUTGOING',
      customerId,
      supplierId,
      issueDate,
      dueDate,
      language = 'de',
      activity = 'GENERAL',
      notes,
      lines = [],
    } = data;

    // Calculate subtotal, taxes, total
    let subtotal = 0;
    let taxAmount = 0;

    const formattedLines = lines.map((l: any) => {
      const q = Number(l.quantity) || 1;
      const p = Number(l.unitPrice) || 0;
      const rate = Number(l.taxRate) || 19.0;
      const lineSub = q * p;
      const lineTax = (lineSub * rate) / 100;
      const lineTot = lineSub + lineTax;

      subtotal += lineSub;
      taxAmount += lineTax;

      return {
        description: l.description,
        quantity: q,
        unit: l.unit || 'Stk',
        unitPrice: p,
        taxRate: rate,
        taxAmount: lineTax,
        subtotal: lineSub,
        total: lineTot,
      };
    });

    const totalAmount = subtotal + taxAmount;

    // Generate unique invoice number
    const count = await prisma.invoice.count({ where: { type } });
    const prefix = type === 'OUTGOING' ? 'RE' : 'ER';
    const invoiceNumber = `${prefix}-${new Date().getFullYear()}-${String(count + 1).padStart(4, '0')}`;

    const newInvoice = await prisma.invoice.create({
      data: {
        invoiceNumber,
        type,
        customerId: customerId || null,
        supplierId: supplierId || null,
        issueDate: new Date(issueDate || Date.now()),
        dueDate: new Date(dueDate || Date.now()),
        status: 'SENT',
        subtotal,
        taxAmount,
        totalAmount,
        paidAmount: 0.0,
        language,
        activity,
        notes: notes || null,
        lines: {
          create: formattedLines,
        },
      },
      include: {
        lines: true,
        customer: true,
        supplier: true,
      },
    });

    await logAuditEvent({
      userId: session?.id,
      action: 'CREATE_INVOICE',
      entity: 'INVOICE',
      entityId: newInvoice.id,
      details: {
        invoiceNumber,
        type,
        totalAmount,
      },
    });

    return NextResponse.json({ success: true, invoice: newInvoice });
  } catch (error: any) {
    console.error('Error creating invoice:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
