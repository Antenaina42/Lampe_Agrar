'use client';

import React, { useEffect, useState } from 'react';
import { AppLayout } from '@/components/AppLayout';
import { useI18n } from '@/lib/i18n';
import {
  Users,
  Plus,
  Pencil,
  Trash2,
  AlertCircle,
  Briefcase,
  Calendar,
  Euro,
  PieChart,
  ShieldAlert,
  CheckCircle2
} from 'lucide-react';

export default function PersonalPage() {
  const { t, formatCurrency, formatDate } = useI18n();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingEmp, setEditingEmp] = useState<any>(null);

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    roleTitle: '',
    employmentType: 'FULL_TIME',
    monthlyGrossSalary: '3200',
    monthlyEmployerCost: '',
    allocatedActivity: 'CROPS',
    hireDate: new Date().toISOString().split('T')[0],
  });

  const loadData = () => {
    fetch('/api/personnel')
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
    setFormData({
      firstName: '',
      lastName: '',
      roleTitle: '',
      employmentType: 'FULL_TIME',
      monthlyGrossSalary: '3200',
      monthlyEmployerCost: '',
      allocatedActivity: 'CROPS',
      hireDate: new Date().toISOString().split('T')[0],
    });
    setIsAddModalOpen(true);
  };

  const handleOpenEdit = (emp: any) => {
    setEditingEmp(emp);
    setFormData({
      firstName: emp.firstName,
      lastName: emp.lastName,
      roleTitle: emp.roleTitle,
      employmentType: emp.employmentType,
      monthlyGrossSalary: String(emp.monthlyGrossSalary),
      monthlyEmployerCost: String(emp.monthlyEmployerCost || ''),
      allocatedActivity: emp.allocatedActivity,
      hireDate: emp.hireDate ? new Date(emp.hireDate).toISOString().split('T')[0] : '',
    });
    setIsEditModalOpen(true);
  };

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/personnel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
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
    if (!editingEmp) return;
    try {
      const res = await fetch('/api/personnel', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: editingEmp.id,
          ...formData,
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

  const handleDeleteEmployee = async (id: string) => {
    if (!confirm(t('common.confirmDelete'))) return;
    try {
      const res = await fetch(`/api/personnel?id=${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        loadData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getBranchLabel = (branch: string) => {
    switch (branch) {
      case 'CROPS':
        return '🌾 Ackerbau';
      case 'LIVESTOCK':
      case 'PIGS':
        return '🐖 Schweinemast';
      case 'POTATO_STORAGE':
      case 'STORAGE':
        return '🥔 Kartoffellager';
      case 'MACHINERY':
        return '🚜 Fuhrpark';
      case 'GENERAL':
        return '👥 Betriebsleitung / Allgemein';
      default:
        return branch;
    }
  };

  const getEmploymentBadge = (type: string) => {
    switch (type) {
      case 'FULL_TIME':
        return (
          <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-[#f0f9f3] text-[#65BC7B] border border-[#65BC7B]/20">
            {t('personnel.fullTime')}
          </span>
        );
      case 'PART_TIME':
        return (
          <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
            {t('personnel.partTime')}
          </span>
        );
      case 'SEASONAL':
        return (
          <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
            {t('personnel.seasonal')}
          </span>
        );
      case 'APPRENTICE':
        return (
          <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
            {t('personnel.apprentice')}
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 rounded-full text-[10px] font-bold bg-gray-100 text-gray-700">
            {type}
          </span>
        );
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full flex items-center justify-center bg-[#f0f9f3] text-[#65BC7B] shadow-sm">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-[#2A3035] tracking-tight">
                {t('personnel.title')}
              </h1>
              <p className="text-xs text-[#637381] mt-0.5">
                {t('personnel.subtitle')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleOpenAdd}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#65BC7B] text-white text-xs font-bold hover:bg-[#52a366] transition shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>{t('personnel.addEmployee')}</span>
            </button>
          </div>
        </div>

        {/* Legal Disclaimer Alert */}
        <div className="p-4 rounded-3xl bg-amber-50/80 border border-amber-200/80 flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-amber-700 mt-0.5 shrink-0" />
          <p className="text-xs text-amber-900 leading-relaxed font-medium">
            {t('personnel.disclaimer')}
          </p>
        </div>

        {/* KPI Cards */}
        {data?.summary && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-3xl border border-[#e3ede5] shadow-xs">
              <span className="text-xs font-semibold text-[#637381]">{t('personnel.activeStaff')}</span>
              <p className="text-2xl font-bold text-[#2A3035] mt-1">{data.summary.activeCount}</p>
              <span className="text-[10px] text-[#637381]">{t('personnel.teamLampe')}</span>
            </div>
            <div className="bg-white p-5 rounded-3xl border border-[#e3ede5] shadow-xs">
              <span className="text-xs font-semibold text-[#637381]">{t('personnel.monthlyGrossTotal')}</span>
              <p className="text-2xl font-bold text-[#2A3035] mt-1">{formatCurrency(data.summary.totalMonthlyGross)}</p>
              <span className="text-[10px] text-[#637381]">{t('personnel.baseSalaries')}</span>
            </div>
            <div className="bg-white p-5 rounded-3xl border border-[#e3ede5] shadow-xs">
              <span className="text-xs font-semibold text-[#637381]">{t('personnel.monthlyCost')}</span>
              <p className="text-2xl font-bold text-[#65BC7B] mt-1">{formatCurrency(data.summary.totalMonthlyEmployerCost)}</p>
              <span className="text-[10px] text-[#637381]">Inkl. AG-Sozialversicherungsanteile (~21%)</span>
            </div>
            <div className="bg-white p-5 rounded-3xl border border-[#e3ede5] shadow-xs">
              <span className="text-xs font-semibold text-[#637381]">{t('personnel.annualEmployerCost')}</span>
              <p className="text-2xl font-bold text-[#2A3035] mt-1">{formatCurrency(data.summary.annualizedEmployerCost)}</p>
              <span className="text-[10px] text-[#637381]">{t('personnel.costCenterBase')}</span>
            </div>
          </div>
        )}

        {/* Cost Allocation by Farm Branch */}
        {data?.summary?.branchAllocation && (
          <div className="bg-white p-6 rounded-3xl border border-[#e3ede5] shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <PieChart className="w-5 h-5 text-[#65BC7B]" />
              <h2 className="text-sm font-bold text-[#2A3035]">{t('personnel.costByBranch')}</h2>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {Object.entries(data.summary.branchAllocation).map(([branch, cost]: [string, any]) => (
                <div key={branch} className="p-4 rounded-2xl bg-[#f7fbf8] border border-[#e3ede5]">
                  <span className="text-xs text-[#637381] font-semibold">{getBranchLabel(branch)}</span>
                  <p className="text-base font-bold text-[#2A3035] mt-1">{formatCurrency(cost)}</p>
                  <span className="text-[10px] text-[#637381] mt-0.5 block">
                    {data.summary.totalMonthlyEmployerCost > 0
                      ? `${Math.round((cost / data.summary.totalMonthlyEmployerCost) * 100)} ${t('personnel.branchPercent')}`
                      : '0%'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Employees Table with full CRUD (Add, Edit, Delete) */}
        <div className="bg-white rounded-3xl border border-[#e3ede5] shadow-sm overflow-hidden">
          <div className="p-5 border-b border-[#e3ede5] flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-[#2A3035]">{t('personnel.teamOverview')}</h2>
              <p className="text-[11px] text-[#637381] mt-0.5">
                {t('personnel.teamSubtitle')}
              </p>
            </div>
            <button
              onClick={handleOpenAdd}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#f0f9f3] text-[#65BC7B] hover:bg-[#65BC7B] hover:text-white text-xs font-bold transition border border-[#65BC7B]/30"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{t('personnel.addEmployee')}</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#f7fbf8] text-[#637381] font-semibold border-b border-[#e3ede5]">
                <tr>
                  <th className="py-3 px-5">ID</th>
                  <th className="py-3 px-4">{t('personnel.firstName')} & {t('personnel.lastName')}</th>
                  <th className="py-3 px-4">{t('personnel.roleTitle')}</th>
                  <th className="py-3 px-4">{t('personnel.employmentType')}</th>
                  <th className="py-3 px-4">{t('personnel.allocatedBranch')}</th>
                  <th className="py-3 px-4 text-right">{t('personnel.grossSalary')}</th>
                  <th className="py-3 px-4 text-right font-bold">{t('personnel.monthlyCost')}</th>
                  <th className="py-3 px-4">{t('personnel.hireDate')}</th>
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
                ) : (
                  data?.employees?.map((emp: any) => (
                    <tr key={emp.id} className="hover:bg-[#f7fbf8] transition">
                      <td className="py-3.5 px-5 font-mono text-gray-600 font-semibold">
                        {emp.employeeNumber}
                      </td>
                      <td className="py-3.5 px-4 font-bold text-[#2A3035]">
                        {emp.firstName} {emp.lastName}
                      </td>
                      <td className="py-3.5 px-4 text-gray-700">
                        {emp.roleTitle}
                      </td>
                      <td className="py-3.5 px-4">
                        {getEmploymentBadge(emp.employmentType)}
                      </td>
                      <td className="py-3.5 px-4 text-[#2A3035] font-medium">
                        {getBranchLabel(emp.allocatedActivity)}
                      </td>
                      <td className="py-3.5 px-4 text-right font-semibold text-gray-800">
                        {formatCurrency(emp.monthlyGrossSalary)}
                      </td>
                      <td className="py-3.5 px-4 text-right font-bold text-[#65BC7B]">
                        {formatCurrency(emp.monthlyEmployerCost)}
                      </td>
                      <td className="py-3.5 px-4 text-gray-500">
                        {formatDate(emp.hireDate)}
                      </td>
                      <td className="py-3.5 px-5 text-center">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => handleOpenEdit(emp)}
                            className="p-1.5 rounded-full hover:bg-gray-100 text-gray-600 transition"
                            title={t('common.edit')}
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteEmployee(emp.id)}
                            className="p-1.5 rounded-full hover:bg-rose-50 text-rose-600 transition"
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

        {/* Modal: Add Employee */}
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-[#e3ede5] space-y-4 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <h3 className="text-base font-bold text-[#2A3035]">
                  {t('personnel.addEmployee')}
                </h3>
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 font-bold"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleAddSubmit} className="space-y-3.5">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#2A3035] mb-1">
                      {t('personnel.firstName')} *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      className="w-full text-xs bg-white border border-[#e3ede5] rounded-xl px-3 py-2 text-[#2A3035] focus:outline-none focus:border-[#65BC7B]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#2A3035] mb-1">
                      {t('personnel.lastName')} *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      className="w-full text-xs bg-white border border-[#e3ede5] rounded-xl px-3 py-2 text-[#2A3035] focus:outline-none focus:border-[#65BC7B]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#2A3035] mb-1">
                    {t('personnel.roleTitle')} *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="z.B. Landmaschinenführer, Ackerbauleiter..."
                    value={formData.roleTitle}
                    onChange={(e) => setFormData({ ...formData, roleTitle: e.target.value })}
                    className="w-full text-xs bg-white border border-[#e3ede5] rounded-xl px-3 py-2 text-[#2A3035] focus:outline-none focus:border-[#65BC7B]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#2A3035] mb-1">
                      {t('personnel.employmentType')}
                    </label>
                    <select
                      value={formData.employmentType}
                      onChange={(e) => setFormData({ ...formData, employmentType: e.target.value })}
                      className="w-full text-xs bg-white border border-[#e3ede5] rounded-xl px-3 py-2 text-[#2A3035] focus:outline-none focus:border-[#65BC7B]"
                    >
                      <option value="FULL_TIME">Vollzeit</option>
                      <option value="PART_TIME">Teilzeit</option>
                      <option value="SEASONAL">Saisonkraft</option>
                      <option value="APPRENTICE">Auszubildender</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#2A3035] mb-1">
                      {t('personnel.allocatedBranch')}
                    </label>
                    <select
                      value={formData.allocatedActivity}
                      onChange={(e) => setFormData({ ...formData, allocatedActivity: e.target.value })}
                      className="w-full text-xs bg-white border border-[#e3ede5] rounded-xl px-3 py-2 text-[#2A3035] focus:outline-none focus:border-[#65BC7B]"
                    >
                      <option value="CROPS">Ackerbau</option>
                      <option value="LIVESTOCK">Schweinemast</option>
                      <option value="MACHINERY">Fuhrpark</option>
                      <option value="POTATO_STORAGE">Kartoffellager</option>
                      <option value="GENERAL">Betriebsleitung</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#2A3035] mb-1">
                      {t('personnel.grossSalary')} (€) *
                    </label>
                    <input
                      type="number"
                      step="50"
                      required
                      value={formData.monthlyGrossSalary}
                      onChange={(e) => setFormData({ ...formData, monthlyGrossSalary: e.target.value })}
                      className="w-full text-xs bg-white border border-[#e3ede5] rounded-xl px-3 py-2 text-[#2A3035] focus:outline-none focus:border-[#65BC7B]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#2A3035] mb-1">
                      {t('personnel.hireDate')}
                    </label>
                    <input
                      type="date"
                      value={formData.hireDate}
                      onChange={(e) => setFormData({ ...formData, hireDate: e.target.value })}
                      className="w-full text-xs bg-white border border-[#e3ede5] rounded-xl px-3 py-2 text-[#2A3035] focus:outline-none focus:border-[#65BC7B]"
                    />
                  </div>
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

        {/* Modal: Edit Employee */}
        {isEditModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
            <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-[#e3ede5] space-y-4 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <h3 className="text-base font-bold text-[#2A3035]">
                  {t('personnel.editEmployee')} ({editingEmp?.firstName} {editingEmp?.lastName})
                </h3>
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 font-bold"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleEditSubmit} className="space-y-3.5">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#2A3035] mb-1">
                      {t('personnel.firstName')} *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      className="w-full text-xs bg-white border border-[#e3ede5] rounded-xl px-3 py-2 text-[#2A3035] focus:outline-none focus:border-[#65BC7B]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#2A3035] mb-1">
                      {t('personnel.lastName')} *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.lastName}
                      onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                      className="w-full text-xs bg-white border border-[#e3ede5] rounded-xl px-3 py-2 text-[#2A3035] focus:outline-none focus:border-[#65BC7B]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#2A3035] mb-1">
                    {t('personnel.roleTitle')} *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.roleTitle}
                    onChange={(e) => setFormData({ ...formData, roleTitle: e.target.value })}
                    className="w-full text-xs bg-white border border-[#e3ede5] rounded-xl px-3 py-2 text-[#2A3035] focus:outline-none focus:border-[#65BC7B]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-[#2A3035] mb-1">
                      {t('personnel.employmentType')}
                    </label>
                    <select
                      value={formData.employmentType}
                      onChange={(e) => setFormData({ ...formData, employmentType: e.target.value })}
                      className="w-full text-xs bg-white border border-[#e3ede5] rounded-xl px-3 py-2 text-[#2A3035] focus:outline-none focus:border-[#65BC7B]"
                    >
                      <option value="FULL_TIME">Vollzeit</option>
                      <option value="PART_TIME">Teilzeit</option>
                      <option value="SEASONAL">Saisonkraft</option>
                      <option value="APPRENTICE">Auszubildender</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-[#2A3035] mb-1">
                      {t('personnel.allocatedBranch')}
                    </label>
                    <select
                      value={formData.allocatedActivity}
                      onChange={(e) => setFormData({ ...formData, allocatedActivity: e.target.value })}
                      className="w-full text-xs bg-white border border-[#e3ede5] rounded-xl px-3 py-2 text-[#2A3035] focus:outline-none focus:border-[#65BC7B]"
                    >
                      <option value="CROPS">Ackerbau</option>
                      <option value="LIVESTOCK">Schweinemast</option>
                      <option value="MACHINERY">Fuhrpark</option>
                      <option value="POTATO_STORAGE">Kartoffellager</option>
                      <option value="GENERAL">Betriebsleitung</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#2A3035] mb-1">
                    {t('personnel.grossSalary')} (€) *
                  </label>
                  <input
                    type="number"
                    step="50"
                    required
                    value={formData.monthlyGrossSalary}
                    onChange={(e) => setFormData({ ...formData, monthlyGrossSalary: e.target.value })}
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
