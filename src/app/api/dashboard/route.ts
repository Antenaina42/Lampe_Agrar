export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import {
  calculateConsolidatedBalance,
  calculateOperatingMargin,
  calculateCashflowForecast,
  roundCurrency,
} from '@/lib/finance-calculations';

export async function GET() {
  try {
    // 1. Bank Accounts
    const accounts = await prisma.financialAccount.findMany({
      where: { isActive: true },
    });
    const consolidatedBalance = calculateConsolidatedBalance(
      accounts.map((a) => ({
        id: a.id,
        name: a.name,
        currentBalance: Number(a.currentBalance),
      }))
    );

    // Available cash (Checking + Cash accounts)
    const availableCash = accounts
      .filter((a) => a.accountType === 'CHECKING' || a.accountType === 'CASH')
      .reduce((sum, a) => sum + Number(a.currentBalance), 0);

    // 2. Transactions
    const transactions = await prisma.transaction.findMany({
      orderBy: { date: 'desc' },
    });

    const totalRevenue = transactions
      .filter((t) => t.type === 'REVENUE')
      .reduce((sum, t) => sum + Number(t.amountNet), 0);

    const totalExpenses = transactions
      .filter((t) => t.type === 'EXPENSE')
      .reduce((sum, t) => sum + Number(t.amountNet), 0);

    const { marginAmount, marginPercent } = calculateOperatingMargin(totalRevenue, totalExpenses);

    // 3. Unpaid Client & Supplier Invoices
    const invoices = await prisma.invoice.findMany({
      where: {
        status: { in: ['SENT', 'DRAFT', 'PARTIALLY_PAID', 'OVERDUE'] },
      },
      include: { customer: true, supplier: true },
    });

    const unpaidClientInvoices = invoices
      .filter((inv) => inv.type === 'OUTGOING')
      .reduce((sum, inv) => sum + (Number(inv.totalAmount) - Number(inv.paidAmount)), 0);

    const unpaidSupplierInvoices = invoices
      .filter((inv) => inv.type === 'INCOMING')
      .reduce((sum, inv) => sum + (Number(inv.totalAmount) - Number(inv.paidAmount)), 0);

    // 4. Cashflow over months (Aggregated from real transactions)
    const monthNames = ['Jan', 'Feb', 'Mär', 'Apr', 'Mai', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dez'];
    const monthlyDataMap: Record<number, { revenue: number; expenses: number }> = {};
    for (let i = 0; i < 12; i++) {
      monthlyDataMap[i] = { revenue: 0, expenses: 0 };
    }

    transactions.forEach((t) => {
      const month = new Date(t.date).getMonth();
      if (t.type === 'REVENUE') {
        monthlyDataMap[month].revenue += Number(t.amountNet);
      } else {
        monthlyDataMap[month].expenses += Number(t.amountNet);
      }
    });

    const cashflow12M = Object.keys(monthlyDataMap).map((mKey) => {
      const idx = Number(mKey);
      const rev = roundCurrency(monthlyDataMap[idx].revenue);
      const exp = roundCurrency(monthlyDataMap[idx].expenses);
      return {
        month: monthNames[idx],
        revenue: rev,
        expenses: exp,
        netResult: roundCurrency(rev - exp),
      };
    });

    // 5. Expense Breakdown by Category
    const categoryTotals: Record<string, number> = {};
    transactions
      .filter((t) => t.type === 'EXPENSE')
      .forEach((t) => {
        categoryTotals[t.categoryKey] = (categoryTotals[t.categoryKey] || 0) + Number(t.amountNet);
      });

    const expenseBreakdown = Object.entries(categoryTotals).map(([catKey, total]) => ({
      category: catKey,
      amount: roundCurrency(total),
    }));

    // 6. Revenue by Activity
    const activityTotals: Record<string, number> = {};
    transactions
      .filter((t) => t.type === 'REVENUE')
      .forEach((t) => {
        activityTotals[t.activity] = (activityTotals[t.activity] || 0) + Number(t.amountNet);
      });

    const revenueByActivity = Object.entries(activityTotals).map(([act, amount]) => ({
      activity: act,
      amount: roundCurrency(amount),
    }));

    // 7. Crop Performance
    const cropSeasons = await prisma.cropSeason.findMany({
      include: { crop: true, field: true },
    });

    const cropProfitability = cropSeasons.map((cs) => {
      const area = Number(cs.areaHa) || 1;
      const margin = Number(cs.grossMargin);
      return {
        cropName: cs.crop.name,
        fieldName: cs.field.name,
        areaHa: area,
        grossMarginPerHa: roundCurrency(margin / area),
        totalMargin: roundCurrency(margin),
      };
    });

    // 8. Pig Batches Performance
    const pigBatches = await prisma.pigBatch.findMany({
      orderBy: { arrivalDate: 'desc' },
    });

    const pigBatchProfitability = pigBatches.map((pb) => ({
      batchNumber: pb.batchNumber,
      barnName: pb.barnName,
      status: pb.status,
      pigCount: pb.currentPigCount,
      mortalityCount: pb.mortalityCount,
      grossMargin: Number(pb.grossMargin),
      directCost: Number(pb.totalDirectCost),
    }));

    // 9. Cash Forecasts (30, 60, 90 days)
    const forecast30 = calculateCashflowForecast({
      currentCash: availableCash,
      receivablesDueInPeriod: unpaidClientInvoices * 0.7,
      payablesDueInPeriod: unpaidSupplierInvoices * 0.8,
      loanPaymentsInPeriod: 6492.0,
      wagesInPeriod: 22630.0,
      projectedOtherRevenues: 15000.0,
      projectedOtherExpenses: 8000.0,
    });

    const forecast60 = calculateCashflowForecast({
      currentCash: availableCash,
      receivablesDueInPeriod: unpaidClientInvoices * 0.9,
      payablesDueInPeriod: unpaidSupplierInvoices,
      loanPaymentsInPeriod: 12984.0,
      wagesInPeriod: 45260.0,
      projectedOtherRevenues: 40000.0,
      projectedOtherExpenses: 20000.0,
    });

    const forecast90 = calculateCashflowForecast({
      currentCash: availableCash,
      receivablesDueInPeriod: unpaidClientInvoices,
      payablesDueInPeriod: unpaidSupplierInvoices,
      loanPaymentsInPeriod: 19476.0,
      wagesInPeriod: 67890.0,
      projectedOtherRevenues: 95000.0,
      projectedOtherExpenses: 38000.0,
    });

    return NextResponse.json({
      consolidatedBalance,
      availableCash: roundCurrency(availableCash),
      totalRevenue: roundCurrency(totalRevenue),
      totalExpenses: roundCurrency(totalExpenses),
      operatingResult: marginAmount,
      marginPercent,
      unpaidClientInvoices: roundCurrency(unpaidClientInvoices),
      unpaidSupplierInvoices: roundCurrency(unpaidSupplierInvoices),
      accounts,
      cashflow12M,
      expenseBreakdown,
      revenueByActivity,
      cropProfitability,
      pigBatchProfitability,
      forecast30,
      forecast60,
      forecast90,
    });
  } catch (error: any) {
    console.error('Dashboard data error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
