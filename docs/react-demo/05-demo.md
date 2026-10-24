# 5. Der Kern: `Demo.tsx`

`Demo` ist der „Chef" der App. Hier liegt der gesamte Zustand, hier werden alle Werte berechnet, und hier stehen alle Funktionen, die auf Klicks reagieren. Die anderen Komponenten bekommen davon nur, was sie brauchen. Wenn du diese Datei verstehst, verstehst du die Demo.

## Überblick: Zustand und abgeleitete Werte

**Zustand (State):** Das merkt sich React zwischen den Zeichnungen. Jede Änderung löst eine neue Zeichnung aus.

| Zustand | Typ | Bedeutung | Anfangswert |
| --- | --- | --- | --- |
| `selectedProviders` | Liste von Anbietern | gewählte Filter-Chips (leer = alle) | `[]` |
| `lowestPrice` | wahr/falsch | Preisfilter an? | `false` |
| `selectedId` | Text oder `null` | das gewählte Rad | `null` |
| `step` | Zahl | aktueller Schritt (1 bis 5) | `1` |
| `payMethod` | `"card"` oder `"paypal"` | gewählte Zahlungsart | `"card"` |
| `paying` | wahr/falsch | Zahlung läuft gerade | `false` |

**Abgeleitete Werte:** Diese werden bei jeder Zeichnung **aus dem Zustand berechnet** und nicht selbst gespeichert: `visibleBikes`, `sortedBikes`, `cheapestIds`, `selectedBike`, `closestAll`, `closestVisible`, `filterActive` und `hint`. Die Regel dahinter: *Speichere nichts, was du aus anderem Zustand berechnen kannst.* Sonst können zwei Werte irgendwann nicht mehr zusammenpassen.

**Wie man zwischen den Schritten wechselt**

| Ereignis | Funktion | Ergebnis |
| --- | --- | --- |
| Filter angeklickt (bei Schritt 1) | `applyProviders` / `toggleLowest` | Schritt 2 |
| Rad auf Karte oder in Liste gewählt | `selectBike` | Schritt 3 |
| „Continue to payment" | `setStep(4)` im JSX | Schritt 4 |
| „Pay …" | `setPaying(true)`, danach der Timer | nach 0,9 s Schritt 5 |
| Schritt links angeklickt | `goToStep` | zurück zu Schritt 1, 2 oder 3 |
| „Start over" | `reset` | alles auf Anfang |

---


## Imports und die Hilfsfunktion `closest`

```tsx
  1 | import { useEffect, useMemo, useState } from "react";
  2 | import { bikePrice, bikes, formatPrice, providerById, steps } from "./data";
  3 | import type { Bike, PayMethod, ProviderId } from "./data";
  4 | import { BikeList } from "./BikeList";
  5 | import { FilterBar } from "./FilterBar";
  6 | import { MapView } from "./MapView";
  7 | import { Payment } from "./Payment";
  8 | import { Stepper } from "./Stepper";
  9 | import { Unlock } from "./Unlock";
 10 |
 11 | function closest(list: Bike[]): Bike {
 12 |     return list.reduce((best, bike) => (bike.distance < best.distance ? bike : best));
 13 | }
 14 |
 15 | /* The interactive Go One demo: map, filters, choice, payment and unlock, all with sample data */
 16 | export function Demo() {
```

- **Z. 1** Die drei React-Werkzeuge, die hier gebraucht werden (siehe Kapitel 0).
- **Z. 2** Daten und Hilfsfunktionen aus `data.ts`.
- **Z. 3** Nur Typen, sie verschwinden beim Bauen.
- **Z. 4–9** Die sechs Kindkomponenten.
- **Z. 11** Eine kleine Hilfsfunktion außerhalb der Komponente. Sie bekommt eine Liste von Rädern und gibt das nächste zurück. Sie steht außerhalb, weil sie keinen State braucht und nicht bei jeder Zeichnung neu erzeugt werden soll.
- **Z. 12** `reduce` geht die Liste durch und führt dabei einen Wert mit (`best`, der bisher beste). Ohne Startwert beginnt es mit dem ersten Element. Bei jedem Rad bleibt das mit der kleineren `distance`. Bei einer **leeren** Liste würde `reduce` einen Fehler werfen. Das kann hier nicht passieren, weil jeder Anbieter vier Räder hat und der Filter nie alles entfernt.
- **Z. 16** Die Komponente. Sie hat **keine Props**, weil sie die oberste ist.

