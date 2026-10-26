'use client';

import React, { useEffect, useState } from 'react';
import { AppLayout } from '@/components/AppLayout';
import { useI18n } from '@/lib/i18n';
import { Users, UserPlus, Shield, CheckCircle2, XCircle, Mail, KeyRound } from 'lucide-react';

export default function BenutzerPage() {
  const { t, formatDate } = useI18n();
  const [users, setUsers] = useState<any[]>([]);
  const [roles, setRoles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    roleId: '',
  });

  const loadUsers = () => {
    fetch('/api/users')
      .then((res) => res.json())
      .then((json) => {
        setUsers(json.users || []);
        setRoles(json.roles || []);
        if (json.roles?.length && !formData.roleId) {
          setFormData((f) => ({ ...f, roleId: json.roles[0].id }));
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setIsModalOpen(false);
        setFormData({ name: '', email: '', password: '', roleId: roles[0]?.id || '' });
        loadUsers();
      } else {
        const err = await res.json();
        alert(err.error || t('users.errorCreating'));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleActive = async (userId: string, currentActive: boolean) => {
    try {
      const res = await fetch('/api/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, isActive: !currentActive }),
      });
      if (res.ok) {
        loadUsers();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getRoleBadge = (roleName: string) => {
    switch (roleName) {
      case 'BETRIEBSLEITUNG':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-[#226c3d]">
            {t('users.roleManagementTitle')}
          </span>
        );
      case 'STEUERBERATER':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-50 text-purple-700">
            {t('users.roleAuditorTitle')}
          </span>
        );
      case 'MITARBEITER':
      case 'ACKERBAULEITUNG':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700">
            {t('users.roleCropsTitle')}
          </span>
        );
      case 'SAISONKRAFT':
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700">
            {t('personnel.seasonal')}
          </span>
        );
      default:
        return (
          <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-gray-100 text-gray-700">
            {roleName}
          </span>
        );
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-[#212921] tracking-tight">
              {t('users.title')}
            </h1>
            <p className="text-xs text-[#5c6e5c] mt-0.5">
              {t('users.subtitle')}
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#226c3d] text-white text-xs font-semibold hover:bg-[#1a5530] transition shadow-sm"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>{t('users.createUser')}</span>
          </button>
        </div>

        {/* Roles overview cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3.5 rounded-2xl bg-white border border-[#e2e8df] shadow-xs">
            <span className="text-xs font-bold text-gray-800">{t('users.roleManagementTitle')}</span>
            <p className="text-[11px] text-gray-500 mt-1">
              {t('users.roleManagementDesc')}
            </p>
          </div>
          <div className="p-3.5 rounded-2xl bg-white border border-[#e2e8df] shadow-xs">
            <span className="text-xs font-bold text-gray-800">{t('users.roleCropsTitle')}</span>
            <p className="text-[11px] text-gray-500 mt-1">
              {t('users.roleCropsDesc')}
            </p>
          </div>
          <div className="p-3.5 rounded-2xl bg-white border border-[#e2e8df] shadow-xs">
            <span className="text-xs font-bold text-gray-800">{t('users.roleAuditorTitle')}</span>
            <p className="text-[11px] text-gray-500 mt-1">
              {t('users.roleAuditorDesc')}
            </p>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-2xl border border-[#e2e8df] shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="text-sm font-bold text-gray-800">
              {t('users.activeAccounts')} ({users.length})
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#f8faf7] text-gray-600 font-semibold border-b border-[#e2e8df]">
                <tr>
                  <th className="py-2.5 px-4">{t('users.name')}</th>
                  <th className="py-2.5 px-4">{t('users.email')}</th>
                  <th className="py-2.5 px-4">{t('users.role')}</th>
                  <th className="py-2.5 px-4">{t('users.defaultLanguage')}</th>
                  <th className="py-2.5 px-4">{t('users.createdAt')}</th>
                  <th className="py-2.5 px-4 text-center">{t('users.status')}</th>
                  <th className="py-2.5 px-4 text-right">{t('users.action')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-gray-400">
                      {t('common.loading')}
                    </td>
                  </tr>
                ) : (
                  users.map((u) => (
                    <tr key={u.id} className="hover:bg-gray-50/80 transition">
                      <td className="py-3 px-4 font-bold text-gray-800">{u.name}</td>
                      <td className="py-3 px-4 text-gray-600 font-medium">{u.email}</td>
                      <td className="py-3 px-4">{getRoleBadge(u.role?.name)}</td>
                      <td className="py-3 px-4 uppercase font-mono text-gray-500">{u.language}</td>
                      <td className="py-3 px-4 text-gray-500">{formatDate(u.createdAt)}</td>
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            u.isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                          }`}
                        >
                          {u.isActive ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                          {u.isActive ? t('users.active') : t('users.blocked')}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => handleToggleActive(u.id, u.isActive)}
                          className="px-2 py-1 text-[10px] font-semibold text-gray-600 hover:text-gray-900 border border-gray-200 rounded-lg hover:bg-gray-50"
                        >
                          {u.isActive ? t('users.deactivate') : t('users.activate')}
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal: New User */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-gray-200">
              <h2 className="text-base font-bold text-gray-800 mb-4">{t('users.createModalTitle')}</h2>
              <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                    {t('users.fullName')}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={t('users.fullNamePlaceholder')}
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs rounded-xl border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#226c3d]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                    {t('users.email')} *
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="name@lampe-agrar.de"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs rounded-xl border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#226c3d]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                    {t('users.password')}
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs rounded-xl border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#226c3d]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 mb-1">
                    {t('users.selectRole')}
                  </label>
                  <select
                    value={formData.roleId}
                    onChange={(e) => setFormData({ ...formData, roleId: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs rounded-xl border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#226c3d]"
                  >
                    {roles.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.displayName || r.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex justify-end gap-2 pt-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-100 rounded-xl"
                  >
                    {t('common.cancel')}
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 text-xs font-semibold bg-[#226c3d] text-white rounded-xl hover:bg-[#1a5530]"
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
