# Epic 5 — UI-Feinschliff & Design-System (Jira-Export)

**Stand:** 01.07.2026 · **Branch:** `ui-feinschliff` · **Projekt-Key:** WEBAPP
Paste-fertig für Jira. IDs (E5-x.y) sind nur zur Orientierung — echte WEBAPP-Nummern vergibt Jira.
Jede Story hat ein „Definition of Done" (DoD); jeder Sub-Task sagt **was** getan wird und **woran man's erkennt**.

---

## EPIC — UI-Feinschliff & Design-System
**Ziel:** Die gesamte WebApp bekommt ein einheitliches Design-Fundament nach dem Dark-Dashboard-Mockup. Stil wird aus dem Mockup übernommen, die Struktur (Navigation, Features) bleibt an der realen App und wird pro Komponente entschieden.
**Neu gegenüber vorher:** Hell+Dunkel-Umschalter, semantische Farb-Tokens, feste Spacing-Skala, ausschließlich Lucide-Icons, Geist-Font.
**Epic-DoD:** Alle Seiten in Hell und Dunkel konsistent · keine hart codierten Farben (nur Tokens) · Spacing-Skala eingehalten · alle Icons aus lucide-react · `pnpm exec tsc --noEmit` und `eslint` grün.

---

## STORY 1 — Farb-Tokens (Design-System-Basis)
**Beschreibung:** Zentrale Farb-Variablen in `app/globals.css` definieren, auf denen die ganze App aufbaut. Statt überall feste Farben zu schreiben, liest jede Komponente semantische Tokens (`--primary`, `--success` …). Ein Wert ändern = ganze App ändert sich, Hell und Dunkel automatisch.
**Blockt:** alle folgenden Stories (Fundament).
**DoD:** Tokens in `:root` (hell) und `.dark` (dunkel) vorhanden, in `@theme inline` registriert, `tsc` grün.

- **E5-1.1 · Light-Tokens setzen** — In `:root` die Marken-/Status-Farben als `oklch` anlegen: `--primary` (Blau), `--success` (Grün), `--info` (Blau), `--warning` (Gelb), `--destructive` (Rot), `--accent-purple` (Lila) inkl. `-foreground`-Paare. *Erkennbar: Buttons/Links erscheinen im neuen Blau statt Grau.*
- **E5-1.2 · Dark-Tokens setzen** — Im `.dark`-Block dieselben Token-Namen mit Dunkel-Werten: Hintergrund `#0B0E14`, Karte `#161B22`, hellere Akzente, sichtbare Ränder. *Erkennbar: im Dark-Theme dunkler Blauschwarz-Look wie Mockup.*
- **E5-1.3 · Tokens in Tailwind registrieren** — Neue Variablen in `@theme inline` eintragen, damit Utility-Klassen wie `bg-success`, `text-warning`, `border-primary` funktionieren. *Erkennbar: `bg-success` färbt ein Element grün.*
- **E5-1.4 · Chart-Farben mappen** — `--chart-1..5` auf Blau/Grün/Amber/Lila/Rot setzen, damit recharts die Marken-Palette nutzt statt Graustufen. *Erkennbar: Donut-Segmente farbig.*

---

## STORY 2 — Theme-Umschalter + Font-Fix
**Beschreibung:** Echten Hell/Dunkel-Umschalter einbauen (bisher ist der `.dark`-Block toter Code, nichts schaltet ihn). Außerdem den Font-Bug beheben: Geist ist geladen, wird aber von `Arial` überschrieben.
**DoD:** Umschalten hell↔dunkel funktioniert ohne Flackern, Auswahl bleibt nach Reload, Geist ist sichtbar aktiv.

- **E5-2.1 · next-themes installieren** — Standard-Bibliothek für Theme-Handling in Next.js hinzufügen (regelt SSR, System-Voreinstellung, Persistenz). *Erkennbar: Paket in `package.json`.*
- **E5-2.2 · ThemeProvider einbinden** — In `app/layout.tsx` den Provider setzen (`attribute="class"`, `defaultTheme="system"`) und `suppressHydrationWarning` am `<html>`. *Erkennbar: `.dark`-Klasse wird je nach System/Wahl gesetzt.*
- **E5-2.3 · Toggle-Button bauen** — Umschalt-Button mit Sonne/Mond-Icon (Lucide), Optionen Hell/Dunkel/System, platziert in Topbar oder Sidebar. *Erkennbar: Klick wechselt das Theme sofort.*
- **E5-2.4 · Geist-Font aktivieren** — `Arial`-Override in `body` (globals.css) entfernen, `font-sans` konsequent anwenden. *Erkennbar: Schrift wirkt moderner/geometrischer als vorher.*

