# 3. Die Karte: `MapView.tsx`

Die Karte ist kein Bild und keine Karten-Bibliothek, sondern eine **SVG-Grafik**, die React zeichnet. SVG ist eine Beschreibung von Formen (Rechtecke, Kreise, Linien, Text) in einem eigenen Koordinatensystem. Jedes Rad ist ein kleiner Kreis, den React aus den Daten erzeugt.

**SVG-Grundlagen für diese Datei**
- Koordinaten: `x` geht nach rechts, `y` geht **nach unten**. (0, 0) ist links oben.
- `viewBox="0 0 360 300"` legt fest, welchen Ausschnitt man sieht. Das SVG skaliert dann auf jede beliebige Breite, ohne dass man die Zahlen ändern muss.
- Wichtige Formen: `<rect>` (Rechteck), `<circle cx cy r>` (Kreis mit Mittelpunkt und Radius), `<path d="...">` (Linien), `<text>`, `<g>` (Gruppe), `<title>` (Tooltip).
- Pfadbefehle in `d`: `M x y` bewegt den Stift ohne zu zeichnen, `L x y` zieht eine Linie, `H x` eine waagerechte, `V y` eine senkrechte Linie.

---


## Imports und Props

```tsx
  1 | import { MAP, formatPrice, providerById } from "./data";
  2 | import type { Bike } from "./data";
  3 |
  4 | interface MapViewProps {
  5 |     bikes: Bike[];
  6 |     selectedId: string | null;
  7 |     /* Ids of the cheapest visible bikes while the lowest-price filter is on, otherwise null */
  8 |     cheapestIds: Set<string> | null;
  9 |     onSelect: (id: string) => void;
 10 | }
 11 |
 12 | /* A stylised street map drawn as SVG; every bike is a keyboard-reachable button */
 13 | export function MapView({ bikes, selectedId, cheapestIds, onSelect }: MapViewProps) {
```

- **Z. 1** Die Kartenmaße, die Preisformatierung und die Anbietersuche aus `data.ts`.
- **Z. 2** Nur der Typ `Bike`.
- **Z. 4–10** Die Props: `bikes` sind die **sichtbaren** Räder (nach dem Filter), `selectedId` ist das gewählte Rad, `onSelect` meldet die Wahl.
- **Z. 8** Ein `Set` ist eine Sammlung ohne Doppelte mit schneller Suche (`.has`). Der Wert ist `null`, wenn der Preisfilter aus ist, und sonst die Menge der `id`s der günstigsten Räder. Der Kommentar darüber erklärt das.
- **Z. 13** Die Komponente mit Destructuring der vier Props.

## Die Kartenfläche

```tsx
 14 |     return (
 15 |         <svg
 16 |             className="demo-map"
 17 |             viewBox={`0 0 ${MAP.width} ${MAP.height}`}
 18 |             role="group"
 19 |             aria-label="Map of nearby shared bikes"
 20 |         >
 21 |             <rect width={MAP.width} height={MAP.height} fill="var(--bg-elevated)" />
 22 |             <rect x="215" y="195" width="110" height="80" rx="10" fill="rgba(31, 143, 90, 0.35)" />
 23 |             <g stroke="rgba(125, 255, 179, 0.14)" strokeWidth="6" fill="none" strokeLinecap="round">
 24 |                 <path d="M0 80 H360" />
 25 |                 <path d="M0 215 H360" />
 26 |                 <path d="M105 0 V300" />
 27 |                 <path d="M265 0 V300" />
 28 |                 <path d="M0 290 L360 20" strokeWidth="3" />
 29 |             </g>
 30 |
 31 |             <circle cx={MAP.user.x} cy={MAP.user.y} r="18" fill="rgba(125, 255, 179, 0.16)" />
 32 |             <circle
 33 |                 cx={MAP.user.x}
 34 |                 cy={MAP.user.y}
 35 |                 r="6"
 36 |                 fill="var(--accent)"
 37 |                 stroke="var(--ink)"
 38 |                 strokeWidth="2"
 39 |             />
 40 |             <text x={MAP.user.x} y={MAP.user.y + 32} textAnchor="middle" fontSize="11" fill="var(--ink)">
 41 |                 You
 42 |             </text>
```

