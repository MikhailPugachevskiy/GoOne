# HTML 2: Was jede Seite anders macht

Alle sieben Seiten haben dasselbe Gerüst wie `landing.html` (Kapitel 1): Kopf mit `<title>` und Stylesheet, Header mit Menü, `<main>` mit Abschnitten, Fußzeile, Skripte am Ende. Dieses Kapitel zeigt nur die **Unterschiede**.

**So findest du sie selbst:** Im Terminal im Projektordner `git diff --no-index html/landing.html html/market.html`. Besser noch: In Chrome zwei Seiten nebeneinander öffnen und die Entwicklerwerkzeuge vergleichen.

## Was sich auf jeder Seite ändert

| Seite | Titel (`<title>`) | Zeile über der Überschrift (`eyebrow`) | Skripte am Ende (nach `nav.js`, `motion.js`) |
| --- | --- | --- | --- |
| `landing` | Go One \| One App for Every Shared Bike | Mobile sharing · Bike aggregator | `landing.js` |
| `market` | Go One \| Market Opportunity | Chapter 1 · Market | `market.js` |
| `problem` | Go One \| Customer Pain Points | Chapter 2 · Problem | `problem.js` |
| `solution` | Go One \| The Solution | Chapter 3 · Solution | `solution.js` |
| `product` | Go One \| How It Works | Chapter 4 · How it works | `product.js`, **`product-demo.js`** |
| `business` | Go One \| Business Case | Chapter 5 · Business | `business.js`, **`business-calculator.js`** |
| `team` | Go One \| The Founding Team | Chapter 6 · Team | `team.js` |

Außerdem ändern sich auf jeder Seite:

- der Pfad des Stylesheets (`../css/market.css` und so weiter) und die **Beschreibung** (`<meta name="description">`),
- der Menüpunkt mit der Klasse `is-active` und mit `aria-current="page"`: immer die eigene Seite,
- Überschriften, Texte und Zahlen der Abschnitte.

## Der Weg durch das Pitch

Jede Kapitelseite führt mit zwei Buttons und einem Textlink zur **nächsten** und **vorherigen** Seite. So kann man das Pitch wie ein Buch durchlesen:

| Seite | Hero-Buttons (primär, zweiter) | Textlink am Ende |
| --- | --- | --- |
| `landing` | Explore the pitch (`market`), See how it works (`product`) | Meet the team (`team`) |
| `market` | See the pain points (`problem`), Back to home (`landing`) | Next: the customer pain points (`problem`) |
| `problem` | See the Go One fix (`solution`), Back to market (`market`) | Next: how Go One removes these frictions (`solution`) |
| `solution` | See how it works (`product`), Back to the problem (`problem`) | Next: find, pay, and unlock in five steps (`product`) |
| `product` | See the business case (`business`), Back to the solution (`solution`) | Next: customers, competition, and the plan (`business`) |
| `business` | Meet the founders (`team`), Back to the product (`product`) | Next: the four founders behind Go One (`team`) |
| `team` | Back to home (`landing`), Back to the business case (`business`) | Return to the start of the pitch (`landing`) |

Die Reihenfolge ist: `market` → `problem` → `solution` → `product` → `business` → `team`, und von dort zurück zur Startseite. Die Kapitelnummern in der „Eyebrow"-Zeile folgen derselben Reihenfolge.

**Fußzeilen-Links:** Sie wechseln von Seite zu Seite (zum Beispiel `market`: Home, Problem, Team, `business`: How it works, Team, Home). Es gibt dafür keine strenge Regel. Es sind jeweils drei nützliche Ziele. Das ist unproblematisch, man könnte sie aber vereinheitlichen.

---

## Zwei Seiten mit zusätzlichem Abschnitt

### `product.html`: die App-Demo

```html
106 |         <!-- Interactive demo: React mounts into #go-one-demo (source in react/src, bundle in ts/product-demo.js) -->
107 |         <section class="demo" aria-labelledby="demo-title">
108 |             <h2 id="demo-title">Try the flow yourself</h2>
109 |             <p class="section-intro">
110 |                 A small demo with sample data: filter the map, choose a bike, pay once, and unlock.
111 |                 No real bikes or bookings are involved.
112 |             </p>
113 |             <div id="go-one-demo">
114 |                 <p class="section-intro">The interactive demo needs JavaScript.</p>
115 |             </div>
116 |         </section>
```

- **Z. 107** Ein eigener Abschnitt. `aria-labelledby="demo-title"` sagt: Der Name dieses Abschnitts steht in dem Element mit der `id` `demo-title`, also in der `<h2>` darunter. So hat der Abschnitt für Screenreader einen Namen, ohne ihn doppelt zu schreiben.
- **Z. 108** Die Überschrift trägt die `id`, auf die der Abschnitt zeigt.
- **Z. 113** **Der Platz für React.** `main.tsx` sucht genau diese `id` und zeichnet die Demo hinein.
- **Z. 114** Ein **Rückfalltext**: Er steht im `<div>`, bis React ihn ersetzt. Hat jemand JavaScript ausgeschaltet oder schlägt das Laden fehl, sieht er diesen Text statt einer leeren Fläche.
- Außerdem hat `product.html` **fünf** Schrittkarten im Teaser (die anderen Seiten vier) und lädt als zusätzliches Skript `product-demo.js`.

