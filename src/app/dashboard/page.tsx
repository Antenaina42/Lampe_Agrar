'use client';

import React, { useEffect, useState } from 'react';
import { AppLayout } from '@/components/AppLayout';
import { useI18n } from '@/lib/i18n';
import {
  Landmark,
  Wallet,
  TrendingUp,
  TrendingDown,
  Scale,
  FileCheck,
  FileClock,
  Calendar,
  AlertCircle,
  Wheat,
  Package,
  Tractor,
  ArrowUpRight,
  ArrowDownLeft,
  Sparkles,
  PieChart as PieChartIcon
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

export default function DashboardPage() {
  const { t, formatCurrency, formatNumber } = useI18n();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = () => {
    fetch('/api/dashboard')
      .then((res) => res.json())
      .then((json) => {
        setData(json);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchDashboardData();
    const handleRefresh = () => fetchDashboardData();
    window.addEventListener('lampe_booking_created', handleRefresh);
    return () => window.removeEventListener('lampe_booking_created', handleRefresh);
  }, []);

  const COLORS = ['#65BC7B', '#52a366', '#82c993', '#2A3035', '#d49b4b', '#637381'];

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Page Header with Avada Veterinarian styling */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#f0f9f3] text-[#65BC7B] shadow-sm">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#2A3035] tracking-tight">
                {t('dashboard.title')}
              </h1>
              <p className="text-xs text-[#637381] mt-0.5">
                {t('dashboard.subtitle')}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 self-start sm:self-auto text-xs bg-white px-4 py-2 rounded-full border border-[#e3ede5] shadow-xs text-[#2A3035] font-semibold">
            <Calendar className="w-4 h-4 text-[#65BC7B]" />
            <span>{t('budgets.fiscalYear')} 2026</span>
          </div>
        </div>

        {/* Top KPI Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Consolidated Bank Balance */}
          <div className="bg-white p-6 rounded-3xl border border-[#e3ede5] shadow-xs hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#637381]">
                {t('dashboard.consolidatedBankBalance')}
              </span>
              <div className="w-10 h-10 rounded-full bg-[#f0f9f3] text-[#65BC7B] flex items-center justify-center">
                <Landmark className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-2">
              <span className="text-2xl font-bold text-[#2A3035] tracking-tight">
                {formatCurrency(data?.consolidatedBalance || 0)}
              </span>
            </div>
            <div className="mt-3 flex items-center gap-1.5 text-[11px] text-[#65BC7B] font-bold">
              <span className="w-2 h-2 rounded-full bg-[#65BC7B]" />
              <span>{t('dashboard.bankAccountsDesc')}</span>
            </div>
          </div>

          {/* Available Cash / Liquidity */}
          <div className="bg-white p-6 rounded-3xl border border-[#e3ede5] shadow-xs hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#637381]">
                {t('dashboard.availableCash')}
              </span>
              <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center">
                <Wallet className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-2">
              <span className="text-2xl font-bold text-[#2A3035] tracking-tight">
                {formatCurrency(data?.availableCash || 0)}
              </span>
            </div>
            <div className="mt-3 flex items-center gap-1 text-[11px] text-[#637381] font-medium">
              <span>{t('dashboard.availableCash')}</span>
            </div>
          </div>

          {/* Revenue */}
          <div className="bg-white p-6 rounded-3xl border border-[#e3ede5] shadow-xs hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#637381]">
                {t('dashboard.periodRevenue')}
              </span>
              <div className="w-10 h-10 rounded-full bg-[#f0f9f3] text-[#65BC7B] flex items-center justify-center">
                <TrendingUp className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-2">
              <span className="text-2xl font-bold text-[#65BC7B] tracking-tight">
                {formatCurrency(data?.totalRevenue || 0)}
              </span>
            </div>
            <div className="mt-3 flex items-center gap-1 text-[11px] text-[#65BC7B] font-semibold">
              <ArrowDownLeft className="w-3.5 h-3.5" />
              <span>{t('dashboard.cropBatchesDesc')}</span>
            </div>
          </div>

          {/* Operating Result */}
          <div className="bg-white p-6 rounded-3xl border border-[#e3ede5] shadow-xs hover:shadow-md transition">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-[#637381]">
                {t('dashboard.operatingResult')}
              </span>
              <div className="w-10 h-10 rounded-full bg-amber-50 text-amber-700 flex items-center justify-center">
                <Scale className="w-5 h-5" />
              </div>
            </div>
            <div className="mt-2">
              <span className="text-2xl font-bold text-[#2A3035] tracking-tight">
                {formatCurrency(data?.operatingResult || 0)}
              </span>
            </div>
            <div className="mt-3 flex items-center gap-1 text-[11px] text-[#637381] font-medium">
              <span>{t('dashboard.operatingResult')}</span>
            </div>
          </div>
        </div>

        {/* Secondary KPI Cards: Invoices Due & Cash Forecasts */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Receivables & Payables */}
          <div className="bg-white p-6 rounded-3xl border border-[#e3ede5] shadow-sm flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-[#2A3035]">
                {t('dashboard.receivablesPayables')}
              </span>
              <FileCheck className="w-4 h-4 text-[#65BC7B]" />
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-2xl bg-[#f0f9f3] border border-[#65BC7B]/20">
                <span className="text-xs font-medium text-[#2A3035]">{t('dashboard.unpaidClientInvoices')}</span>
                <span className="text-xs font-bold text-[#65BC7B]">
                  {formatCurrency(data?.unpaidClientInvoices || 0)}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-2xl bg-amber-50/70 border border-amber-200">
                <span className="text-xs font-medium text-amber-900">{t('dashboard.unpaidSupplierInvoices')}</span>
                <span className="text-xs font-bold text-amber-700">
                  {formatCurrency(data?.unpaidSupplierInvoices || 0)}
                </span>
              </div>
            </div>
          </div>

          {/* Cashflow Forecast 30, 60, 90 Days */}
          <div className="bg-white p-6 rounded-3xl border border-[#e3ede5] shadow-sm md:col-span-2 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold text-[#2A3035]">
                {t('dashboard.cashflowForecast')}
              </span>
              <span className="text-[11px] text-[#637381] font-medium">
                {t('banking.forecastTitle')}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="p-4 rounded-2xl bg-[#f7fbf8] border border-[#e3ede5]">
                <p className="text-[11px] font-semibold text-[#637381]">{t('dashboard.cashForecast30')}</p>
                <p className="text-sm font-bold text-[#65BC7B] mt-1">
                  {formatCurrency(data?.forecast30?.projectedNetCash || 0)}
                </p>
                <span className="text-[10px] text-gray-400">{t('dashboard.balanceInDays')}</span>
              </div>
              <div className="p-4 rounded-2xl bg-[#f7fbf8] border border-[#e3ede5]">
                <p className="text-[11px] font-semibold text-[#637381]">{t('dashboard.cashForecast60')}</p>
                <p className="text-sm font-bold text-[#65BC7B] mt-1">
                  {formatCurrency(data?.forecast60?.projectedNetCash || 0)}
                </p>
                <span className="text-[10px] text-gray-400">{t('dashboard.balanceInDays')}</span>
              </div>
              <div className="p-4 rounded-2xl bg-[#f7fbf8] border border-[#e3ede5]">
                <p className="text-[11px] font-semibold text-[#637381]">{t('dashboard.cashForecast90')}</p>
                <p className="text-sm font-bold text-[#65BC7B] mt-1">
                  {formatCurrency(data?.forecast90?.projectedNetCash || 0)}
                </p>
                <span className="text-[10px] text-gray-400">{t('dashboard.balanceInDays')}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Row 1: 12-Month Cashflow & Expense Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 12-Month Bar Chart */}
          <div className="bg-white p-6 rounded-3xl border border-[#e3ede5] shadow-sm lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-bold text-[#2A3035]">
                {t('dashboard.revenueExpenses12M')}
              </h3>
              <span className="text-[11px] text-[#637381]">{t('navigation.buchungen')}</span>
            </div>
            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data?.cashflow12M || []} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <XAxis dataKey="month" stroke="#9ca3af" fontSize={11} tickLine={false} />
                  <YAxis stroke="#9ca3af" fontSize={11} tickLine={false} tickFormatter={(val) => `${val / 1000}k€`} />
                  <Tooltip
                    formatter={(val: any) => formatCurrency(Number(val))}
                    contentStyle={{ borderRadius: '16px', border: '1px solid #e3ede5', fontSize: '12px' }}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
                  <Bar dataKey="revenue" name={t('navigation.einnahmen')} fill="#65BC7B" radius={[6, 6, 0, 0]} />
                  <Bar dataKey="expenses" name={t('navigation.ausgaben')} fill="#2A3035" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Expense Breakdown Donut */}
          <div className="bg-white p-6 rounded-3xl border border-[#e3ede5] shadow-sm flex flex-col justify-between">
            <h3 className="text-xs font-bold text-[#2A3035] mb-2">
              {t('dashboard.expenseBreakdown')}
            </h3>
            <div className="h-48 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data?.expenseBreakdown || []}
                    dataKey="amount"
                    nameKey="category"
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={75}
                    paddingAngle={3}
                  >
                    {(data?.expenseBreakdown || []).map((_: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(val: any) => formatCurrency(Number(val))} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-2 mt-2">
              {(data?.expenseBreakdown || []).slice(0, 3).map((item: any, idx: number) => (
                <div key={idx} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                    <span className="text-[#637381] truncate max-w-[140px]">{item.category}</span>
                  </div>
                  <span className="font-bold text-[#2A3035]">{formatCurrency(item.amount)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Agricultural Branch Performance Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Crops Margin Per Hectare */}
          <div className="bg-white p-6 rounded-3xl border border-[#e3ede5] shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Wheat className="w-5 h-5 text-[#65BC7B]" />
                <h3 className="text-xs font-bold text-[#2A3035]">
                  {t('dashboard.profitabilityPerHa')}
                </h3>
              </div>
              <span className="text-[11px] font-medium text-[#637381]">{t('crops.season')} 2026</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-gray-100 text-[#637381]">
                    <th className="pb-2 font-semibold">{t('crops.crop')} / {t('crops.fieldPlot')}</th>
                    <th className="pb-2 font-semibold text-right">{t('crops.area')}</th>
                    <th className="pb-2 font-semibold text-right">{t('crops.grossMargin')}/ha</th>
                    <th className="pb-2 font-semibold text-right">{t('common.total')} (€)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e3ede5]">
                  {(data?.cropProfitability || []).map((cp: any, idx: number) => (
                    <tr key={idx} className="hover:bg-[#f7fbf8] transition">
                      <td className="py-3 font-semibold text-[#2A3035]">
                        {cp.cropName} <span className="text-[10px] text-[#637381] font-normal">({cp.fieldName})</span>
                      </td>
                      <td className="py-3 text-right text-[#637381]">{cp.areaHa} ha</td>
                      <td className="py-3 text-right font-bold text-[#65BC7B]">
                        {formatCurrency(cp.grossMarginPerHa)}
                      </td>
                      <td className="py-3 text-right text-[#2A3035] font-bold">
                        {formatCurrency(cp.totalMargin)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pig Batches Performance */}
          <div className="bg-white p-6 rounded-3xl border border-[#e3ede5] shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <span className="text-xl">🐖</span>
                <h3 className="text-xs font-bold text-[#2A3035]">
                  {t('dashboard.pigBatchProfitability')}
                </h3>
              </div>
              <span className="text-[11px] font-medium text-[#637381]">{t('dashboard.pigBatchesDesc')}</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-gray-100 text-[#637381]">
                    <th className="pb-2 font-semibold">{t('pigFarming.batchNumber')}</th>
                    <th className="pb-2 font-semibold text-right">{t('pigFarming.totalPigs')}</th>
                    <th className="pb-2 font-semibold text-right">{t('pigFarming.mortalityRate')}</th>
                    <th className="pb-2 font-semibold text-right">{t('common.status') || 'Status'}</th>
                    <th className="pb-2 font-semibold text-right">{t('pigFarming.grossMargin')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e3ede5]">
                  {(data?.pigBatchProfitability || []).map((pb: any, idx: number) => (
                    <tr key={idx} className="hover:bg-[#f7fbf8] transition">
                      <td className="py-3 font-semibold text-[#2A3035]">
                        {pb.batchNumber}
                        <p className="text-[10px] text-[#637381] font-normal truncate max-w-[130px]">
                          {pb.barnName}
                        </p>
                      </td>
                      <td className="py-3 text-right text-[#637381]">{pb.pigCount}</td>
                      <td className="py-3 text-right text-rose-600 font-semibold">{pb.mortalityCount}</td>
                      <td className="py-3 text-right">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                            pb.status === 'ACTIVE'
                              ? 'bg-[#f0f9f3] text-[#65BC7B] border border-[#65BC7B]/20'
                              : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {pb.status}
                        </span>
                      </td>
                      <td className="py-3 text-right font-bold text-[#65BC7B]">
                        {formatCurrency(pb.grossMargin)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
