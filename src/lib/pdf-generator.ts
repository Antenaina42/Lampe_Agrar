import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Locale } from './i18n';

export interface InvoicePdfData {
  invoiceNumber: string;
  type: 'OUTGOING' | 'INCOMING';
  issueDate: string | Date;
  dueDate: string | Date;
  customer?: {
    companyName: string;
    contactName?: string | null;
    address?: string | null;
    postalCode?: string | null;
    city?: string | null;
    vatNumber?: string | null;
  } | null;
  supplier?: {
    companyName: string;
    contactName?: string | null;
    address?: string | null;
    postalCode?: string | null;
    city?: string | null;
    vatNumber?: string | null;
  } | null;
  lines: Array<{
    description: string;
    quantity: number;
    unit: string;
    unitPrice: number;
    taxRate: number;
    taxAmount: number;
    subtotal: number;
    total: number;
  }>;
  subtotal: number;
  taxAmount: number;
  totalAmount: number;
  paidAmount: number;
  notes?: string | null;
}

const PDF_TRANSLATIONS: Record<Locale, Record<string, string>> = {
  de: {
    invoiceTitle: 'RECHNUNG',
    creditTitle: 'GUTSCHRIFT',
    invoiceNumber: 'Rechnungs-Nr.',
    date: 'Datum',
    dueDate: 'Fällig am',
    sender: 'Absender',
    recipient: 'Empfänger',
    pos: 'Pos.',
    description: 'Bezeichnung / Leistung',
    quantity: 'Menge',
    unit: 'Einheit',
    unitPrice: 'Einzelpreis',
    vatRate: 'USt %',
    total: 'Gesamt (€)',
    subtotalNet: 'Nettobetrag:',
    vat: 'Umsatzsteuer:',
    grossTotal: 'Rechnungsbetrag brutto:',
    paid: 'Bereits beglichen:',
    due: 'Zahlbarer Restbetrag:',
    bankDetails: 'Bankverbindung:',
    iban: 'IBAN:',
    bic: 'BIC:',
    bank: 'Kreditinstitut: Volksbank Vechta eG',
    legalNotice: 'Rechnungslegung gemäß UStG. Zahlbar innerhalb des Zahlungsziels ohne Abzug.',
    page: 'Seite',
  },
  en: {
    invoiceTitle: 'INVOICE',
    creditTitle: 'CREDIT NOTE',
    invoiceNumber: 'Invoice No.',
    date: 'Date',
    dueDate: 'Due Date',
    sender: 'From',
    recipient: 'Bill To',
    pos: 'Item',
    description: 'Description of Goods / Services',
    quantity: 'Qty',
    unit: 'Unit',
    unitPrice: 'Unit Price',
    vatRate: 'VAT %',
    total: 'Total (€)',
    subtotalNet: 'Subtotal Net:',
    vat: 'VAT Amount:',
    grossTotal: 'Total Gross Amount:',
    paid: 'Amount Paid:',
    due: 'Balance Due:',
    bankDetails: 'Bank Payment Details:',
    iban: 'IBAN:',
    bic: 'BIC:',
    bank: 'Bank: Volksbank Vechta eG',
    legalNotice: 'Invoiced according to German VAT Act. Payable within terms without deduction.',
    page: 'Page',
  },
  fr: {
    invoiceTitle: 'FACTURE',
    creditTitle: 'AVOIR',
    invoiceNumber: 'Facture N°',
    date: 'Date',
    dueDate: 'Échéance',
    sender: 'Émetteur',
    recipient: 'Destinataire',
    pos: 'N°',
    description: 'Désignation des produits / prestations',
    quantity: 'Quantité',
    unit: 'Unité',
    unitPrice: 'Prix unitaire',
    vatRate: 'TVA %',
    total: 'Total (€)',
    subtotalNet: 'Total HT:',
    vat: 'Montant TVA:',
    grossTotal: 'Total TTC:',
    paid: 'Montant réglé:',
    due: 'Reste à payer:',
    bankDetails: 'Coordonnées bancaires:',
    iban: 'IBAN:',
    bic: 'BIC:',
    bank: 'Banque: Volksbank Vechta eG',
    legalNotice: 'Facturé conformément aux règles fiscales allemandes (UStG). Payable à échéance sans escompte.',
    page: 'Page',
  },
};