### `business.html`: der Rechner

```html
137 |         <!-- Interactive calculator: React mounts into #go-one-calculator (source in react/src/calculator, bundle in ts/business-calculator.js) -->
138 |         <section class="calculator" aria-labelledby="calculator-title">
139 |             <h2 id="calculator-title">Test the break-even yourself</h2>
140 |             <p class="section-intro">
141 |                 Change the fee, the ride volume and the costs, and see when Go One breaks even and whether the two
142 |                 funding rounds are enough. The default setting is the plan from the pitch.
143 |             </p>
144 |             <div id="go-one-calculator">
145 |                 <p class="section-intro">The interactive calculator needs JavaScript.</p>
146 |             </div>
147 |             <a class="text-link" href="team.html">Next: the four founders behind Go One</a>
148 |         </section>
149 |
150 |     </main>
```

- **Z. 138** Genauso aufgebaut wie die Demo: ein Abschnitt, dessen Name in der Überschrift darunter steht.
- **Z. 144** Der Platz für den Rechner. `calculatorMain.tsx` sucht diese `id`.
- **Z. 145** Der Rückfalltext.
- **Z. 147** Der Textlink „Next: …" steht hier am **Ende des Rechner-Abschnitts**, nicht am Ende des Plan-Abschnitts. Er wurde dorthin verschoben, damit die Seite nicht mit einem Link in der Mitte endet.

## Was an allen sieben Seiten gleich bleibt

- Dieselbe Reihenfolge der Abschnitte: Hero, Zahlenleiste (`proof-strip`), Teaser (`teaser`), ein Abschnitt mit Chips (`founders`).
- Dasselbe Menü mit denselben sieben Punkten, nur der aktive wechselt.
- Dieselben Klassen für dieselben Dinge. Auf jeder Seite stehen **vier** Zahlenkarten, **vier** Teaser-Karten (außer `product`: fünf) und **vier** Chips.

## Auffälligkeiten

- **Die Klassen `founders` und `founder-chip` stehen auf Seiten ohne Gründer.** Auf `market`, `problem`, `solution`, `product` und `business` tragen sie andere Inhalte (zum Beispiel „Gap", „Map", „Local", „MVP"). Der Name stammt von der Startseite und ist mit der Zeit zu eng geworden. Das ist eine **Benennungsschwäche** und kein Fehler. Treffender wären neutrale Namen.
- **Die Seiten wiederholen viel Text** (Header, Footer, Skriptzeilen). Bei sieben Seiten ist das vertretbar. Bei vielen Seiten würde man ein Werkzeug einsetzen, das Teile wiederverwendbar macht (zum Beispiel ein Framework oder Vorlagen).
- **Es gibt keinen „Zum Inhalt springen"-Link** am Anfang der Seite. Mit einem solchen Link könnten Tastaturnutzer das Menü überspringen und direkt zum Hauptinhalt gelangen. Das wäre eine sinnvolle Ergänzung für die Barrierefreiheit.

## Typische Fragen

- **Wie ist das Projekt aufgebaut?** Sieben HTML-Seiten, die sich ein Gerüst teilen. Jede Seite hat ihr eigenes Stylesheet und Skript. Auf zwei Seiten sitzt ein Platz (`#go-one-demo`, `#go-one-calculator`), in den React eine interaktive Anwendung zeichnet.
- **Warum gibt es einen Rückfalltext in den React-Plätzen?** Falls das Skript nicht lädt oder JavaScript aus ist, soll die Seite nicht leer wirken. Das ist das Prinzip der **schrittweisen Verbesserung**: Die Seite funktioniert grundsätzlich ohne JavaScript, das Skript fügt die Interaktion hinzu.
- **Warum `aria-labelledby` statt `aria-label`?** Weil der Name bereits als sichtbarer Text existiert (die Überschrift). `aria-labelledby` verweist darauf, ohne den Text zu doppeln.
- **Wie kommt eine neue Seite ins Menü?** In allen sieben Seiten ein `<li>` mit einem Link eintragen. Das ist die Schwäche der Kopier-Methode.
- **Woran siehst du, welche Seite aktiv ist?** An der Klasse `is-active` (grüne Farbe) und dem Attribut `aria-current="page"` (für Screenreader).

## Mach es selbst

1. Füge in der Navigation aller Seiten einen achten Punkt „About" hinzu (die Seite musst du noch nicht anlegen). Wie viele Dateien musst du dafür ändern?
2. Füge am Anfang von `landing.html` direkt hinter dem `<body>` einen „Skip link" ein: `<a class="skip-link" href="#main">Skip to content</a>`. Welche Zeile musst du außerdem bei `<main>` ändern? (Es braucht ein `id="main"`.) Welches CSS braucht der Link?
3. Vergleiche mit `git diff --no-index html/market.html html/problem.html` die beiden Seiten. Welche Zeilen sind gleich, welche nicht?
4. Schalte JavaScript im Browser aus (Entwicklerwerkzeuge, Befehlsmenü, „Disable JavaScript") und öffne `product.html`. Was siehst du dort, wo sonst die Demo ist?
