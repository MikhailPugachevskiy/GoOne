# Rechner 1: Das Rechenmodell `model.ts`

`model.ts` enthält die **ganze Rechnung** des Break-even-Rechners. Es gibt hier kein React und kein JSX, nur Daten, Typen und Funktionen. Das ist Absicht: Die Rechnung lässt sich so unabhängig von der Oberfläche verstehen und prüfen. Die Oberfläche (die anderen Dateien) zeigt nur an, was `calculate` ausrechnet.

**Zur Vorbereitung:** Lies zuerst Kapitel 0 der App-Demo (Grundlagen). Die Schreibweisen `interface`, `map`, `find`, `reduce`, Template-Literale und Pfeilfunktionen werden dort erklärt.

## Was wird berechnet?

Für die Jahre 2019 bis 2023 rechnet das Modell:

- **Umsatz (`revenue`)** = Fahrten × Gebühr pro Fahrt
- **Kosten (`costs`)** = geplante Kosten
- **Bruttogewinn (`profit`)** = Umsatz − Kosten
- **Kumuliert (`cumulative`)** = Summe aller Bruttogewinne bis zu diesem Jahr
- **Kasse (`cash`)** = kumuliert + bisher erhaltene Finanzierung

Drei Regler verändern die Rechnung: die **Gebühr** ab 2021, die **Fahrtenzahl** im Vergleich zum Plan und die **Kosten** im Vergleich zum Plan.

**Wichtig und ehrlich:** Umsatz und Gebühren stammen aus eurer Pitch-Folie. **Die Kosten stehen dort nicht.** Sie sind aus der Gewinnkurve zurückgerechnet (Umsatz minus abgelesener Gewinn). Das ist eine Schätzung. Die Seite sagt das unter dem Diagramm auch.

## Rechenbeispiel mit den Standardwerten

| Jahr | Umsatz | Kosten | Gewinn | Kumuliert | Finanzierung bisher | Kasse |
| --- | --- | --- | --- | --- | --- | --- |
| 2019 | 0 | 120.000 | −120.000 | −120.000 | 200.000 | 80.000 |
| 2020 | 104.509 | 380.000 | −275.491 | −395.491 | 400.000 | 4.509 |
| 2021 | 523.555 | 503.000 | 20.555 | −374.936 | 400.000 | 25.064 |
| 2022 | 989.268 | 799.000 | 190.268 | −184.668 | 400.000 | 215.332 |
| 2023 | 1.930.974 | 1.301.000 | 629.974 | 445.306 | 400.000 | 845.306 |

Daraus folgt: **Break-even** ist das erste Jahr mit Gewinn ≥ 0, also 2021. Die **niedrigste Kasse** zum Jahresende liegt bei 4.509 € (2020). Die 400.000 € Finanzierung reichen also gerade so.

---


## Die Typen

```ts
  1 | /* Break-even model for the Go One pitch: yearly revenue, costs, gross profit and cash including both funding rounds */
  2 |
  3 | export interface Inputs {
  4 |     /* Fee per booked ride from 2021 on (Version 2.0), in euros */
  5 |     fee: number;
  6 |     /* Ride volume compared with the pitch plan, 1 = plan */
  7 |     volume: number;
  8 |     /* Costs compared with the plan, 1 = plan */
  9 |     costs: number;
 10 | }
 11 |
 12 | export interface YearResult {
 13 |     year: number;
 14 |     revenue: number;
 15 |     costs: number;
 16 |     profit: number;
 17 |     /* Sum of all gross profits up to and including this year */
 18 |     cumulative: number;
 19 |     /* Cumulative gross profit plus the funding received by the end of this year */
 20 |     cash: number;
 21 | }
 22 |
 23 | export interface Summary {
 24 |     breakEvenYear: number | null;
 25 |     lowestCash: number;
 26 |     lowestCashYear: number;
 27 |     lastProfit: number;
 28 | }
```

- **Z. 1** Kommentar zur Aufgabe der Datei.
- **Z. 3–10** Die drei Werte, die der Nutzer mit den Reglern ändert: `fee` (Gebühr in Euro), `volume` (Fahrtenzahl als Faktor, 1 = Plan) und `costs` (Kostenfaktor, 1 = Plan). Faktoren sind einfacher zu rechnen als Prozentwerte.
- **Z. 4** **Ein Hinweis zu diesem Kommentar:** Er sagt „booked ride" und „Version 2.0". Das stammt aus einer Zeit, bevor wir die Seite an eure Folie angeglichen haben. Die Folie spricht von einer Gebühr „pro weitergeleitetem Nutzer", und was Version 2.0 genau ist, steht dort nicht. Der Code rechnet unverändert richtig, nur der Kommentar ist veraltet. Du kannst ihn auf „Fee per redirected user from 2021 on, in euros" ändern.
- **Z. 12–21** Das Ergebnis für **ein** Jahr: Umsatz, Kosten, Gewinn, kumulierter Gewinn und Kasse. Die zwei Kommentare darin erklären `cumulative` und `cash`.
- **Z. 23–28** Die vier Kennzahlen für die Kacheln über dem Diagramm. `breakEvenYear: number | null` bedeutet: ein Jahr oder `null`, wenn es bis 2023 keinen Break-even gibt.

