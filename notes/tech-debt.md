# Tech-Debt & Verbesserungs-Ideen

Nach Wichtigkeit. Kein Blocker — „später sauber machen".

## 🔴 Sicherheit / Korrektheit
- **Server-Actions gegen IDOR härten** — `updateUserStatus`, `deleteDriver`, `generateQrCode`, `approveCommission`, `markCommissionAsPaid` prüfen nur „ist Admin?", nicht „gehört das Ziel zu *meiner* Firma?". Fix: in jeder Action prüfen, dass das Ziel dieselbe `companyId` hat wie der Aufrufer.
- **`companyId`-Null-Fall absichern** — fehlt einem Admin die `companyId`, matchen Filter `companyId: null` → er sähe alle firmenlosen Datensätze. „Kein Treffer" erzwingen, wenn `companyId` fehlt.

## 🟠 Code-Gesundheit
- **Login-/Rollen-Check zentralisieren** — Muster `getClaims → findUnique → Rolle prüfen` steht in ~8 Dateien. Helper `requireUser(role)` in `lib/auth.ts`.
- **DB-Abfragen parallelisieren** — `AdminDashboard` / `SuperAdminDashboard` machen mehrere Abfragen nacheinander; mit `Promise.all([...])` parallel.
- **Rollen-Enum statt String-Unions** — `DashboardShell` / `AppSidebar` nutzen hartkodierte Strings (`"ADMIN" | …`); besser den `Role`-Enum.
- **Provisions-Summen dupliziert** — Gesamt/Offen/Ausbezahlt in `CommissionOverview`, `commissions/page.tsx`, `AdminDashboard`. In Helper (`lib/commission.ts`) bündeln.
- **Company-Daten doppelt** — `Company`-Model + `companyId` da, aber alte `companyXyz`-Felder liegen weiter flach auf `User`. Echte Migration der Felder steht aus.
- **`CommissionOverview`-Funktionsname** — Funktion heißt `CommissionsOverview`, Datei `CommissionOverview.tsx` (egal, default export, aber inkonsistent).
- **ESLint `ignoreRestSiblings`** — `validateSignup` filtert `companyWebsite` per Rest-Destructure → unused-var Warning. Optional Regel `{ ignoreRestSiblings: true }` setzen.

## 🟡 UX / Funktion
- **Lösch-Bestätigung** — „Löschen" ist 1 Klick = weg. Bestätigungs-Dialog ergänzen.
- **Lade-/Deaktiviert-Zustand bei Buttons** (`useFormStatus`) gegen Doppelklick.
- **Paginierung** für Fahrer-, Leads- und Provisions-Listen.
- **`AuditLog` nutzen** — Model existiert, ungenutzt. Status-Änderungen/Freigaben/Löschungen protokollieren (wer, wann, wen).
- **Fahrer-Filter im Provision-Tab fehlt noch** (`app/dashboard/commissions/page.tsx`, Admin). Soll funktionieren wie der Fahrer-Filter im Übersicht-Tab (`AdminDashboard`): GET-Param `?driver=` lesen → an `getCommissions({ companyId, driverId })` durchreichen → `DateRangeFilter` um ein Fahrer-Dropdown (inkl. „<Name> (Inhaber)") ergänzen. Aktuell hat der Provision-Tab nur den Zeitraum-Filter.

## Verhaltens-Notizen (so gewollt, kein Bug)
- **Soft-Delete** — „Löschen" bei Fahrer/Firmen-Admin setzt `deletedAt` + `INACTIVE` (FK von `Lead`/`Commission` verhindern Hard-Delete). Listen filtern `deletedAt: null`.
- **Soft-Delete lässt Supabase-Auth bestehen** — `deleteDriver` / `deleteCompanyAdmin` löschen nur in der DB. Für echtes Löschen später auch `admin.auth.admin.deleteUser`.
