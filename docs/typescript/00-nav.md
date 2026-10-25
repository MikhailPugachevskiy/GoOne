# TypeScript 1: Das Menü `nav.ts`

`nav.ts` lässt das Burger-Menü auf dem Handy funktionieren. Die Datei hat 49 Zeilen und zeigt die wichtigsten Grundlagen, wie JavaScript und TypeScript im Browser mit der Seite arbeiten: Elemente finden, auf Ereignisse reagieren und Elemente verändern.

## Grundlagen vorab

**Die Seite als Baum (DOM).** Der Browser macht aus dem HTML einen Baum aus Elementen, das *Document Object Model* (DOM). JavaScript greift über das Objekt `document` darauf zu. Jedes Element ist ein Objekt, das man lesen und verändern kann.

| Werkzeug | Was es macht |
| --- | --- |
| `document.querySelector(".klasse")` | findet das **erste** Element, das zum CSS-Selektor passt (oder `null`) |
| `document.getElementById("id")` | findet das Element mit dieser `id` (oder `null`) |
| `element.classList.toggle("name", an)` | setzt oder entfernt eine CSS-Klasse |
| `element.setAttribute("name", "wert")` | setzt ein HTML-Attribut |
| `element.addEventListener("click", funktion)` | ruft die Funktion auf, wenn das Ereignis eintritt |

**Ereignisse.** Der Browser meldet, was der Nutzer tut (Klick, Taste, Fenster ändert Größe). Man hängt mit `addEventListener` eine Funktion an, die dann aufgerufen wird. Die Funktion bekommt ein **Ereignisobjekt** (`event`) mit Details, zum Beispiel welche Taste gedrückt wurde.

**Was TypeScript hinzufügt.** Typen sagen, was für ein Element man bekommt. `querySelector` kann `null` zurückgeben, wenn nichts gefunden wird. TypeScript zwingt dich, das zu prüfen, bevor du das Element benutzt.

**Wie das Menü zusammenarbeitet:** Das HTML hat einen Button `.nav-toggle` und die Navigation mit der ID `site-nav`. Das CSS blendet auf dem Handy (bis 800 px Breite) die Navigation aus, solange sie nicht die Klasse `is-open` hat. `nav.ts` setzt und entfernt diese Klasse.

---


## Elemente finden

```ts
  1 | /* Shared navigation behaviour for every chapter page: opens and closes the mobile menu */
  2 | function initNav(): void {
  3 |     const toggle = document.querySelector<HTMLButtonElement>(".nav-toggle");
  4 |     const nav = document.getElementById("site-nav");
  5 |
  6 |     /* Stop quietly if a page has no menu markup */
  7 |     if (!toggle || !nav) {
  8 |         return;
  9 |     }
```

- **Z. 1** Kommentar: Die Datei gilt für alle Seiten und öffnet und schließt das Handy-Menü.
- **Z. 2** Eine Funktion namens `initNav`. `: void` bedeutet, dass sie nichts zurückgibt. Der ganze Code steckt in dieser Funktion, damit die Variablen darin nicht von anderen Skripten gesehen werden.
- **Z. 3** Sucht den Menü-Button. Die spitzen Klammern `<HTMLButtonElement>` sagen TypeScript, was für ein Element man erwartet (ein Button). Ohne sie bekäme man nur den allgemeinen Typ `Element`. Das Ergebnis ist ein Button **oder `null`**.
- **Z. 4** Sucht die Navigation über ihre `id`. Auch hier kann `null` herauskommen.
- **Z. 6** Kommentar zur Schutzprüfung.
- **Z. 7–9** Wenn eines von beiden fehlt, bricht die Funktion mit `return` ab, ohne Fehlermeldung. `!toggle` heißt „`toggle` ist leer (`null`)". Nach dieser Prüfung weiß TypeScript, dass beide Elemente **sicher vorhanden** sind, und lässt dich sie ohne weitere Prüfung benutzen. Das bleibt auch in den Funktionen weiter unten so, weil beide Variablen `const` sind.

## Menü öffnen und schließen

