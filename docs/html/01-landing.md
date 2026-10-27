# HTML 1: Die Seite `landing.html` Zeile für Zeile

Alle sieben Seiten haben dasselbe Gerüst: Kopfbereich, Menü, Hauptinhalt in Abschnitten, Fußzeile, Skripte. `landing.html` ist das Beispiel, an dem alles erklärt wird. In Kapitel 2 stehen nur noch die Unterschiede.

Lies zuerst Kapitel 0 (Grundlagen).

---


## Der Kopf (`<head>`)

```html
  1 | <!DOCTYPE html>
  2 | <html lang="en">
  3 |
  4 | <head>
  5 |     <meta charset="UTF-8">
  6 |     <meta name="viewport" content="width=device-width, initial-scale=1.0">
  7 |     <title>Go One | One App for Every Shared Bike</title>
  8 |     <meta name="description"
  9 |         content="Go One is one app that shows every shared bike nearby, compares prices, and lets riders pay and unlock with a single account.">
 10 |     <meta name="theme-color" content="#071411">
 11 |     <link rel="icon" type="image/svg+xml" href="../favicon.svg">
 12 |     <link rel="preconnect" href="https://fonts.googleapis.com">
 13 |     <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
 14 |     <link
 15 |         href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;600;800&family=Source+Sans+3:wght@400;600&display=swap"
 16 |         rel="stylesheet">
 17 |     <link rel="stylesheet" href="../css/landing.css">
 18 | </head>
```

- **Z. 1** Sagt dem Browser, dass es sich um ein modernes HTML-Dokument handelt. Ohne diese Zeile würde er in einen alten „Kompatibilitätsmodus" wechseln.
- **Z. 2** Das Wurzelelement. `lang="en"` sagt: Der Inhalt ist englisch. Screenreader lesen dann mit englischer Aussprache, und Browser bieten passende Übersetzungen an.
- **Z. 4** Alles im Kopf ist **unsichtbar** und beschreibt die Seite.
- **Z. 5** Der Zeichensatz. Ohne ihn würden Zeichen wie `ö` und `·` falsch dargestellt.
- **Z. 6** Wichtig für Handys: `width=device-width` sagt „nimm die echte Breite des Geräts", und `initial-scale=1.0` heißt „kein Vergrößern oder Verkleinern". Ohne diese Zeile würden Handys die Seite wie eine Desktop-Seite zeigen und verkleinern.
- **Z. 7** Der Titel im Browser-Tab und in Suchergebnissen. Jede Seite hat einen eigenen.
- **Z. 8–9** Eine Kurzbeschreibung für Suchmaschinen und Link-Vorschauen. Das Attribut `content` steht hier in der nächsten Zeile. Das ist erlaubt, es ist nur eine Frage der Lesbarkeit.
- **Z. 10** Auf dem Handy färbt sich die Adressleiste des Browsers in diesen Farbton.
- **Z. 11** Das Favicon, das Symbol im Tab. `rel="icon"` sagt, wofür der Link gedacht ist. `type="image/svg+xml"` nennt das Dateiformat. `../favicon.svg` liegt im Hauptordner, eine Ebene über `html/`.
- **Z. 12** Sagt dem Browser, dass er schon früh eine Verbindung zu diesem Server aufbauen soll, damit die Schrift schneller kommt.
- **Z. 13** Dasselbe für den Server, der die Schriftdateien ausliefert. `crossorigin` ist hier nötig, weil Schriften aus einer fremden Quelle geladen werden.
- **Z. 14–16** Lädt die Schriften Outfit (Stärken 400, 600, 800) und Source Sans 3 (400, 600). Das `+` in `Source+Sans+3` steht für ein Leerzeichen. `display=swap` heißt: Bis die Schrift da ist, zeigt der Browser den Text in einer Ersatzschrift, statt zu warten.
- **Z. 17** Lädt das Stylesheet dieser Seite. Jede Seite hat ihre eigene Datei.
- **Z. 18** Ende des Kopfes.

## Kopfzeile und Menü (`<header>`)

```html
 20 | <body>
 21 |     <!-- Site header: brand plus chapter navigation -->
 22 |     <header class="site-header">
 23 |         <a class="brand" href="landing.html">Go One</a>
 24 |         <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="site-nav">
 25 |             Menu
 26 |         </button>
 27 |         <nav id="site-nav" class="site-nav" aria-label="Main">
 28 |             <ul class="nav-list">
 29 |                 <li><a class="nav-link is-active" aria-current="page" href="landing.html">Home</a></li>
 30 |                 <li><a class="nav-link" href="market.html">Market</a></li>
 31 |                 <li><a class="nav-link" href="problem.html">Problem</a></li>
 32 |                 <li><a class="nav-link" href="solution.html">Solution</a></li>
 33 |                 <li><a class="nav-link" href="product.html">How it works</a></li>
 34 |                 <li><a class="nav-link" href="business.html">Business</a></li>
 35 |                 <li><a class="nav-link" href="team.html">Team</a></li>
 36 |             </ul>
 37 |         </nav>
 38 |     </header>
```

