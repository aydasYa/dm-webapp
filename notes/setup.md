# Setup & Workflow

- **Prisma-Versionen koppeln** — `prisma` (CLI) und `@prisma/client` müssen dieselbe Major-Version haben, sonst bricht generate/migrate.
- **Nach `prisma generate` / `migrate dev` → `next dev` neu starten** — der Dev-Server hält den generierten Client im Speicher; sonst „Unknown argument"-Fehler trotz korrektem Schema.
- **`.env.local` + Prisma CLI** — Next lädt `.env.local` automatisch, die Prisma CLI nicht. `prisma.config.ts` lädt es explizit. Standalone-Scripts (tsx) brauchen ein eigenes Env-Laden **vor** allen anderen Imports (siehe `scripts/load-env.ts`) — ES-Module-Imports werden hochgezogen.
- **Typecheck** — `pnpm exec tsc --noEmit` (kein npm-Script vorhanden). Exit 0 = sauber.
- **Super-Admin anlegen** — `pnpm tsx scripts/create-super-admin.ts` (braucht `SUPER_ADMIN_EMAIL` / `_PASSWORD` / `_FIRSTNAME` / `_LASTNAME` in `.env.local`).
- **Mailtrap nur für Dev** — fängt alle Mails in einer Test-Inbox ab. Produktion braucht eine verifizierte Domain (echter Versand an beliebige Empfänger).
- **`onboarding@resend.dev`** — Resends Test-Absender sendet nur an die eigene Resend-Konto-Mail, nicht an beliebige Adressen.
