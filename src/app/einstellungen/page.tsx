'use client';

import React, { useEffect, useState } from 'react';
import { AppLayout } from '@/components/AppLayout';
import { useI18n, Locale } from '@/lib/i18n';
import { Settings, Globe, Sparkles, Database, Save, RotateCcw, Trash2, Building, CheckCircle2, ShieldAlert } from 'lucide-react';

export default function EinstellungenPage() {
  const { t, locale, setLocale } = useI18n();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [animationsEnabled, setAnimationsEnabled] = useState(true);
  const [settingsForm, setSettingsForm] = useState({
    farmName: 'Lampe Agrar',
    ownerName: 'Gesa & Dr. Josef Langenberg',
    street: 'Hünenheide 3',
    postalCode: '49406',
    city: 'Bockstedt / Drentwede',
    taxNumber: '25/203/04819',
    vatId: 'DE312456789',
    phone: '+49 5442 80300',
    email: 'kontakt@lampe-agrar.de',
    website: 'https://www.hi-gesa.de/',
    bankName: 'Volksbank eG Diepholz-Barnstorf',
    iban: 'DE44 2806 2200 0001 2345 67',
    bic: 'GENODEF1BRN',
  });
  const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    // Load farm settings
    fetch('/api/farm-settings')
      .then((res) => res.json())
      .then((json) => {
        if (json.settings) {
          setSettingsForm(json.settings);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));

    // Check user preference
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((json) => {
        if (json.user?.preference) {
          setAnimationsEnabled(json.user.preference.animationsEnabled ?? true);
        }
      })
      .catch(() => {});
  }, []);

  const handleLanguageChange = async (newLocale: Locale) => {
    setLocale(newLocale);
    try {
      await fetch('/api/user/preference', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ language: newLocale }),
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleAnimationToggle = async (val: boolean) => {
    setAnimationsEnabled(val);
    try {
      await fetch('/api/user/preference', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ animationsEnabled: val }),
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleSaveFarmSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMsg(null);
    try {
      const res = await fetch('/api/farm-settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settingsForm),
      });
      if (res.ok) {
        setMsg({ type: 'success', text: 'Betriebsdaten wurden erfolgreich gespeichert.' });
      } else {
        setMsg({ type: 'error', text: 'Fehler beim Speichern der Betriebsdaten.' });
      }
    } catch (err: any) {
      setMsg({ type: 'error', text: err.message });
    } finally {
      setSaving(false);
    }
  };

  const handleResetDemoData = async () => {
    if (!confirm('Möchten Sie die Demonstrationsdaten wirklich zurücksetzen? Alle Testbuchungen werden auf den Standardzustand zurückgesetzt.')) {
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/demo-data', { method: 'POST' });
      const json = await res.json();
      if (res.ok) {
        alert(json.message || 'Demodaten erfolgreich neu initialisiert.');
        window.location.reload();
      } else {
        alert(json.error || 'Fehler beim Zurücksetzen.');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleClearDemoData = async () => {
    if (!confirm('Achtung: Möchten Sie alle mit DEMO markierten Buchungen und Datensätze endgültig löschen?')) {
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/demo-data', { method: 'DELETE' });
      const json = await res.json();
      if (res.ok) {
        alert(json.message || 'Demodaten entfernt.');
        window.location.reload();
      } else {
        alert(json.error || 'Fehler beim Entfernen.');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6 max-w-4xl">
        {/* Header */}
        <div>
          <h1 className="text-xl font-bold text-[#212921] tracking-tight">
            {t('settings.title')}
          </h1>
          <p className="text-xs text-[#5c6e5c] mt-0.5">
            {t('settings.subtitle')}
          </p>
        </div>

        {msg && (
          <div className={`p-3.5 rounded-2xl flex items-center gap-2 text-xs font-semibold ${msg.type === 'success' ? 'bg-emerald-50 text-[#226c3d] border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'}`}>
            <CheckCircle2 className="w-4 h-4" />
            <span>{msg.text}</span>
          </div>
        )}

        {/* Section 1: User & Interface Preferences */}
        <div className="bg-white p-5 rounded-2xl border border-[#e2e8df] shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
            <Globe className="w-4 h-4 text-[#226c3d]" />
            <h2 className="text-sm font-bold text-gray-800">{t('settings.languageAndUi')}</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2">
                {t('settings.languagePreference')}
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { code: 'de', label: 'Deutsch' },
                  { code: 'en', label: 'English' },
                  { code: 'fr', label: 'Français' },
                ].map((item) => (
                  <button
                    key={item.code}
                    type="button"
                    onClick={() => handleLanguageChange(item.code as Locale)}
                    className={`py-2 px-3 rounded-xl text-xs font-bold transition border ${
                      locale === item.code
                        ? 'bg-[#226c3d] text-white border-[#226c3d] shadow-xs'
                        : 'bg-[#fcfdfc] text-gray-700 border-gray-200 hover:bg-gray-50'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
              <span className="text-[10px] text-gray-400 mt-1 block">
                Standard: Deutsch. Auswahl wird im Benutzerprofil gespeichert.
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2">
                {t('settings.animationsToggle')}
              </label>
              <div className="flex items-center gap-3 mt-1">
                <button
                  type="button"
                  onClick={() => handleAnimationToggle(!animationsEnabled)}
                  className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                    animationsEnabled ? 'bg-[#226c3d]' : 'bg-gray-200'
                  }`}
                >
                  <span
                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                      animationsEnabled ? 'translate-x-5' : 'translate-x-0'
                    }`}
                  />
                </button>
                <span className="text-xs text-gray-600">
                  {animationsEnabled ? 'Aktiviert (Tractor-Intro & Icons)' : 'Deaktiviert (Reduzierte Bewegung)'}
                </span>
              </div>
              <span className="text-[10px] text-gray-400 mt-1 block">
                Unterstützt auch 'prefers-reduced-motion'.
              </span>
            </div>
          </div>
        </div>

        {/* Section 2: Farm Company Profile */}
        <div className="bg-white p-5 rounded-2xl border border-[#e2e8df] shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
            <Building className="w-4 h-4 text-[#226c3d]" />
            <h2 className="text-sm font-bold text-gray-800">{t('settings.companyProfile')}</h2>
          </div>

          <form onSubmit={handleSaveFarmSettings} className="space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-gray-600 mb-1">{t('settings.farmName')}</label>
                <input
                  type="text"
                  value={settingsForm.farmName}
                  onChange={(e) => setSettingsForm({ ...settingsForm, farmName: e.target.value })}
                  className="w-full px-3 py-1.5 text-xs rounded-xl border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#226c3d]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-gray-600 mb-1">{t('settings.ownerName')}</label>
                <input
                  type="text"
                  value={settingsForm.ownerName}
                  onChange={(e) => setSettingsForm({ ...settingsForm, ownerName: e.target.value })}
                  className="w-full px-3 py-1.5 text-xs rounded-xl border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#226c3d]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-[11px] font-semibold text-gray-600 mb-1">{t('settings.street')}</label>
                <input
                  type="text"
                  value={settingsForm.street}
                  onChange={(e) => setSettingsForm({ ...settingsForm, street: e.target.value })}
                  className="w-full px-3 py-1.5 text-xs rounded-xl border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#226c3d]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-gray-600 mb-1">{t('settings.postalCity')}</label>
                <input
                  type="text"
                  value={`${settingsForm.postalCode} ${settingsForm.city}`}
                  onChange={(e) => {
                    const parts = e.target.value.split(' ');
                    setSettingsForm({ ...settingsForm, postalCode: parts[0] || '', city: parts.slice(1).join(' ') || '' });
                  }}
                  className="w-full px-3 py-1.5 text-xs rounded-xl border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#226c3d]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-gray-600 mb-1">{t('settings.taxNumber')}</label>
                <input
                  type="text"
                  value={settingsForm.taxNumber}
                  onChange={(e) => setSettingsForm({ ...settingsForm, taxNumber: e.target.value })}
                  className="w-full px-3 py-1.5 text-xs rounded-xl border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#226c3d]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-gray-600 mb-1">{t('settings.vatNumber')}</label>
                <input
                  type="text"
                  value={settingsForm.vatId}
                  onChange={(e) => setSettingsForm({ ...settingsForm, vatId: e.target.value })}
                  className="w-full px-3 py-1.5 text-xs rounded-xl border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#226c3d]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-gray-600 mb-1">{t('settings.mainBank')}</label>
                <input
                  type="text"
                  value={settingsForm.bankName}
                  onChange={(e) => setSettingsForm({ ...settingsForm, bankName: e.target.value })}
                  className="w-full px-3 py-1.5 text-xs rounded-xl border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#226c3d]"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-gray-600 mb-1">{t('settings.farmIban')}</label>
                <input
                  type="text"
                  value={settingsForm.iban}
                  onChange={(e) => setSettingsForm({ ...settingsForm, iban: e.target.value })}
                  className="w-full px-3 py-1.5 text-xs font-mono rounded-xl border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#226c3d]"
                />
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#226c3d] text-white text-xs font-bold hover:bg-[#1a5530] transition shadow-xs disabled:opacity-50"
              >
                <Save className="w-3.5 h-3.5" />
                <span>{saving ? 'Speichern...' : 'Betriebsdaten sichern'}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Section 3: Demo Data Management */}
        <div className="bg-white p-5 rounded-2xl border border-amber-200 bg-amber-50/20 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-amber-200/60 pb-3">
            <Database className="w-4 h-4 text-amber-700" />
            <h2 className="text-sm font-bold text-gray-800">Verwaltung der Demonstrationsdaten</h2>
          </div>

          <p className="text-xs text-gray-600 leading-relaxed">
            Die Anwendung ist mit realistischen Daten für Lampe Agrar vorinitialisiert (Schläge in Bockstedt, H4- und H2-Stallungen, Fendt-Fuhrpark, Kartoffellager, Buchungsposten).
            Alle Demodatensätze sind intern mit <code className="px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 font-mono text-[10px]">isDemo: true</code> markiert und können isoliert gesteuert werden.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-1">
            <button
              onClick={handleResetDemoData}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-gray-300 text-gray-700 text-xs font-semibold hover:bg-gray-50 transition shadow-xs"
            >
              <RotateCcw className="w-3.5 h-3.5 text-gray-500" />
              <span>{t('settings.resetDemoData')}</span>
            </button>
            <button
              onClick={handleClearDemoData}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold hover:bg-rose-100 transition shadow-xs"
            >
              <Trash2 className="w-3.5 h-3.5 text-rose-600" />
              <span>{t('settings.clearDemoData')}</span>
            </button>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
