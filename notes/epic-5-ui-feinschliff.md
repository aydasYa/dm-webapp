# Epic 5 — UI-Feinschliff (Mockup)

**Stand:** 01.07.2026 · **Status:** in Arbeit · **Branch:** `ui-feinschliff`

Ursprünglich nur „Dashboard-Optik ans Mockup angleichen". **Erweitert (01.07.):** die **ganze WebApp** bekommt ein neues Design-Fundament. Funktion bleibt (Epic 4) — hier geht es um Optik/Darstellung, plus ein sauberes Design-System als Basis.

## Abgrenzung
- **Epic 3 (UX)** = Bedienung/Verhalten (Lösch-Bestätigung, Ladezustände, Paginierung, Fahrer-Filter, AuditLog).
- **Epic 5 (UI)** = Optik/Styling + Design-System (dieses Dokument).

## Grundsatz-Entscheidungen (01.07.2026)
- **Scope:** ganze App, nicht nur Dashboard. **Stil** aus dem Mockup übernehmen; **Struktur/Nav/Features** je Komponente einzeln entscheiden (App-Struktur ≠ Mockup, z.B. Lead-Management ist entfernt).
- **Theme:** Hell UND Dunkel als echter **Umschalter** (`next-themes`). ⚠️ Kehrt die frühere Vorgabe „nur hell / Dark Mode raus" um — bewusste Neu-Entscheidung.
- **Font:** `Geist` (schon via next/font geladen) wirklich anwenden. Bug: `body` überschrieb bisher mit `Arial` → raus.
- **Feel:** runde Ecken, luftig, weiche Schatten (wie Mockup).
- **Icons:** ausschließlich `lucide-react` (bereits installiert). Keine Inline-SVGs, keine Emoji-Icons.

## Design-Tokens (semantisch, in `globals.css` `:root` = hell / `.dark` = dunkel)
Werte als `oklch(L C H)`. Hex hier nur zur Orientierung.

| Rolle | Hell | Dunkel | Verwendung |
|---|---|---|---|
| `--primary` (Blau) | #2563EB | #3B82F6 | Buttons, Aktiv-Nav, Links, Chart-Linie |
| `--success` (Grün) | #16A34A | #22C55E | Status „Abgeschlossen", Trend ▲ |
| `--info` (Blau) | #2563EB | #3B82F6 | Status „In Bearbeitung" |
| `--warning` (Gelb) | #CA8A04 | #EAB308 | Status „Offen", Amber-Badge |
| `--destructive` (Rot) | #DC2626 | #EF4444 | Status „Storniert", Löschen |
| `--accent-purple` | #7C3AED | #8B5CF6 | KPI-Badge Conversion |
| `--background` | #FFFFFF | #0B0E14 | Seite |
| `--card` | #FFFFFF | #161B22 | Karten/Panels |

Regel: Komponenten lesen **immer** Tokens (`bg-primary`, `text-success`), nie harte Farben. Ein Token ändern → ganze App ändert sich, Light+Dark automatisch.

## Spacing-Skala (4px-Raster, nur diese Stufen)
Erlaubt: **4 · 8 · 12 · 16 · 24 · 32** — nichts dazwischen.

| Zweck | Wert | Tailwind |
|---|---|---|
| Seiten-Padding | 24–32 | `p-6 lg:p-8` |
| Abstand zwischen Sektionen | 24 | `space-y-6` |
| Grid-Lücke KPI-Karten | 16 | `gap-4` |
| Grid-Lücke Charts | 24 | `gap-6` |
| Karten-Innenabstand | 20–24 | `p-5`/`p-6` |
| Elemente in einer Karte | 8–12 | `space-y-2`/`space-y-3` |

## Fahrplan / Tickets (neu geordnet: Fundament zuerst, dann je Komponente)
1. ✅ **Farb-Tokens** — `:root` + `.dark` in `globals.css`, `@theme inline`-Registrierung (`bg-success` etc.). *Basis für alles.*
2. ✅ **Theme-Umschalter + Font-Fix** — `next-themes`, `ThemeProvider`, Toggle-Button; Geist wirklich anwenden.
3. ✅ **Sidebar** — Aktiv-Pille, Logo-Kopf, QR-Karte, Profil-Dropdown. Nav = reale Routen (nur umgestylt).
4. ✅ **KPI-Karten (StatCard)** — farbige Icon-Badges, große Zahl, grüne Trend-Pille. Auf alle StatCards ausgerollt.
5. ✅ **Charts** — Leads: Gradient-Fläche, Datums-Achse, saubere Y-Ticks, Tooltip, Legende, Täglich/Wöchentlich-Toggle. Donut: „Gesamt" mittig + farbige Legende mit %.
6. ⏭️ **Tabellen + Filterzeile + Badges/Status** — *(neu geschnitten 01.07., siehe unten)* bestehende Listen → shadcn-Tabellen, Token-Badges, Filterzeile + Datepicker. **Keine** Leads-Tabelle, **keine** Marken-Logos/Glocke.
7. ✅ **Formulare/Felder + Login/Signup/QR-Seiten** — Inputs/Buttons via Tokens ok; `PageHeader`-Muster; Login-Card; QR-Seiten; Toasts (sonner).

