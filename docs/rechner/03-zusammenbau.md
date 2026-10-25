# Rechner 4: Der Zusammenbau `Calculator.tsx` und `calculatorMain.tsx`

`Calculator` ist wie `Demo` in der App-Demo die **oberste Komponente**: Sie besitzt den Zustand und verbindet die Teile. Sie ist deutlich kürzer, weil das Rechnen in `model.ts` ausgelagert ist. Lies zuerst die Kapitel „Rechenmodell", „Regler und Tabelle" und „Diagramm".

## Aufbau

```
calculatorMain.tsx     findet <div id="go-one-calculator"> auf business.html und startet React
└── Calculator.tsx     besitzt den Zustand "inputs" und ruft calculate() auf
    ├── Controls       drei Regler und zwei Voreinstellungen
    ├── (Kacheln, Satz zur Finanzierung, Legende: direkt in Calculator)
    ├── Chart          Diagramm
    └── ResultTable    Tabelle zum Aufklappen

model.ts               die Rechnung: calculate(), Typen, Formatierung
```

**Der Datenfluss in einem Satz:** Ein Regler meldet eine Änderung nach oben, `Calculator` ändert `inputs`, ruft `calculate(inputs)` auf, und Kacheln, Diagramm und Tabelle werden mit den neuen Zahlen neu gezeichnet.

---

## Datei: `react/src/calculatorMain.tsx` (Einstieg)

```tsx
  1 | import { createRoot } from "react-dom/client";
  2 | import { Calculator } from "./calculator/Calculator";
  3 |
  4 | /* Mount the calculator into the placeholder on business.html; other pages have no container */
  5 | const container = document.getElementById("go-one-calculator");
  6 | if (container) {
  7 |     createRoot(container).render(<Calculator />);
  8 | }
```

- **Z. 1** Holt `createRoot` aus `react-dom/client`.
- **Z. 2** Holt die Komponente. Der Pfad `./calculator/Calculator` zeigt auf die Datei im Unterordner.
- **Z. 4** Kommentar: Nur `business.html` hat den Platzhalter.
- **Z. 5** Sucht das leere `<div>` auf der Seite. Das Ergebnis ist das Element oder `null`.
- **Z. 6** Läuft nur, wenn es gefunden wurde.
- **Z. 7** Startet React in diesem `<div>` und zeichnet den Rechner hinein. Der Hinweistext „The interactive calculator needs JavaScript." wird dabei ersetzt. Dasselbe Muster wie `main.tsx` der Demo, nur mit anderer ID und anderer Komponente.

---

## Datei: `react/src/calculator/Calculator.tsx`


## Zustand und Berechnung

```tsx
  1 | import { useMemo, useState } from "react";
  2 | import { Chart } from "./Chart";
  3 | import { Controls } from "./Controls";
  4 | import { ResultTable } from "./ResultTable";
  5 | import { calculate, defaultInputs, formatEuro, fundingTotal } from "./model";
  6 | import type { Inputs } from "./model";
  7 |
  8 | /* Interactive break-even calculator: three sliders change the pitch plan, results update at once */
  9 | export function Calculator() {
 10 |     const [inputs, setInputs] = useState<Inputs>(defaultInputs);
 11 |     const { years, summary } = useMemo(() => calculate(inputs), [inputs]);
 12 |
 13 |     const shortfall = summary.lowestCash < 0;
 14 |     const fundingText = shortfall
 15 |         ? `The two rounds (${formatEuro(fundingTotal)}) fall short: cash is ${formatEuro(summary.lowestCash)} at the end of ${summary.lowestCashYear}.`
 16 |         : `The two rounds (${formatEuro(fundingTotal)}) cover the losses. The lowest year-end cash is ${formatEuro(summary.lowestCash)} in ${summary.lowestCashYear}.`;
```

- **Z. 1** Zwei Werkzeuge: `useState` für den Zustand und `useMemo` für die gemerkte Berechnung (siehe Kapitel 0 der App-Demo).
- **Z. 2–4** Die drei Kindkomponenten.
- **Z. 5** Die Rechenfunktion, die Standardwerte, die Eurodarstellung und die Gesamtfinanzierung aus `model.ts`.
- **Z. 9** Die Komponente hat keine Props, weil sie die oberste ist.
- **Z. 10** **Ein** Zustand für alle drei Regler: ein Objekt `{ fee, volume, costs }`. Der Anfangswert ist `defaultInputs`, der Plan aus der Folie. Man könnte auch drei einzelne `useState` schreiben. Ein gemeinsames Objekt passt besser, weil die drei Werte zusammengehören und die Voreinstellungen sie **alle auf einmal** setzen.
- **Z. 11** Ruft die Rechnung auf und merkt sich das Ergebnis. `useMemo` rechnet nur dann neu, wenn sich `inputs` ändert. Die geschweiften Klammern links holen aus dem Ergebnisobjekt direkt die Teile `years` und `summary` heraus (Destructuring).
- **Z. 13** Gibt es eine Finanzierungslücke? Das ist ein **abgeleiteter Wert**, kein State, denn er lässt sich aus dem Ergebnis berechnen.
- **Z. 14–16** Der Satz unter den Kacheln. Ein Ternary wählt einen von zwei Texten, beide sind Template-Literale mit eingesetzten Werten (`formatEuro(...)`). Bei Lücke: „fall short … cash is −€… at the end of …". Sonst: „cover the losses … lowest year-end cash is …".