export function generateInvoicePdf(data: InvoicePdfData, lang: Locale = 'de'): jsPDF {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const t = PDF_TRANSLATIONS[lang] || PDF_TRANSLATIONS.de;

  // Agricultural Green branding colors
  const primaryColor: [number, number, number] = [34, 108, 61]; // #226c3d
  const darkTextColor: [number, number, number] = [33, 41, 33]; // #212921

  // Header - Farm details
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(...primaryColor);
  doc.text('LAMPE AGRAR', 20, 22);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(90, 100, 90);
  doc.text('Gesa & Dr. Josef Langenberg GbR • Hünenheide 3 • 49406 Bockstedt / Drentwede', 20, 28);
  doc.text('Tel: 04246/95026 • Mobil: 0151/42343339 • info@lampe-agrar.de • www.hi-gesa.de', 20, 33);

  // Decorative green bar
  doc.setDrawColor(...primaryColor);
  doc.setLineWidth(0.8);
  doc.line(20, 37, 190, 37);

  // Recipient Box
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(...darkTextColor);

  const recipient = data.customer || data.supplier;
  let recipientY = 48;
  doc.setFont('helvetica', 'bold');
  doc.text(recipient?.companyName || 'Empfänger / Client', 20, recipientY);
  doc.setFont('helvetica', 'normal');
  if (recipient?.contactName) {
    recipientY += 5;
    doc.text(`z.Hd. ${recipient.contactName}`, 20, recipientY);
  }
  if (recipient?.address) {
    recipientY += 5;
    doc.text(recipient.address, 20, recipientY);
  }
  if (recipient?.postalCode || recipient?.city) {
    recipientY += 5;
    doc.text(`${recipient.postalCode || ''} ${recipient.city || ''}`, 20, recipientY);
  }
  if (recipient?.vatNumber) {
    recipientY += 5;
    doc.text(`USt-IdNr.: ${recipient.vatNumber}`, 20, recipientY);
  }

  // Invoice Title & Meta details Box (Right aligned)
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.setTextColor(...primaryColor);
  doc.text(t.invoiceTitle, 140, 48);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(...darkTextColor);
  doc.text(`${t.invoiceNumber}: ${data.invoiceNumber}`, 140, 56);

  const issueDateStr = new Date(data.issueDate).toLocaleDateString(
    lang === 'de' ? 'de-DE' : lang === 'en' ? 'en-GB' : 'fr-FR'
  );
  const dueDateStr = new Date(data.dueDate).toLocaleDateString(
    lang === 'de' ? 'de-DE' : lang === 'en' ? 'en-GB' : 'fr-FR'
  );
  doc.text(`${t.date}: ${issueDateStr}`, 140, 62);
  doc.text(`${t.dueDate}: ${dueDateStr}`, 140, 68);

  // Line items table
  const tableRows = data.lines.map((line, idx) => [
    String(idx + 1),
    line.description,
    line.quantity.toLocaleString(lang === 'de' ? 'de-DE' : lang === 'en' ? 'en-GB' : 'fr-FR'),
    line.unit,
    line.unitPrice.toFixed(2) + ' €',
    `${line.taxRate.toFixed(1)}%`,
    line.total.toFixed(2) + ' €',
  ]);

  autoTable(doc, {
    startY: 85,
    margin: { left: 20, right: 20 },
    head: [[t.pos, t.description, t.quantity, t.unit, t.unitPrice, t.vatRate, t.total]],
    body: tableRows,
    theme: 'grid',
    headStyles: {
      fillColor: primaryColor,
      textColor: [255, 255, 255],
      fontSize: 9,
      fontStyle: 'bold',
      halign: 'left',
    },
    columnStyles: {
      0: { cellWidth: 10, halign: 'center' },
      1: { cellWidth: 'auto' },
      2: { cellWidth: 18, halign: 'right' },
      3: { cellWidth: 15, halign: 'center' },
      4: { cellWidth: 22, halign: 'right' },
      5: { cellWidth: 18, halign: 'right' },
      6: { cellWidth: 25, halign: 'right' },
    },
    styles: {
      fontSize: 8.5,
      textColor: darkTextColor,
      cellPadding: 2.5,
    },
    alternateRowStyles: {
      fillColor: [248, 250, 247],
    },
  });

  // Totals Section
  const finalY = (doc as any).lastAutoTable?.finalY || 140;
  const totalsX = 120;
  let totalsY = finalY + 8;

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(t.subtotalNet, totalsX, totalsY);
  doc.text(data.subtotal.toFixed(2) + ' €', 190, totalsY, { align: 'right' });

  totalsY += 5;
  doc.text(t.vat, totalsX, totalsY);
  doc.text(data.taxAmount.toFixed(2) + ' €', 190, totalsY, { align: 'right' });

  totalsY += 6;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(...primaryColor);
  doc.text(t.grossTotal, totalsX, totalsY);
  doc.text(data.totalAmount.toFixed(2) + ' €', 190, totalsY, { align: 'right' });

  const remaining = Math.max(0, data.totalAmount - data.paidAmount);
  if (data.paidAmount > 0) {
    totalsY += 5;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(80, 80, 80);
    doc.text(t.paid, totalsX, totalsY);
    doc.text('- ' + data.paidAmount.toFixed(2) + ' €', 190, totalsY, { align: 'right' });

    totalsY += 5;
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...darkTextColor);
    doc.text(t.due, totalsX, totalsY);
    doc.text(remaining.toFixed(2) + ' €', 190, totalsY, { align: 'right' });
  }

  // Footer notes & Bank Details
  let footerY = Math.max(totalsY + 15, 230);
  doc.setDrawColor(210, 220, 210);
  doc.setLineWidth(0.4);
  doc.line(20, footerY, 190, footerY);

  footerY += 6;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(...darkTextColor);
  doc.text(t.bankDetails, 20, footerY);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(80, 90, 80);
  footerY += 4.5;
  doc.text(`${t.iban} DE89 2806 9954 0001 2345 67  •  ${t.bic} GENODEF1VEC  •  ${t.bank}`, 20, footerY);
  footerY += 4.5;
  doc.text(`USt-IdNr.: DE284920184  •  Steuernummer: 38/204/11452 (Finanzamt Sulingen)`, 20, footerY);
  footerY += 4.5;
  doc.text(t.legalNotice, 20, footerY);

  return doc;
}

