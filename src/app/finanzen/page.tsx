'use client';

import React, { useEffect, useState } from 'react';
import { AppLayout } from '@/components/AppLayout';
import { useI18n } from '@/lib/i18n';
import {
  Landmark,
  Wallet,
  TrendingUp,
  TrendingDown,
  Upload,
  ArrowDownLeft,
  ArrowUpRight,
  ShieldCheck,
  CreditCard,
} from 'lucide-react';

export default function FinanzenPage() {
  const { t, formatCurrency, formatDate } = useI18n();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/dashboard')
      .then((res) => res.json())
      .then((json) => {
        setData(json);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-[#2A3035] tracking-tight">
              {t('banking.title')}
            </h1>
            <p className="text-xs text-[#637381] mt-0.5">
              {t('banking.subtitle')}
            </p>
          </div>
          <button
            onClick={() => alert('CSV-Bankauszug Import: Wählen Sie Ihre MT940 / CAMT.053 / CSV-Datei der Volksbank Vechta eG.')}
            className="flex items-center gap-1.5 px-4 py-2 bg-white border border-[#e3ede5] hover:bg-[#f0f9f3] text-[#65BC7B] text-xs font-bold rounded-full shadow-xs transition-colors"
          >
            <Upload className="w-4 h-4" />
            <span>{t('banking.importCsv')}</span>
          </button>
        </div>

        {/* Bank Accounts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {(data?.accounts || []).map((acc: any) => (
            <div
              key={acc.id}
              className="bg-white p-6 rounded-3xl border border-[#e3ede5] shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-full bg-[#f0f9f3] text-[#65BC7B] flex items-center justify-center">
                      <Landmark className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-bold text-[#2A3035]">{acc.name}</span>
                  </div>
                  {acc.isDefault && (
                    <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-[#f0f9f3] text-[#65BC7B] font-bold">
                      {t('banking.primaryAccount')}
                    </span>
                  )}
                </div>

                <div className="space-y-1 my-3 text-xs text-gray-500">
                  <p className="font-mono text-[11px]">{acc.iban || t('banking.cashDesk')}</p>
                  {acc.bic && <p className="text-[10px] text-gray-400">BIC: {acc.bic}</p>}
                </div>
              </div>

              <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                <span className="text-xs text-gray-400">{t('banking.currentBalance')}:</span>
                <span className="text-lg font-bold text-[#65BC7B]">
                  {formatCurrency(acc.currentBalance)}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Cashflow Forecast Details */}
        <div className="bg-white p-6 rounded-3xl border border-[#e3ede5] shadow-xs">
          <h2 className="text-sm font-bold text-[#2A3035] mb-4">
            {t('banking.forecastTitle')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 rounded-2xl bg-[#f7fbf8] border border-[#e3ede5]">
              <span className="text-xs font-bold text-[#2A3035]">{t('banking.days30')}</span>
              <div className="mt-3 space-y-1.5 text-xs">
                <div className="flex justify-between text-gray-600">
                  <span>{t('banking.startBalance')}:</span>
                  <span className="font-semibold">{formatCurrency(data?.forecast30?.startingCash || 0)}</span>
                </div>
                <div className="flex justify-between text-emerald-700">
                  <span>{t('banking.expectedInflows')}:</span>
                  <span className="font-semibold">+ {formatCurrency(data?.forecast30?.totalInflows || 0)}</span>
                </div>
                <div className="flex justify-between text-amber-700">
                  <span>{t('banking.plannedOutflows')}:</span>
                  <span className="font-semibold">- {formatCurrency(data?.forecast30?.totalOutflows || 0)}</span>
                </div>
                <div className="pt-2 border-t border-gray-200 flex justify-between font-bold text-[#65BC7B]">
                  <span>{t('banking.projectedBalance')}:</span>
                  <span>{formatCurrency(data?.forecast30?.projectedNetCash || 0)}</span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#f7fbf8] border border-[#e3ede5]">
              <span className="text-xs font-bold text-[#2A3035]">{t('banking.days60')}</span>
              <div className="mt-3 space-y-1.5 text-xs">
                <div className="flex justify-between text-gray-600">
                  <span>{t('banking.startBalance')}:</span>
                  <span className="font-semibold">{formatCurrency(data?.forecast60?.startingCash || 0)}</span>
                </div>
                <div className="flex justify-between text-emerald-700">
                  <span>{t('banking.expectedInflows')}:</span>
                  <span className="font-semibold">+ {formatCurrency(data?.forecast60?.totalInflows || 0)}</span>
                </div>
                <div className="flex justify-between text-amber-700">
                  <span>{t('banking.plannedOutflows')}:</span>
                  <span className="font-semibold">- {formatCurrency(data?.forecast60?.totalOutflows || 0)}</span>
                </div>
                <div className="pt-2 border-t border-gray-200 flex justify-between font-bold text-[#65BC7B]">
                  <span>{t('banking.projectedBalance')}:</span>
                  <span>{formatCurrency(data?.forecast60?.projectedNetCash || 0)}</span>
                </div>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-[#f7fbf8] border border-[#e3ede5]">
              <span className="text-xs font-bold text-[#2A3035]">{t('banking.days90')}</span>
              <div className="mt-3 space-y-1.5 text-xs">
                <div className="flex justify-between text-gray-600">
                  <span>{t('banking.startBalance')}:</span>
                  <span className="font-semibold">{formatCurrency(data?.forecast90?.startingCash || 0)}</span>
                </div>
                <div className="flex justify-between text-emerald-700">
                  <span>{t('banking.expectedInflows')}:</span>
                  <span className="font-semibold">+ {formatCurrency(data?.forecast90?.totalInflows || 0)}</span>
                </div>
                <div className="flex justify-between text-amber-700">
                  <span>{t('banking.plannedOutflows')}:</span>
                  <span className="font-semibold">- {formatCurrency(data?.forecast90?.totalOutflows || 0)}</span>
                </div>
                <div className="pt-2 border-t border-gray-200 flex justify-between font-bold text-[#65BC7B]">
                  <span>{t('banking.projectedBalance')}:</span>
                  <span>{formatCurrency(data?.forecast90?.projectedNetCash || 0)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
