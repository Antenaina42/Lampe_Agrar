export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateDatevCsv, generateExcelReport } from '@/lib/export-utils';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const exportType = searchParams.get('export');
    const yearParam = searchParams.get('year') || '2026';
    const targetYear = parseInt(yearParam, 10);

    const startOfYear = new Date(`${targetYear}-01-01T00:00:00.000Z`);
    const endOfYear = new Date(`${targetYear}-12-31T23:59:59.999Z`);

    const transactions = await prisma.transaction.findMany({
      where: {
        date: {
          gte: startOfYear,
          lte: endOfYear,
        },
      },
      include: {
        customer: true,
        supplier: true,
        account: true,
      },
      orderBy: { date: 'asc' },
    });

    // Check if DATEV or Excel export is requested
    if (exportType === 'DATEV') {
      const csvData = generateDatevCsv(transactions);
      return new Response(csvData, {
        headers: {
          'Content-Type': 'text/csv; charset=windows-1252',
          'Content-Disposition': `attachment; filename="DATEV_Buchungsstapel_Lampe_Agrar_${targetYear}.csv"`,
        },
      });
    }

    if (exportType === 'EXCEL') {
      const buffer = generateExcelReport(transactions, `Finanzbericht ${targetYear}`);
      return new Response(new Uint8Array(buffer), {
        headers: {
          'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'Content-Disposition': `attachment; filename="Lampe_Agrar_Finanzbericht_${targetYear}.xlsx"`,
        },
      });
    }

    // Otherwise calculate BWA and VAT metrics for JSON response
    let revenuePotatoes = 0;
    let revenuePigs = 0;
    let revenueCrops = 0;
    let revenueOther = 0;

    let expenseFeed = 0;
    let expenseFertilizer = 0;
    let expenseSeeds = 0;
    let expenseFuel = 0;
    let expenseRepairs = 0;
    let expenseGeneral = 0;

    let vatPayable19 = 0;
    let vatPayable7 = 0;
    let vatPayableFlat = 0;
    let vatInputDeductible = 0;

    transactions.forEach((tx) => {
      const net = Number(tx.amountNet) || 0;
      const vat = Number(tx.vatAmount) || 0;
      const rate = Number(tx.vatRate) || 0;

      if (tx.type === 'REVENUE') {
        if (tx.activity === 'POTATO_STORAGE' || tx.description.toLowerCase().includes('kartoffel')) {
          revenuePotatoes += net;
        } else if (tx.activity === 'LIVESTOCK' || tx.description.toLowerCase().includes('schwein') || tx.description.toLowerCase().includes('mast')) {
          revenuePigs += net;
        } else if (tx.activity === 'CROPS') {
          revenueCrops += net;
        } else {
          revenueOther += net;
        }

        if (rate === 19) vatPayable19 += vat;
        else if (rate === 7) vatPayable7 += vat;
        else vatPayableFlat += vat;
      } else {
        if (tx.description.toLowerCase().includes('futter')) expenseFeed += net;
        else if (tx.description.toLowerCase().includes('dünger')) expenseFertilizer += net;
        else if (tx.description.toLowerCase().includes('saat')) expenseSeeds += net;
        else if (tx.description.toLowerCase().includes('diesel') || tx.description.toLowerCase().includes('kraftstoff')) expenseFuel += net;
        else if (tx.description.toLowerCase().includes('reparatur') || tx.description.toLowerCase().includes('ersatzteil')) expenseRepairs += net;
        else expenseGeneral += net;

        vatInputDeductible += vat;
      }
    });

    const totalRevenues = revenuePotatoes + revenuePigs + revenueCrops + revenueOther;
    const materialCosts = expenseFeed + expenseFertilizer + expenseSeeds + expenseFuel;
    const grossMargin = totalRevenues - materialCosts;

    // Personnel costs (fetch from employees)
    const employees = await prisma.employee.findMany({ where: { active: true } });
    const annualPersonnelCost = employees.reduce((sum, e) => sum + (Number(e.monthlyEmployerCost) * 12), 0);

    const otherExpenses = expenseRepairs + expenseGeneral;
    const ebitda = grossMargin - annualPersonnelCost - otherExpenses;

    // Loan interest
    const loans = await prisma.loan.findMany({ where: { status: 'ACTIVE' } });
    const annualInterest = loans.reduce((sum, l) => sum + (Number(l.remainingPrincipal) * (Number(l.interestRate) / 100)), 0);
    const preTaxResult = ebitda - annualInterest;

    const totalVatPayable = vatPayable19 + vatPayable7 + vatPayableFlat;
    const netVatPayable = totalVatPayable - vatInputDeductible;

    return NextResponse.json({
      year: targetYear,
      bwa: {
        totalRevenues,
        revenuePotatoes,
        revenuePigs,
        revenueCrops,
        revenueOther,
        materialCosts,
        grossMargin,
        annualPersonnelCost,
        otherExpenses,
        ebitda,
        annualInterest,
        preTaxResult,
      },
      vat: {
        vatPayable19,
        vatPayable7,
        vatPayableFlat,
        totalVatPayable,
        vatInputDeductible,
        netVatPayable, // Positive = Zahlbetrag an Finanzamt, Negative = Erstattung
      },
      transactionCount: transactions.length,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