export function generateReportPdf(
  title: string,
  period: string,
  headers: string[],
  rows: string[][],
  summaryText: string,
  lang: Locale = 'de'
): jsPDF {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const primaryColor: [number, number, number] = [34, 108, 61];

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(...primaryColor);
  doc.text('LAMPE AGRAR - FINANZMANAGER', 20, 20);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(40, 40, 40);
  doc.text(title, 20, 28);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(100, 100, 100);
  doc.text(`Zeitraum / Period: ${period} • Generiert am: ${new Date().toLocaleDateString()}`, 20, 34);

  doc.setDrawColor(...primaryColor);
  doc.setLineWidth(0.6);
  doc.line(20, 37, 190, 37);

  autoTable(doc, {
    startY: 44,
    margin: { left: 20, right: 20 },
    head: [headers],
    body: rows,
    theme: 'grid',
    headStyles: {
      fillColor: primaryColor,
      textColor: [255, 255, 255],
      fontSize: 8.5,
      fontStyle: 'bold',
    },
    styles: {
      fontSize: 8,
      cellPadding: 2,
    },
    alternateRowStyles: {
      fillColor: [248, 250, 247],
    },
  });

  const finalY = (doc as any).lastAutoTable?.finalY || 100;
  if (summaryText) {
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(8.5);
    doc.setTextColor(60, 60, 60);
    doc.text(summaryText, 20, finalY + 10);
  }

  return doc;
}

export interface FinancialReportData {
  year: number;
  totalRevenues: number;
  materialCosts: number;
  grossMargin: number;
  personnelCosts: number;
  otherExpenses: number;
  ebitda: number;
  interestCosts: number;
  netResult: number;
}

