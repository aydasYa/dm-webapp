# Epic — Code-Refactoring & Clean-up

**Stand:** 02.07.2026 · **Branch:** (eigener, z.B. `code-refactoring`)
Reines Refactoring — kein Funktions-/UI-Change. Nach jedem Schritt `tsc` + `eslint` grün, dann Commit.

## Ziel / DoD (Epic)
Kein ungenutzter Code · keine duplizierte Aufbereitung · Server-Komponenten schlank (nur holen + rendern) · alles grün, Verhalten unverändert.

## Stories → Sub-tasks

### Story 1 — Toten Code entfernen
- 1.1 `lib/lead-status.ts` löschen (unreferenziert).
- 1.2 `calculateCommissionAmount` aus `lib/commission.ts` entfernen (ungenutzt).
- 1.3 Typ `DriverCardUser` in `DriverRow.tsx` verschieben, `components/DriverCard.tsx` löschen.
- 1.4 Typ `CompanyCardUser` in `CompanyRow.tsx` verschieben, `components/CompanyCard.tsx` löschen.
- 1.5 Streu-Dateien entfernen (`text` im Root, Transform-Skripte in outputs).
- 1.6 `tsc` + `eslint` grün, Commit.
- **DoD:** keine ungenutzten Dateien/Exports mehr.

### Story 2 — Helper: Lead-Statistik
- 2.1 `lib/leadStats.ts`: `buildLeadTrend(records, year, month)` + `buildLeadStatus(records)`.
- 2.2 In `AdminDashboard` einsetzen.
- 2.3 In `CommissionOverview` einsetzen.
- **DoD:** Lead-Aufbereitung an EINER Stelle, Charts unverändert.

### Story 3 — Helper: Provisions-Statistik
- 3.1 `lib/commissionStats.ts`: Monatssummen, Vormonats-Trend, `commissionChartData`.
- 3.2 In `AdminDashboard`, `CommissionOverview`, `commissions/page` einsetzen.
- **DoD:** Provisions-Aufbereitung dedupliziert.

### Story 4 — Card-Oberfläche zentralisieren
- 4.1 Klassenkette `ring-[2px] … shadow-…` als Konstante/`cva`-Variante.
- 4.2 In Card + Filtern verwenden.
- **DoD:** Border/Shadow an einer Stelle änderbar.

### Story 5 — Server-Komponenten verschlanken
- 5.1 Aufbereitung vor `return` in die neuen `lib/`-Helper verlagern (`AdminDashboard`, `CommissionOverview`, `commissions/page`).
- **DoD:** kein großer Rechen-Block mehr im Komponenten-Body.

### Story 6 (optional) — Component-Konventionen vereinheitlichen
- Props-Typ oben, konsistente Import-Reihenfolge, benannte Exports, keine Inline-Mega-Funktionen.
