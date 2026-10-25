# Rechner 2: Regler und Tabelle (`Controls.tsx` und `ResultTable.tsx`)

Beide Komponenten haben **keinen eigenen Zustand**. `Controls` zeigt die Regler und meldet Änderungen nach oben, `ResultTable` zeigt die Zahlen als Tabelle. Beide sind kleine, gut lesbare Komponenten. Das Neue gegenüber der App-Demo sind **Schieberegler** (`<input type="range">`), das Typ-Werkzeug `Partial<...>` und eine Tabelle, die für Screenreader sauber beschriftet ist.

---

## Datei: `react/src/calculator/Controls.tsx`

```tsx
  1 | import { cautiousInputs, defaultInputs } from "./model";
  2 | import type { Inputs } from "./model";
  3 |
  4 | interface ControlsProps {
  5 |     inputs: Inputs;
  6 |     onChange: (change: Partial<Inputs>) => void;
  7 |     onPreset: (inputs: Inputs) => void;
  8 | }
  9 |
 10 | /* Three sliders and two presets; every slider shows its current value next to the label */
 11 | export function Controls({ inputs, onChange, onPreset }: ControlsProps) {
 12 |     return (
```

- **Z. 1** Holt die zwei Voreinstellungen aus `model.ts`. Sie werden von den beiden Buttons unten benutzt.
- **Z. 2** Nur der Typ `Inputs`.
- **Z. 4–8** Die Props: der aktuelle Stand der Regler (`inputs`) und zwei Funktionen für Meldungen nach oben.
- **Z. 6** `Partial<Inputs>` ist ein eingebauter TypeScript-Typ: Er macht **alle Felder optional**. Man darf also nur `{ fee: 0.012 }` melden, ohne `volume` und `costs`. Die Funktion bekommt nur das Geänderte.
- **Z. 7** Eine Voreinstellung ersetzt dagegen alle drei Werte, deshalb der volle Typ `Inputs`.
- **Z. 10** Kommentar zur Aufgabe der Komponente.
- **Z. 11** Die Komponente mit den drei Props im Destructuring.

## Der erste Regler: Gebühr

```tsx
 13 |         <div className="calc-controls">
 14 |             <div className="calc-field">
 15 |                 <div className="calc-field-head">
 16 |                     <label htmlFor="calc-fee">Fee per ride from 2021</label>
 17 |                     <output htmlFor="calc-fee">€{inputs.fee.toFixed(4)}</output>
 18 |                 </div>
 19 |                 <input
 20 |                     id="calc-fee"
 21 |                     type="range"
 22 |                     min={0.005}
 23 |                     max={0.02}
 24 |                     step={0.0005}
 25 |                     value={inputs.fee}
 26 |                     onChange={(event) => onChange({ fee: Number(event.target.value) })}
 27 |                 />
 28 |                 <p className="calc-help">Pitch range: €0.010 to €0.015</p>
 29 |             </div>
```

- **Z. 13** Der äußere Kasten für alle Regler.
- **Z. 14** Ein Block pro Regler: Beschriftung, Regler und Hilfstext.
- **Z. 16** Die Beschriftung des Reglers. `htmlFor` ist die JSX-Schreibweise des HTML-Attributs `for` und verknüpft das Label mit dem Element, dessen `id` `calc-fee` heißt. Dadurch liest ein Screenreader den Text beim Regler vor, und ein Klick auf das Label fokussiert ihn.
- **Z. 17** `<output>` ist ein HTML-Element für das Ergebnis einer Berechnung oder Eingabe. Hier zeigt es den aktuellen Wert. `toFixed(4)` gibt vier Nachkommastellen: aus `0.015` wird `0.0150`. Das Eurozeichen steht als normaler Text davor, `{...}` setzt den Wert ein.
- **Z. 19–27** Der Schieberegler. `type="range"` macht daraus einen Regler. `min`, `max` und `step` sind Zahlen und stehen deshalb in geschweiften Klammern (nicht in Anführungszeichen, sonst wären es Texte).
- **Z. 22–24** Kleinster Wert 0,005 €, größter 0,02 €, in Schritten von 0,0005 €. Der Bereich der Folie (0,010 bis 0,015) liegt mittendrin, der Regler lässt aber bewusst mehr Spielraum.
- **Z. 25** Der Regler zeigt den Wert aus dem Zustand. Zusammen mit `onChange` ist das wieder eine **kontrollierte Eingabe**: Der Zustand ist die Wahrheit, nicht der Regler.
- **Z. 26** Bei jeder Bewegung meldet der Regler den neuen Wert. `event.target.value` ist **immer ein Text**, auch bei einem Zahlenregler. `Number(...)` wandelt ihn in eine Zahl um. Gemeldet wird nur `{ fee: ... }`, der Rest bleibt unverändert, dafür gibt es `Partial`.
- **Z. 28** Ein Hinweistext unter dem Regler.

