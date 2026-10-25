# CSS 2: Was jede Seite anders macht

Alle sieben Seiten haben dasselbe Grundgerüst aus `landing.css` (Kapitel 1). Dieses Kapitel zeigt nur, **worin sich die anderen sechs Dateien davon unterscheiden** und warum. Die Unterschiede sind klein und folgen immer einem Grund: andere Inhalte, andere Textlängen oder eine besondere Farbe.

## Überblick

| | `landing` | `market` | `problem` | `solution` | `product` | `business` | `team` |
| --- | --- | --- | --- | --- | --- | --- | --- |
| Höhe des Heros | 100vh | 70vh | 70vh | 70vh | 70vh | 70vh | 70vh |
| Breite der Hauptüberschrift (`max-width`) | 16ch | 16ch | 20ch | 16ch | 22ch | 22ch | 20ch |
| Größe der Zahlen (`.proof-value`) | groß (2,8 rem) | klein (2,2 rem) | klein | groß | groß | klein | groß |
| Farbe der Zahlen | grün | grün | **orange** | grün | grün | grün | grün |
| Leuchten der Zahlen (`text-shadow`) | ja | **nein** | **nein** | ja | ja | ja | ja |
| Umbruch langer Zahlen | ja | ja | ja | nein | nein | ja | nein |
| Abstand der Buchstaben in Zahlen | | | | | | | **weiter** |
| Mindestbreite der Chips | 180 px | 220 px | 220 px | 220 px | 220 px | 220 px | 220 px |
| besondere Regeln | | | Variable `--pain` | | `:last-child` und die Demo | der Rechner | Umbruch bei Überschriften |

**Wie man solche Unterschiede selbst findet:** Im Terminal (Git Bash) im Projektordner:

```
git diff --no-index css/landing.css css/market.css
```

Das zeigt alle Zeilen, die sich zwischen den beiden Dateien unterscheiden.

---

## Änderungen, die **alle** anderen Seiten teilen

