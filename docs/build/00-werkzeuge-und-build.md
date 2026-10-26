# Build 1: Werkzeuge und `npm run build`

Dieses Kapitel erklärt, **wie aus dem Quellcode die Dateien werden, die der Browser lädt**, und welche Konfigurationsdateien dabei mitspielen. Es ist der Teil des Projekts, nach dem in Bewerbungsgesprächen oft zuerst gefragt wird: „Wie startest du das Projekt?" und „Was passiert bei `npm run build`?"

## Das Gesamtbild

```
react/src/*.tsx   ──►  npm run build  ──►  ts/product-demo.js
(App-Demo, TypeScript + JSX)   (esbuild)       (eine einzige JavaScript-Datei)

react/src/calculator/*, calculatorMain.tsx  ──►  ts/business-calculator.js

ts/nav.ts, ts/motion.ts  ──►  tsc (TypeScript-Compiler)  ──►  ts/nav.js, ts/motion.js
```

- **Der Browser kann weder TypeScript noch JSX lesen.** Er versteht nur JavaScript. Deshalb braucht man einen Schritt, der den Quellcode umwandelt.
- **Zwei verschiedene Werkzeuge** machen das, jedes für einen Teil des Projekts:
  - `esbuild` baut die React-Teile (viele Dateien, mit JSX) zu **einer** Datei zusammen: ein *Bundler*.
  - `tsc` (der TypeScript-Compiler) wandelt die kleinen Dateien `nav.ts` und `motion.ts` einzeln in `.js` um.
- **Die fertigen `.js`-Dateien liegen im Repository.** Darum läuft die Seite per Doppelklick, ohne dass jemand etwas bauen muss.

## Die Begriffe

| Begriff | Bedeutung |
| --- | --- |
| **Node.js** | führt JavaScript außerhalb des Browsers aus, zum Beispiel auf deinem Rechner. Die Build-Werkzeuge laufen darauf. |
| **npm** | die Paketverwaltung von Node.js: installiert Bibliotheken und startet Skripte. |
| **Paket** | eine fertige Bibliothek, zum Beispiel `react` oder `esbuild`. |
| **`node_modules/`** | der Ordner, in den `npm install` alle Pakete lädt. Er wird nicht ins Repository aufgenommen. |
| **Bundler** | fasst viele Quelldateien und ihre Bibliotheken zu einer Datei zusammen. |
| **Minifizieren** | Leerzeichen, Zeilenumbrüche und lange Namen entfernen, damit die Datei kleiner wird. |
| **Typprüfung** | prüft die Typen im Code, ohne etwas zu bauen (`npm run typecheck`). |

---

## Datei: `react/package.json` (Steckbrief des React-Teils)

```json
  1 | {
  2 |     "name": "go-one-demo",
  3 |     "private": true,
  4 |     "version": "1.0.0",
  5 |     "description": "Interactive React demo for product.html",
  6 |     "scripts": {
  7 |         "build": "node build.mjs",
  8 |         "typecheck": "tsc --noEmit"
  9 |     },
 10 |     "dependencies": {
 11 |         "react": "^19.0.0",
 12 |         "react-dom": "^19.0.0"
 13 |     },
 14 |     "devDependencies": {
 15 |         "@types/react": "^19.0.0",
 16 |         "@types/react-dom": "^19.0.0",
 17 |         "esbuild": "^0.25.0",
 18 |         "typescript": "^5.6.0"
 19 |     }
 20 | }
```

