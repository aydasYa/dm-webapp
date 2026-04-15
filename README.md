# (WebApp): Abschlepper - deinMotorschaden.de
## Was tut die WebApp?
- Abschläpper erhalten Aufträge und Provision durch die WebApp

- Die Nuzer sind die Abschläpper z.B. vom ADAC, ..., Private Abschläpper.

- Ziel der WebApp ist es, das zwischen dem Abschleppen bis zur Werkstatt wir eingeschaltet werden, indem der Kunde den QR Code scannt, somit dann sich eine Partnerwerkstatt in der Nähe aussuchen kann. Damit wird garantiert, sauber gearbeitet zu werden. Wir verdienen somit im gesamt prozess von crash bis reparatur mit. Sowie der Abschlepper, welcher dann eine Provision erhält.

## Was ist der Tech Stack?
Dies ermöglicht es später mit Vercel kombiniert zu arbeiten (soweit ich es verstanden habe fürs Hosten der WebApp)
- Next.js -> Front/Backend
- Prisma -> ORM - Datenbankzugriff via TS (TypeScript)
- Supabase (PostgresSQL) -> Datenbank hosting



## Das Datenbankschema
### Models
#### User
Repräsentiert einen registrierten Abschlepper oder Admin in der WebApp.
#### Workshop
Die Werkstatt welche der Kunde ausgesucht hat und er Abschläpper das Fahrzeug hin transportiert.
#### Lead
Alle Informationen über den Kunden und dessen Fahrzeug, welcher den Abschläpper bestellt hat.
#### QRScan
Enthält die Informationen wie UTM-Paramenterl wann erstellt- und gescannt, welcher Lead er angehört.
#### Commission
Alle Informationen bzgl. dem Status der Provisionsauszahlung, sowie an welchen Abschlepper dieser zukommen soll. Dazu noch die rückverfolgung des Abschlepp-Status, Währung und Zahlungsmethode.
#### AuditLog
Repräsentiert alle Infos über Änderungen an den Tables Daten. Wann in welcher Tabelle was verändert wurde. Ob "soft-delete" oder neuer Eintrag von Abschlepper welche manuell vom Admin freigeschaltet wurden.


### Enums
#### Role
Die `Role` Enum beschreibt welcher Typ der Nutzer ist (Admin oder Abschlepper). Es beschränkt den `role` Wert mit: `TOW_TRUCK_DRIVER` oder `ADMIN`. Ohne diesen Enum kann wer versehentlich auf `anderes mit viel power` setzen.

#### UserStatus
Beschreibt die einzigen Werte welche zulässig sind: `PENDING, ACTIVE, REJECTED`.

#### LeadStatus
Genau wie `UseStatus` beschreibt es die einzigen Werte welche zulässig sind für den `leadStatus`. Zum Beispiel welche Partner-Werkstatt vom Kunden für den Abschlepp- sowie Reparatur-Service ausgesucht wurde. Infos weiterhing für Reparatur-Status, Abgeschlossen, ... etc.

#### CommissionStatus
Die Werte welche hinterlegt werden dürfen für den Provisionsauszahlungs-Status.

## Setup
1. Repository Klonen (zugang nötig)
2. Node.js installieren https://nodejs.org/en/download
3. Im geklonten Projekt-Ordner npm/pnpm init -y ausführen
4. Supabase zugang zu der Datenbank erhalten
5. .env Datei einrichten mit den Links von Supabase
