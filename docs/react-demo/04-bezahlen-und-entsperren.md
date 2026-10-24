# 4. Bezahlen und Entsperren: `Payment.tsx` und `Unlock.tsx`

Diese zwei Komponenten sind die Schritte 4 und 5. `Payment` ist ein gutes Beispiel für ein **Formular mit kontrollierten Eingaben**. `Unlock` enthält die einzige „Rechenarbeit" der Demo: einen deterministischen Zufallsgenerator und das Zeichnen eines Demo-QR-Codes.

**Wichtig vorab:** Es wird nichts wirklich bezahlt, und der QR-Code ist **nicht scannbar**. Beides steht auch auf der Seite.

---

## Datei: `react/src/Payment.tsx`

```tsx
  1 | import { bikePrice, formatPrice, providerById } from "./data";
  2 | import type { Bike, PayMethod } from "./data";
  3 |
  4 | interface PaymentProps {
  5 |     bike: Bike;
  6 |     method: PayMethod;
  7 |     paying: boolean;
  8 |     onMethod: (method: PayMethod) => void;
  9 |     onPay: () => void;
 10 |     onBack: () => void;
 11 | }
 12 |
 13 | const options: Array<{ id: PayMethod; label: string }> = [
 14 |     { id: "card", label: "Credit card" },
 15 |     { id: "paypal", label: "PayPal" }
 16 | ];
 17 |
 18 | /* Step 4: one checkout inside Go One, no extra account at the provider */
 19 | export function Payment({ bike, method, paying, onMethod, onPay, onBack }: PaymentProps) {
 20 |     const provider = providerById(bike.provider);
 21 |     const price = formatPrice(bikePrice(bike));
 22 |
```

- **Z. 1–2** Preis, Preisformat und Anbieter aus `data.ts`, dazu die Typen `Bike` und `PayMethod`.
- **Z. 4–11** Die Props: das gewählte Rad (`bike`), die Zahlungsart (`method`), ob gerade bezahlt wird (`paying`) und drei Funktionen: Zahlungsart wählen, bezahlen, zurück.
- **Z. 13–16** Die zwei Zahlungsarten als Liste. Sie steht **außerhalb** der Komponente, weil sie sich nie ändert. So wird sie nicht bei jeder Zeichnung neu erzeugt.
- **Z. 18** Kommentar zur Aufgabe: ein Bezahlschritt in Go One selbst, ohne zusätzlichen Account beim Anbieter.
- **Z. 19** Die Komponente mit sechs Props im Destructuring.
- **Z. 20** Der Anbieter des gewählten Rades.
- **Z. 21** Der Preis als Text, zum Beispiel `"€1.50"`. Das ist **abgeleiteter Wert**, kein State: Er lässt sich jederzeit aus `bike` berechnen, also speichert man ihn nicht.

```tsx
 23 |     return (
 24 |         <div className="demo-view">
 25 |             <h3>Pay with your Go One account</h3>
 26 |             <p className="demo-summary">
 27 |                 {provider.name} bike, {bike.distance} m away: <strong>{price}</strong> for 30 minutes
 28 |             </p>
 29 |             <fieldset className="demo-pay-options">
 30 |                 <legend>Payment method</legend>
 31 |                 {options.map((option) => (
 32 |                     <label key={option.id} className="demo-pay-option">
 33 |                         <input
 34 |                             type="radio"
 35 |                             name="pay-method"
 36 |                             value={option.id}
 37 |                             checked={method === option.id}
 38 |                             onChange={() => onMethod(option.id)}
 39 |                         />
 40 |                         <span>{option.label}</span>
 41 |                     </label>
 42 |                 ))}
 43 |             </fieldset>
 44 |             <p className="demo-insight">
 45 |                 One account for every provider: no separate {provider.name} sign-up needed.
 46 |             </p>
 47 |             <div className="demo-actions">
 48 |                 <button type="button" className="btn btn-primary" disabled={paying} onClick={onPay}>
 49 |                     {paying ? "Processing…" : `Pay ${price}`}
 50 |                 </button>
 51 |                 <button type="button" className="btn btn-ghost" disabled={paying} onClick={onBack}>
 52 |                     Choose another bike
 53 |                 </button>
 54 |             </div>
 55 |         </div>
 56 |     );
 57 | }
```

