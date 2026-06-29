# Tech-Debt & Verbesserungs-Ideen

Nach Wichtigkeit. Kein Blocker — „später sauber machen".
Stand: 26.06.2026.

## ✅ Erledigt

### Epic 1 — Sicherheit & Mandant-Härtung
- IDOR-Härtung der Server-Actions (`assertSameCompany`-Helper) ✅
- `companyId`-Null-Fall abgesichert ✅
- Fahrer dürfen Firmendaten nicht bearbeiten (WEBAPP-215) ✅

### Epic 2 — Code-Health
- `requireUser`-Helper (Login-/Rollen-Check zentralisiert) ✅
- Dashboard-Queries parallelisiert (`Promise.all`) ✅
- Role-Enum statt String-Unions ✅
- Provisions-Summen entdoppelt (`summarizeCommissions`) ✅
- ESLint `ignoreRestSiblings` ✅
- `CommissionOverview`-Funktionsname angeglichen ✅
- **Company-Daten ins Company-Model migriert (WEBAPP-199)** ✅ — flache `companyXyz`-Felder von `User` entfernt.

### Epic 4 — UI-Verbesserungen
- Lead-Charts (Entwicklung + Status-Donut), KPI-Karten, Fahrer-Charts, `getLeads`-Quelle ✅
- Altes Lead-Management entfernt ✅

## 🟡 Epic 3 — UX / Funktion (offen)
- **Lösch-Bestätigung** — „Löschen" ist 1 Klick = weg. Bestätigungs-Dialog ergänzen.
- **Lade-/Deaktiviert-Zustand bei Buttons** (`useFormStatus`) gegen Doppelklick.
- **Paginierung** für Fahrer- und Provisions-Listen.
- **`AuditLog` nutzen** — Model existiert, ungenutzt. Status-Änderungen/Freigaben/Löschungen protokollieren (wer, wann, wen).
- **Fahrer-Filter im Provision-Tab fehlt noch** (`app/dashboard/commissions/page.tsx`, Admin). Soll funktionieren wie der Fahrer-Filter im Übersicht-Tab (`AdminDashboard`): GET-Param `?driver=` lesen → an `getCommissions({ companyId, driverId })` durchreichen → `DateRangeFilter` um ein Fahrer-Dropdown (inkl. „<Name> (Inhaber)") ergänzen. Aktuell hat der Provision-Tab nur den Zeitraum-Filter.

## 🧹 Aufräumer (durch Epic 4 entstanden)
- **`lib/lead-status.ts`** — wurde nur von den entfernten Lead-Seiten genutzt; vermutlich toter Code. Prüfen + entfernen.
- **`calculateCommissionAmount`** in `lib/commission.ts` — wurde von `app/actions/leads.ts` (entfernt) genutzt; jetzt ungenutzt. Prüfen + entfernen (nutzt `prisma.lead` / `LeadStatus`).

## 🟠 Komponenten verschlanken (offen)
- **Logik vor dem `return` auslagern** — Server-Komponenten (`commissions/page.tsx`, `AdminDashboard`, `CommissionOverview`) haben viel Aufbereitung (Mappings, Filter, Summen, Paginierung, Chart-Daten) im Body. In `lib/`-Helper auslagern, damit die Komponente nur noch rendert (schlanker, wiederverwendbar, testbar).

## 🔌 Salesforce / Daten (offen)
- **Echte Salesforce-Anbindung** — `getLeads` (und `getCommissions`) lesen aktuell aus JSON. Später nur das Innere auf `fetch()` umstellen; Signatur bleibt gleich, Aufrufer unverändert.
- **Demo-Leads nur für Berlin** — `data/demo-leads.json` hat nur Datensätze für Abschlepp Berlin (Markus Weber + Tom Schulz). Andere Firmen/Fahrer zeigen leere Lead-Charts, bis sie Lead-Daten bekommen.
- **IDs in den JSON-Dateien** hängen an der Seed-DB — nach jedem `seed-demo` neu setzen (per `scripts/list-ids.ts`). Betrifft `demo-leads.json` und `demo-commissions.json`.

## Verhaltens-Notizen (so gewollt, kein Bug)
- **Soft-Delete** — „Löschen" bei Fahrer/Firmen-Admin setzt `deletedAt` + `INACTIVE` (FK von `Lead`/`Commission` verhindern Hard-Delete). Listen filtern `deletedAt: null`.
- **Soft-Delete lässt Supabase-Auth bestehen** — `deleteDriver` / `deleteCompanyAdmin` löschen nur in der DB. Für echtes Löschen später auch `admin.auth.admin.deleteUser`.
