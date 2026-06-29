# Salesforce-Lernplan (WEBAPP-47) — Daten-Fluss JSON → WebApp

## Kernidee (das eine Konzept)
Eine **Daten-Schicht** `getCommissions()` trennt die UI von der Datenquelle.
Heute: Prisma/DB → morgen: JSON-Datei → später: Salesforce-API.
**Die UI ändert sich nie** — nur die *Innereien* der Funktion.

Aktuell lesen 3 Stellen direkt aus Prisma:
- `app/dashboard/commissions/page.tsx`
- `components/CommissionOverview.tsx`
- `components/dashboard/AdminDashboard.tsx`
→ Ziel: alle nutzen `getCommissions()` statt direkt `prisma.commission.findMany(...)`.

## Phase 0 — Konzepte (je 1 Satz, nur verstehen)
- **Object** = Tabelle, **Record** = Zeile (z.B. `Provision__c`, custom-Felder enden auf `__c`).
- **SOQL** = Salesforce-SQL: `SELECT Amount__c FROM Provision__c WHERE ...`.
- **REST-Query** = SOQL per HTTP-GET → Salesforce antwortet mit JSON `{ "records": [...] }`.
- **OAuth Client-Credentials** = einfachster Server-Token (kein Login, keine Zertifikate). Für Next.js-Backend empfohlen (JWT-Bearer wäre komplexer).

## Phase 1 — JSON → WebApp (OHNE Salesforce) ← hier starten, hands-on
1. JSON im Repo — **haben wir**: `data/demo-commissions.json`.
2. `getCommissions()` in `lib/` schreiben: JSON lesen + auf App-Typ **mappen**.
3. Demo-Seite `/dashboard/sf-demo`: „Provision pro Monat, alle Fahrer von Aydas".
→ Danach verstehst du den ganzen Fluss (Quelle → mappen → anzeigen).

## Phase 2 — Salesforce echt (später, zusammen)
4. SOQL in der Developer Console testen (Feld-API-Namen prüfen).
5. **External Client App** (Client-Credentials) anlegen + Integration-User → Token per `curl`.
6. REST-Call per `curl` → echtes JSON ansehen.
7. In `getCommissions()` den Datei-Read durch `fetch()` ersetzen (Token holen → Query). UI bleibt gleich.

## Stolperfallen (für genau diese Aufgabe)
- **Domain:** Token über `login.salesforce.com`, danach die zurückgegebene `instance_url` für Queries nutzen (nicht hardcoden).
- **App-Setup:** Client-Credentials braucht einen zugewiesenen **Integration-User** + Scopes (`api`); ein paar Minuten warten nach dem Anlegen. (2026: neue „Connected Apps" eingeschränkt → **External Client Apps** nutzen.)
- **Felder/Version:** custom-Felder mit `__c`, API-Version `v67.0` im Pfad — sonst leere Ergebnisse / 404.

## JSON-Shape angleichen (kleiner Hinweis)
Damit es 1:1 zur UI passt, sollte ein Commission-Record haben: `id, amount, currency, status, createdAt` (statt `date`), `paidAt`, `driver{firstname,lastname}`, optional `lead{...}`.

## Ressourcen
- [Platform API Basics (Trailhead)](https://trailhead.salesforce.com/content/learn/modules/api_basics)
- [SOQL Queries (Trailhead)](https://trailhead.salesforce.com/content/learn/modules/soql-for-admins/get-started-with-soql-queries)
- [Execute a SOQL Query (REST Guide)](https://developer.salesforce.com/docs/atlas.en-us.api_rest.meta/api_rest/dome_query.htm)
- [OAuth Client-Credentials Flow (Help)](https://help.salesforce.com/s/articleView?id=xcloud.remoteaccess_oauth_client_credentials_flow.htm&language=en_US&type=5)
