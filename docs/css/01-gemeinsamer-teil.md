# CSS 1: Der gemeinsame Teil, `landing.css` Zeile für Zeile

Die sieben CSS-Dateien sind zu rund 90 % gleich. `landing.css` ist die Vorlage, die anderen sind Kopien mit gezielten Änderungen. Wenn du diese Datei verstehst, verstehst du den größten Teil aller sieben. Die Unterschiede stehen in Kapitel 2.

Lies zuerst Kapitel 0 (Grundlagen). Hier werden nur noch die Besonderheiten erklärt.

---


## Variablen

```css
  1 | /* Design tokens: colours, type, spacing and motion used across the landing page */
  2 | :root {
  3 |     --bg: #071411;
  4 |     --bg-elevated: #0e2420;
  5 |     --ink: #f4fff8;
  6 |     --muted: #b7cfc4;
  7 |     --accent: #7dffb3;
  8 |     --accent-deep: #1f8f5a;
  9 |     --card: rgba(14, 36, 32, 0.72);
 10 |     --stroke: rgba(125, 255, 179, 0.18);
 11 |     --shadow: 0 24px 60px rgba(0, 0, 0, 0.35);
 12 |     --radius: 18px;
 13 |     --header-h: 72px;
 14 |     --font-display: "Outfit", sans-serif;
 15 |     --font-body: "Source Sans 3", sans-serif;
 16 | }
```

- **Z. 1** Kommentar: „Design Tokens" nennt man Werte wie Farben und Maße, die man an einer Stelle festlegt.
- **Z. 2** `:root` ist das oberste Element, also `<html>`. Variablen, die hier stehen, gelten überall auf der Seite.
- **Z. 3** Der Seitenhintergrund, ein sehr dunkles Grün.
- **Z. 4** Eine etwas hellere Variante für „erhöhte" Flächen. Im CSS wird sie nirgends benutzt, nur die SVG-Karte der App-Demo greift in `MapView.tsx` darauf zu.
- **Z. 5** Die Textfarbe, ein sehr helles Grün-Weiß.
- **Z. 6** Gedämpfter Text für Nebentexte.
- **Z. 7** Die Akzentfarbe, ein helles Grün für Links, Zahlen, Rahmen beim Darüberfahren.
- **Z. 8** Ein dunkleres Grün. **Ehrlicher Hinweis:** Die Variable wird im CSS aktuell nirgends benutzt. Dieselbe Farbe (31, 143, 90) steht ausgeschrieben im Hintergrundverlauf von `body` (Zeile 35). Man könnte sie entfernen oder dort verwenden.
- **Z. 9** Hintergrund der Karten, ein dunkles Grün mit 72 % Deckkraft (`rgba`).
- **Z. 10** Die Randfarbe, ein Akzentgrün mit nur 18 % Deckkraft.
- **Z. 11** Ein fertiger Schatten: nach unten verschoben (`0 24px`), weit verwischt (`60px`), halbtransparentes Schwarz.
- **Z. 12** Die Eckenrundung der Karten.
- **Z. 13** Die Höhe der Kopfzeile. Sie wird an mehreren Stellen gebraucht (Seitenabstand oben, Handy-Menü, Höhe des Heros).
- **Z. 14–15** Zwei Schriften: Überschriften und Zahlen in „Outfit", Fließtext in „Source Sans 3". Nach dem Komma steht jeweils die Ersatzschrift (`sans-serif`), falls die erste nicht lädt.

## Grundeinstellungen

