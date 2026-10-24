# 2. Die kleinen Komponenten: `Stepper`, `FilterBar`, `BikeList`

Diese drei Komponenten haben eine Gemeinsamkeit: Sie **besitzen keinen eigenen Zustand**. Sie zeigen nur an, was ihnen `Demo` über Props gibt, und melden Klicks über Funktionen zurück. Komponenten dieser Art heißen auch „dumm" oder „präsentational". Das macht sie leicht zu verstehen und zu testen.

---

## Datei: `react/src/Stepper.tsx` (die fünf Schritte)

```tsx
  1 | import { steps } from "./data";
  2 |
  3 | interface StepperProps {
  4 |     current: number;
  5 |     locked: boolean;
  6 |     onSelect: (step: number) => void;
  7 | }
  8 |
  9 | /* The five product steps. Finished steps can be clicked to go back; the current step shows its description */
 10 | export function Stepper({ current, locked, onSelect }: StepperProps) {
 11 |     return (
 12 |         <ol className="demo-steps" aria-label="Steps">
 13 |             {steps.map((step, index) => {
 14 |                 const number = index + 1;
 15 |                 const isCurrent = number === current;
 16 |                 const state = isCurrent ? "current" : number < current ? "done" : "todo";
 17 |                 const canGoBack = number < current && current < 5 && !locked;
```