## Die beiden anderen Regler

```tsx
 31 |             <div className="calc-field">
 32 |                 <div className="calc-field-head">
 33 |                     <label htmlFor="calc-volume">Rides with Go One vs. plan</label>
 34 |                     <output htmlFor="calc-volume">{Math.round(inputs.volume * 100)}%</output>
 35 |                 </div>
 36 |                 <input
 37 |                     id="calc-volume"
 38 |                     type="range"
 39 |                     min={0.4}
 40 |                     max={1.5}
 41 |                     step={0.05}
 42 |                     value={inputs.volume}
 43 |                     onChange={(event) => onChange({ volume: Number(event.target.value) })}
 44 |                 />
 45 |                 <p className="calc-help">100% is the ride volume in the pitch</p>
 46 |             </div>
 47 |
 48 |             <div className="calc-field">
 49 |                 <div className="calc-field-head">
 50 |                     <label htmlFor="calc-costs">Costs vs. plan</label>
 51 |                     <output htmlFor="calc-costs">{Math.round(inputs.costs * 100)}%</output>
 52 |                 </div>
 53 |                 <input
 54 |                     id="calc-costs"
 55 |                     type="range"
 56 |                     min={0.7}
 57 |                     max={1.3}
 58 |                     step={0.05}
 59 |                     value={inputs.costs}
 60 |                     onChange={(event) => onChange({ costs: Number(event.target.value) })}
 61 |                 />
 62 |                 <p className="calc-help">Estimated from the profit chart, see the note below</p>
 63 |             </div>
```

- **Z. 33** Der zweite Regler ist genauso gebaut. Er hat seine eigene `id`, `calc-volume`.
- **Z. 34** Der Faktor wird als Prozentwert angezeigt: 0,8 mal 100 ergibt 80. `Math.round` verhindert Anzeigen wie `80.00000000000001`, die bei Kommazahlen vorkommen können.
- **Z. 39–41** Von 40 % bis 150 % der geplanten Fahrten, in 5-Prozent-Schritten.
- **Z. 43** Meldet nur `volume`.
- **Z. 50–51** Der dritte Regler für die Kosten.
- **Z. 56–58** Von 70 % bis 130 % der geplanten Kosten.
- **Z. 60** Meldet nur `costs`.
- **Z. 62** Der Hilfstext erinnert daran, dass die Kosten geschätzt sind.

**Warum drei fast gleiche Blöcke?** Man könnte sie mit einer Liste und `map` erzeugen. Das wäre kürzer, aber schwerer zu lesen. Bei nur drei Reglern ist die Wiederholung vertretbar. Bei sieben oder mehr würde man sie auslagern.

## Die Voreinstellungen

```tsx
 65 |             <div className="calc-presets">
 66 |                 <button type="button" className="btn btn-ghost" onClick={() => onPreset(defaultInputs)}>
 67 |                     Pitch plan
 68 |                 </button>
 69 |                 <button type="button" className="btn btn-ghost" onClick={() => onPreset(cautiousInputs)}>
 70 |                     Cautious example
 71 |                 </button>
 72 |             </div>
 73 |         </div>
 74 |     );
 75 | }
```

- **Z. 65** Der Bereich mit den zwei Buttons.
- **Z. 66–68** „Pitch plan": ruft `onPreset` mit den Standardwerten auf. Die Klassen `btn` und `btn-ghost` kommen aus dem Stylesheet der Seite. Wieder wird die Funktion in eine Pfeilfunktion verpackt, weil ein Argument mitgegeben wird.
- **Z. 69–71** „Cautious example": dasselbe mit `cautiousInputs`.
- **Z. 72–75** Schließt Bereich, Kasten, `return` und Komponente.

## Typische Fragen

- **Warum ist `event.target.value` ein Text, obwohl es ein Zahlenregler ist?** In HTML sind alle Werte von Formularfeldern Texte. Deshalb muss man mit `Number(...)` umwandeln. Vergisst man das, würde `"0.015"` statt `0.015` gerechnet.
- **Was macht `Partial<Inputs>`?** Es macht aus allen Feldern des Typs optionale Felder. So kann eine Funktion nur den geänderten Teil melden.
- **Warum `htmlFor` und nicht `for`?** `for` ist in JavaScript ein Schlüsselwort (Schleife). React benennt das HTML-Attribut deshalb um, so wie `class` zu `className` wird.
- **Warum `<output>`?** Es ist das passende HTML-Element für einen berechneten Wert. Screenreader können es als solchen erkennen.

---

## Datei: `react/src/calculator/ResultTable.tsx`