```css
 18 | /* Base page setup: dark canvas, readable type, room for the fixed header */
 19 | *,
 20 | *::before,
 21 | *::after {
 22 |     box-sizing: border-box;
 23 | }
 24 |
 25 | html {
 26 |     scroll-behavior: smooth;
 27 | }
 28 |
 29 | body {
 30 |     margin: 0;
 31 |     font-family: var(--font-body);
 32 |     color: var(--ink);
 33 |     background:
 34 |         radial-gradient(circle at 12% -10%, rgba(125, 255, 179, 0.16), transparent 42%),
 35 |         radial-gradient(circle at 90% 8%, rgba(31, 143, 90, 0.22), transparent 36%),
 36 |         var(--bg);
 37 |     padding-top: var(--header-h);
 38 | }
 39 |
 40 | h1,
 41 | h2,
 42 | h3,
 43 | .brand,
 44 | .proof-value,
 45 | .btn {
 46 |     font-family: var(--font-display);
 47 | }
 48 |
 49 | a {
 50 |     color: var(--accent);
 51 | }
 52 |
 53 | img {
 54 |     max-width: 100%;
 55 | }
 56 |
 57 | /* Visible keyboard focus for all links and buttons */
 58 | a:focus-visible,
 59 | button:focus-visible {
 60 |     outline: 2px solid var(--accent);
 61 |     outline-offset: 3px;
 62 | }
```

- **Z. 18** Kommentar: dunkle Fläche, lesbare Schrift, Platz für den festen Header.
- **Z. 19–23** Die drei Selektoren zusammen treffen **jedes** Element und dessen `::before`/`::after`. `box-sizing: border-box` sorgt dafür, dass Padding und Rand in die Breite eingerechnet werden. Ohne diese Regel (sie fehlte einmal in `problem.css`) würden Karten breiter, als man denkt.
- **Z. 25–27** `scroll-behavior: smooth` lässt Sprünge zu Ankern weich scrollen.
- **Z. 29** Der Seitenkörper.
- **Z. 30** Entfernt den Standardabstand des Browsers rund um die Seite.
- **Z. 31** Setzt die Fließtextschrift. Alle Kindelemente erben sie, sofern nichts anderes gesetzt wird.
- **Z. 32** Die Textfarbe, ebenfalls vererbt.
- **Z. 33–36** Mehrere Hintergründe übereinander, **der erste liegt oben**: zwei weiche, kreisförmige Farbflecken (`radial-gradient`) links oben (`at 12% -10%`) und rechts oben (`at 90% 8%`), die zu `transparent` auslaufen, und darunter als Fläche `var(--bg)`.
- **Z. 37** Weil der Header `fixed` ist, liegt er über dem Inhalt. Dieser Abstand schiebt den Inhalt unter den Header.
- **Z. 40–47** Überschriften, Logo, die großen Zahlen und Buttons bekommen die Display-Schrift. Das ist eine **gemeinsame Regel** für sechs Selektoren.
- **Z. 49–51** Links sind standardmäßig in der Akzentfarbe.
- **Z. 53–55** Bilder werden nie breiter als ihr Container. (Das Projekt hat im Moment keine Bilder, die Regel ist eine Vorsichtsmaßnahme.)
- **Z. 58–62** Wer mit der Tastatur auf einen Link oder Button springt, sieht einen 2 Pixel breiten Rahmen in der Akzentfarbe. `outline-offset: 3px` setzt ihn 3 Pixel nach außen. `:focus-visible` greift nur bei Tastatur, nicht bei Mausklicks.

## Kopfzeile und Menü

```css
 64 | /* Fixed header: Flexbox row with brand left and chapter links right */
 65 | .site-header {
 66 |     position: fixed;
 67 |     top: 0;
 68 |     left: 0;
 69 |     right: 0;
 70 |     z-index: 20;
 71 |     min-height: var(--header-h);
 72 |     display: flex;
 73 |     align-items: center;
 74 |     justify-content: space-between;
 75 |     gap: 1rem;
 76 |     padding: 0.75rem 6vw;
 77 |     background: rgba(7, 20, 17, 0.78);
 78 |     border-bottom: 1px solid var(--stroke);
 79 |     backdrop-filter: blur(16px);
 80 | }
 81 |
 82 | .brand {
 83 |     font-weight: 800;
 84 |     font-size: 1.25rem;
 85 |     letter-spacing: 0.04em;
 86 |     text-decoration: none;
 87 |     color: var(--ink);
 88 | }
 89 |
 90 | .nav-toggle {
 91 |     display: none;
 92 |     border: 1px solid var(--stroke);
 93 |     background: transparent;
 94 |     color: var(--ink);
 95 |     border-radius: 999px;
 96 |     padding: 0.4rem 0.9rem;
 97 |     cursor: pointer;
 98 | }
 99 |
100 | .nav-list {
101 |     display: flex;
102 |     flex-wrap: wrap;
103 |     gap: 0.35rem 1rem;
104 |     list-style: none;
105 |     margin: 0;
106 |     padding: 0;
107 | }
108 |
109 | .nav-link {
110 |     color: var(--muted);
111 |     text-decoration: none;
112 |     font-weight: 600;
113 |     font-size: 0.95rem;
114 |     padding-bottom: 0.15rem;
115 |     border-bottom: 2px solid transparent;
116 |     transition: color 0.2s ease, border-color 0.2s ease, text-shadow 0.2s ease;
117 | }
118 |
119 | .nav-link:hover,
120 | .nav-link.is-active {
121 |     color: var(--accent);
122 |     border-color: var(--accent);
123 |     text-shadow: 0 0 18px rgba(125, 255, 179, 0.45);
124 | }
```