- **Z. 20** Ab hier beginnt der sichtbare Inhalt.
- **Z. 21** Ein HTML-Kommentar. Er ist im Quelltext sichtbar, aber nicht auf der Seite.
- **Z. 22** Das Kopfbereich-Element. `class` ist der Name, den das CSS verwendet (`.site-header`).
- **Z. 23** Das Logo als Link zur Startseite. `landing.html` liegt im selben Ordner, deshalb ohne `../`.
- **Z. 24–26** Der Menü-Button für das Handy. `type="button"` sagt, dass er nichts absendet (das gäbe es in einem Formular). `aria-expanded="false"` meldet Screenreadern, dass das Menü zu ist. `nav.ts` ändert diesen Wert beim Klicken. `aria-controls="site-nav"` sagt, **welches** Element er steuert: das mit der `id` `site-nav`.
- **Z. 27** Das Menü. Die `id` ist **einmalig** auf der Seite und das Ziel von `aria-controls`. Es gibt auch eine Klasse für das CSS. `aria-label="Main"` benennt diese Navigation, weil es auf der Seite noch eine zweite gibt (in der Fußzeile).
- **Z. 28** Eine Liste der Menüpunkte. Eine Liste ist hier richtig, weil die Links zusammengehören.
- **Z. 29** Der erste Punkt, die aktuelle Seite. Die zwei Klassen geben ihm das grüne Aussehen (`is-active`). `aria-current="page"` sagt es Screenreadern.
- **Z. 30–35** Die sechs anderen Seiten, jeweils als Link in einem Listenpunkt.
- **Z. 36–38** Schließt Liste, Menü und Kopfbereich.

## Der Hauptinhalt (`<main>`)

```html
 40 |     <main>
 41 |         <!-- Hero: headline, pitch, and primary call to action -->
 42 |         <section class="hero">
 43 |             <p class="eyebrow">Mobile sharing · Bike aggregator</p>
 44 |             <h1>One app that combines every bike-sharing provider</h1>
 45 |             <p class="lead">
 46 |                 Go One shows nearby bikes from Nextbike, Call a Bike, Mobike, LimeBike and more,
 47 |                 compares prices, and lets riders pay and unlock through a single account.
 48 |             </p>
 49 |             <div class="hero-actions">
 50 |                 <a class="btn btn-primary" href="market.html">Explore the pitch</a>
 51 |                 <a class="btn btn-ghost" href="product.html">See how it works</a>
 52 |             </div>
 53 |         </section>
```

- **Z. 40** Der Hauptinhalt. Pro Seite gibt es nur ein `<main>`.
- **Z. 42** Der Einstiegsabschnitt. Ein `<section>` fasst einen zusammenhängenden Teil zusammen.
- **Z. 43** Die kleine Zeile über der Überschrift. Ein Absatz, kein Titel.
- **Z. 44** Die Hauptüberschrift. **Es gibt nur eine pro Seite.**
- **Z. 45–48** Der Einleitungstext. Der Text darf über mehrere Zeilen laufen. Zeilenumbrüche und Einrückungen im Quelltext zeigt der Browser nur als ein Leerzeichen.
- **Z. 49** Ein neutraler Behälter für die zwei Buttons, damit das CSS sie nebeneinander legen kann.
- **Z. 50–51** Zwei **Links**, die wie Buttons aussehen. Die Klassen `btn` und `btn-primary` bzw. `btn-ghost` bestimmen das Aussehen. Es sind Links und keine `<button>`, weil sie auf eine andere Seite führen.

## Die Zahlenleiste

```html
 55 |         <!-- Proof strip: four market facts in a CSS Grid -->
 56 |         <section class="proof-strip" aria-label="Market snapshot">
 57 |             <article class="proof-card">
 58 |                 <p class="proof-value">1,250+</p>
 59 |                 <p class="proof-label">Bike-sharing providers worldwide</p>
 60 |             </article>
 61 |             <article class="proof-card">
 62 |                 <p class="proof-value">10M+</p>
 63 |                 <p class="proof-label">Shared bikes in circulation</p>
 64 |             </article>
 65 |             <article class="proof-card">
 66 |                 <p class="proof-value">20%</p>
 67 |                 <p class="proof-label">Expected yearly market growth</p>
 68 |             </article>
 69 |             <article class="proof-card">
 70 |                 <p class="proof-value">40.4%</p>
 71 |                 <p class="proof-label">Users who rent more than once a week</p>
 72 |             </article>
 73 |         </section>
```

