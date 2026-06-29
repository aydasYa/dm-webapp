# Offene Fragen & Entscheidungen

## 🟢 ENTSCHIEDEN (25.06.2026) — Leads: nur Diagramme, kein Management in der WebApp
Leads & Provisionen leben in **Salesforce** (deinmotorschaden.de). Die WebApp soll **kein Lead-Management** haben.
Auf dem **Admin-Dashboard („Übersicht")** sollen nur **zwei Read-only-Diagramme** erscheinen:
1. **Lead Entwicklung** — Liniendiagramm: Anzahl Leads pro Tag (Datum).
2. **Lead Status Verteilung** — Donut: Abgeschlossen · In Bearbeitung · Offen · Storniert.
Quelle: **Salesforce-JSON-Simulation** (wie `data/demo-commissions.json` bei Provisionen).
Folgen:
- Bestehende Lead-Management-Seiten (`app/dashboard/leads/` — Liste/neu/Detail/bearbeiten) + zugehörige Logik (`app/actions/leads.ts`, `LeadForm`, `CancelLeadDialog`) → **entfernen** (im UI-Update-Epic).
- Gehört thematisch zu **Salesforce-Integration / neues UI-Epic**, nicht ins Code-Health-Epic 2.
- TODO: Nach Epic 2 ein **neues Epic „UI-Update"** anlegen (Vorlage = vom Nutzer geschicktes Dashboard-Bild). Diagramme + Lead-Seiten-Löschung dort.
- Für Epic-2-`requireUser`-Rollout: Lead-Management-Seiten **überspringen** (werden eh gelöscht).


## 📌 WEBAPP-181 — Kurz-Link QR (wartet auf Mentor-Freigabe) — nächster Schritt

Ziel: Route `/r/[code]` leitet auf die Angebotsseite mit UTM-Parametern weiter (statt QR mit langer UTM-URL). Vorteile: kürzerer/sauberer Link, Ziel später änderbar ohne neuen QR, Scans optional zählbar. Dazu QR-Karte in der Sidebar (Mini-QR + Link).

Offene Entscheidung — Code im Link:
- **Echter Kurz-Code (empfohlen):** neues kurzes Feld am `User` (z.B. 6 Zeichen), Link wie `/r/ab3k9z`. Kurz/professionell, druck-/teilbar, interne ID verborgen. **Braucht Prisma-Migration** + Code-Generierung.
- **User-ID als Code (ohne Migration):** Route `/r/[userId]`, sofort fertig, kein DB-Change. Nachteil: langer/kryptischer Link, interne ID öffentlich.

Umsetzungs-Skizze (nach Freigabe von Variante 1):
1. Schema: `User.shortCode String? @unique` → `pnpm prisma migrate dev --name add_user_short_code` → Dev-Server neu starten.
2. `createQrCode` (`app/actions/auth.ts`): Code generieren (falls leer), `qrCode` = `${APP_URL}/r/${shortCode}` speichern.
3. Route `app/r/[code]/route.ts` (GET): User per `shortCode` finden → 302-Redirect auf `https://angebot.deinmotorschaden.de?utm_medium=${userId}&utm_source=${companyId}` (optional QRScan loggen).
4. QR-Karte in der Sidebar: `qrCode` an `AppSidebar` durchreichen (über `dashboard/layout.tsx` → `DashboardShell`), Mini-`QRCodeSVG` + Link anzeigen (Fahrer + Admin).

## Eigene Provision des Admins (wenn er auch als Fahrer agiert)

Kontext: Der Admin kann selbst als „Fahrer" arbeiten (eigener QR → eigene Leads/Provisionen). Aktuell zeigt das Admin-Dashboard Provisionen aggregiert über ALLE Fahrer; die eigenen Admin-Provisionen sind zwar mit drin, aber nicht separat sichtbar.
Frage: Wie soll der Admin **seine eigene** Provisionsübersicht sehen?
- Option A: eigener „Meine Provisionen"-Bereich für den Admin (gefiltert auf `towTruckDriverId = adminId`).
- Option B: Toggle/Filter im Admin-Dashboard „Alle (Firma)" vs. „Nur meine".
- Option C: in der Aggregat-Ansicht den Admin-Eintrag optisch hervorheben.

## Abgelehnter Admin (`REJECTED`) ist final
Kein „doch freigeben"-Weg für den Super-Admin. Evtl. ergänzen (REJECTED → ACTIVE).

## Echtes Löschen vs. Soft-Delete
Supabase-Account + Fahrer der Firma wirklich löschen statt nur DB-Soft-Delete — gilt für Fahrer und Firmen-Admins.