- **Z. 24** Das Wurzelelement.
- **Z. 25** Die Überschrift der Ansicht.
- **Z. 26–28** Der Zusammenfassungstext. In `{ }` stehen Werte: Anbietername, Entfernung und `{price}` in `<strong>`. Der Text dazwischen ist normaler Text.
- **Z. 29–30** Ein `<fieldset>` gruppiert zusammengehörende Formularelemente, `<legend>` ist seine Beschriftung. So lesen Screenreader „Payment method, Gruppe".
- **Z. 31** Macht aus jeder Zahlungsart eine Zeile.
- **Z. 32** Das `<label>` umschließt den Radiobutton und den Text. Ein Klick auf den Text wählt deshalb auch den Button. `key` ist wieder die eindeutige Kennung.
- **Z. 33–39** Der Radiobutton. `name="pay-method"` ist bei beiden gleich, dadurch kann nur einer gewählt sein. `value` ist die Kennung der Option.
- **Z. 37** Der Button ist gewählt, wenn die Zahlungsart in `Demo` zu dieser Option passt. Damit ist er eine **kontrollierte Eingabe**: Der Zustand in `Demo` ist die einzige Wahrheit, nicht das Eingabefeld selbst.
- **Z. 38** Ändert der Nutzer die Wahl, wird die neue Zahlungsart nach oben gemeldet. Ohne `onChange` wäre das Feld mit `checked` nur lesbar, und React würde warnen.
- **Z. 40** Der sichtbare Text („Credit card", „PayPal").
- **Z. 44–46** Ein Hinweis, der den Nutzen der App zeigt: ein Konto für alle Anbieter.
- **Z. 47** Der Bereich mit den Buttons.
- **Z. 48** Der Bezahlen-Button ist gesperrt, solange bezahlt wird. So kann man nicht doppelt klicken.
- **Z. 49** Der Text wechselt: Während des Bezahlens steht dort „Processing…", sonst „Pay €1.50". Der zweite Text ist ein Template-Literal.
- **Z. 51–53** Der Zurück-Button, ebenfalls gesperrt während des Bezahlens.
- **Z. 55–57** Schließt Bereich, Wurzelelement, `return` und Komponente.

**Typische Fragen**
- *Was ist eine kontrollierte Eingabe?* Ein Formularfeld, dessen Wert aus dem React-State kommt (`checked` oder `value`) und das jede Änderung über `onChange` zurückmeldet. Der State ist die einzige Wahrheit.
- *Warum wird die Zahlungsart in `Demo` gespeichert und nicht in `Payment`?* Wenn man zurück zur Auswahl geht und wiederkommt, ist `Payment` weg (siehe `Demo.tsx`). Ein Zustand dort ginge verloren. In `Demo` bleibt er erhalten.
- *Warum `price` als Konstante statt als State?* Weil sich der Wert aus `bike` berechnen lässt. Zwei Wahrheiten (State und Berechnung) können auseinanderlaufen.

---

## Datei: `react/src/Unlock.tsx`


### Konstanten und der Zufallsgenerator

```tsx
  1 | import { useMemo } from "react";
  2 | import { hashString, providerById } from "./data";
  3 | import type { Bike } from "./data";
  4 |
  5 | interface UnlockProps {
  6 |     bike: Bike;
  7 |     onReset: () => void;
  8 | }
  9 |
 10 | const GRID = 21;
 11 | const QUIET = 2;
 12 |
 13 | /* Seeded random numbers, so the same bike always shows the same demo QR pattern */
 14 | function mulberry32(seed: number): () => number {
 15 |     let state = seed;
 16 |     return () => {
 17 |         state = (state + 0x6d2b79f5) >>> 0;
 18 |         let t = state;
 19 |         t = Math.imul(t ^ (t >>> 15), t | 1);
 20 |         t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
 21 |         return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
 22 |     };
 23 | }
```