## Der Zustand

```tsx
 17 |     const [selectedProviders, setSelectedProviders] = useState<ProviderId[]>([]);
 18 |     const [lowestPrice, setLowestPrice] = useState(false);
 19 |     const [selectedId, setSelectedId] = useState<string | null>(null);
 20 |     const [step, setStep] = useState(1);
 21 |     const [payMethod, setPayMethod] = useState<PayMethod>("card");
 22 |     const [paying, setPaying] = useState(false);
```

- **Z. 17** `useState` gibt ein **Paar** zurück: den aktuellen Wert und eine Funktion, um ihn zu ändern. Die eckigen Klammern links sind Destructuring für dieses Paar. `<ProviderId[]>` legt den Typ fest (Liste von Anbietern). `([])` ist der Anfangswert, eine leere Liste. Wichtig: Man ändert den Wert **nie direkt**, sondern nur über die Funktion. Sie sagt React, dass neu gezeichnet werden muss.
- **Z. 18** Hier erkennt TypeScript den Typ selbst: wahr/falsch.
- **Z. 19** Der Typ muss hier angegeben werden, denn aus `null` allein kann TypeScript nicht ableiten, dass später auch ein Text kommt.
- **Z. 20** Die Nummer des Schritts.
- **Z. 21** Die Zahlungsart, am Anfang „card".
- **Z. 22** Merkt, ob die Zahlung läuft.

## Berechnete Werte (`useMemo`)

```tsx
 24 |     /* Bikes that pass the provider filter; an empty selection means all providers */
 25 |     const visibleBikes = useMemo(
 26 |         () =>
 27 |             bikes.filter(
 28 |                 (bike) => selectedProviders.length === 0 || selectedProviders.includes(bike.provider)
 29 |             ),
 30 |         [selectedProviders]
 31 |     );
 32 |
 33 |     const sortedBikes = useMemo(
 34 |         () =>
 35 |             [...visibleBikes].sort((a, b) =>
 36 |                 lowestPrice
 37 |                     ? bikePrice(a) - bikePrice(b) || a.distance - b.distance
 38 |                     : a.distance - b.distance
 39 |             ),
 40 |         [visibleBikes, lowestPrice]
 41 |     );
 42 |
 43 |     const cheapestIds = useMemo(() => {
 44 |         if (!lowestPrice) {
 45 |             return null;
 46 |         }
 47 |         const lowest = Math.min(...visibleBikes.map(bikePrice));
 48 |         return new Set(visibleBikes.filter((bike) => bikePrice(bike) === lowest).map((bike) => bike.id));
 49 |     }, [lowestPrice, visibleBikes]);
 50 |
 51 |     const selectedBike = bikes.find((bike) => bike.id === selectedId) ?? null;
 52 |     const closestAll = closest(bikes);
 53 |     const closestVisible = closest(visibleBikes);
 54 |     const filterActive = selectedProviders.length > 0;
```

