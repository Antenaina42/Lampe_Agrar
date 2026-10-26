'use client';

import React, { useEffect, useState } from 'react';
import { AppLayout } from '@/components/AppLayout';
import { useI18n } from '@/lib/i18n';
import { Download, Filter, Search, ArrowDownLeft, ArrowUpRight } from 'lucide-react';
import { exportToCsv, exportToExcel } from '@/lib/export-utils';

export default function BuchungenPage() {
  const { t, formatCurrency, formatDate } = useI18n();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [typeFilter, setTypeFilter] = useState('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchBookings = () => {
    let url = '/api/transactions?';
    if (typeFilter !== 'ALL') url += `type=${typeFilter}&`;
    if (searchTerm) url += `search=${encodeURIComponent(searchTerm)}`;

    fetch(url)
      .then((res) => res.json())
      .then((json) => {
        setTransactions(json.transactions || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchBookings();
  }, [typeFilter, searchTerm]);

  const handleExportCsv = () => {
    const headers = ['Buchung-Nr', 'Datum', 'Typ', 'Bezeichnung', 'Netto (€)', 'USt %', 'Brutto (€)', 'Konto'];
    const rows = transactions.map((t) => [
      t.transactionNumber,
      formatDate(t.date),
      t.type === 'REVENUE' ? 'Einnahme' : 'Ausgabe',
      t.description,
      t.amountNet,
      t.vatRate,
      t.amountGross,
      t.account?.name || '',
    ]);
    exportToCsv('Lampe-Agrar-Buchungsjournal', headers, rows);
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-[#212921] tracking-tight">
              {t('navigation.buchungen')} (Journal)
            </h1>
            <p className="text-xs text-[#5c6e5c] mt-0.5">
              Vollständiges Betriebsbuchhaltungsjournal mit Revisionssicherheit
            </p>
          </div>
          <button
            onClick={handleExportCsv}
            className="flex items-center gap-1.5 px-3 py-2 bg-white border border-[#dce3da] hover:bg-[#f2f7f1] text-[#226c3d] text-xs font-bold rounded-xl shadow-sm transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Journal exportieren (CSV)</span>
          </button>
        </div>

        {/* Filter bar */}
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
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="text-xs px-3 py-2 rounded-xl bg-[#f8faf7] border border-[#e2e8df] focus:outline-none focus:ring-2 focus:ring-[#226c3d]/20 focus:border-[#226c3d]"
            >
              <option value="ALL">Alle Buchungen</option>
              <option value="REVENUE">{t('navigation.einnahmen')}</option>
              <option value="EXPENSE">{t('navigation.ausgaben')}</option>
            </select>
          </div>
        </div>

        {/* Journal Table */}
        <div className="bg-white rounded-2xl border border-[#e2e8df] shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#f8faf7] border-b border-[#e2e8df] text-gray-500 font-semibold">
                <tr>
                  <th className="py-3 px-4">Journal-Nr.</th>
                  <th className="py-3 px-4">Datum</th>
                  <th className="py-3 px-4">Art</th>
                  <th className="py-3 px-4">Buchungstext</th>
                  <th className="py-3 px-4">Bankkonto</th>
                  <th className="py-3 px-4 text-right">Netto</th>
                  <th className="py-3 px-4 text-right">USt.</th>
                  <th className="py-3 px-4 text-right">Bruttobetrag</th>
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
                      <td className="py-3 px-4 font-mono font-semibold text-gray-800">
                        {trx.transactionNumber}
                      </td>
                      <td className="py-3 px-4 text-gray-500">{formatDate(trx.date)}</td>
                      <td className="py-3 px-4">
                        {trx.type === 'REVENUE' ? (
                          <span className="flex items-center gap-1 text-[11px] font-bold text-[#226c3d]">
                            <ArrowDownLeft className="w-3.5 h-3.5" />
                            <span>Einnahme</span>
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-[11px] font-bold text-amber-700">
                            <ArrowUpRight className="w-3.5 h-3.5" />
                            <span>Ausgabe</span>
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 font-medium text-gray-800">{trx.description}</td>
                      <td className="py-3 px-4 text-gray-500 truncate max-w-[150px]">
                        {trx.account?.name || 'Volksbank Vechta'}
                      </td>
                      <td className="py-3 px-4 text-right font-medium text-gray-600">
                        {formatCurrency(trx.amountNet)}
                      </td>
                      <td className="py-3 px-4 text-right text-gray-400">{trx.vatRate}%</td>
                      <td
                        className={`py-3 px-4 text-right font-bold ${
                          trx.type === 'REVENUE' ? 'text-[#226c3d]' : 'text-gray-800'
                        }`}
                      >
                        {formatCurrency(trx.amountGross)}
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
