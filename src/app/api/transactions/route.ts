import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from '@/lib/auth';
import { logAuditEvent } from '@/lib/audit';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const activity = searchParams.get('activity');
    const search = searchParams.get('search');

    const whereClause: any = {};
    if (type && (type === 'REVENUE' || type === 'EXPENSE')) {
      whereClause.type = type;
    }
    if (activity && activity !== 'ALL') {
      whereClause.activity = activity;
    }
    if (search) {
      whereClause.OR = [
        { description: { contains: search } },
        { transactionNumber: { contains: search } },
      ];
    }

    const transactions = await prisma.transaction.findMany({
      where: whereClause,
      include: {
        account: true,
        customer: true,
        supplier: true,
      },
      orderBy: { date: 'desc' },
    });

    return NextResponse.json({ transactions });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession();
    const data = await request.json();

    const {
      type,
      date,
      description,
      amountNet,
      vatRate,
      vatAmount,
      amountGross,
      categoryKey,
      activity = 'GENERAL',
      accountId,
      customerId,
      supplierId,
      paymentMethod = 'BANK_TRANSFER',
      notes,
    } = data;

    // Default account if not provided
    let targetAccountId = accountId;
    if (!targetAccountId) {
      const defaultAcc = await prisma.financialAccount.findFirst({
        where: { isDefault: true },
      });
      targetAccountId = defaultAcc?.id;
    }

    if (!targetAccountId) {
      const anyAcc = await prisma.financialAccount.findFirst();
      targetAccountId = anyAcc?.id;
    }

    const count = await prisma.transaction.count();
    const transactionNumber = `TRX-${new Date().getFullYear()}-${String(count + 1).padStart(5, '0')}`;

    const newTransaction = await prisma.transaction.create({
      data: {
        transactionNumber,
        type: type || 'REVENUE',
        date: new Date(date || Date.now()),
        description,
        amountNet: Number(amountNet),
        vatRate: Number(vatRate) || 19.0,
        vatAmount: Number(vatAmount) || 0.0,
        amountGross: Number(amountGross),
        categoryKey,
        activity,
        accountId: targetAccountId,
        customerId: customerId || null,
        supplierId: supplierId || null,
        paymentMethod,
        notes: notes || null,
        status: 'CLEARED',
      },
    });

    // Update account balance
    const change = type === 'REVENUE' ? Number(amountGross) : -Number(amountGross);
    await prisma.financialAccount.update({
      where: { id: targetAccountId },
      data: {
        currentBalance: {
          increment: change,
        },
      },
    });

    await logAuditEvent({
      userId: session?.id,
      action: 'CREATE_TRANSACTION',
      entity: 'TRANSACTION',
      entityId: newTransaction.id,
      details: {
        transactionNumber,
        type,
        amountGross,
      },
    });

    return NextResponse.json({ success: true, transaction: newTransaction });
  } catch (error: any) {
    console.error('Error creating transaction:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