- **Z. 1** Die Datei ist im Format **JSON**: Texte stehen in Anführungszeichen, Einträge werden mit Kommas getrennt, **Kommentare gibt es nicht**. Deshalb erklärt dieses Kapitel die Zeilen.
- **Z. 2** Der Name des Pakets. Er hat hier keine große Bedeutung, weil es nicht veröffentlicht wird.
- **Z. 3** Schützt davor, das Paket aus Versehen bei npm zu veröffentlichen.
- **Z. 4** Die Versionsnummer des eigenen Projekts.
- **Z. 5** Eine kurze Beschreibung.
- **Z. 6–9** Eigene **Kurzbefehle**. Was hier links steht, tippt man hinter `npm run`.
- **Z. 7** `npm run build` startet `node build.mjs`: Node führt die Datei `build.mjs` aus (nächster Abschnitt).
- **Z. 8** `npm run typecheck` startet den TypeScript-Compiler. `--noEmit` heißt „nur prüfen, keine Dateien schreiben". Den Befehl `tsc` findet npm im Ordner `node_modules`, du musst ihn nicht selbst installieren.
- **Z. 10–13** **Pakete, die der Code braucht:** React und React-DOM. Die Versionsangabe `^19.0.0` heißt: „Version 19.0.0 oder eine neuere **19er**-Version", aber nie 20. Das Zeichen `^` (Caret) erlaubt kleine Aktualisierungen und verhindert große, die etwas kaputt machen könnten.
- **Z. 14–19** **Werkzeuge nur für die Entwicklung:** die Typdefinitionen für React (`@types/react`, `@types/react-dom`), der Bundler `esbuild` und `typescript`. Sie landen nicht in der fertigen Seite. (Hier wird ohnehin alles in die Bündel gepackt. Die Aufteilung ist eine Konvention, die zeigt, was zur Laufzeit gebraucht wird und was nur zum Bauen.)
- **Z. 11** Die Bibliothek, mit der die Komponenten geschrieben sind.
- **Z. 12** Die Verbindung von React zum Browser (`createRoot`).
- **Z. 15–16** Typdefinitionen: Sie sagen TypeScript, welche Funktionen und Typen React hat. Ohne sie könnte `npm run typecheck` React nicht prüfen.
- **Z. 17** Der Bundler. Bei Versionen unter 1.0 erlaubt `^` nur kleine Sprünge innerhalb von 0.25.x.
- **Z. 18** Der TypeScript-Compiler.

## Datei: `react/package-lock.json` (die genauen Versionen)

```json
  1 | {
  2 |     "name": "go-one-demo",
  3 |     "version": "1.0.0",
  4 |     "lockfileVersion": 3,
  5 |     "requires": true,
  6 |     "packages": {
  7 |         "": {
  8 |             "name": "go-one-demo",
  9 |             "version": "1.0.0",
 10 |             "dependencies": {
 11 |                 "react": "^19.0.0",
 12 |                 "react-dom": "^19.0.0"
 13 |             },
 14 |             "devDependencies": {
 15 |                 "@types/react": "^19.0.0",
 16 |                 "@types/react-dom": "^19.0.0",
 17 |                 "esbuild": "^0.25.0",
 18 |                 "typescript": "^5.6.0"
 19 |             }
 20 |         },
 21 |         "node_modules/@esbuild/aix-ppc64": {
 22 |             "version": "0.25.12",
 23 |             "resolved": "https://registry.npmjs.org/@esbuild/aix-ppc64/-/aix-ppc64-0.25.12.tgz",
 24 |             "integrity": "sha512-Hhmwd6CInZ3dwpuGTF8fJG6yoWmsToE+vYgD4nytZVxcu1ulHpUQRAB1UJ8+N1Am3Mz4+xOByoQoSZf4D+CpkA==",
 25 |             "cpu": [
 26 |                 "ppc64"
 27 |             ],
 28 |             "dev": true,
 29 |             "license": "MIT",
 30 |             "optional": true,
 31 |             "os": [
 32 |                 "aix"
 33 |             ],
 34 |             "engines": {
 35 |                 "node": ">=18"
 36 |             }
 37 |         },
```

- **Z. 2–4** Die Lock-Datei gehört zu diesem Paket. `lockfileVersion: 3` ist ihr Format.
- **Z. 6** Eine Liste **aller** installierten Pakete mit **genauer** Version, nicht nur der eigenen Wünsche. Die Datei hat hier rund 570 Zeilen, bei größeren Projekten sind es oft Tausende. Du musst sie nie von Hand ändern.
- **Z. 7–20** Der erste Eintrag, `""`, ist das eigene Projekt mit seinen Wünschen (dasselbe wie in `package.json`).
- **Z. 21** Ein Paket. Esbuild besteht aus einem Hauptpaket und **je einem kleinen Paket pro Betriebssystem und Prozessor**. Dieses hier ist für das Betriebssystem AIX.
- **Z. 22** Die **genaue** Version. Während `package.json` „irgendeine 0.25.x" erlaubt, steht hier, was wirklich installiert wurde.
- **Z. 23** Von welcher Adresse es geladen wurde.
- **Z. 24** Eine **Prüfsumme** (`sha512`). npm vergleicht sie nach dem Download. Damit ist sicher, dass die Datei nicht verändert wurde.
- **Z. 25–27** Nur für einen bestimmten Prozessor (hier `ppc64`).
- **Z. 28** Dieses Paket wird nur zum Entwickeln gebraucht, nicht von der fertigen Seite.
- **Z. 30** Das Paket ist optional: Wenn es nicht zu deinem System passt, überspringt npm es. Auf Windows lädt npm so das passende Paket `win32-x64` und ignoriert die anderen.
- **Z. 31–33** Nur für das Betriebssystem `aix`.
- **Z. 34–36** Das Paket braucht Node.js ab Version 18. Deshalb steht in der README „Node.js 18 oder neuer".

