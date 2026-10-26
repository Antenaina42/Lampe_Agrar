export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { calculatePigBatchMargin } from '@/lib/finance-calculations';

export async function GET() {
  try {
    const batches = await prisma.pigBatch.findMany({
      include: {
        movements: true,
        expenses: true,
        sales: true,
      },
      orderBy: { arrivalDate: 'desc' },
    });

    const batchesWithMetrics = batches.map((b) => {
      const metrics = calculatePigBatchMargin({
        initialPigCount: b.initialPigCount,
        soldPigCount: b.currentPigCount,
        mortalityCount: b.mortalityCount,
        totalWeightKg: b.sales.reduce((sum, s) => sum + Number(s.totalWeightKg), 0) || b.currentPigCount * Number(b.targetWeightKg),
        salePricePerKg: 1.85,
        pigletPurchaseCost: b.initialPigCount * 78.0,
        feedCost: Number(b.totalDirectCost) * 0.7,
        vetCost: Number(b.totalDirectCost) * 0.1,
        strawBeddingCost: b.barnType === 'OUTDOOR_CLIMATE_H4' ? 6500.0 : 1200.0,
        energyAndBarnCost: 8000.0,
      });

      return {
        ...b,
        metrics,
      };
    });

    const totalAnimals = batches
      .filter((b) => b.status === 'ACTIVE')
      .reduce((sum, b) => sum + b.currentPigCount, 0);

    return NextResponse.json({
      batches: batchesWithMetrics,
      totalActiveAnimals: totalAnimals,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      batchNumber,
      barnType,
      barnName,
      arrivalDate,
      initialPigCount,
      targetWeightKg,
      initialAvgWeightKg,
      notes,
    } = body;

    const count = await prisma.pigBatch.count();
    const finalBatchNumber = batchNumber || `DG-${new Date().getFullYear()}-${String(count + 1).padStart(3, '0')}`;
    const pigs = Number(initialPigCount) || 500;

    const batch = await prisma.pigBatch.create({
      data: {
        batchNumber: finalBatchNumber,
        barnType: barnType || 'OUTDOOR_CLIMATE_H4',
        barnName: barnName || (barnType === 'OUTDOOR_CLIMATE_H4' ? 'Außenklimastall H4 (Hünenheide)' : 'Warmstall H2 (Bockstedt)'),
        arrivalDate: arrivalDate ? new Date(arrivalDate) : new Date(),
        initialPigCount: pigs,
        currentPigCount: pigs,
        initialAvgWeightKg: initialAvgWeightKg ? Number(initialAvgWeightKg) : 28.5,
        targetWeightKg: targetWeightKg ? Number(targetWeightKg) : 122.0,
        mortalityCount: 0,
        feedConversionRate: 2.75,
        totalDirectCost: pigs * 78.0, // initial purchase
        status: 'ACTIVE',
        notes: notes || null,
      },
    });

    return NextResponse.json({ success: true, batch });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, barnName, barnType, currentPigCount, mortalityCount, status, notes, targetWeightKg } = body;

    if (!id) {
      return NextResponse.json({ error: 'Batch ID is required' }, { status: 400 });
    }

    const updated = await prisma.pigBatch.update({
      where: { id },
      data: {
        barnName: barnName || undefined,
        barnType: barnType || undefined,
        currentPigCount: currentPigCount !== undefined ? Number(currentPigCount) : undefined,
        mortalityCount: mortalityCount !== undefined ? Number(mortalityCount) : undefined,
        status: status || undefined,
        notes: notes !== undefined ? notes : undefined,
        targetWeightKg: targetWeightKg !== undefined ? Number(targetWeightKg) : undefined,
      },
    });

    return NextResponse.json({ success: true, batch: updated });
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
      return NextResponse.json({ error: 'Batch ID is required' }, { status: 400 });
    }

    await prisma.pigBatch.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: 'Batch deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
