'use client';

import React, { useEffect, useState } from 'react';
import { AppLayout } from '@/components/AppLayout';
import { useI18n } from '@/lib/i18n';
import {
  Tractor,
  Wrench,
  AlertTriangle,
  Clock,
  Fuel,
  Plus,
  ArrowLeft,
  Calendar,
  Euro,
  FileText,
  Trash2,
  Edit,
  CheckCircle2,
  ShieldAlert,
  ChevronRight,
  TrendingDown,
  Gauge,
  Sparkles,
} from 'lucide-react';

export default function MaschinenPage() {
  const { t, formatCurrency, formatDate } = useI18n();
  const [machines, setMachines] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMachine, setSelectedMachine] = useState<any | null>(null);
  const [activeCategory, setActiveCategory] = useState<string>('ALL');

  // Modals state
  const [isMachineModalOpen, setIsMachineModalOpen] = useState(false);
  const [isEditMachine, setIsEditMachine] = useState(false);
  const [machineForm, setMachineForm] = useState<any>({
    name: '',
    brand: 'Fendt',
    model: '',
    category: 'TRACTOR',
    machineCode: '',
    hp: '280',
    yearOfManufacture: '2023',
    purchasePrice: '285000',
    residualValue: '90000',
    depreciationYears: '8',
    currentHoursOrKm: '1240',
    fuelConsumptionPerUnit: '16.5',
    insuranceAnnual: '2800',
    maintenanceAnnual: '4500',
    nextMaintenanceDueHours: '1500',
  });

  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [isEditExpense, setIsEditExpense] = useState(false);
  const [expenseForm, setExpenseForm] = useState<any>({
    id: null,
    expenseType: 'MAINTENANCE',
    date: new Date().toISOString().split('T')[0],
    description: '',
    amountNet: '',
    vatRate: '19',
    operatingHours: '',
  });

  const loadMachines = () => {
    fetch('/api/machines')
      .then((res) => res.json())
      .then((json) => {
        setMachines(json.machines || []);
        if (selectedMachine) {
          const updated = (json.machines || []).find((m: any) => m.id === selectedMachine.id);
          if (updated) setSelectedMachine(updated);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    loadMachines();
  }, []);

  const openCreateMachine = () => {
    setIsEditMachine(false);
    setMachineForm({
      name: '',
      brand: 'Fendt',
      model: '',
      category: 'TRACTOR',
      machineCode: '',
      hp: '280',
      yearOfManufacture: '2023',
      purchasePrice: '285000',
      residualValue: '90000',
      depreciationYears: '8',
      currentHoursOrKm: '1240',
      fuelConsumptionPerUnit: '16.5',
      insuranceAnnual: '2800',
      maintenanceAnnual: '4500',
      nextMaintenanceDueHours: '1500',
    });
    setIsMachineModalOpen(true);
  };

  const openEditMachine = (m: any) => {
    setIsEditMachine(true);
    setMachineForm({
      id: m.id,
      name: m.name,
      brand: m.brand,
      model: m.model,
      category: m.category,
      machineCode: m.machineCode,
      hp: String(m.hp || ''),
      yearOfManufacture: String(m.yearOfManufacture || ''),
      purchasePrice: String(m.purchasePrice || '0'),
      residualValue: String(m.residualValue || '0'),
      depreciationYears: String(m.depreciationYears || '8'),
      currentHoursOrKm: String(m.currentHoursOrKm || '0'),
      fuelConsumptionPerUnit: String(m.fuelConsumptionPerUnit || '15'),
      insuranceAnnual: String(m.insuranceAnnual || '0'),
      maintenanceAnnual: String(m.maintenanceAnnual || '0'),
      nextMaintenanceDueHours: String(m.nextMaintenanceDueHours || ''),
    });
    setIsMachineModalOpen(true);
  };

  const handleMachineSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = '/api/machines';
      const method = isEditMachine ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(machineForm),
      });
      if (res.ok) {
        setIsMachineModalOpen(false);
        loadMachines();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteMachine = async (id: string) => {
    if (!confirm(t('common.confirmDelete'))) return;
    try {
      const res = await fetch(`/api/machines?id=${id}`, { method: 'DELETE' });
      if (res.ok) {
        if (selectedMachine?.id === id) setSelectedMachine(null);
        loadMachines();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Expense CRUD on Fiche d'engin
  const openCreateExpense = () => {
    setIsEditExpense(false);
    setExpenseForm({
      id: null,
      expenseType: 'MAINTENANCE',
      date: new Date().toISOString().split('T')[0],
      description: '',
      amountNet: '',
      vatRate: '19',
      operatingHours: String(selectedMachine?.currentHoursOrKm || ''),
    });
    setIsExpenseModalOpen(true);
  };

  const openEditExpense = (exp: any) => {
    setIsEditExpense(true);
    setExpenseForm({
      id: exp.id,
      expenseType: exp.expenseType,
      date: new Date(exp.date).toISOString().split('T')[0],
      description: exp.description,
      amountNet: String(exp.amountNet),
      vatRate: String(exp.vatAmount ? Math.round((Number(exp.vatAmount) / Number(exp.amountNet)) * 100) : '19'),
      operatingHours: String(exp.operatingHours || ''),
    });
    setIsExpenseModalOpen(true);
  };

  const handleExpenseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMachine) return;
    try {
      const url = '/api/machines/expenses';
      const method = isEditExpense ? 'PUT' : 'POST';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...expenseForm,
          machineId: selectedMachine.id,
        }),
      });
      if (res.ok) {
        setIsExpenseModalOpen(false);
        // Refresh single machine and full list
        fetch(`/api/machines?id=${selectedMachine.id}`)
          .then((r) => r.json())
          .then((json) => {
            if (json.machine) setSelectedMachine(json.machine);
            loadMachines();
          });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteExpense = async (expenseId: string) => {
    if (!confirm(t('common.confirmDelete'))) return;
    try {
      const res = await fetch(`/api/machines/expenses?id=${expenseId}`, { method: 'DELETE' });
      if (res.ok) {
        fetch(`/api/machines?id=${selectedMachine.id}`)
          .then((r) => r.json())
          .then((json) => {
            if (json.machine) setSelectedMachine(json.machine);
            loadMachines();
          });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getExpenseTypeBadge = (type: string) => {
    switch (type) {
      case 'FUEL':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#eef7fd] text-[#198fd9]">{t('machinery.expTypeFuel')}</span>;
      case 'MAINTENANCE':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#f0f9f3] text-[#52a366]">{t('machinery.expTypeMaintenance')}</span>;
      case 'REPAIR':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#fdf0f0] text-[#e65656]">{t('machinery.expTypeRepair')}</span>;
      case 'PARTS':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#fdf5ea] text-[#e6983b]">{t('machinery.expTypeParts')}</span>;
      case 'INSURANCE':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-purple-700">{t('machinery.expTypeInsurance')}</span>;
      case 'INSPECTION_TUV':
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-50 text-indigo-700">{t('machinery.expTypeTuv')}</span>;
      default:
        return <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-gray-100 text-gray-700">{type}</span>;
    }
  };

  const filteredMachines = machines.filter((m) => {
    if (activeCategory === 'ALL') return true;
    return m.category === activeCategory;
  });

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* ======================================================== */}
        {/* 1. FICHE D'ENGIN DETAIL VIEW (When a machine is selected) */}
        {/* ======================================================== */}
        {selectedMachine ? (
          <div className="space-y-6 animate-in fade-in duration-200">
            {/* Top Navigation & Actions on Fiche */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <button
                onClick={() => setSelectedMachine(null)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#e2ece4] bg-white text-[#2A3035] hover:bg-[#f0f9f3] hover:border-[#65BC7B] transition text-xs font-bold shadow-2xs"
              >
                <ArrowLeft className="w-4 h-4 text-[#65BC7B]" />
                <span>{t('machinery.backToFleet')}</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => openEditMachine(selectedMachine)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-[#e2ece4] bg-white text-[#2A3035] hover:bg-gray-50 text-xs font-bold shadow-2xs transition"
                >
                  <Edit className="w-3.5 h-3.5 text-gray-500" />
                  <span>{t('machinery.editMachine')}</span>
                </button>
                <button
                  onClick={() => handleDeleteMachine(selectedMachine.id)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 text-xs font-bold shadow-2xs transition"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>{t('machinery.deleteMachine')}</span>
                </button>
                <button
                  onClick={openCreateExpense}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#65BC7B] hover:bg-[#52a366] text-white text-xs font-bold shadow-sm shadow-[#65BC7B]/30 transition"
                >
                  <Plus className="w-4 h-4" />
                  <span>{t('machinery.addExpense')}</span>
                </button>
              </div>
            </div>

            {/* Avada Hero Card: Fiche d'engin */}
            <div className="bg-white rounded-3xl border border-[#e3ede5] p-6 shadow-sm relative overflow-hidden">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 rounded-full bg-[#f0f9f3] border-2 border-[#65BC7B]/20 flex items-center justify-center text-[#65BC7B] shadow-xs shrink-0">
                    <Tractor className="w-8 h-8" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-3 py-0.5 rounded-full bg-[#eef7fd] text-[#198fd9] font-bold text-[10px] uppercase tracking-wider">
                        {selectedMachine.category}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full font-mono text-[11px] font-bold text-[#65737d] bg-gray-100">
                        {selectedMachine.machineCode}
                      </span>
                      {selectedMachine.maintenanceAlert && (
                        <span className="px-2.5 py-0.5 rounded-full bg-[#fdf0f0] text-[#e65656] text-[10px] font-bold flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" />
                          <span>{t('machinery.maintenanceAlert')}</span>
                        </span>
                      )}
                    </div>
                    <h1 className="text-2xl font-extrabold text-[#2A3035] tracking-tight">
                      {selectedMachine.name}
                    </h1>
                    <p className="text-xs text-[#6b7c70] font-medium mt-0.5">
                      {selectedMachine.brand} • {selectedMachine.model} • {selectedMachine.hp} {t('machinery.hp')} • {t('machinery.year')}: {selectedMachine.yearOfManufacture}
                    </p>
                  </div>
                </div>

                {/* Key KPIs on Fiche */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#f7fbf8] p-4 rounded-2xl border border-[#e2ece4]">
                  <div>
                    <span className="text-[10px] text-[#6b7c70] font-bold block">{t('machinery.operatingHours')}</span>
                    <span className="text-lg font-extrabold text-[#2A3035]">
                      {Number(selectedMachine.currentHoursOrKm).toLocaleString()} h
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#6b7c70] font-bold block">{t('machinery.totalExpenses')}</span>
                    <span className="text-lg font-extrabold text-[#65BC7B]">
                      {formatCurrency(selectedMachine.totalExpensesGross || 0)}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#6b7c70] font-bold block">{t('machinery.calculatedHourlyCost')}</span>
                    <span className="text-lg font-extrabold text-[#198fd9]">
                      {formatCurrency(selectedMachine.costs?.totalCostPerHour || 42.5)} / h
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-[#6b7c70] font-bold block">{t('machinery.nextMaintenance')}</span>
                    <span className="text-lg font-extrabold text-amber-700">
                      {selectedMachine.nextMaintenanceDueHours ? `${selectedMachine.nextMaintenanceDueHours} h` : '–'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Technical Specifications Pills */}
              <div className="mt-6 pt-5 border-t border-gray-100 grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-white border border-[#e2ece4]">
                  <span className="text-[10px] text-gray-400 block">{t('machinery.purchasePrice')}</span>
                  <span className="font-bold text-[#2A3035]">{formatCurrency(selectedMachine.purchasePrice)}</span>
                </div>
                <div className="p-3 rounded-xl bg-white border border-[#e2ece4]">
                  <span className="text-[10px] text-gray-400 block">{t('machinery.residualValue')}</span>
                  <span className="font-bold text-[#2A3035]">{formatCurrency(selectedMachine.residualValue)}</span>
                </div>
                <div className="p-3 rounded-xl bg-white border border-[#e2ece4]">
                  <span className="text-[10px] text-gray-400 block">{t('machinery.depreciationYears')}</span>
                  <span className="font-bold text-[#2A3035]">{selectedMachine.depreciationYears} {t('machinery.yearsUnit')}</span>
                </div>
                <div className="p-3 rounded-xl bg-white border border-[#e2ece4]">
                  <span className="text-[10px] text-gray-400 block">{t('machinery.annualInsurance')}</span>
                  <span className="font-bold text-[#2A3035]">{formatCurrency(selectedMachine.insuranceAnnual)}</span>
                </div>
                <div className="p-3 rounded-xl bg-white border border-[#e2ece4]">
                  <span className="text-[10px] text-gray-400 block">{t('machinery.fuelConsumption')}</span>
                  <span className="font-bold text-[#2A3035]">{Number(selectedMachine.fuelConsumptionPerUnit).toFixed(1)} l/h</span>
                </div>
              </div>
            </div>

            {/* Expenses Tracking Section for this machine */}
            <div className="bg-white rounded-3xl border border-[#e3ede5] shadow-sm overflow-hidden">
              <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <h2 className="text-base font-extrabold text-[#2A3035] flex items-center gap-2">
                    <Wrench className="w-4 h-4 text-[#65BC7B]" />
                    <span>{t('machinery.expensesTitle')}</span>
                  </h2>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {t('machinery.expensesSubtitle')}
                  </p>
                </div>
                <button
                  onClick={openCreateExpense}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#f0f9f3] text-[#52a366] hover:bg-[#65BC7B] hover:text-white transition text-xs font-bold"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{t('machinery.addExpense')}</span>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#f7fbf8] text-[#55616a] font-bold border-b border-[#e2ece4]">
                    <tr>
                      <th className="py-3 px-5">{t('common.date')}</th>
                      <th className="py-3 px-5">{t('machinery.expenseType')}</th>
                      <th className="py-3 px-5">{t('machinery.description')}</th>
                      <th className="py-3 px-5">{t('machinery.supplier')}</th>
                      <th className="py-3 px-5 text-right">{t('common.net')}</th>
                      <th className="py-3 px-5 text-right">{t('common.gross')}</th>
                      <th className="py-3 px-5 text-center">{t('machinery.operatingHours')}</th>
                      <th className="py-3 px-5 text-right">{t('common.actions')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {!selectedMachine.expenses || selectedMachine.expenses.length === 0 ? (
                      <tr>
                        <td colSpan={8} className="py-10 text-center text-gray-400">
                          {t('machinery.noExpenses')}
                        </td>
                      </tr>
                    ) : (
                      selectedMachine.expenses.map((exp: any) => (
                        <tr key={exp.id} className="hover:bg-[#f7fbf8] transition">
                          <td className="py-3 px-5 text-gray-600 font-medium">{formatDate(exp.date)}</td>
                          <td className="py-3 px-5">{getExpenseTypeBadge(exp.expenseType)}</td>
                          <td className="py-3 px-5 font-bold text-[#2A3035]">{exp.description}</td>
                          <td className="py-3 px-5 text-gray-600">{exp.supplier?.companyName || '–'}</td>
                          <td className="py-3 px-5 text-right font-medium text-gray-600">{formatCurrency(exp.amountNet)}</td>
                          <td className="py-3 px-5 text-right font-bold text-[#2A3035]">{formatCurrency(exp.amountGross)}</td>
                          <td className="py-3 px-5 text-center font-mono text-gray-500">
                            {exp.operatingHours ? `${Number(exp.operatingHours).toLocaleString()} h` : '–'}
                          </td>
                          <td className="py-3 px-5 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => openEditExpense(exp)}
                                className="p-1 rounded-lg text-gray-400 hover:text-[#65BC7B] hover:bg-[#f0f9f3] transition"
                                title={t('common.edit')}
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteExpense(exp.id)}
                                className="p-1 rounded-lg text-gray-400 hover:text-rose-600 hover:bg-rose-50 transition"
                                title={t('common.delete')}
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
          /* ======================================================== */
          /* 2. FLEET OVERVIEW LIST (Avada Veterinarian Style Cards)  */
          /* ======================================================== */
          <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h1 className="text-2xl font-extrabold text-[#2A3035] tracking-tight">
                  {t('machinery.title')}
                </h1>
                <p className="text-xs text-[#6b7c70] mt-0.5">
                  {t('machinery.subtitle')}
                </p>
              </div>
              <button
                onClick={openCreateMachine}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#65BC7B] hover:bg-[#52a366] text-white text-xs font-extrabold shadow-sm shadow-[#65BC7B]/30 transition active:scale-95"
              >
                <Plus className="w-4 h-4" />
                <span>{t('machinery.addMachine')}</span>
              </button>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap gap-2 p-1.5 bg-white rounded-2xl border border-[#e3ede5] shadow-2xs">
              {[
                { id: 'ALL', label: t('machinery.catAll') },
                { id: 'TRACTOR', label: t('machinery.catTractor') },
                { id: 'HARVESTER', label: t('machinery.catHarvester') },
                { id: 'SPRAYER', label: t('machinery.catSprayer') },
                { id: 'SLURRY_TANKER', label: t('machinery.catSlurry') },
                { id: 'STORAGE_EQUIPMENT', label: t('machinery.catStorage') },
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition ${
                    activeCategory === cat.id
                      ? 'bg-[#65BC7B] text-white shadow-2xs'
                      : 'text-[#4e5d67] hover:text-[#2A3035] hover:bg-[#f0f9f3]'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Machines Grid - Avada Veterinarian Card Aesthetic */}
            {loading ? (
              <div className="p-12 text-center text-xs text-gray-400">{t('common.loading')}</div>
            ) : filteredMachines.length === 0 ? (
              <div className="bg-white p-12 rounded-3xl border border-[#e3ede5] text-center text-xs text-gray-400">
                {t('common.noData')}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredMachines.map((m) => (
                  <div
                    key={m.id}
                    className="avada-card p-6 flex flex-col justify-between group hover:-translate-y-0.5 transition-all"
                  >
                    <div>
                      {/* Card Header with circular icon */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="avada-circle-icon">
                          <Tractor className="w-5 h-5" />
                        </div>
                        <div className="flex flex-col items-end">
                          <span className="font-mono text-[10px] font-bold text-gray-400">
                            {m.machineCode}
                          </span>
                          {m.maintenanceAlert && (
                            <span className="mt-1 px-2 py-0.5 rounded-full bg-[#fdf0f0] text-[#e65656] text-[9px] font-bold flex items-center gap-1">
                              <AlertTriangle className="w-3 h-3" />
                              <span>{t('machinery.maintenanceAlert')}</span>
                            </span>
                          )}
                        </div>
                      </div>

                      <h2 className="text-base font-extrabold text-[#2A3035] group-hover:text-[#65BC7B] transition-colors">
                        {m.name}
                      </h2>
                      <p className="text-xs text-[#6b7c70] font-medium mt-0.5">
                        {m.brand} {m.model} • {m.hp ? `${m.hp} CV` : ''} • {m.yearOfManufacture || ''}
                      </p>

                      {/* Gauge / Hours bar */}
                      <div className="mt-4 p-3 rounded-2xl bg-[#f7fbf8] border border-[#e2ece4]">
                        <div className="flex justify-between items-center text-xs mb-1">
                          <span className="text-[#65737d] font-bold">{t('machinery.operatingHours')}</span>
                          <span className="font-extrabold text-[#2A3035]">
                            {Number(m.currentHoursOrKm).toLocaleString()} h
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                          <div
                            className="h-2 rounded-full bg-[#65BC7B]"
                            style={{
                              width: `${Math.min(100, (Number(m.currentHoursOrKm) / 5000) * 100)}%`,
                            }}
                          />
                        </div>
                      </div>

                      {/* Cost metrics */}
                      <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                        <div className="p-2.5 rounded-xl bg-white border border-[#e2ece4]">
                          <span className="text-[10px] text-gray-400 block">{t('machinery.costPerHour')}</span>
                          <span className="font-extrabold text-[#198fd9]">
                            {formatCurrency(m.costs?.totalCostPerHour || 45)} / h
                          </span>
                        </div>
                        <div className="p-2.5 rounded-xl bg-white border border-[#e2ece4]">
                          <span className="text-[10px] text-gray-400 block">{t('machinery.totalExpenses')}</span>
                          <span className="font-extrabold text-[#65BC7B]">
                            {formatCurrency(m.totalExpensesGross || 0)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Action: Open Fiche d'engin */}
                    <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-between">
                      <div className="flex items-center gap-1 text-[11px] text-gray-500">
                        <Wrench className="w-3.5 h-3.5 text-[#65BC7B]" />
                        <span>{m.expenses?.length || 0} {t('machinery.expensesCount')}</span>
                      </div>
                      <button
                        onClick={() => setSelectedMachine(m)}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#f0f9f3] text-[#52a366] hover:bg-[#65BC7B] hover:text-white transition font-bold text-xs"
                      >
                        <span>{t('machinery.machineSheet')}</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ======================================================== */}
        {/* MODAL 1: CREATE / EDIT MACHINE                          */}
        {/* ======================================================== */}
        {isMachineModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-gray-200">
              <h2 className="text-lg font-extrabold text-[#2A3035] mb-4">
                {isEditMachine ? t('machinery.editMachine') : t('machinery.addMachine')}
              </h2>
              <form onSubmit={handleMachineSubmit} className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-600 mb-1">{t('machinery.brand')} *</label>
                    <input
                      type="text"
                      required
                      value={machineForm.brand}
                      onChange={(e) => setMachineForm({ ...machineForm, brand: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#65BC7B]/30"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-600 mb-1">{t('machinery.model')} *</label>
                    <input
                      type="text"
                      required
                      value={machineForm.model}
                      onChange={(e) => setMachineForm({ ...machineForm, model: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#65BC7B]/30"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-600 mb-1">{t('machinery.fullName')} *</label>
                  <input
                    type="text"
                    required
                    placeholder="z.B. Fendt 724 Vario ProfiPlus"
                    value={machineForm.name}
                    onChange={(e) => setMachineForm({ ...machineForm, name: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#65BC7B]/30"
                  />
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-600 mb-1">{t('machinery.category')}</label>
                    <select
                      value={machineForm.category}
                      onChange={(e) => setMachineForm({ ...machineForm, category: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#65BC7B]/30"
                    >
                      <option value="TRACTOR">{t('machinery.catTractor')}</option>
                      <option value="HARVESTER">{t('machinery.catHarvester')}</option>
                      <option value="SPRAYER">{t('machinery.catSprayer')}</option>
                      <option value="SLURRY_TANKER">{t('machinery.catSlurry')}</option>
                      <option value="STORAGE_EQUIPMENT">{t('machinery.catStorage')}</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-600 mb-1">{t('machinery.hp')}</label>
                    <input
                      type="number"
                      value={machineForm.hp}
                      onChange={(e) => setMachineForm({ ...machineForm, hp: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#65BC7B]/30"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-600 mb-1">{t('machinery.year')}</label>
                    <input
                      type="number"
                      value={machineForm.yearOfManufacture}
                      onChange={(e) => setMachineForm({ ...machineForm, yearOfManufacture: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#65BC7B]/30"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-600 mb-1">{t('machinery.operatingHours')}</label>
                    <input
                      type="number"
                      value={machineForm.currentHoursOrKm}
                      onChange={(e) => setMachineForm({ ...machineForm, currentHoursOrKm: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#65BC7B]/30"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-600 mb-1">{t('machinery.purchasePrice')} (€)</label>
                    <input
                      type="number"
                      value={machineForm.purchasePrice}
                      onChange={(e) => setMachineForm({ ...machineForm, purchasePrice: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#65BC7B]/30"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-3">
                  <button
                    type="button"
                    onClick={() => setIsMachineModalOpen(false)}
                    className="px-4 py-2 rounded-full text-xs font-bold text-gray-600 hover:bg-gray-100"
                  >
                    {t('common.cancel')}
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-full text-xs font-bold bg-[#65BC7B] text-white hover:bg-[#52a366] shadow-xs"
                  >
                    {t('common.save')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ======================================================== */}
        {/* MODAL 2: ADD / EDIT EXPENSE FOR THIS MACHINE             */}
        {/* ======================================================== */}
        {isExpenseModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-gray-200">
              <h2 className="text-base font-extrabold text-[#2A3035] mb-1">
                {isEditExpense ? t('machinery.editExpense') : t('machinery.addExpense')}
              </h2>
              <p className="text-xs text-[#65BC7B] font-bold mb-4">
                {selectedMachine?.name} ({selectedMachine?.machineCode})
              </p>

              <form onSubmit={handleExpenseSubmit} className="space-y-3">
                <div>
                  <label className="block text-[11px] font-bold text-gray-600 mb-1">{t('machinery.expenseType')} *</label>
                  <select
                    value={expenseForm.expenseType}
                    onChange={(e) => setExpenseForm({ ...expenseForm, expenseType: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#65BC7B]/30"
                  >
                    <option value="MAINTENANCE">{t('machinery.expTypeMaintenance')}</option>
                    <option value="REPAIR">{t('machinery.expTypeRepair')}</option>
                    <option value="FUEL">{t('machinery.expTypeFuel')}</option>
                    <option value="PARTS">{t('machinery.expTypeParts')}</option>
                    <option value="INSURANCE">{t('machinery.expTypeInsurance')}</option>
                    <option value="INSPECTION_TUV">{t('machinery.expTypeTuv')}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-600 mb-1">{t('machinery.description')} *</label>
                  <input
                    type="text"
                    required
                    placeholder="z.B. 1000h Kundendienst + Ölwechsel"
                    value={expenseForm.description}
                    onChange={(e) => setExpenseForm({ ...expenseForm, description: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#65BC7B]/30"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-bold text-gray-600 mb-1">{t('machinery.amountNet')} *</label>
                    <input
                      type="number"
                      step="any"
                      required
                      value={expenseForm.amountNet}
                      onChange={(e) => setExpenseForm({ ...expenseForm, amountNet: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#65BC7B]/30"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-bold text-gray-600 mb-1">{t('common.date')}</label>
                    <input
                      type="date"
                      value={expenseForm.date}
                      onChange={(e) => setExpenseForm({ ...expenseForm, date: e.target.value })}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#65BC7B]/30"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-gray-600 mb-1">{t('machinery.operatingHoursAtExpense')}</label>
                  <input
                    type="number"
                    placeholder="z.B. 1250"
                    value={expenseForm.operatingHours}
                    onChange={(e) => setExpenseForm({ ...expenseForm, operatingHours: e.target.value })}
                    className="w-full px-3 py-2 text-xs rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#65BC7B]/30"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-3">
                  <button
                    type="button"
                    onClick={() => setIsExpenseModalOpen(false)}
                    className="px-4 py-2 rounded-full text-xs font-bold text-gray-600 hover:bg-gray-100"
                  >
                    {t('common.cancel')}
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-full text-xs font-bold bg-[#65BC7B] text-white hover:bg-[#52a366] shadow-xs"
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