**Warum liegt die Lock-Datei im Repository?** Sie sorgt dafür, dass jeder, der `npm install` ausführt, **dieselben** Versionen bekommt wie du. Ohne sie könnte morgen eine neuere Version ins Projekt kommen und das Ergebnis ändern. Wer sich streng an die Lock-Datei halten will, nutzt `npm ci` statt `npm install`.

---

## Datei: `react/build.mjs` (der eigentliche Bau)

Die Endung `.mjs` bedeutet: Das ist ein JavaScript-**Modul**. Nur in Modulen darf man `import` schreiben und Zeilen wie `await` auf oberster Ebene.

```js
  1 | /* Bundles both React parts into plain scripts, so the pages also work when opened from disk */
  2 | import { build } from "esbuild";
  3 |
  4 | const shared = {
  5 |     bundle: true,
  6 |     minify: true,
  7 |     format: "iife",
  8 |     target: "es2020",
  9 |     jsx: "automatic",
 10 |     define: { "process.env.NODE_ENV": '"production"' },
 11 |     legalComments: "none"
 12 | };
 13 |
 14 | /* Interactive app demo on product.html */
 15 | await build({ ...shared, entryPoints: ["src/main.tsx"], outfile: "../ts/product-demo.js" });
 16 |
 17 | /* Break-even calculator on business.html */
 18 | await build({ ...shared, entryPoints: ["src/calculatorMain.tsx"], outfile: "../ts/business-calculator.js" });
 19 |
 20 | console.log("Built ../ts/product-demo.js and ../ts/business-calculator.js");
```

- **Z. 1** Kommentar: Die Datei baut beide React-Teile zu einfachen Skripten, damit die Seiten auch per Doppelklick laufen.
- **Z. 2** Holt die Funktion `build` aus dem Paket `esbuild`. Sie ist in `node_modules/` gelandet, als du `npm install` ausgeführt hast.
- **Z. 4–12** Die Einstellungen, die **beide** Bauvorgänge gemeinsam haben. Sie stehen einmal oben, damit man sie nicht doppelt schreibt.
- **Z. 5** Alle Dateien, die der Code mit `import` einbindet (auch React selbst), werden in **eine** Datei zusammengeführt.
- **Z. 6** Die Datei wird verkleinert: Leerraum und lange Namen verschwinden. Das ist der Grund, warum `ts/product-demo.js` nur aus wenigen, sehr langen Zeilen besteht.
- **Z. 7** `iife` steht für *Immediately Invoked Function Expression*: Der ganze Code wird in eine Funktion verpackt, die sofort ausgeführt wird. Das hat zwei Vorteile: Seine Variablen kommen sich nicht mit denen anderer Skripte in die Quere, und es läuft in einem normalen `<script>`-Tag **ohne** Modul-Unterstützung.
- **Z. 8** Es wird JavaScript in der Version ES2020 erzeugt, die alle gängigen Browser verstehen.
- **Z. 9** Die JSX-Schreibweise (`<Demo />`) wird in normale Funktionsaufrufe umgewandelt, und der dazu nötige Import von React wird **automatisch** ergänzt. Deshalb steht in den Dateien kein `import React ...`.
- **Z. 10** React enthält Stellen mit `process.env.NODE_ENV`, um im Entwicklungsmodus Warnungen anzuzeigen. Im Browser gibt es `process` nicht. `define` ersetzt diesen Text beim Bauen durch den festen Wert `"production"`. Die doppelte Anführung (`'"production"'`) ist Absicht: Der Wert ist Code und muss deshalb selbst in Anführungszeichen stehen. Der Produktionsmodus macht React kleiner und schneller.
- **Z. 11** Lizenzhinweise aus den Paketen werden nicht in die Datei kopiert. (Wer sie behalten möchte, würde hier etwas anderes wählen.)
- **Z. 15** Der erste Bau. `...shared` kopiert alle gemeinsamen Einstellungen hinein (der **Spread**). `entryPoints` ist die Startdatei: von `src/main.tsx` aus folgt esbuild allen Importen. `outfile` ist die Ergebnisdatei, relativ zum Ordner `react/`: `../ts/product-demo.js` liegt also im Ordner `ts/` neben `react/`. `await` wartet, bis der Bau fertig ist, bevor es weitergeht.
- **Z. 18** Der zweite Bau mit dem Einstieg des Rechners und eigener Ergebnisdatei.
- **Z. 20** Gibt die Erfolgsmeldung im Terminal aus. Wenn etwas schiefgeht, bricht `build` mit einer Fehlermeldung ab, bevor diese Zeile erreicht wird.

