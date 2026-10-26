import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting Lampe Agrar Finanzmanager seed...');

  // 1. Roles
  const rolesData = [
    {
      name: 'BETRIEBSLEITUNG',
      displayName: 'Betriebsleitung (Gesa & Dr. Josef Langenberg)',
      description: 'Volle administrative, strategische und finanzielle Leitungsrechte',
      permissions: ['ALL', 'FINANCE_READ', 'FINANCE_WRITE', 'ADMIN', 'AUDIT_VIEW', 'REPORTS_ALL'],
    },
    {
      name: 'FINANZVERWALTUNG',
      displayName: 'Finanzverwaltung & Buchhaltung',
      description: 'Verwaltung von Buchungen, Rechnungen, Konten und Vorbereitung der DATEV-Daten',
      permissions: ['FINANCE_READ', 'FINANCE_WRITE', 'INVOICES_ALL', 'BANKING_ALL', 'REPORTS_FINANCE'],
    },
    {
      name: 'ACKERBAULEITUNG',
      displayName: 'Ackerbauleitung (Kenneth Makowka)',
      description: 'Verwaltung von Schlägen, Fruchtfolge, Kartoffellager und Maschinenpark',
      permissions: ['CROPS_ALL', 'STORAGE_ALL', 'MACHINES_ALL', 'REPORTS_AGRAR'],
    },
    {
      name: 'SCHWEINEMASTLEITUNG',
      displayName: 'Schweinemastleitung',
      description: 'Verwaltung von Mastdurchgängen, Tierbeständen, Futter und Tiergesundheit',
      permissions: ['LIVESTOCK_ALL', 'REPORTS_LIVESTOCK'],
    },
    {
      name: 'MITARBEITER',
      displayName: 'Mitarbeiter & Auszubildende',
      description: 'Eingeschränkter Zugriff auf Arbeitszeiten und Maschineneinsatz',
      permissions: ['MACHINES_USAGE', 'TASKS_VIEW'],
    },
    {
      name: 'STEUERBERATER',
      displayName: 'Steuerberater / Buchprüfer',
      description: 'Lesezugriff auf Finanzabschlüsse, USt-Voranmeldungen und DATEV-Exporte',
      permissions: ['FINANCE_READ', 'REPORTS_READ', 'DATEV_EXPORT'],
    },
  ];

  const roles = {};
  for (const r of rolesData) {
    const role = await prisma.role.upsert({
      where: { name: r.name },
      update: { displayName: r.displayName, description: r.description, permissions: r.permissions },
      create: r,
    });
    roles[r.name] = role;
  }

  // 2. Users
  const passwordHash = await bcrypt.hash('password123', 10);
  const usersData = [
    {
      email: 'gesa.langenberg@lampe-agrar.de',
      name: 'Gesa Langenberg',
      roleId: roles.BETRIEBSLEITUNG.id,
      passwordHash,
      language: 'de',
    },
    {
      email: 'josef.langenberg@lampe-agrar.de',
      name: 'Dr. Josef Langenberg',
      roleId: roles.BETRIEBSLEITUNG.id,
      passwordHash,
      language: 'de',
    },
    {
      email: 'kenneth.makowka@lampe-agrar.de',
      name: 'Kenneth Makowka',
      roleId: roles.ACKERBAULEITUNG.id,
      passwordHash,
      language: 'de',
    },
    {
      email: 'finanzen@lampe-agrar.de',
      name: 'Helga Meyer',
      roleId: roles.FINANZVERWALTUNG.id,
      passwordHash,
      language: 'de',
    },
    {
      email: 'schweinemast@lampe-agrar.de',
      name: 'Torsten Brinkmann',
      roleId: roles.SCHWEINEMASTLEITUNG.id,
      passwordHash,
      language: 'de',
    },
    {
      email: 'berater@steuerbuero-diepholz.de',
      name: 'Dr. Klaus Vormweg (Steuerberater)',
      roleId: roles.STEUERBERATER.id,
      passwordHash,
      language: 'de',
    },
  ];

  for (const u of usersData) {
    const user = await prisma.user.upsert({
      where: { email: u.email },
      update: { name: u.name, roleId: u.roleId, passwordHash: u.passwordHash },
      create: {
        email: u.email,
        name: u.name,
        roleId: u.roleId,
        passwordHash: u.passwordHash,
      },
    });

    await prisma.userPreference.upsert({
      where: { userId: user.id },
      update: { language: u.language },
      create: {
        userId: user.id,
        language: u.language,
        animationsEnabled: true,
        defaultCurrency: 'EUR',
      },
    });
  }

  // 3. Farm Settings
  await prisma.farmSettings.deleteMany({});
  await prisma.farmSettings.create({
    data: {
      farmName: 'Lampe Agrar',
      legalName: 'Lampe Agrar - Gesa & Dr. Josef Langenberg GbR',
      taxId: '38/204/11452',
      vatId: 'DE284920184',
      iban: 'DE89 2806 9954 0001 2345 67',
      bic: 'GENODEF1VEC',
      bankName: 'Volksbank Vechta eG',
      address: 'Hünenheide 3',
      postalCode: '49406',
      city: 'Bockstedt / Drentwede',
      phone: '04246/95026',
      mobile: '0151/42343339',
      email: 'info@lampe-agrar.de',
      website: 'https://www.hi-gesa.de',
      fiscalYearStart: 1,
      fiscalYearEnd: 12,
      defaultVatRate: 19.0,
      defaultLanguage: 'de',
      isDemoMode: true,
    },
  });

  // 4. Financial Accounts
  const accountsData = [
    {
      name: 'Volksbank Vechta - Geschäftskonto',
      accountType: 'CHECKING',
      accountNumber: '123456700',
      iban: 'DE89 2806 9954 0001 2345 67',
      bic: 'GENODEF1VEC',
      initialBalance: 245000.0,
      currentBalance: 312450.8,
      isDefault: true,
    },
    {
      name: 'Landwirtschaftliche Rentenbank - Investitionskonto',
      accountType: 'SAVINGS',
      accountNumber: '987654321',
      iban: 'DE45 5002 0000 0098 7654 32',
      bic: 'LRBTDEF1',
      initialBalance: 150000.0,
      currentBalance: 118400.0,
      isDefault: false,
    },
    {
      name: 'Betriebskasse Hünenheide (Bar)',
      accountType: 'CASH',
      accountNumber: 'KASSE-01',
      initialBalance: 3500.0,
      currentBalance: 4210.5,
      isDefault: false,
    },
  ];

  const accounts = [];
  for (const acc of accountsData) {
    const existing = await prisma.financialAccount.findFirst({ where: { name: acc.name } });
    if (existing) {
      const updated = await prisma.financialAccount.update({ where: { id: existing.id }, data: acc });
      accounts.push(updated);
    } else {
      const created = await prisma.financialAccount.create({ data: acc });
      accounts.push(created);
    }
  }

  // 5. Tax Rates
  const taxRatesData = [
    { code: 'UST19', name: 'Regelsteuersatz 19%', ratePercent: 19.0, isAgriculturalFlatRate: false },
    { code: 'UST07', name: 'Ermäßigter Steuersatz 7%', ratePercent: 7.0, isAgriculturalFlatRate: false },
    { code: 'UST_AGRAR', name: 'Pauschalierung Landwirtschaft 10,7% (§ 24 UStG)', ratePercent: 10.7, isAgriculturalFlatRate: true },
    { code: 'UST00', name: 'Steuerfrei 0% (Innergemeinschaftlich)', ratePercent: 0.0, isAgriculturalFlatRate: false },
  ];

  await prisma.taxRate.deleteMany({});
  for (const tr of taxRatesData) {
    await prisma.taxRate.create({ data: tr });
  }

  // 6. Transaction Categories
  const categoriesData = [
    // Revenue
    { key: 'REV_PIG_SALES', nameDe: 'Verkauf Mastschweine', nameEn: 'Pig Fattening Sales', nameFr: 'Vente porcs charcutiers', type: 'REVENUE', defaultVatRate: 10.7 },
    { key: 'REV_POTATO_SALES', nameDe: 'Verkauf Industriekartoffeln', nameEn: 'Industrial Potato Sales', nameFr: 'Vente pommes de terre féculières', type: 'REVENUE', defaultVatRate: 10.7 },
    { key: 'REV_GRAIN_SALES', nameDe: 'Verkauf Getreide (Weizen/Gerste)', nameEn: 'Grain Sales (Wheat/Barley)', nameFr: 'Vente céréales', type: 'REVENUE', defaultVatRate: 10.7 },
    { key: 'REV_RAPESEED_SALES', nameDe: 'Verkauf Raps', nameEn: 'Rapeseed Sales', nameFr: 'Vente colza', type: 'REVENUE', defaultVatRate: 10.7 },
    { key: 'REV_SUGARBEET_SALES', nameDe: 'Verkauf Zuckerrüben', nameEn: 'Sugar Beet Sales', nameFr: 'Vente betteraves sucrières', type: 'REVENUE', defaultVatRate: 10.7 },
    { key: 'REV_SUBSIDIES', nameDe: 'Agrarförderung & Direktzahlungen', nameEn: 'Agricultural Subsidies', nameFr: 'Aides PAC & Subventions', type: 'REVENUE', defaultVatRate: 0.0 },
    { key: 'REV_OTHER', nameDe: 'Sonstige betriebliche Erlöse', nameEn: 'Other Operating Revenue', nameFr: 'Autres recettes d exploitation', type: 'REVENUE', defaultVatRate: 19.0 },

    // Expense
    { key: 'EXP_FEED', nameDe: 'Aliments pour porcs (Futtermittel)', nameEn: 'Pig Feed Supplies', nameFr: 'Aliments pour porcs', type: 'EXPENSE', defaultVatRate: 7.0 },
    { key: 'EXP_PIGLETS', nameDe: 'Ferkelkauf (Achat d animaux)', nameEn: 'Piglet Purchases', nameFr: 'Achat de porcelets', type: 'EXPENSE', defaultVatRate: 10.7 },
    { key: 'EXP_VET', nameDe: 'Tierarzt & Medikamente', nameEn: 'Veterinary & Medication', nameFr: 'Frais vétérinaires', type: 'EXPENSE', defaultVatRate: 19.0 },
    { key: 'EXP_STRAW', nameDe: 'Stroh & Einstreu (Litière)', nameEn: 'Straw & Bedding', nameFr: 'Paille & litière', type: 'EXPENSE', defaultVatRate: 7.0 },
    { key: 'EXP_SEEDS', nameDe: 'Saatgut (Semences)', nameEn: 'Seeds', nameFr: 'Semences', type: 'EXPENSE', defaultVatRate: 7.0 },
    { key: 'EXP_FERTILIZER', nameDe: 'Mineraldünger & Nährstoffe', nameEn: 'Mineral Fertilizers', nameFr: 'Engrais & fertilisants', type: 'EXPENSE', defaultVatRate: 19.0 },
    { key: 'EXP_PESTICIDES', nameDe: 'Pflanzenschutzmittel', nameEn: 'Crop Protection & Pesticides', nameFr: 'Produits phytosanitaires', type: 'EXPENSE', defaultVatRate: 19.0 },
    { key: 'EXP_FUEL', nameDe: 'Diesel & Kraftstoffe', nameEn: 'Diesel & Fuel', nameFr: 'Carburant & diesel agricole', type: 'EXPENSE', defaultVatRate: 19.0 },
    { key: 'EXP_ENERGY', nameDe: 'Strom & Wasser (Énergie)', nameEn: 'Electricity & Water', nameFr: 'Électricité & Eau', type: 'EXPENSE', defaultVatRate: 19.0 },
    { key: 'EXP_MACHINERY_REPAIR', nameDe: 'Maschineninstandhaltung & Reparaturen', nameEn: 'Machinery Maintenance & Repair', nameFr: 'Entretien & réparations engins', type: 'EXPENSE', defaultVatRate: 19.0 },
    { key: 'EXP_SPARE_PARTS', nameDe: 'Ersatzteile & Werkstatt', nameEn: 'Spare Parts & Workshop', nameFr: 'Pièces détachées', type: 'EXPENSE', defaultVatRate: 19.0 },
    { key: 'EXP_CONTRACTORS', nameDe: 'Lohnunternehmer & Agrarservice', nameEn: 'Contractors & Machinery Ring', nameFr: 'Prestataires agricoles / ETA', type: 'EXPENSE', defaultVatRate: 19.0 },
    { key: 'EXP_RENT', nameDe: 'Pacht & Mieten (Fermages)', nameEn: 'Land Lease & Rent', nameFr: 'Fermages & locations de terres', type: 'EXPENSE', defaultVatRate: 0.0 },
    { key: 'EXP_INSURANCE', nameDe: 'Versicherungen (Hagel, Gebäude, Fuhrpark)', nameEn: 'Insurances', nameFr: 'Assurances agricoles', type: 'EXPENSE', defaultVatRate: 19.0 },
    { key: 'EXP_WAGES', nameDe: 'Löhne & Sozialabgaben', nameEn: 'Wages & Social Security', nameFr: 'Salaires & charges sociales', type: 'EXPENSE', defaultVatRate: 0.0 },
    { key: 'EXP_INTEREST', nameDe: 'Zinsaufwand Darlehen', nameEn: 'Loan Interest', nameFr: 'Intérêts d emprunt', type: 'EXPENSE', defaultVatRate: 0.0 },
    { key: 'EXP_ADMIN', nameDe: 'Verwaltung, Beratung & Software', nameEn: 'Administration & Advisory', nameFr: 'Frais administratifs & conseil', type: 'EXPENSE', defaultVatRate: 19.0 },
    { key: 'EXP_OTHER', nameDe: 'Sonstige betriebliche Aufwendungen', nameEn: 'Other Operating Expenses', nameFr: 'Autres dépenses', type: 'EXPENSE', defaultVatRate: 19.0 },
  ];

  await prisma.transactionCategory.deleteMany({});
  for (const cat of categoriesData) {
    await prisma.transactionCategory.create({ data: cat });
  }

  // 7. Customers & Buyers
  const customersData = [
    {
      customerNumber: 'KND-1001',
      companyName: 'Emsland Stärke GmbH',
      contactName: 'Dr. Michael Schröder',
      email: 'kartoffel-einkauf@emsland-group.de',
      phone: '05943/810',
      address: 'Emslandstraße 58',
      postalCode: '49824',
      city: 'Emlichheim',
      vatNumber: 'DE117036294',
      paymentTermsDays: 14,
      notes: 'Hauptabnehmer Industriekartoffeln. Kontrakte für Kampagne 2026/2027.',
    },
    {
      customerNumber: 'KND-1002',
      companyName: 'Vion Zucht- und Nutzvieh GmbH',
      contactName: 'Christian Wehrmann',
      email: 'vieheinkauf@vionfood.com',
      phone: '05432/890',
      address: 'Industriestraße 12',
      postalCode: '49624',
      city: 'Löningen',
      vatNumber: 'DE156829104',
      paymentTermsDays: 7,
      notes: 'Wöchentliche Abnahme von Mastschweinen (Haltungsform 4 & 2). Abrechnung nach AutoFOM.',
    },
    {
      customerNumber: 'KND-1003',
      companyName: 'Nordzucker AG',
      contactName: 'Markus Kuhlmann',
      email: 'rueben-anbau@nordzucker.com',
      phone: '0531/24110',
      address: 'Küchenstraße 9',
      postalCode: '38100',
      city: 'Braunschweig',
      vatNumber: 'DE114878201',
      paymentTermsDays: 30,
      notes: 'Abnahme Zuckerrüben Werk Uelzen / Schladen.',
    },
    {
      customerNumber: 'KND-1004',
      companyName: 'Raiffeisen Warengenossenschaft eG Diepholz-Barnstorf',
      contactName: 'Stefan Brockmann',
      email: 'getreide@rwg-diepholz.de',
      phone: '05441/9870',
      address: 'Lüderstraße 14',
      postalCode: '49406',
      city: 'Barnstorf',
      vatNumber: 'DE117765432',
      paymentTermsDays: 14,
      notes: 'Abnahme Getreide (Weizen, Gerste, Triticale) und Winterraps.',
    },
  ];

  await prisma.customer.deleteMany({});
  const customers = [];
  for (const c of customersData) {
    const cust = await prisma.customer.create({ data: c });
    customers.push(cust);
  }

  // 8. Suppliers
  const suppliersData = [
    {
      supplierNumber: 'LFR-2001',
      companyName: 'RWG Diepholz-Barnstorf eG',
      contactName: 'Klaus Eickhoff',
      email: 'bestellung@rwg-diepholz.de',
      phone: '05441/98710',
      address: 'Lüderstraße 14',
      postalCode: '49406',
      city: 'Barnstorf',
      vatNumber: 'DE117765432',
      paymentTermsDays: 30,
      notes: 'Lieferant für Schweinefutter (Trockenfutter), Mineralien, Saatgut und Mineraldünger.',
    },
    {
      supplierNumber: 'LFR-2002',
      companyName: 'Ferkelerzeugerring Weser-Ems eG',
      contactName: 'Bernd Albers',
      email: 'ferkel@ferkelring-we.de',
      phone: '04441/8720',
      address: 'Bremer Tor 3',
      postalCode: '49377',
      city: 'Vechta',
      vatNumber: 'DE117799123',
      paymentTermsDays: 14,
      notes: 'Lieferung von Qualitäts-Ferkeln (Topigs Norsvin / DanBred) mit ca. 28-30 kg.',
    },
    {
      supplierNumber: 'LFR-2003',
      companyName: 'Tierarztpraxis Dr. med. vet. Meyer & Partner',
      contactName: 'Dr. Jens Meyer',
      email: 'praxis@tierarzt-meyer.de',
      phone: '05441/3321',
      address: 'Lange Straße 44',
      postalCode: '49406',
      city: 'Drentwede',
      vatNumber: 'DE223344556',
      paymentTermsDays: 30,
      notes: 'Bestandsbetreuung Schweinemast, Impfprogramme und Tierwohl-Audits.',
    },
    {
      supplierNumber: 'LFR-2004',
      companyName: 'Raiffeisen Schraders Tankstellen & Energie GmbH',
      contactName: 'Jörg Schraders',
      email: 'energie@schraders-diesel.de',
      phone: '04246/8920',
      address: 'Sulinger Straße 20',
      postalCode: '27232',
      city: 'Sulingen',
      vatNumber: 'DE118833445',
      paymentTermsDays: 14,
      notes: 'Lieferung von Agrardiesel (Großtankanlage Hünenheide 15.000 l) und AdBlue.',
    },
    {
      supplierNumber: 'LFR-2005',
      companyName: 'Grimme Landmaschinenfabrik GmbH & Co. KG',
      contactName: 'Technischer Kundendienst Damme',
      email: 'service@grimme.de',
      phone: '05491/6660',
      address: 'Hunteburger Straße 32',
      postalCode: '49401',
      city: 'Damme',
      vatNumber: 'DE117788990',
      paymentTermsDays: 30,
      notes: 'Ersatzteile, Wartung und Verschleißteile für Grimme SE 260 Roder und Lagertechnik.',
    },
    {
      supplierNumber: 'LFR-2006',
      companyName: 'Fendt Vertriebszentrum Nord / BSL Landtechnik',
      contactName: 'Uwe Hagedorn',
      email: 'service@bsl-landtechnik.de',
      phone: '04271/8050',
      address: 'Handelsweg 4',
      postalCode: '27211',
      city: 'Bassum',
      vatNumber: 'DE116677889',
      paymentTermsDays: 30,
      notes: 'Wartung, TÜV und Inspektionen für Fendt Schlepperflotte.',
    },
  ];

  await prisma.supplier.deleteMany({});
  const suppliers = [];
  for (const s of suppliersData) {
    const supp = await prisma.supplier.create({ data: s });
    suppliers.push(supp);
  }

  // 9. Crops & Fields
  const cropsData = [
    { code: 'CRP_POTATO', name: 'Industriekartoffeln', cropType: 'Hackfrucht', standardMarketPricePerTon: 115.0, expectedYieldTonPerHa: 48.0 },
    { code: 'CRP_WHEAT', name: 'Winterweizen (A-Weizen)', cropType: 'Getreide', standardMarketPricePerTon: 225.0, expectedYieldTonPerHa: 8.5 },
    { code: 'CRP_CORN', name: 'Silomais & Ackerfutter', cropType: 'Futterbau', standardMarketPricePerTon: 46.0, expectedYieldTonPerHa: 46.0 },
    { code: 'CRP_RAPE', name: 'Winterraps', cropType: 'Ölsaaten', standardMarketPricePerTon: 465.0, expectedYieldTonPerHa: 3.9 },
    { code: 'CRP_BEET', name: 'Zuckerrüben', cropType: 'Hackfrucht', standardMarketPricePerTon: 48.5, expectedYieldTonPerHa: 78.0 },
  ];

  await prisma.crop.deleteMany({});
  const crops = [];
  for (const c of cropsData) {
    const crop = await prisma.crop.create({ data: c });
    crops.push(crop);
  }

  const fieldsData = [
    { fieldNumber: 'SCH-01', name: 'Hünenheide Nord', areaHa: 42.5, soilQualityScore: 54.0, locationDescription: 'Hofnahe Fläche direkt an Hünenheide 3' },
    { fieldNumber: 'SCH-02', name: 'Hünenheide Süd', areaHa: 38.0, soilQualityScore: 52.5, locationDescription: 'Südlich der Hofstelle Bockstedt' },
    { fieldNumber: 'SCH-03', name: 'Drentweder Mooracker', areaHa: 55.0, soilQualityScore: 46.0, locationDescription: 'Gemarkung Drentwede Richtung Barnstorf' },
    { fieldNumber: 'SCH-04', name: 'Bockstedter Esch', areaHa: 65.0, soilQualityScore: 61.0, locationDescription: 'Bester Ackerboden, hoher Humusgehalt' },
    { fieldNumber: 'SCH-05', name: 'Barnstorfer Kamp', areaHa: 72.5, soilQualityScore: 58.0, locationDescription: 'Großflächiger Ackerschlag für Weizen/Raps' },
    { fieldNumber: 'SCH-06', name: 'Aldorfer Flur', areaHa: 84.0, soilQualityScore: 55.5, locationDescription: 'Schlagkomplex Richtung Twistringen' },
    { fieldNumber: 'SCH-07', name: 'Ridder Esch', areaHa: 48.0, soilQualityScore: 53.0, locationDescription: 'Sandiger Lehm, optimal für Kartoffelanbau' },
    { fieldNumber: 'SCH-08', name: 'Düster Esch', areaHa: 35.0, soilQualityScore: 49.0, locationDescription: 'Mais- und Futterbaufläche' },
  ];

  await prisma.field.deleteMany({});
  const fields = [];
  for (const f of fieldsData) {
    const field = await prisma.field.create({ data: f });
    fields.push(field);
  }

  // 10. Crop Seasons
  const seasonsData = [
    {
      seasonYear: 2026,
      cropId: crops[0].id, // Kartoffeln
      fieldId: fields[0].id,
      areaHa: 42.5,
      expectedYieldTons: 2040.0,
      actualYieldTons: 2085.0,
      totalDirectCost: 98500.0,
      totalRevenue: 242000.0,
      grossMargin: 143500.0,
      status: 'HARVESTED',
    },
    {
      seasonYear: 2026,
      cropId: crops[0].id, // Kartoffeln
      fieldId: fields[6].id,
      areaHa: 48.0,
      expectedYieldTons: 2304.0,
      actualYieldTons: 2380.0,
      totalDirectCost: 111200.0,
      totalRevenue: 275800.0,
      grossMargin: 164600.0,
      status: 'HARVESTED',
    },
    {
      seasonYear: 2026,
      cropId: crops[1].id, // Weizen
      fieldId: fields[4].id,
      areaHa: 72.5,
      expectedYieldTons: 616.25,
      actualYieldTons: 624.0,
      totalDirectCost: 65250.0,
      totalRevenue: 140400.0,
      grossMargin: 75150.0,
      status: 'HARVESTED',
    },
    {
      seasonYear: 2026,
      cropId: crops[2].id, // Mais
      fieldId: fields[7].id,
      areaHa: 35.0,
      expectedYieldTons: 1610.0,
      actualYieldTons: 1645.0,
      totalDirectCost: 31500.0,
      totalRevenue: 75670.0,
      grossMargin: 44170.0,
      status: 'HARVESTED',
    },
    {
      seasonYear: 2026,
      cropId: crops[3].id, // Raps
      fieldId: fields[2].id,
      areaHa: 50.0,
      expectedYieldTons: 195.0,
      actualYieldTons: 198.5,
      totalDirectCost: 45000.0,
      totalRevenue: 92300.0,
      grossMargin: 47300.0,
      status: 'HARVESTED',
    },
    {
      seasonYear: 2026,
      cropId: crops[4].id, // Rüben
      fieldId: fields[1].id,
      areaHa: 30.0,
      expectedYieldTons: 2340.0,
      actualYieldTons: 2390.0,
      totalDirectCost: 39000.0,
      totalRevenue: 115900.0,
      grossMargin: 76900.0,
      status: 'HARVESTED',
    },
  ];

  await prisma.cropSeason.deleteMany({});
  for (const s of seasonsData) {
    await prisma.cropSeason.create({ data: s });
  }

  // 11. Pig Batches
  const batchesData = [
    {
      batchNumber: 'MAST-2026-H4-01',
      barnType: 'OUTDOOR_CLIMATE_H4',
      barnName: 'Außenklimastall A (Stroh & Kot-Harn-Trennung)',
      arrivalDate: new Date('2026-05-10'),
      initialPigCount: 700,
      currentPigCount: 686,
      status: 'CLOSED',
      initialAvgWeightKg: 29.5,
      targetWeightKg: 122.0,
      mortalityCount: 14,
      feedConversionRate: 2.72,
      totalDirectCost: 104500.0,
      totalRevenue: 178200.0,
      grossMargin: 73700.0,
      notes: 'Erfolgreicher Durchgang Haltungsform 4. Hohe Nachfrage und Tierwohl-Prämie (+0,35 €/kg).',
    },
    {
      batchNumber: 'MAST-2026-H4-02',
      barnType: 'OUTDOOR_CLIMATE_H4',
      barnName: 'Außenklimastall B (Stroh & Kot-Harn-Trennung)',
      arrivalDate: new Date('2026-07-15'),
      initialPigCount: 700,
      currentPigCount: 691,
      status: 'ACTIVE',
      initialAvgWeightKg: 30.0,
      targetWeightKg: 121.5,
      mortalityCount: 9,
      feedConversionRate: 2.74,
      totalDirectCost: 88400.0,
      totalRevenue: 0.0,
      grossMargin: -88400.0,
      notes: 'Laufender Durchgang. Geplante Schlachtung Ende Oktober 2026.',
    },
    {
      batchNumber: 'MAST-2026-H2-01',
      barnType: 'FATTENING_H2',
      barnName: 'Schweinemaststall 1 (Haltungsform 2)',
      arrivalDate: new Date('2026-04-01'),
      initialPigCount: 1000,
      currentPigCount: 978,
      status: 'CLOSED',
      initialAvgWeightKg: 28.5,
      targetWeightKg: 120.0,
      mortalityCount: 22,
      feedConversionRate: 2.82,
      totalDirectCost: 138500.0,
      totalRevenue: 218400.0,
      grossMargin: 79900.0,
      notes: 'Konventioneller Mastdurchgang abgeschlossen.',
    },
    {
      batchNumber: 'MAST-2026-H2-02',
      barnType: 'FATTENING_H2',
      barnName: 'Schweinemaststall 2 (Haltungsform 2)',
      arrivalDate: new Date('2026-06-20'),
      initialPigCount: 1000,
      currentPigCount: 984,
      status: 'ACTIVE',
      initialAvgWeightKg: 29.0,
      targetWeightKg: 120.5,
      mortalityCount: 16,
      feedConversionRate: 2.80,
      totalDirectCost: 112000.0,
      totalRevenue: 0.0,
      grossMargin: -112000.0,
      notes: 'Mastverlauf im Soll. Ausstallung in 3 Wochen vorgesehen.',
    },
  ];

  await prisma.pigBatch.deleteMany({});
  for (const b of batchesData) {
    await prisma.pigBatch.create({ data: b });
  }

  // 12. Potato Storage Lots
  const storageLotsData = [
    {
      lotNumber: 'KART-2026-HALLE1-A',
      cropType: 'Industriekartoffeln (Sorte Innovator)',
      storageLocation: 'HALL_1_BULK',
      harvestYear: 2026,
      initialWeightTons: 2085.0,
      remainingWeightTons: 1350.0,
      qualityGrade: 'Stärkegehalt 18,2%',
      status: 'PARTIALLY_SOLD',
      originFieldInfo: 'Schlag Hünenheide Nord (SCH-01)',
      storageLossTons: 42.0,
    },
    {
      lotNumber: 'KART-2026-HALLE2-B',
      cropType: 'Industriekartoffeln (Sorte Fontane)',
      storageLocation: 'HALL_2_BULK',
      harvestYear: 2026,
      initialWeightTons: 2380.0,
      remainingWeightTons: 2150.0,
      qualityGrade: 'Stärkegehalt 17,9%',
      status: 'IN_STORAGE',
      originFieldInfo: 'Schlag Ridder Esch (SCH-07)',
      storageLossTons: 35.0,
    },
  ];

  await prisma.storageLot.deleteMany({});
  for (const lot of storageLotsData) {
    await prisma.storageLot.create({ data: lot });
  }

  // 13. Agricultural Machinery & Fleet
  const machinesData = [
    {
      machineCode: 'TRK-FENDT-724',
      name: 'Fendt 724 Vario ProfiPlus',
      category: 'TRACTOR',
      brand: 'Fendt',
      model: '724 Vario Gen6',
      hp: 246,
      yearOfManufacture: 2022,
      purchaseDate: new Date('2022-03-15'),
      purchasePrice: 215000.0,
      residualValue: 120000.0,
      depreciationYears: 8,
      currentHoursOrKm: 2840.0,
      fuelConsumptionPerUnit: 14.5,
      insuranceAnnual: 2450.0,
      maintenanceAnnual: 5800.0,
      nextMaintenanceDueHours: 3000.0,
    },
    {
      machineCode: 'TRK-FENDT-828',
      name: 'Fendt 828 Vario ProfiPlus',
      category: 'TRACTOR',
      brand: 'Fendt',
      model: '828 Vario',
      hp: 287,
      yearOfManufacture: 2021,
      purchaseDate: new Date('2021-04-10'),
      purchasePrice: 245000.0,
      residualValue: 135000.0,
      depreciationYears: 8,
      currentHoursOrKm: 3450.0,
      fuelConsumptionPerUnit: 18.2,
      insuranceAnnual: 2780.0,
      maintenanceAnnual: 6900.0,
      nextMaintenanceDueHours: 3500.0,
    },
    {
      machineCode: 'TRK-FENDT-720',
      name: 'Fendt 720 Vario',
      category: 'TRACTOR',
      brand: 'Fendt',
      model: '720 Vario',
      hp: 209,
      yearOfManufacture: 2020,
      purchaseDate: new Date('2020-05-20'),
      purchasePrice: 185000.0,
      residualValue: 95000.0,
      depreciationYears: 8,
      currentHoursOrKm: 4200.0,
      fuelConsumptionPerUnit: 13.0,
      insuranceAnnual: 2100.0,
      maintenanceAnnual: 5200.0,
      nextMaintenanceDueHours: 4500.0,
    },
    {
      machineCode: 'TRK-FENDT-930',
      name: 'Fendt 930 Vario ProfiPlus',
      category: 'TRACTOR',
      brand: 'Fendt',
      model: '930 Vario Gen7',
      hp: 305,
      yearOfManufacture: 2023,
      purchaseDate: new Date('2023-02-18'),
      purchasePrice: 280000.0,
      residualValue: 175000.0,
      depreciationYears: 8,
      currentHoursOrKm: 1890.0,
      fuelConsumptionPerUnit: 21.0,
      insuranceAnnual: 3100.0,
      maintenanceAnnual: 6400.0,
      nextMaintenanceDueHours: 2000.0,
    },
    {
      machineCode: 'HARV-GRIMME-SE260',
      name: 'Grimme Kartoffelroder SE 260',
      category: 'HARVESTER',
      brand: 'Grimme',
      model: 'SE 260 zweireihig',
      hp: 0,
      yearOfManufacture: 2021,
      purchaseDate: new Date('2021-08-01'),
      purchasePrice: 198000.0,
      residualValue: 95000.0,
      depreciationYears: 10,
      currentHoursOrKm: 780.0,
      insuranceAnnual: 1890.0,
      maintenanceAnnual: 7500.0,
      nextMaintenanceDueHours: 850.0,
    },
    {
      machineCode: 'SPRAY-DAMMANN-10K',
      name: 'Dammann Anhängespritze 10.000 l',
      category: 'SPRAYER',
      brand: 'Dammann',
      model: 'Profi-Class 10.000 l (39m Gestänge)',
      hp: 0,
      yearOfManufacture: 2022,
      purchaseDate: new Date('2022-04-12'),
      purchasePrice: 145000.0,
      residualValue: 80000.0,
      depreciationYears: 10,
      currentHoursOrKm: 650.0,
      insuranceAnnual: 1400.0,
      maintenanceAnnual: 3200.0,
      nextMaintenanceDueHours: 700.0,
    },
    {
      machineCode: 'SLURRY-KOTTE-18M3',
      name: 'Kotte Garant Güllefass 18 m³',
      category: 'SLURRY_TANKER',
      brand: 'Kotte Garant',
      model: 'TAV 18.000 l Schleppschlauch',
      hp: 0,
      yearOfManufacture: 2020,
      purchaseDate: new Date('2020-03-01'),
      purchasePrice: 92000.0,
      residualValue: 48000.0,
      depreciationYears: 10,
      currentHoursOrKm: 920.0,
      insuranceAnnual: 980.0,
      maintenanceAnnual: 2800.0,
      nextMaintenanceDueHours: 1000.0,
    },
    {
      machineCode: 'COMB-CLAAS-630',
      name: 'Claas Lexion 630 Mähdrescher',
      category: 'HARVESTER',
      brand: 'Claas',
      model: 'Lexion 630 mit Vario 680',
      hp: 313,
      yearOfManufacture: 2019,
      purchaseDate: new Date('2019-06-25'),
      purchasePrice: 275000.0,
      residualValue: 125000.0,
      depreciationYears: 10,
      currentHoursOrKm: 1140.0,
      insuranceAnnual: 2950.0,
      maintenanceAnnual: 8200.0,
      nextMaintenanceDueHours: 1200.0,
    },
    {
      machineCode: 'TRUCK-MB-ACTROS',
      name: 'Mercedes-Benz Actros Bandwagen LKW',
      category: 'TRUCK',
      brand: 'Mercedes-Benz',
      model: 'Actros 1845 mit Bandauflieger',
      hp: 449,
      yearOfManufacture: 2020,
      purchaseDate: new Date('2020-09-10'),
      purchasePrice: 115000.0,
      residualValue: 55000.0,
      depreciationYears: 8,
      currentHoursOrKm: 145000.0,
      insuranceAnnual: 3400.0,
      maintenanceAnnual: 4800.0,
      nextMaintenanceDueHours: 160000.0,
    },
  ];

  await prisma.agriculturalMachine.deleteMany({});
  for (const m of machinesData) {
    await prisma.agriculturalMachine.create({ data: m });
  }

  // 14. Employees
  const employeesData = [
    {
      employeeNumber: 'EMP-001',
      firstName: 'Kenneth',
      lastName: 'Makowka',
      roleTitle: 'Ackerbauleiter (Pflanzenbau & Maschineneinsatz)',
      employmentType: 'MANAGEMENT',
      monthlyGrossSalary: 4850.0,
      monthlyEmployerCost: 5880.0,
      allocatedActivity: 'CROPS',
      hireDate: new Date('2019-03-01'),
    },
    {
      employeeNumber: 'EMP-002',
      firstName: 'Torsten',
      lastName: 'Brinkmann',
      roleTitle: 'Vollzeit Mitarbeiter Schweinemast (Haltungsform 4 & 2)',
      employmentType: 'FULL_TIME',
      monthlyGrossSalary: 3750.0,
      monthlyEmployerCost: 4560.0,
      allocatedActivity: 'LIVESTOCK',
      hireDate: new Date('2020-04-15'),
    },
    {
      employeeNumber: 'EMP-003',
      firstName: 'Felix',
      lastName: 'Landwehr',
      roleTitle: 'Vollzeit Mitarbeiter Ackerbau & Bodenbearbeitung',
      employmentType: 'FULL_TIME',
      monthlyGrossSalary: 3600.0,
      monthlyEmployerCost: 4380.0,
      allocatedActivity: 'CROPS',
      hireDate: new Date('2021-08-01'),
    },
    {
      employeeNumber: 'EMP-004',
      firstName: 'Christian',
      lastName: 'Müller',
      roleTitle: 'Vollzeit Mitarbeiter Ackerbau & Fuhrpark',
      employmentType: 'FULL_TIME',
      monthlyGrossSalary: 3450.0,
      monthlyEmployerCost: 4200.0,
      allocatedActivity: 'CROPS',
      hireDate: new Date('2022-02-01'),
    },
    {
      employeeNumber: 'EMP-005',
      firstName: 'Sabine',
      lastName: 'Westermann',
      roleTitle: 'Teilzeit Büro & Dokumentation',
      employmentType: 'PART_TIME',
      monthlyGrossSalary: 1850.0,
      monthlyEmployerCost: 2260.0,
      allocatedActivity: 'ADMIN',
      hireDate: new Date('2021-01-10'),
    },
    {
      employeeNumber: 'EMP-006',
      firstName: 'Jonas',
      lastName: 'Ehlers',
      roleTitle: 'Auszubildender Landwirt (2. Lehrjahr)',
      employmentType: 'APPRENTICE',
      monthlyGrossSalary: 1100.0,
      monthlyEmployerCost: 1350.0,
      allocatedActivity: 'GENERAL',
      hireDate: new Date('2025-08-01'),
    },
  ];

  await prisma.employee.deleteMany({});
  for (const emp of employeesData) {
    await prisma.employee.create({ data: emp });
  }

  // 15. Inventory Items
  const inventoryData = [
    {
      itemCode: 'INV-FUTTER-KORN',
      name: 'Mastschweinefutter Endmast (RWG Diepholz)',
      category: 'ANIMAL_FEED',
      unit: 't',
      currentQuantity: 42.0,
      minStockThreshold: 15.0,
      averageUnitPrice: 310.0,
      totalStockValue: 13020.0,
      storageLocation: 'Futtersilos Außenklimastall',
    },
    {
      itemCode: 'INV-DIESEL-AGRAR',
      name: 'Agrardiesel schwefelfrei',
      category: 'FUEL',
      unit: 'l',
      currentQuantity: 11500.0,
      minStockThreshold: 3000.0,
      averageUnitPrice: 1.38,
      totalStockValue: 15870.0,
      storageLocation: 'Tankanlage Hofstelle 15.000 l',
    },
    {
      itemCode: 'INV-DUENGER-KAS',
      name: 'KAS 27% N Mineraldünger',
      category: 'FERTILIZER',
      unit: 't',
      currentQuantity: 28.0,
      minStockThreshold: 10.0,
      averageUnitPrice: 360.0,
      totalStockValue: 10080.0,
      storageLocation: 'Düngerschuppen Hünenheide',
    },
    {
      itemCode: 'INV-STROH-QUADER',
      name: 'Weizenstroh Quaderballen (Einstreu H4)',
      category: 'STRAW_BEDDING',
      unit: 'Ballen',
      currentQuantity: 380.0,
      minStockThreshold: 100.0,
      averageUnitPrice: 38.0,
      totalStockValue: 14440.0,
      storageLocation: 'Strohlagerhalle West',
    },
  ];

  await prisma.inventoryItem.deleteMany({});
  for (const inv of inventoryData) {
    await prisma.inventoryItem.create({ data: inv });
  }

  // 16. Invoices & Transactions
  const defaultAccount = accounts[0];

  // Invoices (Customer & Supplier)
  const invoicesData = [
    {
      invoiceNumber: 'RE-2026-0089',
      type: 'OUTGOING',
      customerId: customers[0].id, // Emsland Stärke
      issueDate: new Date('2026-09-28'),
      dueDate: new Date('2026-10-12'),
      status: 'PAID',
      subtotal: 84525.0,
      taxAmount: 9044.18,
      totalAmount: 93569.18,
      paidAmount: 93569.18,
      language: 'de',
      activity: 'POTATO_STORAGE',
      notes: 'Lieferung 735 Tonnen Industriekartoffeln Kampagne 2026',
      isDemo: true,
      lines: [
        { description: 'Industriekartoffeln Sorte Innovator (735 t)', quantity: 735.0, unit: 't', unitPrice: 115.0, taxRate: 10.7, taxAmount: 9044.18, subtotal: 84525.0, total: 93569.18 },
      ],
    },
    {
      invoiceNumber: 'RE-2026-0090',
      type: 'OUTGOING',
      customerId: customers[1].id, // Vion
      issueDate: new Date('2026-10-04'),
      dueDate: new Date('2026-10-11'),
      status: 'PARTIALLY_PAID',
      subtotal: 62450.0,
      taxAmount: 6682.15,
      totalAmount: 69132.15,
      paidAmount: 40000.0,
      language: 'de',
      activity: 'LIVESTOCK',
      notes: 'Schlachtschweine Durchgang H4 (350 Tiere)',
      isDemo: true,
      lines: [
        { description: 'Mastschweine Haltungsform 4 (350 Tiere, 33.750 kg SG)', quantity: 33750.0, unit: 'kg', unitPrice: 1.85, taxRate: 10.7, taxAmount: 6682.15, subtotal: 62450.0, total: 69132.15 },
      ],
    },
    {
      invoiceNumber: 'ER-2026-0412',
      type: 'INCOMING',
      supplierId: suppliers[0].id, // RWG Diepholz
      issueDate: new Date('2026-09-20'),
      dueDate: new Date('2026-10-20'),
      status: 'PAID',
      subtotal: 24800.0,
      taxAmount: 1736.0,
      totalAmount: 26536.0,
      paidAmount: 26536.0,
      language: 'de',
      activity: 'LIVESTOCK',
      notes: 'Lieferung 80 t Schweinemastfutter Vormast/Endmast',
      isDemo: true,
      lines: [
        { description: 'Schweinemastfutter Premium (80 t)', quantity: 80.0, unit: 't', unitPrice: 310.0, taxRate: 7.0, taxAmount: 1736.0, subtotal: 24800.0, total: 26536.0 },
      ],
    },
    {
      invoiceNumber: 'ER-2026-0415',
      type: 'INCOMING',
      supplierId: suppliers[3].id, // Schraders Diesel
      issueDate: new Date('2026-10-02'),
      dueDate: new Date('2026-10-16'),
      status: 'DRAFT',
      subtotal: 13800.0,
      taxAmount: 2622.0,
      totalAmount: 16422.0,
      paidAmount: 0.0,
      language: 'de',
      activity: 'MACHINERY',
      notes: 'Betankung Hofstelle 10.000 l Agrardiesel',
      isDemo: true,
      lines: [
        { description: 'Agrardiesel 10.000 l', quantity: 10000.0, unit: 'l', unitPrice: 1.38, taxRate: 19.0, taxAmount: 2622.0, subtotal: 13800.0, total: 16422.0 },
      ],
    },
  ];

  await prisma.payment.deleteMany({});
  await prisma.invoiceLine.deleteMany({});
  await prisma.invoice.deleteMany({});
  for (const inv of invoicesData) {
    const { lines, ...invData } = inv;
    const createdInvoice = await prisma.invoice.create({
      data: invData,
    });

    for (const l of lines) {
      await prisma.invoiceLine.create({
        data: {
          invoiceId: createdInvoice.id,
          ...l,
        },
      });
    }

    // Add corresponding payment if marked as paid or partially paid
    if (inv.paidAmount > 0) {
      await prisma.payment.create({
        data: {
          paymentNumber: `PAY-${createdInvoice.invoiceNumber}`,
          invoiceId: createdInvoice.id,
          accountId: defaultAccount.id,
          date: new Date(),
          amount: inv.paidAmount,
          paymentMethod: 'BANK_TRANSFER',
          reference: `Gutschrift/Zahlung ${createdInvoice.invoiceNumber}`,
          status: 'CONFIRMED',
        },
      });
    }
  }

  // 17. Transactions
  const transactionsData = [
    {
      transactionNumber: 'TRX-2026-10-001',
      type: 'REVENUE',
      date: new Date('2026-10-01'),
      categoryKey: 'REV_POTATO_SALES',
      description: 'Zahlung Emsland Stärke RE-2026-0089',
      amountNet: 84525.0,
      vatRate: 10.7,
      vatAmount: 9044.18,
      amountGross: 93569.18,
      accountId: defaultAccount.id,
      customerId: customers[0].id,
      activity: 'POTATO_STORAGE',
      paymentMethod: 'BANK_TRANSFER',
      status: 'CLEARED',
      isDemo: true,
    },
    {
      transactionNumber: 'TRX-2026-10-002',
      type: 'REVENUE',
      date: new Date('2026-10-05'),
      categoryKey: 'REV_PIG_SALES',
      description: 'Abschlagszahlung Vion Zucht- und Nutzvieh RE-2026-0090',
      amountNet: 36133.69,
      vatRate: 10.7,
      vatAmount: 3866.31,
      amountGross: 40000.0,
      accountId: defaultAccount.id,
      customerId: customers[1].id,
      activity: 'LIVESTOCK',
      paymentMethod: 'BANK_TRANSFER',
      status: 'CLEARED',
      isDemo: true,
    },
    {
      transactionNumber: 'TRX-2026-10-003',
      type: 'EXPENSE',
      date: new Date('2026-10-03'),
      categoryKey: 'EXP_FEED',
      description: 'Überweisung Futter RWG Diepholz ER-2026-0412',
      amountNet: 24800.0,
      vatRate: 7.0,
      vatAmount: 1736.0,
      amountGross: 26536.0,
      accountId: defaultAccount.id,
      supplierId: suppliers[0].id,
      activity: 'LIVESTOCK',
      paymentMethod: 'BANK_TRANSFER',
      status: 'CLEARED',
      isDemo: true,
    },
    {
      transactionNumber: 'TRX-2026-10-004',
      type: 'EXPENSE',
      date: new Date('2026-10-06'),
      categoryKey: 'EXP_VET',
      description: 'Tierarztpraxis Dr. Meyer Tiergesundheitskontrolle',
      amountNet: 2150.0,
      vatRate: 19.0,
      vatAmount: 408.5,
      amountGross: 2558.5,
      accountId: defaultAccount.id,
      supplierId: suppliers[2].id,
      activity: 'LIVESTOCK',
      paymentMethod: 'BANK_TRANSFER',
      status: 'CLEARED',
      isDemo: true,
    },
    {
      transactionNumber: 'TRX-2026-10-005',
      type: 'EXPENSE',
      date: new Date('2026-10-08'),
      categoryKey: 'EXP_MACHINERY_REPAIR',
      description: 'Grimme Damme Wartung SE 260 Roderkette & Bänder',
      amountNet: 3420.0,
      vatRate: 19.0,
      vatAmount: 649.8,
      amountGross: 4069.8,
      accountId: defaultAccount.id,
      supplierId: suppliers[4].id,
      activity: 'MACHINERY',
      paymentMethod: 'BANK_TRANSFER',
      status: 'CLEARED',
      isDemo: true,
    },
    {
      transactionNumber: 'TRX-2026-10-006',
      type: 'EXPENSE',
      date: new Date('2026-10-09'),
      categoryKey: 'EXP_WAGES',
      description: 'Monatsgehälter Mitarbeiter Landwirtschaft & Büro',
      amountNet: 22630.0,
      vatRate: 0.0,
      vatAmount: 0.0,
      amountGross: 22630.0,
      accountId: defaultAccount.id,
      activity: 'GENERAL',
      paymentMethod: 'BANK_TRANSFER',
      status: 'CLEARED',
      isDemo: true,
    },
  ];

  await prisma.transaction.deleteMany({});
  for (const trx of transactionsData) {
    await prisma.transaction.create({ data: trx });
  }

  // 18. Loans & Investments
  const investmentsData = [
    {
      title: 'Neubau Außenklimastall Haltungsform 4 (1.400 Plätze mit Kot-Harn-Trennung)',
      category: 'LIVESTOCK_FACILITY',
      amount: 680000.0,
      purchaseDate: new Date('2023-06-15'),
      downPayment: 180000.0,
      financingType: 'BANK_LOAN',
      depreciationYears: 20,
      salvageValue: 50000.0,
      notes: 'Investition in zukunftsfähiges Tierwohl mit automatischer Stroheinstreu.',
    },
    {
      title: 'Fendt 930 Vario Schlepper mit RTK-Lenksystem',
      category: 'MACHINERY',
      amount: 280000.0,
      purchaseDate: new Date('2023-02-18'),
      downPayment: 80000.0,
      financingType: 'BANK_LOAN',
      depreciationYears: 8,
      salvageValue: 120000.0,
      notes: 'Hauptschlepper für schwere Bodenbearbeitung und Aussaat.',
    },
  ];

  await prisma.investment.deleteMany({});
  for (const inv of investmentsData) {
    await prisma.investment.create({ data: inv });
  }

  const loansData = [
    {
      loanNumber: 'DARL-TIERWOHL-2023',
      lenderName: 'Landwirtschaftliche Rentenbank (über Volksbank Vechta)',
      principalAmount: 500000.0,
      interestRate: 2.85,
      startDate: new Date('2023-07-01'),
      endDate: new Date('2038-06-30'),
      termMonths: 180,
      monthlyPayment: 3418.0,
      remainingPrincipal: 418200.0,
      status: 'ACTIVE',
    },
    {
      loanNumber: 'DARL-FENDT-2023',
      lenderName: 'AGCO Finance / Fendt Finanzierung',
      principalAmount: 200000.0,
      interestRate: 3.40,
      startDate: new Date('2023-03-01'),
      endDate: new Date('2029-02-28'),
      termMonths: 72,
      monthlyPayment: 3074.0,
      remainingPrincipal: 114800.0,
      status: 'ACTIVE',
    },
  ];

  await prisma.loan.deleteMany({});
  for (const loan of loansData) {
    await prisma.loan.create({ data: loan });
  }

  // 19. Budget 2026
  await prisma.budget.deleteMany({});
  const budget2026 = await prisma.budget.create({
    data: {
      year: 2026,
      scenario: 'CENTRAL',
      name: 'Wirtschaftsplan Lampe Agrar 2026 (Zentral)',
      description: 'Budgetplanung für 440 ha Ackerbau und Schweinemast 3.400 Plätze',
      isCurrent: true,
      lines: {
        create: [
          { activity: 'POTATO_STORAGE', categoryKey: 'REV_POTATO_SALES', plannedRevenue: 510000.0, plannedExpense: 0.0, notes: 'Erwarteter Erlös Industriekartoffeln' },
          { activity: 'LIVESTOCK', categoryKey: 'REV_PIG_SALES', plannedRevenue: 680000.0, plannedExpense: 0.0, notes: 'Erlös Schweinemast' },
          { activity: 'CROPS', categoryKey: 'REV_GRAIN_SALES', plannedRevenue: 155000.0, plannedExpense: 0.0, notes: 'Getreidevermarktung' },
          { activity: 'LIVESTOCK', categoryKey: 'EXP_FEED', plannedRevenue: 0.0, plannedExpense: 385000.0, notes: 'Futterbedarf Schweine' },
          { activity: 'CROPS', categoryKey: 'EXP_FERTILIZER', plannedRevenue: 0.0, plannedExpense: 95000.0, notes: 'Mineraldünger Gesamtbedarf' },
          { activity: 'MACHINERY', categoryKey: 'EXP_FUEL', plannedRevenue: 0.0, plannedExpense: 48000.0, notes: 'Agrardiesel' },
          { activity: 'GENERAL', categoryKey: 'EXP_WAGES', plannedRevenue: 0.0, plannedExpense: 275000.0, notes: 'Jahreslohnsumme' },
        ],
      },
    },
  });

  console.log('✅ Seed completed successfully with realistic Lampe Agrar data!');
}

main()
  .catch((e) => {
    console.error('❌ Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
