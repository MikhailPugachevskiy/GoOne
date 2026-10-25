# Rechner 3: Das Diagramm `Chart.tsx`

Das Diagramm ist **von Hand gezeichnet**: ein SVG, dessen Balken, Linien und Beschriftungen aus den Zahlen berechnet werden. Es gibt keine Diagramm-Bibliothek. Das ist die schwierigste Datei des Rechners, weil hier Mathematik dazukommt: Man muss Geldbeträge in Bildschirmkoordinaten umrechnen.

**Vorbereitung:** Lies die SVG-Grundlagen am Anfang von Kapitel 3 der App-Demo („Die Karte"). Wichtig: Bei SVG zählt `y` von **oben nach unten**. Ein größerer Geldbetrag muss deshalb einen **kleineren** `y`-Wert bekommen.

## Die Grundidee in drei Sätzen

1. Aus allen Zahlen wird ein sinnvoller Bereich für die senkrechte Achse bestimmt (zum Beispiel −500.000 bis 1.000.000).
2. Zwei kleine Umrechnungsfunktionen verwandeln einen Betrag in eine `y`-Koordinate (`yOf`) und eine Jahres-Nummer in eine `x`-Koordinate (`xCenter`).
3. Mit diesen Koordinaten zeichnen Schleifen die Gitterlinien, die Balken, die Linie und die Jahreszahlen.

## Rechenbeispiel mit den Standardwerten

| Größe | Wert | Rechnung |
| --- | --- | --- |
| kleinster Wert (`low`) | −275.491 | niedrigster Gewinn (2020) |
| größter Wert (`high`) | 845.306 | höchste Kasse (2023) |
| Schrittweite (`step`) | 500.000 | siehe `niceStep` unten |
| Achse von / bis | −500.000 / 1.000.000 | abgerundet bzw. aufgerundet auf Vielfache von 500.000 |
| Zeichenhöhe (`plotHeight`) | 256 | 300 − 14 (oben) − 30 (unten) |
| `yOf(0)` | etwa 184,7 | 14 + (1.000.000 − 0) / 1.500.000 × 256 |
| Breite pro Jahr (`band`) | 83,2 | (480 − 52 − 12) / 5 |
| `xCenter(0)` | 93,6 | 52 + 0 × 83,2 + 83,2 / 2 |

---


## Imports, Props und Maße

```tsx
  1 | import { formatEuro, formatThousands } from "./model";
  2 | import type { YearResult } from "./model";
  3 |
  4 | interface ChartProps {
  5 |     years: YearResult[];
  6 | }
  7 |
  8 | const WIDTH = 480;
  9 | const HEIGHT = 300;
 10 | const MARGIN = { top: 14, right: 12, bottom: 30, left: 52 };
 11 |
 12 | /* Picks a round tick step (1, 2, 5 times a power of ten) so the axis has about five labels */
 13 | function niceStep(range: number): number {
 14 |     const raw = range / 5;
 15 |     const magnitude = Math.pow(10, Math.floor(Math.log10(raw)));
 16 |     const normalized = raw / magnitude;
 17 |     const factor = normalized <= 1 ? 1 : normalized <= 2 ? 2 : normalized <= 5 ? 5 : 10;
 18 |     return factor * magnitude;
 19 | }
```

- **Z. 1–2** `formatEuro` wird für den Alternativtext gebraucht, `formatThousands` für die Achsenbeschriftung.
- **Z. 4–6** Das Diagramm bekommt nur die Liste der Jahresergebnisse. Es rechnet selbst nichts Fachliches, es **zeichnet** nur.
- **Z. 8–9** Breite und Höhe des SVG-Koordinatensystems. Weil das SVG später skaliert wird, sind das keine Pixel auf dem Bildschirm, sondern ein internes Maß.
- **Z. 10** Die Ränder: Oben 14 und unten 30 (Platz für die Jahreszahlen), links 52 (Platz für die Beträge) und rechts 12.
- **Z. 12** Der Kommentar beschreibt `niceStep`: Es wählt eine „runde" Schrittweite für die Achse, nämlich 1, 2 oder 5 mal eine Zehnerpotenz, sodass etwa fünf Beschriftungen entstehen.
- **Z. 13** Bekommt die Spannweite der Daten und gibt eine Schrittweite zurück.
- **Z. 14** Die rohe Schrittweite, wenn man fünf Abschnitte haben will. Beispiel: 1.120.797 / 5 = 224.159.
- **Z. 15** Die passende Zehnerpotenz: `Math.log10(224159)` ist etwa 5,35, `Math.floor` rundet auf 5, und `Math.pow(10, 5)` ist 100.000.
- **Z. 16** Die rohe Schrittweite in dieser Einheit: 224.159 / 100.000 = 2,24.
- **Z. 17** Ein verschachtelter Ternary wählt den nächsten „runden" Faktor: bis 1 wird es 1, bis 2 wird es 2, bis 5 wird es 5, sonst 10. Für 2,24 ergibt das 5.
- **Z. 18** 5 mal 100.000 = 500.000. Die Achse bekommt also Linien alle 500.000 €.

## Die Achse berechnen

```tsx
 21 | /* Bars: gross profit per year. Line: cash position at year end, including both funding rounds */
 22 | export function Chart({ years }: ChartProps) {
 23 |     const values = years.flatMap((item) => [item.profit, item.cash]);
 24 |     const low = Math.min(0, ...values);
 25 |     const high = Math.max(0, ...values);
 26 |     const step = niceStep(high - low);
 27 |     const axisMin = Math.floor(low / step) * step;
 28 |     const axisMax = Math.ceil(high / step) * step;
 29 |
 30 |     const ticks: number[] = [];
 31 |     for (let tick = axisMin; tick <= axisMax + step / 2; tick += step) {
 32 |         ticks.push(tick);
 33 |     }
```

- **Z. 22** Die Komponente.
- **Z. 23** `flatMap` macht aus jedem Jahr eine kleine Liste (`[gewinn, kasse]`) und **glättet** alles zu einer einzigen Liste mit zehn Zahlen.
- **Z. 24–25** Der kleinste und der größte Wert. Die `0` steht mit in der Liste, damit die Null-Linie immer sichtbar ist. Die drei Punkte (Spread) verteilen die Liste als einzelne Argumente.
- **Z. 26** Die Schrittweite für die Spannweite der Daten.
- **Z. 27–28** Die Achse beginnt beim nächsten Vielfachen der Schrittweite **unterhalb** des kleinsten Wertes (`Math.floor`) und endet beim nächsten **oberhalb** des größten (`Math.ceil`). Beispiel: −275.491 wird zu −500.000, 845.306 wird zu 1.000.000.
- **Z. 30–33** Die Liste der Beschriftungen auf der Achse.
- **Z. 31** Eine Schleife von der untersten zur obersten Beschriftung in Schritten von `step`. Das `+ step / 2` im Abbruch ist eine Sicherheit: Bei Kommazahlen kann sich der letzte Wert durch Rundung minimal verschieben, und die Schleife würde sonst die oberste Linie verpassen.
- **Z. 32** Fügt den Wert der Liste hinzu. Ergebnis hier: −500.000, 0, 500.000, 1.000.000.

## Die Umrechnung in Koordinaten

```tsx
 35 |     const plotWidth = WIDTH - MARGIN.left - MARGIN.right;
 36 |     const plotHeight = HEIGHT - MARGIN.top - MARGIN.bottom;
 37 |     const band = plotWidth / years.length;
 38 |     const barWidth = band * 0.5;
 39 |
 40 |     const yOf = (value: number): number =>
 41 |         MARGIN.top + ((axisMax - value) / (axisMax - axisMin)) * plotHeight;
 42 |     const xCenter = (index: number): number => MARGIN.left + band * index + band / 2;
 43 |
 44 |     const linePoints = years.map((item, index) => `${xCenter(index)},${yOf(item.cash)}`).join(" ");
 45 |     const summary = years
 46 |         .map((item) => `${item.year}: gross profit ${formatEuro(item.profit)}, cash ${formatEuro(item.cash)}`)
 47 |         .join("; ");
```

- **Z. 35** Die nutzbare Breite innerhalb der Ränder: 480 − 52 − 12 = 416.
- **Z. 36** Die nutzbare Höhe: 300 − 14 − 30 = 256.
- **Z. 37** Jedes der fünf Jahre bekommt einen gleich breiten Streifen: 416 / 5 = 83,2.
- **Z. 38** Ein Balken ist halb so breit wie sein Streifen, damit zwischen den Balken Platz bleibt.
- **Z. 40–41** **Die wichtigste Zeile der Datei.** Sie rechnet einen Geldbetrag in eine `y`-Koordinate um. `(axisMax - value) / (axisMax - axisMin)` ist der Anteil „wie weit unterhalb der Obergrenze liegt der Wert", ein Wert zwischen 0 (ganz oben) und 1 (ganz unten). Mit `* plotHeight` wird er in Zeichenhöhe umgerechnet, und `MARGIN.top +` verschiebt ihn unter den oberen Rand. Die Reihenfolge `axisMax - value` sorgt dafür, dass **große Werte oben** landen, weil `y` nach unten wächst.
- **Z. 42** Die Mitte des Streifens für das Jahr mit dem gegebenen `index`: linker Rand + `band * index` (Anfang des Streifens) + `band / 2` (Mitte).
- **Z. 44** Der Text für die Linie: Für jedes Jahr ein Paar `x,y`, wobei `y` aus der **Kasse** kommt. `.join(" ")` verbindet sie mit Leerzeichen, so wie das SVG-Element `<polyline>` es verlangt.
- **Z. 45–47** Ein Satz für Screenreader, zum Beispiel „2021: gross profit €20,555, cash €25,064; …". Wird unten als `aria-label` verwendet.

## Das SVG zeichnen

```tsx
 49 |     return (
 50 |         <svg
 51 |             className="calc-chart"
 52 |             viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
 53 |             role="img"
 54 |             aria-label={`Gross profit per year and cash position. ${summary}`}
 55 |         >
 56 |             {ticks.map((tick) => (
 57 |                 <g key={tick}>
 58 |                     <line
 59 |                         className={tick === 0 ? "calc-zero" : "calc-grid"}
 60 |                         x1={MARGIN.left}
 61 |                         x2={WIDTH - MARGIN.right}
 62 |                         y1={yOf(tick)}
 63 |                         y2={yOf(tick)}
 64 |                     />
 65 |                     <text className="calc-axis-text" x={MARGIN.left - 8} y={yOf(tick) + 4} textAnchor="end">
 66 |                         {formatThousands(tick)}
 67 |                     </text>
 68 |                 </g>
 69 |             ))}
```

- **Z. 50–55** Das äußere Element. `viewBox` legt das interne Koordinatensystem fest (0 0 480 300), und das SVG wird per CSS auf jede Breite skaliert. `role="img"` sagt Screenreadern, dass das Ganze ein Bild ist, und `aria-label` beschreibt es mit Zahlen.
- **Z. 56** Pro Achsenwert eine Gitterlinie und eine Beschriftung.
- **Z. 57** Eine Gruppe mit eindeutiger Kennung, hier der Wert selbst.
- **Z. 58–64** Die waagerechte Gitterlinie von links nach rechts. `y1` und `y2` sind gleich: `yOf(tick)`. Die Null-Linie bekommt eine eigene CSS-Klasse (`calc-zero`) und ist deshalb heller.
- **Z. 65–67** Die Beschriftung links. `x={MARGIN.left - 8}` setzt sie 8 Einheiten vor die Linie, `textAnchor="end"` richtet den Text rechtsbündig aus, `+ 4` bei `y` zentriert ihn optisch auf der Linie. `formatThousands(tick)` macht daraus „€500k".

## Balken, Linie und Jahreszahlen

```tsx
 71 |             {years.map((item, index) => {
 72 |                 const top = yOf(Math.max(item.profit, 0));
 73 |                 const bottom = yOf(Math.min(item.profit, 0));
 74 |                 return (
 75 |                     <rect
 76 |                         key={item.year}
 77 |                         className={item.profit >= 0 ? "calc-bar-pos" : "calc-bar-neg"}
 78 |                         x={xCenter(index) - barWidth / 2}
 79 |                         y={top}
 80 |                         width={barWidth}
 81 |                         height={Math.max(bottom - top, 1)}
 82 |                         rx="3"
 83 |                     />
 84 |                 );
 85 |             })}
 86 |
 87 |             <polyline className="calc-line" points={linePoints} />
 88 |             {years.map((item, index) => (
 89 |                 <circle key={item.year} className="calc-dot" cx={xCenter(index)} cy={yOf(item.cash)} r="4" />
 90 |             ))}
 91 |
 92 |             {years.map((item, index) => (
 93 |                 <text
 94 |                     key={item.year}
 95 |                     className="calc-axis-text"
 96 |                     x={xCenter(index)}
 97 |                     y={HEIGHT - 8}
 98 |                     textAnchor="middle"
 99 |                 >
100 |                     {item.year}
101 |                 </text>
102 |             ))}
103 |         </svg>
104 |     );
105 | }
```

- **Z. 71** Pro Jahr ein Balken. Der Block `{ ... }` wird gebraucht, weil davor noch Variablen berechnet werden.
- **Z. 72** Die **obere** Kante des Balkens: bei Gewinn der Wert des Gewinns, bei Verlust die Nulllinie.
- **Z. 73** Die **untere** Kante: bei Gewinn die Nulllinie, bei Verlust der Wert des Verlusts. So hängt ein Verlustbalken unter der Nulllinie und ein Gewinnbalken steht darauf.
- **Z. 75–83** Der Balken. `x` ist die Mitte minus die halbe Balkenbreite. `y={top}` ist die obere Kante. `rx="3"` rundet die Ecken.
- **Z. 77** Die Farbe kommt über eine CSS-Klasse: Grün bei Gewinn, Orange bei Verlust.
- **Z. 81** Die Höhe ist der Abstand zwischen den Kanten. Mindestens 1, damit auch ein Gewinn von fast 0 sichtbar bleibt.
- **Z. 87** Die Linie für die Kasse.
- **Z. 88–90** Ein Punkt auf jedem Wert der Kasse, an `cx` (Jahr) und `cy` (Kasse).
- **Z. 92–102** Die Jahreszahlen unten. `y={HEIGHT - 8}` setzt sie knapp über den unteren Rand, `textAnchor="middle"` zentriert sie unter dem Balken.

## Typische Fragen

- **Warum ohne Diagramm-Bibliothek?** Für zwei Datenreihen und fünf Jahre ist eine Bibliothek unnötig groß. Handarbeit gibt volle Kontrolle über Aussehen und Barrierefreiheit. Der Preis ist mehr Code und eigene Mathematik. Bei vielen Diagrammen oder anderen Diagrammarten würde sich eine Bibliothek lohnen.
- **Wie funktioniert die Umrechnung `yOf`?** Sie rechnet einen Wert linear in eine Position um: Obergrenze wird zum oberen Rand, Untergrenze zum unteren, alles dazwischen anteilig. Weil `y` bei SVG nach unten wächst, rechnet man „Abstand von der Obergrenze".
- **Wozu `niceStep`?** Ohne sie hätte die Achse krumme Werte wie 224.159. Mit ihr liegen die Linien bei runden Beträgen.
- **Wie ist das Diagramm barrierefrei?** Das SVG hat `role="img"` und einen `aria-label` mit allen Zahlen. Zusätzlich gibt es die Tabelle zum Aufklappen mit denselben Werten.
- **Warum gibt es keine Beschriftung der Balken mit Zahlen?** Sie würden auf dem Handy zu klein. Die Zahlen stehen in der Tabelle.

## Mach es selbst

1. Ändere `WIDTH` auf `600`. Was ändert sich, was bleibt gleich, und warum?
2. Setze `barWidth` auf `band * 0.8`. Wie sehen die Balken aus?
3. Rechne `yOf(500000)` von Hand mit den Zahlen der Tabelle oben aus und vergleiche mit dem Diagramm (etwa 99,3).
4. Ersetze `Math.max(bottom - top, 1)` testweise durch `bottom - top` und stelle die Kosten so ein, dass 2021 fast 0 € Gewinn hat. Was ändert sich am Balken?
