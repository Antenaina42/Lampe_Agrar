# Lampe_Agrar

# Lampe Agrar Finanzmanager
## Professionelle Webanwendung für das Finanz- und Betriebsmanagement eines landwirtschaftlichen Großbetriebs

### 🚀 Importation rapide dans Hostinger (Base de données MySQL)
1. Dans votre panneau **Hostinger (hPanel)**, rendez-vous dans **Bases de données MySQL** et créez une base de données (ex: `u123456789_lampe`).
2. Ouvrez **phpMyAdmin** sur la base de données créée.
3. Cliquez sur l'onglet **Importer** (Import).
4. Sélectionnez le fichier **`database.sql`** situé à la racine du projet.
5. Cliquez sur **Exécuter** (Go). Toutes les tables, données de démonstration et structures relationnelles seront instantanément importées.
6. Configurez votre fichier `.env` sur le serveur de production Hostinger avec la variable `DATABASE_URL="mysql://USER:PASSWORD@localhost:3306/DATABASE_NAME"`.

---

**Lampe Agrar Finanzmanager** ist ein vollwertiges, mandantenfähiges Agrar-ERP- und Finanzverwaltungssystem für das landwirtschaftliche Familienunternehmen **Lampe Agrar GbR** (Inhaber: Gesa & Dr. Josef Langenberg, Hünenheide 3, 49406 Bockstedt / Drentwede, Niedersachsen).

Basierend auf den realen Betriebszweigen des Betriebs:
- **Ackerbau (~440 ha Nutzfläche)**: 130 ha Industriekartoffeln, 160 ha Getreide (Winterweizen, Wintergerste), 70 ha Silomais / Ackerfutter, 50 ha Winterraps, 30 ha Zuckerrüben.
- **Kartoffellagerung & Vermarktung**: Zwei moderne Hallenlager (lose Lagerung) mit Sturzbunker, Schüttgutbändern, Hallenfüllern und Chargenüberwachung (kein Negativbestand möglich).
- **Schweinemast**: Außenklimastall nach Tierwohl-Haltungsform 4 (1.400 Mastplätze) mit automatisierter Stroheinstreu, Trockenfütterung und innovativer Kot-Harn-Trennung zur Emissionsminderung; sowie Haltungsform 2 (2.000 Mastplätze).
- **Maschinen & Fuhrpark**: 4 Fendt Schlepper (240–280 PS) mit RTK-GPS Spurführung, Grimme SE 260 Kartoffelvollernter, 10.000 l Dammann Pflanzenschutzspritze (39 m Gestänge), Kotte Garant 18 m³ Güllefass mit Schleppschläuchen.
- **Finanzwesen & DATEV**: Strikte Trennung von Liquidität (Geldfluss), GuV/BWA (Periodenergebnis) und Vorräten (Umlaufvermögen), DATEV-konformer Buchungsstapel-Export (SKR 14 / SKR 03), Umsatzsteuer-Voranmeldung und mehrsprachige PDF-Fakturierung.

---

## 1. Technischer Stack

- **Framework**: Next.js 14 (App Router, Server Components & Route Handlers).
- **Sprache**: TypeScript im strikten Modus (`strict: true`).
- **Styling & UI**: Tailwind CSS, Lucide React Icons, Framer Motion (Animationen).
- **Theme**: Helles, elegantes Agrardesign (Hauptfarbe Wald- und Agrargrün `#226c3d`, Salbeigrün `#e8efe6`, Warm-Off-White `#f8faf7`, Anthrazit `#212921`).
- **Datenbank & ORM**: MySQL 9.1 über Prisma ORM mit 30+ relationalen Tabellen und Audit-Trail (`AuditLog`).
- **Validierung & Sicherheit**: Zod, React Hook Form, Bcrypt-Passworthashing, HTTP-only Cookie Authentifizierung mit RBAC (Rollenbasierte Rechte).
- **Export & Dokumente**: jsPDF + jspdf-autotable (Rechnungen & BWA-Berichte), xlsx (Excel-Arbeitsmappen), DATEV CSV Buchungsstapel.

---

## 2. Mehrsprachiges System (DE, EN, FR)

