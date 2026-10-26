import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    let settings = await prisma.farmSettings.findFirst();

    if (!settings) {
      settings = await prisma.farmSettings.create({
        data: {
          farmName: 'Lampe Agrar',
          legalName: 'Lampe Agrar - Gesa & Dr. Josef Langenberg',
          taxId: '25/203/04819',
          vatId: 'DE312456789',
          phone: '04246/95026',
          mobile: '0151/42343339',
          email: 'kontakt@lampe-agrar.de',
          website: 'https://www.hi-gesa.de/',
          address: 'Hünenheide 3',
          postalCode: '49406',
          city: 'Bockstedt / Drentwede',
          bankName: 'Volksbank eG Diepholz-Barnstorf',
          iban: 'DE44 2806 2200 0001 2345 67',
          bic: 'GENODEF1BRN',
          defaultLanguage: 'de',
          isDemoMode: true,
        },
      });
    }

    return NextResponse.json({ settings });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    let settings = await prisma.farmSettings.findFirst();

    const allowedData: any = {};
    if (body.farmName) allowedData.farmName = body.farmName;
    if (body.legalName || body.ownerName) allowedData.legalName = body.legalName || body.ownerName;
    if (body.taxId || body.taxNumber) allowedData.taxId = body.taxId || body.taxNumber;
    if (body.vatId) allowedData.vatId = body.vatId;
    if (body.address || body.street) allowedData.address = body.address || body.street;
    if (body.postalCode) allowedData.postalCode = body.postalCode;
    if (body.city) allowedData.city = body.city;
    if (body.phone) allowedData.phone = body.phone;
    if (body.email) allowedData.email = body.email;
    if (body.website) allowedData.website = body.website;
    if (body.bankName) allowedData.bankName = body.bankName;
    if (body.iban) allowedData.iban = body.iban;
    if (body.bic) allowedData.bic = body.bic;

    if (!settings) {
      settings = await prisma.farmSettings.create({
        data: allowedData,
      });
    } else {
      settings = await prisma.farmSettings.update({
        where: { id: settings.id },
        data: allowedData,
      });
    }

    return NextResponse.json({ success: true, settings });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
