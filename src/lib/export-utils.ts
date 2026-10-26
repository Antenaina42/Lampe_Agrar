import * as XLSX from 'xlsx';

export function exportToCsv(filename: string, headers: string[], rows: (string | number)[][]) {
  const csvContent =
    'data:text/csv;charset=utf-8,\uFEFF' +
    [headers.join(';'), ...rows.map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(';'))].join('\n');

  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function exportToExcel(filename: string, sheetName: string, headers: string[], rows: (string | number)[][]) {
  const data = [headers, ...rows];
  const ws = XLSX.utils.aoa_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, sheetName || 'Daten');
  XLSX.writeFile(wb, `${filename}.xlsx`);
}

/**
 * Server-side Excel buffer generation
 */
export function generateExcelReport(transactions: any[], title: string): Buffer {
  const headers = ['Datum', 'Beleg-Nr.', 'Typ', 'Betriebszweig', 'Beschreibung', 'Netto (€)', 'USt (€)', 'Brutto (€)'];
  const rows = transactions.map((t) => [
    new Date(t.date).toLocaleDateString('de-DE'),
    t.transactionNumber,
    t.type === 'REVENUE' ? 'Einnahme' : 'Ausgabe',
    t.activity,
    t.description,
    Number(t.amountNet),
    Number(t.vatAmount),
    Number(t.amountGross),
  ]);

  const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, title.slice(0, 31) || 'Journal');
  return XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
}

/**
 * Generates DATEV-compliant Buchungsstapel export format for German tax accountants.
 * Format based on DATEV Format-Vorgaben für Buchungsstapel (ASCII/CSV).
 */
export function generateDatevExport(transactions: Array<any>): string {
  // DATEV Header line
  const header = [
    '"DTVF"',
    '700',
    '21',
    '"Buchungsstapel"',
    '1',
    `"${new Date().toISOString().slice(0, 10).replace(/-/g, '')}"`,
    '""',
    '"LA"', // Lampe Agrar Berater/Mandant Kürzel
    '""',
    '""',
    '1000', // Mandantennummer
    '20260101',
    '4',
    '20261012',
    '"Finanzmanager Lampe Agrar"',
    '""',
    '1',
    '0',
    '0',
    '"EUR"',
  ].join(';');

  // Field names line
  const fieldNames = [
    'Umsatz (ohne Soll/Haben-Kz)',
    'Soll/Haben-Kennzeichen',
    'WKZ',
    'Konto',
    'Gegenkonto (ohne BU-Schlüssel)',
    'BU-Schlüssel',
    'Belegdatum',
    'Belegfeld 1',
    'Buchungstext',
  ].join(';');

  const rows = transactions.map((t) => {
    const d = new Date(t.date);
    const dateFormatted = `${String(d.getDate()).padStart(2, '0')}${String(d.getMonth() + 1).padStart(2, '0')}`;
    const sh = t.type === 'REVENUE' ? 'H' : 'S';
    const konto = t.type === 'REVENUE' ? '8400' : '4000'; // SKR03 / SKR14 Agrar Standardkonten
    const gegenkonto = '1200'; // Bankkonto

    const grossNum = Number(t.amountGross) || 0;

    return [
      grossNum.toFixed(2).replace('.', ','),
      sh,
      'EUR',
      konto,
      gegenkonto,
      '0',
      dateFormatted,
      `"${t.transactionNumber}"`,
      `"${String(t.description || '').replace(/"/g, '""').slice(0, 60)}"`,
    ].join(';');
  });

  return [header, fieldNames, ...rows].join('\r\n');
}

export const generateDatevCsv = generateDatevExport;
