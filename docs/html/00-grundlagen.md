# HTML 0: Grundlagen

HTML beschreibt, **was** auf einer Seite steht: Überschriften, Absätze, Links, Listen, Buttons. Das CSS bestimmt dann, wie es aussieht, und JavaScript, was beim Klicken passiert. Dieses Kapitel erklärt die Bausteine, die in allen sieben Seiten vorkommen. Danach folgt Kapitel 1 mit `landing.html` Zeile für Zeile und Kapitel 2 mit den Unterschieden der anderen Seiten.

## Aufbau eines Elements

```html
<a class="btn btn-primary" href="market.html">Explore the pitch</a>
```

- **Start-Tag** `<a ...>` und **End-Tag** `</a>` umschließen den **Inhalt** („Explore the pitch"). Zusammen sind sie ein **Element**.
- **Attribute** stehen im Start-Tag als `name="wert"`. Hier `class` und `href`.
- Elemente können ineinander stehen (verschachtelt). Man schließt sie in umgekehrter Reihenfolge.
- Manche Elemente haben keinen Inhalt und kein End-Tag, zum Beispiel `<meta ...>` und `<link ...>`.
- Kommentare stehen in `<!-- ... -->`. Der Browser zeigt sie nicht an, aber sie stehen im Quelltext, den jeder Besucher sehen kann.

## Der Aufbau einer ganzen Seite

```html
<!DOCTYPE html>        <!-- "das ist modernes HTML" -->
<html lang="en">       <!-- Wurzel, mit Sprache -->
<head> ... </head>     <!-- Infos ÜBER die Seite: Titel, Zeichensatz, Stylesheets (unsichtbar) -->
<body> ... </body>     <!-- der sichtbare Inhalt und die Skripte am Ende -->
</html>
```

## Elemente mit Bedeutung („semantisches HTML")

Man könnte alles mit `<div>` bauen. Besser ist es, Elemente zu wählen, die **sagen, was sie sind**. Das hilft Suchmaschinen, Screenreadern und dir selbst beim Lesen.

| Element | Bedeutung | In diesem Projekt |
| --- | --- | --- |
| `<header>` | Kopfbereich | Logo und Menü |
| `<nav>` | Gruppe von Navigationslinks | Hauptmenü und Fußzeilenlinks |
| `<main>` | der Hauptinhalt der Seite (nur **einmal** pro Seite) | alles zwischen Header und Footer |
| `<section>` | thematischer Abschnitt | Hero, Zahlenleiste, Teaser, Team |
| `<article>` | in sich geschlossener Inhalt | jede Karte |
| `<footer>` | Fußbereich | Markenzeile und Links |
| `<h1>` bis `<h3>` | Überschriften, Ebene 1 bis 3 | siehe unten |
| `<p>` | Absatz | alle Texte |
| `<ul>`, `<li>` | Liste und Listenpunkt | Menüpunkte |
| `<a>` | Link | Menü, Buttons, Textlinks |
| `<button>` | Knopf, der **etwas auslöst** | Menü-Button |
| `<div>`, `<span>` | neutrale Behälter ohne Bedeutung | Gruppen für das Layout |

**Link oder Button?** Ein Link (`<a>`) bringt dich **woanders hin**. Ein Button (`<button>`) **löst eine Aktion aus** (Menü auf, Menü zu). Die Buttons im Hero sehen aus wie Buttons, sind aber Links, weil sie auf andere Seiten führen.

## Überschriften: genau ein `h1`

- Jede Seite hat **eine** `<h1>` (das Hauptthema).
- Darunter kommen `<h2>` für die Abschnitte und `<h3>` für die Unterpunkte (zum Beispiel die Titel der Karten).
- Man **überspringt keine Ebene** (kein `h1` direkt zu `h3`). Screenreader-Nutzer springen oft von Überschrift zu Überschrift, so wie andere eine Seite überfliegen.

## Barrierefreiheit (ARIA)

ARIA-Attribute (`aria-...`) geben **zusätzliche Informationen für Hilfsmittel** wie Screenreader. Sie ändern nichts am Aussehen.

| Attribut | Bedeutung | Beispiel hier |
| --- | --- | --- |
| `lang="en"` | Sprache der Seite (für die Aussprache) | `<html lang="en">` |
| `aria-label="..."` | ein Name für ein Element, das keinen sichtbaren hat | `<nav aria-label="Main">` |
| `aria-labelledby="id"` | der Name steht in einem anderen Element | `<section aria-labelledby="demo-title">` |
| `aria-current="page"` | „das ist die aktuelle Seite" | der aktive Menüpunkt |
| `aria-expanded="true/false"` | ausgeklappt oder eingeklappt | der Menü-Button |
| `aria-controls="id"` | dieser Button steuert das Element mit der `id` | Menü-Button und Menü |
| `aria-pressed="true/false"` | Schalter gedrückt oder nicht | Filter-Chips in der Demo |
| `role="status"` | Bereich, dessen Änderungen angesagt werden | Ansage „Step 3 of 5" |

**Landmarks.** Elemente wie `header`, `nav`, `main`, `footer` heißen *Landmarks* (Orientierungspunkte). Screenreader bieten an, direkt zu ihnen zu springen. Gibt es **mehrere** gleiche (zwei `nav`), unterscheidet man sie mit `aria-label`: „Main" und „Footer".

**Die erste Regel von ARIA:** Wenn es ein passendes HTML-Element gibt, nimmt man das. `<button>` ist besser als ein `<div>` mit `role="button"`, weil der Browser Tastatur und Fokus schon beherrscht.

## Pfade (wo liegen die Dateien?)

| Schreibweise | Bedeutung |
| --- | --- |
| `landing.html` | Datei im **selben** Ordner |
| `../css/landing.css` | eine Ebene **nach oben** (`..`), dann in den Ordner `css` |
| `html/landing.html` | im Unterordner `html` (von `index.html` aus) |
| `https://...` | eine Adresse im Internet |

Die Seiten liegen in `html/`, das CSS in `css/` und die Skripte in `ts/`. Deshalb beginnt fast jeder Pfad auf einer Seite mit `../`.

## Skripte am Ende

`<script src="...">` lädt eine JavaScript-Datei. Die Skripte stehen **am Ende des `<body>`**, nach dem sichtbaren Inhalt. So ist die Seite schon da, wenn der Code Elemente sucht. Die Reihenfolge zählt: Was vorher steht, läuft zuerst.

## Zeichen

- Sonderzeichen wie `ö`, `·` oder `€` stehen direkt im Text, weil die Seite mit `<meta charset="UTF-8">` den passenden Zeichensatz festlegt.
- Eine Schreibweise wie `&hellip;` (für „…") nennt man **Entität**. Sie wird gebraucht, wenn ein Zeichen im Quelltext schwierig wäre, zum Beispiel `<` oder `&`.