---

## STORY 3 — Sidebar
**Beschreibung:** Die Seitenleiste an das Mockup angleichen: Logo-Kopf, hervorgehobener aktiver Menüpunkt, QR-Karte und Profil-Block unten.
**DoD:** Sidebar in beiden Themes korrekt, aktive Route sichtbar hervorgehoben, keine toten Nav-Links.

- **E5-3.1 · Logo-Kopf** — Oben Logo + „deinmotorschaden.de / Partner Network". *Erkennbar: Markenkopf statt nur Text.*
- **E5-3.2 · Aktiv-Zustand** — Aktuellen Menüpunkt als Pille im Primär-Ton hervorheben (Route-basiert). *Erkennbar: aktive Seite ist optisch markiert.*
- **E5-3.3 · QR-Karte unten** — „Mein QR-Code"-Karte mit QR + Link + Button, nur für Fahrer/Inhaber. *Erkennbar: QR-Karte am unteren Sidebar-Ende.*
- **E5-3.4 · Profil-Block** — Avatar + Name + Firma + Chevron ganz unten; alte Namens-Platzierung über „Abmelden" entfernen. *Erkennbar: Name unten im Profil-Bereich, nicht mehr doppelt.*
- **E5-3.5 · Nav-Struktur klären** — Mockup-Punkte (Leads, Auszahlungen, Statistiken, Einstellungen) mit realen Routen abgleichen; nur echte Ziele verlinken. *Erkennbar: jeder Menüpunkt führt auf eine existierende Seite.*

---

## STORY 4 — KPI-Karten (StatCard)
**Beschreibung:** Die vier Kennzahl-Karten oben im Dashboard auf den Mockup-Look bringen: farbige Icon-Badge, große Zahl, grüne Trend-Pille.
**DoD:** 4 Karten wie Mockup, Badge-Farbe je Karte, Trendwert dynamisch, in beiden Themes.

- **E5-4.1 · Icon-Badge** — Farbiges Quadrat mit Lucide-Icon links (Blau/Grün/Lila/Amber je Kennzahl). *Erkennbar: farbige Badges statt schlichter Karten.*
- **E5-4.2 · Label + Zahl** — Kennzahl-Titel klein oben, große Zahl darunter. *Erkennbar: Zahl dominiert die Karte.*
- **E5-4.3 · Trend-Pille** — Grüne Pille „▲ x% vs. Vormonat" mit Lucide-Pfeil. *Erkennbar: Trend unter der Zahl.*
- **E5-4.4 · Grid & Responsive** — 4-Spalten-Raster mit `gap-4`, das auf kleineren Bildschirmen umbricht. *Erkennbar: Karten ordnen sich sauber an.*

---

## STORY 5 — Charts (Lead-Entwicklung + Donut)
**Beschreibung:** Die beiden Diagramme optisch aufwerten wie im Mockup.
**DoD:** Beide Charts wie Mockup, in Hell und Dunkel gut lesbar.

- **E5-5.1 · Flächen-Verlauf** — Lead-Entwicklung mit Gradient-Füllung (Primär-Blau, oben kräftig → unten transparent), geglättete Linie. *Erkennbar: weicher blauer Verlauf statt flacher Fläche.*
- **E5-5.2 · Custom-Tooltip** — Beim Hover Box mit Datum + „Leads: n". *Erkennbar: informativer Tooltip am Datenpunkt.*
- **E5-5.3 · Achsen & Grid** — Achsenbeschriftung und Hilfslinien dezent über Token-Farben. *Erkennbar: ruhige, nicht dominante Achsen.*
- **E5-5.4 · Donut mit Mitte** — „Gesamt"-Zahl zentriert im Donut, Segmentfarben = Status-Tokens. *Erkennbar: Zahl in der Donut-Mitte.*
- **E5-5.5 · Donut-Legende** — Pro Status: farbiger Punkt + Label + Wert + Prozent. *Erkennbar: Legende rechts wie Mockup.*

---

## STORY 6 — Tabelle + Filterzeile + Status-Badges
**Beschreibung:** Die „Letzte Leads"-Tabelle, die Filterzeile darüber und die farbigen Status-Badges umsetzen.
**DoD:** Tabelle + Filter wie Mockup, Badges token-basiert, Hover dezent, in beiden Themes.