- **Z. 1** Holt die Liste mit den fünf Schritten aus `data.ts`.
- **Z. 3–7** Der „Vertrag" der Komponente: Welche Props muss man ihr geben? `current` ist die Nummer des aktuellen Schritts, `locked` sagt, ob gerade bezahlt wird (dann soll man nicht zurückspringen können), `onSelect` ist eine Funktion, die mit einer Schrittnummer aufgerufen wird. `(step: number) => void` heißt: nimmt eine Zahl, gibt nichts zurück.
- **Z. 9** Kommentar zur Aufgabe der Komponente.
- **Z. 10** Die Komponente ist eine Funktion. Ihr Name beginnt mit einem **Großbuchstaben**, sonst hielte React sie für ein HTML-Tag. React übergibt alle Props als **ein** Objekt. `{ current, locked, onSelect }` entnimmt daraus direkt die drei Felder (Destructuring). `: StepperProps` legt fest, wie dieses Objekt aussehen muss.
- **Z. 11** Gibt das JSX zurück. Die runde Klammer erlaubt, das JSX über mehrere Zeilen zu schreiben.
- **Z. 12** Eine nummerierte Liste (*ordered list*). `className` statt `class` (siehe Kapitel 0). `aria-label="Steps"` gibt der Liste einen Namen für Screenreader.
- **Z. 13** Die geschweifte Klammer öffnet einen JavaScript-Ausdruck mitten im JSX. `steps.map(...)` macht aus jedem der fünf Schritte ein `<li>`. Der Parameter `index` ist die Position (0 bis 4). Die Funktion hat einen Block mit `{ ... }`, weil darin mehrere Anweisungen stehen.
- **Z. 14** Die für Menschen sichtbare Nummer (1 bis 5).
- **Z. 15** Ist das der aktive Schritt?
- **Z. 16** Ein **verschachtelter Ternary**: Ist es der aktuelle Schritt, heißt der Zustand `"current"`, sonst `"done"` (wenn die Nummer kleiner ist) und sonst `"todo"`. Das CSS nutzt diesen Wert, um die drei Zustände zu gestalten.
- **Z. 17** Zurückspringen ist nur erlaubt, wenn der Schritt schon erledigt ist (`number < current`), nicht der letzte Schritt aktiv ist (`current < 5`, nach dem Entsperren gibt es nur noch „Start over") und nicht gerade bezahlt wird (`!locked`). Die Zahl 5 steht hier fest im Code. Besser wäre `steps.length`, dann müsste man bei einem sechsten Schritt nichts anpassen.

```tsx
 19 |                 return (
 20 |                     <li key={step.title} className="demo-step" data-state={state}>
 21 |                         <button
 22 |                             type="button"
 23 |                             className="demo-step-button"
 24 |                             disabled={!canGoBack}
 25 |                             aria-current={isCurrent ? "step" : undefined}
 26 |                             onClick={() => onSelect(number)}
 27 |                         >
 28 |                             <span className="demo-step-number">{number}</span>
 29 |                             <span className="demo-step-title">{step.title}</span>
 30 |                             <span className="demo-step-text">{step.text}</span>
 31 |                         </button>
 32 |                     </li>
 33 |                 );
 34 |             })}
 35 |         </ol>
 36 |     );
 37 | }
```

- **Z. 19** Das JSX für **ein** Listenelement, innerhalb der `map`-Funktion.
- **Z. 20** `key` ist Pflicht bei Listen: React erkennt daran, welches Element welches ist, wenn sich die Liste ändert. Der Wert muss pro Liste einmalig sein (hier der Titel). `data-state={state}` setzt ein eigenes Attribut, das das CSS lesen kann.
- **Z. 21–27** Jeder Schritt ist ein Button. `type="button"` sagt, dass er nichts absendet. `disabled={!canGoBack}` sperrt ihn, wenn man nicht zurückspringen darf. `aria-current={isCurrent ? "step" : undefined}` markiert für Screenreader den aktuellen Schritt. Bei `undefined` lässt React das Attribut ganz weg.
- **Z. 26** Die Pfeilfunktion ist wichtig: Sie wird erst **beim Klick** ausgeführt. Ohne sie (`onClick={onSelect(number)}`) würde `onSelect` schon beim Zeichnen aufgerufen und nicht erst beim Klick. Je nach Funktion bekommt man dann Fehlermeldungen von React (zum Beispiel „Too many re-renders") oder eine Endlosschleife.
- **Z. 28–30** Nummer, Titel und Beschreibung. Das CSS zeigt die Beschreibung nur beim aktuellen Schritt an (`.demo-step[data-state="current"] .demo-step-text`) und blendet sie auf kleinen Bildschirmen aus.
- **Z. 31–37** Hier schließen nacheinander Button, Listenelement, `return`, `map`, die Liste und die Komponente.

**Typische Fragen**
- *Warum `key={step.title}` statt `key={index}`?* Mit dem Index funktioniert es hier auch, weil die Liste fest ist. Bei Listen, die sich ändern, würde React Elemente falsch zuordnen. Eine eigene feste Kennung ist die sauberere Gewohnheit.
- *Warum ist der aktuelle Schritt auch ein Button, der gesperrt ist?* So hat jeder Schritt dieselbe Struktur, und `aria-current` bleibt am selben Element.
- *Woher weiß der Stepper, welcher Schritt aktiv ist?* Gar nicht: Er bekommt `current` von `Demo`. Er hat keinen eigenen Zustand.

---

## Datei: `react/src/FilterBar.tsx` (Filter-Chips)

```tsx
  1 | import { providers } from "./data";
  2 | import type { ProviderId } from "./data";
  3 |
  4 | interface FilterBarProps {
  5 |     selected: ProviderId[];
  6 |     lowestPrice: boolean;
  7 |     onToggleProvider: (id: ProviderId) => void;
  8 |     onClearProviders: () => void;
  9 |     onToggleLowest: () => void;
 10 | }
 11 |
 12 | /* Provider chips plus the lowest-price toggle; an empty selection means all providers */
 13 | export function FilterBar({
 14 |     selected,
 15 |     lowestPrice,
 16 |     onToggleProvider,
 17 |     onClearProviders,
 18 |     onToggleLowest
 19 | }: FilterBarProps) {
```

- **Z. 1** Die Liste der vier Anbieter.
- **Z. 2** `import type` holt nur einen Typ. Die Zeile verschwindet beim Bauen komplett. Man trennt sie von normalen Importen, weil sie zur Laufzeit nichts bewirkt.
- **Z. 4–10** Die Props: `selected` ist die Liste der gewählten Anbieter (leer bedeutet „alle"), `lowestPrice` ist der Schalter für den Preisfilter. Die drei Funktionen melden dem Elternteil, was der Nutzer getan hat: einen Anbieter an- oder abwählen, die Anbieterauswahl löschen oder den Preisfilter umschalten.
- **Z. 12** Kommentar mit einer wichtigen Regel: Eine leere Auswahl bedeutet „alle Anbieter".
- **Z. 13–19** Die Komponente. Hier steht das Destructuring über mehrere Zeilen, nur weil es so besser lesbar ist. Es ist dasselbe wie in `Stepper`.

```tsx
 20 |     return (
 21 |         <div className="demo-filters" role="group" aria-label="Filters">
 22 |             <button
 23 |                 type="button"
 24 |                 className="demo-chip"
 25 |                 aria-pressed={selected.length === 0}
 26 |                 onClick={onClearProviders}
 27 |             >
 28 |                 All providers
 29 |             </button>
 30 |             {providers.map((provider) => (
 31 |                 <button
 32 |                     key={provider.id}
 33 |                     type="button"
 34 |                     className="demo-chip"
 35 |                     aria-pressed={selected.includes(provider.id)}
 36 |                     onClick={() => onToggleProvider(provider.id)}
 37 |                 >
 38 |                     <span className="demo-dot" style={{ background: provider.color }} />
 39 |                     {provider.name}
 40 |                 </button>
 41 |             ))}
 42 |             <button
 43 |                 type="button"
 44 |                 className="demo-chip"
 45 |                 aria-pressed={lowestPrice}
 46 |                 onClick={onToggleLowest}
 47 |             >
 48 |                 Lowest price
 49 |             </button>
 50 |         </div>
 51 |     );
 52 | }
```

- **Z. 21** Der Container. `role="group"` und `aria-label` fassen die Buttons für Screenreader zu einer Gruppe „Filters" zusammen.
- **Z. 22–29** Der Chip „All providers". `aria-pressed={selected.length === 0}` ist ein **Schalterzustand** (gedrückt oder nicht). Das CSS färbt Chips mit `aria-pressed="true"` ein. Dasselbe Attribut hören Screenreader als „gedrückt".
- **Z. 26** Hier wird die Funktion **direkt** übergeben, ohne Pfeilfunktion, weil sie keine Argumente braucht.
- **Z. 30** Macht aus jedem Anbieter einen Chip. Die runde Klammer nach `=>` heißt „gib dieses JSX direkt zurück" (kurze Form ohne `return`).
- **Z. 32** Eindeutiger Schlüssel pro Chip.
- **Z. 35** `includes` fragt, ob die Liste diese `id` enthält. Genau dann ist der Chip gedrückt.
- **Z. 36** Hier **braucht** man die Pfeilfunktion, weil die `id` mitgegeben wird.
- **Z. 38** Doppelte Klammern: Die äußeren öffnen den JavaScript-Ausdruck in JSX, die inneren sind das Objekt `{ background: ... }`. In React ist `style` ein Objekt. Der Punkt ist so ein farbiger Kreis in der Anbieterfarbe. Das `/>` am Ende schließt das Element ohne Inhalt.
- **Z. 39** Der Anbietername als Text.
- **Z. 42–49** Der Chip „Lowest price". Er funktioniert wie die anderen, nur mit `lowestPrice` als Zustand.
- **Z. 50–52** Schließt Container, `return` und Komponente.

**Typische Fragen**
- *Was ist der Unterschied zwischen `onClick={f}` und `onClick={() => f(x)}`?* Die erste Form übergibt die Funktion selbst, React ruft sie beim Klick auf. Die zweite verpackt den Aufruf, wenn man ein Argument mitgeben will.
- *Warum `aria-pressed` und nicht nur eine CSS-Klasse?* So sieht und hört man den Zustand auch ohne Maus und ohne Farben. Das CSS nutzt dasselbe Attribut, es braucht also keine zweite Quelle der Wahrheit.

---

## Datei: `react/src/BikeList.tsx` (die fünf besten Treffer)

```tsx
  1 | import { formatPrice, providerById } from "./data";
  2 | import type { Bike } from "./data";
  3 |
  4 | interface BikeListProps {
  5 |     /* Already sorted: by distance, or by price when the lowest-price filter is on */
  6 |     bikes: Bike[];
  7 |     selectedId: string | null;
  8 |     lowestPrice: boolean;
  9 |     onSelect: (id: string) => void;
 10 | }
 11 |
 12 | /* The five best matches as a list, so the choice also works without the map */
 13 | export function BikeList({ bikes, selectedId, lowestPrice, onSelect }: BikeListProps) {
 14 |     return (
 15 |         <div>
 16 |             <h3 className="demo-list-title">{lowestPrice ? "Cheapest bikes" : "Nearest bikes"}</h3>
 17 |             <ul className="demo-list">
 18 |                 {bikes.slice(0, 5).map((bike) => {
 19 |                     const provider = providerById(bike.provider);
 20 |                     return (
 21 |                         <li key={bike.id}>
 22 |                             <button
 23 |                                 type="button"
 24 |                                 className="demo-row"
 25 |                                 aria-pressed={bike.id === selectedId}
 26 |                                 onClick={() => onSelect(bike.id)}
 27 |                             >
 28 |                                 <span className="demo-dot" style={{ background: provider.color }} />
 29 |                                 <span className="demo-row-name">{provider.name}</span>
 30 |                                 <span>{bike.distance} m</span>
 31 |                                 <span>{formatPrice(provider.pricePer30)}</span>
 32 |                             </button>
 33 |                         </li>
 34 |                     );
 35 |                 })}
 36 |             </ul>
 37 |         </div>
 38 |     );
 39 | }
```

- **Z. 1–2** Zwei Hilfsfunktionen und der Typ `Bike` aus `data.ts`.
- **Z. 4–10** Props: Die Liste der Räder (schon sortiert), die gewählte `id` (`string | null`, `null` bedeutet „nichts gewählt"), der Preisfilter und eine Funktion für die Auswahl.
- **Z. 5** Der Kommentar zeigt eine Designentscheidung: Die Liste sortiert **nicht selbst**. Das macht `Demo` (in `sortedBikes`), und die Liste bleibt dadurch einfach.
- **Z. 13** Die Komponente mit Destructuring der vier Props.
- **Z. 15** Ein Wurzelelement, weil eine Komponente nur eines zurückgeben darf.
- **Z. 16** Ein Ternary im JSX: Der Titel ändert sich mit dem Preisfilter.
- **Z. 18** `slice(0, 5)` nimmt die ersten fünf Elemente und lässt die Originalliste unverändert. Danach macht `map` aus jedem Rad eine Zeile.
- **Z. 19** Schlägt zum Rad den Anbieter nach, für Farbe, Name und Preis.
- **Z. 21** Ein Listenelement mit eindeutigem Schlüssel.
- **Z. 25** Die Zeile ist „gedrückt", wenn dieses Rad das gewählte ist. Das CSS hebt sie dann hervor.
- **Z. 26** Meldet die Wahl mit der Rad-`id` nach oben.
- **Z. 28–31** Die vier Spalten: farbiger Punkt, Anbietername, Entfernung (`{bike.distance} m`) und Preis (`formatPrice(...)`).
- **Z. 32–39** Schließt Button, Listenelement, `map`, Liste, Wurzelelement und Komponente.

**Typische Fragen**
- *Warum nur fünf Räder in der Liste?* Die Karte zeigt alle. Die Liste ist eine Hilfe für den Fall, dass man die Karte nicht bedienen kann oder will, und fünf Zeilen bleiben übersichtlich.
- *Was passiert bei `slice`, wenn die Liste kürzer als fünf ist?* Dann bekommt man einfach weniger Elemente, es gibt keinen Fehler. Mit einem einzelnen Anbieter gibt es immer vier Räder.

---

## Mach es selbst

1. Zeige in `BikeList` die ersten **drei** statt fünf Räder. Welche Zahl änderst du?
2. Füge in `FilterBar` einen Chip „Reset" ein, der `onClearProviders` aufruft. Was muss sich in `Demo.tsx` ändern? (Nichts, weil die Funktion schon da ist.)
3. Was würde passieren, wenn in `BikeList` `onClick={onSelect(bike.id)}` stünde (ohne Pfeilfunktion)? Probiere es lokal aus und lies die Fehlermeldung in der Browser-Konsole. (Die Zeile danach wieder zurücksetzen.)