## Die Voreinstellungen und festen Werte

```ts
 30 | export const defaultInputs: Inputs = { fee: 0.015, volume: 1, costs: 1 };
 31 |
 32 | /* An example scenario for comparison, not part of the pitch: the plan fee, but only 80% of the planned rides */
 33 | export const cautiousInputs: Inputs = { fee: 0.015, volume: 0.8, costs: 1 };
 34 |
 35 | /* Funding rounds from the pitch: EUR 200,000 in Q3 2019 and EUR 200,000 in Q2 2020 */
 36 | const funding: Record<number, number> = { 2019: 200000, 2020: 200000 };
 37 | export const fundingTotal = 400000;
 38 |
 39 | /*
 40 |  * Plan values per year. Revenue and fees come from the pitch (slide 13).
 41 |  * Costs are NOT stated in the deck: they are estimated as revenue minus the gross profit
 42 |  * read off the chart, so the default scenario reproduces the chart (about -120k, -275k, +20k, +190k, +630k).
 43 |  */
 44 | const plan = [
 45 |     { year: 2019, revenue: 0, fee: 0, cost: 120000 },
 46 |     { year: 2020, revenue: 104509, fee: 0.01, cost: 380000 },
 47 |     { year: 2021, revenue: 523555, fee: 0.015, cost: 503000 },
 48 |     { year: 2022, revenue: 989268, fee: 0.015, cost: 799000 },
 49 |     { year: 2023, revenue: 1930974, fee: 0.015, cost: 1301000 }
 50 | ];
```

- **Z. 30** Der Plan aus der Pitch-Folie: Gebühr 0,015 €, 100 % Fahrten, 100 % Kosten. Der Typ `Inputs` sorgt dafür, dass kein Feld fehlt.
- **Z. 32** Der Kommentar sagt ehrlich, dass dieses Szenario nicht aus der Folie stammt.
- **Z. 33** Das „vorsichtige Beispiel": gleiche Gebühr, aber nur 80 % der geplanten Fahrten.
- **Z. 35** Die Finanzierungsrunden: je 200.000 € im Q3 2019 und im Q2 2020.
- **Z. 36** Ein `Record<number, number>` ist ein Objekt, das Zahlen als Schlüssel und Zahlen als Werte hat. Hier: Jahr → erhaltener Betrag. Ein Nachschlagewerk: `funding[2019]` ergibt 200.000. Die Konstante hat kein `export`, sie ist nur in dieser Datei sichtbar.
- **Z. 37** Die Gesamtsumme, 400.000 €, für den Satz unter den Kacheln.
- **Z. 39–43** Der Kommentar erklärt die Herkunft: Umsatz und Gebühr aus der Folie, die Kosten sind **geschätzt**.
- **Z. 44** Die Plandaten pro Jahr als Liste von Objekten. `revenue` ist der Planumsatz aus der Folie, `fee` die Gebühr pro Fahrt im Plan, `cost` die geschätzten Kosten.
- **Z. 45** 2019 hat keinen Umsatz und keine Gebühr (`0`).
- **Z. 46** 2020 mit Gebühr 0,010 €. Das ist keine Zahl aus der Folie, sondern die Annahme, mit der sich der Umsatz von 104.509 € ergibt.
- **Z. 47–49** 2021 bis 2023 mit Gebühr 0,015 €. Damit ergeben sich die Umsätze der Folie. Zum Beispiel: 34,9 Mio. Fahrten × 0,015 = 523.555 €.

## Die Hauptfunktion `calculate`

```ts
 52 | export function calculate(inputs: Inputs): { years: YearResult[]; summary: Summary } {
 53 |     let cumulative = 0;
 54 |     let raised = 0;
 55 |
 56 |     const years: YearResult[] = plan.map((item) => {
 57 |         /* The number of rides follows from the plan revenue and the plan fee */
 58 |         const rides = item.fee > 0 ? item.revenue / item.fee : 0;
 59 |         /* The MVP years keep the plan fee; the fee slider applies from Version 2.0 on */
 60 |         const fee = item.year <= 2020 ? item.fee : inputs.fee;
 61 |         const revenue = Math.round(rides * inputs.volume * fee);
 62 |         const costs = Math.round(item.cost * inputs.costs);
 63 |         const profit = revenue - costs;
 64 |
 65 |         cumulative += profit;
 66 |         raised += funding[item.year] ?? 0;
 67 |
 68 |         return { year: item.year, revenue, costs, profit, cumulative, cash: cumulative + raised };
 69 |     });
```

