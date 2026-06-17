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
