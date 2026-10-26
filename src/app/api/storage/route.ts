export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from '@/lib/auth';
import { logAuditEvent } from '@/lib/audit';

export async function GET() {
  try {
    const lots = await prisma.storageLot.findMany({
      include: {
        movements: {
          include: { buyer: true },
          orderBy: { date: 'desc' },
        },
      },
    });

    const totalStored = lots.reduce((sum, l) => sum + Number(l.remainingWeightTons), 0);

    return NextResponse.json({ lots, totalStored });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession();
    const data = await request.json();

    const {
      lotId,
      movementType, // 'OUTGOING_SALE' | 'LOSS_SORTING' | 'INCOMING'
      weightTons,
      buyerCustomerId,
      pricePerTon,
      destination,
      notes,
    } = data;

    const weight = Number(weightTons);
    if (!lotId || !weight || weight <= 0) {
      return NextResponse.json(
        { error: 'Partie und gültiges Gewicht (t) sind erforderlich.' },
        { status: 400 }
      );
    }

    const lot = await prisma.storageLot.findUnique({
      where: { id: lotId },
    });

    if (!lot) {
      return NextResponse.json({ error: 'Lagerpartie nicht gefunden.' }, { status: 404 });
    }

    const currentRemaining = Number(lot.remainingWeightTons);

    // Negative stock prevention guard
    if (movementType !== 'INCOMING' && weight > currentRemaining) {
      return NextResponse.json(
        {
          error: `Auslagerung von ${weight} t übersteigt den aktuellen Lagerbestand von ${currentRemaining} t. Vorgang abgewiesen.`,
        },
        { status: 422 }
      );
    }

    let newRemaining = currentRemaining;
    let newLoss = Number(lot.storageLossTons);

    if (movementType === 'INCOMING') {
      newRemaining += weight;
    } else if (movementType === 'LOSS_SORTING' || movementType === 'CLEANING_LOSS') {
      newRemaining -= weight;
      newLoss += weight;
    } else {
      // OUTGOING_SALE
      newRemaining -= weight;
    }

    const totalAmountNet = pricePerTon ? weight * Number(pricePerTon) : 0;

    const movement = await prisma.storageMovement.create({
      data: {
        lotId,
        movementType,
        date: new Date(),
        weightTons: weight,
        buyerCustomerId: buyerCustomerId || null,
        pricePerTon: pricePerTon ? Number(pricePerTon) : null,
        totalAmountNet: totalAmountNet || null,
        destination: destination || null,
        notes: notes || null,
      },
    });

    const newStatus =
      newRemaining <= 0
        ? 'DEPLETED'
        : newRemaining < Number(lot.initialWeightTons)
        ? 'PARTIALLY_SOLD'
        : 'IN_STORAGE';

    await prisma.storageLot.update({
      where: { id: lotId },
      data: {
        remainingWeightTons: newRemaining,
        storageLossTons: newLoss,
        status: newStatus,
      },
    });

    await logAuditEvent({
      userId: session?.id,
      action: 'STORAGE_MOVEMENT',
      entity: 'STORAGE_LOT',
      entityId: lot.id,
      details: {
        lotNumber: lot.lotNumber,
        movementType,
        weightTons: weight,
        remainingAfter: newRemaining,
      },
    });

    return NextResponse.json({ success: true, movement, newRemaining });
  } catch (error: any) {
    console.error('Storage movement error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