- **Z. 24** Kommentar: Eine leere Auswahl heißt „alle Anbieter".
- **Z. 25** `useMemo(funktion, [abhängigkeiten])` führt die Funktion aus und **merkt sich das Ergebnis**. Es wird nur dann neu berechnet, wenn sich etwas in der Abhängigkeitsliste (`[selectedProviders]`, Zeile 30) ändert. Sonst bekommt man das gespeicherte Ergebnis. Das bringt zweierlei: Es spart Arbeit, und die Liste bleibt dieselbe, solange sich nichts ändert.
- **Z. 27–29** `filter` behält nur die Räder, bei denen die Bedingung stimmt: Entweder ist nichts gewählt (`length === 0`, dann gelten alle) oder der Anbieter des Rades ist in der Auswahl (`includes`).
- **Z. 33** Die sortierte Liste für `BikeList`.
- **Z. 35** Der Spread `[...visibleBikes]` macht zuerst eine **Kopie**. Das ist wichtig, weil `sort` die Liste, auf der es aufgerufen wird, **verändert**. Würde man das Original sortieren, änderte man Daten, die React als unveränderlich behandeln will.
- **Z. 36–38** Die Vergleichsfunktion von `sort` liefert eine negative Zahl (a zuerst), null (gleich) oder eine positive Zahl (b zuerst). Bei aktivem Preisfilter: erst nach Preis, `bikePrice(a) - bikePrice(b)`. Bei gleichem Preis ist die Differenz 0. Dann greift `||` und nimmt die Entfernungsdifferenz. Das funktioniert, weil 0 in JavaScript als „falsch" gilt. Ohne Preisfilter: nur nach Entfernung.
- **Z. 40** Die Abhängigkeiten: Die Sortierung wird neu berechnet, wenn sich einer der beiden Werte ändert.
- **Z. 43** Hier hat die Funktion einen Block `{ }`, weil sie mehrere Anweisungen enthält.
- **Z. 44–46** Ist der Preisfilter aus, gibt es keine „günstigsten". Dann ist das Ergebnis `null`, so wie `MapView` es erwartet.
- **Z. 47** `visibleBikes.map(bikePrice)` macht aus den Rädern eine Liste von Preisen. Die drei Punkte (Spread) verteilen die Liste als einzelne Argumente an `Math.min`. Das Ergebnis ist der kleinste Preis.
- **Z. 48** Die `id`s aller sichtbaren Räder mit genau diesem Preis (`filter`, dann `map` auf die `id`), als `Set`.
- **Z. 49** Das Ende der Funktion und die Abhängigkeiten.
- **Z. 51** Das gewählte Rad wird aus der `id` **abgeleitet**, nicht noch einmal gespeichert. `find` liefert `undefined`, wenn nichts passt. `?? null` macht daraus `null`. Das ist nützlich, weil `null` als Wert für „nichts gewählt" im ganzen Code gleich benutzt wird.
- **Z. 52** Das nächste Rad insgesamt, immer aus **allen** Rädern.
- **Z. 53** Das nächste Rad unter den sichtbaren.
- **Z. 54** Ist mindestens ein Anbieter gewählt?

## Der Bezahl-Timer (`useEffect`)

```tsx
 56 |     /* Payment takes a moment, then the flow moves on to the unlock step */
 57 |     useEffect(() => {
 58 |         if (!paying) {
 59 |             return undefined;
 60 |         }
 61 |         const timer = window.setTimeout(() => {
 62 |             setPaying(false);
 63 |             setStep(5);
 64 |         }, 900);
 65 |         return () => window.clearTimeout(timer);
 66 |     }, [paying]);
```