```ts
 11 |     /* One place that keeps the CSS class and the aria-expanded attribute in sync */
 12 |     const setOpen = (open: boolean): void => {
 13 |         nav.classList.toggle("is-open", open);
 14 |         toggle.setAttribute("aria-expanded", String(open));
 15 |     };
 16 |
 17 |     const isOpen = (): boolean => nav.classList.contains("is-open");
 18 |
 19 |     /* Menu button opens and closes the list */
 20 |     toggle.addEventListener("click", () => {
 21 |         setOpen(!isOpen());
 22 |     });
```

- **Z. 11** Kommentar: Eine einzige Funktion soll die Klasse und das Attribut gemeinsam ändern, damit sie nie auseinanderlaufen.
- **Z. 12** Eine Pfeilfunktion, die den Zustand setzt: `open` ist `true` zum Öffnen und `false` zum Schließen.
- **Z. 13** `classList.toggle` mit zwei Argumenten: Ist das zweite wahr, wird die Klasse **gesetzt**, sonst **entfernt**. Das CSS zeigt das Menü, wenn `is-open` dran ist.
- **Z. 14** Setzt das Attribut `aria-expanded` am Button. Screenreader sagen damit „ausgeklappt" oder „eingeklappt". Attributwerte sind immer **Texte**, deshalb macht `String(open)` aus `true` den Text `"true"`.
- **Z. 17** Fragt, ob das Menü gerade offen ist (ob die Klasse dran ist). Die Kurzform ohne `{ }` und `return` gibt den Wert direkt zurück.
- **Z. 19** Kommentar zum nächsten Block.
- **Z. 20–22** Bei einem Klick auf den Button wird die Funktion ausgeführt: `setOpen(!isOpen())`. Das `!` kehrt den Wert um: Ist das Menü offen, wird es geschlossen, und umgekehrt.

## Link-Klick schließt das Menü

```ts
 24 |     /* Tapping a link closes the menu, useful for links that stay on the same page */
 25 |     nav.addEventListener("click", (event: MouseEvent) => {
 26 |         const target = event.target as HTMLElement;
 27 |         if (target.closest("a")) {
 28 |             setOpen(false);
 29 |         }
 30 |     });
```

- **Z. 24** Kommentar: Wer einen Link antippt, soll das Menü nicht offen vor sich behalten. Das gilt besonders für Links, die auf derselben Seite bleiben.
- **Z. 25** Ein einziger Klick-Beobachter am **gesamten Menü**, nicht an jedem Link. Das funktioniert, weil Ereignisse im DOM „nach oben blubbern": Ein Klick auf einen Link wird auch dem Elternelement gemeldet. Man nennt das *Event-Delegation*. `event: MouseEvent` ist der Typ des Ereignisobjekts.
- **Z. 26** `event.target` ist das Element, auf das wirklich geklickt wurde. TypeScript kennt nur den allgemeinen Typ `EventTarget`. Mit `as HTMLElement` **behauptest** du, dass es ein HTML-Element ist. Das ist eine Typ-Zusicherung (*type assertion*). Sie ändert nichts am Programm, sie beruhigt nur den Compiler. Man benutzt sie nur, wenn man es besser weiß.
- **Z. 27** `closest("a")` sucht das nächste umgebende Element (oder das Element selbst), das ein `<a>` ist. Wenn man auf einen Link klickt, ist das Ergebnis der Link. Klickt man in einen Zwischenraum des Menüs, ist es `null`, und nichts passiert.
- **Z. 28** Das Menü wird geschlossen.

## Escape schließt das Menü

```ts
 32 |     /* Escape closes the menu and returns focus to the button */
 33 |     document.addEventListener("keydown", (event: KeyboardEvent) => {
 34 |         if (event.key === "Escape" && isOpen()) {
 35 |             setOpen(false);
 36 |             toggle.focus();
 37 |         }
 38 |     });
```

- **Z. 32** Kommentar: Mit der Escape-Taste soll man das Menü verlassen können und der Fokus soll dorthin zurückkehren, wo er herkam.
- **Z. 33** Beobachtet Tastendrücke auf der **ganzen Seite**. `KeyboardEvent` ist der Typ des Ereignisobjekts mit Infos zur Taste.
- **Z. 34** Nur wenn die gedrückte Taste Escape ist **und** das Menü offen ist. Sonst täte die Escape-Taste überall etwas.
- **Z. 35** Schließt das Menü.
- **Z. 36** Setzt den Tastaturfokus zurück auf den Menü-Button. Wer nur mit der Tastatur arbeitet, würde sonst irgendwo „verloren" sein. Das ist ein wichtiger Teil der Barrierefreiheit.