### ✅ Story 7 — Formulare + Auth/QR + Toasts
- **Eingabefelder/Buttons**: bereits shadcn/Token-basiert → automatisch korrekt (kein Umbau nötig).
- **`components/PageHeader.tsx`** (neu): Titel + Untertitel + Aktion. Angewandt: Fahrer, Unternehmen, Provisionen, QR-Codes, Profil.
- **Auth**: Login-Formular in Card gefasst (konsistent mit Signup/set-password); Signup-Pflichtstern `text-red-600` → `text-destructive`.
- **QR-Seiten**: `PageHeader`; „Generieren" zeigt Toast.
- **Toasts (`sonner`)**: themed `<Toaster />` im Layout (next-themes-aware). Toasts bei: Fahrer/Unternehmen deaktivieren+löschen (`ConfirmActionButton.successMessage`), Fahrer aktivieren, Unternehmen freigeben/ablehnen/aktivieren, QR generieren, **Profil speichern** (Flash-Muster: `redirect(?saved=1)` + `components/FlashToast.tsx`).

### Story 6 — Entscheidungen (01.07.2026)
- **„Letzte Leads"-Tabelle: weggelassen.** Leads bleiben nur als Charts (App = „nur Auswertungen", Lead-Mgmt in Epic 4 entfernt).
- **Bestehende Listen → echte shadcn-`Table`** statt Karten: Provisionen (`commissions/page` + `CommissionOverview`), Fahrer (`users`), Unternehmen (`companies`).
- **Status-Badges token-basiert** (`--success/--info/--warning/--destructive`) — ersetzt hart codierte `bg-yellow-100`-Maps (`statusStyles`) und die Status-Chips in `DriverCard`/`CompanyCard`.
- **Filterzeile** poliert + **Datepicker** via `popover`+`calendar` (`pnpm dlx shadcn@latest add popover calendar`).
- **Bewusst NICHT:** Fahrzeug-Marken-Logos, Benachrichtigungs-Glocke (bei Bedarf eigene Tickets).

## Umsetzungs-Log (was konkret gebaut wurde)

### ✅ Story 1 — Farb-Tokens
`globals.css`: `:root` (hell) + `.dark` (dunkel) mit semantischen Tokens (primary blau, success/info/warning/destructive/accent-purple je + `-foreground`), in `@theme inline` registriert (→ `bg-success` etc.), `--chart-1..5` = Blau/Grün/Amber/Lila/Rot, `--ring` blau.

### ✅ Story 2 — Theme-Umschalter + Font
`next-themes` installiert; `components/theme-provider.tsx` + `ThemeProvider` in `app/layout.tsx` (`attribute="class"`, `defaultTheme="system"`, `suppressHydrationWarning`); `components/theme-toggle.tsx` (Hell/Dunkel/System, Sonne/Mond). Font-Fix: `--font-sans` → `--font-geist-sans`, `Arial`-Override im `body` entfernt.

### ✅ Story 3 — Sidebar (`components/AppSidebar.tsx`)
Logo + Untertitel „Partner Network"; Aktiv-Pille blau über Sidebar-Tokens (`--sidebar-accent`/`-accent-foreground`/`-primary`/`-ring` in `:root`+`.dark`); QR-Karte im Karten-Look; Profil-**Dropdown** (Avatar + Name + Firma + Chevron; Menü „Profil"/„Abmelden"). Neue Prop `companyName` durchgereicht: `layout.tsx` → `DashboardShell` → `AppSidebar`.

### ✅ Story 4 — KPI-Karten (`components/StatCard.tsx`)
Optionales Icon-Badge (`LucideIcon`-Prop, Token-Farbe `bg-<token>/10 text-<token>`), großes value, grüne Trend-Pille (`text-success` + `TrendingUp`). `colorMap` blue/green/purple/amber. Auf **alle** StatCards ausgerollt (Dashboard-KPIs, Provisionen, Fahrer, Super-Admin) mit passenden Lucide-Icons.

### ✅ Story 5 — Charts
- **`components/LeadsChart.tsx`**: Gradient-Fläche (`linearGradient` + `fill="url(#fillLeads)"`), Linie `strokeWidth 2`, X-Achse als **Datum** (`tickFormatter`, `minTickGap`), Y-Achse feste Ticks (Domain aufs nächste Vielfache gerundet, adaptive Schrittweite), shadcn-Tooltip mit vollem Datum, shadcn-Legende, **Täglich/Wöchentlich**-Umschalter (`Select`, 7-Tage-Aggregation). Titel + Dropdown wohnen jetzt in der Komponente (Prop `title`); doppelte Karten-Header in Admin- + Fahrer-Ansicht entfernt.
- **Datenshape**: `{ day }` → `{ date }` (ISO) in `AdminDashboard` **und** `CommissionOverview`.
- **`components/DonutChart.tsx`**: „Gesamt"-Zahl mittig via recharts `<Label>` (Token-Farben `fill-foreground`/`fill-muted-foreground`), Legende poliert (runde Punkte, Wert + % rechtsbündig, `tabular-nums`).
- **Donut-Farben token-basiert**: alle hart codierten Hex (`#059669` etc.) → `var(--success/info/warning/destructive/muted-foreground)` in AdminDashboard, CommissionOverview, SuperAdminDashboard, commissions/page.
- **Demo-Daten** (`data/demo-leads.json`): pro Firma mit Fahrern (Berlin/Hamburg/München) ~44–52 Leads im **aktuellen Monat**, Wellen-Verteilung → sichtbarer Verlauf. ⚠️ **Gotcha**: nutzt echte DB-IDs (companyId/driverId) und den *aktuellen Monat* — nach `seed-demo` oder Monatswechsel neu generieren (Skript nutzt `now`). Firmen ohne Fahrer (Köln, Stuttgart) haben bewusst keine Leads.