1. **Kleineres Hero (70vh statt 100vh).** Auf der Startseite soll der Einstieg den Bildschirm füllen. Auf den Kapitelseiten sollen die Zahlenkarten schon ohne Scrollen sichtbar sein. In jeder Datei steht deshalb `min-height: calc(70vh - var(--header-h))` statt 100vh.
2. **Breitere Chips (220 px statt 180 px).** Die Chips tragen auf den Kapitelseiten kurze Sätze statt nur Namen (zum Beispiel „Many local and global operators, little overview"). Mit 220 px Mindestbreite brechen sie weniger oft um.
3. **Angepasste Kommentare.** Jede Datei beschreibt oben im Kommentar, was auf dieser Seite anders ist.

---

## `market.css`: kleinere Zahlen, kein Leuchten

```css
227 | .proof-value {
228 |     margin: 0 0 0.4rem;
229 |     font-weight: 800;
230 |     font-size: clamp(1.5rem, 2.6vw, 2.2rem);
231 |     line-height: 1.1;
232 |     color: var(--accent);
233 |     overflow-wrap: anywhere;
234 | }
235 |
```

- **Z. 230** Die Zahlen sind hier kleiner (höchstens 2,2 rem statt 2,8 rem). Der Grund: Werte wie „EUR 7–8bn" und „USD 2.2bn" sind länger als „1,250+". In der Karte würden sie sonst nicht in eine Zeile passen.
- **Z. 233** Der Umbruch an beliebiger Stelle bleibt, damit auch ein sehr langer Wert nicht über den Kartenrand läuft.
- Die Zeile mit `text-shadow` (dem Leuchten) **fehlt** in `market.css`. Sie ist in `landing.css` Zeile 233. Ob das Leuchten hier mit Absicht fehlt oder beim Kopieren verloren ging, ist nicht dokumentiert. Das Aussehen ist dadurch auf dieser Seite etwas ruhiger.

---

## `problem.css`: der orange Ton `--pain`

```css
  8 |     --accent-deep: #1f8f5a;
  9 |     --pain: #ffb27d;
```

- **Z. 9** Eine **zusätzliche Variable**, nur in dieser Datei. Ein warmes Orange für das Kapitel über Schmerzpunkte. Wo sonst `var(--accent)` (Grün) stand, steht hier an mehreren Stellen `var(--pain)`.

**Wo `--pain` benutzt wird** (jeweils anstelle von `--accent`):

```css
223 | .proof-card:hover {
224 |     transform: translateY(-4px);
225 |     border-color: var(--pain);
226 |     box-shadow: 0 0 28px rgba(255, 178, 125, 0.16);
227 | }
```

- **Z. 226** Schein der Zahlenkarte beim Darüberfahren, ebenso wie der Rand davor mit `var(--pain)`. Der Schein steht in Orange: `rgba(255, 178, 125, 0.16)` ist dieselbe Farbe wie `#ffb27d` in der Schreibweise mit Transparenz. Man muss die Farbe zweimal schreiben, weil man eine Variable mit Hexwert nicht mit einer Transparenz mischen kann.

```css
229 | .proof-value {
230 |     margin: 0 0 0.4rem;
231 |     font-weight: 800;
232 |     font-size: clamp(1.5rem, 2.6vw, 2.2rem);
233 |     line-height: 1.1;
234 |     color: var(--pain);
235 |     overflow-wrap: anywhere;
236 | }
237 |
```

- `color: var(--pain);` Die großen Zahlen sind orange. Das Leuchten (`text-shadow`) fehlt auch hier.

```css
275 | .teaser-card::after {
276 |     content: "";
277 |     position: absolute;
278 |     inset: auto -20% -40% auto;
279 |     width: 160px;
280 |     height: 160px;
281 |     background: radial-gradient(circle, rgba(255, 178, 125, 0.32), transparent 70%);
282 |     opacity: 0;
283 |     transition: opacity 0.3s ease;
284 | }
```

- **Z. 281** Der Leuchtfleck in den Karten ist orange.

```css
323 | .founder-role {
324 |     margin: 0;
325 |     color: var(--pain);
326 |     font-size: 0.8rem;
327 |     letter-spacing: 0.12em;
```

- `color: var(--pain);` Die kleinen Beschriftungen über den Chips sind orange.

Außerdem sind beim Darüberfahren der Rand der Teaser-Karte (`.teaser-card:hover`) und der Schein der Chips (`.founder-chip:hover`) orange. Die Links und Buttons bleiben grün, damit die Navigation wiedererkennbar bleibt.

---

## `solution.css`: dieselben Zahlen wie `landing`, ohne Umbruchregel

```css
228 | .proof-value {
229 |     margin: 0 0 0.4rem;
230 |     font-weight: 800;
231 |     font-size: clamp(1.8rem, 3.2vw, 2.8rem);
232 |     line-height: 1.1;
233 |     color: var(--accent);
234 |     text-shadow: 0 0 22px rgba(125, 255, 179, 0.3);
235 | }
236 |
```

- Die Zahlen sind hier groß und leuchten wie auf der Startseite. Es sind nur kurze Prozentwerte (80 %, 73 %, 93 %, 89 %), die sicher in die Karte passen.
- Die Zeile `overflow-wrap: anywhere` fehlt, weil sie nicht gebraucht wird. Sie schadet aber auch nicht.

---

## `product.css`: die fünfte Karte und die Demo

```css
273 |
274 | .teaser-card:last-child {
275 |     grid-column: 1 / -1;
276 | }
```

- **Z. 275** Die Produktseite hat **fünf** Schrittkarten statt vier. Im Zwei-Spalten-Raster würde die fünfte allein in einer Zeile stehen, mit einer Lücke daneben. `:last-child` wählt die **letzte** Karte aus, und `grid-column: 1 / -1` lässt sie über **alle** Spalten gehen (von der ersten Gitterlinie bis zur letzten).

```css
414 |     .teaser-grid {
415 |         grid-template-columns: 1fr;
416 |     }
417 |
418 |     .teaser-card:last-child {
419 |         grid-column: auto;
420 |     }
```

- **Z. 419** Im einspaltigen Raster auf dem Handy (`max-width: 560px`) wird die Regel wieder **zurückgesetzt**: `auto` heißt „normal platzieren". Bei nur einer Spalte ist „über alle Spalten" nicht mehr nötig.
- Ab Zeile 443 steht der **Abschnitt für die App-Demo** (Stepper, Karte, Chips, Zahlungsansicht). Er wird in einem eigenen Kapitel erklärt.

---

## `business.css`: kleinere Zahlen und der Rechner

```css
228 | .proof-value {
229 |     margin: 0 0 0.4rem;
230 |     font-weight: 800;
231 |     font-size: clamp(1.5rem, 2.6vw, 2.2rem);
232 |     line-height: 1.1;
233 |     color: var(--accent);
234 |     text-shadow: 0 0 22px rgba(125, 255, 179, 0.3);
235 |     overflow-wrap: anywhere;
236 | }
```

- **Z. 231** Kleinere Zahlen, weil der Wert „€0.01–0.015" lang ist. Der Umbruch an beliebiger Stelle (`overflow-wrap: anywhere`) steht daneben. Das Leuchten bleibt erhalten.
- Ab Zeile 435 steht der **Abschnitt für den Break-even-Rechner** (Regler, Kacheln, Diagramm, Tabelle). Er wird in einem eigenen Kapitel erklärt.

---

## `team.css`: weitere Buchstaben und Umbruch in Überschriften

```css
228 | .proof-value {
229 |     margin: 0 0 0.4rem;
230 |     font-weight: 800;
```

- **Z. 233** Mehr Abstand zwischen den Buchstaben. Hier stehen Rollenkürzel wie CEO und CFO als „Zahlen". Etwas mehr Luft lässt sie ruhiger wirken.

```css
295 | .teaser-card h3 {
296 |     margin: 0 0 0.5rem;
297 |     overflow-wrap: anywhere;
298 | }
```

- **Z. 297** Die Überschriften der Teamkarten (zum Beispiel „M. Pugachevskiy · COO") dürfen an beliebiger Stelle umbrechen, damit sie auf schmalen Karten nicht über den Rand laufen.

---

## Typische Fragen

- **Warum sind die Dateien nicht gemeinsam?** Das Projekt ist so gewachsen: Jede Seite bekam eine Kopie der Startseite. Das ist einfach, aber bei Änderungen muss man sieben Dateien anfassen. Eine sauberere Lösung wäre eine gemeinsame Datei (`base.css`) für das Gemeinsame und kleine Dateien pro Seite für das Besondere. Das würde das Projekt aber umbauen. Bei dieser Größe ist die Kopie vertretbar.
- **Was würde man bei einer Änderung am Header tun?** In allen sieben Dateien dieselbe Zeile ändern. Mit der Suchfunktion des Editors („in allen Dateien suchen") findet man sie schnell. Danach prüft man mit `git diff`, dass nur das Gewollte geändert wurde.
- **Warum fehlt das Leuchten bei `market` und `problem`?** Beides sind Seiten mit längeren Werten und kleineren Zahlen. Ob das Absicht ist, steht nirgends. Wenn du einheitliches Aussehen willst, kannst du die Zeile `text-shadow: 0 0 22px rgba(125, 255, 179, 0.3);` ergänzen (bei `problem` in Orange, `rgba(255, 178, 125, 0.3)`).
- **Wieso zwei Schreibweisen für dieselbe Farbe (`#ffb27d` und `rgba(255, 178, 125, ...)`)?** `rgba` braucht drei einzelne Zahlen und die Transparenz. Mit der Hex-Variable lässt sich keine Transparenz mischen. Neuere CSS-Funktionen (zum Beispiel `color-mix`) könnten das lösen, aber die einfache Schreibweise ist überall verständlich.

## Mach es selbst

1. Füge in `market.css` die Zeile mit dem Leuchten ein. Was ändert sich?
2. Ändere `--pain` auf eine andere Farbe. Welche Stellen ändern sich **nicht** mit, und warum? (Hinweis: Achte auf die `rgba`-Werte.)
3. Mache in `product.css` die Regel `.teaser-card:last-child` unwirksam (zum Beispiel durch Auskommentieren). Wie sieht die Produktseite aus?
4. Führe `git diff --no-index css/landing.css css/team.css` aus. Findest du jeden Unterschied in dieser Datei wieder?
