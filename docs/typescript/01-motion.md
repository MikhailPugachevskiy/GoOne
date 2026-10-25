# TypeScript 2: Animationen `motion.ts`

`motion.ts` macht zwei Dinge auf allen Seiten:

1. **Hochzählen:** Zahlen wie „40.4%" oder „1,250+" zählen von 0 hoch, sobald man sie sieht.
2. **Einblenden:** Karten sind zuerst unsichtbar und gleiten leicht nach oben ein, sobald sie ins Bild kommen.

Das ist die größte TypeScript-Datei des Projekts (119 Zeilen). Sie benutzt drei Browser-Werkzeuge, die neu sind: den `IntersectionObserver`, `requestAnimationFrame` und die *Web Animations API*. Lies zuerst Kapitel „TypeScript 1: Menü", dort werden DOM, Ereignisse und die Typen `as` und `?? null` erklärt.

## Die drei neuen Werkzeuge

| Werkzeug | Aufgabe | Hier benutzt für |
| --- | --- | --- |
| **`IntersectionObserver`** | meldet, wenn ein Element ins sichtbare Fenster hinein- oder herausrückt | Start des Zählens und des Einblendens |
| **`requestAnimationFrame`** | ruft eine Funktion vor dem **nächsten Zeichnen** des Bildschirms auf (meist 60-mal pro Sekunde) | Schritte des Hochzählens |
| **`element.animate(...)`** | die *Web Animations API*: spielt eine Animation direkt ab, ohne CSS-Klassen | Einblenden der Karten |

**Warum ein `IntersectionObserver` und nicht das Scroll-Ereignis?** Mit dem Scroll-Ereignis müsste man bei jedem Pixel Scrollen selbst ausrechnen, wo jedes Element liegt. Das ist aufwendig und kann die Seite ruckeln lassen. Der Beobachter meldet nur, wenn sich etwas ändert, und der Browser rechnet selbst.

**Progressive Verbesserung:** Ohne JavaScript ist alles sichtbar und zeigt die Endzahlen. Erst das Skript versteckt die Karten und setzt die Zahlen auf 0. Fällt das Skript aus, ist die Seite trotzdem vollständig lesbar.

---


## Schutzprüfungen am Anfang

```ts
  1 | /* Shared motion for every chapter page: scroll reveal for cards and count-up for big numbers */
  2 | function initMotion(): void {
  3 |     /* Respect users who prefer less motion, and skip browsers without the needed API */
  4 |     const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  5 |     if (reducedMotion || !("IntersectionObserver" in window)) {
  6 |         return;
  7 |     }
```

- **Z. 1** Kommentar: Die Datei gilt für alle Seiten.
- **Z. 2** Wie bei `nav.ts`: Der Code steckt in einer Funktion, die ganz unten aufgerufen wird.
- **Z. 4** Fragt den Browser, ob der Nutzer in seinem Betriebssystem „Bewegung reduzieren" eingestellt hat. Manche Menschen werden von Animationen schwindelig oder abgelenkt. `matchMedia(...)` gibt ein Objekt zurück, `.matches` ist `true` oder `false`.
- **Z. 5** Zwei Gründe, gar nichts zu tun: Der Nutzer will keine Bewegung, **oder** der Browser kennt den `IntersectionObserver` nicht. Der Operator `in` prüft, ob das `window`-Objekt diese Eigenschaft hat.
- **Z. 6** Beendet die Funktion. Die Seite bleibt dann unverändert: alles sichtbar, Zahlen fertig.

## Die Zählfunktion vorbereiten

```ts
  9 |     /* Count-up: only values with exactly one number of 10 or more are animated (e.g. 40.4%, 1,250+, N = 104) */
 10 |     const numberPattern = /\d[\d,]*(?:\.\d+)?/g;
 11 |
 12 |     const prepareCounter = (el: HTMLElement): (() => void) | null => {
 13 |         const text = el.textContent ?? "";
 14 |         const matches = text.match(numberPattern);
 15 |         if (!matches || matches.length !== 1) {
 16 |             return null;
 17 |         }
 18 |
 19 |         const token = matches[0];
 20 |         const target = parseFloat(token.replace(/,/g, ""));
 21 |         if (target < 10) {
 22 |             return null;
 23 |         }
```