- **Z. 1** `useMemo` kommt aus React und wird weiter unten erklärt.
- **Z. 2–3** Der Hash aus `data.ts` und die Anbietersuche, plus der Typ `Bike`.
- **Z. 5–8** Props: das Rad und eine Funktion `onReset` für „Start over".
- **Z. 10** Ein QR-Code besteht aus Quadraten, den „Modulen". 21 × 21 ist die kleinste QR-Größe. Eine benannte Konstante ist besser als die Zahl 21 überall im Code.
- **Z. 11** Ein leerer Rand um den Code (*quiet zone*), in Moduleinheiten.
- **Z. 13** Ein „Zufallsgenerator mit Startwert" liefert immer dieselbe Folge, wenn man denselben Startwert nimmt. Das ist hier gewollt: Mit `Math.random()` würde der QR-Code bei jeder Zeichnung anders aussehen.
- **Z. 14** Die Funktion bekommt einen Startwert (`seed`) und gibt eine **Funktion** zurück: `() => number`. Jeder Aufruf dieser Funktion liefert die nächste Zufallszahl zwischen 0 und 1. Der Algorithmus heißt Mulberry32 und ist ein bekannter kleiner Zufallsgenerator.
- **Z. 15** Eine Variable, die der zurückgegebenen Funktion gehört. Sie bleibt zwischen den Aufrufen erhalten (das nennt man eine **Closure**).
- **Z. 16** Hier beginnt die zurückgegebene Funktion.
- **Z. 17** Setzt den Zustand weiter. Die Zahl `0x6d2b79f5` ist eine feste Konstante des Algorithmus (hexadezimal geschrieben). `>>> 0` hält das Ergebnis als positive 32-Bit-Zahl.
- **Z. 18–20** Die Zahl wird in mehreren Schritten durchgemischt. `^` ist XOR (ein Bit-Vergleich), `>>>` verschiebt Bits nach rechts, `Math.imul` multipliziert als 32-Bit-Ganzzahl. Du musst diese Rechnung nicht auswendig kennen. Wichtig ist: gleiche Eingabe, gleiche Ausgabe, und die Zahlen sehen zufällig aus.
- **Z. 21** Teilt durch 2³², dadurch liegt das Ergebnis zwischen 0 und 1 (ohne die 1).

### Die drei Eckquadrate

```tsx
 25 | /* Position inside one of the three 7x7 corner squares, or null for the data area */
 26 | function finderLocal(x: number, y: number): { lx: number; ly: number } | null {
 27 |     const origins = [
 28 |         { ox: 0, oy: 0 },
 29 |         { ox: GRID - 7, oy: 0 },
 30 |         { ox: 0, oy: GRID - 7 }
 31 |     ];
 32 |     for (const { ox, oy } of origins) {
 33 |         const lx = x - ox;
 34 |         const ly = y - oy;
 35 |         if (lx >= 0 && lx < 7 && ly >= 0 && ly < 7) {
 36 |             return { lx, ly };
 37 |         }
 38 |     }
 39 |     return null;
 40 | }
```

- **Z. 25** In echten QR-Codes gibt es drei große Quadrate in den Ecken (links oben, rechts oben, links unten), an denen Scanner den Code erkennen. Die Funktion beantwortet: Liegt der Punkt (x, y) in einem dieser Quadrate? Wenn ja, wo darin?
- **Z. 26** Der Rückgabetyp `{ lx: number; ly: number } | null` heißt: entweder die **lokalen** Koordinaten im Quadrat oder `null` für den Datenbereich.
- **Z. 27–31** Die linken oberen Ecken der drei Quadrate. Das Quadrat rechts oben beginnt bei `GRID - 7`, das links unten ebenfalls.
- **Z. 32** Eine Schleife über die drei Ecken. `{ ox, oy }` holt die beiden Felder direkt heraus (Destructuring).
- **Z. 33–34** Die Position relativ zur Ecke: x minus Ecke und y minus Ecke.
- **Z. 35** Liegt der Punkt zwischen 0 und 6 in beiden Richtungen, ist er in diesem Quadrat.
- **Z. 36** Gibt die lokalen Koordinaten zurück. `return` beendet die Funktion sofort.
- **Z. 39** Wenn keine der drei Ecken passt: Der Punkt liegt im Datenbereich.

