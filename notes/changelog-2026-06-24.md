# Änderungs-Doku — 24.06.2026

Alle Änderungen dieser Session, gruppiert, zum **selbst Nachbauen**. Reihenfolge = sinnvolle Reihenfolge zum Wiederholen.

---

## A) Rollen-Hierarchie & Super-Admin (WEBAPP-155)

- **156 — SUPER_ADMIN-Rolle:** `prisma/schema.prisma` Enum `Role` um `SUPER_ADMIN` erweitert → `pnpm prisma migrate dev --name add_super_admin_role` → Dev-Server neu.
- **159 — signup-Flow:** `app/actions/auth.ts` → `signup` legt Firmen-Admin als `role: ADMIN` + `status: PENDING` an (vorher `TOW_TRUCK_DRIVER`).
- **158 — Admin-Bootstrap:** `scripts/load-env.ts` (lädt `.env.local` vor allen Imports) + `scripts/create-super-admin.ts` (legt 1. Super-Admin in Supabase + DB an, idempotent). Run: `pnpm tsx scripts/create-super-admin.ts`. Braucht `SUPER_ADMIN_EMAIL/PASSWORD/FIRSTNAME/LASTNAME` in `.env.local`.
- **157 — Super-Admin-Dashboard:** `components/dashboard/SuperAdminDashboard.tsx` (Landing), Chooser `app/dashboard/page.tsx` (SUPER_ADMIN-Zweig), Sidebar-Tab „Unternehmen" in `components/AppSidebar.tsx`, Seite `app/dashboard/companies/page.tsx`, `components/CompanyCard.tsx` (Popup + Aktionen). Server-Actions in `auth.ts`: `updateCompanyAdminStatus`, `deleteCompanyAdmin` (SUPER_ADMIN-gated, Ziel muss ADMIN sein).
- **162 — Status-Wording:** `components/DriverCard.tsx` → `INACTIVE` = „Deaktiviert", Buttons „Deaktivieren/Aktivieren".
- **163 — QR-Auto-Gen:** `app/actions/auth.ts` → `setPassword` ruft `createQrCode(user.id)` beim Aktivieren.

## B) Mandanten-Trennung (Security-Fix)
Alle Admin-Ansichten nach `companyId` gefiltert (vorher firmenübergreifend sichtbar):
- `app/dashboard/users/page.tsx`, `app/dashboard/qrcodes/page.tsx`, `app/dashboard/commissions/page.tsx`, `app/dashboard/leads/page.tsx`, `components/dashboard/AdminDashboard.tsx`.
- Provisionen/Leads über Relation: `where: { towTruckDriver: { companyId } }`.

## C) UI-Redesign (Epic WEBAPP-174, shadcn, Light-Theme)
- **175 — `components/StatCard.tsx`:** KPI-Karte (Label, Wert, Trend-Badge oben rechts, optionaler Footer). Keine Icons.
- **177 — Fahrer-Dashboard** (`components/CommissionOverview.tsx`): StatCards + Vormonats-Trend.
- **178 — Admin-Dashboard** (`AdminDashboard.tsx`): StatCards, **Fahrer-Filter** (GET `?driver=`), Fahrer-Liste, Vormonats-Trend.
- **179 — Super-Admin:** `components/DonutChart.tsx` (generisch) + `components/CompaniesChart.tsx` (Monats-Balken) + Status-Donut & „Neue Unternehmen"-Chart.
- **180 — Zeitraum-Picker:** `lib/dateRange.ts` (`resolveRange`/`inRange`) + `components/DateRangeFilter.tsx` (Presets 7d/30d/3m + Von/Bis). Verdrahtet in Provisionen-Seite + Fahrer-Dashboard.
- **182 — Provisionen-Seite** auf StatCards + Donut angeglichen.
- **176 — Theme/Sidebar:** `app/globals.css` Auto-Dark-Block (`prefers-color-scheme`) entfernt → nur Light. `AppSidebar.tsx` User-Block mit Avatar unten.
- Charts/Donut auch in Fahrer- + Admin-Provisionen ergänzt.

## D) Salesforce-Provisionen als JSON-Simulation
Provisionen kommen aus einer JSON (simuliert Salesforce), Rest weiter aus DB.
- **`data/aydas-commissions.json`** — flache `records`-Liste: `id, companyId, driverId, driverName, amount, status, createdAt`. IDs = echte DB-IDs (Company-ID + User-IDs).
- **`lib/getCommissions.ts`** — `getCommissions({ companyId, driverId? })`: liest JSON + filtert. (Async, damit später `fetch()` zu Salesforce ohne Aufruf-Änderung rein kann.)
- **`scripts/list-ids.ts`** — gibt Company- + User-IDs aus (`pnpm tsx scripts/list-ids.ts`), um die JSON korrekt zu befüllen.
- **Verdrahtet:** `CommissionOverview.tsx` (Fahrer: `driverId = userId`), `AdminDashboard.tsx` (Firma: nur `companyId`), `app/dashboard/commissions/page.tsx` (Admin = Firma, Fahrer = eigene). Überall `createdAt` aus Text → `new Date(...)` umgewandelt, damit Summen/Charts/Filter weiter laufen.
- **Admin als Fahrer:** `app/dashboard/page.tsx` gibt `adminId` + `adminName` an `AdminDashboard`; Dropdown-Eintrag „<Name> (Inhaber)" → eigene Provision des Admins gezielt sehen.

## E) Heutiger Bugfix
- **Provision-Tab zeigte nichts beim Filtern:** Ursache — `app/dashboard/commissions/page.tsx` las noch aus der DB (leer), während „Übersicht" schon aus der JSON las. Fix: Seite auf `getCommissions()` (JSON) umgestellt → Daten erscheinen, Zeitraum-Filter greift.

---

## Wichtige Stolperfallen (gelernt)
- JSON `createdAt` ist **Text** → vor Datums-Logik `new Date(...)`.
- JSON-`companyId`/`driverId` müssen die **echten DB-IDs** sein, sonst findet der Filter nichts.
- `companyId` ≠ `userId` — nicht denselben Wert für beides nehmen.
- Nach `prisma migrate` Dev-Server neu starten.
- Code-Kommentare/Variablen Englisch, UI-Texte Deutsch.
