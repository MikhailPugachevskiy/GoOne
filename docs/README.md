# Dokumentation zum Lernen

Hier steht, wie der Code von Go One funktioniert, Zeile für Zeile erklärt. Die Erklärungen sind zum Lernen und für Vorstellungsgespräche gedacht. Sie sind nicht Teil der Website: Die Seiten laden diese Dateien nie.


## Die App-Demo (React und TypeScript)

Lies die Kapitel in dieser Reihenfolge:

| Kapitel | Inhalt | Dateien im Code |
| --- | --- | --- |
| [0. Grundlagen](react-demo/00-grundlagen.md) | React, JSX, TypeScript-Bausteine, Aufbau der Demo, Einstiegsdatei | `main.tsx` |
| [1. Die Daten](react-demo/01-daten.md) | Typen, Beispieldaten, Hilfsfunktionen | `data.ts` |
| [2. Kleine Komponenten](react-demo/02-kleine-komponenten.md) | Props, Listen mit `map`, Schalter-Buttons | `Stepper.tsx`, `FilterBar.tsx`, `BikeList.tsx` |
| [3. Die Karte](react-demo/03-karte.md) | SVG in React, Barrierefreiheit, Tastatur | `MapView.tsx` |
| [4. Bezahlen und Entsperren](react-demo/04-bezahlen-und-entsperren.md) | kontrollierte Formulare, Zufallsgenerator, Demo-QR-Code | `Payment.tsx`, `Unlock.tsx` |
| [5. Der Kern](react-demo/05-demo.md) | State, `useMemo`, `useEffect`, alle Klick-Funktionen | `Demo.tsx` |

## So sind die Kapitel aufgebaut

1. **Der Code** mit den Zeilennummern, wie er im Projekt steht.
2. **Zeile für Zeile**: Jeder Punkt beginnt mit der Zeilennummer (zum Beispiel „Z. 17") und erklärt, was die Zeile macht und warum.
3. **Typische Fragen**, wie sie in einem Vorstellungsgespräch kommen könnten, mit Antworten.
4. **Mach es selbst**: kleine Aufgaben, die du lokal ausprobieren kannst.

**Zu den Zeilennummern:** Sie stimmen für den Stand des Codes, als die Kapitel geschrieben wurden. Wenn du die Dateien später änderst, verschieben sie sich. Der Codeausschnitt steht aber immer direkt über den Erklärungen, damit man die Zuordnung auch dann findet.

## Geplant

Weitere Kapitel für die restlichen Teile des Projekts:

- Break-even-Rechner (React und TypeScript)
- TypeScript für Menü und Animationen (`nav.ts`, `motion.ts`)
- CSS (gemeinsame Bausteine, Grid und Flexbox, Media Queries)
- HTML-Struktur und Barrierefreiheit
- Build, `tsconfig.json`, `.gitignore` und Git
