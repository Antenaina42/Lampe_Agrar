'use client';

import React, { useEffect, useState } from 'react';
import { AppLayout } from '@/components/AppLayout';
import { useI18n } from '@/lib/i18n';
import {
  TrendingUp,
  Download,
  Filter,
  Search,
  PlusCircle,
  ArrowDownLeft,
  Calendar,
} from 'lucide-react';
import { exportToCsv, exportToExcel } from '@/lib/export-utils';

export default function EinnahmenPage() {
  const { t, formatCurrency, formatDate } = useI18n();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [activityFilter, setActivityFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchRevenues = () => {
    let url = '/api/transactions?type=REVENUE';
    if (activityFilter !== 'ALL') url += `&activity=${activityFilter}`;
    if (searchTerm) url += `&search=${encodeURIComponent(searchTerm)}`;

    fetch(url)
      .then((res) => res.json())
      .then((json) => {
        setTransactions(json.transactions || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchRevenues();
  }, [activityFilter, searchTerm]);

  const handleExportCsv = () => {
    const headers = ['Buchung-Nr', 'Datum', 'Bezeichnung', 'Betriebszweig', 'Netto (€)', 'USt %', 'Brutto (€)', 'Konto'];
    const rows = transactions.map((t) => [
      t.transactionNumber,
      formatDate(t.date),
      t.description,
      t.activity,
      t.amountNet,
      t.vatRate,
      t.amountGross,
      t.account?.name || '',
    ]);
    exportToCsv('Lampe-Agrar-Einnahmen', headers, rows);
  };

  const handleExportExcel = () => {
    const headers = ['Buchung-Nr', 'Datum', 'Bezeichnung', 'Betriebszweig', 'Netto (€)', 'USt %', 'Brutto (€)', 'Konto'];
    const rows = transactions.map((t) => [
      t.transactionNumber,
      formatDate(t.date),
      t.description,
      t.activity,
      t.amountNet,
      t.vatRate,
      t.amountGross,
      t.account?.name || '',
    ]);
    exportToExcel('Lampe-Agrar-Einnahmen', 'Einnahmen', headers, rows);
  };

  const totalGross = transactions.reduce((sum, t) => sum + Number(t.amountGross), 0);
  const totalNet = transactions.reduce((sum, t) => sum + Number(t.amountNet), 0);

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-[#212921] tracking-tight">
              {t('revenues.title')}
            </h1>
            <p className="text-xs text-[#5c6e5c] mt-0.5">
              {t('revenues.subtitle')}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportCsv}
              className="flex items-center gap-1.5 px-3 py-2 bg-white border border-[#dce3da] hover:bg-[#f2f7f1] text-gray-700 text-xs font-semibold rounded-xl shadow-sm transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-gray-500" />
              <span>CSV</span>
            </button>
            <button
              onClick={handleExportExcel}
              className="flex items-center gap-1.5 px-3 py-2 bg-white border border-[#dce3da] hover:bg-[#f2f7f1] text-[#226c3d] text-xs font-bold rounded-xl shadow-sm transition-colors"
            >
              <Download className="w-3.5 h-3.5 text-[#226c3d]" />
              <span>Excel</span>
            </button>
          </div>
        </div>

        {/* Summary Badges */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-2xl border border-[#e2e8df] shadow-sm">
            <span className="text-xs font-medium text-gray-500">Gesamterlöse (Netto)</span>
            <p className="text-xl font-bold text-[#226c3d] mt-1">{formatCurrency(totalNet)}</p>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-[#e2e8df] shadow-sm">
            <span className="text-xs font-medium text-gray-500">Gesamteinnahmen (Brutto)</span>
            <p className="text-xl font-bold text-gray-800 mt-1">{formatCurrency(totalGross)}</p>
          </div>
          <div className="bg-white p-4 rounded-2xl border border-[#e2e8df] shadow-sm">
            <span className="text-xs font-medium text-gray-500">Anzahl Buchungen</span>
            <p className="text-xl font-bold text-gray-800 mt-1">{transactions.length}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 bg-white p-3.5 rounded-2xl border border-[#e2e8df] shadow-sm">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder={t('common.search')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full text-xs pl-9 pr-3 py-2 rounded-xl bg-[#f8faf7] border border-[#e2e8df] focus:outline-none focus:ring-2 focus:ring-[#226c3d]/20 focus:border-[#226c3d]"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={activityFilter}
              onChange={(e) => setActivityFilter(e.target.value)}
              className="text-xs px-3 py-2 rounded-xl bg-[#f8faf7] border border-[#e2e8df] focus:outline-none focus:ring-2 focus:ring-[#226c3d]/20 focus:border-[#226c3d]"
            >
              <option value="ALL">Alle Betriebszweige</option>
              <option value="POTATO_STORAGE">{t('navigation.kartoffellager')}</option>
              <option value="LIVESTOCK">{t('navigation.schweinemast')}</option>
              <option value="CROPS">{t('navigation.ackerbau')}</option>
              <option value="MACHINERY">{t('navigation.maschinen')}</option>
              <option value="GENERAL">Allgemein</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-[#e2e8df] shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#f8faf7] border-b border-[#e2e8df] text-gray-500 font-semibold">
                <tr>
                  <th className="py-3 px-4">Nr. / Datum</th>
                  <th className="py-3 px-4">Bezeichnung</th>
                  <th className="py-3 px-4">Kunde</th>
                  <th className="py-3 px-4">Betriebszweig</th>
                  <th className="py-3 px-4 text-right">Netto</th>
                  <th className="py-3 px-4 text-right">USt.</th>
                  <th className="py-3 px-4 text-right">Brutto</th>
                  <th className="py-3 px-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {transactions.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-gray-400">
                      {t('common.noData')}
                    </td>
                  </tr>
                ) : (
                  transactions.map((trx) => (
                    <tr key={trx.id} className="hover:bg-[#fbfcfb] transition-colors">
                      <td className="py-3 px-4 font-mono">
                        <span className="font-semibold text-gray-800">{trx.transactionNumber}</span>
                        <p className="text-[10px] text-gray-400">{formatDate(trx.date)}</p>
                      </td>
                      <td className="py-3 px-4 font-medium text-gray-800">{trx.description}</td>
                      <td className="py-3 px-4 text-gray-600">{trx.customer?.companyName || '-'}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#e8efe6] text-[#226c3d]">
                          {trx.activity}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right font-medium text-gray-700">
                        {formatCurrency(trx.amountNet)}
                      </td>
                      <td className="py-3 px-4 text-right text-gray-500">{trx.vatRate}%</td>
                      <td className="py-3 px-4 text-right font-bold text-[#226c3d]">
                        {formatCurrency(trx.amountGross)}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700">
                          {trx.status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