- **Z. 15–20** Das äußere Element. `viewBox` bekommt einen **Template-Literal-Text** in geschweiften Klammern: `0 0 360 300`, aus `MAP.width` und `MAP.height`. `role="group"` und `aria-label` beschreiben die Karte für Screenreader.
- **Z. 21** Der Hintergrund: ein Rechteck über die ganze Fläche. `fill="var(--bg-elevated)"` nutzt die CSS-Variable der Seite, damit die Karte zur Farbwelt passt.
- **Z. 22** Ein grünes Rechteck mit runden Ecken (`rx`) als „Park".
- **Z. 23** Eine Gruppe. Attribute an `<g>` (Strichfarbe, Strichstärke, keine Füllung, runde Enden) gelten für alle Elemente darin. `strokeWidth` in camelCase, wie in JSX üblich.
- **Z. 24–27** Vier gerade Straßen: zwei waagerecht (`H`) und zwei senkrecht (`V`).
- **Z. 28** Eine diagonale Straße. Hier überschreibt `strokeWidth="3"` den Wert der Gruppe.
- **Z. 31** Ein großer, halbtransparenter Kreis als Hof um den Standort.
- **Z. 32–39** Der Standortpunkt des Fahrers in der Akzentfarbe, mit hellem Rand.
- **Z. 40–42** Der Text „You". `textAnchor="middle"` zentriert ihn auf dem x-Wert, `y + 32` setzt ihn unter den Punkt.

## Die Räder

```tsx
 44 |             {bikes.map((bike) => {
 45 |                 const provider = providerById(bike.provider);
 46 |                 const isSelected = bike.id === selectedId;
 47 |                 const isCheapest = cheapestIds !== null && cheapestIds.has(bike.id);
 48 |                 const dimmed = cheapestIds !== null && !isCheapest;
 49 |                 const label = `${provider.name} bike, ${bike.distance} metres away, ${formatPrice(provider.pricePer30)} per 30 minutes`;
 50 |
 51 |                 return (
 52 |                     <g
 53 |                         key={bike.id}
 54 |                         className="demo-marker"
 55 |                         role="button"
 56 |                         tabIndex={0}
 57 |                         aria-pressed={isSelected}
 58 |                         aria-label={label}
 59 |                         opacity={dimmed ? 0.3 : 1}
```

- **Z. 44** Aus jedem sichtbaren Rad entsteht ein Marker. Die Funktion hat einen Block mit `{ ... }`, weil davor noch Variablen berechnet werden.
- **Z. 45** Der Anbieter zu diesem Rad (Farbe, Name, Preis).
- **Z. 46** Ist das genau das gewählte Rad?
- **Z. 47** `cheapestIds !== null && cheapestIds.has(bike.id)`: Zuerst wird geprüft, ob es die Menge gibt. Nur dann fragt `.has`, ob dieses Rad darin vorkommt. `&&` bricht ab, wenn der linke Teil falsch ist, deshalb gibt es bei `null` keinen Fehler.
- **Z. 48** Wenn der Preisfilter an ist und dieses Rad nicht zu den günstigsten gehört, wird es abgeblendet.
- **Z. 49** Ein beschreibender Text für Screenreader und Tooltip, zum Beispiel „LimeBike bike, 32 metres away, €1.50 per 30 minutes".
- **Z. 52–59** Jedes Rad ist eine Gruppe, die sich wie ein Button verhält. `key={bike.id}` identifiziert sie. Die Eigenschaften von `<g>`: `role="button"` sagt Screenreadern, dass man klicken kann. `tabIndex={0}` macht sie per Tab-Taste erreichbar. `aria-pressed` zeigt, ob es das gewählte ist. `aria-label` ist der Text von oben. `opacity` ist 0,3 für abgeblendete und sonst 1.