## Das JSX

```tsx
 18 |     return (
 19 |         <div className="calc-layout">
 20 |             <Controls
 21 |                 inputs={inputs}
 22 |                 onChange={(change) => setInputs((current) => ({ ...current, ...change }))}
 23 |                 onPreset={setInputs}
 24 |             />
 25 |
 26 |             <div className="calc-results">
 27 |                 <div className="calc-stats" role="status">
 28 |                     <div className="calc-stat">
 29 |                         <p className="calc-stat-label">Break-even</p>
 30 |                         <p className="calc-stat-value">
 31 |                             {summary.breakEvenYear !== null ? summary.breakEvenYear : "Not by 2023"}
 32 |                         </p>
 33 |                     </div>
 34 |                     <div className="calc-stat">
 35 |                         <p className="calc-stat-label">Gross profit 2023</p>
 36 |                         <p className="calc-stat-value">{formatEuro(summary.lastProfit)}</p>
 37 |                     </div>
 38 |                     <div className="calc-stat" data-state={shortfall ? "gap" : "ok"}>
 39 |                         <p className="calc-stat-label">Lowest year-end cash</p>
 40 |                         <p className="calc-stat-value">{formatEuro(summary.lowestCash)}</p>
 41 |                     </div>
 42 |                 </div>
 43 |
```

- **Z. 19** Das Wurzelelement. Das CSS legt Regler und Ergebnisse in zwei Spalten.
- **Z. 20–24** Die Regler bekommen den aktuellen Stand und zwei Funktionen.
- **Z. 22** **Die interessanteste Zeile.** Ein Regler meldet nur das Geänderte, zum Beispiel `{ fee: 0.012 }`. Hier wird daraus der neue Gesamtzustand: `{ ...current, ...change }` kopiert zuerst alle Felder des alten Zustands (`current`) und legt danach die neuen darüber. Spätere Werte überschreiben frühere, also gewinnt `change`. Das Ergebnis ist ein **neues** Objekt mit einer geänderten Zahl. Die runden Klammern um `{ ... }` nach `=>` sind nötig, damit JavaScript es als Objekt liest und nicht als Funktionskörper. `setInputs((current) => ...)` ist die Form mit Funktion, die den aktuellen Wert bekommt.
- **Z. 23** Eine Voreinstellung ersetzt alle drei Werte. Deshalb kann die Setter-Funktion **direkt** weitergegeben werden: Sie bekommt das ganze `Inputs`-Objekt und ersetzt den Zustand.
- **Z. 26** Die rechte Spalte.
- **Z. 27** Der Bereich mit den drei Kacheln. `role="status"` macht ihn zu einem Bereich, dessen Änderungen Screenreader ansagen. Ein Hinweis: Bei jedem Reglerschritt ändern sich die Zahlen, es gibt dann entsprechend viele Ansagen. Für eine Demo ist das in Ordnung, bei einer Produktivseite könnte man es dämpfen.
- **Z. 28–33** Die Kachel „Break-even".
- **Z. 31** Ein Ternary: Gibt es ein Break-even-Jahr, wird es angezeigt, sonst der Text „Not by 2023". Der Vergleich mit `null` ist genau, denn `breakEvenYear` ist entweder eine Jahreszahl oder `null`.
- **Z. 34–37** Die Kachel „Gross profit 2023". `formatEuro` macht daraus einen Text mit Eurozeichen und Tausenderpunkten.
- **Z. 38** Die dritte Kachel bekommt ein `data-state`-Attribut. Das CSS färbt sie bei „gap" orange.
- **Z. 40** Der niedrigste Kassenstand zum Jahresende.

