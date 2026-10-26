'use client';

import React, { useEffect, useState } from 'react';
import { AppLayout } from '@/components/AppLayout';
import { useI18n } from '@/lib/i18n';
import { Users, Mail, Phone, MapPin, FileText, CheckCircle2 } from 'lucide-react';

export default function KundenPage() {
  const { t, formatCurrency } = useI18n();
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/partners?type=CUSTOMERS_ONLY')
      .then((res) => res.json())
      .then((json) => {
        setCustomers(json.customers || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-xl font-bold text-[#212921] tracking-tight">
            {t('navigation.kunden')}
          </h1>
          <p className="text-xs text-[#5c6e5c] mt-0.5">
            Abnehmer für Industriekartoffeln, Mastschweine, Zuckerrüben und Getreide
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {customers.map((c) => (
            <div
              key={c.id}
              className="bg-white p-5 rounded-2xl border border-[#e2e8df] shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono font-bold text-gray-400">
                    {c.customerNumber}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-50 text-[#226c3d] font-bold">
                    {t('suppliersPage.paymentTerms')}: {c.paymentTermsDays} {t('suppliersPage.paymentDays')}
                  </span>
                </div>
                <h2 className="text-base font-bold text-gray-800">{c.companyName}</h2>
                {c.contactName && (
                  <p className="text-xs text-gray-500 mt-0.5 font-medium">
                    {t('suppliersPage.contactPerson')}: {c.contactName}
                  </p>
                )}

                <div className="mt-4 space-y-1.5 text-xs text-gray-600">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-gray-400" />
                    <span>{c.address}, {c.postalCode} {c.city}</span>
                  </div>
                  {c.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="w-3.5 h-3.5 text-gray-400" />
                      <span>{c.phone}</span>
                    </div>
                  )}
                  {c.email && (
                    <div className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5 text-gray-400" />
                      <span className="text-[#226c3d]">{c.email}</span>
                    </div>
                  )}
                </div>

                {c.notes && (
                  <div className="mt-3 p-2.5 rounded-xl bg-[#f8faf7] text-[11px] text-gray-600 border border-[#e5ebe2]">
                    {c.notes}
                  </div>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                <span className="text-gray-400">{t('dashboard.unpaidClientInvoices')}:</span>
                <span className="font-bold text-gray-800">
                  {c.invoices?.filter((i: any) => i.status !== 'PAID').length || 0}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
