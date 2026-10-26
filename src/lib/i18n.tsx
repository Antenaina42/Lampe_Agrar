'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import deMessages from '@/messages/de.json';
import enMessages from '@/messages/en.json';
import frMessages from '@/messages/fr.json';

export type Locale = 'de' | 'en' | 'fr';

export const SUPPORTED_LOCALES: { code: Locale; name: string }[] = [
  { code: 'de', name: 'Deutsch' },
  { code: 'en', name: 'English' },
  { code: 'fr', name: 'Français' },
];

const messageCatalogs: Record<Locale, Record<string, any>> = {
  de: deMessages,
  en: enMessages,
  fr: frMessages,
};

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, params?: Record<string, string | number>) => string;
  formatCurrency: (amount: number | string | null | undefined) => string;
  formatDate: (date: Date | string | null | undefined) => string;
  formatNumber: (amount: number | string | null | undefined, decimals?: number) => string;
}

const I18nContext = createContext<I18nContextType | null>(null);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('de');

  useEffect(() => {
    // 1. Check localStorage or cookies for saved user preference
    const saved = localStorage.getItem('lampe_agrar_locale') as Locale;
    if (saved && (saved === 'de' || saved === 'en' || saved === 'fr')) {
      setLocaleState(saved);
    }
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem('lampe_agrar_locale', newLocale);
    document.cookie = `lampe_agrar_locale=${newLocale}; path=/; max-age=31536000; SameSite=Lax`;
    // Also sync to backend if user is logged in
    fetch('/api/user/preference', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ language: newLocale }),
    }).catch(() => {});
  };

  const t = (key: string, params?: Record<string, string | number>): string => {
    const keys = key.split('.');
    let val: any = messageCatalogs[locale];

    for (const k of keys) {
      if (val && typeof val === 'object' && k in val) {
        val = val[k];
      } else {
        // Fallback to German if missing in EN or FR
        let fallbackVal: any = messageCatalogs['de'];
        for (const fbKey of keys) {
          if (fallbackVal && typeof fallbackVal === 'object' && fbKey in fallbackVal) {
            fallbackVal = fallbackVal[fbKey];
          } else {
            fallbackVal = key;
            break;
          }
        }
        val = fallbackVal;
        break;
      }
    }

    if (typeof val !== 'string') {
      return key;
    }

    if (params) {
      let result = val;
      for (const [pKey, pVal] of Object.entries(params)) {
        result = result.replace(new RegExp(`{${pKey}}`, 'g'), String(pVal));
      }
      return result;
    }

    return val;
  };

  const formatCurrency = (amount: number | string | null | undefined): string => {
    const num = Number(amount) || 0;
    if (locale === 'de') {
      return (
        new Intl.NumberFormat('de-DE', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(num) + ' €'
      );
    } else if (locale === 'en') {
      return (
        '€' +
        new Intl.NumberFormat('en-GB', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(num)
      );
    } else {
      // fr-FR
      return (
        new Intl.NumberFormat('fr-FR', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }).format(num) + ' €'
      );
    }
  };

  const formatDate = (date: Date | string | null | undefined): string => {
    if (!date) return '-';
    const d = new Date(date);
    if (isNaN(d.getTime())) return '-';

    if (locale === 'de') {
      return new Intl.DateTimeFormat('de-DE', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      }).format(d);
    } else if (locale === 'en') {
      return new Intl.DateTimeFormat('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      }).format(d);
    } else {
      return new Intl.DateTimeFormat('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      }).format(d);
    }
  };

  const formatNumber = (
    amount: number | string | null | undefined,
    decimals = 2
  ): string => {
    const num = Number(amount) || 0;
    const loc = locale === 'de' ? 'de-DE' : locale === 'en' ? 'en-GB' : 'fr-FR';
    return new Intl.NumberFormat(loc, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    }).format(num);
  };

  return (
    <I18nContext.Provider
      value={{
        locale,
        setLocale,
        t,
        formatCurrency,
        formatDate,
        formatNumber,
      }}
    >
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
}