```tsx
 44 |                 <p className="calc-verdict" data-state={shortfall ? "gap" : "ok"}>
 45 |                     {fundingText}
 46 |                 </p>
 47 |
 48 |                 <div className="calc-legend" aria-hidden="true">
 49 |                     <span>
 50 |                         <span className="calc-swatch calc-swatch-pos" /> Gross profit
 51 |                     </span>
 52 |                     <span>
 53 |                         <span className="calc-swatch calc-swatch-neg" /> Loss
 54 |                     </span>
 55 |                     <span>
 56 |                         <span className="calc-swatch calc-swatch-line" /> Cash incl. funding
 57 |                     </span>
 58 |                 </div>
 59 |
 60 |                 <Chart years={years} />
 61 |                 <ResultTable years={years} />
 62 |
 63 |                 <p className="calc-note">
 64 |                     Simplified model. Revenue follows the pitch plan (fee times rides). Costs are not stated in the
 65 |                     deck: they are estimated from the gross-profit chart on slide 13. Funding: €200,000 in Q3 2019
 66 |                     and €200,000 in Q2 2020. Cash is shown at year end, so lows within a year are not visible.
 67 |                 </p>
 68 |             </div>
 69 |         </div>
 70 |     );
 71 | }
```

- **Z. 44–46** Der Satz zur Finanzierung, mit demselben `data-state` für die Farbe des linken Balkens.
- **Z. 48** Die Legende des Diagramms. `aria-hidden="true"` versteckt sie vor Screenreadern, weil das Diagramm seine Werte schon im `aria-label` nennt und die Legende nur Farben erklärt, die dort keine Rolle spielen.
- **Z. 50** Ein kleines farbiges Quadrat und der Text. Die Klassen bestimmen die Farbe im CSS. Die Legende wiederholt sich dreimal für Gewinn, Verlust und Kasse.
- **Z. 60** Das Diagramm bekommt die fünf Jahresergebnisse.
- **Z. 61** Die Tabelle bekommt dieselben.
- **Z. 63–67** Der Hinweis zur Vereinfachung: Umsatz laut Plan, Kosten geschätzt, Finanzierung und Jahresende. Er ist Teil der Ehrlichkeit des Rechners.
- **Z. 68–71** Schließt die rechte Spalte, die äußere Spalte, `return` und Komponente.

## Der Weg einer Reglerbewegung (Beispiel: Fahrten auf 80 %)

1. Der Nutzer zieht den Regler. In `Controls` feuert `onChange` mit `event.target.value`, einem Text wie `"0.8"`.
2. `Controls` wandelt den Text mit `Number(...)` um und ruft `onChange({ volume: 0.8 })` auf.
3. In `Calculator` wird daraus `{ fee: 0.015, volume: 0.8, costs: 1 }` und mit `setInputs` gespeichert.
4. React zeichnet `Calculator` neu. `useMemo` bemerkt, dass sich `inputs` geändert hat, und ruft `calculate` mit den neuen Werten auf.
5. Die Kacheln zeigen jetzt Break-even 2023 und eine Finanzierungslücke, das Diagramm hat neue Balken, und der Regler selbst steht wegen `value={inputs.volume}` auf 80 %.

## Typische Fragen

- **Warum ein Zustandsobjekt statt drei einzelner Zustände?** Die Werte gehören zusammen, und die Voreinstellungen setzen alle gleichzeitig. Mit einem Objekt reicht ein einziger Aufruf, `onPreset={setInputs}`.
- **Was macht `{ ...current, ...change }`?** Es kopiert den alten Zustand und überschreibt ihn mit den neuen Werten. Man verändert nie ein Objekt im State direkt, sondern baut ein neues.
- **Warum `useMemo`, wenn die Rechnung so klein ist?** Sie wäre auch ohne schnell genug. Das Muster zeigt, wie man abgeleitete Werte von Eingaben abhängig macht, und es hält die Ergebnislisten stabil, solange sich nichts ändert.
- **Wo liegt die Fachlogik?** Nur in `model.ts`. Die Komponenten zeigen sie an. Dadurch könnte man die Rechnung ohne Oberfläche testen.
- **Was würde sich ändern, wenn die Rechnung auf einem Server liefe?** Man bräuchte Anfragen und Warten auf Antworten. Dann würde `useEffect` oder eine Datenbibliothek ins Spiel kommen. Hier ist alles lokal und sofort.

## Mach es selbst

1. Zeige unter den Kacheln zusätzlich den kumulierten Gewinn bis 2023 an (`years[years.length - 1].cumulative`). Welche Datei und welche Zeilen änderst du?
2. Ändere die Texte der Kacheln so, dass „Gross profit 2023" die Jahreszahl aus den Daten nimmt (`years[years.length - 1].year`).
3. Beschreibe in eigenen Worten, warum der Aufruf `setInputs(...)` auch dann neu zeichnet, wenn nur ein Feld geändert wurde.
4. Setze die Gebühr auf `0.010` und die Fahrten auf 100 %. Wann liegt der Break-even? Begründe es mit der Rechnung aus „Rechenmodell, Typische Fragen".
