# Entwickler-Notizen & Tech-Debt

Sammlung kleiner Hinweise, Aufräum-Ideen und „später mal sauber machen"-Punkte.
Kein Blocker — nur damit nichts vergessen wird.

## 🔧 Tech-Debt / Refactor-Ideen

- **Provisions-Summen dupliziert** — die Berechnung von Gesamt/Offen/Ausbezahlt liegt jetzt in `components/CommissionOverview.tsx`, `app/dashboard/commissions/page.tsx` und `components/dashboard/AdminDashboard.tsx`. Bei Gelegenheit in einen kleinen Helper (z.B. `lib/commission.ts`) ziehen.
- **Company-Daten doppelt** — es gibt jetzt ein `Company`-Model + `companyId`, aber die alten `companyXyz`-Felder liegen weiterhin flach auf `User`. Echte Migration der flachen Felder ins Company-Model steht noch aus.
- **`CommissionOverview`-Funktionsname** — Funktion heißt `CommissionsOverview`, Datei `CommissionOverview.tsx`. Egal (default export), aber inkonsistent.
- **ESLint `ignoreRestSiblings`** — in `validateSignup` wird `companyWebsite` per Rest-Destructure rausgefiltert → unused-var Warning. Optional die Regel `@typescript-eslint/no-unused-vars` mit `{ ignoreRestSiblings: true }` setzen.
- **QR bei Aktivierung** — QR-Code wird aktuell nur über die Admin-QR-Seite erzeugt. Sollte automatisch entstehen, wenn ein Fahrer per `setPassword` auf `ACTIVE` wechselt. (→ Epic „Rollen & Super-Admin")
- **Fahrer „Löschen" = Soft-Delete** — setzt `deletedAt` + `INACTIVE`, statt hart zu löschen. Grund: `Lead`/`Commission` referenzieren `User` (FK) → harte Löschung würde scheitern. Liste filtert `deletedAt: null`.
- **Dark Mode entfernen** — App soll nur Light-Mode sein. Dark-Mode-Handling/Klassen raus.
- **„Löschen" lässt Supabase-Auth-Account bestehen** — `deleteDriver` macht nur Soft-Delete in der DB. Der Supabase-Auth-User bleibt. Für echtes Löschen später auch den Supabase-Account löschen/deaktivieren (`admin.auth.admin.deleteUser`).

## ⚙️ Setup / Workflow-Hinweise

- **Prisma-Versionen koppeln** — `prisma` (CLI) und `@prisma/client` müssen dieselbe Major-Version haben, sonst bricht generate/migrate.
- **Nach `prisma generate`/`migrate dev` → `next dev` neu starten** — der Dev-Server hält den generierten Client im Speicher; sonst „Unknown argument"-Fehler trotz korrektem Schema.
- **`.env.local` + Prisma CLI** — Next lädt `.env.local` automatisch, die Prisma CLI nicht. `prisma.config.ts` lädt es jetzt explizit.
- **Mailtrap nur für Dev** — fängt alle Mails in einer Test-Inbox ab. Produktion braucht eine verifizierte Domain in Resend (echter Versand an beliebige Empfänger). (→ Epic „Produktiver E-Mail-Versand")
- **`onboarding@resend.dev`** — Resends Test-Absender sendet nur an die eigene Resend-Konto-Mail, nicht an beliebige Adressen.

## 💡 Kleine Code-Regeln (aus der Zusammenarbeit)

- JSX-Kommentare mit `{/* ... */}`, nicht `//`.
- `name`-Attribut bei Formfeldern = Vertrag mit der Server-Action (muss exakt zum `formData.get(...)`-Key passen).
- Routing-Entscheidungen (redirects) gehören in die Route (`page.tsx`), nicht in eine Leaf-Komponente.
- Dead Code löschen statt auskommentieren — Git merkt sich's.
- Nur an „working boundaries" committen, nie einen kaputten Zwischenstand.

## ❓ Offene Design-Fragen (für morgen)

- **Eigene Provision des Admins, wenn er auch als Fahrer agiert.**
  Kontext: Der Admin kann selbst als „Fahrer" arbeiten (eigener QR-Code → erzeugt eigene Leads/Provisionen). Aktuell zeigt das **Admin-Dashboard** die Provisionen **aggregiert über ALLE Fahrer** + eine Liste aller Provisionen pro Fahrer. Die eigenen Admin-Provisionen sind da zwar **mit drin** (er ist ja auch ein User mit `towTruckDriverId`), aber **nicht separat** sichtbar.
  Frage: Wie soll der Admin **seine eigene** Provisionsübersicht sehen?
  - Option A: eigener „Meine Provisionen"-Bereich für den Admin (wie beim Fahrer, gefiltert auf `towTruckDriverId = adminId`).
  - Option B: Toggle/Filter im Admin-Dashboard zwischen „Alle (Firma)" und „Nur meine".
  - Option C: in der Aggregat-Ansicht den Admin-Eintrag optisch hervorheben.
  → Entscheidung + Umsetzung offen.

## 🚀 Verbesserungs-Ideen Dashboards (Fahrer / Admin / Super-Admin)

Review-Ergebnis, nach Wichtigkeit sortiert. Für später.

### 🔴 Sicherheit / Korrektheit (zuerst)

- **Server-Actions gegen fremden Zugriff härten (IDOR).** `updateUserStatus`, `deleteDriver`, `generateQrCode`, `approveCommission`, `markCommissionAsPaid` prüfen nur „ist Admin?", nicht „gehört das Ziel zu *meiner* Firma?". Die Anzeige ist gefiltert, aber per selbstgebautem Request könnte ein Admin fremde Fahrer/Provisionen verändern. Fix: in jeder Action prüfen, dass das Ziel dieselbe `companyId` hat wie der Aufrufer.
- **`companyId`-Null-Fall absichern.** Hat ein Admin (Altbestand) keine `companyId`, matchen die neuen Filter `companyId: null` → er sähe alle firmenlosen Datensätze. Lieber „kein Treffer" erzwingen, wenn `companyId` fehlt.

### 🟠 Code-Gesundheit

- **Login-/Rollen-Check zentralisieren.** Das Muster `getClaims` → `findUnique` → Rolle prüfen steht kopiert in ~8 Dateien. In einen Helper ziehen, z.B. `requireUser(role)` in `lib/auth.ts`.
- **DB-Abfragen parallelisieren.** `AdminDashboard` macht 5 Abfragen nacheinander; mit `Promise.all([...])` laufen sie parallel → schneller. Gleiches im `SuperAdminDashboard`.
- **Rollen-Enum statt String-Unions.** `DashboardShell`/`AppSidebar` nutzen hartkodierte Strings (`"ADMIN" | ...`). Besser den `Role`-Enum verwenden (kein Vertippen).

### 🟡 UX / Funktion

- **Lösch-Bestätigung.** „Löschen" ist aktuell ein Klick = weg. Bestätigungs-Dialog ergänzen.
- **Lade-/Deaktiviert-Zustand bei Buttons** (`useFormStatus`) gegen Doppelklick / „passiert was?".
- **Paginierung** für Fahrer-, Leads- und Provisions-Listen (bei vielen Einträgen langsam/unübersichtlich).
- **`AuditLog` nutzen.** Model existiert, wird nicht beschrieben. Status-Änderungen/Freigaben/Löschungen protokollieren (wer, wann, wen).

### 🟢 Offene Produkt-Fragen

- **Abgelehnter Admin (`REJECTED`) ist final** — kein „doch freigeben"-Weg für den Super-Admin. Evtl. ergänzen.
- **Echtes Löschen** (Supabase-Account + Fahrer der Firma) statt nur Soft-Delete — gilt für Fahrer *und* jetzt auch Firmen-Admins (`deleteCompanyAdmin`).

## 🐞 Gefixte Bugs (Rollen-Session)

- **Bug 1 — Jeder Admin sah die Daten aller Firmen.**
  - *Kaputt:* Als Vogel-Abschlepper sah man auch Fahrer/Provisionen/Leads/QR-Codes von Aydas-Abschlepper. Jede Firma soll nur ihre eigenen Daten sehen.
  - *Ursache:* Die DB-Abfragen fragten nur „ist der User ein Admin?" und luden *alle* Fahrer — die zweite Frage „...gehört der Fahrer zu seiner Firma?" fehlte. (Türsteher prüft „bist du Mitarbeiter?", aber nicht „arbeitest du in *diesem* Büro?".)
  - *Wo & Fix:* Fünf Listen-Stellen — `users`, `qrcodes`, `commissions`, `leads`, Dashboard-Kacheln (`AdminDashboard`). Überall Filter „nur Datensätze mit meiner `companyId`" ergänzt.
- **Bug 2 — Neue Firmen wurden als „Fahrer" statt „Admin" angelegt.**
  - *Kaputt:* Bei der Registrierung eines Abschleppunternehmens bekam der User die Rolle `TOW_TRUCK_DRIVER`, obwohl er Firmen-Admin ist.
  - *Ursache:* Im Registrierungs-Code stand fest `role: TOW_TRUCK_DRIVER` (Überbleibsel vom alten Aufbau ohne Rollen-Hierarchie).
  - *Wo & Fix:* `app/actions/auth.ts`, `signup`-Funktion → `role: ADMIN` + `status: PENDING` (wartet auf Freigabe durch Super-Admin).

## 📌 Als Nächstes: WEBAPP-181 — Kurz-Link QR (wartet auf Mentor-Freigabe)

Ziel: Route `/r/[code]` leitet auf die Angebotsseite mit UTM-Parametern weiter (statt QR mit langer UTM-URL). Vorteile: kürzerer/sauberer Link, Ziel später änderbar ohne neuen QR, Scans optional zählbar. Dazu QR-Karte in der Sidebar (Mini-QR + Link).

Offene Entscheidung (Mentor muss absegnen) — Code im Link:
- **Echter Kurz-Code (empfohlen):** neues kurzes Feld am `User` (z.B. 6 Zeichen), Link wie `/r/ab3k9z`. Kurz/professionell, druck-/teilbar, interne ID verborgen. **Braucht Prisma-Migration** + Code-Generierung.
- **User-ID als Code (ohne Migration):** Route `/r/[userId]`, sofort fertig, kein DB-Change. Nachteil: langer/kryptischer Link, interne ID öffentlich.

Umsetzungs-Skizze (nach Freigabe von Variante 1):
1. Schema: `User.shortCode String? @unique` → `pnpm prisma migrate dev --name add_user_short_code` → Dev-Server neu starten.
2. `createQrCode` (`app/actions/auth.ts`): Code generieren (falls leer), `qrCode` = `${APP_URL}/r/${shortCode}` speichern.
3. Route `app/r/[code]/route.ts` (GET): User per `shortCode` finden → 302-Redirect auf `https://angebot.deinmotorschaden.de?utm_medium=${userId}&utm_source=${companyId}` (optional QRScan loggen).
4. QR-Karte in der Sidebar: `qrCode` an `AppSidebar` durchreichen (über `dashboard/layout.tsx` → `DashboardShell`), Mini-`QRCodeSVG` + Link anzeigen (Fahrer + Admin).