- **Z. 56** Kommentar: Das Bezahlen soll einen Moment dauern, danach folgt der Entsperr-Schritt.
- **Z. 57** `useEffect` führt Code **nach dem Zeichnen** aus. Es ist für Dinge gedacht, die nicht zum Zeichnen gehören: Timer, Netzwerkanfragen, Ereignisse im Browser. Der Code läuft nur dann, wenn sich etwas in der Abhängigkeitsliste (Zeile 66) ändert. Hier ist das `paying`.
- **Z. 58–60** Wenn gerade nicht bezahlt wird, passiert nichts. `return undefined` beendet den Effekt ohne Aufräumarbeit.
- **Z. 61** Startet einen Timer im Browser. `setTimeout` führt die Funktion einmal nach der angegebenen Zeit aus und gibt eine Nummer zurück, mit der man ihn abbrechen kann.
- **Z. 62–63** Nach Ablauf: Die Zahlung ist beendet, und der Schritt wird auf 5 gesetzt.
- **Z. 64** Die Zeit in Millisekunden: 0,9 Sekunden.
- **Z. 65** Eine **Aufräumfunktion**. React ruft sie auf, bevor der Effekt erneut läuft oder wenn die Komponente verschwindet. So wird ein laufender Timer abgebrochen, statt später noch etwas zu verändern.
- **Z. 66** Die Abhängigkeit. Der Effekt läuft nach der ersten Zeichnung und danach jedes Mal, wenn sich `paying` ändert.

## Die Funktionen für Klicks

```tsx
 68 |     const applyProviders = (next: ProviderId[]) => {
 69 |         setSelectedProviders(next);
 70 |         if (selectedBike && next.length > 0 && !next.includes(selectedBike.provider)) {
 71 |             /* The chosen bike is filtered out, so the choice starts again */
 72 |             setSelectedId(null);
 73 |             setStep(2);
 74 |         } else if (step === 1) {
 75 |             setStep(2);
 76 |         }
 77 |     };
```

