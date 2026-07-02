# Backlog-Epics (nach Epic 5)

**Stand:** 02.07.2026 · Reihenfolge nach Priorität des Nutzers: **11 → 10 → 9 → 8 → 12**.
Code-Health (6) & Tests (7) bewusst danach. Paste-fertig für Jira (`WEBAPP`). Jede Story: was + „DoD" (woran erkennbar).

---

## ▶️ Epic 11 — QR-Kurzlink (WEBAPP-181)  · Priorität 1
**Ziel:** Route `/r/<code>` leitet auf die Angebotsseite mit UTM-Parametern weiter — statt QR mit langer UTM-URL. Kürzerer/teilbarer Link, Ziel später änderbar ohne neuen QR, Scans optional zählbar.
**⚠️ Offene Entscheidung (beim Start klären):** Code = **echter Kurz-Code** (`User.shortCode`, braucht Prisma-Migration) **oder** **User-ID** (keine Migration, längerer Link).

- **Story 11.1 — Kurz-Code am User** *(nur bei Variante Kurz-Code)*: `User.shortCode String? @unique` + Migration (`add_user_short_code`), Generierung (6 Zeichen) falls leer. *DoD:* jeder Fahrer/Inhaber hat einen eindeutigen shortCode.
- **Story 11.2 — Redirect-Route** `app/r/[code]/route.ts` (GET): User per code finden → 302 auf `angebot.deinmotorschaden.de?utm_medium=<userId>&utm_source=<companyId>`. *DoD:* Scan/Aufruf leitet korrekt mit UTM weiter; unbekannter Code → 404.
- **Story 11.3 — QR nutzt Kurzlink**: `createQrCode` speichert `qrCode = <APP_URL>/r/<code>`; Sidebar/QR-Seiten zeigen den kurzen Link. *DoD:* generierte QR-Codes enthalten den Kurzlink.
- **Story 11.4 (optional) — Scan-Zählung**: pro Redirect einen Zähler/Log schreiben. *DoD:* Scans sind auswertbar.

## ▶️ Epic 10 — Salesforce-Integration (echte Daten)  · Priorität 2
**Ziel:** Leads & Provisionen aus echtem Salesforce statt JSON-Simulation. Signatur der Loader bleibt, nur das Innere wechselt.

- **Story 10.1 — `getCommissions` auf `fetch()`**: JSON-Read durch API-Call ersetzen, gleiche Rückgabe-Form. *DoD:* Provisionen kommen live, Aufrufer unverändert.
- **Story 10.2 — `getLeads` auf `fetch()`**: analog. *DoD:* Lead-Charts/KPIs aus Live-Daten.
- **Story 10.3 — Auth/Fehler/Caching**: Salesforce-Token/Secrets in Env, Fehler-/Timeout-Handling, sinnvolles Caching. *DoD:* robuster Abruf, keine Secrets im Client.
- **Story 10.4 — Demo/Seed-Sync (Übergang)**: solange JSON: IDs nach `seed-demo` automatisch setzen (`scripts/list-ids.ts`), Leads für alle Firmen. *DoD:* keine leeren Charts nach Re-Seed.

## ▶️ Epic 9 — AuditLog fertigstellen  · Priorität 3
**Ziel:** Lückenlose Protokollierung + In-App-Einsicht (Model + Helper existieren bereits).

- **Story 9.1 — Provisions-Actions loggen**: `approveCommission`, `markCommissionAsPaid` rufen `logAudit(...)`. *DoD:* jede Genehmigung/Auszahlung erzeugt einen Eintrag.
- **Story 9.2 — Verlauf-Ansicht**: „Verlauf"-Seite (Super-Admin) mit Tabelle der `audit_logs` (wer/wann/was), paginiert. *DoD:* Einträge in der App lesbar, nicht nur via Prisma Studio.

## ▶️ Epic 8 — Robustheit & DX  · Priorität 4
**Ziel:** Bessere Lade-/Fehlerzustände und früh scheiternde Konfiguration.

- **Story 8.1 — `loading.tsx` + Skeletons** für `app/dashboard/*`. *DoD:* beim Navigieren erscheinen Skeletons statt weißem Blitz.
- **Story 8.2 — `error.tsx`**: freundliche Fehlerseiten je Route-Segment. *DoD:* Fehler zeigen UI statt Crash.
- **Story 8.3 — Env-Validierung (zod)**: Supabase-/DB-Variablen beim Start prüfen. *DoD:* fehlende Var → klarer Fehler beim Boot, nicht kryptisch zur Laufzeit.

## ▶️ Epic 12 — Produktentscheidungen & Features  · Priorität 5
**Ziel:** offene Produktfragen aus `open-questions.md` umsetzen — **brauchen erst Entscheidung**.

- **Story 12.1 — Admin-eigene Provision**: Option A (eigener Bereich, `driverId = adminId`) / B (Toggle „Alle" vs „Nur meine") / C (Hervorhebung). *DoD:* Admin sieht seine eigenen Provisionen getrennt.
- **Story 12.2 — Echtes Löschen**: Fahrer/Firmen-Admin inkl. `supabase.auth.admin.deleteUser` statt nur Soft-Delete. *DoD:* gelöschte Nutzer sind auch in Supabase-Auth weg.
- **Story 12.3 — `REJECTED` reaktivieren**: Super-Admin kann abgelehnten Admin wieder auf `ACTIVE` setzen. *DoD:* Reaktivierung möglich.

---

## Später (nach obigen)
- **Epic 6 — Code-Health & Refactoring**: toten Code entfernen (`lib/lead-status.ts`, `calculateCommissionAmount`, Alt-`DriverCard`/`CompanyCard`), Lead-/Provisions-Statistik nach `lib/` deduplizieren, Card-Oberfläche zentralisieren, Server-Komponenten verschlanken.
- **Epic 7 — Tests & QS**: Vitest-Setup + Unit-Tests (`summarizeCommissions`, `resolveRange`/`inRange`, `leadStats`, `commissionStats`, Greeting).
