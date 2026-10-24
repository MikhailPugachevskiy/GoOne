# 0. Grundlagen: React, TypeScript und der Aufbau der Demo

Diese Datei erklärt zuerst die Bausteine, die in allen Dateien der App-Demo vorkommen. Danach wird die Einstiegsdatei `main.tsx` Zeile für Zeile erklärt. Die weiteren Dateien folgen in den nächsten Kapiteln.

**So liest du die Kapitel:** Über jeder Erklärung steht der echte Code mit seinen Zeilennummern, so wie er im Projekt steht. Die Nummern gelten für den Stand dieses Commits. Wenn du den Code später änderst, können sie abweichen. Der Codeausschnitt steht aber immer direkt dabei, damit du die Zuordnung nicht verlierst.

---

## 1. Was ist React?

React ist eine JavaScript-Bibliothek, mit der man Oberflächen aus **Komponenten** baut. Eine Komponente ist eine ganz normale Funktion, die beschreibt, wie ein Teil der Seite aussieht. Beispiele aus der Demo: `Stepper` (die fünf Schritte), `MapView` (die Karte), `Payment` (die Bezahlansicht).

Drei Ideen genügen, um den ganzen Code zu verstehen:

1. **Eine Komponente gibt JSX zurück.** JSX sieht aus wie HTML, steht aber mitten im JavaScript. Es beschreibt, was auf der Seite stehen soll.
2. **Daten fließen nach unten (Props), Ereignisse nach oben (Funktionen).** Eine Elternkomponente gibt Daten an ihre Kinder weiter. Wenn der Nutzer klickt, ruft das Kind eine Funktion auf, die ihm das Elternteil mitgegeben hat.
3. **Wenn sich der Zustand ändert, zeichnet React neu.** Zustand (State) ist das Gedächtnis einer Komponente. Ändert er sich, ruft React die Komponentenfunktion erneut auf, bekommt neues JSX und aktualisiert nur die Teile der Seite, die sich wirklich geändert haben.

## 2. JSX ist nicht HTML

| In HTML | In JSX | Warum |
| --- | --- | --- |
| `class="..."` | `className="..."` | `class` ist in JavaScript ein reserviertes Wort |
| `tabindex`, `onclick` | `tabIndex`, `onClick` | Attribute werden in camelCase geschrieben |
| `stroke-width` (SVG) | `strokeWidth` | gleiche Regel |
| `style="color: red"` | `style={{ color: "red" }}` | `style` ist ein Objekt, kein Text |
| `<br>`, `<circle>` ohne Ende | `<br />`, `<circle ... />` | jedes Element muss geschlossen werden |
| ein Text mit Wert | `{wert}` | in geschweiften Klammern steht ein JavaScript-Ausdruck |

Ein Ausdruck in `{ }` kann eine Variable, ein Funktionsaufruf, ein Ternary (`a ? b : c`) oder `&&` sein. Eine Anweisung wie `if` oder `for` geht dort nicht.

Eine Komponente darf nur **ein** Wurzelelement zurückgeben. Wenn man mehrere Geschwister braucht, ohne ein zusätzliches `<div>` einzufügen, verwendet man ein **Fragment**: `<> ... </>`.

## 3. Die React-Werkzeuge, die hier vorkommen

| Werkzeug | Wofür | Wo in der Demo |
| --- | --- | --- |
| **Props** | Daten und Funktionen von oben nach unten | alle Komponenten außer `Demo` |
| **`useState`** | merkt sich einen Wert zwischen den Zeichnungen | `Demo.tsx` (sechs Zustände) |
| **`useMemo`** | berechnet etwas nur neu, wenn sich bestimmte Eingaben ändern | `Demo.tsx`, `Unlock.tsx` |
| **`useEffect`** | führt etwas „außerhalb des Zeichnens" aus (hier: einen Timer) | `Demo.tsx` (Bezahlvorgang) |
| **`key`** | gibt Listenelementen eine feste Identität | überall bei `.map(...)` |
| **kontrollierte Eingabe** | der Wert eines Feldes kommt aus dem State | Radiobuttons in `Payment.tsx` |
| **bedingtes Zeichnen** | `a && <X />` oder `a ? <X /> : <Y />` | `Demo.tsx`, `MapView.tsx` |

## 4. Die TypeScript-Bausteine, die hier vorkommen

TypeScript ist JavaScript mit **Typen**. Typen werden nur vom Editor und vom Compiler geprüft und beim Bauen wieder entfernt. Im Browser läuft reines JavaScript.

