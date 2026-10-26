# Build 2: Git, `.gitignore` und die Veröffentlichung

Dieses Kapitel erklärt die Dateien, die mit Git und GitHub zu tun haben, und warum das Repository so aufgebaut ist. Es ist die zweite Hälfte der Frage „Wie ist das Projekt organisiert?".

## Die Begriffe

| Begriff | Bedeutung |
| --- | --- |
| **Repository** („Repo") | der Projektordner samt seiner gesamten Versionsgeschichte |
| **Commit** | ein gespeicherter Zwischenstand mit Nachricht („Rebuild bundles and add package-lock") |
| **Staging** | das Vormerken von Änderungen für den nächsten Commit (`git add`) |
| **Push** | die neuen Commits zu GitHub hochladen |
| **`main`** | der Hauptzweig (Branch) des Projekts |
| **GitHub Pages** | GitHub-Dienst, der die Dateien eines Repositorys als Website ausliefert |
| **Tracked / untracked** | Git beobachtet eine Datei bereits oder noch nicht |
| **Ignorieren** | Git soll eine Datei nicht beachten und nicht hochladen |

**Der Weg einer Änderung:** Datei ändern → in GitHub Desktop unter „Changes" ansehen → Nachricht schreiben → **Commit** → **Push**. Wer lieber das Terminal nutzt: `git status`, `git add`, `git commit`, `git push`.

---

## Datei: `.gitignore` (im Hauptordner)

```
  1 | # Dependencies (created by "npm install" in the react folder)
  2 | node_modules/
  3 |
  4 | # Operating system files
  5 | .DS_Store
  6 | Thumbs.db
  7 |
  8 | # Log files
  9 | *.log
```

- **Z. 1** Zeilen, die mit `#` beginnen, sind **Kommentare**. Git ignoriert sie.
- **Z. 2** Der Ordner mit allen von `npm install` geladenen Paketen. Er ist riesig und kann jederzeit neu erzeugt werden, deshalb gehört er nicht ins Repository. Der Schrägstrich am Ende bedeutet „das ist ein **Ordner**". Das Muster gilt an jeder Stelle des Projekts, auch für `react/node_modules/`.
- **Z. 4** Kommentar für den nächsten Block.
- **Z. 5** Eine Datei, die macOS in Ordnern anlegt, um Ansichtseinstellungen zu speichern. Sie hat im Projekt nichts verloren.
- **Z. 6** Das Windows-Gegenstück: ein Zwischenspeicher für Vorschaubilder.
- **Z. 8** Kommentar für den letzten Block.
- **Z. 9** Der Stern steht für „beliebiger Name". Ignoriert werden alle Dateien, die auf `.log` enden, zum Beispiel `npm-debug.log`.

**Wichtig zum Verständnis:**
- `.gitignore` wirkt nur auf Dateien, die Git **noch nicht beobachtet**. Wurde eine Datei schon einmal committet, bleibt sie versioniert, auch wenn man sie später hineinschreibt. Man müsste sie mit `git rm --cached` aus der Beobachtung nehmen.
- Die `.gitignore` selbst wird **mit committet**, damit jeder, der das Projekt klont, dieselben Regeln hat.
- Die zusätzliche `.gitignore` in `react/` hat im Moment denselben Inhalt. Sie ist überflüssig, weil die im Hauptordner schon für alle Unterordner gilt. Sie schadet aber nicht.

## Datei: `.gitattributes`

```
  1 | # Auto detect text files and perform LF normalization
  2 | * text=auto
```

- **Z. 1** Kommentar von GitHub, der bei neuen Repositorys oft automatisch angelegt wird.
- **Z. 2** `*` steht für alle Dateien. `text=auto` heißt: Git erkennt Textdateien selbst und **vereinheitlicht die Zeilenenden**. Windows beendet Zeilen mit zwei Zeichen (CRLF), macOS und Linux mit einem (LF). Im Repository speichert Git sie einheitlich mit LF. Dadurch erscheint nicht jede Zeile als „geändert", nur weil jemand auf einem anderen System arbeitet. Auch in diesem Projekt ist das aufgefallen: Eine hochgeladene Datei hatte Windows-Zeilenenden, die anderen nicht, und beim Vergleichen musste man sie ignorieren.

## Datei: `index.html` (die Startseite)

```html
  1 | <!DOCTYPE html>
  2 | <html lang="en">
  3 |
  4 | <head>
  5 |     <meta charset="UTF-8">
  6 |     <meta name="viewport" content="width=device-width, initial-scale=1.0">
  7 |     <title>Go One | One App for Every Shared Bike</title>
  8 |     <link rel="icon" type="image/svg+xml" href="favicon.svg">
  9 |     <!-- Start page: sends visitors straight to the landing page in the html folder -->
 10 |     <meta http-equiv="refresh" content="0; url=html/landing.html">
 11 |     <style>
 12 |         body {
 13 |             margin: 0;
 14 |             padding: 2rem 6vw;
 15 |             font-family: sans-serif;
 16 |             color: #f4fff8;
 17 |             background: #071411;
 18 |         }
 19 |
 20 |         a {
 21 |             color: #7dffb3;
 22 |         }
 23 |     </style>
 24 | </head>
 25 |
 26 | <body>
 27 |     <p>Redirecting to <a href="html/landing.html">Go One</a> &hellip;</p>
 28 | </body>
 29 |
 30 | </html>
```

- **Z. 1** Sagt dem Browser, dass das ein modernes HTML5-Dokument ist.
- **Z. 2** Die Sprache der Seite ist Englisch. Das hilft Screenreadern bei der Aussprache.
- **Z. 5–6** Zeichensatz (damit Sonderzeichen wie `ö` stimmen) und die Einstellung für Handys (`viewport`).
- **Z. 7** Der Titel im Browser-Tab.
- **Z. 8** Das Favicon, das Symbol im Tab. Der Pfad `favicon.svg` ist relativ zur Datei: Beide liegen im Hauptordner.
- **Z. 10** **Die Weiterleitung.** `refresh` mit `0` Sekunden Wartezeit schickt den Browser sofort zu `html/landing.html`. Die Seite selbst muss also nichts anzeigen.
- **Z. 11–23** Kleine Gestaltung für den kurzen Moment der Weiterleitung und für den Fall, dass sie nicht greift: dunkler Hintergrund, helle Schrift. So blitzt keine weiße Fläche auf.
- **Z. 27** Ein sichtbarer Link als **Rückfall**: Falls die automatische Weiterleitung nicht klappt, kann man ihn anklicken. `&hellip;` ist das HTML-Zeichen für „…".

**Warum eine Startseite im Hauptordner?** Auf GitHub Pages ist die Adresse des Repositorys die Wurzel. Dort sucht der Server eine Datei namens `index.html`. Ohne sie gäbe es nur einen Fehler. Die eigentlichen Seiten liegen im Unterordner `html/`.

---

## Warum die gebauten Dateien im Repository liegen

In vielen Projekten gilt die Regel „erzeugte Dateien gehören **nicht** ins Repository". Hier ist es bewusst anders:

| Datei | Quelle | Im Repository? | Grund |
| --- | --- | --- | --- |
| `ts/nav.js`, `ts/motion.js` | `nav.ts`, `motion.ts` | ja | Die Seiten laden sie direkt. |
| `ts/product-demo.js`, `ts/business-calculator.js` | `react/src/...` | ja | Dasselbe. |
| `react/node_modules/` | `npm install` | **nein** (`.gitignore`) | Riesig und jederzeit neu erzeugbar. |
| `react/package-lock.json` | `npm install` | ja | Hält die Versionen fest. |

**Vorteile:** Die Seite funktioniert nach dem Herunterladen per Doppelklick. GitHub Pages braucht keinen Bauschritt, und ein Prüfer sieht sofort etwas.
**Nachteile:** Bei jedem Bauen ändern sich die zwei Bündel fast komplett. GitHub Desktop meldet dann „The diff is too large to be displayed". Außerdem kann man vergessen, nach einer Quelländerung neu zu bauen. Dann passt die `.js` nicht mehr zum Quellcode.
**Die Alternative:** Ein Dienst wie GitHub Actions baut bei jedem Push automatisch, und die erzeugten Dateien liegen nicht im Repository. Das wäre sauberer, aber für ein Projekt dieser Größe aufwendiger.

---

## GitHub Pages (Seite online stellen)

1. Auf GitHub das Repository öffnen und `Settings` wählen.
2. Links `Pages`. Bei „Source" **Deploy from a branch** wählen, Branch `main` und Ordner `/ (root)`, speichern.
3. Nach ein bis zwei Minuten steht die Adresse oben auf der Seite. Sie lautet bei diesem Repository vermutlich `https://mikhailpugachevskiy.github.io/GoOne/`. Das habe ich nicht überprüft. Trage sie erst in die README ein, wenn sie wirklich funktioniert.
4. Jeder weitere Push aktualisiert die Seite nach kurzer Zeit.

## Befehle zum Nachschlagen

| Befehl | Was er tut |
| --- | --- |
| `git status` | zeigt geänderte, neue und vorgemerkte Dateien |
| `git diff` | zeigt die Zeilen, die sich geändert haben |
| `git diff --no-index a b` | vergleicht zwei beliebige Dateien (auch außerhalb von Git) |
| `git log --oneline` | listet die Commits kurz auf |
| `git log -1` | zeigt den letzten Commit |
| `git commit --amend -m "Text"` | ändert die Nachricht des **letzten** Commits |
| `git push --force-with-lease` | lädt einen geänderten Commit hoch, bricht aber ab, wenn auf GitHub etwas Unbekanntes liegt |
| `git rm --cached datei` | nimmt eine Datei aus der Versionskontrolle, ohne sie zu löschen |

**Zur geänderten Commit-Nachricht:** Das Umschreiben eines schon hochgeladenen Commits ändert die Historie auf GitHub. Das ist bei einem Einzelprojekt unproblematisch, bei Zusammenarbeit würde es anderen Ärger machen. Deshalb gilt es nur für den **letzten** Commit.

## Typische Fragen

- **Was gehört in `.gitignore`?** Alles, was man jederzeit neu erzeugen kann (`node_modules`), und alles, was nur zu deinem Rechner gehört (Systemdateien, Logs).
- **Was passiert, wenn man `node_modules` committet?** Das Repository wird riesig, jeder Klon lädt tausende Dateien, und die Versionsgeschichte bleibt dauerhaft aufgebläht. Selbst wenn man sie später löscht, steckt sie in den alten Commits.
- **Warum `package-lock.json` committen?** Damit jeder dieselben Paketversionen bekommt.
- **Warum zeigt GitHub Desktop „diff too large"?** Die gebauten Bündel bestehen aus wenigen, extrem langen Zeilen. Der Vergleich wäre eine einzige riesige Zeile.
- **Wie bekommt man die Seite online?** Mit GitHub Pages, Branch `main`, Ordner `/ (root)`. Die `index.html` im Hauptordner leitet auf die Landing Page weiter.
- **Was ist der Unterschied zwischen Commit und Push?** Ein Commit speichert den Stand **lokal**. Erst der Push lädt ihn zu GitHub hoch.
- **Was ist `.gitattributes` für?** Es sorgt dafür, dass Zeilenenden einheitlich gespeichert werden, damit Diffs nicht wegen Windows und macOS aus dem Ruder laufen.

## Mach es selbst

1. Lege im Hauptordner testweise eine Datei `test.log` an. Taucht sie in GitHub Desktop unter „Changes" auf? Warum nicht? Lösche sie danach wieder.
2. Entferne testweise die Zeile `*.log` aus `.gitignore`, lege `test.log` neu an und prüfe, was jetzt passiert. Stelle die Zeile danach wieder her.
3. Führe `git log --oneline` aus und lies deine Commit-Nachrichten. Welche würdest du heute anders schreiben?
4. Öffne `index.html` ohne Internet. Was passiert, wenn du in Zeile 10 die Zahl `0` auf `5` änderst? Was sieht man in der Zwischenzeit?
5. Erkläre in eigenen Worten, warum die Bündel im Repository liegen und was du dazu im Gespräch als Nachteil nennen würdest.
