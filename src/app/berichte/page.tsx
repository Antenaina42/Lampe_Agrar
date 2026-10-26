'use client';

import React, { useEffect, useState } from 'react';
import { AppLayout } from '@/components/AppLayout';
import { useI18n } from '@/lib/i18n';
import { generateFinancialReportPdf } from '@/lib/pdf-generator';
import { FileText, Download, FileSpreadsheet, ShieldAlert, CheckCircle2, Globe, TrendingUp, DollarSign } from 'lucide-react';

export default function BerichtePage() {
  const { t, formatCurrency } = useI18n();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedYear, setSelectedYear] = useState<number>(2026);
  const [pdfLang, setPdfLang] = useState<'de' | 'en' | 'fr'>('de');

  const loadData = () => {
    fetch(`/api/reports?year=${selectedYear}`)
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

  const handleDownloadDatev = () => {
    window.open(`/api/reports?export=DATEV&year=${selectedYear}`, '_blank');
  };

  const handleDownloadExcel = () => {
    window.open(`/api/reports?export=EXCEL&year=${selectedYear}`, '_blank');
  };

  const handleDownloadPdf = () => {
    if (!data?.bwa) return;
    const doc = generateFinancialReportPdf(
      {
        year: selectedYear,
        totalRevenues: data.bwa.totalRevenues,
        materialCosts: data.bwa.materialCosts,
        grossMargin: data.bwa.grossMargin,
        personnelCosts: data.bwa.annualPersonnelCost,
        otherExpenses: data.bwa.otherExpenses,
        ebitda: data.bwa.ebitda,
        interestCosts: data.bwa.annualInterest,
        netResult: data.bwa.preTaxResult,
      },
      pdfLang
    );
    doc.save(`Lampe_Agrar_BWA_${selectedYear}_${pdfLang.toUpperCase()}.pdf`);
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-[#212921] tracking-tight">
              {t('reports.title')}
            </h1>
            <p className="text-xs text-[#5c6e5c] mt-0.5">
              {t('reports.subtitle')}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="text-xs bg-white border border-[#e2e8df] rounded-xl px-3 py-1.5 font-bold text-gray-700 focus:outline-none"
            >
              <option value={2026}>Wirtschaftsjahr 2026</option>
              <option value={2025}>Wirtschaftsjahr 2025</option>
            </select>
          </div>
        </div>

        {/* Tax Consultant Legal Notice */}
        <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/80 flex items-start gap-3">
          <ShieldAlert className="w-4 h-4 text-amber-700 mt-0.5 shrink-0" />
          <p className="text-xs text-amber-900 leading-relaxed font-medium">
            {t('reports.taxNotice')}
          </p>
        </div>

        {/* Export Action Card */}
        <div className="bg-white p-5 rounded-2xl border border-[#e2e8df] shadow-sm">
          <h2 className="text-sm font-bold text-gray-800 mb-3">Steuerberater- & Finanzexporte</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* DATEV */}
            <button
              onClick={handleDownloadDatev}
              className="p-3.5 rounded-xl border border-[#e5ebe2] bg-[#f8faf7] hover:bg-emerald-50 hover:border-[#226c3d] text-left transition flex items-center justify-between group"
            >
              <div>
                <span className="block text-xs font-bold text-gray-800 group-hover:text-[#226c3d]">
                  {t('reports.exportDatev')}
                </span>
                <span className="block text-[10px] text-gray-400 mt-0.5">
                  Standard-Buchungsstapel (SKR 14 Agrar)
                </span>
              </div>
              <Download className="w-4 h-4 text-gray-400 group-hover:text-[#226c3d]" />
            </button>

            {/* Excel */}
            <button
              onClick={handleDownloadExcel}
              className="p-3.5 rounded-xl border border-[#e5ebe2] bg-[#f8faf7] hover:bg-emerald-50 hover:border-[#226c3d] text-left transition flex items-center justify-between group"
            >
              <div>
                <span className="block text-xs font-bold text-gray-800 group-hover:text-[#226c3d]">
                  {t('reports.exportExcel')}
                </span>
                <span className="block text-[10px] text-gray-400 mt-0.5">
                  Vollständige Arbeitsmappe (.xlsx)
                </span>
              </div>
              <FileSpreadsheet className="w-4 h-4 text-gray-400 group-hover:text-[#226c3d]" />
            </button>

            {/* PDF with Language Selector */}
            <div className="p-3.5 rounded-xl border border-[#e5ebe2] bg-[#f8faf7] flex flex-col justify-between">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-gray-800">
                  {t('reports.exportPdf')}
                </span>
                <select
                  value={pdfLang}
                  onChange={(e) => setPdfLang(e.target.value as any)}
                  className="text-[10px] bg-white border border-gray-300 rounded px-1.5 py-0.5 font-bold text-gray-700"
                >
                  <option value="de">Deutsch (DE)</option>
                  <option value="en">English (EN)</option>
                  <option value="fr">Français (FR)</option>
                </select>
              </div>
              <button
                onClick={handleDownloadPdf}
                className="w-full mt-1 px-3 py-1.5 rounded-lg bg-[#226c3d] text-white text-xs font-bold hover:bg-[#1a5530] transition flex items-center justify-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>PDF generieren</span>
              </button>
            </div>
          </div>
        </div>

        {/* BWA Section */}
        {data?.bwa && (
          <div className="bg-white rounded-2xl border border-[#e2e8df] shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-sm font-bold text-gray-800">
                Betriebswirtschaftliche Auswertung (BWA {selectedYear})
              </h2>
              <span className="text-xs text-gray-400">
                Basierend auf {data.transactionCount} Buchungssätzen
              </span>
            </div>
            <div className="divide-y divide-gray-100 text-xs">
              <div className="p-3.5 flex justify-between bg-emerald-50/40 font-bold text-gray-800">
                <span>1. Umsatzerlöse & Gesamtleistung</span>
                <span className="text-[#226c3d]">{formatCurrency(data.bwa.totalRevenues)}</span>
              </div>
              <div className="px-6 py-2 flex justify-between text-gray-600 text-[11px]">
                <span>- davon Kartoffelanbau & Hallenlager</span>
                <span>{formatCurrency(data.bwa.revenuePotatoes)}</span>
              </div>
              <div className="px-6 py-2 flex justify-between text-gray-600 text-[11px]">
                <span>- davon Schweinemast (H4 & H2)</span>
                <span>{formatCurrency(data.bwa.revenuePigs)}</span>
              </div>
              <div className="px-6 py-2 flex justify-between text-gray-600 text-[11px]">
                <span>- davon Ackerbau (Getreide, Raps, Zuckerrüben, Mais)</span>
                <span>{formatCurrency(data.bwa.revenueCrops)}</span>
              </div>

              <div className="p-3.5 flex justify-between text-gray-700 font-semibold">
                <span>2. Materialaufwand & Wareneinsatz (Futter, Saatgut, Dünger, PSM, Diesel)</span>
                <span className="text-rose-700">- {formatCurrency(data.bwa.materialCosts)}</span>
              </div>

              <div className="p-3.5 flex justify-between bg-gray-50/80 font-bold text-gray-900">
                <span>= Rohertrag (Deckungsbeitrag I)</span>
                <span className="text-[#226c3d]">{formatCurrency(data.bwa.grossMargin)}</span>
              </div>

              <div className="p-3.5 flex justify-between text-gray-700 font-semibold">
                <span>3. Personalaufwand (Mitarbeiter & Betriebsleitung)</span>
                <span className="text-rose-700">- {formatCurrency(data.bwa.annualPersonnelCost)}</span>
              </div>

              <div className="p-3.5 flex justify-between text-gray-700 font-semibold">
                <span>4. Sonstige betriebliche Aufwendungen (Maschinenreparaturen, Pacht, Versicherung)</span>
                <span className="text-rose-700">- {formatCurrency(data.bwa.otherExpenses)}</span>
              </div>

              <div className="p-3.5 flex justify-between bg-emerald-50/80 font-bold text-gray-900">
                <span>= Betriebsergebnis vor Zinsen & Steuern (EBITDA)</span>
                <span className="text-emerald-800 text-sm">{formatCurrency(data.bwa.ebitda)}</span>
              </div>

              <div className="p-3.5 flex justify-between text-gray-700 font-semibold">
                <span>5. Zinsaufwand (Darlehen & Kredite)</span>
                <span className="text-rose-700">- {formatCurrency(data.bwa.annualInterest)}</span>
              </div>

              <div className="p-4 flex justify-between bg-[#226c3d]/10 font-bold text-gray-900 text-sm">
                <span>= Vorläufiges Betriebsergebnis vor Steuern</span>
                <span className="text-[#226c3d] font-mono text-base">{formatCurrency(data.bwa.preTaxResult)}</span>
              </div>
            </div>
          </div>
        )}

        {/* VAT Section */}
        {data?.vat && (
          <div className="bg-white rounded-2xl border border-[#e2e8df] shadow-sm p-5">
            <h2 className="text-sm font-bold text-gray-800 mb-3">
              {t('reports.vatSummary')}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3.5 rounded-xl bg-[#f8faf7] border border-[#e5ebe2]">
                <span className="text-[11px] text-gray-500 font-medium">Umsatzsteuer gesamt (Rechnungen)</span>
                <p className="text-base font-bold text-gray-800 mt-1">{formatCurrency(data.vat.totalVatPayable)}</p>
                <span className="text-[10px] text-gray-400">19 %, 7 % und Agrarpauschalierung</span>
              </div>
              <div className="p-3.5 rounded-xl bg-[#f8faf7] border border-[#e5ebe2]">
                <span className="text-[11px] text-gray-500 font-medium">Abziehbare Vorsteuer (Eingänge)</span>
                <p className="text-base font-bold text-emerald-700 mt-1">{formatCurrency(data.vat.vatInputDeductible)}</p>
                <span className="text-[10px] text-gray-400">Vorsteuer aus Betriebsausgaben</span>
              </div>
              <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-200">
                <span className="text-[11px] text-emerald-800 font-bold">Verbleibende Zahllast</span>
                <p className="text-base font-bold text-[#226c3d] mt-1">{formatCurrency(data.vat.netVatPayable)}</p>
                <span className="text-[10px] text-emerald-700">Abführung an Finanzamt Diepholz</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
