'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useI18n } from '@/lib/i18n';
import {
  LayoutDashboard,
  Landmark,
  ArrowDownLeft,
  ArrowUpRight,
  Receipt,
  FileText,
  Users,
  Truck,
  Sprout,
  Package,
  Tractor,
  UserCheck,
  Boxes,
  TrendingUp,
  Banknote,
  FileSpreadsheet,
  Folder,
  ShieldCheck,
  Settings,
  ChevronLeft,
  ChevronRight,
  HeartPulse,
} from 'lucide-react';

export function Sidebar() {
  const pathname = usePathname();
  const { t } = useI18n();
  const [collapsed, setCollapsed] = useState(false);

  const navItems = [
    { href: '/dashboard', labelKey: 'navigation.dashboard', icon: LayoutDashboard },
    { href: '/finanzen', labelKey: 'navigation.finanzen', icon: Landmark },
    { href: '/einnahmen', labelKey: 'navigation.einnahmen', icon: ArrowDownLeft },
    { href: '/ausgaben', labelKey: 'navigation.ausgaben', icon: ArrowUpRight },
    { href: '/buchungen', labelKey: 'navigation.buchungen', icon: Receipt },
    { href: '/rechnungen', labelKey: 'navigation.rechnungen', icon: FileText },
    { href: '/kunden', labelKey: 'navigation.kunden', icon: Users },
    { href: '/lieferanten', labelKey: 'navigation.lieferanten', icon: Truck },
    { href: '/schweinemast', labelKey: 'navigation.schweinemast', icon: Package, badge: 'H4/H2' },
    { href: '/ackerbau', labelKey: 'navigation.ackerbau', icon: Sprout, badge: '440 ha' },
    { href: '/kartoffellager', labelKey: 'navigation.kartoffellager', icon: Boxes },
    { href: '/maschinen', labelKey: 'navigation.maschinen', icon: Tractor, badge: 'Fiches' },
    { href: '/personal', labelKey: 'navigation.personal', icon: UserCheck },
    { href: '/lager', labelKey: 'navigation.lager', icon: Package },
    { href: '/budgets', labelKey: 'navigation.budgets', icon: TrendingUp, badge: 'Ateliers' },
    { href: '/investitionen', labelKey: 'navigation.investitionen', icon: Banknote },
    { href: '/berichte', labelKey: 'navigation.berichte', icon: FileSpreadsheet },
    { href: '/dokumente', labelKey: 'navigation.dokumente', icon: Folder },
    { href: '/benutzer', labelKey: 'navigation.benutzer', icon: ShieldCheck },
    { href: '/einstellungen', labelKey: 'navigation.einstellungen', icon: Settings },
  ];

  return (
    <aside
      className={`relative flex flex-col bg-white border-r border-[#e2ece4] transition-all duration-300 z-30 ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Avada Brand Header */}
      <div className="flex items-center justify-between p-4 border-b border-[#e2ece4] bg-[#fbfdfb]">
        <Link href="/dashboard" className="flex items-center gap-3 overflow-hidden group">
          <div className="w-10 h-10 rounded-full bg-[#65BC7B] flex items-center justify-center text-white shadow-sm shadow-[#65BC7B]/30 shrink-0 transition-transform group-hover:scale-105">
            <HeartPulse className="w-5 h-5 text-white" />
          </div>
          {!collapsed && (
            <div className="flex flex-col truncate">
              <span className="font-extrabold text-sm text-[#2A3035] tracking-tight leading-none flex items-center gap-1.5">
                Lampe Agrar
                <span className="text-[9px] px-1.5 py-0.2 rounded-full bg-[#eef8f1] text-[#4ea064] font-bold">
                  ERP
                </span>
              </span>
              <span className="text-[10px] text-[#6b7c70] font-medium mt-1 truncate">
                {t('app.tagline')}
              </span>
            </div>
          )}
        </Link>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-7 h-7 rounded-full flex items-center justify-center text-gray-400 hover:text-[#2A3035] hover:bg-[#f0f9f3] transition-colors"
          title={collapsed ? t('common.viewDetails') : t('common.close')}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation List - Avada Rounded Pill Style */}
      <div className="flex-1 overflow-y-auto py-3 px-3 space-y-1 custom-scrollbar">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-full text-xs font-bold transition-all group ${
                isActive
                  ? 'bg-[#65BC7B] text-white shadow-sm shadow-[#65BC7B]/30'
                  : 'text-[#444e56] hover:text-[#2A3035] hover:bg-[#f0f9f3]'
              }`}
              title={collapsed ? t(item.labelKey) : undefined}
            >
              <Icon
                className={`w-4 h-4 shrink-0 transition-transform group-hover:scale-110 ${
                  isActive ? 'text-white' : 'text-[#65BC7B]'
                }`}
              />
              {!collapsed && (
                <div className="flex items-center justify-between flex-1 truncate">
                  <span className="truncate">{t(item.labelKey)}</span>
                  {item.badge && !isActive && (
                    <span className="text-[9px] px-2 py-0.5 rounded-full bg-[#f0f9f3] text-[#52a366] font-bold">
                      {item.badge}
                    </span>
                  )}
                </div>
              )}
            </Link>
          );
        })}
      </div>

      {/* Avada Farm Footer Badge */}
      {!collapsed && (
        <div className="p-3.5 m-3 rounded-2xl bg-[#f7fbf8] border border-[#e2ece4] text-[10px] text-[#55616a]">
          <div className="flex items-center gap-1.5 font-bold text-[#2A3035]">
            <span className="w-2 h-2 rounded-full bg-[#65BC7B] animate-pulse" />
            <span>Lampe Agrar GbR</span>
          </div>
          <p className="text-[#65737d] mt-0.5 truncate">Gesa & Dr. Josef Langenberg</p>
          <p className="text-[#88959f] mt-0.5">Hünenheide 3 • 49406 Bockstedt</p>
        </div>
      )}
    </aside>
  );
}
