# Epic 4 — UI-Verbesserungen

**Stand:** 26.06.2026 · **Status:** angelegt, noch nicht begonnen

Dashboard-Darstellung nach dem neuen Mockup. Leads werden in der WebApp **nur noch als Diagramme** angezeigt (Quelle: **Salesforce**), kein Lead-Management mehr.

## Abgrenzung zu Epic 3 (UX)

Damit sich beide Epics nicht überschneiden:

- **Epic 3 (UX) — Bedienung/Verhalten:** Lösch-Bestätigungsdialog, Button-Lade-/Disabled-Zustand (`useFormStatus`), Paginierung, Fahrer-Filter im Provisions-Tab, AuditLog nutzen.
- **Epic 4 (UI) — Optik/Darstellung + Datenquelle:** dieses Dokument.

## Hintergrund

Siehe Entscheidung in `notes/open-questions.md` (25.06.2026): Leads & Provisionen leben in Salesforce; die WebApp zeigt nur Auswertungen. Quelle wird per JSON simuliert (wie `data/aydas-commissions.json` + `lib/getCommissions.ts` bei den Provisionen).

## Tickets (Reihenfolge 1 → 5)

### 1 — Salesforce-JSON-Quelle für Leads
Datenfundament für die Lead-Diagramme. Datei `data/<firma>-leads.json` (Felder: `id, companyId, driverId, status, createdAt`) + Loader `lib/getLeads.ts` analog zu `getCommissions` (Filter nach `companyId`, optional `driverId`). Status-Werte: Abgeschlossen, In Bearbeitung, Offen, Storniert.

### 2 — Lead-Entwicklung (Liniendiagramm)
Auf der Admin-Übersicht: Liniendiagramm „Anzahl Leads pro Tag" für den aktuellen Monat. Quelle: `getLeads`. Darstellung wie im Mockup (X = Datum, Y = Menge).

### 3 — Lead-Status-Verteilung (Donut)
Auf der Admin-Übersicht: Donut mit Abgeschlossen · In Bearbeitung · Offen · Storniert (Anzahl + Prozent, Gesamt in der Mitte). Quelle: `getLeads`.

### 4 — KPI-Karten der Übersicht angleichen
Obere Karten nach Mockup: Leads gesamt, Abschlüsse, Conversion Rate, Provision verdient — inkl. Trend „vs. Vormonat". Provision-Karte existiert schon, Leads-KPIs neu aus `getLeads`.

### 5 — Alte Lead-Management-Seiten entfernen
Entfernen: `app/dashboard/leads/*` (Liste/neu/Detail/bearbeiten), `app/actions/leads.ts`, `components/LeadForm.tsx`, `components/CancelLeadDialog.tsx`. Vorher prüfen, dass nichts Aktives mehr darauf verweist. `tsc` grün halten.

## Referenz

Mockup-Vorlage: vom Nutzer geschicktes Dashboard-Bild (Lead Entwicklung als Liniendiagramm + Lead Status Verteilung als Donut, KPI-Karten oben). Theme: hell (kein Dark Mode).
