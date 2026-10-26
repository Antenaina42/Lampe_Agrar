import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const employees = await prisma.employee.findMany({
      include: {
        costs: {
          orderBy: [{ year: 'desc' }, { month: 'desc' }],
          take: 12,
        },
      },
      orderBy: { hireDate: 'asc' },
    });

    // Calculate aggregated metrics
    let totalMonthlyGross = 0;
    let totalMonthlyEmployerCost = 0;
    const branchAllocation: Record<string, number> = {
      CROPS: 0,
      LIVESTOCK: 0,
      POTATO_STORAGE: 0,
      MACHINERY: 0,
      GENERAL: 0,
    };

    employees.filter(e => e.active).forEach((emp) => {
      const gross = Number(emp.monthlyGrossSalary) || 0;
      const employerCost = Number(emp.monthlyEmployerCost) || 0;
      totalMonthlyGross += gross;
      totalMonthlyEmployerCost += employerCost;

      const branch = emp.allocatedActivity || 'GENERAL';
      branchAllocation[branch] = (branchAllocation[branch] || 0) + employerCost;
    });

    return NextResponse.json({
      employees,
      summary: {
        activeCount: employees.filter(e => e.active).length,
        totalMonthlyGross,
        totalMonthlyEmployerCost,
        annualizedEmployerCost: totalMonthlyEmployerCost * 12,
        branchAllocation,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      firstName,
      lastName,
      roleTitle,
      employmentType,
      monthlyGrossSalary,
      monthlyEmployerCost,
      allocatedActivity,
      hireDate,
    } = body;

    if (!firstName || !lastName || !roleTitle) {
      return NextResponse.json({ error: 'First name, last name, and role title are required' }, { status: 400 });
    }

    const count = await prisma.employee.count();
    const employeeNumber = `MIT-${String(count + 1).padStart(3, '0')}`;

    const gross = Number(monthlyGrossSalary) || 3000;
    // Employer cost in Germany typically ~21-22% social security contributions on top of gross
    const employerCost = monthlyEmployerCost ? Number(monthlyEmployerCost) : Math.round(gross * 1.21 * 100) / 100;

    const employee = await prisma.employee.create({
      data: {
        employeeNumber,
        firstName,
        lastName,
        roleTitle,
        employmentType: employmentType || 'FULL_TIME',
        monthlyGrossSalary: gross,
        monthlyEmployerCost: employerCost,
        allocatedActivity: allocatedActivity || 'GENERAL',
        hireDate: hireDate ? new Date(hireDate) : new Date(),
        active: true,
      },
    });

    // Also record current month employee cost
    const now = new Date();
    await prisma.employeeCost.create({
      data: {
        employeeId: employee.id,
        month: now.getMonth() + 1,
        year: now.getFullYear(),
        baseSalary: gross,
        employerSocialCharges: employerCost - gross,
        totalCost: employerCost,
      },
    });

    return NextResponse.json({ success: true, employee });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const {
      id,
      firstName,
      lastName,
      roleTitle,
      employmentType,
      monthlyGrossSalary,
      monthlyEmployerCost,
      allocatedActivity,
      hireDate,
      active,
    } = body;

    if (!id) {
      return NextResponse.json({ error: 'Employee ID is required' }, { status: 400 });
    }

    const gross = monthlyGrossSalary !== undefined ? Number(monthlyGrossSalary) : undefined;
    let employerCost = monthlyEmployerCost !== undefined ? Number(monthlyEmployerCost) : undefined;
    if (gross !== undefined && employerCost === undefined) {
      employerCost = Math.round(gross * 1.21 * 100) / 100;
    }

    const updated = await prisma.employee.update({
      where: { id },
      data: {
        firstName: firstName || undefined,
        lastName: lastName || undefined,
        roleTitle: roleTitle || undefined,
        employmentType: employmentType || undefined,
        monthlyGrossSalary: gross !== undefined ? gross : undefined,
        monthlyEmployerCost: employerCost !== undefined ? employerCost : undefined,
        allocatedActivity: allocatedActivity || undefined,
        hireDate: hireDate ? new Date(hireDate) : undefined,
        active: active !== undefined ? Boolean(active) : undefined,
      },
    });

    return NextResponse.json({ success: true, employee: updated });
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
      return NextResponse.json({ error: 'Employee ID is required' }, { status: 400 });
    }

    await prisma.employee.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: 'Employee deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
