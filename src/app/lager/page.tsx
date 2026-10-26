'use client';

import React, { useEffect, useState } from 'react';
import { AppLayout } from '@/components/AppLayout';
import { useI18n } from '@/lib/i18n';
import {
  Package,
  AlertTriangle,
  Plus,
  Pencil,
  Trash2,
  Fuel,
  ArrowDownRight,
  ArrowUpRight,
  CheckCircle2,
  ShieldCheck,
  Layers
} from 'lucide-react';

export default function LagerPage() {
  const { t, formatCurrency } = useI18n();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState<string>('ALL');

  // Item CRUD modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [itemForm, setItemForm] = useState({
    name: '',
    category: 'ANIMAL_FEED',
    unit: 'kg',
    currentQuantity: '1000',
    minStockThreshold: '200',
    averageUnitPrice: '1.50',
    storageLocation: 'Hof Drentwede',
  });

  // Movement modal
  const [isMovementModalOpen, setIsMovementModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [movementForm, setMovementForm] = useState({
    movementType: 'USAGE_CROPS',
    quantity: '',
    unitPrice: '',
    notes: '',
  });

  const loadData = () => {
    fetch('/api/inventory')
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

  const handleOpenAdd = () => {
    setItemForm({
      name: '',
      category: 'ANIMAL_FEED',
      unit: 'kg',
      currentQuantity: '1000',
      minStockThreshold: '200',
      averageUnitPrice: '1.50',
      storageLocation: 'Hof Drentwede',
    });
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (item: any) => {
    setEditingItem(item);
    setItemForm({
      name: item.name,
      category: item.category,
      unit: item.unit,
      currentQuantity: String(item.currentQuantity),
      minStockThreshold: String(item.minStockThreshold || 0),
      averageUnitPrice: String(item.averageUnitPrice),
      storageLocation: item.storageLocation || 'Hof Drentwede',
    });
    setIsEditModalOpen(true);
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/inventory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(itemForm),
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
    if (!editingItem) return;
    try {
      const res = await fetch('/api/inventory', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingItem.id,
          ...itemForm,
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

  const handleDeleteItem = async (id: string) => {
    if (!confirm(t('common.confirmDelete'))) return;
    try {
      const res = await fetch(`/api/inventory?id=${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        loadData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleOpenMovement = (item: any) => {
    setSelectedItem(item);
    setMovementForm({
      movementType: 'USAGE_CROPS',
      quantity: '',
      unitPrice: String(item.averageUnitPrice),
      notes: '',
    });
    setIsMovementModalOpen(true);
  };

  const handleMovementSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItem) return;

    try {
      const res = await fetch('/api/inventory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'MOVEMENT',
          itemId: selectedItem.id,
          movementType: movementForm.movementType,
          quantity: movementForm.quantity,
          unitPrice: movementForm.unitPrice,
          notes: movementForm.notes,
        }),
      });

      if (res.ok) {
        setIsMovementModalOpen(false);
        loadData();
      } else {
        const err = await res.json();
        alert(err.error || 'Fehler beim Buchen');
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getCategoryLabel = (cat: string) => {
    switch (cat) {
      case 'SEEDS':
        return t('inventory.catSeeds');
      case 'FERTILIZER':
        return t('inventory.catFertilizer');
      case 'PESTICIDES':
        return t('inventory.catPesticides');
      case 'ANIMAL_FEED':
        return t('inventory.catAnimalFeed');
      case 'STRAW_BEDDING':
        return t('inventory.catStraw');
      case 'FUEL':
        return t('inventory.catFuel');
      case 'SPARE_PARTS':
        return t('inventory.catSpareParts');
      case 'WORKSHOP_SUPPLIES':
        return t('inventory.catWorkshop');
      default:
        return cat;
    }
  };

  const filteredItems = (data?.items || []).filter((item: any) => {
    if (activeCategory === 'ALL') return true;
    return item.category === activeCategory;
  });

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#f0f9f3] text-[#65BC7B] shadow-sm">
              <Package className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#2A3035] tracking-tight">
                {t('inventory.title')}
              </h1>
              <p className="text-xs text-[#637381] mt-0.5">
                {t('inventory.subtitle')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleOpenAdd}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#65BC7B] text-white text-xs font-bold hover:bg-[#52a366] transition shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>{t('inventory.addItem')}</span>
            </button>
          </div>
        </div>

        {/* Low Stock Alerts */}
        {data?.lowStockItems && data.lowStockItems.length > 0 && (
          <div className="p-4 rounded-3xl bg-amber-50 border border-amber-200">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-amber-700" />
              <h2 className="text-xs font-bold text-amber-900">
                {t('inventory.minThresholdAlert')} ({data.lowStockItems.length} Artikel)
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
              {data.lowStockItems.map((item: any) => (
                <div key={item.id} className="p-3 rounded-2xl bg-white border border-amber-300 text-xs flex justify-between items-center shadow-2xs">
                  <div>
                    <p className="font-bold text-[#2A3035]">{item.name}</p>
                    <span className="text-[10px] text-amber-800 font-semibold">
                      Bestand: {Number(item.currentQuantity).toLocaleString('de-DE')} {item.unit} (Min: {Number(item.minStockThreshold).toLocaleString('de-DE')})
                    </span>
                  </div>
                  <button
                    onClick={() => handleOpenMovement(item)}
                    className="px-3 py-1 text-[10px] font-bold bg-amber-700 text-white rounded-full hover:bg-amber-800 transition"
                  >
                    Buchen
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Diesel Tank & Total Value Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Diesel Card */}
          {data?.fuelStatus && (
            <div className="bg-white p-5 rounded-3xl border border-[#e3ede5] shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-[#2A3035] flex items-center gap-1.5">
                    <Fuel className="w-4 h-4 text-[#65BC7B]" />
                    {t('inventory.dieselTankTitle')}
                  </span>
                  <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-[#f0f9f3] text-[#65BC7B] font-bold border border-[#65BC7B]/20">
                    {t('inventory.dieselActive')}
                  </span>
                </div>
                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-[#2A3035]">
                    {data.fuelStatus.currentLiters.toLocaleString('de-DE')} Liter
                  </span>
                  <span className="text-xs text-[#637381]">/ 10.000 l Tank</span>
                </div>
                {/* Progress bar */}
                <div className="w-full bg-[#f0f9f3] rounded-full h-2.5 mt-3 overflow-hidden">
                  <div
                    className={`h-2.5 rounded-full ${
                      data.fuelStatus.currentLiters < data.fuelStatus.minThreshold
                        ? 'bg-amber-500'
                        : 'bg-[#65BC7B]'
                    }`}
                    style={{ width: `${Math.min(100, (data.fuelStatus.currentLiters / 10000) * 100)}%` }}
                  />
                </div>
              </div>
              <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] text-[#637381]">
                <span>{t('inventory.dieselAveragePrice')}: {formatCurrency(data.fuelStatus.unitPrice)} / l</span>
                <span className="font-bold text-[#2A3035]">{t('inventory.dieselValue')}: {formatCurrency(data.fuelStatus.totalValue)}</span>
              </div>
            </div>
          )}

          {/* Total Value */}
          <div className="bg-white p-5 rounded-3xl border border-[#e3ede5] shadow-xs flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold text-[#2A3035] flex items-center gap-1.5">
                <Package className="w-4 h-4 text-[#65BC7B]" />
                {t('inventory.totalValue')}
              </span>
              <p className="text-2xl font-bold text-[#65BC7B] mt-2">
                {formatCurrency(data?.totalStockValue || 0)}
              </p>
              <p className="text-xs text-[#637381] mt-1">
                Gebundenes Umlaufvermögen (Saatgut, Dünger, PSM, Futter & Kraftstoff)
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-gray-100 text-[11px] text-[#637381]">
              Bewertung zu gleitenden Durchschnittspreisen
            </div>
          </div>

          {/* Article Count */}
          <div className="bg-white p-5 rounded-3xl border border-[#e3ede5] shadow-xs flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold text-[#2A3035]">{t('inventory.managedSupplies')}</span>
              <p className="text-2xl font-bold text-[#2A3035] mt-2">
                {data?.items?.length || 0} {t('inventory.stockArticles')}
              </p>
              <p className="text-xs text-[#637381] mt-1">
                {t('inventory.batchTracking')}
              </p>
            </div>
            <div className="mt-4 pt-3 border-t border-gray-100 text-[11px] text-[#637381]">
              {t('inventory.locations')}
            </div>
          </div>
        </div>

        {/* Categories Tabs (Avada Pills) */}
        <div className="flex flex-wrap gap-1.5 p-1.5 bg-white rounded-2xl border border-[#e3ede5] text-xs">
          {['ALL', 'ANIMAL_FEED', 'FERTILIZER', 'PESTICIDES', 'SEEDS', 'FUEL', 'STRAW_BEDDING', 'SPARE_PARTS'].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full font-bold transition ${
                activeCategory === cat
                  ? 'bg-[#65BC7B] text-white shadow-xs'
                  : 'text-[#637381] hover:bg-[#f0f9f3] hover:text-[#2A3035]'
              }`}
            >
              {cat === 'ALL' ? t('inventory.allArticles') : getCategoryLabel(cat)}
            </button>
          ))}
        </div>

        {/* Table of items with Full CRUD */}
        <div className="bg-white rounded-3xl border border-[#e3ede5] shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#f7fbf8] text-[#637381] font-semibold border-b border-[#e3ede5]">
                <tr>
                  <th className="py-3 px-5">{t('inventory.itemCode')}</th>
                  <th className="py-3 px-4">{t('inventory.itemName')}</th>
                  <th className="py-3 px-4">{t('inventory.category')}</th>
                  <th className="py-3 px-4 text-right">{t('inventory.currentQuantity')}</th>
                  <th className="py-3 px-4 text-right">{t('inventory.minStockThreshold')}</th>
                  <th className="py-3 px-4 text-right">{t('inventory.averageUnitPrice')}</th>
                  <th className="py-3 px-4 text-right font-bold">{t('common.total')}</th>
                  <th className="py-3 px-4">{t('inventory.storageLocation')}</th>
                  <th className="py-3 px-5 text-center">{t('common.actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#e3ede5]">
                {loading ? (
                  <tr>
                    <td colSpan={9} className="py-12 text-center text-gray-400">
                      {t('common.loading')}
                    </td>
                  </tr>
                ) : filteredItems.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="py-12 text-center text-gray-400">
                      Keine Artikel in dieser Kategorie
                    </td>
                  </tr>
                ) : (
                  filteredItems.map((item: any) => {
                    const isLow = Number(item.currentQuantity) <= Number(item.minStockThreshold) && Number(item.minStockThreshold) > 0;
                    return (
                      <tr key={item.id} className="hover:bg-[#f7fbf8] transition">
                        <td className="py-3.5 px-5 font-mono text-gray-600 font-semibold">{item.itemCode}</td>
                        <td className="py-3.5 px-4 font-bold text-[#2A3035]">{item.name}</td>
                        <td className="py-3.5 px-4 text-gray-600">{getCategoryLabel(item.category)}</td>
                        <td className={`py-3.5 px-4 text-right font-bold ${isLow ? 'text-amber-700' : 'text-[#2A3035]'}`}>
                          {Number(item.currentQuantity).toLocaleString('de-DE')} {item.unit}
                        </td>
                        <td className="py-3.5 px-4 text-right text-gray-500">
                          {Number(item.minStockThreshold).toLocaleString('de-DE')} {item.unit}
                        </td>
                        <td className="py-3.5 px-4 text-right text-gray-600">
                          {formatCurrency(item.averageUnitPrice)} / {item.unit}
                        </td>
                        <td className="py-3.5 px-4 text-right font-bold text-[#65BC7B]">
                          {formatCurrency(item.totalStockValue)}
                        </td>
                        <td className="py-3.5 px-4 text-gray-500">{item.storageLocation || '–'}</td>
                        <td className="py-3.5 px-5 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => handleOpenMovement(item)}
                              className="px-3 py-1 text-[11px] font-bold bg-[#f0f9f3] text-[#65BC7B] hover:bg-[#65BC7B] hover:text-white rounded-full transition border border-[#65BC7B]/20"
                            >
                              Buchen
                            </button>
                            <button
                              onClick={() => handleOpenEdit(item)}
                              className="p-1.5 rounded-full hover:bg-gray-100 text-gray-600 transition"
                              title={t('common.edit')}
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => handleDeleteItem(item.id)}
                              className="p-1.5 rounded-full hover:bg-rose-50 text-rose-600 transition"
                              title={t('common.delete')}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal: Add Item */}
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-[#e3ede5] space-y-4 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <h3 className="text-base font-bold text-[#2A3035]">
                  {t('inventory.addItem')}
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
                    {t('inventory.itemName')} *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="z.B. Maststarter Futtermehl, NPK-Dünger..."
                    value={itemForm.name}
                    onChange={(e) => setItemForm({ ...itemForm, name: e.target.value })}
                    className="w-full text-xs bg-white border border-[#e3ede5] rounded-xl px-3 py-2 text-[#2A3035] focus:outline-none focus:border-[#65BC7B]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#2A3035] mb-1">
                      {t('inventory.category')}
                    </label>
                    <select
                      value={itemForm.category}
                      onChange={(e) => setItemForm({ ...itemForm, category: e.target.value })}
                      className="w-full text-xs bg-white border border-[#e3ede5] rounded-xl px-3 py-2 text-[#2A3035] focus:outline-none focus:border-[#65BC7B]"
                    >
                      <option value="ANIMAL_FEED">{t('inventory.catAnimalFeed')}</option>
                      <option value="FERTILIZER">{t('inventory.catFertilizer')}</option>
                      <option value="PESTICIDES">{t('inventory.catPesticides')}</option>
                      <option value="SEEDS">{t('inventory.catSeeds')}</option>
                      <option value="FUEL">{t('inventory.catFuel')}</option>
                      <option value="STRAW_BEDDING">{t('inventory.catStraw')}</option>
                      <option value="SPARE_PARTS">{t('inventory.catSpareParts')}</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#2A3035] mb-1">
                      Einheit (z.B. kg, l, t)
                    </label>
                    <input
                      type="text"
                      required
                      value={itemForm.unit}
                      onChange={(e) => setItemForm({ ...itemForm, unit: e.target.value })}
                      className="w-full text-xs bg-white border border-[#e3ede5] rounded-xl px-3 py-2 text-[#2A3035] focus:outline-none focus:border-[#65BC7B]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#2A3035] mb-1">
                      {t('inventory.currentQuantity')} *
                    </label>
                    <input
                      type="number"
                      step="any"
                      required
                      value={itemForm.currentQuantity}
                      onChange={(e) => setItemForm({ ...itemForm, currentQuantity: e.target.value })}
                      className="w-full text-xs bg-white border border-[#e3ede5] rounded-xl px-3 py-2 text-[#2A3035] focus:outline-none focus:border-[#65BC7B]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#2A3035] mb-1">
                      {t('inventory.minStockThreshold')}
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={itemForm.minStockThreshold}
                      onChange={(e) => setItemForm({ ...itemForm, minStockThreshold: e.target.value })}
                      className="w-full text-xs bg-white border border-[#e3ede5] rounded-xl px-3 py-2 text-[#2A3035] focus:outline-none focus:border-[#65BC7B]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#2A3035] mb-1">
                      Ø Preis (€)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={itemForm.averageUnitPrice}
                      onChange={(e) => setItemForm({ ...itemForm, averageUnitPrice: e.target.value })}
                      className="w-full text-xs bg-white border border-[#e3ede5] rounded-xl px-3 py-2 text-[#2A3035] focus:outline-none focus:border-[#65BC7B]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#2A3035] mb-1">
                    {t('inventory.storageLocation')}
                  </label>
                  <input
                    type="text"
                    value={itemForm.storageLocation}
                    onChange={(e) => setItemForm({ ...itemForm, storageLocation: e.target.value })}
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

        {/* Modal: Edit Item */}
        {isEditModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-[#e3ede5] space-y-4 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <h3 className="text-base font-bold text-[#2A3035]">
                  {t('inventory.editItem')} ({editingItem?.name})
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
                    {t('inventory.itemName')} *
                  </label>
                  <input
                    type="text"
                    required
                    value={itemForm.name}
                    onChange={(e) => setItemForm({ ...itemForm, name: e.target.value })}
                    className="w-full text-xs bg-white border border-[#e3ede5] rounded-xl px-3 py-2 text-[#2A3035] focus:outline-none focus:border-[#65BC7B]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#2A3035] mb-1">
                      {t('inventory.category')}
                    </label>
                    <select
                      value={itemForm.category}
                      onChange={(e) => setItemForm({ ...itemForm, category: e.target.value })}
                      className="w-full text-xs bg-white border border-[#e3ede5] rounded-xl px-3 py-2 text-[#2A3035] focus:outline-none focus:border-[#65BC7B]"
                    >
                      <option value="ANIMAL_FEED">{t('inventory.catAnimalFeed')}</option>
                      <option value="FERTILIZER">{t('inventory.catFertilizer')}</option>
                      <option value="PESTICIDES">{t('inventory.catPesticides')}</option>
                      <option value="SEEDS">{t('inventory.catSeeds')}</option>
                      <option value="FUEL">{t('inventory.catFuel')}</option>
                      <option value="STRAW_BEDDING">{t('inventory.catStraw')}</option>
                      <option value="SPARE_PARTS">{t('inventory.catSpareParts')}</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#2A3035] mb-1">
                      Einheit
                    </label>
                    <input
                      type="text"
                      required
                      value={itemForm.unit}
                      onChange={(e) => setItemForm({ ...itemForm, unit: e.target.value })}
                      className="w-full text-xs bg-white border border-[#e3ede5] rounded-xl px-3 py-2 text-[#2A3035] focus:outline-none focus:border-[#65BC7B]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#2A3035] mb-1">
                      {t('inventory.currentQuantity')} *
                    </label>
                    <input
                      type="number"
                      step="any"
                      required
                      value={itemForm.currentQuantity}
                      onChange={(e) => setItemForm({ ...itemForm, currentQuantity: e.target.value })}
                      className="w-full text-xs bg-white border border-[#e3ede5] rounded-xl px-3 py-2 text-[#2A3035] focus:outline-none focus:border-[#65BC7B]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#2A3035] mb-1">
                      {t('inventory.minStockThreshold')}
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={itemForm.minStockThreshold}
                      onChange={(e) => setItemForm({ ...itemForm, minStockThreshold: e.target.value })}
                      className="w-full text-xs bg-white border border-[#e3ede5] rounded-xl px-3 py-2 text-[#2A3035] focus:outline-none focus:border-[#65BC7B]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#2A3035] mb-1">
                      Ø Preis (€)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={itemForm.averageUnitPrice}
                      onChange={(e) => setItemForm({ ...itemForm, averageUnitPrice: e.target.value })}
                      className="w-full text-xs bg-white border border-[#e3ede5] rounded-xl px-3 py-2 text-[#2A3035] focus:outline-none focus:border-[#65BC7B]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#2A3035] mb-1">
                    {t('inventory.storageLocation')}
                  </label>
                  <input
                    type="text"
                    value={itemForm.storageLocation}
                    onChange={(e) => setItemForm({ ...itemForm, storageLocation: e.target.value })}
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

        {/* Modal: Movement */}
        {isMovementModalOpen && selectedItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-[#e3ede5] space-y-4 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <h3 className="text-base font-bold text-[#2A3035]">
                  Lagerbuchung: {selectedItem.name}
                </h3>
                <button
                  onClick={() => setIsMovementModalOpen(false)}
                  className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 font-bold"
                >
                  ✕
                </button>
              </div>

              <p className="text-xs text-[#637381]">
                Aktueller Bestand: {Number(selectedItem.currentQuantity).toLocaleString('de-DE')} {selectedItem.unit}
              </p>

              <form onSubmit={handleMovementSubmit} className="space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-[#2A3035] mb-1">
                    Buchungsart
                  </label>
                  <select
                    value={movementForm.movementType}
                    onChange={(e) => setMovementForm({ ...movementForm, movementType: e.target.value })}
                    className="w-full text-xs bg-white border border-[#e3ede5] rounded-xl px-3 py-2 text-[#2A3035] focus:outline-none focus:border-[#65BC7B]"
                  >
                    <option value="PURCHASE_RECEIPT">Wareneingang / Lieferung (+)</option>
                    <option value="USAGE_CROPS">Verbrauch Ackerbau (-)</option>
                    <option value="USAGE_PIGS">Verbrauch Schweinemast (-)</option>
                    <option value="USAGE_MACHINES">Verbrauch Maschinen / Fuhrpark (-)</option>
                    <option value="ADJUSTMENT">Inventur-Korrektur</option>
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#2A3035] mb-1">
                      Menge ({selectedItem.unit}) *
                    </label>
                    <input
                      type="number"
                      step="any"
                      required
                      value={movementForm.quantity}
                      onChange={(e) => setMovementForm({ ...movementForm, quantity: e.target.value })}
                      className="w-full text-xs bg-white border border-[#e3ede5] rounded-xl px-3 py-2 text-[#2A3035] focus:outline-none focus:border-[#65BC7B]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#2A3035] mb-1">
                      Preis / Einheit (€)
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={movementForm.unitPrice}
                      onChange={(e) => setMovementForm({ ...movementForm, unitPrice: e.target.value })}
                      className="w-full text-xs bg-white border border-[#e3ede5] rounded-xl px-3 py-2 text-[#2A3035] focus:outline-none focus:border-[#65BC7B]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#2A3035] mb-1">
                    Bemerkung / Beleg-Nr.
                  </label>
                  <input
                    type="text"
                    value={movementForm.notes}
                    onChange={(e) => setMovementForm({ ...movementForm, notes: e.target.value })}
                    className="w-full text-xs bg-white border border-[#e3ede5] rounded-xl px-3 py-2 text-[#2A3035] focus:outline-none focus:border-[#65BC7B]"
                    placeholder="z.B. Lieferschein AGRAVIS 89234"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setIsMovementModalOpen(false)}
                    className="px-4 py-2 rounded-full border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-50 transition"
                  >
                    {t('common.cancel')}
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-full bg-[#65BC7B] text-white text-xs font-bold hover:bg-[#52a366] transition shadow-sm"
                  >
                    Buchen
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