- **Z. 55** Kommentar zum Abschnitt.
- **Z. 56** Ein Abschnitt ohne sichtbare Überschrift. `aria-label` gibt ihm einen Namen für Screenreader („Market snapshot"). Erst durch einen Namen wird ein `<section>` zu einer Orientierungsmarke.
- **Z. 57–60** Jede Kennzahl ist ein `<article>` (ein in sich geschlossener Inhalt). Darin steht die Zahl als Absatz (`proof-value`) und ihre Beschreibung als Absatz (`proof-label`). Die Klassen steuern das große grüne Aussehen im CSS und das Hochzählen in `motion.ts`.
- **Z. 61–72** Die drei weiteren Karten haben dieselbe Form.

## Die Teaser-Karten

```html
 75 |         <!-- Teaser grid: four pain/solution cards -->
 76 |         <section class="teaser">
 77 |             <h2>Sharing is booming. Finding a bike is still messy.</h2>
 78 |             <p class="section-intro">
 79 |                 Riders juggle several apps, several accounts, and no price overview.
 80 |                 Go One turns that into one map, one login, and one payment flow.
 81 |             </p>
 82 |             <div class="teaser-grid">
 83 |                 <article class="teaser-card">
 84 |                     <h3>Aggregated map</h3>
 85 |                     <p>See bikes from every partner in your area instead of opening four apps.</p>
 86 |                 </article>
 87 |                 <article class="teaser-card">
 88 |                     <h3>Price comparison</h3>
 89 |                     <p>Filter for the lowest fare or a favourite operator before you unlock.</p>
 90 |                 </article>
 91 |                 <article class="teaser-card">
 92 |                     <h3>One account</h3>
 93 |                     <p>Pay by card or PayPal once. 93% of surveyed users wanted this feature.</p>
 94 |                 </article>
 95 |                 <article class="teaser-card">
 96 |                     <h3>Time saved</h3>
 97 |                     <p>The closest bike is often from another provider. Go One shows the real nearest ride.</p>
 98 |                 </article>
 99 |             </div>
100 |         </section>
```

- **Z. 76** Ein Abschnitt mit eigener Überschrift.
- **Z. 77** Die Überschrift des Abschnitts, **eine Ebene unter** der `h1`.
- **Z. 78–81** Der Einleitungstext des Abschnitts.
- **Z. 82** Der Behälter, den das CSS zu einem Raster aus 2 × 2 macht.
- **Z. 83–86** Eine Karte mit einer Überschrift `<h3>` (eine Ebene unter `h2`) und einem Absatz. Die Überschriftenfolge `h1`, `h2`, `h3` ist lückenlos.
- **Z. 87–98** Die drei weiteren Karten.

## Das Team

```html
102 |         <!-- Founder strip: short team teaser linking to the full team page -->
103 |         <section class="founders">
104 |             <h2>Four founders. One product.</h2>
105 |             <div class="founder-row">
106 |                 <article class="founder-chip">
107 |                     <p class="founder-role">CEO</p>
108 |                     <p class="founder-name">A. Ausma</p>
109 |                 </article>
110 |                 <article class="founder-chip">
111 |                     <p class="founder-role">CMO</p>
112 |                     <p class="founder-name">J. Mörschel</p>
113 |                 </article>
114 |                 <article class="founder-chip">
115 |                     <p class="founder-role">COO</p>
116 |                     <p class="founder-name">M. Pugachevskiy</p>
117 |                 </article>
118 |                 <article class="founder-chip">
119 |                     <p class="founder-role">CFO</p>
120 |                     <p class="founder-name">M. Zimmermann</p>
121 |                 </article>
122 |             </div>
123 |             <a class="text-link" href="team.html">Meet the team</a>
124 |         </section>
125 |     </main>
```

- **Z. 103** Der Teamabschnitt. **Ein Hinweis zu den Namen:** Die Klassen `founders` und `founder-chip` passen nur auf der Startseite und der Team-Seite. Auf den anderen Seiten stehen darunter ganz andere Inhalte (zum Beispiel „Plan" oder „Coverage"). Der Name beschreibt also das Aussehen (eine Reihe kleiner Karten), nicht den Inhalt. Treffender wären Namen wie `chip-section` und `chip`. Umbenennen müsste man dann in allen sieben HTML- und CSS-Dateien.
- **Z. 104** Wieder eine Überschrift der zweiten Ebene.
- **Z. 105** Behälter für die vier Chips.
- **Z. 106–109** Ein Chip mit der Rolle (`founder-role`) und dem Namen (`founder-name`) als zwei Absätze.
- **Z. 110–121** Die drei weiteren Chips mit Rolle und Name in der Kurzform, zum Beispiel „M. Pugachevskiy".
- **Z. 123** Ein Textlink am Ende des Abschnitts.
- **Z. 124–125** Schließt den Abschnitt und `<main>`.

## Fußzeile und Skripte

```html
127 |     <!-- Footer with chapter shortcuts -->
128 |     <footer class="site-footer">
129 |         <p class="footer-brand">Go One · Build your own business · Pitch project 2019</p>
130 |         <nav aria-label="Footer">
131 |             <a href="market.html">Market</a>
132 |             <a href="business.html">Business</a>
133 |             <a href="team.html">Team</a>
134 |         </nav>
135 |     </footer>
136 |
137 |     <!-- Shared scripts first (menu, motion), then the page-specific script -->
138 |     <script src="../ts/nav.js"></script>
139 |     <script src="../ts/motion.js"></script>
140 |     <script src="../ts/landing.js"></script>
141 |
142 | </body>
143 |
144 | </html>
```

- **Z. 128** Die Fußzeile.
- **Z. 129** Die Markenzeile mit dem Hinweis auf das Jahr. Das Zeichen `·` (Mittelpunkt) steht direkt im Text.
- **Z. 130** Die zweite Navigation der Seite. Der Name „Footer" unterscheidet sie vom Hauptmenü („Main"), damit Screenreader beide auseinanderhalten.
- **Z. 131–133** Drei Links zu anderen Seiten. Welche genau, wechselt von Seite zu Seite.
- **Z. 134–135** Schließt Navigation und Fußzeile.
- **Z. 137** Kommentar: Zuerst die gemeinsamen Skripte, dann das der Seite.
- **Z. 138** Lädt das Menü-Skript. `src` ist der Pfad: eine Ebene hoch, in den Ordner `ts`.
- **Z. 139** Lädt das Skript für Hochzählen und Einblenden.
- **Z. 140** Lädt das Skript der Seite. Es ist im Moment ein leerer Platzhalter.
- **Z. 142** und **Z. 144** Das Ende der Seite.

