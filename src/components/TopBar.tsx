'use client';

import React, { useState } from 'react';
import { useI18n, SUPPORTED_LOCALES, Locale } from '@/lib/i18n';
import {
  Globe,
  PlusCircle,
  Search,
  User,
  LogOut,
  RefreshCw,
  Sparkles,
} from 'lucide-react';

interface TopBarProps {
  onNewBookingClick: () => void;
  currentUser?: {
    name: string;
    email: string;
    roleDisplayName: string;
  };
}

export function TopBar({ onNewBookingClick, currentUser }: TopBarProps) {
  const { locale, setLocale, t } = useI18n();
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [demoBannerOpen, setDemoBannerOpen] = useState(true);
  const [clearingDemo, setClearingDemo] = useState(false);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      window.location.href = '/login';
    } catch {
      window.location.href = '/login';
    }
  };

  const handleResetDemo = async () => {
    if (!confirm(t('settings.resetDemoData') + ' ?')) return;
    setClearingDemo(true);
    try {
      await fetch('/api/demo-data', { method: 'POST' });
      window.location.reload();
    } catch {
      setClearingDemo(false);
    }
  };

  return (
    <header className="sticky top-0 z-20 flex flex-col bg-white/95 backdrop-blur-md border-b border-[#e2ece4]">
      {/* Demo Data Notice Bar with Avada Soft Pastel Styling */}
      {demoBannerOpen && (
        <div className="flex items-center justify-between px-6 py-1.5 bg-[#fbf5eb] border-b border-[#f3e6cf] text-xs text-[#8c601c]">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded-full font-bold bg-[#f6ddab] text-[#6d4605] text-[10px] tracking-wider uppercase">
              {t('app.demoDataBadge')}
            </span>
            <span className="hidden sm:inline font-medium">
              {t('app.demoDataWarning')}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleResetDemo}
              disabled={clearingDemo}
              className="flex items-center gap-1.5 text-[11px] font-bold hover:underline text-[#704904]"
            >
              <RefreshCw className={`w-3 h-3 ${clearingDemo ? 'animate-spin' : ''}`} />
              <span>{t('settings.resetDemoData')}</span>
            </button>
            <button
              onClick={() => setDemoBannerOpen(false)}
              className="text-gray-400 hover:text-gray-700 text-xs px-1"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Main Top Navigation */}
      <div className="flex items-center justify-between px-6 py-3">
        {/* Search with Avada Rounded-Full styling */}
        <div className="relative max-w-xs w-full hidden md:block">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder={t('common.search')}
            className="w-full text-xs pl-10 pr-4 py-2 rounded-full bg-[#f4f9f5] border border-[#e2ece4] text-[#2A3035] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#65BC7B]/20 focus:border-[#65BC7B] transition-all"
          />
        </div>

        {/* Right Actions: Instant Language Switcher + New Booking + Profile */}
        <div className="flex items-center gap-3 ml-auto">
          {/* INSTANT LANGUAGE SWITCHER - Realtime Pill Toggle */}
          <div className="flex items-center p-1 bg-[#f0f9f3] rounded-full border border-[#d6eedb]">
            {[
              { code: 'de' as Locale, label: 'DE', title: 'Deutsch' },
              { code: 'en' as Locale, label: 'EN', title: 'English' },
              { code: 'fr' as Locale, label: 'FR', title: 'Français' },
            ].map((lang) => {
              const isSelected = locale === lang.code;
              return (
                <button
                  key={lang.code}
                  onClick={() => setLocale(lang.code)}
                  title={lang.title}
                  className={`px-2.5 py-1 rounded-full text-xs font-bold transition-all ${
                    isSelected
                      ? 'bg-[#65BC7B] text-white shadow-xs'
                      : 'text-[#4d5e53] hover:text-[#2A3035] hover:bg-white/60'
                  }`}
                >
                  {lang.label}
                </button>
              );
            })}
          </div>

          {/* Quick Action Button - Avada Rounded-Full Vibrant Green */}
          <button
            onClick={onNewBookingClick}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#65BC7B] hover:bg-[#52a366] text-white text-xs font-bold rounded-full shadow-sm shadow-[#65BC7B]/25 transition-all active:scale-95"
          >
            <PlusCircle className="w-4 h-4" />
            <span>{t('navigation.newBooking')}</span>
          </button>

          {/* User Profile */}
          <div className="relative">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center gap-2.5 p-1 pl-3 rounded-full border border-[#e2ece4] hover:bg-[#f0f9f3] transition-colors"
            >
              <div className="flex flex-col text-right hidden sm:flex">
                <span className="text-xs font-bold text-[#2A3035] leading-none">
                  {currentUser?.name || 'Gesa Langenberg'}
                </span>
                <span className="text-[10px] text-[#6b7c70] font-medium mt-0.5">
                  {currentUser?.roleDisplayName || t('navigation.benutzer')}
                </span>
              </div>
              <div className="w-8 h-8 rounded-full bg-[#65BC7B] text-white font-bold text-xs flex items-center justify-center shadow-xs">
                {(currentUser?.name || 'G')[0]}
              </div>
            </button>

            {userMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-[#e2ece4] py-1.5 z-50 animate-in fade-in duration-100">
                <div className="px-4 py-2 border-b border-gray-100">
                  <p className="text-xs font-bold text-[#2A3035] truncate">{currentUser?.name || 'Gesa Langenberg'}</p>
                  <p className="text-[10px] text-gray-500 truncate">{currentUser?.email || 'gesa.langenberg@lampe-agrar.de'}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 flex items-center gap-2 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>{t('common.logout')}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