## Größeres Fenster setzt das Menü zurück

```ts
 40 |     /* Growing the window past the mobile breakpoint resets the menu state */
 41 |     const desktopQuery = window.matchMedia("(min-width: 801px)");
 42 |     desktopQuery.addEventListener("change", (event: MediaQueryListEvent) => {
 43 |         if (event.matches) {
 44 |             setOpen(false);
 45 |         }
 46 |     });
 47 | }
 48 |
 49 | initNav();
```

- **Z. 40** Kommentar: Wird das Fenster breit, soll der Menüzustand zurückgesetzt werden.
- **Z. 41** `matchMedia` nimmt dieselbe Bedingung wie eine CSS-Media-Query und gibt ein Objekt zurück, das ihren Zustand kennt. 801 ist absichtlich eins mehr als der CSS-Wert 800 (`max-width: 800px` bedeutet Handy). So gilt immer genau eine von beiden Regeln.
- **Z. 42** Das Ereignis `change` kommt, **wenn sich der Zustand der Bedingung ändert**, also beim Überschreiten der 800-Pixel-Grenze in eine der beiden Richtungen.
- **Z. 43–45** `event.matches` ist `true`, wenn das Fenster jetzt breit ist. Dann wird das Menü geschlossen, damit es nicht offen bleibt, wenn man später wieder schmal wird.
- **Z. 47** Schließt `initNav`.
- **Z. 49** **Ruft die Funktion auf.** Ohne diese Zeile würde nichts passieren, denn bis hierhin wurde die Funktion nur definiert.

## Wie die Datei in die Seite kommt

- Der Browser lädt nicht `nav.ts`, sondern `nav.js`. Der TypeScript-Compiler (`tsc`) macht daraus JavaScript, indem er alle Typen entfernt. Die `.js`-Datei liegt im Repository.
- Jede Seite lädt am Ende des `<body>` nacheinander `nav.js`, `motion.js` und das eigene Skript, zum Beispiel `landing.js`. Am Ende des `<body>`, damit alle Elemente schon existieren, wenn `initNav` sie sucht.
- `nav.ts` ist kein „Modul" (kein `import` und kein `export`), sondern ein normales Skript. Module lassen sich in vielen Browsern nicht direkt von der Festplatte (`file://`) öffnen. Die Seite soll aber per Doppelklick funktionieren.

## Typische Fragen

- **Warum alles in eine Funktion?** Variablen in einer Funktion sind von außen nicht sichtbar. Sonst würden `toggle` und `nav` bei allen Skripten der Seite „global" sein und könnten mit gleichnamigen Variablen in Konflikt geraten. (`initNav` selbst ist global, das ist der einzige Name.)
- **Was bedeutet `as HTMLElement`?** Eine Zusicherung an den Compiler. Sie prüft nichts zur Laufzeit. Wenn man sich irrt, gibt es später einen Fehler.
- **Warum Event-Delegation statt eines Beobachters pro Link?** Ein Beobachter statt sieben, und er funktioniert auch für Links, die später hinzukämen.
- **Wozu `aria-expanded`?** Screenreader erfahren damit, ob das Menü offen ist. Das Aussehen ändert sich dadurch nicht.
- **Warum wird bei Escape der Fokus gesetzt?** Wer nur die Tastatur benutzt, soll nach dem Schließen dort weitermachen, wo er war.

## Mach es selbst

1. Mach das Menü schon bei 1000 px zum Burger-Menü. Welche Dateien musst du ändern? (Der Wert 800 steht in `nav.ts` und in der Media Query **jeder der sieben CSS-Dateien**. Warum müssen beide Stellen übereinstimmen?)
2. Lass das Menü beim Klick **neben** das Menü ebenfalls zuklappen. Welches Ereignis und welches Element würdest du beobachten?
3. Schreibe `isOpen` so um, dass es `nav.getAttribute("aria-expanded")` benutzt. Was wäre der Nachteil?
4. Teste im Browser die Tastatur: Tab zum Menü-Button, Enter, Escape. Wo steht der Fokus nach jedem Schritt?