## Typische Fragen

- **Warum steht das Skript am Ende des `<body>`?** Der Code sucht Elemente wie das Menü. Die müssen schon existieren. Eine Alternative ist das Attribut `defer`, das den Browser das Skript erst nach dem Aufbau ausführen lässt.
- **Warum gibt es nur eine `<h1>`?** Sie nennt das Hauptthema der Seite. Suchmaschinen und Screenreader orientieren sich daran.
- **Warum sind die Hero-Buttons Links?** Sie führen auf andere Seiten. Ein `<button>` ist für Aktionen auf derselben Seite da, zum Beispiel das Öffnen des Menüs.
- **Wozu `aria-label` auf `<nav>`?** Die Seite hat zwei Navigationen. Der Name sagt Screenreadern, welche gemeint ist.
- **Was macht `aria-current="page"`?** Es markiert den Link zur aktuellen Seite für Hilfsmittel. Die grüne Farbe sieht man, das Attribut hört man.
- **Wozu `<meta name="viewport">`?** Ohne sie zeigen Handys die Seite wie eine verkleinerte Desktop-Seite. Mit ihr greifen die Media Queries im CSS.
- **Was ist der Unterschied zwischen `<div>` und `<section>`?** `<div>` hat keine Bedeutung und dient dem Layout. `<section>` sagt „das ist ein thematischer Abschnitt".
- **Warum steht `lang="en"` im Kopf?** Screenreader wählen danach die Aussprache. Steht dort die falsche Sprache, klingt der Text unverständlich.

## Mach es selbst

1. Öffne in Chrome die Entwicklerwerkzeuge (`F12`), Reiter „Elements", und klappe den `<body>` auf. Findest du jede Zeile aus diesem Kapitel wieder?
2. Öffne den Reiter „Accessibility" und sieh dir den Barrierefreiheitsbaum an. Welche Landmarks (`banner`, `navigation`, `main`, `contentinfo`) werden angezeigt?
3. Drücke Tab auf der Seite. In welcher Reihenfolge wandert der Fokus? Warum ist die Reihenfolge die des Quelltextes?
4. Lege eine neue Seite an: Welche Dateien musst du erstellen oder ändern, damit sie im Menü aller Seiten erscheint? (Eine neue HTML-Datei, ein Stylesheet, ein Skript, und in **allen** sieben Seiten ein Menüpunkt.)
5. Prüfe eine Seite mit dem W3C-Validator (validator.w3.org). Zeigt er Hinweise?
