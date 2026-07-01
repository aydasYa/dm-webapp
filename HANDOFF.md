# 🧭 Projekt-Übergabe / Kontext (für neuen Chat)

> **Im neuen Chat zuerst diese Datei + `NOTES.md` (+ Ordner `notes/`) lesen.**
> **Stand: 01.07.2026.** Epics 1–4 ✅ · Epic 3 (UX) ✅ · **Nächstes = Epic 5 „UI-Feinschliff (Mockup)".**

---

## 1. Projekt
**DeinMotorschaden WebApp** — Plattform für ein Abschlepper-Netzwerk. Multi-Tenant: jedes **Abschleppunternehmen** hat einen **Admin**, der **Fahrer** einlädt. Fahrer haben persönliche **QR-Codes** (UTM → Lead-Tracking auf der Angebotsseite) und verdienen **Provisionen**. Leads & Provisionen kommen aus **Salesforce** (aktuell per JSON simuliert), die WebApp **zeigt nur Auswertungen** — kein Lead-Management mehr.

**Tech-Stack:** Next.js 16 (App Router), Prisma 7 + PostgreSQL (Supabase), Supabase Auth, shadcn/Radix UI + Tailwind, recharts, qrcode.react. **Package-Manager: `pnpm`.** UI-Sprache Deutsch, Code Englisch. Theme: **Hell + Dunkel umschaltbar** (Entscheidung 01.07.2026, Epic 5 — kehrt das frühere „nur hell" um; Umsetzung via `next-themes`).

## 2. Rollen & Datenmodell
- **Hierarchie:** `SUPER_ADMIN` (DeinMotorschaden) → `ADMIN` (Firma) → `TOW_TRUCK_DRIVER` (Fahrer).
- **`Company`-Model** trägt jetzt ALLE Firmendaten (`name, address, postcode, city, phone, email, website, contactFirstname, contactLastname`). `User.companyId` verweist darauf. Fahrer erben die Firma über die Relation. **Die früher flachen `companyXyz`-Felder auf `User` sind ENTFERNT** (WEBAPP-199).
- `UserStatus`: `PENDING`, `ACTIVE`, `INACTIVE`, `REJECTED`. In der Fahrer-Verwaltung heißt `INACTIVE` „Deaktiviert"; `REJECTED` nur im Super-Admin-Flow (Firma ablehnen).
- Admin kann selbst als „Fahrer" agieren (eigener QR) → im Filter als „(Inhaber)".
- `AuditLog`-Model wird jetzt beschrieben (siehe unten), aber es gibt noch **keine Ansicht** dafür.

## 3. Was in den letzten Sessions gebaut wurde (alles auf `main`, außer neuer Feature-Branch)

### Epic 1 — Sicherheit & Mandant-Härtung ✅
- IDOR-Härtung aller Server-Actions via `assertSameCompany(callerCompanyId, userId)` in `lib/auth.ts`.
- `companyId`-Null-Fall abgesichert (kein „alle firmenlosen sehen").
- WEBAPP-215: Fahrer können Firmendaten nicht bearbeiten (Server + UI).

### Epic 2 — Code-Health ✅
- **`requireUser(role?)`** in `lib/auth.ts` — zentraler Login-/Rollen-Check (ersetzt ~20× Boilerplate). Lädt den User **inkl. `company`-Relation** (`include: { company: true }`). Ausnahmen bewusst: `app/page.tsx`, `account.ts setPassword`.
- Dashboard-Queries parallelisiert (`Promise.all`).
- Role-Enum statt String-Unions (`DashboardShell`, `AppSidebar`).
- Provisions-Summen entdoppelt → `summarizeCommissions()` in `lib/commission.ts`.
- ESLint `ignoreRestSiblings`; `CommissionOverview`-Funktionsname angeglichen.
- **WEBAPP-199 Company-Migration** (5 Phasen, siehe `notes/`): Firmendaten von `User` → `Company`. Migrationen `add_company_detail_fields` + `drop_user_company_fields`.

### Epic 4 — UI-Verbesserungen (Lead-Charts) ✅
- **`lib/getLeads.ts`** + `data/demo-leads.json` (Salesforce-Simulation, analog `getCommissions`). Filter nach companyId/driverId. Status: `COMPLETED/IN_PROGRESS/OPEN/CANCELLED`.
- **`components/LeadsChart.tsx`** (Flächen-Diagramm, recharts) — „Lead-Entwicklung" (Leads pro Tag).
- Lead-Status-Donut (`DonutChart` wiederverwendet).
- KPI-Karten oben: Leads gesamt, Abschlüsse, Conversion Rate, Provision verdient.
- Fahrer sehen dieselben 2 Lead-Charts, driver-scoped, in `CommissionOverview`.
- **Altes Lead-Management entfernt** (`app/dashboard/leads/*`, `app/actions/leads.ts`, `LeadForm`, `CancelLeadDialog`).

### Epic 3 — UX-Verbesserungen ✅
- **`ConfirmActionButton`** (flexibler Bestätigungs-Dialog, `fields`-Prop) — für Löschen **und** Deaktivieren bei Fahrer + Unternehmen. Aktivieren = Ein-Klick.
- **`SubmitButton`** (`useFormStatus`) — Spinner + disabled beim Absenden (kein Doppelklick).
- **Fahrer-Filter im Provisions-Tab** — `DateRangeFilter` um optionales Fahrer-Dropdown erweitert.
- **`Pagination`-Komponente** — Fahrer-Verwaltung (DB `skip`/`take`, 5/Seite) + Provisions-Listen (Array-`slice`, 10/Seite, in `commissions/page.tsx` **und** `CommissionOverview`). Behält Filter (`query`-Prop), `scroll={false}` gegen Hochscrollen.
- **AuditLog** — `lib/audit.ts` `logAudit({ action, actorId, details })`; aufgerufen in `updateUserStatus`, `deleteDriver`, `updateCompanyAdminStatus`, `deleteCompanyAdmin`. **Ansicht fehlt noch** (nur via `pnpm prisma studio` → Tabelle `audit_logs` testbar).

## 4. Wichtige Dateien / Architektur
- `lib/auth.ts` — `requireUser(role?)`, `assertSameCompany(...)`.
- `lib/getCommissions.ts` (liest `data/demo-commissions.json`) + `lib/getLeads.ts` (liest `data/demo-leads.json`) — austauschbare Datenquellen (später `fetch()` → Salesforce, Signatur bleibt).
- `lib/commission.ts` — `summarizeCommissions()` (+ ungenutztes `calculateCommissionAmount`, toter Code).
- `lib/dateRange.ts` + `components/DateRangeFilter.tsx` (Zeitraum + optional Fahrer-Dropdown).
- `lib/audit.ts` — AuditLog-Helper.
- `components/`: `Pagination`, `ConfirmActionButton`, `SubmitButton`, `StatCard`, `DonutChart`, `LeadsChart`, `CommissionsChart`, `CompaniesChart`, `DriverCard`, `CompanyCard`, `QrCodeCard`, `AppSidebar`, `DashboardShell`, `dashboard/AdminDashboard`, `dashboard/SuperAdminDashboard`, `CommissionOverview`.
- **Achtung Refactor-Schuld:** Server-Komponenten (`commissions/page.tsx`, `AdminDashboard`, `CommissionOverview`) haben viel Aufbereitungslogik VOR dem `return` → nach `lib/` auslagern (in `notes/tech-debt.md`).

## 5. Demo-Daten & Seed (WICHTIG)
- **Seed-Skript:** `pnpm tsx scripts/seed-demo.ts` — legt an: 1 Super-Admin, 3 Firmen (je 1 Admin + 4 Fahrer, aktiv, mit QR), 1 PENDING-Admin, 1 REJECTED-Admin. Passwort für alle: **`test1234`**. Wiederholbar (löscht vorher alle `@demo.de`-Daten in DB + Supabase). Alle Logins in **`notes/demo-logins.md`**.
- **🔴 Gotcha:** `data/demo-leads.json` und `data/demo-commissions.json` referenzieren **echte DB-IDs**. Nach **jedem** `seed-demo`-Lauf ändern sich die IDs → JSON zeigt ins Leere. Fix: IDs via `pnpm tsx scripts/list-ids.ts` holen und in beiden JSON-Dateien neu setzen. Aktuell verknüpft mit **Abschlepp Berlin** (Markus Weber = Inhaber, Tom Schulz = Fahrer).

## 6. Config / Gotchas
- `.env.local`: `DATABASE_URL`, `DIRECT_URL`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SECRET_KEY`, `NEXT_PUBLIC_APP_URL`, `SUPER_ADMIN_*`.
- **Nach `prisma generate`/`migrate dev` → `pnpm dev` neu starten** (sonst stale Client → z.B. „column does not exist").
- **Sandbox kann keine Prisma-Engines laden** und kein `tsx` mit DB — Migrationen/Seed/Studio laufen **lokal beim User**. `tsc`/`eslint` laufen im Sandbox.
- Prüf-Kommandos: `pnpm exec tsc --noEmit`, `pnpm exec eslint`.

## 7. Git / Jira
- Solo-Dev, direkter Merge (kein PR). Remote `github.com/aydasYa/dm-webapp`. `tsc` läuft sauber.
- Für Epic 5 wurde vorgeschlagen, auf einem eigenen Branch von `main` zu arbeiten.
- Jira Cloud `dmsbielefeld.atlassian.net`, Key **`WEBAPP`**. Atlassian-Verbindung in den Sessions oft **offline** → Tickets/Status setzt der User manuell; ich liefere paste-fertige Inhalte. Verbundener Account = **Rahmi Kaya**.

## 8. Arbeitsweise mit dem User (WICHTIG!)
- **Starkes ADHS:** zuerst **klarer Überblick**, dann **kleine Schritte**, **kompakt**.
- **Jeder Schritt mit Kopf:** `📍 Phase · Epic · Ticket — Titel` + kurze Fortschrittszeile.
- **Mentor-Modus (Default): der User tippt selbst.** Code geben **mit dem Warum erklären**, Kernteile selbst tippen lassen. **Nur bei „mach das für mich" direkt umsetzen.**
- Nach jedem Schritt `tsc` (Sandbox) grün halten, dann Commit-Befehl geben (User committet selbst).
- **Mini-Hinweise / Tech-Debt IMMER in `notes/` eintragen**, nicht nur im Chat sagen.

## 9. Nächstes — Epic 5 „UI-Feinschliff (Mockup)" (Details: `notes/epic-5-ui-feinschliff.md`)
Nur Optik/Styling ans vom User geschickte Dashboard-Mockup angleichen (Funktion steht):
1. **KPI-Karten im Mockup-Look** — farbige Icon-Badges (blau/grün/lila/amber), Trend-Pille.
2. **Donut mit „Gesamt" in der Mitte** — Zahl + „Gesamt" zentriert, Legende feinschleifen.
3. **Lead-Entwicklung-Chart polieren** — Gradient-Fläche, schönerer Tooltip, Achsen.
4. **Karten-Header mit Zeitraum-Dropdown** — „Täglich"/Monatswahl.
5. **Sidebar: Konto-Name umplatzieren** — Name unten über „Abmelden" raus, oben (Kopf) anzeigen.
6. **Layout & Spacing an Mockup angleichen.**

## 10. Offene Nachzügler / Backlog (in `notes/tech-debt.md` & `notes/open-questions.md`)
- Toter Code entfernen: `lib/lead-status.ts`, `calculateCommissionAmount`.
- AuditLog: Ansicht bauen; Provisions-Actions (`approveCommission`/`markCommissionAsPaid`) auch loggen.
- Komponenten verschlanken (Logik vor `return` → `lib/`).
- Echte Salesforce-Anbindung (JSON → `fetch`), Demo-Leads nur für Berlin.
- Produktfragen (`open-questions.md`): Admin-eigene-Provision, REJECTED reaktivieren, echtes Löschen (Supabase-Auth).
- E-Mail-System (WEBAPP-48) pausiert; `nodemailer` installiert, `lib/email.ts` offen.
