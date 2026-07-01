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
1. **Farb-Tokens** — `:root` + `.dark` in `globals.css`, `@theme inline`-Registrierung (`bg-success` etc.). *Basis für alles.*
2. **Theme-Umschalter + Font-Fix** — `next-themes`, `ThemeProvider`, Toggle-Button; Geist wirklich anwenden.
3. **Sidebar** — Aktiv-Pille, Logo-Kopf, QR-Karte, Profil unten. Nav-Struktur besprechen.
4. **KPI-Karten (StatCard)** — farbige Icon-Badges, große Zahl, grüne Trend-Pille (vs. Vormonat).
5. **Charts** — Leads: Gradient-Fläche, Tooltip, Achsen. Donut: „Gesamt" mittig + farbige Legende mit %.
6. **Tabelle + Filterzeile + Badges/Status** — Letzte-Leads-Tabelle, Filter (Datum/Fahrer/Status/Suche), Status-Badges farbig. Marken-Logos klären.
7. **Formulare/Felder + Login/Signup/QR-Seiten** — Inputs, Selects, Buttons, Header-Pattern; Auth- und QR-Seiten.

## shadcn-Komponenten (Entscheidung 01.07.2026)
Config: `style: radix-nova`, `baseColor: neutral`, `iconLibrary: lucide` ✅, CSS-Variablen an.
- **Schon installiert (wiederverwenden, nur via Tokens umstylen):** sidebar, card, badge, chart, table, select, input, field, label, textarea, button, avatar, tooltip, dialog, dropdown-menu (auch Theme-Toggle), skeleton, separator, sheet, slider, tabs.
- **Neu hinzufügen:** `popover` + `calendar` (Datums-Picker Von/Bis + Zeitraum oben, echter Kalender), `sonner` (Toasts = kurze Bestätigungs-Einblendungen nach Aktionen).
  - Befehl (lokal): `pnpm dlx shadcn@latest add popover calendar sonner`
- **Bewusst NICHT:** `command`/Combobox — Fahrer-Filter bleibt `select`, Textsuche deckt das vorhandene Suchfeld ab.

## Offene Struktur-Fragen (je Komponente entscheiden)
- Benachrichtigungs-Glocke (Badge „3") — echtes Feature oder erstmal Deko/weglassen?
- Fahrzeug-Marken-Logos in der Tabelle — woher (Assets/Lizenz)? Erstmal generisches Icon?
- Nav-Punkte im Mockup (Leads, Auszahlungen, Statistiken, Einstellungen) vs. reale Routen angleichen.

## Referenz
Mockup-Bild vom Nutzer (Dark-Dashboard): KPI-Karten mit Icon-Badges, Lead-Entwicklung als Gradient-Flächen-Chart mit Tooltip, Lead-Status-Donut mit „Gesamt" mittig + Legende, Filterzeile, Letzte-Leads-Tabelle mit Status-Badges, Sidebar mit Logo/QR/Profil, Zeitraum-Picker + Glocke oben.
