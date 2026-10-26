export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const investments = await prisma.investment.findMany({
      include: {
        supplier: true,
      },
      orderBy: { purchaseDate: 'desc' },
    });

    const loans = await prisma.loan.findMany({
      include: {
        payments: {
          orderBy: { paymentDate: 'desc' },
          take: 12,
        },
      },
      orderBy: { startDate: 'desc' },
    });

    let totalInvestmentVolume = 0;
    investments.forEach((inv) => {
      totalInvestmentVolume += Number(inv.amount) || 0;
    });

    let totalOriginalLoans = 0;
    let totalRemainingDebt = 0;
    let totalMonthlyDebtService = 0;

    loans.forEach((l) => {
      totalOriginalLoans += Number(l.principalAmount) || 0;
      if (l.status === 'ACTIVE') {
        totalRemainingDebt += Number(l.remainingPrincipal) || 0;
        totalMonthlyDebtService += Number(l.monthlyPayment) || 0;
      }
    });

    return NextResponse.json({
      investments,
      loans,
      summary: {
        totalInvestmentVolume,
        totalOriginalLoans,
        totalRemainingDebt,
        totalMonthlyDebtService,
        annualDebtService: totalMonthlyDebtService * 12,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action } = body;

    if (action === 'LOAN') {
      const { loanNumber, lenderName, principalAmount, interestRate, startDate, endDate, termMonths, monthlyPayment } = body;
      const loan = await prisma.loan.create({
        data: {
          loanNumber: loanNumber || `DAR-${Date.now().toString().slice(-4)}`,
          lenderName,
          principalAmount: Number(principalAmount),
          interestRate: Number(interestRate),
          startDate: new Date(startDate),
          endDate: new Date(endDate),
          termMonths: Number(termMonths),
          monthlyPayment: Number(monthlyPayment),
          remainingPrincipal: Number(principalAmount),
          status: 'ACTIVE',
        },
      });
      return NextResponse.json({ success: true, loan });
    } else {
      // New investment
      const { title, category, amount, purchaseDate, financingType, downPayment, depreciationYears, notes, supplierId } = body;
      const investment = await prisma.investment.create({
        data: {
          title,
          category: category || 'MACHINERY',
          amount: Number(amount),
          purchaseDate: purchaseDate ? new Date(purchaseDate) : new Date(),
          financingType: financingType || 'BANK_LOAN',
          downPayment: Number(downPayment) || 0,
          depreciationYears: Number(depreciationYears) || 10,
          notes: notes || null,
          supplierId: supplierId || null,
        },
      });
      return NextResponse.json({ success: true, investment });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
