# Demo-Logins

**Passwort für alle Accounts: `test1234`**
Angelegt per `pnpm tsx scripts/seed-demo.ts`. Bei jedem Lauf werden alle `@demo.de`-Daten neu erzeugt (IDs ändern sich dann).

## Super-Admin (DeinMotorschaden)
| Name | Login |
|---|---|
| Deniz Kaya | superadmin@demo.de |

## Abschlepp Berlin GmbH
| Rolle | Name | Login |
|---|---|---|
| Admin (Inhaber, auch Fahrer) | Markus Weber | admin.berlin@demo.de |
| Fahrer | Tom Schulz | fahrer1.berlin@demo.de |
| Fahrer | Jan Krüger | fahrer2.berlin@demo.de |
| Fahrer | Leon Hofmann | fahrer3.berlin@demo.de |
| Fahrer | Nico Braun | fahrer4.berlin@demo.de |

## Hanse Bergung Hamburg
| Rolle | Name | Login |
|---|---|---|
| Admin | Sabine Fischer | admin.hamburg@demo.de |
| Fahrer | Finn Meyer | fahrer1.hamburg@demo.de |
| Fahrer | Lars Wagner | fahrer2.hamburg@demo.de |
| Fahrer | Ole Schmidt | fahrer3.hamburg@demo.de |
| Fahrer | Pia Richter | fahrer4.hamburg@demo.de |

## Isar Pannenhilfe München
| Rolle | Name | Login |
|---|---|---|
| Admin | Mehmet Yıldız | admin.muenchen@demo.de |
| Fahrer | Emre Demir | fahrer1.mnchen@demo.de |
| Fahrer | Luca Bauer | fahrer2.mnchen@demo.de |
| Fahrer | Ben Wolf | fahrer3.mnchen@demo.de |
| Fahrer | Mia Neumann | fahrer4.mnchen@demo.de |

> Hinweis: Im München-Login fällt das „ü" weg → **`mnchen`** (so erzeugt das Seed-Skript die E-Mail aus dem Städtenamen).

## Sonder-Admins (für Freigabe-/Ablehnungs-Test, ohne Fahrer)
| Status | Firma | Name | Login |
|---|---|---|---|
| PENDING (wartet auf Freigabe) | Werkstatt Express Köln | Jonas Klein | admin.pending@demo.de |
| REJECTED (abgelehnt) | Abschlepp Süd Stuttgart | Carla Vogt | admin.rejected@demo.de |

## Demo-Leads
Aktuell hat nur **Abschlepp Berlin** Lead-Daten (`data/demo-leads.json`), aufgeteilt auf **Markus Weber** (Inhaber) und **Tom Schulz**. Andere Firmen/Fahrer zeigen leere Lead-Charts, bis sie Lead-Datensätze bekommen.
