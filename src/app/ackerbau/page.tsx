'use client';

import React, { useEffect, useState } from 'react';
import { AppLayout } from '@/components/AppLayout';
import { useI18n } from '@/lib/i18n';
import {
  Sprout,
  Wheat,
  MapPin,
  TrendingUp,
  Plus,
  Pencil,
  Trash2,
  Compass,
  Layers,
  CheckCircle2,
  BarChart3,
  Percent
} from 'lucide-react';

export default function AckerbauPage() {
  const { t, formatCurrency, formatNumber } = useI18n();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'FIELDS' | 'ECONOMICS'>('FIELDS');

  // Field CRUD modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingField, setEditingField] = useState<any>(null);
  const [fieldForm, setFieldForm] = useState({
    fieldNumber: '',
    name: '',
    areaHa: '',
    soilQualityScore: '55',
    locationDescription: '',
  });

  const loadData = () => {
    fetch('/api/crops')
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

  const fields = data?.fields || [];
  const seasons = data?.seasons || [];

  const totalAreaHa = fields.reduce((sum: number, f: any) => sum + (Number(f.areaHa) || 0), 0);

  const handleOpenAdd = () => {
    setFieldForm({
      fieldNumber: '',
      name: '',
      areaHa: '',
      soilQualityScore: '55',
      locationDescription: '',
    });
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (f: any) => {
    setEditingField(f);
    setFieldForm({
      fieldNumber: f.fieldNumber,
      name: f.name,
      areaHa: String(f.areaHa),
      soilQualityScore: String(f.soilQualityScore || '55'),
      locationDescription: f.locationDescription || '',
    });
    setIsEditModalOpen(true);
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/crops', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fieldForm),
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
    if (!editingField) return;
    try {
      const res = await fetch('/api/crops', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingField.id,
          ...fieldForm,
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

  const handleDeleteField = async (id: string) => {
    if (!confirm(t('common.confirmDelete'))) return;
    try {
      const res = await fetch(`/api/crops?id=${id}`, {
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
              <Sprout className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#2A3035] tracking-tight">
                {t('crops.title')}
              </h1>
              <p className="text-xs text-[#637381] mt-0.5">
                {t('crops.subtitle')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleOpenAdd}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#65BC7B] text-white text-xs font-bold hover:bg-[#52a366] transition shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>{t('crops.addField')}</span>
            </button>
          </div>
        </div>

        {/* Crops Distribution Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          <div className="bg-white p-4 rounded-3xl border border-[#e3ede5] shadow-xs">
            <span className="text-[11px] font-semibold text-[#637381]">{t('crops.cereals')}</span>
            <p className="text-lg font-bold text-[#2A3035] mt-1">ca. 160 ha</p>
            <span className="text-[10px] text-[#637381]">Ø 8,5 t/ha</span>
          </div>

          <div className="bg-white p-4 rounded-3xl border border-[#65BC7B]/40 shadow-xs bg-[#f0f9f3]/40">
            <span className="text-[11px] font-semibold text-[#65BC7B]">{t('crops.industrialPotatoes')}</span>
            <p className="text-lg font-bold text-[#65BC7B] mt-1">ca. 130 ha</p>
            <span className="text-[10px] text-[#637381]">Ø 48,0 t/ha</span>
          </div>

          <div className="bg-white p-4 rounded-3xl border border-[#e3ede5] shadow-xs">
            <span className="text-[11px] font-semibold text-[#637381]">{t('crops.cornFeed')}</span>
            <p className="text-lg font-bold text-[#2A3035] mt-1">ca. 70 ha</p>
            <span className="text-[10px] text-[#637381]">Ø 46,0 t/ha</span>
          </div>

          <div className="bg-white p-4 rounded-3xl border border-[#e3ede5] shadow-xs">
            <span className="text-[11px] font-semibold text-[#637381]">{t('crops.rapeseed')}</span>
            <p className="text-lg font-bold text-[#2A3035] mt-1">ca. 50 ha</p>
            <span className="text-[10px] text-[#637381]">Ø 3,9 t/ha</span>
          </div>

          <div className="bg-white p-4 rounded-3xl border border-[#e3ede5] shadow-xs">
            <span className="text-[11px] font-semibold text-[#637381]">{t('crops.sugarBeet')}</span>
            <p className="text-lg font-bold text-[#2A3035] mt-1">ca. 30 ha</p>
            <span className="text-[10px] text-[#637381]">Ø 78,0 t/ha</span>
          </div>
        </div>

        {/* View Toggle Tabs */}
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('FIELDS')}
            className={`px-5 py-2.5 rounded-full text-xs font-bold transition flex items-center gap-2 ${
              activeTab === 'FIELDS'
                ? 'bg-[#65BC7B] text-white shadow-sm'
                : 'bg-white text-[#2A3035] border border-[#e3ede5] hover:bg-[#f0f9f3]'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>{t('crops.fieldsTab')} ({fields.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('ECONOMICS')}
            className={`px-5 py-2.5 rounded-full text-xs font-bold transition flex items-center gap-2 ${
              activeTab === 'ECONOMICS'
                ? 'bg-[#65BC7B] text-white shadow-sm'
                : 'bg-white text-[#2A3035] border border-[#e3ede5] hover:bg-[#f0f9f3]'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>{t('crops.economicsTab')}</span>
          </button>
        </div>

        {/* Tab 1: Schlagkartei (Fields) with full CRUD */}
        {activeTab === 'FIELDS' && (
          <div className="bg-white rounded-3xl border border-[#e3ede5] shadow-sm overflow-hidden">
            <div className="p-5 border-b border-[#e3ede5] flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-[#2A3035]">
                  {t('crops.activeFields')}
                </h2>
                <p className="text-[11px] text-[#637381] mt-0.5">
                  {t('crops.parcelsDesc')}
                </p>
              </div>
              <span className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-[#f0f9f3] text-[#65BC7B] border border-[#65BC7B]/20">
                {t('crops.totalCultivated')}: {totalAreaHa.toFixed(1)} ha
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#f7fbf8] border-b border-[#e3ede5] text-[#637381] font-semibold">
                  <tr>
                    <th className="py-3 px-5">{t('crops.field')}</th>
                    <th className="py-3 px-4">{t('crops.fieldPlot')}</th>
                    <th className="py-3 px-4 text-right">{t('crops.area')}</th>
                    <th className="py-3 px-4 text-center">{t('crops.soilPoints')}</th>
                    <th className="py-3 px-4">{t('crops.locationDesc')}</th>
                    <th className="py-3 px-4 text-center">{t('common.status')}</th>
                    <th className="py-3 px-5 text-center">{t('common.actions')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e3ede5]">
                  {fields.map((f: any) => (
                    <tr key={f.id} className="hover:bg-[#f7fbf8] transition">
                      <td className="py-3.5 px-5 font-bold text-[#2A3035]">
                        {f.name}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-gray-600">
                        {f.fieldNumber}
                      </td>
                      <td className="py-3.5 px-4 text-right font-bold text-[#65BC7B]">
                        {Number(f.areaHa).toFixed(1)} ha
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                          {f.soilQualityScore || '55'} BP
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-gray-500 text-[11px]">
                        {f.locationDescription || 'Gemarkung Bockstedt'}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-[#65BC7B]">
                          Aktiv
                        </span>
                      </td>
                      <td className="py-3.5 px-5 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => handleOpenEdit(f)}
                            className="p-1.5 rounded-full hover:bg-gray-100 text-gray-600 transition"
                            title={t('common.edit')}
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteField(f.id)}
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
        )}

        {/* Tab 2: Economics / Deckungsbeitrag */}
        {activeTab === 'ECONOMICS' && (
          <div className="bg-white rounded-3xl border border-[#e3ede5] shadow-sm overflow-hidden">
            <div className="p-5 border-b border-[#e3ede5] flex items-center justify-between">
              <div>
                <h2 className="text-sm font-bold text-[#2A3035]">
                  {t('crops.economicsTab')}
                </h2>
                <p className="text-[11px] text-[#637381] mt-0.5">
                  {t('crops.economicsDesc')}
                </p>
              </div>
              <span className="text-xs font-bold text-[#65BC7B]">{t('crops.totalCultivated')}: ~440 ha</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#f7fbf8] border-b border-[#e3ede5] text-[#637381] font-semibold">
                  <tr>
                    <th className="py-3 px-5">{t('crops.field')}</th>
                    <th className="py-3 px-4">{t('crops.crop')}</th>
                    <th className="py-3 px-4 text-right">{t('crops.area')}</th>
                    <th className="py-3 px-4 text-right">{t('crops.yieldTonPerHa')}</th>
                    <th className="py-3 px-4 text-right">{t('crops.directCostPerHa')}</th>
                    <th className="py-3 px-4 text-right">{t('crops.revenuePerHa')}</th>
                    <th className="py-3 px-4 text-right">{t('crops.grossMarginPerHa')}</th>
                    <th className="py-3 px-5 text-right font-bold">{t('crops.grossMargin')} ({t('common.total')})</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#e3ede5]">
                  {seasons.map((s: any) => (
                    <tr key={s.id} className="hover:bg-[#f7fbf8] transition">
                      <td className="py-3.5 px-5 font-semibold text-[#2A3035]">
                        {s.field?.name || 'Schlag'}
                        <p className="text-[10px] text-[#637381] font-normal">
                          {s.field?.soilQualityScore || '55'} BP
                        </p>
                      </td>
                      <td className="py-3.5 px-4 text-[#2A3035] font-medium">
                        {s.cropName}
                      </td>
                      <td className="py-3.5 px-4 text-right font-medium text-[#2A3035]">
                        {s.areaHa} ha
                      </td>
                      <td className="py-3.5 px-4 text-right font-semibold text-gray-700">
                        {s.metrics?.yieldPerHa} t/ha
                      </td>
                      <td className="py-3.5 px-4 text-right text-rose-600 font-medium">
                        {formatCurrency(s.metrics?.costPerHa)}
                      </td>
                      <td className="py-3.5 px-4 text-right text-gray-700">
                        {formatCurrency(s.metrics?.revenuePerHa)}
                      </td>
                      <td className="py-3.5 px-4 text-right font-bold text-[#65BC7B]">
                        {formatCurrency(s.metrics?.grossMarginPerHa)}
                      </td>
                      <td className="py-3.5 px-5 text-right font-bold text-[#2A3035]">
                        {formatCurrency(s.grossMargin)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Modal: Add Field */}
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-[#e3ede5] space-y-4 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <h3 className="text-base font-bold text-[#2A3035]">
                  {t('crops.addField')}
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
                    {t('crops.field')} (Bezeichnung) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="z.B. Hünenheide Kamp, Am Moor..."
                    value={fieldForm.name}
                    onChange={(e) => setFieldForm({ ...fieldForm, name: e.target.value })}
                    className="w-full text-xs bg-white border border-[#e3ede5] rounded-xl px-3 py-2 text-[#2A3035] focus:outline-none focus:border-[#65BC7B]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#2A3035] mb-1">
                      {t('crops.area')} *
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      required
                      placeholder="z.B. 24.5"
                      value={fieldForm.areaHa}
                      onChange={(e) => setFieldForm({ ...fieldForm, areaHa: e.target.value })}
                      className="w-full text-xs bg-white border border-[#e3ede5] rounded-xl px-3 py-2 text-[#2A3035] focus:outline-none focus:border-[#65BC7B]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#2A3035] mb-1">
                      {t('crops.soilPoints')}
                    </label>
                    <input
                      type="number"
                      step="1"
                      placeholder="z.B. 55"
                      value={fieldForm.soilQualityScore}
                      onChange={(e) => setFieldForm({ ...fieldForm, soilQualityScore: e.target.value })}
                      className="w-full text-xs bg-white border border-[#e3ede5] rounded-xl px-3 py-2 text-[#2A3035] focus:outline-none focus:border-[#65BC7B]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#2A3035] mb-1">
                    Schlagnummer (optional)
                  </label>
                  <input
                    type="text"
                    placeholder="Wird automatisch vergeben (SCH-XXX)"
                    value={fieldForm.fieldNumber}
                    onChange={(e) => setFieldForm({ ...fieldForm, fieldNumber: e.target.value })}
                    className="w-full text-xs bg-white border border-[#e3ede5] rounded-xl px-3 py-2 text-[#2A3035] focus:outline-none focus:border-[#65BC7B]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#2A3035] mb-1">
                    Lage & Gemarkung
                  </label>
                  <input
                    type="text"
                    placeholder="Gemarkung Bockstedt, Flur 12"
                    value={fieldForm.locationDescription}
                    onChange={(e) => setFieldForm({ ...fieldForm, locationDescription: e.target.value })}
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

        {/* Modal: Edit Field */}
        {isEditModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-[#e3ede5] space-y-4 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <h3 className="text-base font-bold text-[#2A3035]">
                  {t('crops.editField')}
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
                    {t('crops.field')} (Bezeichnung) *
                  </label>
                  <input
                    type="text"
                    required
                    value={fieldForm.name}
                    onChange={(e) => setFieldForm({ ...fieldForm, name: e.target.value })}
                    className="w-full text-xs bg-white border border-[#e3ede5] rounded-xl px-3 py-2 text-[#2A3035] focus:outline-none focus:border-[#65BC7B]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#2A3035] mb-1">
                      {t('crops.area')} *
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      required
                      value={fieldForm.areaHa}
                      onChange={(e) => setFieldForm({ ...fieldForm, areaHa: e.target.value })}
                      className="w-full text-xs bg-white border border-[#e3ede5] rounded-xl px-3 py-2 text-[#2A3035] focus:outline-none focus:border-[#65BC7B]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#2A3035] mb-1">
                      {t('crops.soilPoints')}
                    </label>
                    <input
                      type="number"
                      step="1"
                      value={fieldForm.soilQualityScore}
                      onChange={(e) => setFieldForm({ ...fieldForm, soilQualityScore: e.target.value })}
                      className="w-full text-xs bg-white border border-[#e3ede5] rounded-xl px-3 py-2 text-[#2A3035] focus:outline-none focus:border-[#65BC7B]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#2A3035] mb-1">
                    Schlagnummer
                  </label>
                  <input
                    type="text"
                    value={fieldForm.fieldNumber}
                    onChange={(e) => setFieldForm({ ...fieldForm, fieldNumber: e.target.value })}
                    className="w-full text-xs bg-white border border-[#e3ede5] rounded-xl px-3 py-2 text-[#2A3035] focus:outline-none focus:border-[#65BC7B]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#2A3035] mb-1">
                    Lage & Gemarkung
                  </label>
                  <input
                    type="text"
                    value={fieldForm.locationDescription}
                    onChange={(e) => setFieldForm({ ...fieldForm, locationDescription: e.target.value })}
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
