# 🧭 Projekt-Übergabe / Kontext (für neuen Chat)

> Vollständiger Kontext der bisherigen Sessions. Im neuen Chat **zuerst diese Datei + `NOTES.md` (+ `notes/`) lesen**.
> **Stand 24.06.2026:** Rollen/Super-Admin ✅, Mandanten-Fix ✅, UI/UX-Redesign ✅, Provisionen laufen über **JSON-Simulation** (Salesforce, statt DB). **Nächstes:** Jira-**Epics 1–3** (Sicherheit · Code-Health · UX) abarbeiten — Details in `notes/`.

---

## 1. Projekt
**DeinMotorschaden WebApp** — Plattform für ein Abschlepper-Netzwerk. Multi-Tenant: jedes **Abschleppunternehmen** hat einen **Admin**, der **Fahrer** einlädt. Fahrer haben persönliche **QR-Codes** (UTM-Parameter → Lead-Tracking auf der Angebotsseite) und verdienen **Provisionen** (Staffel-Logik).

**Tech-Stack:** Next.js 16 (App Router — **modifiziert!** Docs in `node_modules/next/dist/docs/` lesen bevor man Next-Code schreibt), Prisma 7 + PostgreSQL (Supabase), Supabase Auth, Resend/Mailtrap (E-Mail), shadcn/Radix UI + Tailwind. **Package-Manager: `pnpm`.**

## 2. Rollen & Datenmodell
- **Hierarchie:** `SUPER_ADMIN` (DeinMotorschaden — **gebaut ✅**) → `ADMIN` (Firma) → `TOW_TRUCK_DRIVER` (Fahrer).
- `Company`-Model existiert (`id`, `name`) + `User.companyId`. **Aber:** alte `companyXyz`-Felder liegen weiterhin flach auf `User` (Doppelung).
- Fahrer **erben** die Firma des Admins beim Einladen.
- `UserStatus`: `PENDING` (eingeladen/wartend), `ACTIVE`, `INACTIVE` (deaktiviert/gesperrt), `REJECTED`. In der **Fahrer-Verwaltung** heißt `INACTIVE` jetzt „Deaktiviert" (kein „Abgelehnt" mehr); `REJECTED` nur noch im Super-Admin-Flow (Firma ablehnen).
- Admin kann auch selbst als „Fahrer" agieren (eigener QR) → siehe offene Design-Frage in NOTES.md.

## 3. Was diese Session gebaut wurde (alles auf `main`)
- **Registrierungsformular:** Ansprechpartner-Felder aus „Firma" raus, `companyWebsite` rein.
- **Setup-Fixes:** pnpm, Prisma-Version gekoppelt, `prisma.config.ts` lädt `.env.local`.
- **WEBAPP-132 Dashboard-Aufteilung:** Admin/Driver-Split (thin chooser `page.tsx`), `CommissionOverview` extrahiert (DRY), Fahrer landet auf Provisionsübersicht, 3 Tabs, Sidebar „Fahrer".
- **WEBAPP-138 QR + Company:** `Company`-Model + Migration + Backfill. QR-Schema: `?utm_medium={userId}&utm_source={companyId}` (fahrerId / firmenId).
- **WEBAPP-135 Magic-Link:** Admin lädt Fahrer ein (`inviteUserByEmail`), `/auth/set-password`-Seite, Fahrer erbt Firma. Status `PENDING` → `ACTIVE` beim Passwort-Setzen. Läuft **via Mailtrap (Dev)**. Echter Domain-Versand = **Blocker**.
- **WEBAPP-164 (Epic 3) Fahrer-Verwaltung & Dashboard-UI:** Listenansicht statt Tabs, klickbare Karte → Detail-Popup, QR im Popup, Status-Badge, **Sperren/Löschen (Soft-Delete)/Reaktivieren**, Leads raus (Admin+Fahrer), Admin-Übersicht zeigt Provision, Admin eigener QR.
- **Zugriffsschutz:** `INACTIVE`/`deletedAt` → ausgeloggt → `/blocked` (gelöscht vs. deaktiviert = unterschiedliche Meldung via `?reason=`). Fahrer-Selbst-Pause (`pauseSelf`).