### ✅ Story 6 — Tabellen + Filterzeile + Badges
- **`components/StatusBadge.tsx`** (neu): Token-Badge (`bg-<token>/10 text-<token>`) + zentrale Maps `COMMISSION_STATUS`, `DRIVER_STATUS` (REJECTED→„Deaktiviert"), `COMPANY_STATUS` (REJECTED→„Abgelehnt"/rot).
- **Provisionen** → shadcn-`Table` (Fahrer/Datum/Status/Betrag) in `commissions/page` + `CommissionOverview`; hart codierte `statusStyles` raus.
- **Fahrer** → `Table` mit neuer **`DriverRow`** (Name-Klick → Detail-Dialog + QR, Aktionen-Spalte). `DriverCard` nur noch als Typ-Export.
- **Unternehmen** → `Table` mit neuer **`CompanyRow`** (Detail-Dialog, Freigeben/Ablehnen/Deaktivieren/Löschen). `CompanyCard` nur noch als Typ-Export.
- **Filterzeile** (`DateRangeFilter`): umrandete Box wie Mockup, Labels über Feldern, „Filter zurücksetzen" (`FilterX`, Reset via `href="?"`).
- **Offen/optional:** shadcn-`calendar`-Datepicker (aktuell native `input[type=date]`). Alte `DriverCard`/`CompanyCard`-Komponenten = toter Code (nur Typ genutzt) → bei Gelegenheit entfernen.

## shadcn-Komponenten (Entscheidung 01.07.2026)
Config: `style: radix-nova`, `baseColor: neutral`, `iconLibrary: lucide` ✅, CSS-Variablen an.
- **Schon installiert (wiederverwenden, nur via Tokens umstylen):** sidebar, card, badge, chart, table, select, input, field, label, textarea, button, avatar, tooltip, dialog, dropdown-menu (auch Theme-Toggle), skeleton, separator, sheet, slider, tabs.
- **Neu hinzufügen:** `popover` + `calendar` (Datums-Picker Von/Bis + Zeitraum oben, echter Kalender), `sonner` (Toasts = kurze Bestätigungs-Einblendungen nach Aktionen).
  - Befehl (lokal): `pnpm dlx shadcn@latest add popover calendar sonner`
- **Bewusst NICHT:** `command`/Combobox — Fahrer-Filter bleibt `select`, Textsuche deckt das vorhandene Suchfeld ab.

## Feinschliff-Backlog
- ✅ **Tabellen-Größe/Lesbarkeit:** `components/ui/table.tsx` — Zellen `px-4 py-3.5`, Header `h-12 px-4` + `text-muted-foreground`, Tabellen-Text `text-[0.9375rem]`. Wirkt global auf alle Tabellen. **Offen:** Entscheidung, ob Fahrer-Tabelle auch in der Übersicht erscheinen soll.
- ✅ **Border-Konsistenz (global):** `@layer base { * { @apply border-border … } }` in `globals.css` → jede `border`/`border-t` nutzt den `--border`-Token statt `currentColor` (war die Ursache für „mal schwarz/weiß"). Zusätzlich die letzten harten Farben (`FormField`, `PasswordMatchHint`: `text-red-600`/`text-green-700`) auf `text-destructive`/`text-success`. **Keine hart codierten Farben mehr außerhalb `ui/`.**
- 🧹 Rest-Aufräumen: alte `DriverCard`/`CompanyCard` (toter Code, nur Typ genutzt) noch mit `bg-emerald-100`-Styles → beim Entfernen mit weg.

## Offene Struktur-Fragen (je Komponente entscheiden)
- Benachrichtigungs-Glocke (Badge „3") — echtes Feature oder erstmal Deko/weglassen?
- Fahrzeug-Marken-Logos in der Tabelle — woher (Assets/Lizenz)? Erstmal generisches Icon?
- Nav-Punkte im Mockup (Leads, Auszahlungen, Statistiken, Einstellungen) vs. reale Routen angleichen.

## Referenz
Mockup-Bild vom Nutzer (Dark-Dashboard): KPI-Karten mit Icon-Badges, Lead-Entwicklung als Gradient-Flächen-Chart mit Tooltip, Lead-Status-Donut mit „Gesamt" mittig + Legende, Filterzeile, Letzte-Leads-Tabelle mit Status-Badges, Sidebar mit Logo/QR/Profil, Zeitraum-Picker + Glocke oben.
