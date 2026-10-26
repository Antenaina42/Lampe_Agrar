export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { calculateCropGrossMargin } from '@/lib/finance-calculations';

export async function GET() {
  try {
    const crops = await prisma.crop.findMany({
      include: {
        seasons: {
          include: { field: true, expenses: true, harvests: true },
        },
      },
    });

    const fields = await prisma.field.findMany({
      orderBy: { fieldNumber: 'asc' },
    });

    // Calculate aggregated metrics
    const seasonsWithMetrics = crops.flatMap((c) =>
      c.seasons.map((s) => {
        const metrics = calculateCropGrossMargin({
          areaHa: Number(s.areaHa),
          harvestTons: Number(s.actualYieldTons),
          salePricePerTon: Number(c.standardMarketPricePerTon),
          directCosts: Number(s.totalDirectCost),
        });
        return {
          ...s,
          cropName: c.name,
          metrics,
        };
      })
    );

    return NextResponse.json({
      crops,
      fields,
      seasons: seasonsWithMetrics,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { fieldNumber, name, areaHa, soilQualityScore, locationDescription } = body;

    if (!name || !areaHa) {
      return NextResponse.json({ error: 'Name und Fläche sind Pflichtfelder' }, { status: 400 });
    }

    let finalFieldNumber = fieldNumber;
    if (!finalFieldNumber) {
      const count = await prisma.field.count();
      finalFieldNumber = `SCH-${String(count + 1).padStart(3, '0')}`;
    }

    const field = await prisma.field.create({
      data: {
        fieldNumber: finalFieldNumber,
        name,
        areaHa: Number(areaHa),
        soilQualityScore: soilQualityScore ? Number(soilQualityScore) : 55,
        locationDescription: locationDescription || null,
        active: true,
      },
    });

    return NextResponse.json({ success: true, field });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, fieldNumber, name, areaHa, soilQualityScore, locationDescription, active } = body;

    if (!id) {
      return NextResponse.json({ error: 'Field ID is required' }, { status: 400 });
    }

    const updated = await prisma.field.update({
      where: { id },
      data: {
        fieldNumber: fieldNumber || undefined,
        name: name || undefined,
        areaHa: areaHa !== undefined ? Number(areaHa) : undefined,
        soilQualityScore: soilQualityScore !== undefined ? Number(soilQualityScore) : undefined,
        locationDescription: locationDescription !== undefined ? locationDescription : undefined,
        active: active !== undefined ? Boolean(active) : undefined,
      },
    });

    return NextResponse.json({ success: true, field: updated });
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
      return NextResponse.json({ error: 'Field ID is required' }, { status: 400 });
    }

    await prisma.field.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: 'Field deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