## 3b. Session „Rollen-Block & Mandanten-Fix" (neu)
- **WEBAPP-155 komplett** (Rollen-Hierarchie & Super-Admin), alle 6 Subtasks:
  - **156** `SUPER_ADMIN` ins Role-Enum (Migration `add_super_admin_role`).
  - **159** `signup` legt Firmen-Admin als `ADMIN` + `PENDING` an (vorher fälschlich `TOW_TRUCK_DRIVER`).
  - **158** Bootstrap-Script `scripts/create-super-admin.ts` (+ `scripts/load-env.ts`): legt 1. Super-Admin in Supabase **und** DB an, idempotent. Run: `pnpm tsx scripts/create-super-admin.ts`. Braucht `SUPER_ADMIN_EMAIL/PASSWORD/FIRSTNAME/LASTNAME` in `.env.local`.
  - **157** Super-Admin-Dashboard: `SuperAdminDashboard` (Landing), Sidebar-Tab „Unternehmen" (`/dashboard/companies`), `CompanyCard` mit Detail-Popup + Aktionen Freigeben/Ablehnen/Deaktivieren/Aktivieren/Löschen. Actions: `updateCompanyAdminStatus`, `deleteCompanyAdmin` (beide `SUPER_ADMIN`-gated, Ziel muss `ADMIN` sein).
  - **162** Fahrer-Verwaltung: `INACTIVE` → „Deaktiviert", Buttons „Deaktivieren/Aktivieren".
  - **163** QR-Auto-Generierung: `setPassword` ruft jetzt `createQrCode(user.id)` → QR entsteht automatisch beim Aktivieren.
- **🔴 Mandanten-Bug gefixt:** Admin-Ansichten (`users`, `qrcodes`, `commissions`, `leads`, `AdminDashboard`) jetzt nach `companyId` gefiltert (vorher firmenübergreifend sichtbar). Provisionen/Leads über Relation `towTruckDriver: { companyId }`.
- **E-Mail-Epic (WEBAPP-48) PAUSIERT** bis nach Meeting: `nodemailer` + `@types/nodemailer` installiert, aber `lib/email.ts` noch nicht gebaut. Entscheidung: **Mailtrap statt Resend** (User hat Mailtrap für Magic-Link in Supabase eingerichtet). package.json/lock-Änderung noch **uncommitted**.