- **Z. 52** Die Funktion bekommt die Reglerwerte und gibt ein Objekt zurück. Der Rückgabetyp `{ years: YearResult[]; summary: Summary }` beschreibt es: eine Liste mit fünf Jahresergebnissen und die Kennzahlen.
- **Z. 53–54** Zwei laufende Summen. `let`, weil sie sich im Verlauf ändern. `cumulative` summiert die Gewinne, `raised` die erhaltene Finanzierung.
- **Z. 56** `map` wandelt jedes Planjahr in ein Ergebnisjahr um. Die Jahre werden **der Reihe nach** durchlaufen, 2019 zuerst. Das ist wichtig, weil die laufenden Summen auf den Vorjahren aufbauen. Eine Anmerkung: Die Funktion in `map` verändert Variablen von außen (`cumulative`, `raised`). Das funktioniert, weil `map` immer der Reihe nach arbeitet. Eine einfache `for`-Schleife würde das deutlicher zeigen. Man spricht hier von einem **Seiteneffekt**. Das ist eine Stilfrage, kein Fehler.
- **Z. 57–58** Die Zahl der Fahrten im Plan: Planumsatz geteilt durch Plangebühr. 2021: 523.555 / 0,015 ≈ 34,9 Mio. Bei Gebühr 0 (2019) würde man durch null teilen, deshalb der Ternary: `item.fee > 0 ? ... : 0`.
- **Z. 59–60** Welche Gebühr gilt? In den Jahren bis 2020 die Plangebühr, ab 2021 der Wert vom Regler (`inputs.fee`). Der Kommentar sagt: Der Regler wirkt ab 2021.
- **Z. 61** Der Umsatz: Planfahrten × Fahrtenfaktor × Gebühr. `Math.round` rundet auf ganze Euro. Bei den Standardwerten kommt genau der Planumsatz heraus (Fahrten × 1 × Plangebühr).
- **Z. 62** Die geplanten Kosten mal Kostenfaktor, gerundet.
- **Z. 63** Gewinn = Umsatz minus Kosten. Negativ bedeutet Verlust.
- **Z. 65** Addiert den Gewinn zur laufenden Summe. `+=` ist die Kurzform von `cumulative = cumulative + profit`.
- **Z. 66** Addiert die in diesem Jahr erhaltene Finanzierung. `funding[item.year]` ist für 2021 bis 2023 nicht definiert (`undefined`). `?? 0` ersetzt das durch 0.
- **Z. 68** Das Ergebnisobjekt für dieses Jahr. Wenn ein Feld und eine Variable gleich heißen, darf man kurz `revenue` statt `revenue: revenue` schreiben. Die Kasse ist die laufende Summe plus die bisher erhaltene Finanzierung.

## Die Kennzahlen und das Ergebnis

```ts
 71 |     const lowest = years.reduce((best, item) => (item.cash < best.cash ? item : best));
 72 |     const breakEven = years.find((item) => item.profit >= 0);
 73 |
 74 |     return {
 75 |         years,
 76 |         summary: {
 77 |             breakEvenYear: breakEven ? breakEven.year : null,
 78 |             lowestCash: lowest.cash,
 79 |             lowestCashYear: lowest.year,
 80 |             lastProfit: years[years.length - 1].profit
 81 |         }
 82 |     };
 83 | }
```

- **Z. 71** Sucht das Jahr mit der niedrigsten Kasse: `reduce` führt das bisher beste Jahr (`best`) mit. Bei jedem Jahr bleibt das mit der kleineren Kasse.
- **Z. 72** `find` gibt das **erste** Jahr zurück, in dem der Gewinn mindestens 0 ist, sonst `undefined`.
- **Z. 74–82** Das Ergebnis der Funktion: die fünf Jahre und die Kennzahlen.
- **Z. 77** Wenn ein Jahr gefunden wurde, nimmt man seine Jahreszahl, sonst `null`.
- **Z. 78–79** Der kleinste Kassenstand und das Jahr dazu.
- **Z. 80** Der Gewinn des **letzten** Jahres: `years.length - 1` ist der Index des letzten Elements.

**Hinweis zu „Break-even":** Der Rechner nennt das erste Jahr mit Gewinn ≥ 0, ohne zu prüfen, ob spätere Jahre wieder ins Minus rutschen. Mit den Standardwerten ist das nicht der Fall.

