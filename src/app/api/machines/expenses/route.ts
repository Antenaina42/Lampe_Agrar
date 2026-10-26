export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      machineId,
      expenseType,
      date,
      description,
      amountNet,
      vatRate,
      amountGross,
      supplierId,
      operatingHours,
    } = body;

    if (!machineId || !description || amountNet === undefined) {
      return NextResponse.json({ error: 'machineId, description and amountNet are required' }, { status: 400 });
    }

    const net = Number(amountNet);
    const rate = vatRate !== undefined ? Number(vatRate) : 19.0;
    const vat = Math.round(net * (rate / 100) * 100) / 100;
    const gross = amountGross !== undefined ? Number(amountGross) : net + vat;

    const expense = await prisma.machineExpense.create({
      data: {
        machineId,
        expenseType: expenseType || 'MAINTENANCE',
        date: date ? new Date(date) : new Date(),
        description,
        amountNet: net,
        vatAmount: vat,
        amountGross: gross,
        supplierId: supplierId || null,
        operatingHours: operatingHours ? Number(operatingHours) : null,
      },
      include: {
        supplier: true,
      },
    });

    // Also update machine's current hours if operatingHours is higher
    if (operatingHours) {
      const machine = await prisma.agriculturalMachine.findUnique({ where: { id: machineId } });
      if (machine && Number(operatingHours) > Number(machine.currentHoursOrKm)) {
        await prisma.agriculturalMachine.update({
          where: { id: machineId },
          data: { currentHoursOrKm: Number(operatingHours) },
        });
      }
    }

    return NextResponse.json({ success: true, expense });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, description, amountNet, vatAmount, amountGross, expenseType, date, operatingHours } = body;

    if (!id) {
      return NextResponse.json({ error: 'Expense ID is required' }, { status: 400 });
    }

    const updateData: any = {};
    if (description !== undefined) updateData.description = description;
    if (amountNet !== undefined) updateData.amountNet = Number(amountNet);
    if (vatAmount !== undefined) updateData.vatAmount = Number(vatAmount);
    if (amountGross !== undefined) updateData.amountGross = Number(amountGross);
    if (expenseType !== undefined) updateData.expenseType = expenseType;
    if (date !== undefined) updateData.date = new Date(date);
    if (operatingHours !== undefined) updateData.operatingHours = Number(operatingHours);

    const updated = await prisma.machineExpense.update({
      where: { id },
      data: updateData,
      include: { supplier: true },
    });

    return NextResponse.json({ success: true, expense: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Expense ID is required' }, { status: 400 });
    }

    await prisma.machineExpense.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: 'Expense deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
