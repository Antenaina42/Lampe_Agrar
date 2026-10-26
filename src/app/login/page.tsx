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
        throw new Error(data.error || 'Anmeldung fehlgeschlagen');
      }

      window.location.href = '/dashboard';
    } catch (err: any) {
      setError(err.message || 'Verbindungsfehler');
    } finally {
      setLoading(false);
    }
  };

  const setDemoAccount = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('password123');
  };

  return (
    <div className="min-h-screen bg-[#f8faf7] flex flex-col justify-center items-center p-4">
      {/* Language Switcher Bar */}
      <div className="absolute top-6 right-6 flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-[#dce3da] shadow-sm">
        <Globe className="w-3.5 h-3.5 text-[#226c3d]" />
        <div className="flex gap-1.5">
          {SUPPORTED_LOCALES.map((l) => (
            <button
              key={l.code}
              onClick={() => setLocale(l.code)}
              className={`text-xs px-2 py-0.5 rounded-lg transition-colors ${
                locale === l.code
                  ? 'bg-[#226c3d] text-white font-bold'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {l.name}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-md w-full bg-white rounded-3xl shadow-xl shadow-emerald-950/5 border border-[#e2e8df] overflow-hidden">
        {/* Header */}
        <div className="p-8 text-center bg-[#fbfcfb] border-b border-[#e5ebe2]">
          <div className="w-14 h-14 rounded-2xl bg-[#226c3d] flex items-center justify-center text-white shadow-md mx-auto mb-4">
            <Wheat className="w-8 h-8 text-[#f7faf6]" />
          </div>
          <h1 className="text-xl font-bold tracking-tight text-[#212921]">
            Lampe Agrar Finanzmanager
          </h1>
          <p className="text-xs text-[#5c6e5c] font-medium mt-1">
            Gesa & Dr. Josef Langenberg • Bockstedt
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-8 space-y-4">
          {error && (
            <div className="p-3 text-xs bg-red-50 text-red-700 rounded-xl border border-red-200">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              E-Mail Adresse
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full text-xs pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#226c3d]/20 focus:border-[#226c3d]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 mb-1.5">
              Passwort
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full text-xs pl-10 pr-4 py-2.5 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#226c3d]/20 focus:border-[#226c3d]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-[#226c3d] hover:bg-[#1b5e20] text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-emerald-950/10 flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
          >
            <span>{loading ? t('common.loading') : 'Anmelden'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {/* Quick Demo Accounts Selection */}
          <div className="pt-4 border-t border-gray-100 mt-6">
            <div className="flex items-center gap-1.5 text-[11px] font-semibold text-gray-500 mb-2">
              <ShieldCheck className="w-3.5 h-3.5 text-[#226c3d]" />
              <span>Schnellauswahl Testzugang:</span>
            </div>
            <div className="grid grid-cols-2 gap-1.5 text-[10px]">
              <button
                type="button"
                onClick={() => setDemoAccount('gesa.langenberg@lampe-agrar.de')}
                className="p-1.5 text-left rounded-lg bg-[#f4f7f3] hover:bg-[#e8efe6] text-gray-700 font-medium truncate"
              >
                Gesa Langenberg (Betriebsleiterin)
              </button>
              <button
                type="button"
                onClick={() => setDemoAccount('josef.langenberg@lampe-agrar.de')}
                className="p-1.5 text-left rounded-lg bg-[#f4f7f3] hover:bg-[#e8efe6] text-gray-700 font-medium truncate"
              >
                Dr. Josef Langenberg (Betriebsleiter)
              </button>
              <button
                type="button"
                onClick={() => setDemoAccount('kenneth.makowka@lampe-agrar.de')}
                className="p-1.5 text-left rounded-lg bg-[#f4f7f3] hover:bg-[#e8efe6] text-gray-700 font-medium truncate"
              >
                Kenneth Makowka (Ackerbauleiter)
              </button>
              <button
                type="button"
                onClick={() => setDemoAccount('berater@steuerbuero-diepholz.de')}
                className="p-1.5 text-left rounded-lg bg-[#f4f7f3] hover:bg-[#e8efe6] text-gray-700 font-medium truncate"
              >
                Steuerberater (Prüfer)
              </button>
            </div>
          </div>
        </form>
      </div>

      <p className="text-[11px] text-gray-400 mt-6 text-center">
        Lampe Agrar • 49406 Bockstedt • Niedersachsen • www.hi-gesa.de
      </p>
    </div>
  );
}
