'use client';

import React, { useEffect, useState } from 'react';
import { AppLayout } from '@/components/AppLayout';
import { useI18n } from '@/lib/i18n';
import {
  TrendingUp,
  BarChart3,
  Target,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Pencil,
  Trash2,
  Layers,
  Truck,
  Users,
  Wheat,
  PieChart,
  ShieldCheck,
  Percent,
  Download,
  Calendar
} from 'lucide-react';

type BudgetTab = 'GLOBAL' | 'PIGS' | 'MACHINERY' | 'PERSONNEL' | 'CROPS';

export default function BudgetsPage() {
  const { t, formatCurrency } = useI18n();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<BudgetTab>('GLOBAL');
  const [activeScenario, setActiveScenario] = useState<string>('CENTRAL');
  const [selectedYear, setSelectedYear] = useState<number>(2026);

  // Line modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingLine, setEditingLine] = useState<any>(null);
  const [lineForm, setLineForm] = useState({
    activity: 'LIVESTOCK',
    categoryKey: '',
    plannedRevenue: '',
    plannedExpense: '',
    quarter: '',
    notes: '',
  });

  const loadData = () => {
    fetch(`/api/budgets?year=${selectedYear}`)
      .then((res) => res.json())
      .then((json) => {
        setData(json);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, [selectedYear]);

  const currentBudget = data?.budgets?.find((b: any) => b.scenario === activeScenario) || data?.budgets?.[0];
  const allLines: any[] = currentBudget?.lines || [];

  // Filter lines by active tab
  const getLinesForTab = (tab: BudgetTab) => {
    switch (tab) {
      case 'PIGS':
        return allLines.filter((l) => l.activity === 'LIVESTOCK');
      case 'MACHINERY':
        return allLines.filter((l) => l.activity === 'MACHINERY');
      case 'PERSONNEL':
        return allLines.filter((l) => l.activity === 'GENERAL' || l.activity === 'ADMIN');
      case 'CROPS':
        return allLines.filter((l) => l.activity === 'CROPS' || l.activity === 'POTATO_STORAGE');
      case 'GLOBAL':
      default:
        return allLines;
    }
  };

  const lines = getLinesForTab(activeTab);

  // Calculate Atelier specific figures
  const getAtelierStats = (activityKey: 'LIVESTOCK' | 'MACHINERY' | 'PERSONNEL' | 'CROPS' | 'PIGS') => {
    let planRev = 0;
    let planExp = 0;

    let targetActivities: string[] = [];
    if (activityKey === 'PIGS' || activityKey === 'LIVESTOCK') targetActivities = ['LIVESTOCK'];
    else if (activityKey === 'MACHINERY') targetActivities = ['MACHINERY'];
    else if (activityKey === 'PERSONNEL') targetActivities = ['GENERAL', 'ADMIN'];
    else if (activityKey === 'CROPS') targetActivities = ['CROPS', 'POTATO_STORAGE'];

    allLines.filter((l) => targetActivities.includes(l.activity)).forEach((l) => {
      planRev += Number(l.plannedRevenue) || 0;
      planExp += Number(l.plannedExpense) || 0;
    });

    let actRev = 0;
    let actExp = 0;
    if (data?.actuals?.byActivity) {
      targetActivities.forEach((act) => {
        const item = data.actuals.byActivity[act];
        if (item) {
          actRev += item.revenue || 0;
          actExp += item.expense || 0;
        }
      });
    }

    const margin = planRev - planExp;
    const actualMargin = actRev - actExp;
    const consumptionRate = planExp > 0 ? (actExp / planExp) * 100 : 0;

    return {
      plannedRevenue: planRev,
      plannedExpense: planExp,
      plannedMargin: margin,
      actualRevenue: actRev,
      actualExpense: actExp,
      actualMargin,
      consumptionRate,
    };
  };

  // Global calculations
  let totalPlannedRevenue = 0;
  let totalPlannedExpense = 0;
  allLines.forEach((l: any) => {
    totalPlannedRevenue += Number(l.plannedRevenue) || 0;
    totalPlannedExpense += Number(l.plannedExpense) || 0;
  });

  const plannedMargin = totalPlannedRevenue - totalPlannedExpense;
  const actualRevenue = data?.actuals?.totalRevenue || 0;
  const actualExpense = data?.actuals?.totalExpense || 0;
  const actualMargin = data?.actuals?.netResult || 0;

  const revVarianceEuro = actualRevenue - totalPlannedRevenue;
  const revVariancePct = totalPlannedRevenue > 0 ? (revVarianceEuro / totalPlannedRevenue) * 100 : 0;

  const expVarianceEuro = totalPlannedExpense - actualExpense;
  const expVariancePct = totalPlannedExpense > 0 ? ((actualExpense - totalPlannedExpense) / totalPlannedExpense) * 100 : 0;

  const globalConsumptionRate = totalPlannedExpense > 0 ? (actualExpense / totalPlannedExpense) * 100 : 0;

  // Active Tab specific metrics
  let currentTabPlanRev = totalPlannedRevenue;
  let currentTabPlanExp = totalPlannedExpense;
  let currentTabActExp = actualExpense;
  let currentTabConsumption = globalConsumptionRate;

  if (activeTab === 'PIGS') {
    const s = getAtelierStats('PIGS');
    currentTabPlanRev = s.plannedRevenue;
    currentTabPlanExp = s.plannedExpense;
    currentTabActExp = s.actualExpense;
    currentTabConsumption = s.consumptionRate;
  } else if (activeTab === 'MACHINERY') {
    const s = getAtelierStats('MACHINERY');
    currentTabPlanRev = s.plannedRevenue;
    currentTabPlanExp = s.plannedExpense;
    currentTabActExp = s.actualExpense;
    currentTabConsumption = s.consumptionRate;
  } else if (activeTab === 'PERSONNEL') {
    const s = getAtelierStats('PERSONNEL');
    currentTabPlanRev = s.plannedRevenue;
    currentTabPlanExp = s.plannedExpense;
    currentTabActExp = s.actualExpense;
    currentTabConsumption = s.consumptionRate;
  } else if (activeTab === 'CROPS') {
    const s = getAtelierStats('CROPS');
    currentTabPlanRev = s.plannedRevenue;
    currentTabPlanExp = s.plannedExpense;
    currentTabActExp = s.actualExpense;
    currentTabConsumption = s.consumptionRate;
  }

  // Helper for budget status tag
  const getStatusBadge = (rate: number) => {
    if (rate <= 85) {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
          <CheckCircle2 className="w-3.5 h-3.5" />
          {t('budgets.statusOnTrack')} ({rate.toFixed(1)}%)
        </span>
      );
    } else if (rate <= 100) {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
          <AlertTriangle className="w-3.5 h-3.5" />
          {t('budgets.statusWarning')} ({rate.toFixed(1)}%)
        </span>
      );
    } else {
      return (
        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
          <AlertCircle className="w-3.5 h-3.5" />
          {t('budgets.statusExceeded')} ({rate.toFixed(1)}%)
        </span>
      );
    }
  };

  // Open Add modal with prefilled activity
  const handleOpenAdd = () => {
    let act = 'LIVESTOCK';
    if (activeTab === 'PIGS') act = 'LIVESTOCK';
    else if (activeTab === 'MACHINERY') act = 'MACHINERY';
    else if (activeTab === 'PERSONNEL') act = 'GENERAL';
    else if (activeTab === 'CROPS') act = 'CROPS';

    setLineForm({
      activity: act,
      categoryKey: '',
      plannedRevenue: '0',
      plannedExpense: '',
      quarter: '',
      notes: '',
    });
    setIsAddModalOpen(true);
  };

  // Open Edit modal
  const handleOpenEdit = (line: any) => {
    setEditingLine(line);
    setLineForm({
      activity: line.activity,
      categoryKey: line.categoryKey,
      plannedRevenue: String(line.plannedRevenue || 0),
      plannedExpense: String(line.plannedExpense || 0),
      quarter: line.quarter ? String(line.quarter) : '',
      notes: line.notes || '',
    });
    setIsEditModalOpen(true);
  };

  // Submit Add Line
  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/budgets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          budgetId: currentBudget?.id,
          year: selectedYear,
          scenario: activeScenario,
          activity: lineForm.activity,
          categoryKey: lineForm.categoryKey,
          plannedRevenue: Number(lineForm.plannedRevenue) || 0,
          plannedExpense: Number(lineForm.plannedExpense) || 0,
          quarter: lineForm.quarter ? Number(lineForm.quarter) : null,
          notes: lineForm.notes,
        }),
      });
      if (res.ok) {
        setIsAddModalOpen(false);
        loadData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Submit Edit Line
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLine) return;
    try {
      const res = await fetch('/api/budgets', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingLine.id,
          activity: lineForm.activity,
          categoryKey: lineForm.categoryKey,
          plannedRevenue: Number(lineForm.plannedRevenue) || 0,
          plannedExpense: Number(lineForm.plannedExpense) || 0,
          quarter: lineForm.quarter ? Number(lineForm.quarter) : null,
          notes: lineForm.notes,
        }),
      });
      if (res.ok) {
        setIsEditModalOpen(false);
        loadData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Delete Line
  const handleDeleteLine = async (id: string) => {
    if (!confirm(t('common.confirmDelete'))) return;
    try {
      const res = await fetch(`/api/budgets?id=${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        loadData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getAtelierLabel = (act: string) => {
    switch (act) {
      case 'LIVESTOCK':
        return '🐖 ' + t('budgets.atelierPigs');
      case 'MACHINERY':
        return '🚜 ' + t('budgets.atelierMachinery');
      case 'GENERAL':
      case 'ADMIN':
        return '👥 ' + t('budgets.atelierPersonnel');
      case 'CROPS':
        return '🌾 ' + t('budgets.atelierCrops');
      case 'POTATO_STORAGE':
        return '🥔 ' + t('budgets.atelierStorage');
      default:
        return act;
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#f0f9f3] text-[#65BC7B] shadow-sm">
              <PieChart className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#2A3035] tracking-tight">
                {t('budgets.title')}
              </h1>
              <p className="text-xs text-[#637381] mt-0.5">
                {t('budgets.subtitle')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="text-xs bg-white border border-[#e3ede5] rounded-full px-4 py-2 font-bold text-[#2A3035] focus:outline-none shadow-xs hover:border-[#65BC7B] transition"
            >
              <option value={2026}>{t('budgets.fiscalYear')} 2026</option>
              <option value={2025}>{t('budgets.fiscalYear')} 2025</option>
            </select>

            <button
              onClick={handleOpenAdd}
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#65BC7B] text-white text-xs font-bold hover:bg-[#52a366] transition shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>{t('budgets.addBudgetLine')}</span>
            </button>
          </div>
        </div>

        {/* 5 Distinct Atelier Tabs (Avada rounded-full pill buttons) */}
        <div className="bg-white p-2 rounded-3xl border border-[#e3ede5] shadow-sm flex flex-wrap gap-2">
          {[
            { id: 'GLOBAL', label: t('budgets.tabGlobal'), icon: Layers },
            { id: 'PIGS', label: t('budgets.tabPigs'), icon: Target },
            { id: 'MACHINERY', label: t('budgets.tabMachinery'), icon: Truck },
            { id: 'PERSONNEL', label: t('budgets.tabPersonnel'), icon: Users },
            { id: 'CROPS', label: t('budgets.tabCrops'), icon: Wheat },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as BudgetTab)}
                className={`flex-1 min-w-[170px] flex items-center justify-center gap-2 py-3 px-4 rounded-full text-xs font-bold transition ${
                  isActive
                    ? 'bg-[#65BC7B] text-white shadow-md'
                    : 'bg-[#f7fbf8] text-[#2A3035] hover:bg-[#f0f9f3] border border-transparent hover:border-[#65BC7B]/30'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-[#65BC7B]'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Scenario Switcher Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            {
              id: 'CENTRAL',
              title: t('budgets.central'),
              desc: t('budgets.descCentral'),
            },
            {
              id: 'OPTIMISTIC',
              title: t('budgets.optimistic'),
              desc: t('budgets.descOptimistic'),
            },
            {
              id: 'CAUTIOUS',
              title: t('budgets.cautious'),
              desc: t('budgets.descCautious'),
            },
          ].map((sc) => (
            <button
              key={sc.id}
              onClick={() => setActiveScenario(sc.id)}
              className={`p-4 rounded-3xl text-left transition border ${
                activeScenario === sc.id
                  ? 'bg-[#f0f9f3] border-[#65BC7B] shadow-sm'
                  : 'bg-white border-[#e3ede5] text-gray-600 hover:bg-[#f7fbf8]'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`text-xs font-bold ${activeScenario === sc.id ? 'text-[#2A3035]' : 'text-gray-700'}`}>
                  {sc.title}
                </span>
                {activeScenario === sc.id && (
                  <span className="w-2.5 h-2.5 rounded-full bg-[#65BC7B]" />
                )}
              </div>
              <p className="text-[11px] text-[#637381] mt-1 leading-snug">{sc.desc}</p>
            </button>
          ))}
        </div>

        {/* Active Tab KPI Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Planned Revenue */}
          <div className="bg-white p-5 rounded-3xl border border-[#e3ede5] shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#637381]">{t('budgets.plannedRevenues')}</span>
              <div className="w-8 h-8 rounded-full bg-[#f0f9f3] flex items-center justify-center text-[#65BC7B]">
                <ArrowUpRight className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-bold text-[#2A3035] mt-2">
              {formatCurrency(currentTabPlanRev)}
            </p>
            <span className="text-[10px] text-[#637381] mt-1 block">
              {t('budgets.targetRevenue')} ({activeScenario})
            </span>
          </div>

          {/* Planned Expenses */}
          <div className="bg-white p-5 rounded-3xl border border-[#e3ede5] shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#637381]">{t('budgets.plannedExpenses')}</span>
              <div className="w-8 h-8 rounded-full bg-rose-50 flex items-center justify-center text-rose-600">
                <ArrowDownRight className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-bold text-[#2A3035] mt-2">
              {formatCurrency(currentTabPlanExp)}
            </p>
            <span className="text-[10px] text-[#637381] mt-1 block">
              {t('budgets.maxExpense')}
            </span>
          </div>

          {/* Actual Expenses Booked */}
          <div className="bg-white p-5 rounded-3xl border border-[#e3ede5] shadow-xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#637381]">{t('budgets.actualExpenses')}</span>
              <div className="w-8 h-8 rounded-full bg-[#f7fbf8] flex items-center justify-center text-[#2A3035]">
                <BarChart3 className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl font-bold text-[#65BC7B] mt-2">
              {formatCurrency(currentTabActExp)}
            </p>
            <span className="text-[10px] text-[#637381] mt-1 block">
              {t('budgets.bookedExpenses')}
            </span>
          </div>

          {/* Budget Health / Status */}
          <div className="bg-white p-5 rounded-3xl border border-[#e3ede5] shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-[#637381]">{t('budgets.budgetStatus')}</span>
                <Percent className="w-4 h-4 text-[#65BC7B]" />
              </div>
              <div className="mt-2">
                {getStatusBadge(currentTabConsumption)}
              </div>
            </div>
            <div className="mt-3">
              <div className="w-full h-2.5 rounded-full bg-[#f0f9f3] overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${
                    currentTabConsumption <= 85
                      ? 'bg-[#65BC7B]'
                      : currentTabConsumption <= 100
                      ? 'bg-amber-500'
                      : 'bg-rose-500'
                  }`}
                  style={{ width: `${Math.min(currentTabConsumption, 100)}%` }}
                />
              </div>
              <span className="text-[10px] text-[#637381] mt-1 block">
                {currentTabConsumption.toFixed(1)}% {t('budgets.budgetConsumed')}
              </span>
            </div>
          </div>
        </div>

        {/* Global tab special view: 4 Atelier Cards side-by-side */}
        {activeTab === 'GLOBAL' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-[#2A3035]">
                {t('budgets.globalSummary')} — {t('budgets.branchComparison')}
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* 1. Schweinemast (Porcs) */}
              {(() => {
                const s = getAtelierStats('PIGS');
                return (
                  <div className="bg-white p-5 rounded-3xl border border-[#e3ede5] shadow-sm hover:shadow-md transition">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">🐖</span>
                        <span className="text-xs font-bold text-[#2A3035]">{t('budgets.tabPigs')}</span>
                      </div>
                      <span className="text-[10px] font-bold text-[#65BC7B]">
                        {s.consumptionRate.toFixed(0)}%
                      </span>
                    </div>
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between text-[#637381]">
                        <span>{t('budgets.planExpenses')}:</span>
                        <span className="font-semibold text-[#2A3035]">{formatCurrency(s.plannedExpense)}</span>
                      </div>
                      <div className="flex justify-between text-[#637381]">
                        <span>{t('budgets.actualExpensesLabel')}:</span>
                        <span className="font-bold text-[#65BC7B]">{formatCurrency(s.actualExpense)}</span>
                      </div>
                      <div className="flex justify-between text-[#637381]">
                        <span>{t('budgets.planRevenues')}:</span>
                        <span className="font-semibold text-[#2A3035]">{formatCurrency(s.plannedRevenue)}</span>
                      </div>
                    </div>
                    <div className="mt-3 pt-2.5 border-t border-gray-100 flex items-center justify-between">
                      <span className="text-[10px] text-gray-500">{t('common.status')}:</span>
                      {getStatusBadge(s.consumptionRate)}
                    </div>
                  </div>
                );
              })()}

              {/* 2. Fuhrpark & Traktoren (Tracteurs) */}
              {(() => {
                const s = getAtelierStats('MACHINERY');
                return (
                  <div className="bg-white p-5 rounded-3xl border border-[#e3ede5] shadow-sm hover:shadow-md transition">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">🚜</span>
                        <span className="text-xs font-bold text-[#2A3035]">{t('budgets.tabMachinery')}</span>
                      </div>
                      <span className="text-[10px] font-bold text-[#65BC7B]">
                        {s.consumptionRate.toFixed(0)}%
                      </span>
                    </div>
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between text-[#637381]">
                        <span>{t('budgets.planExpenses')}:</span>
                        <span className="font-semibold text-[#2A3035]">{formatCurrency(s.plannedExpense)}</span>
                      </div>
                      <div className="flex justify-between text-[#637381]">
                        <span>{t('budgets.actualExpensesLabel')}:</span>
                        <span className="font-bold text-[#65BC7B]">{formatCurrency(s.actualExpense)}</span>
                      </div>
                      <div className="flex justify-between text-[#637381]">
                        <span>AfA:</span>
                        <span className="font-semibold text-[#2A3035]">{t('budgets.machineryEquip')}</span>
                      </div>
                    </div>
                    <div className="mt-3 pt-2.5 border-t border-gray-100 flex items-center justify-between">
                      <span className="text-[10px] text-gray-500">{t('common.status')}:</span>
                      {getStatusBadge(s.consumptionRate)}
                    </div>
                  </div>
                );
              })()}

              {/* 3. Personal & Löhne (Salariés) */}
              {(() => {
                const s = getAtelierStats('PERSONNEL');
                return (
                  <div className="bg-white p-5 rounded-3xl border border-[#e3ede5] shadow-sm hover:shadow-md transition">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">👥</span>
                        <span className="text-xs font-bold text-[#2A3035]">{t('budgets.tabPersonnel')}</span>
                      </div>
                      <span className="text-[10px] font-bold text-[#65BC7B]">
                        {s.consumptionRate.toFixed(0)}%
                      </span>
                    </div>
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between text-[#637381]">
                        <span>{t('budgets.planExpenses')}:</span>
                        <span className="font-semibold text-[#2A3035]">{formatCurrency(s.plannedExpense)}</span>
                      </div>
                      <div className="flex justify-between text-[#637381]">
                        <span>{t('budgets.actualExpensesLabel')}:</span>
                        <span className="font-bold text-[#65BC7B]">{formatCurrency(s.actualExpense)}</span>
                      </div>
                      <div className="flex justify-between text-[#637381]">
                        <span>Team:</span>
                        <span className="font-semibold text-[#2A3035]">{t('budgets.staffCount')}</span>
                      </div>
                    </div>
                    <div className="mt-3 pt-2.5 border-t border-gray-100 flex items-center justify-between">
                      <span className="text-[10px] text-gray-500">{t('common.status')}:</span>
                      {getStatusBadge(s.consumptionRate)}
                    </div>
                  </div>
                );
              })()}

              {/* 4. Ackerbau & Kartoffeln (Grandes Cultures) */}
              {(() => {
                const s = getAtelierStats('CROPS');
                return (
                  <div className="bg-white p-5 rounded-3xl border border-[#e3ede5] shadow-sm hover:shadow-md transition">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">🌾</span>
                        <span className="text-xs font-bold text-[#2A3035]">{t('budgets.tabCrops')}</span>
                      </div>
                      <span className="text-[10px] font-bold text-[#65BC7B]">
                        {s.consumptionRate.toFixed(0)}%
                      </span>
                    </div>
                    <div className="space-y-1 text-xs">
                      <div className="flex justify-between text-[#637381]">
                        <span>{t('budgets.planExpenses')}:</span>
                        <span className="font-semibold text-[#2A3035]">{formatCurrency(s.plannedExpense)}</span>
                      </div>
                      <div className="flex justify-between text-[#637381]">
                        <span>{t('budgets.actualExpensesLabel')}:</span>
                        <span className="font-bold text-[#65BC7B]">{formatCurrency(s.actualExpense)}</span>
                      </div>
                      <div className="flex justify-between text-[#637381]">
                        <span>{t('budgets.planRevenues')}:</span>
                        <span className="font-semibold text-[#2A3035]">{formatCurrency(s.plannedRevenue)}</span>
                      </div>
                    </div>
                    <div className="mt-3 pt-2.5 border-t border-gray-100 flex items-center justify-between">
                      <span className="text-[10px] text-gray-500">{t('common.status')}:</span>
                      {getStatusBadge(s.consumptionRate)}
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        )}

        {/* Budget Lines Table with full CRUD (Add, Edit, Delete) */}
        <div className="bg-white rounded-3xl border border-[#e3ede5] shadow-sm overflow-hidden">
          <div className="p-5 border-b border-[#e3ede5] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h2 className="text-sm font-bold text-[#2A3035]">
                {activeTab === 'GLOBAL'
                  ? `${t('budgets.title')} (${activeScenario})`
                  : `${t('budgets.title')} - ${
                      activeTab === 'PIGS'
                        ? t('budgets.atelierPigs')
                        : activeTab === 'MACHINERY'
                        ? t('budgets.atelierMachinery')
                        : activeTab === 'PERSONNEL'
                        ? t('budgets.atelierPersonnel')
                        : t('budgets.atelierCrops')
                    } (${activeScenario})`}
              </h2>
              <p className="text-[11px] text-[#637381] mt-0.5">
                {t('budgets.tableSubtitle')}
              </p>
            </div>

            <button
              onClick={handleOpenAdd}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#f0f9f3] text-[#65BC7B] hover:bg-[#65BC7B] hover:text-white text-xs font-bold transition border border-[#65BC7B]/30"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{t('budgets.addBudgetLine')}</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#f7fbf8] text-[#637381] font-semibold border-b border-[#e3ede5]">
                <tr>
                  <th className="py-3 px-5">{t('budgets.atelierSelect')}</th>
                  <th className="py-3 px-4">{t('budgets.category')}</th>
                  <th className="py-3 px-4 text-center">{t('budgets.period')}</th>
                  <th className="py-3 px-4 text-right">{t('budgets.plannedRevenues')}</th>
                  <th className="py-3 px-4 text-right">{t('budgets.plannedExpenses')}</th>
                  <th className="py-3 px-4 text-right">{t('budgets.budgetBalance')}</th>
                  <th className="py-3 px-4">{t('budgets.notes')}</th>
                  <th className="py-3 px-5 text-center">{t('common.actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e3ede5]">
                {lines.length > 0 ? (
                  lines.map((l: any) => {
                    const rev = Number(l.plannedRevenue) || 0;
                    const exp = Number(l.plannedExpense) || 0;
                    const saldo = rev - exp;
                    return (
                      <tr key={l.id} className="hover:bg-[#f7fbf8] transition">
                        <td className="py-3.5 px-5 font-bold text-[#2A3035]">
                          {getAtelierLabel(l.activity)}
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-gray-800">
                          {l.categoryKey}
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-gray-100 text-gray-700">
                            {l.quarter ? `Q${l.quarter}` : t('budgets.fullYear')}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right font-bold text-[#65BC7B]">
                          {formatCurrency(rev)}
                        </td>
                        <td className="py-3.5 px-4 text-right font-semibold text-rose-600">
                          {formatCurrency(exp)}
                        </td>
                        <td
                          className={`py-3.5 px-4 text-right font-bold ${
                            saldo >= 0 ? 'text-[#65BC7B]' : 'text-gray-700'
                          }`}
                        >
                          {formatCurrency(saldo)}
                        </td>
                        <td className="py-3.5 px-4 text-gray-500 text-[11px] max-w-[200px] truncate">
                          {l.notes || '–'}
                        </td>
                        <td className="py-3.5 px-5 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => handleOpenEdit(l)}
                              className="p-1.5 rounded-full hover:bg-gray-100 text-gray-600 transition"
                              title={t('common.edit')}
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteLine(l.id)}
                              className="p-1.5 rounded-full hover:bg-rose-50 text-rose-600 transition"
                              title={t('common.delete')}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-gray-400">
                      {t('common.noData')}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal: Add Budget Line */}
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-[#e3ede5] space-y-4 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <h3 className="text-base font-bold text-[#2A3035]">
                  {t('budgets.addBudgetLine')}
                </h3>
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 font-bold"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleAddSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-[#2A3035] mb-1">
                    {t('budgets.atelierSelect')}
                  </label>
                  <select
                    value={lineForm.activity}
                    onChange={(e) => setLineForm({ ...lineForm, activity: e.target.value })}
                    className="w-full text-xs bg-white border border-[#e3ede5] rounded-xl px-3 py-2 text-[#2A3035] focus:outline-none focus:border-[#65BC7B]"
                  >
                    <option value="LIVESTOCK">{t('budgets.atelierPigs')}</option>
                    <option value="MACHINERY">{t('budgets.atelierMachinery')}</option>
                    <option value="GENERAL">{t('budgets.atelierPersonnel')}</option>
                    <option value="CROPS">{t('budgets.atelierCrops')}</option>
                    <option value="POTATO_STORAGE">{t('budgets.atelierStorage')}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#2A3035] mb-1">
                    {t('budgets.category')} *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={t('budgets.category')}
                    value={lineForm.categoryKey}
                    onChange={(e) => setLineForm({ ...lineForm, categoryKey: e.target.value })}
                    className="w-full text-xs bg-white border border-[#e3ede5] rounded-xl px-3 py-2 text-[#2A3035] focus:outline-none focus:border-[#65BC7B]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#2A3035] mb-1">
                      {t('budgets.plannedRevenues')} (€)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={lineForm.plannedRevenue}
                      onChange={(e) => setLineForm({ ...lineForm, plannedRevenue: e.target.value })}
                      className="w-full text-xs bg-white border border-[#e3ede5] rounded-xl px-3 py-2 text-[#2A3035] focus:outline-none focus:border-[#65BC7B]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#2A3035] mb-1">
                      {t('budgets.plannedExpenses')} (€) *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={lineForm.plannedExpense}
                      onChange={(e) => setLineForm({ ...lineForm, plannedExpense: e.target.value })}
                      className="w-full text-xs bg-white border border-[#e3ede5] rounded-xl px-3 py-2 text-[#2A3035] focus:outline-none focus:border-[#65BC7B]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#2A3035] mb-1">
                    {t('budgets.period')}
                  </label>
                  <select
                    value={lineForm.quarter}
                    onChange={(e) => setLineForm({ ...lineForm, quarter: e.target.value })}
                    className="w-full text-xs bg-white border border-[#e3ede5] rounded-xl px-3 py-2 text-[#2A3035] focus:outline-none focus:border-[#65BC7B]"
                  >
                    <option value="">{t('budgets.fullYear')}</option>
                    <option value="1">{t('budgets.quarter1')}</option>
                    <option value="2">{t('budgets.quarter2')}</option>
                    <option value="3">{t('budgets.quarter3')}</option>
                    <option value="4">{t('budgets.quarter4')}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#2A3035] mb-1">
                    {t('budgets.notes')}
                  </label>
                  <textarea
                    rows={2}
                    placeholder={t('budgets.notes')}
                    value={lineForm.notes}
                    onChange={(e) => setLineForm({ ...lineForm, notes: e.target.value })}
                    className="w-full text-xs bg-white border border-[#e3ede5] rounded-xl px-3 py-2 text-[#2A3035] focus:outline-none focus:border-[#65BC7B]"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-4 py-2 rounded-full border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-50 transition"
                  >
                    {t('common.cancel')}
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-full bg-[#65BC7B] text-white text-xs font-bold hover:bg-[#52a366] transition shadow-sm"
                  >
                    {t('common.save')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: Edit Budget Line */}
        {isEditModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-[#e3ede5] space-y-4 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <h3 className="text-base font-bold text-[#2A3035]">
                  {t('budgets.editBudgetLine')}
                </h3>
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 font-bold"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleEditSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-[#2A3035] mb-1">
                    {t('budgets.atelierSelect')}
                  </label>
                  <select
                    value={lineForm.activity}
                    onChange={(e) => setLineForm({ ...lineForm, activity: e.target.value })}
                    className="w-full text-xs bg-white border border-[#e3ede5] rounded-xl px-3 py-2 text-[#2A3035] focus:outline-none focus:border-[#65BC7B]"
                  >
                    <option value="LIVESTOCK">{t('budgets.atelierPigs')}</option>
                    <option value="MACHINERY">{t('budgets.atelierMachinery')}</option>
                    <option value="GENERAL">{t('budgets.atelierPersonnel')}</option>
                    <option value="CROPS">{t('budgets.atelierCrops')}</option>
                    <option value="POTATO_STORAGE">{t('budgets.atelierStorage')}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#2A3035] mb-1">
                    {t('budgets.category')} *
                  </label>
                  <input
                    type="text"
                    required
                    value={lineForm.categoryKey}
                    onChange={(e) => setLineForm({ ...lineForm, categoryKey: e.target.value })}
                    className="w-full text-xs bg-white border border-[#e3ede5] rounded-xl px-3 py-2 text-[#2A3035] focus:outline-none focus:border-[#65BC7B]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#2A3035] mb-1">
                      {t('budgets.plannedRevenues')} (€)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={lineForm.plannedRevenue}
                      onChange={(e) => setLineForm({ ...lineForm, plannedRevenue: e.target.value })}
                      className="w-full text-xs bg-white border border-[#e3ede5] rounded-xl px-3 py-2 text-[#2A3035] focus:outline-none focus:border-[#65BC7B]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#2A3035] mb-1">
                      {t('budgets.plannedExpenses')} (€) *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={lineForm.plannedExpense}
                      onChange={(e) => setLineForm({ ...lineForm, plannedExpense: e.target.value })}
                      className="w-full text-xs bg-white border border-[#e3ede5] rounded-xl px-3 py-2 text-[#2A3035] focus:outline-none focus:border-[#65BC7B]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#2A3035] mb-1">
                    {t('budgets.period')}
                  </label>
                  <select
                    value={lineForm.quarter}
                    onChange={(e) => setLineForm({ ...lineForm, quarter: e.target.value })}
                    className="w-full text-xs bg-white border border-[#e3ede5] rounded-xl px-3 py-2 text-[#2A3035] focus:outline-none focus:border-[#65BC7B]"
                  >
                    <option value="">{t('budgets.fullYear')}</option>
                    <option value="1">{t('budgets.quarter1')}</option>
                    <option value="2">{t('budgets.quarter2')}</option>
                    <option value="3">{t('budgets.quarter3')}</option>
                    <option value="4">{t('budgets.quarter4')}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#2A3035] mb-1">
                    {t('budgets.notes')}
                  </label>
                  <textarea
                    rows={2}
                    value={lineForm.notes}
                    onChange={(e) => setLineForm({ ...lineForm, notes: e.target.value })}
                    className="w-full text-xs bg-white border border-[#e3ede5] rounded-xl px-3 py-2 text-[#2A3035] focus:outline-none focus:border-[#65BC7B]"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                    className="px-4 py-2 rounded-full border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-50 transition"
                  >
                    {t('common.cancel')}
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-full bg-[#65BC7B] text-white text-xs font-bold hover:bg-[#52a366] transition shadow-sm"
                  >
                    {t('common.save')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
