'use client';

import React, { useEffect, useState } from 'react';
import { AppLayout } from '@/components/AppLayout';
import { useI18n } from '@/lib/i18n';
import { Truck, Mail, Phone, MapPin, CreditCard, Plus, FileText, CheckCircle2 } from 'lucide-react';

export default function LieferantenPage() {
  const { t, formatCurrency } = useI18n();
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    companyName: '',
    contactName: '',
    email: '',
    phone: '',
    address: '',
    postalCode: '',
    city: '',
    category: 'AGRARBEDARF',
    iban: '',
    paymentTermsDays: '14',
    notes: '',
  });

  const loadSuppliers = () => {
    fetch('/api/partners?type=SUPPLIERS_ONLY')
      .then((res) => res.json())
      .then((json) => {
        setSuppliers(json.suppliers || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    loadSuppliers();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/partners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, type: 'SUPPLIER' }),
      });
      if (res.ok) {
        setIsModalOpen(false);
        setFormData({
          companyName: '',
          contactName: '',
          email: '',
          phone: '',
          address: '',
          postalCode: '',
          city: '',
          category: 'AGRARBEDARF',
          iban: '',
          paymentTermsDays: '14',
          notes: '',
        });
        loadSuppliers();
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-[#212921] tracking-tight">
              {t('navigation.lieferanten')}
            </h1>
            <p className="text-xs text-[#5c6e5c] mt-0.5">
              Agrarhandel, Landtechnik, Futtermittel, Saatgut, Pflanzenschutz & Dienstleister
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#226c3d] text-white text-xs font-semibold hover:bg-[#1a5530] transition shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Neuer Lieferant</span>
          </button>
        </div>

        {loading ? (
          <div className="p-8 text-center text-xs text-gray-500">Laden...</div>
        ) : suppliers.length === 0 ? (
          <div className="bg-white p-8 rounded-2xl border border-[#e2e8df] text-center text-xs text-gray-500">
            Keine Lieferanten eingetragen.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {suppliers.map((s) => (
              <div
                key={s.id}
                className="bg-white p-5 rounded-2xl border border-[#e2e8df] shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono font-bold text-gray-400">
                      {s.supplierNumber}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 font-bold">
                      Zahlungsziel: {s.paymentTermsDays} Tage
                    </span>
                  </div>
                  <h2 className="text-base font-bold text-gray-800">{s.companyName}</h2>
                  {s.contactName && (
                    <p className="text-xs text-gray-500 mt-0.5 font-medium">
                      Ansprechpartner: {s.contactName}
                    </p>
                  )}

                  <div className="mt-4 space-y-1.5 text-xs text-gray-600">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3.5 h-3.5 text-gray-400" />
                      <span>{s.address}, {s.postalCode} {s.city}</span>
                    </div>
                    {s.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 text-gray-400" />
                        <span>{s.phone}</span>
                      </div>
                    )}
                    {s.email && (
                      <div className="flex items-center gap-2">
                        <Mail className="w-3.5 h-3.5 text-gray-400" />
                        <span className="text-[#226c3d]">{s.email}</span>
                      </div>
                    )}
                    {s.iban && (
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-3.5 h-3.5 text-gray-400" />
                        <span className="font-mono text-[11px]">{s.iban}</span>
                      </div>
                    )}
                  </div>

                  {s.notes && (
                    <div className="mt-3 p-2.5 rounded-xl bg-[#f8faf7] text-[11px] text-gray-600 border border-[#e5ebe2]">
                      {s.notes}
                    </div>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
                  <span>Rechnungen: {s.invoices?.length || 0}</span>
                  <span className="text-gray-400 text-[10px]">Kategorie: {s.category}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal neuer Lieferant */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-gray-200">
              <h2 className="text-base font-bold text-gray-800 mb-4">Neuen Lieferanten anlegen</h2>
              <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 mb-1">Firmenname *</label>
                  <input
                    type="text"
                    required
                    value={formData.companyName}
                    onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs rounded-xl border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#226c3d]"
                    placeholder="z.B. AGRAVIS Raiffeisen AG"
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-600 mb-1">Ansprechpartner</label>
                    <input
                      type="text"
                      value={formData.contactName}
                      onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                      className="w-full px-3 py-1.5 text-xs rounded-xl border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#226c3d]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-600 mb-1">Zahlungsziel (Tage)</label>
                    <input
                      type="number"
                      value={formData.paymentTermsDays}
                      onChange={(e) => setFormData({ ...formData, paymentTermsDays: e.target.value })}
                      className="w-full px-3 py-1.5 text-xs rounded-xl border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#226c3d]"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-600 mb-1">Telefon</label>
                    <input
                      type="text"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3 py-1.5 text-xs rounded-xl border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#226c3d]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-600 mb-1">E-Mail</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3 py-1.5 text-xs rounded-xl border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#226c3d]"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 mb-1">IBAN</label>
                  <input
                    type="text"
                    value={formData.iban}
                    onChange={(e) => setFormData({ ...formData, iban: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs rounded-xl border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#226c3d]"
                    placeholder="DE..."
                  />
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="col-span-2">
                    <label className="block text-[11px] font-semibold text-gray-600 mb-1">Adresse</label>
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="w-full px-3 py-1.5 text-xs rounded-xl border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#226c3d]"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-gray-600 mb-1">Ort</label>
                    <input
                      type="text"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full px-3 py-1.5 text-xs rounded-xl border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#226c3d]"
                    />
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-100 rounded-xl"
                  >
                    Abbrechen
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 text-xs font-semibold bg-[#226c3d] text-white rounded-xl hover:bg-[#1a5530]"
                  >
                    Speichern
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
