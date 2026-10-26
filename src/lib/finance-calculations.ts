/**
 * LAMPE AGRAR FINANZMANAGER
 * Centralized, deterministic agricultural financial calculations
 * Designed with precise Decimal/Number arithmetic avoiding floating point discrepancies.
 */

export function roundCurrency(value: number): number {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

export interface BankAccountBalance {
  id: string;
  name: string;
  currentBalance: number;
}

export function calculateConsolidatedBalance(accounts: BankAccountBalance[]): number {
  const sum = accounts.reduce((acc, account) => acc + (Number(account.currentBalance) || 0), 0);
  return roundCurrency(sum);
}

export function calculateOperatingMargin(revenueNet: number, expensesNet: number): {
  marginAmount: number;
  marginPercent: number;
} {
  const marginAmount = roundCurrency(revenueNet - expensesNet);
  const marginPercent = revenueNet > 0 ? roundCurrency((marginAmount / revenueNet) * 100) : 0;
  return { marginAmount, marginPercent };
}

export interface CropGrossMarginParams {
  areaHa: number;
  harvestTons: number;
  salePricePerTon: number;
  directCosts: number; // seeds, fertilizers, pesticides, fuel, contractors
}

export function calculateCropGrossMargin(params: CropGrossMarginParams): {
  totalRevenue: number;
  yieldPerHa: number;
  revenuePerHa: number;
  costPerHa: number;
  grossMarginTotal: number;
  grossMarginPerHa: number;
  costPerTon: number;
} {
  const areaHa = params.areaHa > 0 ? params.areaHa : 1;
  const totalRevenue = roundCurrency(params.harvestTons * params.salePricePerTon);
  const yieldPerHa = roundCurrency(params.harvestTons / areaHa);
  const revenuePerHa = roundCurrency(totalRevenue / areaHa);
  const costPerHa = roundCurrency(params.directCosts / areaHa);
  const grossMarginTotal = roundCurrency(totalRevenue - params.directCosts);
  const grossMarginPerHa = roundCurrency(grossMarginTotal / areaHa);
  const costPerTon = params.harvestTons > 0 ? roundCurrency(params.directCosts / params.harvestTons) : 0;

  return {
    totalRevenue,
    yieldPerHa,
    revenuePerHa,
    costPerHa,
    grossMarginTotal,
    grossMarginPerHa,
    costPerTon,
  };
}

export interface PigBatchMarginParams {
  initialPigCount: number;
  soldPigCount: number;
  mortalityCount: number;
  totalWeightKg: number;
  salePricePerKg: number;
  pigletPurchaseCost: number;
  feedCost: number;
  vetCost: number;
  strawBeddingCost: number;
  energyAndBarnCost: number;
}

export function calculatePigBatchMargin(params: PigBatchMarginParams): {
  totalRevenue: number;
  totalDirectCosts: number;
  grossMarginTotal: number;
  grossMarginPerSoldPig: number;
  costPerSoldPig: number;
  costPerKgProduced: number;
  mortalityRatePercent: number;
  avgWeightPerPig: number;
} {
  const soldPigs = params.soldPigCount > 0 ? params.soldPigCount : 1;
  const totalDirectCosts = roundCurrency(
    params.pigletPurchaseCost +
      params.feedCost +
      params.vetCost +
      params.strawBeddingCost +
      params.energyAndBarnCost
  );

  const totalRevenue = roundCurrency(params.totalWeightKg * params.salePricePerKg);
  const grossMarginTotal = roundCurrency(totalRevenue - totalDirectCosts);
  const grossMarginPerSoldPig = roundCurrency(grossMarginTotal / soldPigs);
  const costPerSoldPig = roundCurrency(totalDirectCosts / soldPigs);
  const costPerKgProduced =
    params.totalWeightKg > 0 ? roundCurrency(totalDirectCosts / params.totalWeightKg) : 0;

  const totalStarted = params.initialPigCount > 0 ? params.initialPigCount : soldPigs;
  const mortalityRatePercent = roundCurrency((params.mortalityCount / totalStarted) * 100);
  const avgWeightPerPig = roundCurrency(params.totalWeightKg / soldPigs);

  return {
    totalRevenue,
    totalDirectCosts,
    grossMarginTotal,
    grossMarginPerSoldPig,
    costPerSoldPig,
    costPerKgProduced,
    mortalityRatePercent,
    avgWeightPerPig,
  };
}

export interface MachineCostParams {
  purchasePrice: number;
  residualValue: number;
  depreciationYears: number;
  annualInsurance: number;
  annualMaintenance: number;
  annualOperatingHours: number;
  fuelConsumptionLitersPerHour: number;
  fuelPricePerLiter: number;
}

export function calculateMachineHourlyCost(params: MachineCostParams): {
  annualDepreciation: number;
  annualFixedCost: number;
  fuelCostPerHour: number;
  totalCostPerHour: number;
} {
  const years = params.depreciationYears > 0 ? params.depreciationYears : 8;
  const annualDepreciation = roundCurrency((params.purchasePrice - params.residualValue) / years);
  const annualFixedCost = roundCurrency(annualDepreciation + params.annualInsurance + params.annualMaintenance);

  const hours = params.annualOperatingHours > 0 ? params.annualOperatingHours : 400;
  const fixedCostPerHour = roundCurrency(annualFixedCost / hours);
  const fuelCostPerHour = roundCurrency(
    params.fuelConsumptionLitersPerHour * params.fuelPricePerLiter
  );
  const totalCostPerHour = roundCurrency(fixedCostPerHour + fuelCostPerHour);

  return {
    annualDepreciation,
    annualFixedCost,
    fuelCostPerHour,
    totalCostPerHour,
  };
}

export interface CashForecastParams {
  currentCash: number;
  receivablesDueInPeriod: number; // confirmed client payments expected
  payablesDueInPeriod: number; // supplier bills to pay
  loanPaymentsInPeriod: number; // annuities
  wagesInPeriod: number; // monthly employee costs
  projectedOtherRevenues: number;
  projectedOtherExpenses: number;
}

export function calculateCashflowForecast(params: CashForecastParams): {
  startingCash: number;
  totalInflows: number;
  totalOutflows: number;
  projectedNetCash: number;
  cashSurplusOrDeficit: number;
} {
  const totalInflows = roundCurrency(params.receivablesDueInPeriod + params.projectedOtherRevenues);
  const totalOutflows = roundCurrency(
    params.payablesDueInPeriod +
      params.loanPaymentsInPeriod +
      params.wagesInPeriod +
      params.projectedOtherExpenses
  );

  const projectedNetCash = roundCurrency(params.currentCash + totalInflows - totalOutflows);
  const cashSurplusOrDeficit = roundCurrency(totalInflows - totalOutflows);

  return {
    startingCash: params.currentCash,
    totalInflows,
    totalOutflows,
    projectedNetCash,
    cashSurplusOrDeficit,
  };
}