## Die Formatierungsfunktionen

```ts
 85 | export function formatEuro(value: number): string {
 86 |     const sign = value < 0 ? "−" : "";
 87 |     return `${sign}€${Math.abs(Math.round(value)).toLocaleString("en-US")}`;
 88 | }
 89 |
 90 | /* Short axis label: €0, €500k, €1M, €1.5M */
 91 | export function formatThousands(value: number): string {
 92 |     if (value === 0) {
 93 |         return "€0";
 94 |     }
 95 |     const sign = value < 0 ? "−" : "";
 96 |     const absolute = Math.abs(value);
 97 |     if (absolute >= 1000000) {
 98 |         return `${sign}€${Number((absolute / 1000000).toFixed(2))}M`;
 99 |     }
100 |     return `${sign}€${Math.round(absolute / 1000)}k`;
101 | }
```

- **Z. 85–88** Macht aus einer Zahl einen Text wie `€1,930,974` oder `−€275,491`.
- **Z. 86** Das Vorzeichen: bei Verlust ein Minuszeichen (`−`, das echte Minus U+2212), sonst nichts.
- **Z. 87** Erst auf ganze Zahlen runden, dann den Betrag nehmen (`Math.abs`), dann mit `toLocaleString("en-US")` Tausendertrennzeichen setzen. Das Minuszeichen kommt separat davor, so steht es vor dem Euro-Zeichen.
- **Z. 90–101** Kurze Achsenbeschriftung: `€0`, `€500k`, `€1M`, `€1.5M`.
- **Z. 92–94** Null bekommt eine eigene Form: `€0`.
- **Z. 96** Der Betrag ohne Vorzeichen.
- **Z. 97–99** Ab einer Million: in Millionen. `(absolute / 1000000).toFixed(2)` gibt zwei Nachkommastellen als Text, `Number(...)` wandelt zurück und entfernt unnötige Nullen (aus `"1.50"` wird `1.5`).
- **Z. 100** Sonst in Tausend, gerundet: `500000` wird `€500k`.

## Typische Fragen

- **Warum steht die Rechnung in einer eigenen Datei ohne React?** So kann man sie getrennt verstehen und testen. Die Oberfläche kann sich ändern, ohne dass die Rechnung betroffen ist, und umgekehrt.
- **Wie kommt der Rechner auf „Break-even 2021"?** Der Gewinn ist 2019 und 2020 negativ und 2021 zum ersten Mal positiv (20.555 €). `find` liefert das erste solche Jahr.
- **Woher kommen die Kosten?** Sie stehen nicht in der Folie. Ich habe sie so geschätzt, dass die Standardwerte die Gewinnkurve der Folie ergeben (etwa −120.000, −275.000, +20.000, +190.000, +630.000). Das ist eine Annahme, und das steht auch auf der Seite.
- **Was bedeutet „niedrigste Kasse 4.509 €"?** Nach der zweiten Finanzierungsrunde (2020) bleibt nur noch ein kleiner Puffer. Der Rechner prüft die Kasse nur zum **Jahresende**, Tiefpunkte innerhalb eines Jahres sieht er nicht.
- **Was passiert bei Gebühr 0,010 €?** Für 2023 wären es etwa 128,7 Mio. Fahrten × 0,01 ≈ 1.287.000 € Umsatz. Das liegt unter den geschätzten Kosten von 1.301.000 €. Mit dieser Kostenschätzung gäbe es also bis 2023 keinen Break-even.
- **Warum `?? 0` und nicht `|| 0`?** `??` ersetzt nur `null` und `undefined`. `||` würde auch `0` ersetzen. Hier macht es keinen Unterschied, `??` sagt aber genauer, was gemeint ist.

## Mach es selbst

1. Rechne mit dem Taschenrechner nach: Wie viel Umsatz ergibt 2021 bei **80 %** der Fahrten? (523.555 × 0,8 = 418.844. Mit Kosten 503.000 ist der Gewinn −84.156.)
2. Ändere in `plan` die Kosten von 2021 auf 530.000. In welchem Jahr liegt dann der Break-even? (2021 hat dann 523.555 − 530.000 = −6.445, also einen Verlust.)
3. Füge ein sechstes Jahr (2024) hinzu. Welche Datei außer `model.ts` müsstest du anschauen, weil sie Jahreszahlen fest eingebaut hat? (Hinweis: Suche in `Calculator.tsx` nach „2023".)
4. Schreibe `calculate` so um, dass statt `map` eine `for`-Schleife die laufenden Summen aufbaut. Danach muss die Tabelle oben identisch sein.
