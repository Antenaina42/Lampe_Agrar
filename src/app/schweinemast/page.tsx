'use client';

import React, { useEffect, useState } from 'react';
import { AppLayout } from '@/components/AppLayout';
import { useI18n } from '@/lib/i18n';
import {
  Package,
  ShieldCheck,
  HeartPulse,
  Scale,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Plus,
  Pencil,
  Trash2,
  Calendar,
  Sparkles
} from 'lucide-react';

export default function SchweinemastPage() {
  const { t, formatCurrency } = useI18n();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Pig Batch CRUD modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingBatch, setEditingBatch] = useState<any>(null);
  const [batchForm, setBatchForm] = useState({
    batchNumber: '',
    barnType: 'OUTDOOR_CLIMATE_H4',
    barnName: 'Außenklimastall H4 (Hünenheide)',
    arrivalDate: new Date().toISOString().split('T')[0],
    initialPigCount: '500',
    currentPigCount: '500',
    mortalityCount: '0',
    targetWeightKg: '122',
    initialAvgWeightKg: '28.5',
    status: 'ACTIVE',
    notes: '',
  });

  const loadData = () => {
    fetch('/api/livestock')
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

  const batches = data?.batches || [];

  const handleOpenAdd = () => {
    setBatchForm({
      batchNumber: '',
      barnType: 'OUTDOOR_CLIMATE_H4',
      barnName: 'Außenklimastall H4 (Hünenheide)',
      arrivalDate: new Date().toISOString().split('T')[0],
      initialPigCount: '500',
      currentPigCount: '500',
      mortalityCount: '0',
      targetWeightKg: '122',
      initialAvgWeightKg: '28.5',
      status: 'ACTIVE',
      notes: '',
    });
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (b: any) => {
    setEditingBatch(b);
    setBatchForm({
      batchNumber: b.batchNumber,
      barnType: b.barnType,
      barnName: b.barnName,
      arrivalDate: b.arrivalDate ? new Date(b.arrivalDate).toISOString().split('T')[0] : '',
      initialPigCount: String(b.initialPigCount),
      currentPigCount: String(b.currentPigCount),
      mortalityCount: String(b.mortalityCount || 0),
      targetWeightKg: String(b.targetWeightKg || 122),
      initialAvgWeightKg: String(b.initialAvgWeightKg || 28.5),
      status: b.status,
      notes: b.notes || '',
    });
    setIsEditModalOpen(true);
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/livestock', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(batchForm),
      });
      if (res.ok) {
        setIsAddModalOpen(false);
        loadData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBatch) return;
    try {
      const res = await fetch('/api/livestock', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingBatch.id,
          ...batchForm,
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

  const handleDeleteBatch = async (id: string) => {
    if (!confirm(t('common.confirmDelete'))) return;
    try {
      const res = await fetch(`/api/livestock?id=${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        loadData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#f0f9f3] text-[#65BC7B] shadow-sm">
              <span className="text-2xl">🐖</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#2A3035] tracking-tight">
                {t('pigFarming.title')}
              </h1>
              <p className="text-xs text-[#637381] mt-0.5">
                {t('pigFarming.subtitle')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleOpenAdd}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#65BC7B] text-white text-xs font-bold hover:bg-[#52a366] transition shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>{t('pigFarming.addBatch')}</span>
            </button>
          </div>
        </div>

        {/* Barns Infrastructure Highlights (Avada Rounded-3xl Cards) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Barn H4 */}
          <div className="bg-white p-6 rounded-3xl border border-[#65BC7B]/30 shadow-sm flex flex-col justify-between hover:shadow-md transition">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#f0f9f3] text-[#65BC7B] border border-[#65BC7B]/20">
                  {t('pigFarming.outdoorBarn')}
                </span>
                <span className="text-xs font-bold text-[#2A3035]">1.400 {t('pigFarming.places')}</span>
              </div>
              <h2 className="text-base font-bold text-[#2A3035] mt-1">
                {t('pigFarming.barnH4Title')}
              </h2>
              <p className="text-xs text-[#637381] mt-2 leading-relaxed">
                {t('pigFarming.barnH4Desc')}
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
              <span className="text-[#637381]">{t('pigFarming.welfarePremium')}:</span>
              <span className="font-bold text-[#65BC7B]">+ 0,35 € / kg SG</span>
            </div>
          </div>

          {/* Barn H2 */}
          <div className="bg-white p-6 rounded-3xl border border-[#e3ede5] shadow-sm flex flex-col justify-between hover:shadow-md transition">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-700">
                  {t('pigFarming.indoorBarn')}
                </span>
                <span className="text-xs font-bold text-[#2A3035]">2.000 {t('pigFarming.places')}</span>
              </div>
              <h2 className="text-base font-bold text-[#2A3035] mt-1">
                {t('pigFarming.barnH2Title')}
              </h2>
              <p className="text-xs text-[#637381] mt-2 leading-relaxed">
                {t('pigFarming.barnH2Desc')}
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
              <span className="text-[#637381]">{t('pigFarming.siteCapacity')}:</span>
              <span className="font-bold text-[#2A3035]">3.400 {t('pigFarming.places')}</span>
            </div>
          </div>
        </div>

        {/* KPIs Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-3xl border border-[#e3ede5] shadow-xs">
            <span className="text-xs text-[#637381] font-semibold">{t('pigFarming.activeAnimals')}</span>
            <p className="text-2xl font-bold text-[#65BC7B] mt-1">
              {data?.totalActiveAnimals?.toLocaleString('de-DE') || '1.675'}
            </p>
            <span className="text-[10px] text-[#637381]">{t('pigFarming.ongoingCycles')}</span>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-[#e3ede5] shadow-xs">
            <span className="text-xs text-[#637381] font-semibold">{t('pigFarming.avgFeedEfficiency')}</span>
            <p className="text-2xl font-bold text-[#2A3035] mt-1">1 : 2,75</p>
            <span className="text-[10px] text-[#637381]">{t('pigFarming.feedEfficiencyUnit')}</span>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-[#e3ede5] shadow-xs">
            <span className="text-xs text-[#637381] font-semibold">{t('pigFarming.avgMortality')}</span>
            <p className="text-2xl font-bold text-emerald-600 mt-1">1,8 %</p>
            <span className="text-[10px] text-[#637381]">{t('pigFarming.mortalityHealthy')}</span>
          </div>

          <div className="bg-white p-5 rounded-3xl border border-[#e3ede5] shadow-xs">
            <span className="text-xs text-[#637381] font-semibold">{t('pigFarming.avgSlaughterPrice')}</span>
            <p className="text-2xl font-bold text-[#65BC7B] mt-1">1,85 € / kg</p>
            <span className="text-[10px] text-[#637381]">{t('pigFarming.priceBonus')}</span>
          </div>
        </div>

        {/* Batches Table with Full CRUD (Add, Edit, Delete) */}
        <div className="bg-white rounded-3xl border border-[#e3ede5] shadow-sm overflow-hidden">
          <div className="p-5 border-b border-[#e3ede5] flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-[#2A3035]">
                {t('pigFarming.activeBatches')}
              </h2>
              <p className="text-[11px] text-[#637381] mt-0.5">
                {t('pigFarming.batchesSubtitle')}
              </p>
            </div>
            <button
              onClick={handleOpenAdd}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#f0f9f3] text-[#65BC7B] hover:bg-[#65BC7B] hover:text-white text-xs font-bold transition border border-[#65BC7B]/30"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{t('pigFarming.addBatch')}</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#f7fbf8] border-b border-[#e3ede5] text-[#637381] font-semibold">
                <tr>
                  <th className="py-3 px-5">{t('pigFarming.batchNumber')}</th>
                  <th className="py-3 px-4">{t('pigFarming.title')}</th>
                  <th className="py-3 px-4 text-right">{t('pigFarming.initialCount')} / {t('pigFarming.currentCount')}</th>
                  <th className="py-3 px-4 text-right">{t('pigFarming.losses')}</th>
                  <th className="py-3 px-4 text-right">{t('pigFarming.feedExpense')}</th>
                  <th className="py-3 px-4 text-right font-bold">{t('pigFarming.grossMargin')} (€)</th>
                  <th className="py-3 px-4 text-center">{t('common.status') || 'Status'}</th>
                  <th className="py-3 px-5 text-center">{t('common.actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e3ede5]">
                {batches.map((b: any) => (
                  <tr key={b.id} className="hover:bg-[#f7fbf8] transition">
                    <td className="py-3.5 px-5 font-mono font-bold text-[#2A3035]">
                      {b.batchNumber}
                    </td>
                    <td className="py-3.5 px-4 text-[#2A3035]">
                      {b.barnName}
                    </td>
                    <td className="py-3.5 px-4 text-right font-medium">
                      {b.initialPigCount} / <span className="font-bold text-[#2A3035]">{b.currentPigCount}</span>
                    </td>
                    <td className="py-3.5 px-4 text-right text-rose-600 font-semibold">
                      {b.mortalityCount} ({b.metrics?.mortalityRatePercent || '0.0'}%)
                    </td>
                    <td className="py-3.5 px-4 text-right text-gray-600">
                      {formatCurrency(b.metrics?.totalDirectCosts)}
                    </td>
                    <td className="py-3.5 px-4 text-right font-bold text-[#65BC7B]">
                      {formatCurrency(b.grossMargin)}
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span
                        className={`px-3 py-1 rounded-full text-[10px] font-bold ${
                          b.status === 'ACTIVE'
                            ? 'bg-[#f0f9f3] text-[#65BC7B] border border-[#65BC7B]/20'
                            : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {b.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-5 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => handleOpenEdit(b)}
                          className="p-1.5 rounded-full hover:bg-gray-100 text-gray-600 transition"
                          title={t('common.edit')}
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteBatch(b.id)}
                          className="p-1.5 rounded-full hover:bg-rose-50 text-rose-600 transition"
                          title={t('common.delete')}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal: Add Batch */}
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-[#e3ede5] space-y-4 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <h3 className="text-base font-bold text-[#2A3035]">
                  {t('pigFarming.addBatch')}
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
                    Stallung & Haltungsform *
                  </label>
                  <select
                    value={batchForm.barnType}
                    onChange={(e) => {
                      const bType = e.target.value;
                      setBatchForm({
                        ...batchForm,
                        barnType: bType,
                        barnName: bType === 'OUTDOOR_CLIMATE_H4' ? 'Außenklimastall H4 (Hünenheide)' : 'Warmstall H2 (Bockstedt)',
                      });
                    }}
                    className="w-full text-xs bg-white border border-[#e3ede5] rounded-xl px-3 py-2 text-[#2A3035] focus:outline-none focus:border-[#65BC7B]"
                  >
                    <option value="OUTDOOR_CLIMATE_H4">{t('pigFarming.barnH4Title')} (Stroh & Auslauf)</option>
                    <option value="FATTENING_H2">{t('pigFarming.barnH2Title')} (StallhaltungPlus)</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#2A3035] mb-1">
                      {t('pigFarming.initialCount')} *
                    </label>
                    <input
                      type="number"
                      required
                      value={batchForm.initialPigCount}
                      onChange={(e) => setBatchForm({ ...batchForm, initialPigCount: e.target.value, currentPigCount: e.target.value })}
                      className="w-full text-xs bg-white border border-[#e3ede5] rounded-xl px-3 py-2 text-[#2A3035] focus:outline-none focus:border-[#65BC7B]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#2A3035] mb-1">
                      Zielgewicht (kg)
                    </label>
                    <input
                      type="number"
                      value={batchForm.targetWeightKg}
                      onChange={(e) => setBatchForm({ ...batchForm, targetWeightKg: e.target.value })}
                      className="w-full text-xs bg-white border border-[#e3ede5] rounded-xl px-3 py-2 text-[#2A3035] focus:outline-none focus:border-[#65BC7B]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#2A3035] mb-1">
                      Einstallungsgewicht (kg)
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      value={batchForm.initialAvgWeightKg}
                      onChange={(e) => setBatchForm({ ...batchForm, initialAvgWeightKg: e.target.value })}
                      className="w-full text-xs bg-white border border-[#e3ede5] rounded-xl px-3 py-2 text-[#2A3035] focus:outline-none focus:border-[#65BC7B]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#2A3035] mb-1">
                      Einstallungsdatum
                    </label>
                    <input
                      type="date"
                      value={batchForm.arrivalDate}
                      onChange={(e) => setBatchForm({ ...batchForm, arrivalDate: e.target.value })}
                      className="w-full text-xs bg-white border border-[#e3ede5] rounded-xl px-3 py-2 text-[#2A3035] focus:outline-none focus:border-[#65BC7B]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#2A3035] mb-1">
                    Durchgangsnummer (optional)
                  </label>
                  <input
                    type="text"
                    placeholder="Wird automatisch vergeben (DG-2026-XXX)"
                    value={batchForm.batchNumber}
                    onChange={(e) => setBatchForm({ ...batchForm, batchNumber: e.target.value })}
                    className="w-full text-xs bg-white border border-[#e3ede5] rounded-xl px-3 py-2 text-[#2A3035] focus:outline-none focus:border-[#65BC7B]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#2A3035] mb-1">
                    {t('budgets.notes')}
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Ferkellieferant, Gesundheitsstatus, Impfungen..."
                    value={batchForm.notes}
                    onChange={(e) => setBatchForm({ ...batchForm, notes: e.target.value })}
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

        {/* Modal: Edit Batch */}
        {isEditModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-[#e3ede5] space-y-4 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <h3 className="text-base font-bold text-[#2A3035]">
                  {t('pigFarming.editBatch')} ({editingBatch?.batchNumber})
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
                    Stallungsname
                  </label>
                  <input
                    type="text"
                    required
                    value={batchForm.barnName}
                    onChange={(e) => setBatchForm({ ...batchForm, barnName: e.target.value })}
                    className="w-full text-xs bg-white border border-[#e3ede5] rounded-xl px-3 py-2 text-[#2A3035] focus:outline-none focus:border-[#65BC7B]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#2A3035] mb-1">
                      {t('pigFarming.currentCount')}
                    </label>
                    <input
                      type="number"
                      required
                      value={batchForm.currentPigCount}
                      onChange={(e) => setBatchForm({ ...batchForm, currentPigCount: e.target.value })}
                      className="w-full text-xs bg-white border border-[#e3ede5] rounded-xl px-3 py-2 text-[#2A3035] focus:outline-none focus:border-[#65BC7B]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#2A3035] mb-1">
                      Ausfälle (Mortalität)
                    </label>
                    <input
                      type="number"
                      value={batchForm.mortalityCount}
                      onChange={(e) => setBatchForm({ ...batchForm, mortalityCount: e.target.value })}
                      className="w-full text-xs bg-white border border-[#e3ede5] rounded-xl px-3 py-2 text-[#2A3035] focus:outline-none focus:border-[#65BC7B]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#2A3035] mb-1">
                      Zielgewicht (kg)
                    </label>
                    <input
                      type="number"
                      value={batchForm.targetWeightKg}
                      onChange={(e) => setBatchForm({ ...batchForm, targetWeightKg: e.target.value })}
                      className="w-full text-xs bg-white border border-[#e3ede5] rounded-xl px-3 py-2 text-[#2A3035] focus:outline-none focus:border-[#65BC7B]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#2A3035] mb-1">
                      {t('common.status')}
                    </label>
                    <select
                      value={batchForm.status}
                      onChange={(e) => setBatchForm({ ...batchForm, status: e.target.value })}
                      className="w-full text-xs bg-white border border-[#e3ede5] rounded-xl px-3 py-2 text-[#2A3035] focus:outline-none focus:border-[#65BC7B]"
                    >
                      <option value="ACTIVE">{t('common.active')}</option>
                      <option value="CLOSED">{t('crops.closed')}</option>
                      <option value="QUARANTINE">Quarantine</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#2A3035] mb-1">
                    {t('budgets.notes')}
                  </label>
                  <textarea
                    rows={2}
                    value={batchForm.notes}
                    onChange={(e) => setBatchForm({ ...batchForm, notes: e.target.value })}
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