- **Z. 9** Kommentar: Es werden nur Werte hochgezählt, die genau eine Zahl ab 10 enthalten.
- **Z. 10** Ein **regulärer Ausdruck** (Regex) beschreibt ein Textmuster. `\d` ist eine Ziffer. `[\d,]*` sind beliebig viele (auch keine) Ziffern oder Kommas. `(?:\.\d+)?` ist ein **optionaler** Dezimalteil: ein Punkt und mindestens eine Ziffer. `g` bedeutet „alle Treffer, nicht nur den ersten". Beispiele: In „1,250+" findet er `1,250`. In „40.4%" findet er `40.4`. In „EUR 7–8bn" findet er `7` und `8`. In „N = 104" findet er `104`.
- **Z. 12** Eine Pfeilfunktion, die ein Element bekommt. Ihr Rückgabetyp `(() => void) | null` heißt: entweder eine **Funktion**, die nichts zurückgibt (die Startfunktion), oder `null`, wenn dieses Element nicht hochgezählt werden soll. Die Klammern um `() => void` sind nötig, damit das `| null` zum ganzen Funktionstyp gehört.
- **Z. 13** Der sichtbare Text des Elements. `textContent` kann `null` sein, dann nimmt man einen leeren Text.
- **Z. 14** Sucht alle Treffer des Musters. Das Ergebnis ist eine Liste von Texten oder `null`, wenn es keinen gab.
- **Z. 15–17** Es wird nur weitergemacht, wenn **genau eine** Zahl gefunden wurde. Bei „EUR 7–8bn" (zwei Zahlen) oder „CEO" (keine) gibt die Funktion `null` zurück.
- **Z. 19** Der gefundene Zahlentext, zum Beispiel `"1,250"`.
- **Z. 20** Das Ziel als echte Zahl. `replace(/,/g, "")` entfernt **alle** Kommas (das `g` im Regex), aus `"1,250"` wird `"1250"`. `parseFloat` macht daraus die Zahl 1250.
- **Z. 21–23** Zahlen unter 10 werden nicht hochgezählt. Es sind die Schrittnummern 1 bis 4 auf der Produktseite und ähnliche, bei denen Hochzählen keinen Sinn hat.

## Text vor und nach der Zahl merken

```ts
 25 |         /* Keep the text around the number (for example "N = " or "%") and its number format */
 26 |         const position = text.indexOf(token);
 27 |         const prefix = text.slice(0, position);
 28 |         const suffix = text.slice(position + token.length);
 29 |         const decimals = token.includes(".") ? token.split(".")[1].length : 0;
 30 |         const useGrouping = token.includes(",");
 31 |
 32 |         const format = (value: number): string =>
 33 |             value.toLocaleString("en-US", {
 34 |                 minimumFractionDigits: decimals,
 35 |                 maximumFractionDigits: decimals,
 36 |                 useGrouping
 37 |             });
 38 |
 39 |         /* Fixed-width digits stop the text from jittering while it counts */
 40 |         el.style.fontVariantNumeric = "tabular-nums";
 41 |         el.textContent = prefix + format(0) + suffix;
```

- **Z. 25** Kommentar: Zeichen um die Zahl, wie `N = ` oder `%`, sollen erhalten bleiben.
- **Z. 26** An welcher Stelle im Text beginnt die Zahl?
- **Z. 27** Alles **vor** der Zahl, zum Beispiel `"N = "`.
- **Z. 28** Alles **nach** der Zahl, zum Beispiel `"%"` oder `"+"`.
- **Z. 29** Wie viele Nachkommastellen hat die Zahl? Wenn ein Punkt drin ist, teilt `split(".")` den Text, und `[1].length` ist die Länge des Teils hinter dem Punkt (bei `40.4` ist es 1). Sonst 0.
- **Z. 30** Hat die Zahl Tausendertrennzeichen (ein Komma)? Wenn ja, soll die Anzeige beim Zählen auch Kommas haben.
- **Z. 32–37** Eine Hilfsfunktion, die eine Zahl in denselben Stil bringt wie das Original. `toLocaleString("en-US", {...})` formatiert nach englischem Zahlenstil mit Komma als Tausendertrenner. `minimumFractionDigits` und `maximumFractionDigits` legen die Nachkommastellen fest. `useGrouping` allein (ohne `: wert`) ist die Kurzschreibweise für `useGrouping: useGrouping`.
- **Z. 39–41** Setzt die Ziffern auf gleiche Breite, damit der Text beim Zählen nicht hin- und herspringt. Direkt danach (Zeile 41) wird der Anfangstext gesetzt: `prefix + format(0) + suffix`, zum Beispiel `"0%"`.