### Die Module bestimmen

```tsx
 42 | function buildCells(seed: number): Array<{ x: number; y: number }> {
 43 |     const random = mulberry32(seed);
 44 |     const cells: Array<{ x: number; y: number }> = [];
 45 |
 46 |     for (let y = 0; y < GRID; y += 1) {
 47 |         for (let x = 0; x < GRID; x += 1) {
 48 |             const finder = finderLocal(x, y);
 49 |             const filled = finder
 50 |                 ? finder.lx === 0 ||
 51 |                 finder.lx === 6 ||
 52 |                 finder.ly === 0 ||
 53 |                 finder.ly === 6 ||
 54 |                 (finder.lx >= 2 && finder.lx <= 4 && finder.ly >= 2 && finder.ly <= 4)
 55 |                 : random() > 0.5;
 56 |             if (filled) {
 57 |                 cells.push({ x, y });
 58 |             }
 59 |         }
 60 |     }
 61 |     return cells;
 62 | }
```

- **Z. 42** Berechnet, welche Quadrate dunkel sind. Das Ergebnis ist eine Liste von Koordinaten.
- **Z. 43** Erzeugt den Zufallsgenerator mit dem Startwert.
- **Z. 44** Eine leere Liste für die dunklen Quadrate.
- **Z. 46–47** Zwei verschachtelte Schleifen laufen über alle 21 × 21 Quadrate.
- **Z. 48** Liegt dieses Quadrat in einer Ecke?
- **Z. 49–55** Ein Ternary über mehrere Zeilen. **Wenn** das Quadrat in einer Ecke liegt, ist es dunkel, falls es am äußeren Rand des 7×7-Quadrats liegt (`lx` oder `ly` gleich 0 oder 6) oder im mittleren 3×3-Bereich (2 bis 4). Das ergibt das typische Auge. **Sonst** (Datenbereich) entscheidet der Zufall: `random() > 0.5`, also etwa jedes zweite.
- **Z. 56–58** Dunkle Quadrate werden mit ihren Koordinaten in die Liste aufgenommen.
- **Z. 61** Gibt die Liste zurück.

### Die Komponente

```tsx
 64 | /* Step 5: a demo QR code and a four-digit lock code, both made up for this bike */
 65 | export function Unlock({ bike, onReset }: UnlockProps) {
 66 |     const provider = providerById(bike.provider);
 67 |     const seed = hashString(bike.id);
 68 |     const cells = useMemo(() => buildCells(seed), [seed]);
 69 |     const code = String(1000 + (seed % 9000));
 70 |     const size = GRID + QUIET * 2;
 71 |
```

- **Z. 65** Die Komponente mit den Props `bike` und `onReset`.
- **Z. 66** Der Anbieter für den Text.
- **Z. 67** Aus der `id` des Rades wird eine Zahl. Dasselbe Rad liefert immer dieselbe Zahl, also denselben Code und dasselbe Muster.
- **Z. 68** `useMemo(() => buildCells(seed), [seed])` merkt sich das Ergebnis und berechnet es nur dann neu, wenn sich `seed` ändert. Bei fester Eingabe wäre das Neuberechnen verschwendete Arbeit.
- **Z. 69** Ein vierstelliger Code: `seed % 9000` ist der Rest einer Division durch 9000 (0 bis 8999), plus 1000 ergibt 1000 bis 9999. `String(...)` macht daraus Text.
- **Z. 70** Die Kantenlänge in Modulen: 21 plus je 2 Module Rand links und rechts.

