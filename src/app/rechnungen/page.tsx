'use client';

import React, { useEffect, useState } from 'react';
import { AppLayout } from '@/components/AppLayout';
import { useI18n, Locale } from '@/lib/i18n';
import {
  FileText,
  PlusCircle,
  Download,
  CreditCard,
  CheckCircle2,
  Clock,
  Printer,
  X,
} from 'lucide-react';
import { generateInvoicePdf } from '@/lib/pdf-generator';

export default function RechnungenPage() {
  const { t, formatCurrency, formatDate } = useI18n();
  const [invoices, setInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [paymentModalInvoice, setPaymentModalInvoice] = useState<any | null>(null);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentSubmitting, setPaymentSubmitting] = useState(false);
  const [pdfLangModalInvoice, setPdfLangModalInvoice] = useState<any | null>(null);

  const fetchInvoices = () => {
    fetch('/api/invoices')
      .then((res) => res.json())
      .then((json) => {
        setInvoices(json.invoices || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const handleDownloadPdf = (invoice: any, lang: Locale) => {
    const doc = generateInvoicePdf(
      {
        invoiceNumber: invoice.invoiceNumber,
        type: invoice.type,
        issueDate: invoice.issueDate,
        dueDate: invoice.dueDate,
        customer: invoice.customer,
        supplier: invoice.supplier,
        lines: (invoice.lines || []).map((l: any) => ({
          description: l.description,
          quantity: Number(l.quantity),
          unit: l.unit,
          unitPrice: Number(l.unitPrice),
          taxRate: Number(l.taxRate),
          taxAmount: Number(l.taxAmount),
          subtotal: Number(l.subtotal),
          total: Number(l.total),
        })),
        subtotal: Number(invoice.subtotal),
        taxAmount: Number(invoice.taxAmount),
        totalAmount: Number(invoice.totalAmount),
        paidAmount: Number(invoice.paidAmount),
        notes: invoice.notes,
      },
      lang
    );

    doc.save(`${invoice.invoiceNumber}_${lang.toUpperCase()}.pdf`);
    setPdfLangModalInvoice(null);
  };

  const handleRecordPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentModalInvoice || !paymentAmount) return;

    setPaymentSubmitting(true);
    try {
      const res = await fetch(`/api/invoices/${paymentModalInvoice.id}/payment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: parseFloat(paymentAmount) }),
      });

      if (!res.ok) throw new Error('Fehler beim Verbuchen');

      setPaymentModalInvoice(null);
      setPaymentAmount('');
      fetchInvoices();
    } catch (err: any) {
      alert(err.message || 'Fehler beim Buchen');
    } finally {
      setPaymentSubmitting(false);
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-[#212921] tracking-tight">
              {t('invoices.title')}
            </h1>
            <p className="text-xs text-[#5c6e5c] mt-0.5">
              {t('invoices.subtitle')}
            </p>
          </div>
        </div>

        {/* Invoice List Table */}
        <div className="bg-white rounded-3xl border border-[#e3ede5] shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#f8faf7] border-b border-[#e3ede5] text-[#637381] font-semibold">
                <tr>
                  <th className="py-3.5 px-4">{t('invoices.invoiceNumber')}</th>
                  <th className="py-3.5 px-4">{t('invoices.direction')}</th>
                  <th className="py-3.5 px-4">{t('invoices.client')} / {t('invoices.supplier')}</th>
                  <th className="py-3.5 px-4">{t('invoices.issueDate')}</th>
                  <th className="py-3.5 px-4">{t('invoices.dueDate')}</th>
                  <th className="py-3.5 px-4 text-right">{t('common.total')}</th>
                  <th className="py-3.5 px-4 text-right">{t('invoices.paid')}</th>
                  <th className="py-3.5 px-4 text-center">{t('common.status') || 'Status'}</th>
                  <th className="py-3.5 px-4 text-right">{t('common.actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {invoices.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-8 text-center text-gray-400">
                      {t('common.noData')}
                    </td>
                  </tr>
                ) : (
                  invoices.map((inv) => {
                    const remaining = Math.max(0, Number(inv.totalAmount) - Number(inv.paidAmount));
                    return (
                      <tr key={inv.id} className="hover:bg-[#fbfcfb] transition-colors">
                        <td className="py-3.5 px-4 font-mono font-bold text-[#2A3035]">
                          {inv.invoiceNumber}
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                              inv.type === 'OUTGOING'
                                ? 'bg-[#f0f9f3] text-[#65BC7B] border border-[#65BC7B]/20'
                                : 'bg-amber-50 text-amber-800'
                            }`}
                          >
                            {inv.type === 'OUTGOING' ? t('invoices.outgoing') : t('invoices.incoming')}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-gray-800">
                          {inv.customer?.companyName || inv.supplier?.companyName || '-'}
                        </td>
                        <td className="py-3.5 px-4 text-gray-500">{formatDate(inv.issueDate)}</td>
                        <td className="py-3.5 px-4 text-gray-500">{formatDate(inv.dueDate)}</td>
                        <td className="py-3.5 px-4 text-right font-bold text-gray-800">
                          {formatCurrency(inv.totalAmount)}
                        </td>
                        <td className="py-3.5 px-4 text-right font-semibold text-[#226c3d]">
                          {formatCurrency(inv.paidAmount)}
                        </td>
                        <td className="py-3.5 px-4 text-center">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                              inv.status === 'PAID'
                                ? 'bg-emerald-100 text-emerald-800'
                                : inv.status === 'PARTIALLY_PAID'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}
                          >
                            {inv.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right space-x-2">
                          {/* Payment Button */}
                          {inv.status !== 'PAID' && (
                            <button
                              onClick={() => {
                                setPaymentModalInvoice(inv);
                                setPaymentAmount(remaining.toFixed(2));
                              }}
                              className="px-2.5 py-1 text-[11px] font-bold bg-[#eef5ed] text-[#226c3d] hover:bg-[#226c3d] hover:text-white rounded-lg transition-colors"
                              title="Teilzahlung oder Vollzahlung verbuchen"
                            >
                              Zahlung erfassen
                            </button>
                          )}
                          {/* PDF Multilingual Download Trigger */}
                          <button
                            onClick={() => setPdfLangModalInvoice(inv)}
                            className="p-1 text-gray-500 hover:text-[#226c3d] hover:bg-gray-100 rounded-lg transition-colors inline-block align-middle"
                            title="PDF generieren & herunterladen"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal: PDF Language Selector */}
        {pdfLangModalInvoice && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 border border-[#e0e6dd] animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-gray-800">
                  {t('invoices.pdfLanguage')}
                </h3>
                <button
                  onClick={() => setPdfLangModalInvoice(null)}
                  className="p-1 rounded-lg text-gray-400 hover:text-gray-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <p className="text-xs text-gray-500 mb-4">
                Wählen Sie die Ausgabesprache für die Rechnung{' '}
                <strong className="text-gray-700">{pdfLangModalInvoice.invoiceNumber}</strong>:
              </p>
              <div className="space-y-2">
                <button
                  onClick={() => handleDownloadPdf(pdfLangModalInvoice, 'de')}
                  className="w-full py-2.5 px-4 text-xs font-semibold rounded-xl bg-[#f4f7f3] hover:bg-[#226c3d] hover:text-white text-gray-800 text-left transition-colors flex items-center justify-between"
                >
                  <span>Deutsch (de-DE)</span>
                  <span className="text-[10px] text-gray-400">Standard</span>
                </button>
                <button
                  onClick={() => handleDownloadPdf(pdfLangModalInvoice, 'en')}
                  className="w-full py-2.5 px-4 text-xs font-semibold rounded-xl bg-[#f4f7f3] hover:bg-[#226c3d] hover:text-white text-gray-800 text-left transition-colors flex items-center justify-between"
                >
                  <span>English (en-GB)</span>
                  <span className="text-[10px] text-gray-400">International</span>
                </button>
                <button
                  onClick={() => handleDownloadPdf(pdfLangModalInvoice, 'fr')}
                  className="w-full py-2.5 px-4 text-xs font-semibold rounded-xl bg-[#f4f7f3] hover:bg-[#226c3d] hover:text-white text-gray-800 text-left transition-colors flex items-center justify-between"
                >
                  <span>Français (fr-FR)</span>
                  <span className="text-[10px] text-gray-400">Export</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Modal: Record Partial / Full Payment */}
        {paymentModalInvoice && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 border border-[#e0e6dd] animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-gray-800">
                  {t('invoices.partialPayment')}
                </h3>
                <button
                  onClick={() => setPaymentModalInvoice(null)}
                  className="p-1 rounded-lg text-gray-400 hover:text-gray-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <form onSubmit={handleRecordPayment} className="space-y-4">
                <div>
                  <p className="text-xs text-gray-500 mb-1">{t('invoices.invoiceNumber')}:</p>
                  <p className="text-xs font-bold text-gray-800">
                    {paymentModalInvoice.invoiceNumber} –{' '}
                    {paymentModalInvoice.customer?.companyName || paymentModalInvoice.supplier?.companyName}
                  </p>
                  <p className="text-[11px] text-gray-500 mt-1">
                    {t('common.total')}: {formatCurrency(paymentModalInvoice.totalAmount)} • {t('invoices.paid')}:{' '}
                    {formatCurrency(paymentModalInvoice.paidAmount)}
                  </p>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    {t('common.amount')} (€)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={paymentAmount}
                    onChange={(e) => setPaymentAmount(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#226c3d]/20 focus:border-[#226c3d]"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setPaymentModalInvoice(null)}
                    className="px-3 py-2 text-xs text-gray-600 hover:bg-gray-100 rounded-lg"
                  >
                    {t('common.cancel')}
                  </button>
                  <button
                    type="submit"
                    disabled={paymentSubmitting}
                    className="px-4 py-2 text-xs font-bold text-white bg-[#226c3d] hover:bg-[#1b5e20] rounded-lg disabled:opacity-50"
                  >
                    {paymentSubmitting ? t('common.loading') : 'Zahlung buchen'}
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
