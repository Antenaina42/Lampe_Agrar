import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from '@/lib/auth';
import { logAuditEvent } from '@/lib/audit';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession();
    const invoiceId = params.id;
    const { amount, paymentMethod = 'BANK_TRANSFER', accountId, reference, notes } = await request.json();

    const paymentAmount = Number(amount);
    if (!paymentAmount || paymentAmount <= 0) {
      return NextResponse.json(
        { error: 'Gültiger Zahlungsbetrag ist erforderlich.' },
        { status: 400 }
      );
    }

    const invoice = await prisma.invoice.findUnique({
      where: { id: invoiceId },
    });

    if (!invoice) {
      return NextResponse.json({ error: 'Rechnung nicht gefunden.' }, { status: 404 });
    }

    // Default account
    let targetAccountId = accountId;
    if (!targetAccountId) {
      const defaultAcc = await prisma.financialAccount.findFirst({
        where: { isDefault: true },
      });
      targetAccountId = defaultAcc?.id;
    }

    const newPaidAmount = Number(invoice.paidAmount) + paymentAmount;
    const isFullyPaid = newPaidAmount >= Number(invoice.totalAmount);
    const newStatus = isFullyPaid ? 'PAID' : 'PARTIALLY_PAID';

    // 1. Create Payment record
    const payment = await prisma.payment.create({
      data: {
        paymentNumber: `PAY-${invoice.invoiceNumber}-${Date.now().toString().slice(-4)}`,
        invoiceId: invoice.id,
        accountId: targetAccountId,
        date: new Date(),
        amount: paymentAmount,
        paymentMethod,
        reference: reference || `Zahlung für ${invoice.invoiceNumber}`,
        notes: notes || null,
        status: 'CONFIRMED',
      },
    });

    // 2. Update Invoice
    const updatedInvoice = await prisma.invoice.update({
      where: { id: invoice.id },
      data: {
        paidAmount: newPaidAmount,
        status: newStatus,
      },
    });

    // 3. Create Corresponding Bank Transaction & update balance
    const trxType = invoice.type === 'OUTGOING' ? 'REVENUE' : 'EXPENSE';
    const count = await prisma.transaction.count();
    const transactionNumber = `TRX-${new Date().getFullYear()}-${String(count + 1).padStart(5, '0')}`;

    await prisma.transaction.create({
      data: {
        transactionNumber,
        type: trxType,
        date: new Date(),
        categoryKey: trxType === 'REVENUE' ? 'REV_INVOICE' : 'EXP_INVOICE',
        description: `Zahlungseingang/-ausgang ${invoice.invoiceNumber}`,
        amountNet: paymentAmount,
        vatRate: 0.0,
        vatAmount: 0.0,
        amountGross: paymentAmount,
        accountId: targetAccountId,
        customerId: invoice.customerId,
        supplierId: invoice.supplierId,
        invoiceId: invoice.id,
        activity: invoice.activity,
        paymentMethod,
        status: 'CLEARED',
      },
    });

    const balanceChange = trxType === 'REVENUE' ? paymentAmount : -paymentAmount;
    await prisma.financialAccount.update({
      where: { id: targetAccountId },
      data: {
        currentBalance: { increment: balanceChange },
      },
    });

    await logAuditEvent({
      userId: session?.id,
      action: 'INVOICE_PAYMENT',
      entity: 'PAYMENT',
      entityId: payment.id,
      details: {
        invoiceNumber: invoice.invoiceNumber,
        paymentAmount,
        newStatus,
      },
    });

    return NextResponse.json({ success: true, invoice: updatedInvoice, payment });
  } catch (error: any) {
    console.error('Payment error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
