# CSS 0: Grundlagen

CSS bestimmt, wie die HTML-Elemente aussehen: Farben, Abstände, Anordnung, Animationen. Diese Datei erklärt die Bausteine, die im ganzen Projekt vorkommen. Danach folgt Kapitel 1 mit der Datei `landing.css` Zeile für Zeile, und Kapitel 2 mit den Unterschieden der anderen Seiten.

## Aufbau einer CSS-Regel

```css
.proof-card {          /* Selektor: WELCHE Elemente? */
    padding: 1.4rem;   /* Deklaration: Eigenschaft: Wert; */
}
```

- Der **Selektor** wählt Elemente aus. Der **Block** `{ ... }` enthält **Deklarationen** (Eigenschaft und Wert, mit `;` am Ende).
- Mehrere Selektoren mit Komma teilen sich einen Block: `h1, h2, h3 { ... }`.

## Selektoren, die im Projekt vorkommen

| Schreibweise | Bedeutung | Beispiel |
| --- | --- | --- |
| `p` | alle Elemente mit diesem Tag | `body`, `a`, `img` |
| `.name` | alle Elemente mit `class="name"` | `.hero` |
| `.a.b` | Elemente, die **beide** Klassen haben | `.nav-link.is-active` |
| `.a .b` | `.b` **innerhalb** von `.a` | `.hero h1`, `.teaser-card p` |
| `:root` | das oberste Element (`<html>`), Heimat der Variablen | |
| `:hover` | solange die Maus darüber ist | `.btn:hover` |
| `:focus-visible` | wenn ein Element per Tastatur fokussiert ist | `a:focus-visible` |
| `::before`, `::after` | ein **künstliches** Element vor oder hinter dem Inhalt, ohne HTML | `.teaser-card::after` |
| `*` | alle Elemente | `*, *::before, *::after` |

## Wer gewinnt, wenn zwei Regeln kollidieren? (Kaskade)

1. **Spezifität:** Eine genauere Regel gewinnt. Reihenfolge von schwach nach stark: Tag (`p`), Klasse (`.a`), mehrere Klassen (`.a.b`).
2. **Reihenfolge:** Bei gleicher Genauigkeit gewinnt die **spätere** Regel. Darum stehen die Media Queries (`@media`) am Ende der Datei: Sie sollen die normalen Regeln überschreiben.
3. **`!important`** schlägt alles. Im Projekt kommt es nur einmal vor, absichtlich, beim Abschalten der Animationen.

## Eigene Variablen (Custom Properties)

```css
:root { --accent: #7dffb3; }   /* definieren */
a { color: var(--accent); }    /* benutzen */
```

Eine Variable beginnt mit `--`. Ändert man den Wert an einer Stelle, ändert sich die Farbe auf der ganzen Seite. Das ist der Grund, warum alle sieben CSS-Dateien am Anfang denselben `:root`-Block haben.

## Maße und Einheiten

| Einheit | Bedeutung |
| --- | --- |
| `px` | Bildschirmpunkt, feste Größe |
| `rem` | Vielfaches der Grundschriftgröße (meist 16 px). `1.5rem` = 24 px |
| `em` | Vielfaches der Schriftgröße **des Elements** (bei `letter-spacing: 0.04em`) |
| `%` | Anteil der Größe des Elternelements bzw. des Verlaufs |
| `vw`, `vh` | 1 % der Fensterbreite bzw. -höhe |
| `ch` | Breite einer „0" in der aktuellen Schrift, gut für Zeilenlängen |
| `fr` | im Grid: ein Anteil am freien Platz |

**`clamp(min, bevorzugt, max)`** wählt einen Wert, der mit dem Fenster wächst, aber nie unter `min` oder über `max` geht. **`calc(...)`** rechnet mit verschiedenen Einheiten: `calc(100vh - 72px)`.

## Das Box-Modell

Jedes Element ist ein Kasten: **Inhalt**, darum **`padding`** (Innenabstand), dann **`border`** (Rand), dann **`margin`** (Außenabstand). Mit `box-sizing: border-box` zählt die angegebene `width` einschließlich Padding und Rand. Das macht das Rechnen einfacher.

Kurzschreibweisen für vier Seiten, im Uhrzeigersinn ab oben:
- `padding: 8vh 6vw 6vh` bedeutet oben 8vh, links und rechts 6vw, unten 6vh.
- `padding: 0.75rem 6vw` bedeutet oben und unten 0.75rem, links und rechts 6vw.
- `margin: 0 0 0.75rem` bedeutet nur unten 0.75rem.

## Anordnen: Flexbox und Grid

**Flexbox** ordnet Elemente in **einer Richtung** an (Zeile oder Spalte).

| Eigenschaft | Wirkung |
| --- | --- |
| `display: flex` | der Kasten wird ein Flex-Container |
| `flex-direction: column` | Kinder untereinander statt nebeneinander |
| `flex-wrap: wrap` | Kinder rutschen in die nächste Zeile, wenn der Platz fehlt |
| `justify-content` | Ausrichtung **entlang** der Hauptrichtung (`space-between`: Abstand dazwischen) |
| `align-items` | Ausrichtung **quer** dazu (`center`: mittig) |
| `gap` | Abstand zwischen den Kindern |
| `flex: 1 1 180px` | ein Kind darf wachsen (1), schrumpfen (1), Ausgangsbreite 180 px |

**Grid** ordnet in **Zeilen und Spalten** an: `display: grid; grid-template-columns: repeat(4, 1fr);` ergibt vier gleich breite Spalten. `grid-column: 1 / -1` lässt ein Element über **alle** Spalten reichen.

## Positionieren

| Wert | Bedeutung |
| --- | --- |
| `position: fixed` | das Element bleibt beim Scrollen an derselben Stelle im Fenster (der Header) |
| `position: absolute` | das Element wird frei platziert, relativ zum nächsten **positionierten** Elternelement |
| `position: relative` | das Element bleibt an seinem Platz, ist aber Bezugspunkt für `absolute`-Kinder |
| `z-index` | wer bei Überlappung oben liegt |

## Bewegung

- **`transition: transform 0.25s ease`** lässt eine Änderung weich ablaufen, statt sofort zu springen. Gemeint sind Änderungen, die zum Beispiel `:hover` auslöst.
- **`transform: translateY(-4px)`** verschiebt ein Element ohne das Layout zu verändern. `scale(1.03)` vergrößert es leicht.
- **`@media (prefers-reduced-motion: reduce)`** gilt, wenn der Nutzer im System „Bewegung reduzieren" gewählt hat.

## Media Queries (Anpassung an die Fensterbreite)

```css
@media (max-width: 800px) { ... }
```

Regeln im Block gelten **nur**, wenn das Fenster höchstens 800 Pixel breit ist. So wird aus der Desktop-Seite die Handy-Seite.

## Farben und Verläufe

- `#7dffb3` ist eine Farbe in Hexschreibweise (Rot, Grün, Blau je zwei Stellen).
- `rgba(14, 36, 32, 0.72)` ist eine Farbe mit **Transparenz** (letzter Wert, 0 bis 1).
- `radial-gradient(...)` und `linear-gradient(...)` sind Farbverläufe (kreisförmig bzw. in eine Richtung).

## Ein Wort zu `rem` und Barrierefreiheit

Maße in `rem` wachsen mit, wenn jemand im Browser die Schrift vergrößert. Maße in `px` tun das nicht. Deshalb steht Text- und Abstandsgröße überwiegend in `rem`.