- **Z. 65** Die Kopfzeile.
- **Z. 66** Bleibt beim Scrollen oben stehen und liegt über dem Inhalt.
- **Z. 67–69** Zusammen mit `left: 0` und `right: 0` zieht sie die Kopfzeile über die volle Breite am oberen Rand.
- **Z. 70** Sie liegt über anderen Elementen. Höhere Zahl, weiter oben.
- **Z. 71** Mindestens so hoch wie die Variable.
- **Z. 72–75** Eine **Flex-Zeile**: Logo und Navigation nebeneinander. `align-items: center` zentriert sie senkrecht. `justify-content: space-between` schiebt das Logo nach links und die Navigation nach rechts. `gap: 1rem` ist der Mindestabstand.
- **Z. 76** Innenabstand: oben und unten 0,75 rem, links und rechts 6 % der Fensterbreite.
- **Z. 77** Ein dunkler, zu 78 % deckender Hintergrund.
- **Z. 78** Ein feiner Strich unten.
- **Z. 79** Verwischt alles, was **hinter** der Kopfzeile liegt. So entsteht der Milchglas-Effekt.
- **Z. 82–88** Das Logo-Wort „Go One": fett, größer, leicht gesperrt (`letter-spacing`), ohne Unterstreichung, in der Textfarbe.
- **Z. 90–98** Der Menü-Button für das Handy. Auf dem Desktop ist er mit `display: none` **versteckt**. Seine Optik: dünner Rand, durchsichtiger Hintergrund, `border-radius: 999px` (eine Pillenform) und `cursor: pointer` (Handzeiger).
- **Z. 100–107** Die Liste der Menüpunkte. `display: flex` legt sie in eine Zeile, `flex-wrap: wrap` erlaubt Umbruch. `gap: 0.35rem 1rem` setzt **zwei** Werte: 0,35 rem zwischen den Zeilen und 1 rem zwischen den Spalten. `list-style: none` entfernt die Aufzählungspunkte. `margin` und `padding` auf 0 entfernen die Standardabstände von Listen.
- **Z. 109–117** Ein Menüpunkt. Gedämpfte Farbe, fett (600), etwas kleiner. `border-bottom: 2px solid transparent` reserviert den Platz für einen späteren farbigen Strich, **ohne dass etwas springt**, wenn er erscheint. Die `transition` macht die Farbänderungen weich.
- **Z. 119–124** Beim Darüberfahren und beim aktiven Menüpunkt (`.nav-link.is-active`, beide Klassen) wird er grün, bekommt einen grünen Strich unten und einen leichten Leuchteffekt (`text-shadow` ohne Versatz mit 18 px Weichzeichnung).

## Hero (Kopfbereich der Seite)

