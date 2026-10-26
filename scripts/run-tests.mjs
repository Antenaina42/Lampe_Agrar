import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

let passedTests = 0;
let failedTests = 0;

function assert(condition, testName) {
  if (condition) {
    console.log(`  ✅ PASS: ${testName}`);
    passedTests++;
  } else {
    console.error(`  ❌ FAIL: ${testName}`);
    failedTests++;
  }
}

async function runTests() {
  console.log('\n======================================================');
  console.log('🧪 LAMPE AGRAR FINANZMANAGER - TEST SUITE');
  console.log('======================================================\n');

  // TEST SUITE 1: Multilingual Translation Parity
  console.log('--- Test Suite 1: Multilingual Translation Parity (DE / EN / FR) ---');
  try {
    const deRaw = fs.readFileSync(path.resolve('src/messages/de.json'), 'utf8');
    const enRaw = fs.readFileSync(path.resolve('src/messages/en.json'), 'utf8');
    const frRaw = fs.readFileSync(path.resolve('src/messages/fr.json'), 'utf8');

    const de = JSON.parse(deRaw);
    const en = JSON.parse(enRaw);
    const fr = JSON.parse(frRaw);

    const deTopKeys = Object.keys(de);
    const enTopKeys = Object.keys(en);
    const frTopKeys = Object.keys(fr);

    assert(deTopKeys.length > 10, 'DE translation contains essential root sections');
    assert(enTopKeys.length > 10, 'EN translation contains essential root sections');
    assert(frTopKeys.length > 10, 'FR translation contains essential root sections');

    let allKeysMatch = true;
    for (const key of deTopKeys) {
      if (!en[key] || !fr[key]) {
        allKeysMatch = false;
        console.warn(`    Missing section in EN or FR: ${key}`);
      }
    }
    assert(allKeysMatch, 'All primary translation sections present in DE, EN, and FR');
  } catch (err) {
    assert(false, `Translation files reading error: ${err.message}`);
  }

  // TEST SUITE 2: Currency & Formatting Rules
  console.log('\n--- Test Suite 2: Regional Conventions (Currencies & Dates) ---');
  const testAmount = 1234.56;
  const deFormatted = new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(testAmount);
  const enFormatted = new Intl.NumberFormat('en-GB', { style: 'currency', currency: 'EUR' }).format(testAmount);
  const frFormatted = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(testAmount);

  assert(deFormatted.includes('1.234,56'), `German currency formatted with period thousands & comma decimal: "${deFormatted}"`);
  assert(enFormatted.includes('1,234.56'), `English currency formatted with comma thousands & period decimal: "${enFormatted}"`);
  assert(frFormatted.includes('1') && frFormatted.includes('234,56'), `French currency formatted with space thousands & comma decimal: "${frFormatted}"`);

  // TEST SUITE 3: Database Persisted Entities
  console.log('\n--- Test Suite 3: Database Entities & Operational Records ---');
  try {
    const usersCount = await prisma.user.count();
    assert(usersCount >= 4, `At least 4 user accounts exist in DB (Found: ${usersCount})`);

    const gesaUser = await prisma.user.findUnique({
      where: { email: 'gesa.langenberg@lampe-agrar.de' },
      include: { role: true },
    });
    assert(gesaUser !== null, 'Betriebsleitung user Gesa Langenberg exists');
    assert(gesaUser?.role?.name === 'BETRIEBSLEITUNG', 'Gesa Langenberg has BETRIEBSLEITUNG role');

    const machines = await prisma.agriculturalMachine.findMany();
    assert(machines.length >= 6, `At least 6 farm machines configured (Found: ${machines.length})`);

    const fendtTractors = machines.filter(m => m.brand === 'Fendt');
    assert(fendtTractors.length >= 4, `Fleet contains 4 Fendt tractors with GPS (Found: ${fendtTractors.length})`);

    const grimme = machines.find(m => m.name.toLowerCase().includes('grimme') || m.brand.toLowerCase() === 'grimme');
    assert(grimme !== undefined, 'Potato harvester Grimme SE 260 registered');

    const dammann = machines.find(m => m.name.toLowerCase().includes('dammann'));
    assert(dammann !== undefined, '10,000L Dammann crop protection sprayer registered');

    const fields = await prisma.field.findMany();
    const totalArea = fields.reduce((sum, f) => sum + Number(f.areaHa), 0);
    assert(totalArea >= 400 && totalArea <= 500, `Farm cultivated area ~440 ha (Total: ${totalArea.toFixed(1)} ha)`);

    const pigBatches = await prisma.pigBatch.findMany();
    assert(pigBatches.length >= 2, `Pig fattening batches registered (Found: ${pigBatches.length})`);

    const potatoLots = await prisma.storageLot.findMany();
    assert(potatoLots.length >= 2, `Potato storage lots registered in halls (Found: ${potatoLots.length})`);

    // Verify negative stock protection condition on storage lots
    let negativeStockDetected = false;
    for (const lot of potatoLots) {
      if (Number(lot.remainingWeightTons) < 0) {
        negativeStockDetected = true;
      }
    }
    assert(!negativeStockDetected, 'Zero negative stock in potato storage lots');

    const transactions = await prisma.transaction.findMany();
    assert(transactions.length >= 6, `Financial transactions registered (Found: ${transactions.length})`);

    const invoices = await prisma.invoice.findMany();
    assert(invoices.length >= 4, `Invoices registered (Found: ${invoices.length})`);

    const bankAccounts = await prisma.financialAccount.findMany();
    assert(bankAccounts.length >= 2, `Multi-bank accounts configured (Found: ${bankAccounts.length})`);

    const employees = await prisma.employee.count();
    assert(employees >= 4, `Staff & employees registered (Found: ${employees})`);

    const investments = await prisma.investment.count();
    assert(investments >= 2, `Investments (H4 barn, machines) registered (Found: ${investments})`);

    const loans = await prisma.loan.count();
    assert(loans >= 2, `Agricultural loans registered (Found: ${loans})`);

  } catch (err) {
    assert(false, `Database test error: ${err.message}`);
  } finally {
    await prisma.$disconnect();
  }

  console.log('\n======================================================');
  console.log(`📊 TEST SUMMARY: ${passedTests} PASSED, ${failedTests} FAILED`);
  console.log('======================================================\n');

  if (failedTests > 0) {
    process.exit(1);
  }
}

runTests();