```tsx
 72 |     return (
 73 |         <div className="demo-view">
 74 |             <h3>Your {provider.name} bike is ready</h3>
 75 |             <div className="demo-unlock">
 76 |                 <svg
 77 |                     className="demo-qr"
 78 |                     viewBox={`0 0 ${size} ${size}`}
 79 |                     role="img"
 80 |                     aria-label="Demo QR code, not scannable"
 81 |                 >
 82 |                     <rect width={size} height={size} fill="#f4fff8" />
 83 |                     {cells.map((cell) => (
 84 |                         <rect
 85 |                             key={`${cell.x}-${cell.y}`}
 86 |                             x={cell.x + QUIET}
 87 |                             y={cell.y + QUIET}
 88 |                             width="1"
 89 |                             height="1"
 90 |                             fill="#062016"
 91 |                         />
 92 |                     ))}
 93 |                 </svg>
 94 |                 <div>
 95 |                     <p className="demo-summary">Scan the QR code on the bike, then use this lock code:</p>
 96 |                     <p className="demo-code" aria-label={`Lock code ${code.split("").join(" ")}`}>
 97 |                         {code}
 98 |                     </p>
 99 |                 </div>
100 |             </div>
101 |             <p className="demo-insight">Demo only: no real booking was made.</p>
102 |             <div className="demo-actions">
103 |                 <button type="button" className="btn btn-primary" onClick={onReset}>
104 |                     Start over
105 |                 </button>
106 |             </div>
107 |         </div>
108 |     );
109 | }
```

- **Z. 73–75** Wurzelelement und Bereich für QR und Code.
- **Z. 76–81** Das QR-SVG. `viewBox` ist `0 0 25 25`, jedes Modul ist also eine Einheit groß. `role="img"` und der `aria-label` sagen offen, dass der Code nicht scannbar ist.
- **Z. 82** Ein helles Rechteck als Hintergrund.
- **Z. 83** Aus jedem dunklen Modul wird ein Rechteck.
- **Z. 85** Die Kennung aus beiden Koordinaten, zum Beispiel `"3-7"`. Sie ist pro Modul einmalig.
- **Z. 86–87** Die Position, um den Rand verschoben.
- **Z. 88–90** Ein Modul ist eine Einheit breit und hoch und dunkel gefüllt.
- **Z. 96** Der Schloss-Code wird für Screenreader als einzelne Ziffern vorgelesen: `code.split("")` zerlegt den Text in Zeichen, `.join(" ")` setzt ihn mit Leerzeichen wieder zusammen („9 5 6 8").
- **Z. 97** Der sichtbare Code.
- **Z. 101** Ein Hinweis, dass nichts gebucht wurde.
- **Z. 103** „Start over" ruft die Funktion aus `Demo` auf. Sie setzt alles auf den Anfang zurück.

## Typische Fragen

- **Warum ein eigener Zufallsgenerator statt `Math.random()`?** `Math.random()` liefert bei jedem Aufruf etwas anderes. Der QR-Code würde bei jeder Zeichnung flackern. Mit Startwert bleibt er stabil.
- **Ist das ein echter QR-Code?** Nein. Er hat nur die drei Eckquadrate und zufällige Module, keine Daten und keine Fehlerkorrektur. Er ist nur ein Muster, das so aussieht. Deshalb steht „not scannable" im `aria-label`.
- **Wozu `useMemo` hier?** Die Berechnung ist klein, also wäre es auch ohne gegangen. Es zeigt das Muster: teure Berechnungen nur wiederholen, wenn sich ihre Eingabe ändert.
- **Was ist eine Closure?** Eine Funktion, die sich Variablen aus ihrer Umgebung merkt. Hier merkt sich die zurückgegebene Funktion `state`.

## Mach es selbst

1. Ändere `GRID` auf `25`. Was passiert mit dem Bild, und warum ändert sich die Größe des SVG (`size`) mit?
2. Mache den Schloss-Code fünfstellig. Welche zwei Zahlen musst du in `Z. 69` ändern?
3. Warum ändert sich der Code nicht, wenn du dasselbe Rad zweimal wählst? Und was würde passieren, wenn man `hashString(bike.id)` durch `Date.now()` ersetzt?