export function generateFinancialReportPdf(
  data: FinancialReportData,
  lang: Locale = 'de'
): jsPDF {
  const titles: Record<Locale, string> = {
    de: `Betriebswirtschaftliche Auswertung (BWA) ${data.year}`,
    en: `Management Income Statement (BWA) ${data.year}`,
    fr: `Compte de résultat analytique d'exploitation ${data.year}`,
  };

  const headers: Record<Locale, [string, string]> = {
    de: ['Position', 'Betrag (€)'],
    en: ['Item', 'Amount (€)'],
    fr: ['Poste', 'Montant (€)'],
  };

  const rowsMap: Record<Locale, string[][]> = {
    de: [
      ['1. Umsatzerlöse & Gesamtleistung', `${data.totalRevenues.toLocaleString('de-DE', { minimumFractionDigits: 2 })} €`],
      ['2. Materialaufwand & Wareneinsatz', `- ${data.materialCosts.toLocaleString('de-DE', { minimumFractionDigits: 2 })} €`],
      ['= Rohertrag (Deckungsbeitrag I)', `${data.grossMargin.toLocaleString('de-DE', { minimumFractionDigits: 2 })} €`],
      ['3. Personalaufwand (Mitarbeiter)', `- ${data.personnelCosts.toLocaleString('de-DE', { minimumFractionDigits: 2 })} €`],
      ['4. Sonstige betriebliche Aufwendungen', `- ${data.otherExpenses.toLocaleString('de-DE', { minimumFractionDigits: 2 })} €`],
      ['= Betriebsergebnis vor Zinsen (EBITDA)', `${data.ebitda.toLocaleString('de-DE', { minimumFractionDigits: 2 })} €`],
      ['5. Zinsaufwand Darlehen', `- ${data.interestCosts.toLocaleString('de-DE', { minimumFractionDigits: 2 })} €`],
      ['= Vorläufiges Betriebsergebnis', `${data.netResult.toLocaleString('de-DE', { minimumFractionDigits: 2 })} €`],
    ],
    en: [
      ['1. Gross Revenues & Total Output', `€${data.totalRevenues.toLocaleString('en-GB', { minimumFractionDigits: 2 })}`],
      ['2. Material & Direct Supplies Costs', `- €${data.materialCosts.toLocaleString('en-GB', { minimumFractionDigits: 2 })}`],
      ['= Gross Margin I', `€${data.grossMargin.toLocaleString('en-GB', { minimumFractionDigits: 2 })}`],
      ['3. Personnel Costs', `- €${data.personnelCosts.toLocaleString('en-GB', { minimumFractionDigits: 2 })}`],
      ['4. Other Operating Expenses', `- €${data.otherExpenses.toLocaleString('en-GB', { minimumFractionDigits: 2 })}`],
      ['= Operating Result (EBITDA)', `€${data.ebitda.toLocaleString('en-GB', { minimumFractionDigits: 2 })}`],
      ['5. Loan Interest Expenses', `- €${data.interestCosts.toLocaleString('en-GB', { minimumFractionDigits: 2 })}`],
      ['= Net Operating Pre-Tax Result', `€${data.netResult.toLocaleString('en-GB', { minimumFractionDigits: 2 })}`],
    ],
    fr: [
      ['1. Chiffre d\'affaires brut & Production', `${data.totalRevenues.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €`],
      ['2. Charges d\'approvisionnements (intrants)', `- ${data.materialCosts.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €`],
      ['= Marge brute globale', `${data.grossMargin.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €`],
      ['3. Charges de personnel', `- ${data.personnelCosts.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €`],
      ['4. Autres charges d\'exploitation', `- ${data.otherExpenses.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €`],
      ['= Résultat d\'exploitation (EBITDA)', `${data.ebitda.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €`],
      ['5. Charges financières (intérêts d\'emprunts)', `- ${data.interestCosts.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €`],
      ['= Résultat net d\'exploitation avant impôt', `${data.netResult.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} €`],
    ],
  };

  const notices: Record<Locale, string> = {
    de: 'Lampe Agrar GbR • Gesa & Dr. Josef Langenberg • Hünenheide 3, 49406 Bockstedt. Vorbehaltlich steuerlicher Prüfung durch Steuerberater.',
    en: 'Lampe Agrar GbR • Gesa & Dr. Josef Langenberg • Hünenheide 3, 49406 Bockstedt, Germany. Subject to final review by certified tax advisor.',
    fr: 'Lampe Agrar GbR • Gesa & Dr. Josef Langenberg • Hünenheide 3, 49406 Bockstedt, Allemagne. Document soumis à validation de l\'expert-comptable.',
  };

  return generateReportPdf(
    titles[lang] || titles.de,
    String(data.year),
    headers[lang] || headers.de,
    rowsMap[lang] || rowsMap.de,
    notices[lang] || notices.de,
    lang
  );
}