## Klick, Tastatur, Darstellung

```tsx
 60 |                         onClick={() => onSelect(bike.id)}
 61 |                         onKeyDown={(event) => {
 62 |                             if (event.key === "Enter" || event.key === " ") {
 63 |                                 event.preventDefault();
 64 |                                 onSelect(bike.id);
 65 |                             }
 66 |                         }}
 67 |                     >
 68 |                         <title>{label}</title>
 69 |                         <circle cx={bike.x} cy={bike.y} r="16" fill="transparent" />
 70 |                         <circle
 71 |                             className="demo-marker-dot"
 72 |                             cx={bike.x}
 73 |                             cy={bike.y}
 74 |                             r={isSelected ? 12 : 9}
 75 |                             fill={provider.color}
 76 |                             stroke={isSelected ? "var(--ink)" : isCheapest ? "var(--accent)" : "#062016"}
 77 |                             strokeWidth={isSelected ? 3.5 : isCheapest ? 3 : 2}
 78 |                         />
 79 |                     </g>
 80 |                 );
 81 |             })}
 82 |         </svg>
 83 |     );
 84 | }
```

- **Z. 60** Klick: meldet die `id` des Rades nach oben.
- **Z. 61–66** Tastatur: Weil ein `<g>` kein echter Button ist, muss man Enter und Leertaste selbst behandeln. `event.key === "Enter" || event.key === " "` prüft die beiden Tasten. `event.preventDefault()` verhindert die Standardaktion (die Leertaste würde sonst die Seite scrollen). Dann wird gewählt.
- **Z. 68** In SVG zeigt ein `<title>` im Element einen Tooltip beim Daraufzeigen.
- **Z. 69** Ein unsichtbarer, größerer Kreis. Er vergrößert die Fläche, die man treffen muss. Mit dem Finger auf dem Handy ist das wichtig.
- **Z. 70–78** Der sichtbare Punkt. `className="demo-marker-dot"` wird vom CSS für den Tastaturfokus genutzt. `r={isSelected ? 12 : 9}` macht das gewählte Rad größer. `fill={provider.color}` färbt nach Anbieter.
- **Z. 76** Der Rand: Gewählte Räder bekommen einen hellen Rand, die günstigsten einen grünen und alle anderen einen dunklen. Das ist ein verschachtelter Ternary mit der Reihenfolge der Wichtigkeit.
- **Z. 77** Die Randdicke folgt derselben Logik.
- **Z. 79–84** Schließt Marker, `return`, `map`, das `<svg>` und die Komponente.

## Typische Fragen

- **Warum SVG und keine Karten-Bibliothek?** Die Demo braucht nur 16 Punkte auf einer stilisierten Karte. Eine Karten-Bibliothek wie Leaflet würde zusätzlichen Code laden und echte Kartendaten brauchen.
- **Wie wird die Karte barrierefrei?** Jedes Rad ist per Tab erreichbar und hat `role="button"`, einen `aria-label` und eine Tastenbehandlung für Enter und Leertaste. Die Liste unter der Karte bietet dieselbe Auswahl noch einmal.
- **Warum zwei Kreise pro Rad?** Der sichtbare Punkt ist klein, damit die Karte übersichtlich bleibt. Der unsichtbare Kreis vergrößert nur die klickbare Fläche.
- **Was ist der Unterschied zwischen `fill` und `stroke`?** `fill` ist die Füllfarbe, `stroke` die Randfarbe.

## Mach es selbst

1. Füge einen weiteren Straßenzug hinzu, zum Beispiel `<path d="M0 150 H360" />`. Wo erscheint er?
2. Vergrößere die sichtbaren Punkte (`r={isSelected ? 12 : 9}`). Ab welcher Größe wäre der unsichtbare Kreis darunter nicht mehr nötig?
3. Verschiebe den Park (das grüne Rechteck, Zeile 22) in eine andere Ecke. Welche Zahlen musst du ändern?
