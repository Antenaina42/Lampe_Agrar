import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const yearParam = searchParams.get('year') || '2026';
    const targetYear = parseInt(yearParam, 10);

    const budgets = await prisma.budget.findMany({
      where: { year: targetYear },
      include: {
        lines: true,
      },
      orderBy: { scenario: 'asc' },
    });

    // Compute actuals from Transaction table for targetYear
    const startOfYear = new Date(`${targetYear}-01-01T00:00:00.000Z`);
    const endOfYear = new Date(`${targetYear}-12-31T23:59:59.999Z`);

    const transactions = await prisma.transaction.findMany({
      where: {
        date: {
          gte: startOfYear,
          lte: endOfYear,
        },
      },
    });

    let actualRevenue = 0;
    let actualExpense = 0;
    const actualsByActivity: Record<string, { revenue: number; expense: number }> = {
      CROPS: { revenue: 0, expense: 0 },
      LIVESTOCK: { revenue: 0, expense: 0 },
      POTATO_STORAGE: { revenue: 0, expense: 0 },
      MACHINERY: { revenue: 0, expense: 0 },
      GENERAL: { revenue: 0, expense: 0 },
      ADMIN: { revenue: 0, expense: 0 },
    };

    transactions.forEach((tx) => {
      const amount = Number(tx.amountNet) || 0;
      const act = tx.activity || 'GENERAL';
      if (!actualsByActivity[act]) {
        actualsByActivity[act] = { revenue: 0, expense: 0 };
      }

      if (tx.type === 'REVENUE') {
        actualRevenue += amount;
        actualsByActivity[act].revenue += amount;
      } else {
        actualExpense += amount;
        actualsByActivity[act].expense += amount;
      }
    });

    return NextResponse.json({
      year: targetYear,
      budgets,
      actuals: {
        totalRevenue: actualRevenue,
        totalExpense: actualExpense,
        netResult: actualRevenue - actualExpense,
        byActivity: actualsByActivity,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Check if this is a single line creation
    if (body.action === 'CREATE_LINE' || (body.activity && body.categoryKey)) {
      const { budgetId, year, scenario, activity, categoryKey, plannedRevenue, plannedExpense, quarter, notes } = body;

      let targetBudgetId = budgetId;
      if (!targetBudgetId) {
        let budget = await prisma.budget.findFirst({
          where: {
            year: Number(year) || 2026,
            scenario: scenario || 'CENTRAL',
          },
        });

        if (!budget) {
          budget = await prisma.budget.create({
            data: {
              year: Number(year) || 2026,
              scenario: scenario || 'CENTRAL',
              name: `Wirtschaftsjahr ${year || 2026} (${scenario || 'CENTRAL'})`,
              isCurrent: true,
            },
          });
        }
        targetBudgetId = budget.id;
      }

      const newLine = await prisma.budgetLine.create({
        data: {
          budgetId: targetBudgetId,
          activity: activity || 'GENERAL',
          categoryKey: categoryKey || 'Sonstiges',
          plannedRevenue: Number(plannedRevenue) || 0,
          plannedExpense: Number(plannedExpense) || 0,
          quarter: quarter ? Number(quarter) : null,
          notes: notes || null,
        },
      });

      return NextResponse.json({ success: true, line: newLine });
    }

    // Bulk creation/replacement fallback
    const { year, scenario, name, lines } = body;

    let budget = await prisma.budget.findFirst({
      where: {
        year: Number(year) || 2026,
        scenario: scenario || 'CENTRAL',
      },
    });

    if (!budget) {
      budget = await prisma.budget.create({
        data: {
          year: Number(year) || 2026,
          scenario: scenario || 'CENTRAL',
          name: name || `Wirtschaftsjahr ${year || 2026} (${scenario || 'CENTRAL'})`,
          isCurrent: true,
        },
      });
    }

    if (lines && Array.isArray(lines)) {
      await prisma.budgetLine.deleteMany({
        where: { budgetId: budget.id },
      });

      for (const line of lines) {
        await prisma.budgetLine.create({
          data: {
            budgetId: budget.id,
            activity: line.activity || 'GENERAL',
            categoryKey: line.categoryKey || 'General',
            plannedRevenue: Number(line.plannedRevenue) || 0,
            plannedExpense: Number(line.plannedExpense) || 0,
            quarter: line.quarter ? Number(line.quarter) : null,
            notes: line.notes || null,
          },
        });
      }
    }

    const updated = await prisma.budget.findUnique({
      where: { id: budget.id },
      include: { lines: true },
    });

    return NextResponse.json({ success: true, budget: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, activity, categoryKey, plannedRevenue, plannedExpense, quarter, notes } = body;

    if (!id) {
      return NextResponse.json({ error: 'Budget line ID is required' }, { status: 400 });
    }

    const updated = await prisma.budgetLine.update({
      where: { id },
      data: {
        activity: activity || undefined,
        categoryKey: categoryKey || undefined,
        plannedRevenue: plannedRevenue !== undefined ? Number(plannedRevenue) : undefined,
        plannedExpense: plannedExpense !== undefined ? Number(plannedExpense) : undefined,
        quarter: quarter !== undefined ? (quarter ? Number(quarter) : null) : undefined,
        notes: notes !== undefined ? notes : undefined,
      },
    });

    return NextResponse.json({ success: true, line: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    let id = searchParams.get('id');

    if (!id) {
      const body = await request.json().catch(() => ({}));
      id = body.id;
    }

    if (!id) {
      return NextResponse.json({ error: 'Budget line ID is required' }, { status: 400 });
    }

    await prisma.budgetLine.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: 'Budget line deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