**Wie esbuild die Startdatei zu einer Datei macht:** `main.tsx` importiert `Demo.tsx`, das wiederum `data.ts`, `Stepper.tsx` und weitere importiert. esbuild folgt allen diesen Verbindungen, nimmt auch React aus `node_modules/` dazu, wandelt JSX und Typen in JavaScript um und schreibt alles in die eine Ergebnisdatei.

---

## Die zwei `tsconfig.json`

Es gibt **zwei** Konfigurationsdateien für den TypeScript-Compiler, weil es zwei verschiedene Aufgaben gibt.

### `react/tsconfig.json`: nur prüfen

```json
  1 | {
  2 |     "compilerOptions": {
  3 |         "target": "ES2020",
  4 |         "lib": [
  5 |             "ES2020",
  6 |             "DOM",
  7 |             "DOM.Iterable"
  8 |         ],
  9 |         "module": "ESNext",
 10 |         "moduleResolution": "bundler",
 11 |         "jsx": "react-jsx",
 12 |         "strict": true,
 13 |         "noEmit": true,
 14 |         "skipLibCheck": true
 15 |     },
 16 |     "include": [
 17 |         "src"
 18 |     ]
 19 | }
```

- **Z. 3** Welche JavaScript-Version der Code annehmen darf.
- **Z. 4–8** Welche eingebauten Typen bekannt sind: die Sprache selbst (`ES2020`) und die Browser-Welt (`DOM`, `DOM.Iterable`). Ohne `DOM` kennt TypeScript `document` und `window` nicht.
- **Z. 9** Der Code benutzt moderne `import`-Schreibweise.
- **Z. 10** So sucht TypeScript Importe, wie es ein Bundler tut (zum Beispiel ohne Dateiendung).
- **Z. 11** Erlaubt JSX und sagt TypeScript, dass React automatisch importiert wird. Das passt zu `jsx: "automatic"` bei esbuild.
- **Z. 12** Alle strengen Prüfungen sind an. Zum Beispiel muss man `null` behandeln. Das ist eine der wichtigsten Einstellungen für sauberen Code.
- **Z. 13** Es werden **keine Dateien geschrieben**. Gebaut wird von esbuild. Der Compiler ist hier nur ein Prüfer.
- **Z. 14** Die Prüfung der Typdateien in `node_modules` wird übersprungen. Das spart Zeit und vermeidet Fehler in fremden Dateien.
- **Z. 16–18** Geprüft wird nur der Ordner `src`.

### `tsconfig.json` im Hauptordner: umwandeln

```json
  1 | {
  2 |     "compilerOptions": {
  3 |         "target": "ES2020",
  4 |         "lib": [
  5 |             "ES2020",
  6 |             "DOM"
  7 |         ],
  8 |         "strict": true,
  9 |         "rootDir": "ts",
 10 |         "outDir": "ts"
 11 |     },
 12 |     "include": [
 13 |         "ts/*.ts"
 14 |     ],
 15 |     "exclude": [
 16 |         "node_modules"
 17 |     ]
 18 | }
```

- **Z. 3–7** Wie oben: JavaScript-Version und eingebaute Typen (Sprache und DOM).
- **Z. 8** Wieder streng.
- **Z. 9** Die Quelldateien liegen im Ordner `ts`.
- **Z. 10** Die erzeugten `.js`-Dateien kommen **in denselben Ordner**, neben die `.ts`-Dateien. Dort erwarten die Seiten sie (`../ts/nav.js`).
- **Z. 12–14** Welche Dateien übersetzt werden: alle `.ts` direkt im Ordner `ts/`.
- **Z. 15–17** Ausgeschlossen wird nur `node_modules`. **Dieser Eintrag ist wichtig.** Ohne ihn schließt TypeScript automatisch den Ausgabeordner aus, und weil der hier derselbe ist wie der Quellordner, würde `tsc` mit „No inputs were found" abbrechen. Das war ein Fehler in einer früheren Fassung des Projekts.