| Schreibweise | Bedeutung | Beispiel aus dem Projekt |
| --- | --- | --- |
| `type X = "a" \| "b"` | **Union aus festen Texten**: nur diese Werte sind erlaubt | `ProviderId` |
| `interface X { ... }` | beschreibt die Form eines Objekts | `Provider`, `Bike`, alle `...Props` |
| `string \| null` | entweder ein Text oder nichts | `selectedId` |
| `Bike[]` oder `Array<Bike>` | Liste von Bikes | `bikes` |
| `Set<string>` | Sammlung ohne Doppelte, mit schneller Suche (`.has`) | `cheapestIds` |
| `(id: string) => void` | Funktionstyp: nimmt einen Text, gibt nichts zurück | `onSelect` |
| `useState<ProviderId[]>([])` | die spitzen Klammern legen den Typ des Zustands fest | `Demo.tsx` |
| `import type { X }` | importiert nur einen Typ, verschwindet beim Bauen | fast jede Datei |
| `x ?? y` | „wenn `x` nichts ist (null oder undefined), nimm `y`" | `Demo.tsx` |
| `{ a, b }` im Parameter | **Destructuring**: nimmt Felder aus einem Objekt heraus | alle Komponenten |
| `[...liste]` | **Spread**: kopiert eine Liste | `Demo.tsx` |

## 5. Aufbau der Demo

```
main.tsx            findet <div id="go-one-demo"> auf der Seite und startet React dort
└── Demo.tsx        "Chef": besitzt den gesamten Zustand und alle Berechnungen
    ├── Stepper     die fünf Schritte (links)
    ├── FilterBar   Filter-Chips
    ├── MapView     Karte mit den Rädern
    ├── BikeList    die fünf besten Treffer als Liste
    ├── Payment     Schritt 4: Bezahlen
    └── Unlock      Schritt 5: QR-Code und Schloss-Code

data.ts             Beispieldaten: Anbieter, Räder, Schritte, Hilfsfunktionen
```

**Das wichtigste Prinzip:** Der Zustand liegt an **einer** Stelle, in `Demo`. Die Kinder bekommen nur, was sie anzeigen sollen (Props), und Funktionen, mit denen sie etwas melden können. Man nennt das „State nach oben ziehen" (*lifting state up*). Dadurch gibt es nie zwei Stellen, die sich widersprechen.

**Beispiel für den Weg eines Klicks:** Nutzer klickt auf ein Rad auf der Karte → `MapView` ruft `onSelect(bike.id)` auf → das ist in Wahrheit `selectBike` aus `Demo` → `Demo` setzt `selectedId` und `step` → React ruft `Demo` neu auf → `BikeList` hebt die Zeile hervor, der Stepper springt auf „Choose" und der Button „Continue to payment" erscheint.

---

## Datei: `react/src/main.tsx` (Einstieg)

```tsx
  1 | import { createRoot } from "react-dom/client";
  2 | import { Demo } from "./Demo";
  3 |
  4 | /* Mount the demo into the placeholder on product.html; other pages simply have no container */
  5 | const container = document.getElementById("go-one-demo");
  6 | if (container) {
  7 |     createRoot(container).render(<Demo />);
  8 | }
```

- **Z. 1** Importiert die Funktion `createRoot` aus dem Paket `react-dom/client`. `react-dom` verbindet React mit dem Browser. Die geschweiften Klammern holen genau diese eine Funktion aus dem Paket.
- **Z. 2** Importiert die Komponente `Demo` aus der Datei `Demo.tsx` im selben Ordner. Die Endung `.tsx` schreibt man beim Import nicht dazu.
- **Z. 4** Ein Kommentar. Er erklärt, warum die Prüfung weiter unten nötig ist.
- **Z. 5** Sucht auf der Seite das Element mit der ID `go-one-demo`. Das ist das leere `<div>` in `product.html`. Das Ergebnis ist das Element oder `null`, wenn es nicht existiert.
- **Z. 6** Läuft nur weiter, wenn das Element gefunden wurde. Dieselbe Datei wird nur auf `product.html` geladen, aber die Prüfung schützt auch dann, wenn die ID mal fehlt. TypeScript verlangt sie sogar, weil das Ergebnis von `getElementById` `null` sein kann.
- **Z. 7** Erstellt einen React-„Wurzelpunkt" in diesem `<div>`. `.render(<Demo />)` zeichnet die Komponente `Demo` dort hinein. `<Demo />` ist die JSX-Schreibweise, eine Komponente zu verwenden. Der Hinweistext „The interactive demo needs JavaScript." im `<div>` wird dabei ersetzt.
- **Z. 8** Schließt die `if`-Anweisung.

**Typische Fragen**
- *Warum läuft die Demo ohne Server?* Beim Bauen (`npm run build`) fasst esbuild alle Dateien zu einer einzigen JavaScript-Datei zusammen (`ts/product-demo.js`). Die Seite lädt sie mit einem normalen `<script>`-Tag.
- *Was ist der Unterschied zwischen `Demo` und `<Demo />`?* `Demo` ist die Funktion selbst. `<Demo />` ist die Anweisung an React, die Funktion aufzurufen und das Ergebnis zu zeichnen.
- *Warum steht in `main.tsx` kein `import React from "react"`?* esbuild ist mit `jsx: "automatic"` konfiguriert (siehe `build.mjs`). Der Import wird dabei automatisch ergänzt.