Die Anwendung ist zu 100 % in drei Sprachen verfügbar:
1. **Deutsch (de)** – Standardsprache des Betriebs
2. **English (en)** – Vollständige englische Benutzeroberfläche
3. **Français (fr)** – Vollständige französische Benutzeroberfläche

### Sprachauswahl & Speicherung
- Sprachwähler in der oberen Navigationsleiste (`TopBar`) sowie in den Benutzereinstellungen (`/einstellungen`).
- Gespeichert in der Datenbank (`UserPreference`) und im Client-Speicher.
- **Regionale Konventionen**:
  - Deutsch: `1.234,56 €` | Datum: `12.10.2026`
  - English: `€1,234.56` | Datum: `12/10/2026`
  - Français: `1 234,56 €` | Datum: `12/10/2026`
- **Mehrsprachige PDF-Dokumente**: Rechnungen und BWA-Berichte können unabhängig von der Interface-Sprache wahlweise auf Deutsch, Englisch oder Französisch generiert werden.

---

## 3. Übersicht der 21 Anwendungsseiten

| Route | Modul & Funktion |
| :--- | :--- |
| `/login` | Sichere Benutzeranmeldung mit Rollenauswahl & Demo-Zugangsdaten |
| `/dashboard` | Konsolidiertes Cockpit: Liquidität, 12-Monats-Cashflow, Deckungsbeiträge, Wetter & Ernte |
| `/finanzen` | Multi-Bankkonten (Volksbank, Sparkasse, Hofkasse), Bankabstimmung & 30/60/90 Tage Cash-Forecast |
| `/einnahmen` | Erfassung aller landwirtschaftlichen Erlöse (Kartoffeln, Schweine, Raps, Zuckerrüben, Getreide) |
| `/ausgaben` | Betriebsausgaben: Dünger, Futter, Diesel, PSM, Reparaturen, Pacht, Versicherung |
| `/buchungen` | Vollständiges Journal aller Buchungen mit Filter nach Betriebszweig und Belegsuche |
| `/rechnungen` | Faktura: Ausgangs- und Eingangsrechnungen, mehrsprachiger PDF-Export & Teilzahlungen |
| `/kunden` | Abnehmerverwaltung: Kartoffelverarbeiter, Viehvermarktung, Zuckerfabrik, Landhandel |
| `/lieferanten` | Lieferanten & Verbindlichkeiten: AGRAVIS, Raiffeisen, Grimme, Fendt, Landhandel, IBAN |
| `/schweinemast` | Außenklimastall H4 (1.400 Plätze) & H2 (2.000 Plätze), Durchgänge, Futterverwertung & DB/Tier |
| `/ackerbau` | Schlagkartei (~440 ha): Bodenpunkte, Kulturen, Düngung, Erträge t/ha und DB/ha |
| `/kartoffellager` | Hallen 1 & 2 (loses Lager): Partienverwaltung, Hallenfüller, Auslagerungsschutz gegen Negativbestand |
| `/maschinen` | Fuhrpark: 4 Fendt GPS-Schlepper, Grimme SE 260, Dammann Spritze, Betriebsstunden & Kosten/h |
| `/personal` | Mitarbeiterverwaltung: Betriebsleitung, Ackerbauleiter, Vollzeit/Saison, AG-Gesamtaufwand |
| `/lager` | Betriebsmittellager: Saatgut, Dünger, PSM, Futter, 10.000 l Hoftank & Mindestbestands-Warnung |
| `/budgets` | Wirtschaftsjahresplanung: Soll-Ist-Vergleich, Szenarien (Optimistisch, Zentral, Vorsichtig) |
| `/investitionen` | Sachanlagen (H4-Stall, Hallen, Schlepper), AfA, Darlehen & Zins-/Tilgungsdienst |
| `/berichte` | BWA-Management-GuV, USt-Voranmeldung, DATEV-Export (.csv) und Excel-Download (.xlsx) |
| `/dokumente` | Zentrales Archiv: Pachtverträge, Belege, Bodenproben, Düngebedarfsanalysen, TÜV |
| `/benutzer` | Rollenbasierte Benutzerverwaltung (Betriebsleitung, Mitarbeiter, Steuerberater) |
| `/einstellungen` | Betriebsstammdaten Lampe Agrar GbR, Sprache, Animationen & Demodaten-Steuerung |

