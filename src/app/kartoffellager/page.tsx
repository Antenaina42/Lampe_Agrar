'use client';

import React, { useEffect, useState } from 'react';
import { AppLayout } from '@/components/AppLayout';
import { useI18n } from '@/lib/i18n';
import {
  Package,
  PlusCircle,
  Truck,
  AlertTriangle,
  CheckCircle2,
  X,
  Warehouse,
} from 'lucide-react';

export default function KartoffellagerPage() {
  const { t, formatCurrency, formatDate } = useI18n();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [outflowModalLot, setOutflowModalLot] = useState<any | null>(null);
  const [weightTons, setWeightTons] = useState('');
  const [pricePerTon, setPricePerTon] = useState('115');
  const [destination, setDestination] = useState('Emsland Stärke Emlichheim');
  const [movementType, setMovementType] = useState('OUTGOING_SALE');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchStorageData = () => {
    fetch('/api/storage')
      .then((res) => res.json())
      .then((json) => {
        setData(json);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchStorageData();
  }, []);

  const handleOutflowSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!outflowModalLot || !weightTons) return;

    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch('/api/storage', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lotId: outflowModalLot.id,
          movementType,
          weightTons: parseFloat(weightTons),
          pricePerTon: parseFloat(pricePerTon),
          destination,
        }),
      });

      const resJson = await res.json();
      if (!res.ok) {
        throw new Error(resJson.error || 'Fehler beim Buchen');
      }

      setOutflowModalLot(null);
      setWeightTons('');
      fetchStorageData();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const lots = data?.lots || [];

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-xl font-bold text-[#212921] tracking-tight">
            {t('potatoStorage.title')}
          </h1>
          <p className="text-xs text-[#5c6e5c] mt-0.5">
            {t('potatoStorage.subtitle')}
          </p>
        </div>

        {/* Storage Capacity & Stock Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-[#e2e8df] shadow-sm">
            <span className="text-xs font-semibold text-gray-500">
              {t('potatoStorage.totalStored')}
            </span>
            <p className="text-2xl font-bold text-[#226c3d] mt-1">
              {data?.totalStored?.toLocaleString('de-DE') || '3.500'} t
            </p>
            <p className="text-[11px] text-gray-400 mt-1">
              Industriekartoffeln (Stärkegehalt ~18%)
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#e2e8df] shadow-sm">
            <span className="text-xs font-semibold text-gray-500">
              {t('potatoStorage.hall1')}
            </span>
            <p className="text-lg font-bold text-gray-800 mt-1">Halle 1: 1.350 t verbleibend</p>
            <p className="text-[11px] text-gray-400 mt-1">Hallenfüller & Belüftungsboden</p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-[#e2e8df] shadow-sm">
            <span className="text-xs font-semibold text-gray-500">
              {t('potatoStorage.hall2')}
            </span>
            <p className="text-lg font-bold text-gray-800 mt-1">Halle 2: 2.150 t verbleibend</p>
            <p className="text-[11px] text-gray-400 mt-1">Sturzbunker & Förderbänder</p>
          </div>
        </div>

        {/* Protection Note */}
        <div className="flex items-center gap-2 p-3 bg-emerald-50/60 rounded-xl border border-emerald-100 text-xs text-emerald-800">
          <CheckCircle2 className="w-4 h-4 text-[#226c3d] shrink-0" />
          <span>
            {t('potatoStorage.preventNegativeStock')}
          </span>
        </div>

        {/* Lots Table */}
        <div className="bg-white rounded-3xl border border-[#e3ede5] shadow-sm overflow-hidden">
          <div className="p-4 border-b border-[#e3ede5] bg-[#fbfcfb] flex items-center justify-between">
            <h2 className="text-xs font-bold text-[#2A3035]">{t('potatoStorage.title')} ({t('crops.season')} 2026)</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#f8faf7] border-b border-[#e3ede5] text-[#637381] font-semibold">
                <tr>
                  <th className="py-3 px-4">{t('potatoStorage.lotNumber')}</th>
                  <th className="py-3 px-4">{t('crops.crop')} / {t('crops.fieldPlot')}</th>
                  <th className="py-3 px-4">{t('inventory.storageLocation')}</th>
                  <th className="py-3 px-4 text-right">{t('potatoStorage.initialWeight')}</th>
                  <th className="py-3 px-4 text-right">{t('potatoStorage.sortingLoss')}</th>
                  <th className="py-3 px-4 text-right">{t('potatoStorage.remainingWeight')}</th>
                  <th className="py-3 px-4 text-center">{t('common.status') || 'Status'}</th>
                  <th className="py-3 px-4 text-right">{t('common.actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {lots.map((lot: any) => (
                  <tr key={lot.id} className="hover:bg-[#fbfcfb] transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-[#2A3035]">
                      {lot.lotNumber}
                    </td>
                    <td className="py-3.5 px-4 font-medium text-[#2A3035]">
                      {lot.cropType}
                      <p className="text-[10px] text-gray-400">{lot.originFieldInfo}</p>
                    </td>
                    <td className="py-3.5 px-4 text-gray-600">{lot.storageLocation}</td>
                    <td className="py-3.5 px-4 text-right font-medium">
                      {Number(lot.initialWeightTons).toFixed(1)} t
                    </td>
                    <td className="py-3.5 px-4 text-right text-amber-700">
                      {Number(lot.storageLossTons).toFixed(1)} t
                    </td>
                    <td className="py-3.5 px-4 text-right font-bold text-[#65BC7B] text-sm">
                      {Number(lot.remainingWeightTons).toFixed(1)} t
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#f0f9f3] text-[#65BC7B] border border-[#65BC7B]/20">
                        {lot.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => {
                          setOutflowModalLot(lot);
                          setWeightTons('');
                          setError(null);
                        }}
                        className="px-3.5 py-1.5 text-[11px] font-bold bg-[#65BC7B] text-white hover:bg-[#52a366] rounded-full transition-colors shadow-2xs"
                      >
                        {t('potatoStorage.outflowSale')}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal: Outflow Dispatch */}
        {outflowModalLot && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 border border-[#e0e6dd] animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-gray-800">
                  Auslagerung / Verkauf erfassen
                </h3>
                <button
                  onClick={() => setOutflowModalLot(null)}
                  className="p-1 rounded-lg text-gray-400 hover:text-gray-700"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {error && (
                <div className="p-3 text-xs bg-red-50 text-red-700 rounded-xl border border-red-200 mb-3 flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleOutflowSubmit} className="space-y-4">
                <div className="p-2.5 rounded-xl bg-[#f8faf7] border border-[#e2e8df] text-xs">
                  <span className="text-gray-500">Partie:</span>{' '}
                  <strong>{outflowModalLot.lotNumber}</strong>
                  <br />
                  <span className="text-gray-500">Maximal verfügbar:</span>{' '}
                  <strong className="text-[#226c3d]">
                    {Number(outflowModalLot.remainingWeightTons).toFixed(1)} t
                  </strong>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    {t('potatoStorage.bookingType')}
                  </label>
                  <select
                    value={movementType}
                    onChange={(e) => setMovementType(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-gray-300 rounded-lg"
                  >
                    <option value="OUTGOING_SALE">{t('potatoStorage.saleToCustomer')}</option>
                    <option value="LOSS_SORTING">{t('potatoStorage.lossSorting')}</option>
                    <option value="CLEANING_LOSS">{t('potatoStorage.lossCleaning')}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    {t('potatoStorage.weightTons')}
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    required
                    placeholder="z.B. 25.5"
                    value={weightTons}
                    onChange={(e) => setWeightTons(e.target.value)}
                    className="w-full text-xs px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#226c3d]/20 focus:border-[#226c3d]"
                  />
                </div>

                {movementType === 'OUTGOING_SALE' && (
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      {t('potatoStorage.sellingPrice')}
                    </label>
                    <input
                      type="number"
                      step="0.5"
                      value={pricePerTon}
                      onChange={(e) => setPricePerTon(e.target.value)}
                      className="w-full text-xs px-3 py-2 border border-gray-300 rounded-lg"
                    />
                  </div>
                )}

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setOutflowModalLot(null)}
                    className="px-3 py-2 text-xs text-gray-600 hover:bg-gray-100 rounded-lg"
                  >
                    {t('common.cancel')}
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-4 py-2 text-xs font-bold text-white bg-[#226c3d] hover:bg-[#1b5e20] rounded-lg disabled:opacity-50"
                  >
                    {submitting ? t('common.loading') : t('potatoStorage.confirmOutflow')}
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
