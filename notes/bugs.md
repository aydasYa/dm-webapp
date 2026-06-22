# Gefixte Bugs (Log)

## Rollen- / UI-Session

- **Bug 1 — Jeder Admin sah die Daten aller Firmen.**
  - *Kaputt:* Als Vogel-Abschlepper sah man auch Fahrer/Provisionen/Leads/QR-Codes von Aydas-Abschlepper. Jede Firma soll nur ihre eigenen Daten sehen.
  - *Ursache:* Die DB-Abfragen fragten nur „ist der User ein Admin?" und luden *alle* Fahrer — die zweite Frage „...gehört der Fahrer zu seiner Firma?" fehlte. (Türsteher prüft „bist du Mitarbeiter?", aber nicht „arbeitest du in *diesem* Büro?".)
  - *Wo & Fix:* Fünf Listen-Stellen — `users`, `qrcodes`, `commissions`, `leads`, Dashboard-Kacheln (`AdminDashboard`). Überall Filter „nur Datensätze mit meiner `companyId`" ergänzt.
- **Bug 2 — Neue Firmen wurden als „Fahrer" statt „Admin" angelegt.**
  - *Kaputt:* Bei der Registrierung eines Abschleppunternehmens bekam der User die Rolle `TOW_TRUCK_DRIVER`, obwohl er Firmen-Admin ist.
  - *Ursache:* Im Registrierungs-Code stand fest `role: TOW_TRUCK_DRIVER` (Überbleibsel vom alten Aufbau ohne Rollen-Hierarchie).
  - *Wo & Fix:* `app/actions/auth.ts`, `signup`-Funktion → `role: ADMIN` + `status: PENDING` (wartet auf Freigabe durch Super-Admin).