```tsx
  1 | import { formatEuro } from "./model";
  2 | import type { YearResult } from "./model";
  3 |
  4 | interface ResultTableProps {
  5 |     years: YearResult[];
  6 | }
  7 |
  8 | /* The numbers behind the chart, also the text alternative for screen readers */
  9 | export function ResultTable({ years }: ResultTableProps) {
 10 |     return (
 11 |         <details className="calc-details">
 12 |             <summary>Show the numbers</summary>
 13 |             <div className="calc-table-wrap">
 14 |                 <table className="calc-table">
 15 |                     <caption className="demo-sr-only">Yearly results of the selected scenario</caption>
 16 |                     <thead>
 17 |                         <tr>
 18 |                             <th scope="col">Year</th>
 19 |                             <th scope="col">Revenue</th>
 20 |                             <th scope="col">Costs</th>
 21 |                             <th scope="col">Gross profit</th>
 22 |                             <th scope="col">Cash incl. funding</th>
 23 |                         </tr>
 24 |                     </thead>
 25 |                     <tbody>
 26 |                         {years.map((item) => (
 27 |                             <tr key={item.year}>
 28 |                                 <th scope="row">{item.year}</th>
 29 |                                 <td>{formatEuro(item.revenue)}</td>
 30 |                                 <td>{formatEuro(item.costs)}</td>
 31 |                                 <td>{formatEuro(item.profit)}</td>
 32 |                                 <td>{formatEuro(item.cash)}</td>
 33 |                             </tr>
 34 |                         ))}
 35 |                     </tbody>
 36 |                 </table>
 37 |             </div>
 38 |         </details>
 39 |     );
 40 | }
```

- **Z. 1–2** Die Formatierung für Eurobeträge und der Typ eines Jahresergebnisses.
- **Z. 4–6** Die einzige Prop: die Liste der fünf Jahresergebnisse.
- **Z. 8** Der Kommentar nennt zwei Aufgaben: die Zahlen hinter dem Diagramm und eine Textalternative für Screenreader, die ein SVG-Diagramm nicht „lesen" können.
- **Z. 9** Die Komponente mit einem Prop.
- **Z. 11** `<details>` ist ein **eingebautes aufklappbares Element**. Es braucht kein JavaScript und kein React-State: Der Browser merkt sich selbst, ob es offen ist. Das erste Kind `<summary>` ist die Zeile, auf die man klickt.
- **Z. 12** Der sichtbare Titel.
- **Z. 13** Ein Container, der bei schmalen Bildschirmen seitlich scrollen kann (im CSS: `overflow-x: auto`). So wird die Seite nicht breiter, wenn die Tabelle nicht passt.
- **Z. 15** Die Tabellenüberschrift, visuell versteckt, aber für Screenreader vorhanden. Die Klasse `demo-sr-only` ist im CSS der Business-Seite definiert, auch wenn der Name nach „Demo" klingt.
- **Z. 16–24** Der Tabellenkopf mit einer Zeile. `scope="col"` sagt, dass jede Kopfzelle eine Spalte beschreibt.
- **Z. 25** Der Tabellenkörper.
- **Z. 26** Eine Zeile pro Jahr. Die runde Klammer nach `=>` gibt das JSX direkt zurück.
- **Z. 27** Die Zeile mit eindeutiger Kennung, hier das Jahr.
- **Z. 28** Das Jahr ist eine Kopfzelle der **Zeile** (`scope="row"`). So liest ein Screenreader bei jedem Wert „2021, Revenue, €523,555".
- **Z. 29–32** Vier Zellen mit Umsatz, Kosten, Gewinn und Kasse, jeweils als Eurobetrag.
- **Z. 33–40** Schließt Zeile, `map`, Tabellenkörper, Tabelle, Container, `<details>`, `return` und Komponente.

## Typische Fragen

- **Warum eine Tabelle zusätzlich zum Diagramm?** Das Diagramm ist ein Bild für Sehende. Die Tabelle gibt dieselben Zahlen exakt wieder und ist per Tastatur und Screenreader zugänglich.
- **Wozu `scope`?** Es sagt, ob eine Kopfzelle eine Spalte oder eine Zeile beschreibt. Das ist Grundlage der Barrierefreiheit von Tabellen.
- **Warum `<details>` statt eines eigenen Auf- und Zuklappens mit State?** Das eingebaute Element kann es schon, mit Tastatursteuerung und ohne Code. Je weniger man selbst baut, desto weniger kann kaputtgehen.

## Mach es selbst

1. Ändere im Regler `calc-fee` den Höchstwert (`max`) auf `0.03`. Was verändert sich auf der Seite?
2. Füge einen vierten Regler „Funding" hinzu. Überlege zuerst, welche Dateien du dafür anfassen müsstest (`Inputs` in `model.ts`, `defaultInputs`, `calculate`, `Controls`).
3. Füge der Tabelle eine Spalte „Cumulative" hinzu. `YearResult` hat das Feld schon. Was musst du an `thead` und `tbody` ändern?