```css
126 | /* Hero: stacked Flexbox column with a glowing call-to-action pair */
127 | .hero {
128 |     display: flex;
129 |     flex-direction: column;
130 |     justify-content: center;
131 |     min-height: calc(100vh - var(--header-h));
132 |     padding: 8vh 6vw 6vh;
133 |     max-width: 1100px;
134 | }
135 |
136 | .eyebrow {
137 |     margin: 0 0 0.75rem;
138 |     text-transform: uppercase;
139 |     letter-spacing: 0.18em;
140 |     font-size: 0.78rem;
141 |     color: var(--accent);
142 | }
143 |
144 | .hero h1 {
145 |     margin: 0 0 1rem;
146 |     font-size: clamp(2.2rem, 5vw, 4.4rem);
147 |     line-height: 1.05;
148 |     max-width: 16ch;
149 | }
150 |
151 | .lead {
152 |     margin: 0 0 2rem;
153 |     max-width: 62ch;
154 |     font-size: 1.15rem;
155 |     color: var(--muted);
156 | }
157 |
158 | .hero-actions {
159 |     display: flex;
160 |     flex-wrap: wrap;
161 |     gap: 0.85rem;
162 | }
```

- **Z. 127** Der große Einstieg ganz oben auf jeder Seite.
- **Z. 128–130** Eine **Flex-Spalte**: Elemente untereinander (`flex-direction: column`). Bei einer Spalte bedeutet `justify-content: center` die **senkrechte** Zentrierung.
- **Z. 131** Mindesthöhe: die ganze Fensterhöhe minus Header. Auf der Landing Page füllt das Hero den Bildschirm. Auf den anderen Seiten ist es kleiner (70vh, siehe Kapitel 2).
- **Z. 132** Oben 8 % der Fensterhöhe, seitlich 6 % der Breite, unten 6 % der Höhe.
- **Z. 133** Der Text wird nicht breiter als 1100 Pixel. Es gibt kein `margin: auto`, deshalb steht der Block links.
- **Z. 136–142** Die kleine Zeile über der Überschrift („Chapter 1 · Market"): Großbuchstaben (`text-transform: uppercase`), weit gesperrt, klein, grün.
- **Z. 144–149** Die Hauptüberschrift. `clamp(2.2rem, 5vw, 4.4rem)` skaliert mit dem Fenster zwischen 2,2 und 4,4 rem. `line-height: 1.05` hält die Zeilen eng. `max-width: 16ch` begrenzt die Zeile auf etwa 16 Zeichen und erzwingt so einen Umbruch in mehrere Zeilen.
- **Z. 151–156** Der Einleitungstext: gedämpfte Farbe, etwas größer, höchstens 62 Zeichen breit (angenehme Lesebreite).
- **Z. 158–162** Die beiden Buttons nebeneinander. `flex-wrap: wrap` lässt sie auf dem Handy untereinander rutschen.

## Buttons

```css
164 | .btn {
165 |     display: inline-flex;
166 |     align-items: center;
167 |     justify-content: center;
168 |     text-decoration: none;
169 |     font-weight: 700;
170 |     border-radius: 999px;
171 |     padding: 0.85rem 1.4rem;
172 |     transition: transform 0.2s ease, box-shadow 0.2s ease, background 0.2s ease;
173 | }
174 |
175 | .btn:hover {
176 |     transform: translateY(-3px);
177 | }
178 |
179 | .btn-primary {
180 |     color: #062016;
181 |     background: linear-gradient(135deg, var(--accent), #c8ffe0);
182 |     box-shadow: 0 10px 30px rgba(125, 255, 179, 0.28);
183 | }
184 |
185 | .btn-primary:hover {
186 |     box-shadow: 0 16px 40px rgba(125, 255, 179, 0.45);
187 | }
188 |
189 | .btn-ghost {
190 |     color: var(--ink);
191 |     border: 1px solid var(--stroke);
192 |     background: rgba(255, 255, 255, 0.03);
193 | }
194 |
195 | .btn-ghost:hover {
196 |     border-color: var(--accent);
197 | }
```

- **Z. 164–173** Die gemeinsame Basis. `display: inline-flex` macht den Link zu einem Flex-Container, der trotzdem nur so breit ist wie sein Inhalt. `align-items` und `justify-content: center` zentrieren den Text. Die Pillenform kommt von `border-radius: 999px`. Die `transition` macht Verschiebung, Schatten und Hintergrund weich.
- **Z. 175–177** Beim Darüberfahren wird der Button 3 Pixel nach oben verschoben. `translateY(-3px)`: negativ heißt nach oben.
- **Z. 179–183** Der Hauptbutton: dunkler Text auf einem grünen Verlauf (`linear-gradient(135deg, ...)`, diagonal) mit grünem Schein (`box-shadow`).
- **Z. 185–187** Beim Darüberfahren wird der Schein größer.
- **Z. 189–193** Der zweite Button: heller Text, dünner Rand und fast durchsichtiger Hintergrund.
- **Z. 195–197** Der Rand wird grün.

## Zahlenleiste und Karten

```css
199 | /* Proof strip: four market facts in a responsive CSS Grid */
200 | .proof-strip {
201 |     display: grid;
202 |     grid-template-columns: repeat(4, 1fr);
203 |     gap: 1rem;
204 |     padding: 0 6vw 6vh;
205 | }
206 |
207 | .proof-card,
208 | .teaser-card,
209 | .founder-chip {
210 |     background: var(--card);
211 |     border: 1px solid var(--stroke);
212 |     border-radius: var(--radius);
213 |     box-shadow: var(--shadow);
214 | }
215 |
216 | .proof-card {
217 |     padding: 1.4rem 1.2rem;
218 |     transition: transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease;
219 | }
220 |
221 | .proof-card:hover {
222 |     transform: translateY(-4px);
223 |     border-color: var(--accent);
224 |     box-shadow: 0 0 28px rgba(125, 255, 179, 0.14);
225 | }
226 |
227 | .proof-value {
228 |     margin: 0 0 0.4rem;
229 |     font-weight: 800;
230 |     font-size: clamp(1.8rem, 3.2vw, 2.8rem);
231 |     line-height: 1.1;
232 |     color: var(--accent);
233 |     text-shadow: 0 0 22px rgba(125, 255, 179, 0.3);
234 |     overflow-wrap: anywhere;
235 | }
236 |
237 | .proof-label {
238 |     margin: 0;
239 |     color: var(--muted);
240 |     font-size: 0.95rem;
241 | }
```

- **Z. 200–205** Die Leiste mit den Kennzahlen. `display: grid` mit `grid-template-columns: repeat(4, 1fr)` ergibt **vier gleich breite Spalten**. `gap: 1rem` ist der Abstand. `padding: 0 6vw 6vh` setzt seitlich und unten Abstand, oben keinen.
- **Z. 207–214** Die **gemeinsame Optik** dreier Kartenarten (Zahlen, Teaser, Chips): Kartenhintergrund, dünner Rand, runde Ecken, Schatten. Eine einzige Regel für alle drei.
- **Z. 216–219** Eigenes Padding und eine `transition` für Verschiebung, Rand und Schatten.
- **Z. 221–225** Beim Darüberfahren hebt sich die Karte 4 Pixel an, bekommt einen grünen Rand und einen schwachen grünen Schein.
- **Z. 227–235** Die große Zahl. Fett (800), Größe zwischen 1,8 und 2,8 rem je nach Fenster, grün, mit leichtem Leuchten. `overflow-wrap: anywhere` erlaubt dem Browser, einen langen Wert **an beliebiger Stelle** umzubrechen, damit er nie aus der Karte ragt.
- **Z. 237–241** Die Beschriftung unter der Zahl: gedämpft und etwas kleiner.

## Teaser-Karten

```css
243 | /* Teaser grid: two-by-two story cards with a hover glow edge */
244 | .teaser,
245 | .founders {
246 |     padding: 4vh 6vw 8vh;
247 | }
248 |
249 | .teaser h2,
250 | .founders h2 {
251 |     margin: 0 0 0.75rem;
252 |     font-size: clamp(1.8rem, 3vw, 2.6rem);
253 | }
254 |
255 | .section-intro {
256 |     max-width: 68ch;
257 |     color: var(--muted);
258 |     margin: 0 0 2rem;
259 | }
260 |
261 | .teaser-grid {
262 |     display: grid;
263 |     grid-template-columns: repeat(2, 1fr);
264 |     gap: 1.1rem;
265 | }
266 |
267 | .teaser-card {
268 |     position: relative;
269 |     overflow: hidden;
270 |     padding: 1.5rem;
271 |     transition: transform 0.25s ease, border-color 0.25s ease;
272 | }
273 |
274 | .teaser-card::after {
275 |     content: "";
276 |     position: absolute;
277 |     inset: auto -20% -40% auto;
278 |     width: 160px;
279 |     height: 160px;
280 |     background: radial-gradient(circle, rgba(125, 255, 179, 0.35), transparent 70%);
281 |     opacity: 0;
282 |     transition: opacity 0.3s ease;
283 | }
284 |
285 | .teaser-card:hover {
286 |     transform: translateY(-8px);
287 |     border-color: var(--accent);
288 | }
289 |
290 | .teaser-card:hover::after {
291 |     opacity: 1;
292 | }
293 |
294 | .teaser-card h3 {
295 |     margin: 0 0 0.5rem;
296 | }
297 |
298 | .teaser-card p {
299 |     margin: 0;
300 |     color: var(--muted);
301 | }
```

- **Z. 244–247** Abschnitt-Innenabstände für zwei Abschnittsarten: oben 4 % der Fensterhöhe, seitlich 6 % der Breite, unten 8 %.
- **Z. 249–253** Die Abschnittsüberschriften, mit fließender Größe (`clamp`).
- **Z. 255–259** Der Einleitungsabsatz unter der Überschrift: höchstens 68 Zeichen breit.
- **Z. 261–265** **Zwei Spalten** (`repeat(2, 1fr)`), also ein Raster aus 2 × 2 Karten.
- **Z. 267–272** `position: relative` macht die Karte zum Bezugspunkt für das Leuchten (`::after`). `overflow: hidden` schneidet alles ab, was über die Ecken hinausragt (auch den Schein).
- **Z. 274–283** Ein **künstliches Element** in der Karte, ein Leuchtfleck. `content: ""` ist **Pflicht**, sonst wird das Element nicht erzeugt. `position: absolute` platziert es frei. `inset: auto -20% -40% auto` bedeutet oben und links automatisch, rechts −20 % und unten −40 %, es sitzt also halb außerhalb der Karte unten rechts. Größe 160 × 160 Pixel, ein kreisförmiger grüner Verlauf, und `opacity: 0` macht ihn unsichtbar. Die `transition` blendet ihn weich ein.
- **Z. 285–288** Beim Darüberfahren steigt die Karte um 8 Pixel und bekommt einen grünen Rand.
- **Z. 290–292** Beim Darüberfahren wird der Leuchtfleck sichtbar (`opacity: 1`).
- **Z. 294–296** und **Z. 298–301** Der Kartentitel bekommt unten Abstand, der Text keinen Abstand und gedämpfte Farbe.

## Chips, Links, Fußzeile

```css
303 | /* Founder row: Flexbox chips that wrap on smaller screens */
304 | .founder-row {
305 |     display: flex;
306 |     flex-wrap: wrap;
307 |     gap: 1rem;
308 |     margin-bottom: 1.5rem;
309 | }
310 |
311 | .founder-chip {
312 |     flex: 1 1 180px;
313 |     padding: 1.1rem 1.2rem;
314 |     transition: transform 0.2s ease, box-shadow 0.2s ease;
315 | }
316 |
317 | .founder-chip:hover {
318 |     transform: scale(1.03);
319 |     box-shadow: 0 0 24px rgba(125, 255, 179, 0.16);
320 | }
321 |
322 | .founder-role {
323 |     margin: 0;
324 |     color: var(--accent);
325 |     font-size: 0.8rem;
326 |     letter-spacing: 0.12em;
327 |     text-transform: uppercase;
328 | }
329 |
330 | .founder-name {
331 |     margin: 0.35rem 0 0;
332 | }
333 |
334 | .text-link {
335 |     font-weight: 700;
336 |     text-decoration: none;
337 |     border-bottom: 1px solid var(--accent);
338 | }
339 |
340 | .text-link:hover {
341 |     color: #c8ffe0;
342 | }
343 |
344 | /* Footer: Flexbox split between brand line and chapter shortcuts */
345 | .site-footer {
346 |     display: flex;
347 |     flex-wrap: wrap;
348 |     justify-content: space-between;
349 |     align-items: center;
350 |     gap: 1rem;
351 |     padding: 1.5rem 6vw 2rem;
352 |     border-top: 1px solid var(--stroke);
353 |     color: var(--muted);
354 | }
355 |
356 | .site-footer nav {
357 |     display: flex;
358 |     gap: 1.25rem;
359 | }
360 |
361 | .site-footer a {
362 |     text-decoration: none;
363 |     color: var(--muted);
364 | }
365 |
366 | .site-footer a:hover {
367 |     color: var(--accent);
368 | }
```

- **Z. 304–309** Die Reihe der kleinen Karten. `display: flex` mit `flex-wrap: wrap` legt sie nebeneinander und lässt sie bei Platzmangel umbrechen.
- **Z. 311–315** `flex: 1 1 180px`: Jede Karte darf wachsen und schrumpfen und möchte mindestens etwa 180 Pixel breit sein. So füllen vier Karten eine Zeile, auf dem Handy rutschen sie in mehrere Zeilen.
- **Z. 317–320** Beim Darüberfahren wird die Karte um 3 % **größer** (`scale(1.03)`) und bekommt einen leichten Schein.
- **Z. 322–328** Die kleine Beschriftung über dem Text in Großbuchstaben.
- **Z. 330–332** Der Text darunter, mit etwas Abstand nach oben.
- **Z. 334–338** Der Link am Abschnittsende. Fett, **ohne** Standard-Unterstreichung, dafür ein eigener 1 Pixel breiter Strich (`border-bottom`).
- **Z. 340–342** Beim Darüberfahren wird der Text heller.
- **Z. 345–354** Die Fußzeile. Flex-Zeile mit Umbruch und `justify-content: space-between`: links das Markenzeichen, rechts die Links. `border-top` ist der Trennstrich oben.
- **Z. 356–359** Die Links in der Fußzeile nebeneinander mit Abstand.
- **Z. 361–364** und **Z. 366–368** Links ohne Unterstreichung in gedämpfter Farbe, beim Darüberfahren grün.

## Anpassung ans Handy

```css
370 | /* Narrow screens: hamburger visible, grids collapse, hero height relaxes */
371 | @media (max-width: 800px) {
372 |     .nav-toggle {
373 |         display: inline-flex;
374 |     }
375 |
376 |     .site-nav {
377 |         display: none;
378 |         position: absolute;
379 |         top: var(--header-h);
380 |         left: 0;
381 |         right: 0;
382 |         background: rgba(7, 20, 17, 0.96);
383 |         padding: 1rem 6vw 1.25rem;
384 |         border-bottom: 1px solid var(--stroke);
385 |     }
386 |
387 |     .site-nav.is-open {
388 |         display: block;
389 |     }
390 |
391 |     .nav-list {
392 |         flex-direction: column;
393 |     }
394 |
395 |     .hero {
396 |         min-height: auto;
397 |         padding-top: 6vh;
398 |     }
399 |
400 |     .proof-strip,
401 |     .teaser-grid {
402 |         grid-template-columns: 1fr 1fr;
403 |     }
404 | }
405 |
406 | @media (max-width: 560px) {
407 |
408 |     .proof-strip,
409 |     .teaser-grid {
410 |         grid-template-columns: 1fr;
411 |     }
412 | }
```

- **Z. 371** Alles in diesem Block gilt nur, wenn das Fenster **höchstens 800 Pixel** breit ist. Es steht hinter den normalen Regeln, damit es sie überschreibt.
- **Z. 372–374** Der Menü-Button wird **sichtbar** (`inline-flex` statt `none`).
- **Z. 376–385** Die Navigation wird zu einem aufklappbaren Feld: erst `display: none`, also unsichtbar. `position: absolute` und `top: var(--header-h)` hängen sie direkt unter die Kopfzeile (die selbst `fixed` und damit der Bezugspunkt ist). `left: 0` und `right: 0` machen sie volle Breite. Dazu ein dunkler Hintergrund, Innenabstand und ein Strich unten.
- **Z. 387–389** Mit der Klasse `is-open` (die `nav.ts` setzt) wird das Feld sichtbar: `display: block`.
- **Z. 391–393** Die Liste steht auf dem Handy **untereinander** (`flex-direction: column`).
- **Z. 395–398** Auf dem Handy braucht das Hero keine Mindesthöhe mehr (`min-height: auto`) und weniger Platz oben.
- **Z. 400–403** Die Raster haben nur noch **zwei** Spalten (`1fr 1fr`).
- **Z. 406–412** Ein zweiter, kleinerer Haltepunkt: Auf sehr schmalen Handys wird jedes Raster **einspaltig** (`1fr`).

## Weniger Bewegung

```css
414 | /* Respect users who prefer less motion: drop hover lifts and glows */
415 | @media (prefers-reduced-motion: reduce) {
416 |     html {
417 |         scroll-behavior: auto;
418 |     }
419 |
420 |     *,
421 |     *::before,
422 |     *::after {
423 |         transition: none !important;
424 |     }
425 |
426 |     .btn:hover,
427 |     .proof-card:hover,
428 |     .teaser-card:hover,
429 |     .founder-chip:hover {
430 |         transform: none;
431 |     }
432 | }
```

- **Z. 415** Gilt nur, wenn der Nutzer in seinem System weniger Bewegung gewählt hat.
- **Z. 416–418** Das weiche Scrollen wird abgeschaltet.
- **Z. 420–424** **Alle** Übergänge (`transition`) werden abgeschaltet, auf allen Elementen, auch auf `::before` und `::after`. `!important` ist hier gewollt: Die Regel muss jede andere, genauere Regel überstimmen.
- **Z. 426–431** Die Verschiebungen und das Vergrößern beim Darüberfahren werden aufgehoben (`transform: none`). Der Schein darf bleiben, er ist keine Bewegung.

## Typische Fragen

- **Warum gibt es für alle Seiten fast gleiche CSS-Dateien?** Jede Seite lädt ihre eigene Datei. So kann jede Seite kleine Eigenheiten haben (zum Beispiel Orange auf der Problem-Seite). Der Nachteil ist, dass man Änderungen am gemeinsamen Teil siebenmal machen muss. Eine saubere Alternative wäre eine gemeinsame Datei plus kleine Seitendateien.
- **Was ist der Unterschied zwischen `display: none` und `opacity: 0`?** `display: none` entfernt das Element komplett aus dem Layout. `opacity: 0` macht es nur unsichtbar, es nimmt weiter Platz ein.
- **Warum `border-bottom: 2px solid transparent` bei den Menüpunkten?** Ein Rand, der nur beim Darüberfahren **hinzukommt**, würde den Text 2 Pixel verschieben. Ein durchsichtiger Rand reserviert den Platz.
- **Wozu die Variablen?** Eine Farbe an einer Stelle zu ändern genügt. Sie machen den Code besser lesbar (`var(--accent)` statt `#7dffb3`).
- **Wie funktioniert das aufklappbare Handy-Menü?** Das CSS versteckt die Navigation und zeigt sie bei `.is-open`. Das JavaScript (`nav.ts`) setzt und entfernt diese Klasse. Das CSS bestimmt also **wie** es aussieht, das Skript **wann**.
- **Was macht `::after` mit `content: ""`?** Es erzeugt ein Element ohne HTML, das man gestalten kann. Ohne `content` würde der Browser es gar nicht anlegen.

## Mach es selbst

1. Ändere `--accent` in Zeile 7 auf einen anderen Farbwert. Was ändert sich überall auf der Seite?
2. Setze in Zeile 263 `repeat(2, 1fr)` auf `repeat(3, 1fr)`. Was passiert mit den vier Teaser-Karten, und warum?
3. Mache den Breakpoint in Zeile 371 zu `600px`. Was ändert sich beim Verkleinern des Fensters? (Und was müsste in `nav.ts` mitgeändert werden?)
4. Entferne probehalber `content: ""` in Zeile 275. Was passiert mit dem Leuchtfleck?
5. Probiere im Browser `prefers-reduced-motion` aus (Entwicklerwerkzeuge, „Rendering"). Welche Regeln aus Zeilen 414 bis 432 greifen?
