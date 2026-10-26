'use client';

import React, { useState } from 'react';
import { useI18n, SUPPORTED_LOCALES } from '@/lib/i18n';
import { Wheat, Lock, Mail, Globe, ArrowRight, ShieldCheck } from 'lucide-react';

export default function LoginPage() {
  const { locale, setLocale, t } = useI18n();
  const [email, setEmail] = useState('gesa.langenberg@lampe-agrar.de');
  const [password, setPassword] = useState('password123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || t('auth.loginFailed'));
      }

      window.location.href = '/dashboard';
    } catch (err: any) {
      setError(err.message || t('auth.networkError'));
    } finally {
      setLoading(false);
    }
  };

  const setDemoAccount = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('password123');
  };

  return (
    <div className="min-h-screen bg-[#f8faf7] flex flex-col justify-center items-center p-4 relative">
      {/* Language Switcher Bar - Avada Veterinarian rounded-full pill */}
      <div className="absolute top-6 right-6 flex items-center gap-2 bg-white px-3.5 py-1.5 rounded-full border border-[#e3ede5] shadow-xs">
        <Globe className="w-3.5 h-3.5 text-[#65BC7B]" />
        <div className="flex gap-1">
          {SUPPORTED_LOCALES.map((l) => (
            <button
              key={l.code}
              type="button"
              onClick={() => setLocale(l.code)}
              className={`text-xs px-3 py-1 rounded-full transition-all font-bold ${
                locale === l.code
                  ? 'bg-[#65BC7B] text-white shadow-2xs'
                  : 'text-[#637381] hover:text-[#2A3035] hover:bg-[#f0f9f3]'
              }`}
            >
              {l.name}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl shadow-[#65BC7B]/5 border border-[#e3ede5] overflow-hidden">
        {/* Header with Circular Icon */}
        <div className="p-8 text-center bg-[#fbfcfb] border-b border-[#e3ede5]">
          <div className="w-16 h-16 rounded-full bg-[#f0f9f3] border-2 border-[#65BC7B]/20 flex items-center justify-center text-[#65BC7B] shadow-xs mx-auto mb-4">
            <Wheat className="w-8 h-8 text-[#65BC7B]" />
          </div>
          <h1 className="text-xl font-extrabold tracking-tight text-[#2A3035]">
            {t('auth.signInTitle')}
          </h1>
          <p className="text-xs text-[#637381] font-medium mt-1">
            {t('auth.signInSubtitle')}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-4">
          {error && (
            <div className="p-3 text-xs bg-rose-50 text-rose-700 rounded-2xl border border-rose-200 font-medium">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-[#2A3035] mb-1.5">
              {t('auth.email')}
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full text-xs pl-10 pr-4 py-2.5 rounded-xl border border-[#e3ede5] focus:outline-none focus:border-[#65BC7B] focus:ring-2 focus:ring-[#65BC7B]/20 text-[#2A3035]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#2A3035] mb-1.5">
              {t('auth.password')}
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full text-xs pl-10 pr-4 py-2.5 rounded-xl border border-[#e3ede5] focus:outline-none focus:border-[#65BC7B] focus:ring-2 focus:ring-[#65BC7B]/20 text-[#2A3035]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#65BC7B] hover:bg-[#52a366] text-white text-xs font-bold rounded-full transition-all shadow-md shadow-[#65BC7B]/20 flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
          >
            <span>{loading ? t('common.loading') : t('auth.login')}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {/* Super Admin Demo Account Button */}
          <div className="pt-5 border-t border-gray-100 mt-6">
            <button
              type="button"
              onClick={() => {
                setEmail('gesa.langenberg@lampe-agrar.de');
                setPassword('password123');
              }}
              className="w-full p-3 rounded-2xl bg-[#f0f9f3] hover:bg-[#e3ede5] border border-[#65BC7B]/30 flex items-center justify-between text-left transition group shadow-xs"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-white border border-[#65BC7B]/30 flex items-center justify-center text-[#65BC7B] shadow-2xs">
                  <ShieldCheck className="w-4 h-4 text-[#65BC7B]" />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#2A3035] group-hover:text-[#226c3d] transition">
                    {t('auth.demoSuperAdminBtn')}
                  </div>
                  <div className="text-[10px] text-[#637381] font-medium">
                    {t('auth.demoSuperAdminDesc')}
                  </div>
                </div>
              </div>
              <span className="text-[10px] font-bold text-[#226c3d] bg-white px-2.5 py-1 rounded-lg border border-[#65BC7B]/20 shadow-2xs">
                {t('auth.oneClickLogin')}
              </span>
            </button>
          </div>
        </form>
      </div>

      <p className="text-[11px] text-[#637381] mt-6 text-center">
        {t('auth.footerLocation')}
      </p>
    </div>
  );
}