## Die Startfunktion mit der Animation

```ts
 43 |         return (): void => {
 44 |             const duration = 1400;
 45 |             const began = performance.now();
 46 |
 47 |             const step = (now: number): void => {
 48 |                 const progress = Math.min((now - began) / duration, 1);
 49 |                 const eased = 1 - Math.pow(1 - progress, 3);
 50 |                 el.textContent = progress < 1 ? prefix + format(target * eased) + suffix : text;
 51 |                 if (progress < 1) {
 52 |                     requestAnimationFrame(step);
 53 |                 }
 54 |             };
 55 |
 56 |             requestAnimationFrame(step);
 57 |         };
 58 |     };
```

- **Z. 43** Die Funktion gibt eine **neue Funktion** zurück: die Startfunktion. Sie wird erst aufgerufen, wenn man die Zahl sieht. Die Startfunktion „merkt" sich `el`, `prefix`, `suffix`, `target` und `format` aus ihrer Umgebung (eine **Closure**).
- **Z. 44** Die Zählung dauert 1400 Millisekunden.
- **Z. 45** Die aktuelle Zeit in Millisekunden mit hoher Genauigkeit, gemessen seit dem Laden der Seite.
- **Z. 47** Die Funktion, die für jedes Bild einmal aufgerufen wird. `requestAnimationFrame` übergibt ihr die aktuelle Zeit (`now`).
- **Z. 48** Der Fortschritt von 0 bis 1: vergangene Zeit geteilt durch die Gesamtdauer. `Math.min(..., 1)` begrenzt auf 1, damit es nach Ablauf der Zeit nicht weiterwächst.
- **Z. 49** Eine **Abbremsung** (*ease-out cubic*): Am Anfang geht die Zahl schnell nach oben, am Ende langsam. Bei `progress = 0.5` ergibt es `1 - 0.5³ = 0.875`, also sind nach der halben Zeit schon 87,5 % erreicht. Das wirkt natürlicher als gleichmäßiges Zählen.
- **Z. 50** Setzt den Text. Solange die Zeit nicht um ist, wird der berechnete Zwischenwert angezeigt. Im letzten Schritt kommt **der Originaltext** (`text`), damit am Ende garantiert exakt die ursprüngliche Zahl dasteht, ohne mögliche Rundungsunterschiede.
- **Z. 51–53** Ist die Zeit noch nicht um, wird `step` für das nächste Bild eingeplant. Die Funktion ruft sich also immer wieder selbst auf (Rekursion über `requestAnimationFrame`), bis der Fortschritt 1 erreicht.
- **Z. 56** Plant das **erste** Bild ein. Ab hier läuft die Schleife von selbst.

## Der Beobachter für die Zahlen

```ts
 60 |     /* Each counter starts once, when its number is mostly visible */
 61 |     const counters = new Map<Element, () => void>();
 62 |     document.querySelectorAll<HTMLElement>(".proof-value").forEach((el) => {
 63 |         const start = prepareCounter(el);
 64 |         if (start) {
 65 |             counters.set(el, start);
 66 |         }
 67 |     });
 68 |
 69 |     const counterObserver = new IntersectionObserver(
 70 |         (entries, observer) => {
 71 |             entries.forEach((entry) => {
 72 |                 if (!entry.isIntersecting) {
 73 |                     return;
 74 |                 }
 75 |                 counters.get(entry.target)?.();
 76 |                 observer.unobserve(entry.target);
 77 |             });
 78 |         },
 79 |         { threshold: 0.6 }
 80 |     );
 81 |     counters.forEach((_start, el) => counterObserver.observe(el));
```

