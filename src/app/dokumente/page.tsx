'use client';

import React, { useEffect, useState } from 'react';
import { AppLayout } from '@/components/AppLayout';
import { useI18n } from '@/lib/i18n';
import { FileText, Plus, Download, Folder, FileCheck, Search, Tag } from 'lucide-react';

export default function DokumentePage() {
  const { t, formatDate } = useI18n();
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<string>('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    fileName: '',
    entityType: 'INVOICE',
    notes: '',
  });

  const loadDocuments = () => {
    fetch('/api/documents')
      .then((res) => res.json())
      .then((json) => {
        setDocuments(json.documents || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    loadDocuments();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/documents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileName: formData.fileName,
          entityType: formData.entityType,
          fileSize: Math.floor(Math.random() * 500000) + 150000,
          mimeType: 'application/pdf',
          fileUrl: `/uploads/${formData.fileName.toLowerCase().replace(/\s+/g, '_')}`,
          notes: formData.notes,
        }),
      });

      if (res.ok) {
        setIsModalOpen(false);
        setFormData({ fileName: '', entityType: 'INVOICE', notes: '' });
        loadDocuments();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getDocTypeBadge = (type: string) => {
    switch (type) {
      case 'INVOICE': return <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700">Rechnungsbeleg</span>;
      case 'CONTRACT': return <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-50 text-blue-700">Pachtvertrag</span>;
      case 'SOIL_ANALYSIS': return <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-700">Bodenprobe / Düngung</span>;
      case 'MACHINE_MANUAL': return <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-purple-50 text-purple-700">Maschinenunterlagen</span>;
      default: return <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-gray-50 text-gray-700">{type}</span>;
    }
  };

  const filteredDocs = documents.filter((doc) => {
    if (filterType === 'ALL') return true;
    return doc.entityType === filterType;
  });

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-[#212921] tracking-tight">
              {t('navigation.dokumente')}
            </h1>
            <p className="text-xs text-[#5c6e5c] mt-0.5">
              Zentrales Belegarchiv, Pachtverträge, Bodenanalysen, Düngebedarfsermittlung & Gutachten
            </p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#226c3d] text-white text-xs font-semibold hover:bg-[#1a5530] transition shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Dokument hochladen</span>
          </button>
        </div>

        {/* Filter categories */}
        <div className="flex flex-wrap gap-1.5 p-1 bg-white rounded-xl border border-[#e2e8df] text-xs">
          {[
            { id: 'ALL', label: 'Alle Dokumente' },
            { id: 'INVOICE', label: 'Rechnungsbelege' },
            { id: 'CONTRACT', label: 'Pacht- & Lieferverträge' },
            { id: 'SOIL_ANALYSIS', label: 'Bodenproben & Nährstoffvergleich' },
            { id: 'MACHINE_MANUAL', label: 'Maschinenprüfungen & TÜV' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilterType(cat.id)}
              className={`px-3 py-1.5 rounded-lg font-medium transition ${
                filterType === cat.id
                  ? 'bg-[#226c3d] text-white shadow-xs'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Documents Grid / Table */}
        <div className="bg-white rounded-2xl border border-[#e2e8df] shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#f8faf7] text-gray-600 font-semibold border-b border-[#e2e8df]">
                <tr>
                  <th className="py-2.5 px-4">Dateiname</th>
                  <th className="py-2.5 px-4">Kategorie</th>
                  <th className="py-2.5 px-4">Dateigröße</th>
                  <th className="py-2.5 px-4">Hochgeladen am</th>
                  <th className="py-2.5 px-4">Bemerkungen</th>
                  <th className="py-2.5 px-4 text-right">Aktion</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-gray-400">Laden...</td>
                  </tr>
                ) : filteredDocs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-gray-400">
                      Keine Dokumente in dieser Kategorie vorhanden.
                    </td>
                  </tr>
                ) : (
                  filteredDocs.map((doc) => (
                    <tr key={doc.id} className="hover:bg-gray-50/80 transition">
                      <td className="py-3 px-4 font-bold text-gray-800 flex items-center gap-2">
                        <FileText className="w-4 h-4 text-[#226c3d] shrink-0" />
                        <span>{doc.fileName}</span>
                      </td>
                      <td className="py-3 px-4">{getDocTypeBadge(doc.entityType)}</td>
                      <td className="py-3 px-4 font-mono text-gray-500">
                        {Math.round(doc.fileSize / 1024)} KB
                      </td>
                      <td className="py-3 px-4 text-gray-500">{formatDate(doc.createdAt)}</td>
                      <td className="py-3 px-4 text-gray-600 text-[11px]">{doc.notes || '–'}</td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => alert(`Download: ${doc.fileName}`)}
                          className="p-1.5 text-gray-500 hover:text-[#226c3d] rounded-lg hover:bg-gray-100 transition"
                          title="Herunterladen"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal: New Document */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl border border-gray-200">
              <h2 className="text-base font-bold text-gray-800 mb-4">Dokument archivieren</h2>
              <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 mb-1">Dateiname / Bezeichnung *</label>
                  <input
                    type="text"
                    required
                    placeholder="z.B. Pachtvertrag_Flurstueck_Bockstedt_2026.pdf"
                    value={formData.fileName}
                    onChange={(e) => setFormData({ ...formData, fileName: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs rounded-xl border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#226c3d]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 mb-1">Kategorie</label>
                  <select
                    value={formData.entityType}
                    onChange={(e) => setFormData({ ...formData, entityType: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs rounded-xl border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#226c3d]"
                  >
                    <option value="INVOICE">Rechnungsbeleg</option>
                    <option value="CONTRACT">Pachtvertrag / Lieferkontrakt</option>
                    <option value="SOIL_ANALYSIS">Bodenprobe / Düngebedarfsermittlung</option>
                    <option value="MACHINE_MANUAL">Maschinenpapiere / UVV-Prüfung</option>
                    <option value="GENERAL">Sonstiges Dokument</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-gray-600 mb-1">Bemerkung / Notiz</label>
                  <textarea
                    rows={2}
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full px-3 py-1.5 text-xs rounded-xl border border-gray-300 focus:outline-none focus:ring-1 focus:ring-[#226c3d]"
                    placeholder="Details, Vertragsnummer, Ansprechpartner"
                  />
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