- **E5-6.1 · Tabelle** — Spalten Datum / Kunde / Fahrzeug / Fahrer / Status / Provision / Detail-Pfeil, mit dezentem Zeilen-Hover. *Erkennbar: strukturierte Lead-Tabelle.*
- **E5-6.2 · Status-Badges** — Farbige Badges (Grün „Abgeschlossen", Blau „In Bearbeitung", Gelb „Offen", Rot „Storniert") über `--success/--info/--warning/--destructive`. *Erkennbar: Status auf einen Blick farblich erkennbar.*
- **E5-6.3 · Filterzeile** — Von/Bis-Datum (shadcn calendar), Fahrer (select), Status (select), Suchfeld, „Filter zurücksetzen". *Erkennbar: komplette Filterleiste über der Tabelle.*
- **E5-6.4 · Datepicker einbauen** — `popover` + `calendar` hinzufügen und für die Datumsfelder nutzen. *Erkennbar: Klick öffnet Kalender-Popover.*
- **E5-6.5 · Fahrzeug-Logos klären** — Entscheiden, ob Marken-Logos (Asset/Lizenz) oder generisches Auto-Icon. *Erkennbar: Fahrzeugspalte hat einheitliches Icon.*
- **E5-6.6 · Footer-Link** — „Alle Leads anzeigen →" unter der Tabelle. *Erkennbar: Link zur Vollansicht.*

---

## STORY 7 — Formulare/Felder + Login/Signup/QR-Seiten
**Beschreibung:** Alle Formular-Elemente und die restlichen Seiten (Auth, QR) auf den neuen Look bringen.
**DoD:** Alle Formularseiten konsistent, Fokus-Ring im Primär-Ton, in beiden Themes.

- **E5-7.1 · Eingabefelder** — Input/Select/Textarea/Label mit Token-Rändern und Primär-Fokus-Ring. *Erkennbar: Felder sehen einheitlich neu aus.*
- **E5-7.2 · Button-Varianten** — Primär/Sekundär/Destruktiv/Ghost sauber über Tokens. *Erkennbar: konsistente Buttons überall.*
- **E5-7.3 · Seiten-Header-Muster** — Einheitlicher Kopf: Titel + Untertitel links, Aktion rechts. *Erkennbar: jede Seite startet gleich aufgebaut.*
- **E5-7.4 · Auth-Seiten** — Login, Signup, set-password an neuen Look. *Erkennbar: Login passt zum Rest.*
- **E5-7.5 · QR-Seiten** — `qrcode` + `qrcodes` angleichen. *Erkennbar: QR-Ansichten im neuen Stil.*
- **E5-7.6 · Toasts (sonner)** — `sonner` einbauen und nach Aktionen (Speichern, Aktivieren, Löschen) kurze Bestätigung einblenden. *Erkennbar: nach Aktion poppt kurze Meldung auf.*

---

## STORY 8 — QA & Dokumentation
**Beschreibung:** Abschluss-Durchgang: beide Themes prüfen, Reste hart codierter Farben entfernen, Docs aktualisieren.
**DoD:** Keine harten Farben mehr, `tsc` + `eslint` grün, `notes/` und `HANDOFF.md` aktuell.

- **E5-8.1 · Theme-Durchgang** — Jede Seite in Hell und Dunkel durchklicken (Kontrast, Ränder, Lesbarkeit). *Erkennbar: nichts „verschwindet" im jeweiligen Theme.*
- **E5-8.2 · Harte Farben entfernen** — Grep nach `#`, `slate-`, `gray-` und auf Tokens umstellen. *Erkennbar: Farbsuche liefert nur noch Tokens.*
- **E5-8.3 · Docs finalisieren** — `notes/epic-5-ui-feinschliff.md` und `HANDOFF.md` auf Endstand bringen. *Erkennbar: Docs beschreiben den fertigen Zustand.*

---

## Offene Struktur-Fragen (eigene Tickets oder in Story 3/6)
- **Glocke:** Benachrichtigungs-Glocke mit Badge „3" — echtes Feature oder erstmal Deko/weglassen?
- **Marken-Logos:** Fahrzeug-Logos in der Tabelle — Quelle/Lizenz klären, sonst generisches Icon.
- **Nav-Punkte:** Mockup-Menü (Leads, Auszahlungen, Statistiken, Einstellungen) an reale Routen angleichen.