- **Z. 60** Kommentar: Jede Zählung startet nur einmal, wenn die Zahl überwiegend sichtbar ist.
- **Z. 61** Eine `Map` ist ein Nachschlagewerk von Schlüssel zu Wert. Hier: Schlüssel ist das Element, Wert ist seine Startfunktion. Die Typen in den spitzen Klammern sagen das.
- **Z. 62** Holt **alle** Elemente mit der Klasse `proof-value` (die großen Zahlen) und geht sie durch.
- **Z. 63–66** Bereitet das Element vor. Gibt es eine Startfunktion (nicht `null`), kommt sie in die `Map`. `counters.set(el, start)` speichert das Paar. Ab hier steht auf dem Bildschirm schon „0%", bis der Beobachter die Zählung startet.
- **Z. 69** Erzeugt den Beobachter. Er bekommt eine Funktion und eine Einstellung.
- **Z. 70** Die Funktion wird aufgerufen, wenn sich bei beobachteten Elementen etwas ändert. `entries` ist die Liste der Änderungen, `observer` der Beobachter selbst.
- **Z. 71** Geht jede Änderung durch.
- **Z. 72–74** `isIntersecting` ist `true`, wenn das Element jetzt im sichtbaren Bereich liegt. Wenn nicht, wird nichts getan.
- **Z. 75** Holt die Startfunktion zum Element und ruft sie auf. Das `?.()` ist der **optionale Aufruf**: Wenn `get` nichts findet (`undefined`), passiert einfach nichts, statt dass ein Fehler kommt.
- **Z. 76** Beobachtet dieses Element nicht mehr, damit die Zählung nur einmal startet.
- **Z. 79** Die Einstellung: Die Funktion wird aufgerufen, wenn **mindestens 60 %** des Elements sichtbar sind.
- **Z. 81** Meldet alle Elemente aus der `Map` beim Beobachter an. `Map.forEach` gibt zuerst den Wert und dann den Schlüssel, deshalb steht der Wert vorn. Der Unterstrich in `_start` ist eine Konvention für „diesen Parameter brauche ich nicht".

## Die Karten vorbereiten

```ts
 83 |     /* Scroll reveal: cards stay hidden until they enter the viewport, then fade up once */
 84 |     const cards = document.querySelectorAll<HTMLElement>(".proof-card, .teaser-card, .founder-chip");
 85 |     cards.forEach((card) => {
 86 |         card.style.opacity = "0";
 87 |     });
```

- **Z. 83** Kommentar zum Einblenden.
- **Z. 84** Holt alle Karten. Der Selektor mit Kommas bedeutet „eines von diesen dreien".
- **Z. 85–87** Setzt bei jeder Karte per Skript `opacity` auf 0. Sie ist damit unsichtbar. Das macht das **Skript** und nicht das CSS, damit die Karten ohne JavaScript sichtbar bleiben.

## Der Beobachter für das Einblenden

```ts
 89 |     const revealObserver = new IntersectionObserver(
 90 |         (entries, observer) => {
 91 |             entries.forEach((entry) => {
 92 |                 if (!entry.isIntersecting) {
 93 |                     return;
 94 |                 }
 95 |
 96 |                 const card = entry.target as HTMLElement;
 97 |
 98 |                 /* Stagger cards in the same row or grid by their position, capped so late cards do not wait long */
 99 |                 const siblings = card.parentElement ? Array.from(card.parentElement.children) : [card];
100 |                 const delay = Math.min(siblings.indexOf(card), 4) * 90;
101 |
102 |                 /* The Web Animations API leaves no leftover styles, so the CSS hover effects keep working */
103 |                 card.animate(
104 |                     [
105 |                         { opacity: 0, transform: "translateY(18px)" },
106 |                         { opacity: 1, transform: "translateY(0)" }
107 |                     ],
108 |                     { duration: 600, delay, easing: "ease-out", fill: "backwards" }
109 |                 );
110 |                 card.style.opacity = "";
111 |                 observer.unobserve(card);
112 |             });
113 |         },
114 |         { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
115 |     );
116 |     cards.forEach((card) => revealObserver.observe(card));
117 | }
```

