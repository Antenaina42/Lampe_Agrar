export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'ALL';

    const customers = type === 'SUPPLIERS_ONLY' ? [] : await prisma.customer.findMany({
      include: {
        invoices: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    const suppliers = type === 'CUSTOMERS_ONLY' ? [] : await prisma.supplier.findMany({
      include: {
        invoices: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json({ customers, suppliers });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { type, companyName, contactName, email, phone, address, postalCode, city, notes, paymentTermsDays, iban } = body;

    if (!companyName) {
      return NextResponse.json({ error: 'Company name is required' }, { status: 400 });
    }

    if (type === 'SUPPLIER') {
      const count = await prisma.supplier.count();
      const supplierNumber = `LIEF-${new Date().getFullYear()}-${String(count + 1).padStart(3, '0')}`;

      const supplier = await prisma.supplier.create({
        data: {
          supplierNumber,
          companyName,
          contactName: contactName || null,
          email: email || null,
          phone: phone || null,
          address: address || 'Bockstedt',
          postalCode: postalCode || '49406',
          city: city || 'Barnstorf',
          paymentTermsDays: Number(paymentTermsDays) || 14,
          iban: iban || null,
          notes: notes || null,
        },
      });

      return NextResponse.json({ success: true, partner: supplier });
    } else {
      const count = await prisma.customer.count();
      const customerNumber = `KDN-${new Date().getFullYear()}-${String(count + 1).padStart(3, '0')}`;

      const customer = await prisma.customer.create({
        data: {
          customerNumber,
          companyName,
          contactName: contactName || null,
          email: email || null,
          phone: phone || null,
          address: address || 'Bockstedt',
          postalCode: postalCode || '49406',
          city: city || 'Barnstorf',
          paymentTermsDays: Number(paymentTermsDays) || 14,
          notes: notes || null,
        },
      });

      return NextResponse.json({ success: true, partner: customer });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, type, companyName, contactName, email, phone, address, postalCode, city, notes, paymentTermsDays, iban } = body;

    if (!id) {
      return NextResponse.json({ error: 'Partner ID is required' }, { status: 400 });
    }

    if (type === 'SUPPLIER') {
      const updated = await prisma.supplier.update({
        where: { id },
        data: {
          companyName: companyName || undefined,
          contactName: contactName !== undefined ? contactName : undefined,
          email: email !== undefined ? email : undefined,
          phone: phone !== undefined ? phone : undefined,
          address: address !== undefined ? address : undefined,
          postalCode: postalCode !== undefined ? postalCode : undefined,
          city: city !== undefined ? city : undefined,
          paymentTermsDays: paymentTermsDays !== undefined ? Number(paymentTermsDays) : undefined,
          iban: iban !== undefined ? iban : undefined,
          notes: notes !== undefined ? notes : undefined,
        },
      });
      return NextResponse.json({ success: true, partner: updated });
    } else {
      const updated = await prisma.customer.update({
        where: { id },
        data: {
          companyName: companyName || undefined,
          contactName: contactName !== undefined ? contactName : undefined,
          email: email !== undefined ? email : undefined,
          phone: phone !== undefined ? phone : undefined,
          address: address !== undefined ? address : undefined,
          postalCode: postalCode !== undefined ? postalCode : undefined,
          city: city !== undefined ? city : undefined,
          paymentTermsDays: paymentTermsDays !== undefined ? Number(paymentTermsDays) : undefined,
          notes: notes !== undefined ? notes : undefined,
        },
      });
      return NextResponse.json({ success: true, partner: updated });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    let id = searchParams.get('id');
    let type = searchParams.get('type') || 'CUSTOMER';

    if (!id) {
      const body = await request.json().catch(() => ({}));
      id = body.id;
      if (body.type) type = body.type;
    }

    if (!id) {
      return NextResponse.json({ error: 'Partner ID is required' }, { status: 400 });
    }

    if (type === 'SUPPLIER') {
      await prisma.supplier.delete({ where: { id } });
    } else {
      await prisma.customer.delete({ where: { id } });
    }

    return NextResponse.json({ success: true, message: 'Partner deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
