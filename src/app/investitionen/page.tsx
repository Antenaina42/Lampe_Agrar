'use client';

import React, { useEffect, useState } from 'react';
import { AppLayout } from '@/components/AppLayout';
import { useI18n } from '@/lib/i18n';
import { Building2, Landmark, Plus, Percent, Calendar, ShieldCheck, FileCheck } from 'lucide-react';

export default function InvestitionenPage() {
  const { t, formatCurrency, formatDate } = useI18n();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'INVESTMENTS' | 'LOANS'>('INVESTMENTS');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<'INVESTMENT' | 'LOAN'>('INVESTMENT');

  const [investmentForm, setInvestmentForm] = useState({
    title: '',
    category: 'BUILDING',
    amount: '',
    purchaseDate: new Date().toISOString().split('T')[0],
    financingType: 'BANK_LOAN',
    downPayment: '0',
    depreciationYears: '15',
    notes: '',
  });

  const [loanForm, setLoanForm] = useState({
    loanNumber: '',
    lenderName: 'Volksbank eG / Landwirtschaftliche Rentenbank',
    principalAmount: '',
    interestRate: '3.45',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '2036-12-31',
    termMonths: '120',
    monthlyPayment: '',
  });

  const loadData = () => {
    fetch('/api/investitionen')
      .then((res) => res.json())
      .then((json) => {
        setData(json);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleInvestmentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/investitionen', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(investmentForm),
      });
      if (res.ok) {
        setIsModalOpen(false);
        loadData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleLoanSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/investitionen', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...loanForm, action: 'LOAN' }),
      });
      if (res.ok) {
        setIsModalOpen(false);
        loadData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getCategoryBadge = (cat: string) => {
    switch (cat) {
      case 'BUILDING': return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#f0f9f3] text-[#65BC7B]">{t('investments.catBuilding')}</span>;
      case 'LIVESTOCK_FACILITY': return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-purple-700">{t('investments.catBarn')}</span>;
      case 'STORAGE': return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700">{t('investments.catStorage')}</span>;
      case 'MACHINERY': return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700">{t('investments.catMachine')}</span>;
      default: return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-gray-50 text-gray-700">{cat}</span>;
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-[#2A3035] tracking-tight">
              {t('investments.title')}
            </h1>
            <p className="text-xs text-[#637381] mt-0.5">
              {t('investments.subtitle')}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => { setModalType('INVESTMENT'); setIsModalOpen(true); }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#65BC7B] text-white text-xs font-bold hover:bg-[#52a366] transition shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{t('investments.addInvestment')}</span>
            </button>
            <button
              onClick={() => { setModalType('LOAN'); setIsModalOpen(true); }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-white border border-[#e3ede5] text-[#2A3035] text-xs font-bold hover:bg-gray-50 transition shadow-2xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{t('investments.addLoan')}</span>
            </button>
          </div>
        </div>

        {/* Big KPI Cards */}
        {data?.summary && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-3xl border border-[#e3ede5] shadow-xs">
              <span className="text-xs font-semibold text-[#637381]">{t('investments.totalVolume')}</span>
              <p className="text-2xl font-bold text-[#2A3035] mt-1">{formatCurrency(data.summary.totalInvestmentVolume)}</p>
              <span className="text-[10px] text-[#637381]">{t('investments.assetValue')}</span>
            </div>
            <div className="bg-white p-5 rounded-3xl border border-[#e3ede5] shadow-xs">
              <span className="text-xs font-semibold text-[#637381]">{t('investments.loanBalance')}</span>
              <p className="text-2xl font-bold text-amber-700 mt-1">{formatCurrency(data.summary.totalRemainingDebt)}</p>
              <span className="text-[10px] text-[#637381]">{t('investments.remainingDebt')}</span>
            </div>
            <div className="bg-white p-5 rounded-3xl border border-[#e3ede5] shadow-xs">
              <span className="text-xs font-semibold text-[#637381]">{t('investments.monthlyService')}</span>
              <p className="text-2xl font-bold text-[#65BC7B] mt-1">{formatCurrency(data.summary.totalMonthlyDebtService)}</p>
              <span className="text-[10px] text-[#637381]">{t('investments.interestPayment')} & {t('investments.principalPayment')}</span>
            </div>
            <div className="bg-white p-5 rounded-3xl border border-[#e3ede5] shadow-xs">
              <span className="text-xs font-semibold text-[#637381]">{t('investments.annualService')}</span>
              <p className="text-2xl font-bold text-[#2A3035] mt-1">{formatCurrency(data.summary.annualDebtService)}</p>
              <span className="text-[10px] text-[#637381]">12 {t('machinery.yearsUnit')}</span>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('INVESTMENTS')}
            className={`px-5 py-2.5 rounded-full text-xs font-bold transition ${
              activeTab === 'INVESTMENTS' ? 'bg-[#65BC7B] text-white shadow-xs' : 'bg-white text-[#2A3035] border border-[#e3ede5] hover:bg-[#f0f9f3]'
            }`}
          >
            {t('investments.tabInvestments')} ({data?.investments?.length || 0})
          </button>
          <button
            onClick={() => setActiveTab('LOANS')}
            className={`px-5 py-2.5 rounded-full text-xs font-bold transition ${
              activeTab === 'LOANS' ? 'bg-[#65BC7B] text-white shadow-xs' : 'bg-white text-[#2A3035] border border-[#e3ede5] hover:bg-[#f0f9f3]'
            }`}
          >
            {t('investments.tabLoans')} ({data?.loans?.length || 0})
          </button>
        </div>

        {/* Tab 1: Investments Table */}
        {activeTab === 'INVESTMENTS' && (
          <div className="bg-white rounded-3xl border border-[#e3ede5] shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#f7fbf8] text-[#637381] font-semibold border-b border-[#e3ede5]">
                  <tr>
                    <th className="py-3 px-5">{t('investments.investmentObject')}</th>
                    <th className="py-3 px-4">{t('inventory.category')}</th>
                    <th className="py-3 px-4">{t('common.date')}</th>
                    <th className="py-3 px-4 text-right">{t('investments.investmentAmount')}</th>
                    <th className="py-3 px-4 text-right">{t('investments.equityShare')}</th>
                    <th className="py-3 px-4">{t('investments.financing')}</th>
                    <th className="py-3 px-4 text-center">{t('investments.depreciationYears')}</th>
                    <th className="py-3 px-4">{t('common.notes')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e3ede5]">
                  {loading ? (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-gray-400">{t('common.loading')}</td>
                    </tr>
                  ) : data?.investments?.map((inv: any) => (
                    <tr key={inv.id} className="hover:bg-[#f7fbf8] transition">
                      <td className="py-3 px-5 font-bold text-[#2A3035]">{inv.title}</td>
                      <td className="py-3 px-4">{getCategoryBadge(inv.category)}</td>
                      <td className="py-3 px-4 text-gray-500">{formatDate(inv.purchaseDate)}</td>
                      <td className="py-3 px-4 text-right font-bold text-[#65BC7B]">{formatCurrency(inv.amount)}</td>
                      <td className="py-3 px-4 text-right text-gray-600">{formatCurrency(inv.downPayment)}</td>
                      <td className="py-3 px-4 text-[#2A3035] font-medium">{inv.financingType === 'BANK_LOAN' ? 'Bankdarlehen' : inv.financingType === 'OWN_EQUITY' ? 'Eigenmittel' : 'Leasing'}</td>
                      <td className="py-3 px-4 text-center text-gray-600">{inv.depreciationYears} {t('machinery.yearsUnit')}</td>
                      <td className="py-3 px-4 text-gray-500 text-[11px]">{inv.notes || '–'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 2: Loans Table */}
        {activeTab === 'LOANS' && (
          <div className="bg-white rounded-3xl border border-[#e3ede5] shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#f7fbf8] text-[#637381] font-semibold border-b border-[#e3ede5]">
                  <tr>
                    <th className="py-3 px-5">ID</th>
                    <th className="py-3 px-4">{t('investments.lender')}</th>
                    <th className="py-3 px-4 text-right">{t('investments.initialAmount')}</th>
                    <th className="py-3 px-4 text-right">{t('investments.interestRate')}</th>
                    <th className="py-3 px-4 text-right">{t('investments.monthlyInstallment')}</th>
                    <th className="py-3 px-4 text-right">{t('investments.remainingDebt')}</th>
                    <th className="py-3 px-4">{t('common.period')}</th>
                    <th className="py-3 px-4 text-center">{t('common.status')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e3ede5]">
                  {loading ? (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-gray-400">{t('common.loading')}</td>
                    </tr>
                  ) : data?.loans?.map((l: any) => (
                    <tr key={l.id} className="hover:bg-[#f7fbf8] transition">
                      <td className="py-3 px-5 font-mono font-medium text-[#2A3035]">{l.loanNumber}</td>
                      <td className="py-3 px-4 font-bold text-[#2A3035]">{l.lenderName}</td>
                      <td className="py-3 px-4 text-right font-semibold text-[#2A3035]">{formatCurrency(l.principalAmount)}</td>
                      <td className="py-3 px-4 text-right font-mono font-bold text-[#65BC7B]">{Number(l.interestRate).toFixed(2)} %</td>
                      <td className="py-3 px-4 text-right font-bold text-[#2A3035]">{formatCurrency(l.monthlyPayment)} / Mo.</td>
                      <td className="py-3 px-4 text-right font-bold text-amber-700">{formatCurrency(l.remainingPrincipal)}</td>
                      <td className="py-3 px-4 text-[#637381] text-[11px]">{formatDate(l.startDate)} – {formatDate(l.endDate)}</td>
                      <td className="py-3 px-4 text-center">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${l.status === 'ACTIVE' ? 'bg-[#f0f9f3] text-[#65BC7B] border border-[#65BC7B]/20' : 'bg-gray-100 text-gray-600'}`}>
                          {l.status === 'ACTIVE' ? t('common.active') : t('common.inactive')}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Modal: New Investment */}
        {isModalOpen && modalType === 'INVESTMENT' && (
          <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-gray-200">
              <h2 className="text-base font-bold text-gray-800 mb-4">Investition erfassen</h2>
              <form onSubmit={handleInvestmentSubmit} className="space-y-3">
                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 mb-1">Objektbezeichnung *</label>
                  <input
                    type="text"
                    required
                    placeholder="z.B. Photovoltaikanlage Hallendach"
                    value={investmentForm.title}
                    onChange={(e) => setInvestmentForm({ ...investmentForm, title: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs rounded-xl border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#226c3d]"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-600 mb-1">Kategorie</label>
                    <select
                      value={investmentForm.category}
                      onChange={(e) => setInvestmentForm({ ...investmentForm, category: e.target.value })}
                      className="w-full px-3 py-1.5 text-xs rounded-xl border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#226c3d]"
                    >
                      <option value="BUILDING">Wirtschaftsgebäude</option>
                      <option value="LIVESTOCK_FACILITY">Tierwohlstall H4</option>
                      <option value="STORAGE">Kartoffellagerhalle</option>
                      <option value="MACHINERY">Großmaschinen</option>
                      <option value="LAND_IMPROVEMENT">Bodenmelioration / Drainage</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-600 mb-1">Investitionssumme (€) *</label>
                    <input
                      type="number"
                      required
                      value={investmentForm.amount}
                      onChange={(e) => setInvestmentForm({ ...investmentForm, amount: e.target.value })}
                      className="w-full px-3 py-1.5 text-xs rounded-xl border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#226c3d]"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-600 mb-1">Anschaffungsdatum</label>
                    <input
                      type="date"
                      value={investmentForm.purchaseDate}
                      onChange={(e) => setInvestmentForm({ ...investmentForm, purchaseDate: e.target.value })}
                      className="w-full px-3 py-1.5 text-xs rounded-xl border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#226c3d]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-600 mb-1">AfA-Nutzungsdauer (Jahre)</label>
                    <input
                      type="number"
                      value={investmentForm.depreciationYears}
                      onChange={(e) => setInvestmentForm({ ...investmentForm, depreciationYears: e.target.value })}
                      className="w-full px-3 py-1.5 text-xs rounded-xl border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#226c3d]"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 mb-1">Notizen & Fördermittel</label>
                  <textarea
                    rows={2}
                    value={investmentForm.notes}
                    onChange={(e) => setInvestmentForm({ ...investmentForm, notes: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs rounded-xl border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#226c3d]"
                  />
                </div>
                <div className="flex justify-end gap-2 pt-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-100 rounded-xl"
                  >
                    Abbrechen
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 text-xs font-semibold bg-[#226c3d] text-white rounded-xl hover:bg-[#1a5530]"
                  >
                    Speichern
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal: New Loan */}
        {isModalOpen && modalType === 'LOAN' && (
          <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-gray-200">
              <h2 className="text-base font-bold text-gray-800 mb-4">Bankdarlehen anlegen</h2>
              <form onSubmit={handleLoanSubmit} className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-600 mb-1">Darlehensnummer *</label>
                    <input
                      type="text"
                      required
                      placeholder="z.B. DAR-VB-2026-01"
                      value={loanForm.loanNumber}
                      onChange={(e) => setLoanForm({ ...loanForm, loanNumber: e.target.value })}
                      className="w-full px-3 py-1.5 text-xs rounded-xl border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#226c3d]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-600 mb-1">Kreditinstitut *</label>
                    <input
                      type="text"
                      required
                      value={loanForm.lenderName}
                      onChange={(e) => setLoanForm({ ...loanForm, lenderName: e.target.value })}
                      className="w-full px-3 py-1.5 text-xs rounded-xl border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#226c3d]"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-600 mb-1">Kreditsumme (€) *</label>
                    <input
                      type="number"
                      required
                      value={loanForm.principalAmount}
                      onChange={(e) => setLoanForm({ ...loanForm, principalAmount: e.target.value })}
                      className="w-full px-3 py-1.5 text-xs rounded-xl border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#226c3d]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-600 mb-1">Zinssatz (% p.a.) *</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={loanForm.interestRate}
                      onChange={(e) => setLoanForm({ ...loanForm, interestRate: e.target.value })}
                      className="w-full px-3 py-1.5 text-xs rounded-xl border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#226c3d]"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-600 mb-1">Monatliche Rate (€) *</label>
                    <input
                      type="number"
                      required
                      value={loanForm.monthlyPayment}
                      onChange={(e) => setLoanForm({ ...loanForm, monthlyPayment: e.target.value })}
                      className="w-full px-3 py-1.5 text-xs rounded-xl border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#226c3d]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-600 mb-1">Laufzeit (Monate)</label>
                    <input
                      type="number"
                      value={loanForm.termMonths}
                      onChange={(e) => setLoanForm({ ...loanForm, termMonths: e.target.value })}
                      className="w-full px-3 py-1.5 text-xs rounded-xl border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#226c3d]"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-100 rounded-xl"
                  >
                    Abbrechen
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 text-xs font-semibold bg-[#226c3d] text-white rounded-xl hover:bg-[#1a5530]"
                  >
                    Speichern
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