**Warum zwei Dateien?** Die erste prüft den React-Teil und baut nichts. Die zweite übersetzt die kleinen Skripte und schreibt Dateien. Würde man beides in eine Datei packen, müsste man sich bei jeder Einstellung fragen, ob sie für beides taugt.

---

## Der Ablauf Schritt für Schritt

| Schritt | Befehl | Wo ausführen | Ergebnis |
| --- | --- | --- | --- |
| 1 | `node -v` | irgendwo | zeigt die Version von Node (ab 18 passt es) |
| 2 | `cd react` | im Projektordner | du bist jetzt im Ordner `react/` |
| 3 | `npm install` | in `react/` | lädt Pakete in `node_modules/` und legt `package-lock.json` an |
| 4 | `npm run build` | in `react/` | schreibt `ts/product-demo.js` und `ts/business-calculator.js` |
| 5 | `npm run typecheck` | in `react/` | prüft die Typen (zeigt bei Erfolg nichts an) |
| 6 | `npx -p typescript tsc` | im **Hauptordner** | übersetzt `ts/*.ts` zu `ts/*.js` (nur nötig, wenn du `nav.ts` oder `motion.ts` änderst) |

**Wichtig bei Schritt 6:** `npx tsc` allein würde ein falsches Paket namens „tsc" laden. Mit `-p typescript` sagt man npx, dass es das Paket `typescript` nehmen soll und darin den Befehl `tsc`.

## Typische Fragen

- **Wie startest du das Projekt?** Die Seite öffnet man direkt über `index.html`, ohne Server. Nur wenn ich am React-Teil etwas ändere, führe ich in `react/` `npm install` (einmal) und `npm run build` aus und committe das Ergebnis.
- **Warum liegen die gebauten Dateien im Repository?** Damit die Seite ohne Bauen läuft, auch auf GitHub Pages ohne Build-Schritt. Der Nachteil: Bei jeder Änderung ändern sich diese Dateien fast komplett, und GitHub Desktop zeigt „diff too large".
- **Was macht esbuild genau?** Es folgt allen Importen der Startdatei, wandelt TypeScript und JSX in JavaScript um, fasst alles mit den Bibliotheken zu einer Datei zusammen und verkleinert sie.
- **Was ist der Unterschied zwischen esbuild und `tsc`?** `tsc` kann Typen prüfen und TypeScript in JavaScript umwandeln, bündelt aber nicht. esbuild bündelt sehr schnell, prüft aber **keine** Typen. Deshalb gibt es `npm run typecheck`.
- **Was ist der Unterschied zwischen `dependencies` und `devDependencies`?** Erstere braucht der Code zur Laufzeit, letztere nur zum Entwickeln und Bauen.
- **Was bedeutet `^19.0.0`?** Jede Version ab 19.0.0 bis unter 20.0.0.
- **Wozu die Lock-Datei?** Sie hält die genauen Versionen fest, damit jeder denselben Stand bekommt.
- **Was ist der Unterschied zwischen `npm install` und `npm ci`?** `install` darf Versionen innerhalb der erlaubten Bereiche aktualisieren und die Lock-Datei ändern. `ci` installiert genau das, was in der Lock-Datei steht, und bricht ab, wenn sie nicht zur `package.json` passt. `ci` benutzt man für saubere, wiederholbare Builds.

## Mach es selbst

1. Führe `npm run build` aus und öffne danach `ts/product-demo.js` im Editor. Wie viele Zeilen hat die Datei, und warum?
2. Setze in `build.mjs` `minify: false`, baue neu und vergleiche die Dateigröße. Setze danach den Wert zurück.
3. Ändere in `Demo.tsx` den Text „Sample data, not live bikes" in `data.ts` oder einer Komponente und baue neu. Wie lange dauert der Bau?
4. Mache absichtlich einen Fehler in `Stepper.tsx` (zum Beispiel eine Klammer weniger) und führe `npm run build` aus. Wie sieht die Fehlermeldung aus, und woran erkennst du die Stelle?
5. Führe `npm run typecheck` aus. Notiere, ob Meldungen erscheinen. (Hinweis: Bei Erfolg gibt `tsc` nichts aus.)