- **Z. 89** Ein zweiter Beobachter, genauso aufgebaut wie der erste.
- **Z. 92–94** Nur Elemente, die jetzt im Bild sind.
- **Z. 96** Das Element, das sichtbar wurde. `as HTMLElement` ist wieder die Zusicherung an den Compiler.
- **Z. 98** Kommentar: Karten derselben Reihe sollen nacheinander erscheinen.
- **Z. 99** Die Geschwister der Karte (alle Kindelemente des Elternelements). `children` ist keine echte Liste, deshalb macht `Array.from` eine daraus. Wenn die Karte kein Elternelement hat (kommt praktisch nicht vor), nimmt man eine Liste nur mit ihr selbst.
- **Z. 100** Die Verzögerung: Position der Karte unter ihren Geschwistern mal 90 Millisekunden, aber höchstens für die fünfte Karte (`Math.min(..., 4)`). So müssen weiter hinten liegende Karten nicht lange warten.
- **Z. 102** Kommentar mit dem Grund für die Wahl der Web Animations API: Sie hinterlässt keine Spuren am Element.
- **Z. 103–109** Spielt eine Animation auf der Karte ab. Das erste Argument sind die **Schlüsselbilder**: Am Anfang unsichtbar und 18 Pixel nach unten verschoben (`translateY(18px)`), am Ende voll sichtbar an der richtigen Stelle. Das zweite Argument sind die Einstellungen: `duration` 600 ms, `delay` die berechnete Verzögerung, `easing: "ease-out"` bremst am Ende ab, und `fill: "backwards"` hält die Karte während der Wartezeit schon im Anfangszustand.
- **Z. 110** Entfernt die zu Beginn gesetzte Unsichtbarkeit (Zeile 86). Das ist erst jetzt sicher, weil `fill: "backwards"` die Karte während der Wartezeit unsichtbar hält. Nach der Animation ist die Karte ohne eigene Stile einfach sichtbar.
- **Z. 111** Die Karte wird nicht weiter beobachtet. Das Einblenden passiert nur einmal.
- **Z. 114** `threshold: 0.15` heißt: ab 15 % Sichtbarkeit. `rootMargin` verändert den Beobachtungsbereich, in der Reihenfolge oben, rechts, unten, links. `-40px` unten **verkleinert** den Bereich unten um 40 Pixel, also wird eine Karte erst eingeblendet, wenn sie etwas über der unteren Kante steht. So sieht man die Bewegung auch.
- **Z. 116** Meldet alle Karten beim Beobachter an.
- **Z. 119** **Ruft die Funktion auf.** Erst jetzt passiert etwas.

## Typische Fragen

- **Warum `IntersectionObserver` statt `scroll`?** Er meldet nur Änderungen, und der Browser erledigt die Rechnerei. Das ist effizienter und ruckelt nicht.
- **Warum Web Animations API und nicht eine CSS-Klasse für die Animation?** Die Karten haben bereits Hover-Effekte im CSS (`transform` und `transition`). Eine dauerhaft gesetzte Klasse oder ein bleibender Inline-Stil würde damit kollidieren. `element.animate` spielt die Animation ab und hinterlässt nach dem Ende nichts.
- **Was macht `fill: "backwards"`?** Die Animation wendet ihr **erstes** Schlüsselbild schon während der Wartezeit an. Ohne sie wäre die Karte während der Verzögerung für einen Moment sichtbar, bevor sie verschwindet und wieder auftaucht.
- **Warum wird bei `prefers-reduced-motion` gar nichts versteckt?** Wer keine Bewegung möchte, soll auch nichts erst warten müssen. Er bekommt sofort alles zu sehen.
- **Was passiert ohne JavaScript?** Alles ist sichtbar und zeigt die Endwerte, denn das Verstecken und das Zurücksetzen der Zahlen macht allein das Skript.
- **Wozu die Regex-Prüfung auf genau eine Zahl?** „EUR 7–8bn" hat zwei Zahlen. Hochzählen von „7" allein wäre falsch. Deshalb werden solche Werte ausgelassen.
- **Was ist eine Closure?** Eine Funktion, die sich Variablen aus ihrer Umgebung merkt. Die Startfunktion in Zeile 43 kennt `el`, `prefix`, `suffix` und `target`, auch lange nachdem `prepareCounter` fertig ist.

## Mach es selbst

1. Verlängere die Zählung auf 3000 ms. Welche Zahl änderst du?
2. Ändere die Verzögerung zwischen den Karten auf 200 ms. Was fällt dir auf, wenn eine Reihe aus vier Karten besteht?
3. Schalte in den Entwicklerwerkzeugen deines Browsers „Bewegung reduzieren" ein (Rendering, „Emulate CSS media feature prefers-reduced-motion") und lade die Seite neu. Was ist anders?
4. Warum wird die „4" in der Karte „Core frictions" auf der Problem-Seite nicht hochgezählt? (Siehe Zeile 21.)
5. Schreibe in eigenen Worten, was `counters.get(entry.target)?.()` macht, wenn es zu `entry.target` keinen Eintrag gibt.