- **Z. 68** Setzt eine neue Anbieterauswahl. Das ist eine Pfeilfunktion, die in einer Konstanten steckt.
- **Z. 69** Merkt sich die neue Auswahl.
- **Z. 70** Prüft drei Dinge: Es gibt ein gewähltes Rad, die neue Auswahl ist nicht leer (leer heißt „alle", dann bleibt jedes Rad sichtbar) und der Anbieter des gewählten Rades ist **nicht** mehr in der Auswahl.
- **Z. 72–73** In diesem Fall wird das gewählte Rad vergessen und auf Schritt 2 zurückgegangen, weil das Rad von der Karte verschwindet.
- **Z. 74–75** Sonst: Wenn man noch bei Schritt 1 ist, geht es mit dem ersten Filter zu Schritt 2.

Wichtig zu `selectedBike` und `step` in dieser Funktion: Sie haben den Wert der **aktuellen Zeichnung**. Setzt man mehrere Zustände nacheinander, werden die Änderungen gesammelt und React zeichnet **einmal** neu.

```tsx
 79 |     const toggleProvider = (id: ProviderId) => {
 80 |         applyProviders(
 81 |             selectedProviders.includes(id)
 82 |                 ? selectedProviders.filter((item) => item !== id)
 83 |                 : [...selectedProviders, id]
 84 |         );
 85 |     };
 86 |
 87 |     const toggleLowest = () => {
 88 |         setLowestPrice((value) => !value);
 89 |         if (step === 1) {
 90 |             setStep(2);
 91 |         }
 92 |     };
 93 |
 94 |     const selectBike = (id: string) => {
 95 |         setSelectedId(id);
 96 |         setStep(3);
 97 |     };
```

- **Z. 79** Schaltet einen Anbieter an oder aus.
- **Z. 80–84** Ist der Anbieter schon gewählt (`includes`), wird er mit `filter` entfernt. Sonst wird er mit dem Spread `[...selectedProviders, id]` angehängt. Beides **erzeugt eine neue Liste**. Man verändert nie die Liste im State selbst, sonst erkennt React die Änderung nicht.
- **Z. 87** Schaltet den Preisfilter um.
- **Z. 88** Eine **Funktion als Argument**: React gibt den aktuellen Wert hinein (`value`), und die Funktion liefert den neuen (`!value`, das Gegenteil). Das ist die sichere Form, wenn der neue Wert vom alten abhängt.
- **Z. 89–91** Beim ersten Filter geht es zu Schritt 2.
- **Z. 94–97** Wird für Karte und Liste verwendet. Merkt sich die `id` und geht zu Schritt 3.

```tsx
 99 |     const goToStep = (target: number) => {
100 |         if (target >= step || paying) {
101 |             return;
102 |         }
103 |         setStep(target);
104 |         if (target < 3) {
105 |             setSelectedId(null);
106 |         }
107 |     };
108 |
109 |     const reset = () => {
110 |         setSelectedProviders([]);
111 |         setLowestPrice(false);
112 |         setSelectedId(null);
113 |         setStep(1);
114 |         setPayMethod("card");
115 |         setPaying(false);
116 |     };
117 |
118 |     const hint =
119 |         step === 1
120 |             ? "Every dot is a bike from a different provider. Tap a filter or pick a bike."
121 |             : "Pick a bike on the map or from the list.";
```

- **Z. 99** Wird vom Stepper aufgerufen.
- **Z. 100** Schutz: Man darf nur **zurück** springen (nicht vorwärts, nicht auf denselben Schritt), und nicht während einer Zahlung. Dann beendet `return` die Funktion ohne etwas zu tun.
- **Z. 103** Springt zum gewünschten Schritt.
- **Z. 104–106** Geht man auf Schritt 1 oder 2 zurück, wird das gewählte Rad vergessen. Bei 3 bleibt es erhalten.
- **Z. 109–116** Setzt alle sechs Zustände auf ihre Anfangswerte zurück.
- **Z. 118–121** Der Hinweistext hängt vom Schritt ab: bei Schritt 1 einer, danach der andere.

## Das JSX: was auf dem Bildschirm steht

```tsx
123 |     return (
124 |         <div className="demo-layout">
125 |             <p className="demo-sr-only" role="status">
126 |                 {`Step ${step} of ${steps.length}: ${steps[step - 1].title}`}
127 |             </p>
128 |
129 |             <Stepper current={step} locked={paying} onSelect={goToStep} />
130 |
131 |             <div className="demo-panel">
132 |                 <p className="demo-note">Sample data, not live bikes</p>
133 |
134 |                 {step <= 3 && (
135 |                     <>
136 |                         <p className="demo-hint">{hint}</p>
137 |                         <FilterBar
138 |                             selected={selectedProviders}
139 |                             lowestPrice={lowestPrice}
140 |                             onToggleProvider={toggleProvider}
141 |                             onClearProviders={() => applyProviders([])}
142 |                             onToggleLowest={toggleLowest}
143 |                         />
```

- **Z. 123** Ab hier beginnt das, was gezeichnet wird.
- **Z. 124** Das Wurzelelement. Das CSS legt Stepper und Panel in zwei Spalten.
- **Z. 125–127** Ein Absatz, den man **nicht sieht** (die CSS-Klasse blendet ihn aus), den Screenreader aber vorlesen. `role="status"` macht daraus einen Bereich, dessen Änderungen angesagt werden. So hört man beim Wechsel „Step 3 of 5: Choose".
- **Z. 126** Ein Template-Literal in geschweiften Klammern. `steps[step - 1]` greift auf das Element zu, dessen Position eins niedriger ist als die Schrittnummer, weil Listen bei 0 beginnen.
- **Z. 129** Der Stepper bekommt den Schritt, ob gesperrt ist, und die Funktion `goToStep`. `onSelect={goToStep}` reicht die Funktion **selbst** weiter, ohne Klammern.
- **Z. 131** Die rechte Karte.
- **Z. 134** **Bedingtes Zeichnen:** `a && b` ergibt `b`, wenn `a` wahr ist. Ist `a` falsch, wird nichts gezeichnet. So erscheinen Karte, Filter und Liste nur in den Schritten 1 bis 3.
- **Z. 135** Ein Fragment: Es fasst mehrere Elemente zusammen, ohne ein zusätzliches Element in die Seite zu setzen.
- **Z. 137–143** Alle Props der Filterleiste. Die zwei Funktionen, die Argumente brauchen oder festlegen, stehen als Pfeilfunktion: `onClearProviders={() => applyProviders([])}`. Eine leere Liste bedeutet „alle".

```tsx
144 |                         <MapView
145 |                             bikes={visibleBikes}
146 |                             selectedId={selectedId}
147 |                             cheapestIds={cheapestIds}
148 |                             onSelect={selectBike}
149 |                         />
150 |                         <p className="demo-insight">
151 |                             {filterActive && closestVisible.distance !== closestAll.distance ? (
152 |                                 <>
153 |                                     Closest bike in this filter: <strong>{closestVisible.distance} m</strong>.
154 |                                     Closest from any provider: <strong>{closestAll.distance} m</strong>.
155 |                                 </>
156 |                             ) : (
157 |                                 <>
158 |                                     Closest bike: <strong>{closestVisible.distance} m</strong> (
159 |                                     {providerById(closestVisible.provider).name}).
160 |                                 </>
161 |                             )}
162 |                         </p>
163 |                         <BikeList
164 |                             bikes={sortedBikes}
165 |                             selectedId={selectedId}
166 |                             lowestPrice={lowestPrice}
167 |                             onSelect={selectBike}
168 |                         />
169 |                         {selectedBike && step === 3 && (
170 |                             <div className="demo-actions">
171 |                                 <p className="demo-summary">
172 |                                     Selected: {providerById(selectedBike.provider).name}, {selectedBike.distance} m,{" "}
173 |                                     {formatPrice(bikePrice(selectedBike))}
174 |                                 </p>
175 |                                 <button type="button" className="btn btn-primary" onClick={() => setStep(4)}>
176 |                                     Continue to payment
177 |                                 </button>
178 |                             </div>
179 |                         )}
180 |                     </>
181 |                 )}
```

- **Z. 144–149** Die Karte bekommt die **sichtbaren** Räder, die Auswahl und `cheapestIds`.
- **Z. 150–162** Der Satz unter der Karte. Er zeigt den Nutzen der App.
- **Z. 151** Zwei Bedingungen: Ein Filter ist aktiv **und** das nächste Rad im Filter ist ein anderes als das nächste Rad insgesamt.
- **Z. 152–155** Wenn ja: „Closest bike in this filter: 70 m. Closest from any provider: 32 m." Damit sieht man den Vorteil der Zusammenführung.
- **Z. 156–161** Sonst: der kürzere Satz „Closest bike: 32 m (LimeBike)."
- **Z. 159** Der Anbietername des nächsten Rades.
- **Z. 163–168** Die sortierte Liste.
- **Z. 169** Der Weiter-Button erscheint nur, wenn ein Rad gewählt ist **und** der aktuelle Schritt 3 ist.
- **Z. 172** Ein ausdrückliches Leerzeichen. JSX entfernt Leerzeichen am Zeilenende, deshalb muss man es hier selbst schreiben.
- **Z. 175** Der Button führt zu Schritt 4.

```tsx
183 |                 {step === 4 && selectedBike && (
184 |                     <Payment
185 |                         bike={selectedBike}
186 |                         method={payMethod}
187 |                         paying={paying}
188 |                         onMethod={setPayMethod}
189 |                         onPay={() => setPaying(true)}
190 |                         onBack={() => setStep(3)}
191 |                     />
192 |                 )}
193 |
194 |                 {step === 5 && selectedBike && <Unlock bike={selectedBike} onReset={reset} />}
195 |             </div>
196 |         </div>
197 |     );
198 | }
```

- **Z. 183** Die Bezahlansicht gibt es nur bei Schritt 4 **und** wenn ein Rad gewählt ist. Das zweite hilft TypeScript: Innerhalb dieser Klammer weiß es, dass `selectedBike` nicht `null` ist.
- **Z. 188** Die Setter-Funktion wird direkt weitergegeben, weil sie genau einen neuen Wert annimmt.
- **Z. 189** Löst den Timer aus: Der Effekt läuft, weil sich `paying` ändert.
- **Z. 190** Zurück zur Auswahl, das Rad bleibt gewählt.
- **Z. 194** Der Entsperr-Schritt, mit `reset` für „Start over".

## Der Weg eines Klicks (Beispiel: Filter „Nextbike")

1. Der Nutzer klickt auf den Chip. In `FilterBar` wird `onToggleProvider("nextbike")` aufgerufen. Das ist `toggleProvider` aus `Demo`.
2. `toggleProvider` baut die neue Liste `["nextbike"]` und ruft `applyProviders` auf.
3. `applyProviders` setzt `selectedProviders` und, weil `step` noch 1 ist, `step` auf 2.
4. React zeichnet `Demo` neu. `visibleBikes` ist jetzt eine Liste mit vier Rädern, weil sich `selectedProviders` geändert hat.
5. `MapView` bekommt nur diese vier. Der Chip ist gedrückt (`aria-pressed`). Der Stepper zeigt „Filters". Der Satz unter der Karte nennt 70 m und 32 m.

## Typische Fragen

- **Was ist der Unterschied zwischen Props und State?** Props bekommt eine Komponente von oben, sie darf sie nicht ändern. State gehört der Komponente selbst, und ihre Änderung löst eine neue Zeichnung aus.
- **Warum liegt der State in `Demo` und nicht in den Kindern?** Mehrere Kinder brauchen dieselben Daten: Karte, Liste und Stepper wissen alle, welches Rad gewählt ist. Mit einem gemeinsamen Besitzer gibt es nur eine Wahrheit. Das nennt man *lifting state up*.
- **Warum `useMemo`?** Es spart Arbeit und hält das Ergebnis stabil, solange sich die Eingaben nicht ändern. Bei nur 16 Rädern wäre die Demo auch ohne schnell. Es ist ein Muster, das bei größeren Datenmengen wichtig wird.
- **Warum wird vor `sort` kopiert?** `sort` verändert die Liste selbst. Ein Verändern von Listen, die zum State gehören, ist in React ein Fehler.
- **Wozu die Aufräumfunktion im Effekt?** Sie bricht einen noch laufenden Timer ab, falls `paying` sich ändert oder die Komponente verschwindet, bevor er abläuft.
- **Warum `key` bei Listen?** React erkennt daran, welches Element welches ist, wenn sich die Liste ändert, und kann so nur die nötigen Teile aktualisieren.
- **Was passiert, wenn man `setStep(5)` direkt im Funktionskörper der Komponente aufruft?** React bekäme bei jeder Zeichnung eine Zustandsänderung, die wieder eine Zeichnung auslöst: eine Endlosschleife. Zustand ändert man nur in Ereignisfunktionen oder in Effekten.
- **Warum ist `selectedBike` kein State?** Es lässt sich jederzeit aus `selectedId` berechnen. Zwei gespeicherte Werte könnten sich widersprechen.

## Mach es selbst

1. Ändere die Wartezeit des Bezahlens auf 1500 Millisekunden. Welche Zahl änderst du?
2. Füge einen Button „Cancel" in der Bezahlansicht hinzu, der die Demo zurücksetzt. Welche Funktion kannst du wiederverwenden, und was musst du in `Payment` ergänzen?
3. Zeige den Hinweis „Closest bike" nur dann, wenn mehr als ein Anbieter gewählt ist. Wo änderst du die Bedingung?
4. Was würde passieren, wenn die Abhängigkeitsliste des Effekts `[]` wäre (Zeile 66)? Überlege zuerst und probiere es dann lokal aus. (Hinweis: Wann läuft ein Effekt mit leerer Liste, und welchen Wert hat `paying` zu diesem Zeitpunkt?)
5. Erkläre jemandem in eigenen Worten den Weg eines Klicks auf ein Rad der Karte, von `MapView` bis zum Erscheinen des Buttons „Continue to payment".
