import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { calculateMachineHourlyCost } from '@/lib/finance-calculations';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (id) {
      const machine = await prisma.agriculturalMachine.findUnique({
        where: { id },
        include: {
          expenses: {
            include: { supplier: true },
            orderBy: { date: 'desc' },
          },
          usages: { orderBy: { date: 'desc' } },
        },
      });

      if (!machine) {
        return NextResponse.json({ error: 'Machine not found' }, { status: 404 });
      }

      const costs = calculateMachineHourlyCost({
        purchasePrice: Number(machine.purchasePrice),
        residualValue: Number(machine.residualValue),
        depreciationYears: machine.depreciationYears,
        annualInsurance: Number(machine.insuranceAnnual),
        annualMaintenance: Number(machine.maintenanceAnnual),
        annualOperatingHours: 450,
        fuelConsumptionLitersPerHour: Number(machine.fuelConsumptionPerUnit) || 15,
        fuelPricePerLiter: 1.38,
      });

      const currentHours = Number(machine.currentHoursOrKm);
      const nextDue = Number(machine.nextMaintenanceDueHours) || 0;
      const maintenanceAlert = nextDue > 0 && nextDue - currentHours <= 150;

      const totalExpensesGross = machine.expenses.reduce((sum, e) => sum + Number(e.amountGross), 0);
      const totalExpensesNet = machine.expenses.reduce((sum, e) => sum + Number(e.amountNet), 0);

      return NextResponse.json({
        machine: {
          ...machine,
          costs,
          maintenanceAlert,
          hoursUntilMaintenance: nextDue > 0 ? nextDue - currentHours : null,
          totalExpensesGross,
          totalExpensesNet,
        },
      });
    }

    const machines = await prisma.agriculturalMachine.findMany({
      include: {
        expenses: {
          include: { supplier: true },
          orderBy: { date: 'desc' },
        },
        usages: { orderBy: { date: 'desc' } },
      },
      orderBy: { createdAt: 'desc' },
    });

    const machinesWithCosts = machines.map((m) => {
      const costs = calculateMachineHourlyCost({
        purchasePrice: Number(m.purchasePrice),
        residualValue: Number(m.residualValue),
        depreciationYears: m.depreciationYears,
        annualInsurance: Number(m.insuranceAnnual),
        annualMaintenance: Number(m.maintenanceAnnual),
        annualOperatingHours: 450,
        fuelConsumptionLitersPerHour: Number(m.fuelConsumptionPerUnit) || 15,
        fuelPricePerLiter: 1.38,
      });

      const currentHours = Number(m.currentHoursOrKm);
      const nextDue = Number(m.nextMaintenanceDueHours) || 0;
      const maintenanceAlert = nextDue > 0 && nextDue - currentHours <= 150;

      const totalExpensesGross = m.expenses.reduce((sum, e) => sum + Number(e.amountGross), 0);
      const totalExpensesNet = m.expenses.reduce((sum, e) => sum + Number(e.amountNet), 0);

      return {
        ...m,
        costs,
        maintenanceAlert,
        hoursUntilMaintenance: nextDue > 0 ? nextDue - currentHours : null,
        totalExpensesGross,
        totalExpensesNet,
      };
    });

    return NextResponse.json({ machines: machinesWithCosts });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      name,
      brand,
      model,
      category,
      machineCode,
      hp,
      yearOfManufacture,
      purchasePrice,
      residualValue,
      depreciationYears,
      currentHoursOrKm,
      fuelConsumptionPerUnit,
      insuranceAnnual,
      maintenanceAnnual,
      nextMaintenanceDueHours,
    } = body;

    if (!name || !brand || !model) {
      return NextResponse.json({ error: 'Name, brand and model are required' }, { status: 400 });
    }

    const code = machineCode || `ENG-${Date.now().toString().slice(-4)}`;

    const machine = await prisma.agriculturalMachine.create({
      data: {
        name,
        brand,
        model,
        category: category || 'TRACTOR',
        machineCode: code,
        hp: hp ? Number(hp) : null,
        yearOfManufacture: yearOfManufacture ? Number(yearOfManufacture) : new Date().getFullYear(),
        purchasePrice: Number(purchasePrice) || 0,
        residualValue: Number(residualValue) || 0,
        depreciationYears: Number(depreciationYears) || 8,
        currentHoursOrKm: Number(currentHoursOrKm) || 0,
        fuelConsumptionPerUnit: fuelConsumptionPerUnit ? Number(fuelConsumptionPerUnit) : 15.0,
        insuranceAnnual: Number(insuranceAnnual) || 0,
        maintenanceAnnual: Number(maintenanceAnnual) || 0,
        nextMaintenanceDueHours: nextMaintenanceDueHours ? Number(nextMaintenanceDueHours) : null,
        active: true,
      },
    });

    return NextResponse.json({ success: true, machine });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, ...data } = body;

    if (!id) {
      return NextResponse.json({ error: 'Machine ID is required' }, { status: 400 });
    }

    const updateData: any = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.brand !== undefined) updateData.brand = data.brand;
    if (data.model !== undefined) updateData.model = data.model;
    if (data.category !== undefined) updateData.category = data.category;
    if (data.machineCode !== undefined) updateData.machineCode = data.machineCode;
    if (data.hp !== undefined) updateData.hp = Number(data.hp);
    if (data.yearOfManufacture !== undefined) updateData.yearOfManufacture = Number(data.yearOfManufacture);
    if (data.purchasePrice !== undefined) updateData.purchasePrice = Number(data.purchasePrice);
    if (data.residualValue !== undefined) updateData.residualValue = Number(data.residualValue);
    if (data.depreciationYears !== undefined) updateData.depreciationYears = Number(data.depreciationYears);
    if (data.currentHoursOrKm !== undefined) updateData.currentHoursOrKm = Number(data.currentHoursOrKm);
    if (data.fuelConsumptionPerUnit !== undefined) updateData.fuelConsumptionPerUnit = Number(data.fuelConsumptionPerUnit);
    if (data.insuranceAnnual !== undefined) updateData.insuranceAnnual = Number(data.insuranceAnnual);
    if (data.maintenanceAnnual !== undefined) updateData.maintenanceAnnual = Number(data.maintenanceAnnual);
    if (data.nextMaintenanceDueHours !== undefined) updateData.nextMaintenanceDueHours = Number(data.nextMaintenanceDueHours);
    if (data.active !== undefined) updateData.active = Boolean(data.active);

    const updated = await prisma.agriculturalMachine.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json({ success: true, machine: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Machine ID is required' }, { status: 400 });
    }

    await prisma.agriculturalMachine.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: 'Machine deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
