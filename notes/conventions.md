# Code-Regeln & Konventionen

- **Sprache:** Code (Kommentare + Bezeichner) auf **Englisch**, nur user-sichtbare Texte/Labels auf **Deutsch** (App-Sprache).
- JSX-Kommentare mit `{/* ... */}`, nicht `//`.
- `name`-Attribut bei Formfeldern = Vertrag mit der Server-Action bzw. URL-`searchParams` (muss exakt zum Key passen).
- Routing-Entscheidungen (redirects) gehören in die Route (`page.tsx`), nicht in eine Leaf-Komponente.
- Dead Code löschen statt auskommentieren — Git merkt sich's.
- Nur an „working boundaries" committen, nie einen kaputten Zwischenstand. Pro Thema ein Commit.
- Server Actions sind öffentliche Endpunkte → immer Auth **und** Berechtigung prüfen.
- `const` ist block-scoped und nicht hoisted → erst deklarieren, dann benutzen („temporal dead zone").
