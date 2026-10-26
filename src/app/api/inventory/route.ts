import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const items = await prisma.inventoryItem.findMany({
      include: {
        supplier: true,
        movements: {
          orderBy: { date: 'desc' },
          take: 10,
        },
      },
      orderBy: { category: 'asc' },
    });

    let totalStockValue = 0;
    const lowStockItems: any[] = [];

    items.forEach((item) => {
      const val = Number(item.totalStockValue) || 0;
      totalStockValue += val;

      const qty = Number(item.currentQuantity) || 0;
      const min = Number(item.minStockThreshold) || 0;
      if (qty <= min && min > 0) {
        lowStockItems.push(item);
      }
    });

    // Special diesel status calculation (FUEL category)
    const fuelItem = items.find(i => i.category === 'FUEL');

    return NextResponse.json({
      items,
      totalStockValue,
      lowStockItems,
      fuelStatus: fuelItem ? {
        name: fuelItem.name,
        currentLiters: Number(fuelItem.currentQuantity),
        minThreshold: Number(fuelItem.minStockThreshold),
        unitPrice: Number(fuelItem.averageUnitPrice),
        totalValue: Number(fuelItem.totalStockValue),
      } : null,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { action } = body;

    if (action === 'MOVEMENT') {
      // Record movement (Stock in / Stock out)
      const { itemId, movementType, quantity, unitPrice, notes } = body;
      const qtyNum = Number(quantity);
      const priceNum = Number(unitPrice);

      const item = await prisma.inventoryItem.findUnique({
        where: { id: itemId },
      });

      if (!item) {
        return NextResponse.json({ error: 'Item not found' }, { status: 404 });
      }

      const currentQty = Number(item.currentQuantity);
      let newQty = currentQty;

      if (movementType === 'PURCHASE_RECEIPT') {
        newQty += qtyNum;
      } else {
        // Usage / Stock out
        if (qtyNum > currentQty) {
          return NextResponse.json({ error: 'Auslagerung überschreitet vorhandenen Lagerbestand.' }, { status: 422 });
        }
        newQty -= qtyNum;
      }

      const totalVal = Math.round(newQty * priceNum * 100) / 100;

      // Create movement
      await prisma.inventoryMovement.create({
        data: {
          itemId,
          movementType,
          date: new Date(),
          quantity: qtyNum,
          unitPrice: priceNum,
          totalValue: Math.round(qtyNum * priceNum * 100) / 100,
          notes: notes || null,
        },
      });

      // Update item
      const updated = await prisma.inventoryItem.update({
        where: { id: itemId },
        data: {
          currentQuantity: newQty,
          averageUnitPrice: priceNum,
          totalStockValue: totalVal,
        },
      });

      return NextResponse.json({ success: true, item: updated });
    } else {
      // Create new inventory item
      const { name, category, unit, currentQuantity, minStockThreshold, averageUnitPrice, storageLocation, supplierId } = body;

      const count = await prisma.inventoryItem.count();
      const itemCode = `LAG-${String(count + 1).padStart(3, '0')}`;
      const qty = Number(currentQuantity) || 0;
      const price = Number(averageUnitPrice) || 0;
      const val = Math.round(qty * price * 100) / 100;

      const item = await prisma.inventoryItem.create({
        data: {
          itemCode,
          name,
          category: category || 'ANIMAL_FEED',
          unit: unit || 'kg',
          currentQuantity: qty,
          minStockThreshold: Number(minStockThreshold) || 0,
          averageUnitPrice: price,
          totalStockValue: val,
          storageLocation: storageLocation || 'Hof Drentwede',
          supplierId: supplierId || null,
        },
      });

      return NextResponse.json({ success: true, item });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, name, category, unit, currentQuantity, minStockThreshold, averageUnitPrice, storageLocation } = body;

    if (!id) {
      return NextResponse.json({ error: 'Item ID is required' }, { status: 400 });
    }

    const qty = currentQuantity !== undefined ? Number(currentQuantity) : undefined;
    const price = averageUnitPrice !== undefined ? Number(averageUnitPrice) : undefined;

    const currentItem = await prisma.inventoryItem.findUnique({ where: { id } });
    if (!currentItem) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }

    const finalQty = qty !== undefined ? qty : Number(currentItem.currentQuantity);
    const finalPrice = price !== undefined ? price : Number(currentItem.averageUnitPrice);
    const totalVal = Math.round(finalQty * finalPrice * 100) / 100;

    const updated = await prisma.inventoryItem.update({
      where: { id },
      data: {
        name: name || undefined,
        category: category || undefined,
        unit: unit || undefined,
        currentQuantity: qty !== undefined ? qty : undefined,
        minStockThreshold: minStockThreshold !== undefined ? Number(minStockThreshold) : undefined,
        averageUnitPrice: price !== undefined ? price : undefined,
        totalStockValue: totalVal,
        storageLocation: storageLocation !== undefined ? storageLocation : undefined,
      },
    });

    return NextResponse.json({ success: true, item: updated });
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
      return NextResponse.json({ error: 'Item ID is required' }, { status: 400 });
    }

    await prisma.inventoryItem.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: 'Item deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
