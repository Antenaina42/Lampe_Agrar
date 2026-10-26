'use client';

import React, { useState } from 'react';
import { useI18n } from '@/lib/i18n';
import { PlusCircle, X, Check, Euro } from 'lucide-react';

interface QuickBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function QuickBookingModal({ isOpen, onClose, onSuccess }: QuickBookingModalProps) {
  const { t } = useI18n();
  const [type, setType] = useState<'REVENUE' | 'EXPENSE'>('REVENUE');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [description, setDescription] = useState('');
  const [amountNet, setAmountNet] = useState('');
  const [vatRate, setVatRate] = useState('10.7'); // Default agricultural flat rate
  const [categoryKey, setCategoryKey] = useState('REV_POTATO_SALES');
  const [activity, setActivity] = useState('POTATO_STORAGE');
  const [paymentMethod, setPaymentMethod] = useState('BANK_TRANSFER');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const netNum = parseFloat(amountNet) || 0;
  const rateNum = parseFloat(vatRate) || 0;
  const vatAmount = (netNum * rateNum) / 100;
  const grossAmount = netNum + vatAmount;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || netNum <= 0) {
      setError(t('common.error'));
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type,
          date,
          description,
          amountNet: netNum,
          vatRate: rateNum,
          vatAmount,
          amountGross: grossAmount,
          categoryKey,
          activity,
          paymentMethod,
        }),
      });

      if (!res.ok) {
        throw new Error(t('common.error'));
      }

      setDescription('');
      setAmountNet('');
      if (onSuccess) onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || t('common.error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-[#e3ede5] animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between px-6 py-4 bg-[#f8faf7] border-b border-[#e5ebe2]">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-[#f0f9f3] flex items-center justify-center text-[#65BC7B]">
              <PlusCircle className="w-5 h-5" />
            </div>
            <h2 className="text-base font-extrabold text-[#2A3035]">
              {t('navigation.newBooking')}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 font-bold transition-colors"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 text-xs bg-rose-50 text-rose-700 rounded-2xl border border-rose-200">
              {error}
            </div>
          )}

          {/* Type Toggle */}
          <div className="grid grid-cols-2 gap-2 p-1.5 bg-[#f0f9f3] rounded-full border border-[#e3ede5]">
            <button
              type="button"
              onClick={() => {
                setType('REVENUE');
                setCategoryKey('REV_POTATO_SALES');
                setActivity('POTATO_STORAGE');
                setVatRate('10.7');
              }}
              className={`py-2 text-xs font-bold rounded-full transition-all ${
                type === 'REVENUE'
                  ? 'bg-[#65BC7B] text-white shadow-xs'
                  : 'text-gray-600 hover:text-[#2A3035]'
              }`}
            >
              {t('navigation.einnahmen')}
            </button>
            <button
              type="button"
              onClick={() => {
                setType('EXPENSE');
                setCategoryKey('EXP_FEED');
                setActivity('LIVESTOCK');
                setVatRate('7.0');
              }}
              className={`py-2 text-xs font-bold rounded-full transition-all ${
                type === 'EXPENSE'
                  ? 'bg-[#65BC7B] text-white shadow-xs'
                  : 'text-gray-600 hover:text-[#2A3035]'
              }`}
            >
              {t('navigation.ausgaben')}
            </button>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#2A3035] mb-1">
                {t('common.date')}
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="w-full text-xs px-3 py-2 bg-white border border-[#e3ede5] rounded-xl focus:outline-none focus:border-[#65BC7B]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#2A3035] mb-1">
                {t('revenues.activity')}
              </label>
              <select
                value={activity}
                onChange={(e) => setActivity(e.target.value)}
                className="w-full text-xs px-3 py-2 bg-white border border-[#e3ede5] rounded-xl focus:outline-none focus:border-[#65BC7B]"
              >
                <option value="POTATO_STORAGE">{t('navigation.kartoffellager')}</option>
                <option value="LIVESTOCK">{t('navigation.schweinemast')}</option>
                <option value="CROPS">{t('navigation.ackerbau')}</option>
                <option value="MACHINERY">{t('navigation.maschinen')}</option>
                <option value="GENERAL">{t('common.all')}</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#2A3035] mb-1">
              {t('common.notes')}
            </label>
            <input
              type="text"
              placeholder={t('common.notes')}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              className="w-full text-xs px-3 py-2 bg-white border border-[#e3ede5] rounded-xl focus:outline-none focus:border-[#65BC7B]"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#2A3035] mb-1">
                {t('common.net')} (€)
              </label>
              <input
                type="number"
                step="0.01"
                placeholder="0.00"
                value={amountNet}
                onChange={(e) => setAmountNet(e.target.value)}
                required
                className="w-full text-xs px-3 py-2 bg-white border border-[#e3ede5] rounded-xl focus:outline-none focus:border-[#65BC7B]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#2A3035] mb-1">
                {t('revenues.vatRate')}
              </label>
              <select
                value={vatRate}
                onChange={(e) => setVatRate(e.target.value)}
                className="w-full text-xs px-3 py-2 bg-white border border-[#e3ede5] rounded-xl focus:outline-none focus:border-[#65BC7B]"
              >
                <option value="10.7">{t('vatRates.flatRate')}</option>
                <option value="19.0">{t('vatRates.standard')}</option>
                <option value="7.0">{t('vatRates.reduced')}</option>
                <option value="0.0">{t('vatRates.zero')}</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-[#2A3035] mb-1">
                {t('common.gross')} (€)
              </label>
              <input
                type="text"
                readOnly
                value={grossAmount.toFixed(2) + ' €'}
                className="w-full text-xs px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 font-bold"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#2A3035] mb-1">
                {t('revenues.category')}
              </label>
              <select
                value={categoryKey}
                onChange={(e) => setCategoryKey(e.target.value)}
                className="w-full text-xs px-3 py-2 bg-white border border-[#e3ede5] rounded-xl focus:outline-none focus:border-[#65BC7B]"
              >
                {type === 'REVENUE' ? (
                  <>
                    <option value="REV_POTATO_SALES">{t('categories.REV_POTATO_SALES')}</option>
                    <option value="REV_PIG_SALES">{t('categories.REV_PIG_SALES')}</option>
                    <option value="REV_GRAIN_SALES">{t('categories.REV_GRAIN_SALES')}</option>
                    <option value="REV_RAPESEED_SALES">{t('categories.REV_RAPESEED_SALES')}</option>
                    <option value="REV_SUBSIDIES">{t('categories.REV_SUBSIDIES')}</option>
                    <option value="REV_OTHER">{t('categories.REV_OTHER')}</option>
                  </>
                ) : (
                  <>
                    <option value="EXP_FEED">{t('categories.EXP_FEED')}</option>
                    <option value="EXP_PIGLETS">{t('categories.EXP_PIGLETS')}</option>
                    <option value="EXP_VET">{t('categories.EXP_VET')}</option>
                    <option value="EXP_FUEL">{t('categories.EXP_FUEL')}</option>
                    <option value="EXP_FERTILIZER">{t('categories.EXP_FERTILIZER')}</option>
                    <option value="EXP_PESTICIDES">{t('categories.EXP_PESTICIDES')}</option>
                    <option value="EXP_MACHINERY_REPAIR">{t('categories.EXP_MACHINERY_REPAIR')}</option>
                    <option value="EXP_WAGES">{t('categories.EXP_WAGES')}</option>
                  </>
                )}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-[#2A3035] mb-1">
                {t('revenues.paymentMethod')}
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full text-xs px-3 py-2 bg-white border border-[#e3ede5] rounded-xl focus:outline-none focus:border-[#65BC7B]"
              >
                <option value="BANK_TRANSFER">{t('paymentMethods.BANK_TRANSFER')}</option>
                <option value="DIRECT_DEBIT">{t('paymentMethods.DIRECT_DEBIT')}</option>
                <option value="CASH">{t('paymentMethods.CASH')}</option>
                <option value="CARD">{t('paymentMethods.CARD')}</option>
              </select>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
            >
              {t('common.cancel')}
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 text-xs font-bold text-white bg-[#65BC7B] hover:bg-[#52a366] rounded-full transition-colors shadow-sm flex items-center gap-1.5 disabled:opacity-50"
            >
              {loading ? t('common.loading') : t('common.save')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
