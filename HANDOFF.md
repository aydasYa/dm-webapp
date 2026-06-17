# 🧭 Projekt-Übergabe / Kontext (für neuen Chat)

> Vollständiger Kontext der bisherigen Session. Im neuen Chat **zuerst diese Datei + `NOTES.md` lesen**.
> **Nächstes großes Thema: UI/UX-Überarbeitung** (Details kommen vom User). Dark Mode soll raus.

---

## 1. Projekt
**DeinMotorschaden WebApp** — Plattform für ein Abschlepper-Netzwerk. Multi-Tenant: jedes **Abschleppunternehmen** hat einen **Admin**, der **Fahrer** einlädt. Fahrer haben persönliche **QR-Codes** (UTM-Parameter → Lead-Tracking auf der Angebotsseite) und verdienen **Provisionen** (Staffel-Logik).

**Tech-Stack:** Next.js 16 (App Router — **modifiziert!** Docs in `node_modules/next/dist/docs/` lesen bevor man Next-Code schreibt), Prisma 7 + PostgreSQL (Supabase), Supabase Auth, Resend/Mailtrap (E-Mail), shadcn/Radix UI + Tailwind. **Package-Manager: `pnpm`.**

## 2. Rollen & Datenmodell
- **Hierarchie (geplant):** `SUPER_ADMIN` (DeinMotorschaden — *noch nicht gebaut*) → `ADMIN` (Firma) → `TOW_TRUCK_DRIVER` (Fahrer).
- `Company`-Model existiert (`id`, `name`) + `User.companyId`. **Aber:** alte `companyXyz`-Felder liegen weiterhin flach auf `User` (Doppelung).
- Fahrer **erben** die Firma des Admins beim Einladen.
- `UserStatus`: `PENDING` (eingeladen/wartend), `ACTIVE`, `INACTIVE` (gesperrt/pausiert), `REJECTED`.
- Admin kann auch selbst als „Fahrer" agieren (eigener QR) → siehe offene Design-Frage in NOTES.md.

## 3. Was diese Session gebaut wurde (alles auf `main`)
- **Registrierungsformular:** Ansprechpartner-Felder aus „Firma" raus, `companyWebsite` rein.
- **Setup-Fixes:** pnpm, Prisma-Version gekoppelt, `prisma.config.ts` lädt `.env.local`.
- **WEBAPP-132 Dashboard-Aufteilung:** Admin/Driver-Split (thin chooser `page.tsx`), `CommissionOverview` extrahiert (DRY), Fahrer landet auf Provisionsübersicht, 3 Tabs, Sidebar „Fahrer".
- **WEBAPP-138 QR + Company:** `Company`-Model + Migration + Backfill. QR-Schema: `?utm_medium={userId}&utm_source={companyId}` (fahrerId / firmenId).
- **WEBAPP-135 Magic-Link:** Admin lädt Fahrer ein (`inviteUserByEmail`), `/auth/set-password`-Seite, Fahrer erbt Firma. Status `PENDING` → `ACTIVE` beim Passwort-Setzen. Läuft **via Mailtrap (Dev)**. Echter Domain-Versand = **Blocker**.
- **WEBAPP-164 (Epic 3) Fahrer-Verwaltung & Dashboard-UI:** Listenansicht statt Tabs, klickbare Karte → Detail-Popup, QR im Popup, Status-Badge, **Sperren/Löschen (Soft-Delete)/Reaktivieren**, Leads raus (Admin+Fahrer), Admin-Übersicht zeigt Provision, Admin eigener QR.
- **Zugriffsschutz:** `INACTIVE`/`deletedAt` → ausgeloggt → `/blocked` (gelöscht vs. deaktiviert = unterschiedliche Meldung via `?reason=`). Fahrer-Selbst-Pause (`pauseSelf`).

## 4. Git-Stand
- Branch **`dashboard-split`** = `main` (fast-forward gemerged). `main` zuletzt @ **`a8ce7b9`**, gepusht.
- Remote: `github.com/aydasYa/dm-webapp`. **Solo-Dev → direkter Merge, kein PR.**

## 5. Config / Gotchas
- `.env.local`: `DATABASE_URL`, `DIRECT_URL`, `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_SECRET_KEY`, `NEXT_PUBLIC_APP_URL`, `RESEND_API_KEY`.
- **Nach `prisma generate`/`migrate dev` → `pnpm dev` neu starten** (sonst stale Client).
- **Supabase SMTP = aktuell Mailtrap-Sandbox** (Dev, fängt alle Mails ab). Echte Domain in Resend verifizieren = offen (Blocker, DNS-Inhaber).
- **Admin anlegen geht nur manuell in der DB** (kein App-Weg) → Epic 2.

## 6. Offene Arbeit (Roadmap)
- **Phase 2 — WEBAPP-48 E-Mail-System:** 147 `sendEmail` (`lib/email.ts`), 75 Auszahlungs-Mail, 76 Werkstatt-Mail, 40 Bestätigungs-Mail.
- **Phase 3 — Epic 2 Rollen & Super-Admin:** `SUPER_ADMIN`-Rolle, Super-Admin-Dashboard, Admin-Bootstrap, `signup` → `ADMIN`/`PENDING`, Status-Modell `INACTIVE`/„Deaktiviert", QR-Auto-Generierung.
- **Phase 4 — Integrationen:** WEBAPP-47 Salesforce, 130 Lead-Management, 46 Auszahlungsworkflow.
- **Blocker — Epic 1:** Domain verifizieren (DNS) → SMTP von Mailtrap auf echte Domain.
- **Tech-Debt & Design-Fragen:** siehe `NOTES.md`.

## 7. Jira
- Cloud `dmsbielefeld.atlassian.net`, Projekt-Key **`WEBAPP`** (Cloud-ID `5419d2dd-ed41-40d6-8e3c-3ac24fc99ea3`).
- Epic 3 = **WEBAPP-164** (Tasks 165–172) — von mir angelegt, alle Yasin zugewiesen. **Noch nicht auf „Done" gesetzt.**
- Epics 1 (Produktiver E-Mail-Versand, ~WEBAPP-150) & 2 (Rollen & Super-Admin) vom User manuell angelegt.
- Hinweis: verbundener Atlassian-Account = **Rahmi Kaya**, nicht Yasin.

## 8. Arbeitsweise mit dem User (wichtig!)
- **Mentor/Senior-Dev-Modus:** anleiten + passende Docs nennen + lehren. **Der User tippt selbst** — NUR direkt umsetzen, wenn er „mach das für mich" sagt.
- **ADHD:** kleine Häppchen, ein Schritt nach dem anderen, **kompakt**.
- **Jeder Schritt mit Kopf:** `📍 Phase X · Epic <KEY> · Ticket <KEY> — Titel` + Fortschrittszeile.
- **Jira = Quelle der Wahrheit** — vor Start jeden Task bestätigen.
- **Mini-Hinweise / Tech-Debt immer in `NOTES.md`** eintragen (nicht nur im Chat sagen).

## 9. Nächstes Thema: UI/UX-Update
Im neuen Chat startet die **UI/UX-Überarbeitung** (Konkretes kommt vom User). Bekannt: **Dark Mode entfernen** (NOTES.md).