---

## 4. Test-Zugangsdaten (Demobenutzer)

Die Datenbank ist mit vier realistischen Benutzerkonten vorkonfiguriert:

| Benutzer | E-Mail | Passwort | Rolle & Bereich |
| :--- | :--- | :--- | :--- |
| **Gesa Langenberg** | `gesa.langenberg@lampe-agrar.de` | `password123` | Betriebsleitung (Vollzugriff Finanzen & Betrieb) |
| **Dr. Josef Langenberg** | `josef.langenberg@lampe-agrar.de` | `password123` | Betriebsleitung (Vollzugriff Finanzen & Betrieb) |
| **Kenneth Makowka** | `kenneth.makowka@lampe-agrar.de` | `password123` | Ackerbauleiter (Schläge, Lager, Maschinen) |
| **Steuerberater Diepholz**| `berater@steuerbuero-diepholz.de` | `password123` | Steuerberater (Belege, BWA, DATEV-Export) |

---

## 5. Installation & Inbetriebnahme

### 1. Voraussetzungen
- Node.js (Version 18.x, 20.x oder 22+)
- MySQL Server (z.B. WampServer MySQL 9.1 oder lokal auf Port 3306)

### 2. Umgebungskonfiguration (`.env`)
Erstelle oder prüfe die Datei `.env`:
```env
DATABASE_URL="mysql://root:root@localhost:3306/lampe_agrar_db"
JWT_SECRET="lampe-agrar-super-secure-jwt-secret-key-2026-bockstedt"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

### 3. Abhängigkeiten installieren
```bash
npm install --legacy-peer-deps
```

### 4. Datenbank synchronisieren & initialisieren
```bash
# Prisma Client generieren
npm run prisma:generate

# Tabellenstruktur in MySQL anlegen
npm run prisma:push

# Realistische Betriebsdaten (Lampe Agrar) einspielen
npm run prisma:seed
```

### 5. Automatisierte Tests ausführen
```bash
npm test
```
*Führt 24 automatisierte Prüfungen durch: Mehrsprachigkeit (DE/EN/FR), Währungsformate, Bestandsintegrität, Fuhrpark- und Flächensummen.*

### 6. Produktions-Build & Start
```bash
# Produktions-Build erstellen
npm run build

# Produktionsserver starten
npm start
```
Die Anwendung ist nun unter `http://localhost:3000` erreichbar.

---

## 6. Datensicherung & Wiederherstellung (Backup & Restore)

### Datensicherung erstellen
```powershell
# MySQL Dump der Datenbank erstellen
& "C:\wamp64\bin\mysql\mysql9.1.0\bin\mysqldump.exe" -u root -proot lampe_agrar_db > backup_lampe_agrar.sql
```

### Datensicherung wiederherstellen
```powershell
# Datenbank aus Sicherung einspielen
& "C:\wamp64\bin\mysql\mysql9.1.0\bin\mysql.exe" -u root -proot lampe_agrar_db < backup_lampe_agrar.sql
```

### Zurücksetzen der Demonstrationsdaten
Innerhalb der Anwendung unter `/einstellungen` oder in der oberen Leiste über den Button **Demonstrationsdaten zurücksetzen**. Dies führt `node scripts/seed.mjs` aus und setzt alle Buchungen, Partien und Bestände auf den sauberen Ausgangszustand zurück.

---

## 7. Rechtliche & steuerliche Hinweise

- **Umsatzsteuer & DATEV**: Die bereitgestellten Buchungsschlüssel, Steuersätze und DATEV-Exporte stellen interne Vorbereitungen dar und müssen vor der Einreichung beim Finanzamt durch den Steuerberater geprüft und freigegeben werden.
- **Lohnkosten**: Die Personalverwaltung dient der betriebsinternen Kostenstellen- und Zweigallokation und ersetzt kein zertifiziertes Entgeltabrechnungsprogramm.
