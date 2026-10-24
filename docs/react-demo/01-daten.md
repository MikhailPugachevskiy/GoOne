# 1. Die Daten: `data.ts`

`data.ts` enthält keine Oberfläche. Es ist die „Datenbank" der Demo: Anbieter, Räder, die fünf Schritte und ein paar kleine Hilfsfunktionen. Alle anderen Dateien importieren daraus.

Wichtig für das Verständnis: **Alle Preise, Positionen und Räder sind erfunden.** Die Seite sagt das auch („Sample data, not live bikes").


## Typen

```ts
  1 | /* Sample data for the Go One demo: providers, bikes and the five product steps */
  2 |
  3 | export type ProviderId = "nextbike" | "callabike" | "mobike" | "limebike";
  4 | export type PayMethod = "card" | "paypal";
  5 |
  6 | export interface Provider {
  7 |     id: ProviderId;
  8 |     name: string;
  9 |     color: string;
 10 |     /* Sample price for 30 minutes in euros, not a real tariff */
 11 |     pricePer30: number;
 12 | }
 13 |
 14 | export interface Bike {
 15 |     id: string;
 16 |     provider: ProviderId;
 17 |     x: number;
 18 |     y: number;
 19 |     /* Distance from the rider in metres, calculated from the map position */
 20 |     distance: number;
 21 | }
```

- **Z. 1** Kommentar am Dateianfang. Er sagt, wofür die Datei da ist.
- **Z. 3** Ein **Union-Typ aus festen Texten**: Ein `ProviderId` darf nur eines dieser vier Wörter sein. Schreibt man irgendwo `"nextbyke"`, meldet der Editor sofort einen Fehler. `export` macht den Typ in anderen Dateien nutzbar.
- **Z. 4** Genauso für die zwei Zahlungsarten.
- **Z. 6–12** Ein `interface` beschreibt, welche Felder ein Objekt haben muss. Ein Anbieter hat eine `id` (vom Typ `ProviderId`), einen `name`, eine Farbe (`color`, als Hex-Text) und einen Preis (`pricePer30`, eine Zahl).
- **Z. 10** Der Kommentar erklärt die Einheit: Preis für 30 Minuten in Euro. Es sind keine echten Tarife.
- **Z. 14–21** Ein Rad hat eine `id` (Text), einen `provider` (ein `ProviderId`, also nur die vier erlaubten Wörter), die Kartenposition `x` und `y` und die `distance` in Metern.

## Die Anbieter und das Nachschlagen

```ts
 23 | export const providers: Provider[] = [
 24 |     { id: "nextbike", name: "Nextbike", color: "#3b82f6", pricePer30: 1.0 },
 25 |     { id: "callabike", name: "Call a Bike", color: "#ef4444", pricePer30: 1.2 },
 26 |     { id: "mobike", name: "Mobike", color: "#f97316", pricePer30: 0.75 },
 27 |     { id: "limebike", name: "LimeBike", color: "#84cc16", pricePer30: 1.5 }
 28 | ];
 29 |
 30 | export function providerById(id: ProviderId): Provider {
 31 |     const provider = providers.find((item) => item.id === id);
 32 |     if (!provider) {
 33 |         throw new Error(`Unknown provider: ${id}`);
 34 |     }
 35 |     return provider;
 36 | }
```

- **Z. 23** Eine Konstante `providers`. Der Typ `Provider[]` bedeutet „Liste von `Provider`-Objekten". TypeScript prüft jeden Eintrag gegen das `interface` von oben.
- **Z. 24–27** Die vier Anbieter. Jeder ist ein Objekt mit den Feldern aus `Provider`. Die Farben (`#3b82f6` blau, `#ef4444` rot, `#f97316` orange, `#84cc16` limettengrün) tauchen später auf Karte, Chips und Liste auf. Die Preise sind erfundene Beispielwerte. Beim letzten Eintrag steht kein Komma, das ist eine Stilfrage. **Z. 28** schließt die Liste.
- **Z. 30** Eine Funktion, die zu einer `id` den passenden Anbieter liefert. `(id: ProviderId)` ist der Parameter mit Typ, `: Provider` ist der Typ des Ergebnisses.
- **Z. 31** `find` geht die Liste durch und gibt das **erste** Element zurück, bei dem die Bedingung stimmt, sonst `undefined`. `(item) => item.id === id` ist eine **Pfeilfunktion**: „für jedes `item`: ist seine `id` gleich der gesuchten?". `===` vergleicht streng (Wert und Typ).
- **Z. 32–34** Wenn nichts gefunden wurde (`!provider` heißt „`provider` ist leer"), wird ein Fehler geworfen. Der Text in Backticks mit `${id}` ist ein **Template-Literal**: Der Wert von `id` wird eingesetzt. Dadurch weiß TypeScript hinter dem `if`, dass `provider` sicher ein echter `Provider` ist. Und wenn die Daten mal falsch sind, merkt man es sofort statt irgendwo später.
- **Z. 35** Gibt den gefundenen Anbieter zurück.

## Die Karte und die Räder

```ts
 38 | /* Map space: the rider stands in the middle, one map unit is about 0.9 m */
 39 | export const MAP = { width: 360, height: 300, user: { x: 180, y: 150 }, metersPerUnit: 0.9 };
 40 |
 41 | const rawBikes: Array<{ provider: ProviderId; x: number; y: number }> = [
 42 |     { provider: "limebike", x: 205, y: 125 },
 43 |     { provider: "nextbike", x: 120, y: 200 },
 44 |     { provider: "mobike", x: 235, y: 170 },
 45 |     { provider: "callabike", x: 150, y: 95 },
 46 |     { provider: "nextbike", x: 290, y: 110 },
 47 |     { provider: "limebike", x: 60, y: 130 },
 48 |     { provider: "mobike", x: 90, y: 60 },
 49 |     { provider: "callabike", x: 300, y: 220 },
 50 |     { provider: "nextbike", x: 200, y: 260 },
 51 |     { provider: "limebike", x: 320, y: 40 },
 52 |     { provider: "mobike", x: 40, y: 230 },
 53 |     { provider: "callabike", x: 250, y: 45 },
 54 |     { provider: "limebike", x: 150, y: 230 },
 55 |     { provider: "nextbike", x: 330, y: 170 },
 56 |     { provider: "mobike", x: 180, y: 40 },
 57 |     { provider: "callabike", x: 90, y: 160 }
 58 | ];
 59 |
 60 | export const bikes: Bike[] = rawBikes.map((bike, index) => ({
 61 |     id: `${bike.provider}-${index + 1}`,
 62 |     provider: bike.provider,
 63 |     x: bike.x,
 64 |     y: bike.y,
 65 |     distance: Math.round(
 66 |         Math.hypot(bike.x - MAP.user.x, bike.y - MAP.user.y) * MAP.metersPerUnit
 67 |     )
 68 | }));
```

- **Z. 38** Kommentar: Die Karte hat ein eigenes Koordinatensystem, der Fahrer steht in der Mitte, und eine Karteneinheit entspricht etwa 0,9 Metern.
- **Z. 39** Ein Objekt mit allen Kartenmaßen an einer Stelle. `width` und `height` (360 × 300) bestimmen später den Ausschnitt der SVG-Karte. `user` ist der Standort des Fahrers: genau die Mitte (180, 150). `metersPerUnit` rechnet Karteneinheiten in Meter um. Alle diese Zahlen an einem Ort zu sammeln, ist besser, als sie quer durch den Code zu verstreuen.
- **Z. 41** Die „rohen" Räder: nur Anbieter und Position. Es fehlen noch `id` und `distance`, deshalb heißen sie `raw`. Der Typ `Array<{ provider: ProviderId; x: number; y: number }>` beschreibt direkt an Ort und Stelle die Form der Objekte. Die Konstante hat kein `export`, sie ist nur in dieser Datei sichtbar.
- **Z. 42–57** 16 Räder mit von Hand gewählten Positionen. Die Verteilung ist so gewählt, dass das nächste Rad insgesamt (LimeBike, 32 m) anders liegt als das nächste Nextbike (70 m). Das zeigt der Satz unter der Karte.
- **Z. 60** `map` erzeugt aus jedem Element der Liste ein neues Element und liefert so eine neue Liste. Hier wird aus jedem rohen Rad ein vollständiges `Bike`. Der zweite Parameter `index` ist die Nummer des Elements (beginnt bei 0).
- **Z. 60** Die Klammer um die geschweifte Klammer ist wichtig: `=> ({ ... })` bedeutet „gib dieses Objekt zurück". Ohne die runden Klammern würde JavaScript `{ ... }` als Funktionskörper lesen.
- **Z. 61** Baut die `id` aus Anbieter und Nummer, zum Beispiel `limebike-1`. `index + 1`, damit die Zählung bei 1 beginnt.
- **Z. 62–64** Übernimmt Anbieter und Position unverändert.
- **Z. 65–67** Berechnet die Entfernung zum Fahrer. `Math.hypot(a, b)` ist der Satz des Pythagoras (√(a² + b²)) und liefert die Luftlinie. Dabei sind `a` der Abstand in x-Richtung und `b` der in y-Richtung. Mal `metersPerUnit` ergibt Meter, `Math.round` rundet auf ganze Meter.
- **Z. 68** Schließt das Objekt `}`, die Pfeilfunktion `)` und den `map`-Aufruf `)`.

## Hilfsfunktionen

```ts
 70 | export function bikePrice(bike: Bike): number {
 71 |     return providerById(bike.provider).pricePer30;
 72 | }
 73 |
 74 | export function formatPrice(value: number): string {
 75 |     return `€${value.toFixed(2)}`;
 76 | }
 77 |
 78 | /* Small deterministic hash, used for the demo lock code and QR pattern */
 79 | export function hashString(text: string): number {
 80 |     let hash = 7;
 81 |     for (let i = 0; i < text.length; i += 1) {
 82 |         hash = (hash * 31 + text.charCodeAt(i)) >>> 0;
 83 |     }
 84 |     return hash;
 85 | }
```

- **Z. 70–72** Gibt den Preis eines Rades zurück, indem sie den Anbieter nachschlägt. So muss nirgends der Preis in das Rad hineinkopiert werden.
- **Z. 74–76** Macht aus einer Zahl einen Text für die Anzeige. `value.toFixed(2)` liefert immer zwei Nachkommastellen als Text (`0.75` wird `"0.75"`, `1` wird `"1.00"`). Davor kommt das Eurozeichen.
- **Z. 78** Kommentar: Ein „Hash" macht aus einem Text eine Zahl. „Deterministisch" heißt: Derselbe Text ergibt **immer** dieselbe Zahl.
- **Z. 79** Nimmt einen Text und gibt eine Zahl zurück.
- **Z. 80** Startwert. `let` statt `const`, weil sich die Variable später ändert.
- **Z. 81** Eine normale Schleife über alle Zeichen des Textes.
- **Z. 82** Mischt jedes Zeichen in die Zahl ein: `charCodeAt(i)` ist der Zahlencode des Zeichens. `* 31` und `+` vermischen die Werte. `>>> 0` verwandelt das Ergebnis in eine positive 32-Bit-Zahl, damit die Zahl nicht unbegrenzt wächst und nie negativ wird.
- **Z. 84** Gibt die Zahl zurück. In `Unlock.tsx` entstehen daraus der Schloss-Code und das QR-Muster. Weil der Hash deterministisch ist, zeigt dasselbe Rad immer denselben Code.

## Die fünf Schritte

```ts
 87 | /* The five steps of the product flow, with the same wording as the page copy */
 88 | export const steps = [
 89 |     { title: "Overview", text: "All available bikes from partner providers appear in your area on one map." },
 90 |     { title: "Filters", text: "Narrow the map by a specific operator or by the lowest price before you walk." },
 91 |     { title: "Choose", text: "Select the bike that is closest, cheapest, or from the brand you already trust." },
 92 |     { title: "Pay", text: "Checkout stays inside Go One. Pay by credit card or PayPal with the same account." },
 93 |     { title: "Unlock", text: "Scan the QR code on the bike and receive a numerical lock code to start the ride." }
 94 | ];
```

- **Z. 88** Eine Liste mit fünf Objekten. Der Typ wird hier nicht hingeschrieben: TypeScript **erkennt** ihn selbst (*type inference*) als „Liste von Objekten mit `title` und `text`, beide Text".
- **Z. 89–93** Titel und Beschreibung der Schritte. Die Texte sind dieselben wie in der HTML-Seite darüber. `Stepper` zeigt sie an, `Demo` nutzt `title` und die Länge der Liste für die Ansage an Screenreader.

## Typische Fragen

- **Was ist der Unterschied zwischen `type` und `interface`?** Hier fast keiner. Ein `interface` beschreibt typischerweise die Form von Objekten, ein `type` kann auch andere Dinge benennen (zum Beispiel eine Union aus Texten). Ich habe es so verwendet.
- **Warum gibt es `rawBikes` und `bikes`?** Die Entfernung lässt sich aus der Position berechnen. Man muss sie also nicht von Hand eintragen und nicht pflegen. Ändert man eine Position, stimmt die Entfernung automatisch.
- **Warum wirft `providerById` einen Fehler, statt `undefined` zurückzugeben?** So muss der restliche Code nie prüfen, ob ein Anbieter fehlt. Ein Datenfehler fällt sofort auf.
- **Was ist `Math.hypot`?** Die Länge der Hypotenuse eines rechtwinkligen Dreiecks, also die Luftlinie zwischen zwei Punkten.

## Mach es selbst

1. Ändere den Preis von Mobike auf `0.80`. Wo siehst du die Änderung auf der Seite? (Nach `npm run build` in Liste, Zahlung und Karten-Tooltip.)
2. Füge einen fünften Anbieter hinzu (`ProviderId`, `providers` und ein paar Einträge in `rawBikes`). Welche Typfehler zeigt dir der Editor, bevor du irgendetwas gebaut hast?
3. Was passiert, wenn du in `rawBikes` bei einem Rad `provider: "mobyke"` schreibst?