## 3c. Session „UI-Redesign & Salesforce-JSON" (24.06.2026)
- **UI-Redesign (Epic WEBAPP-174) komplett:** `StatCard` (Label/Wert/Trend-Badge, shadcn), Dashboards (Fahrer/Admin/Super-Admin) umgebaut, `DonutChart` + `CompaniesChart`, Zeitraum-Picker (`lib/dateRange.ts` + `components/DateRangeFilter.tsx`, Presets 7d/30d/3m + Von/Bis), Theme **nur Light** (Auto-Dark-Block raus), Sidebar-User-Block mit Avatar.
- **WEBAPP-181 (leichte Variante):** QR-Code in der Sidebar (vorhandener `qrCode`, keine Migration/Route). Verdrahtet via `layout.tsx → DashboardShell → AppSidebar`.
- **Provisionen aus JSON statt DB (Salesforce-Simulation):** `lib/getCommissions.ts` (`getCommissions({ companyId, driverId? })` liest `data/aydas-commissions.json` + filtert; async, damit später `fetch()` zu Salesforce rein kann). Verdrahtet in `CommissionOverview` (Fahrer), `AdminDashboard` (Firma) und `commissions/page.tsx`. `createdAt` aus Text → `new Date(...)`. JSON-IDs = echte DB-IDs (sonst kein Treffer). Admin als Fahrer wählbar im Filter („<Name> (Inhaber)"). `scripts/list-ids.ts` gibt IDs aus.
- **Restliche DB bleibt:** Nur Provisionen kommen aus JSON; User/Firmen/Fahrer/Leads weiter aus Prisma.
- **Notizen** nach `notes/` aufgeteilt (Index in `NOTES.md`): setup, conventions, tech-debt, open-questions, bugs, salesforce-lernplan, changelog-2026-06-24.

## 4. Git-Stand
- Aktiver Branch zuletzt **`salesforce-demo`** (davor `ui-ux-update`). Arbeit in vielen Commits, vom User selbst committet.
- Remote: `github.com/aydasYa/dm-webapp`. **Solo-Dev → direkter Merge, kein PR.**
- `tsc --noEmit` läuft sauber durch.

## 5. Config / Gotchas
- `.env.local`: `DATABASE_URL`, `DIRECT_URL`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SECRET_KEY`, `NEXT_PUBLIC_APP_URL`, `RESEND_API_KEY`.
- **Nach `prisma generate`/`migrate dev` → `pnpm dev` neu starten** (sonst stale Client).
- **Supabase SMTP = aktuell Mailtrap-Sandbox** (Dev, fängt alle Mails ab). Echte Domain in Resend verifizieren = offen (Blocker, DNS-Inhaber).
- **Super-Admin anlegen:** via `scripts/create-super-admin.ts` (nicht mehr nur DB-Handarbeit). `SUPER_ADMIN_*` in `.env.local` nötig.
- **`createQrCode`** braucht die interne `user.id`, nicht `supabaseId`. `updateUserStatus` (Admin) und `setPassword` (Fahrer-Aktivierung) rufen es auf.

## 6. Offene Arbeit (Roadmap)
- **Phase 2 — WEBAPP-48 E-Mail-System (PAUSIERT bis nach Meeting):** 147 `sendEmail` (`lib/email.ts`, via **Mailtrap/nodemailer**), 75 Auszahlungs-Mail, 76 Werkstatt-Mail, 40 Bestätigungs-Mail. nodemailer schon installiert.
- **Rollen & Super-Admin (WEBAPP-155): ERLEDIGT ✅** · **UI/UX-Redesign (WEBAPP-174): ERLEDIGT ✅**
- **Jira-Epics 1–3 (neu, abzuarbeiten):** 1) Sicherheit & Mandanten-Härtung (🔴 IDOR, companyId-Null), 2) Code-Health & Refactoring, 3) UX-Verbesserungen. Details + Tasks in `notes/tech-debt.md`.
- **Salesforce Phase 2 (echte API):** JSON-Sim durch echten `fetch()`+SOQL ersetzen — Plan in `notes/salesforce-lernplan.md`. (Noch keine Jira-Tickets.)
- **Offene Produkt-Entscheidungen:** `notes/open-questions.md` (Admin-eigene-Provision, REJECTED reaktivieren, echtes Löschen). (Noch keine Jira-Tickets.)
- **E-Mail-System (WEBAPP-48):** pausiert; `nodemailer` installiert, `lib/email.ts` offen.

## 7. Jira
- Cloud `dmsbielefeld.atlassian.net`, Projekt-Key **`WEBAPP`** (Cloud-ID `5419d2dd-ed41-40d6-8e3c-3ac24fc99ea3`).
- Epic 3 = **WEBAPP-164** (Tasks 165–172) — von mir angelegt, alle Yasin zugewiesen. **Noch nicht auf „Done" gesetzt.**
- Epics 1 (Produktiver E-Mail-Versand, ~WEBAPP-150) & 2 (Rollen & Super-Admin) vom User manuell angelegt.
- Hinweis: verbundener Atlassian-Account = **Rahmi Kaya**, nicht Yasin.

## 8. Arbeitsweise mit dem User (wichtig!)
- **Mentor/Senior-Dev-Modus:** anleiten + passende Docs nennen + lehren. **Der User tippt selbst** — NUR direkt umsetzen, wenn er „mach das für mich" sagt.
- **ADHD:** kleine Häppchen, ein Schritt nach dem anderen, **kompakt**.
- **Jeder Schritt mit Kopf:** `📍 Phase X · Epic <KEY> · Ticket <KEY> — Titel` + Fortschrittszeile.
- **Jira = Quelle der Wahrheit** — vor Start jeden Task bestätigen.
- **Mini-Hinweise / Tech-Debt immer in `NOTES.md`** eintragen (nicht nur im Chat sagen).
- **Starkes ADHS:** zuerst einen **klaren Überblick** geben, dann kleine Schritte. **Kompakt & übersichtlich.**
- **Der User will LERNEN, nicht stumpf copy-pasten.** Auch wenn du Code gibst: **das Warum erklären** und ihn die Kernteile **selbst tippen** lassen, damit er es versteht. Keine ganzen Dateien zum blinden Einfügen ohne Erklärung.

## 9. Nächste Themen — **Jira-Epics 1–3 abarbeiten**
1. **🔴 Epic 1 — Sicherheit & Mandanten-Härtung:** Server-Actions gegen IDOR härten (`updateUserStatus`, `deleteDriver`, `generateQrCode`, `approveCommission`, `markCommissionAsPaid` → companyId-Check) · `companyId`-Null-Fall absichern. **Empfohlener Start.**
2. **🟠 Epic 2 — Code-Health:** Auth-Helper (`lib/auth.ts`), Queries parallelisieren, Role-Enum, Provisions-/Company-Daten entdoppeln, etc.
3. **🟡 Epic 3 — UX:** Lösch-Bestätigung, Button-Ladezustand, Paginierung, AuditLog, Fahrer-Filter im Provision-Tab.

Epics 1–3 sind in Jira angelegt (Nummern beim User; Atlassian-Verbindung war in der Session offline). Alle Task-Details in `notes/tech-debt.md`.
