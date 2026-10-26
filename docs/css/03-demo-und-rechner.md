# CSS 3: Das CSS der App-Demo und des Rechners

Dieses Kapitel erklärt die zwei **Zusatzabschnitte**, die nicht zum gemeinsamen Teil gehören:

- `product.css` ab Zeile 443: die Gestaltung der App-Demo (Schritte, Karte, Chips, Liste, Zahlung, QR-Code)
- `business.css` ab Zeile 435: die Gestaltung des Break-even-Rechners (Regler, Kacheln, Diagramm, Tabelle)

Lies zuerst die Kapitel 0 bis 2. Hier kommen nur Neuerungen vor. Wer verstehen will, **welches HTML** zu diesen Regeln gehört, findet es in den React-Kapiteln: Die Klassennamen (`demo-...`, `calc-...`) stammen aus den `.tsx`-Dateien.

## Neue Werkzeuge in diesem Kapitel

| Werkzeug | Bedeutung | Beispiel |
| --- | --- | --- |
| `minmax(220px, 300px)` | eine Grid-Spalte, die zwischen 220 und 300 Pixel breit sein darf | `.demo-layout` |
| `[data-state="current"]` | **Attributselektor**: Elemente mit genau diesem Attribut | `.demo-step[data-state="current"]` |
| `[aria-pressed="true"]` | dasselbe für das Schalter-Attribut | `.demo-chip[aria-pressed="true"]` |
| `:not(:disabled)` | „nicht gesperrt" | `.demo-step-button:not(:disabled):hover` |
| `:has(input:checked)` | **Eltern-Selektor**: Elemente, die ein bestimmtes Kind enthalten | `.demo-pay-option:has(input:checked)` |
| `A > B` | `B` ist **direktes Kind** von `A` | `.calc-layout > *` |
| `accent-color` | färbt eingebaute Bedienelemente (Radiobutton, Regler) | `.calc-field input[type="range"]` |
| `font-variant-numeric: tabular-nums` | alle Ziffern gleich breit | Zahlen, die sich ändern |
| `fill`, `stroke`, `stroke-width` | Füllung, Rand und Randdicke von **SVG**-Formen | `.calc-bar-pos`, `.calc-line` |
| `grid-auto-flow: column` | Grid-Kinder in Spalten statt Zeilen anordnen | Schrittleiste auf dem Handy |
| `border-collapse: collapse` | Tabellenränder fallen zusammen statt doppelt zu erscheinen | `.calc-table` |

---

# Teil A: Die App-Demo (`product.css`, ab Zeile 443)


## Abschnitt und Aufteilung

```css
443 | /* Demo section: interactive React demo (see react/src), styled with the same tokens as the rest of the page */
444 | .demo {
445 |     padding: 4vh 6vw 8vh;
446 | }
447 |
448 | .demo h2 {
449 |     margin: 0 0 0.75rem;
450 |     font-size: clamp(1.8rem, 3vw, 2.6rem);
451 | }
452 |
453 | .demo-layout {
454 |     display: grid;
455 |     grid-template-columns: minmax(220px, 300px) 1fr;
456 |     gap: 1.5rem;
457 |     align-items: start;
458 | }
```

- **Z. 443** Kommentar: Der Abschnitt gehört zur React-Demo und benutzt dieselben Variablen wie die Seite.
- **Z. 444–446** Der Abstand um den Demo-Abschnitt, genauso wie bei `.teaser` und `.founders` (oben 4vh, seitlich 6vw, unten 8vh).
- **Z. 448–451** Die Überschrift des Abschnitts, mit fließender Größe (`clamp`).
- **Z. 453–458** **Zwei Spalten**: links die Schritte, rechts das Panel. `minmax(220px, 300px)` lässt die linke Spalte zwischen 220 und 300 Pixel breit sein. `1fr` gibt der rechten den Rest. `align-items: start` richtet beide **oben** aus, statt sie gleich hoch zu strecken. Ohne das würde die kurze Schrittliste auf die Höhe des langen Panels gedehnt.

## Der Trick für „nur für Screenreader sichtbar"

```css
460 | /* Visually hidden text that screen readers still announce */
461 | .demo-sr-only {
462 |     position: absolute;
463 |     width: 1px;
464 |     height: 1px;
465 |     margin: -1px;
466 |     padding: 0;
467 |     overflow: hidden;
468 |     clip: rect(0, 0, 0, 0);
469 |     white-space: nowrap;
470 |     border: 0;
471 | }
```

- **Z. 461** Diese Klasse versteckt Text **für das Auge**, lässt ihn aber für Screenreader bestehen. Das braucht man für die Ansage „Step 3 of 5: Choose". `display: none` würde den Text auch vor Screenreadern verstecken, deshalb nimmt man diese Technik.
- **Z. 462** Das Element nimmt keinen Platz im Layout ein.
- **Z. 463–464** Es wird nur einen Pixel groß.
- **Z. 465** Der negative Rand sorgt dafür, dass der Pixel nirgends sichtbar „absteht".
- **Z. 467** Alles, was über den einen Pixel hinausgeht, wird abgeschnitten.
- **Z. 468** Eine ältere Methode, den Bereich auf null zu beschneiden. Sie gilt als veraltet, wird aber aus Vorsicht noch mitgegeben.
- **Z. 469** Der Text darf nicht umbrechen, sonst würden Screenreader Wörter einzeln lesen.
- **Z. 470** Kein Rand.

## Die Schrittliste (links)

```css
473 | /* Step list: finished steps are clickable, the current step shows its description */
474 | .demo-steps {
475 |     list-style: none;
476 |     margin: 0;
477 |     padding: 0;
478 |     display: grid;
479 |     gap: 0.6rem;
480 | }
481 |
482 | .demo-step-button {
483 |     width: 100%;
484 |     display: grid;
485 |     grid-template-columns: auto 1fr;
486 |     align-items: center;
487 |     gap: 0.2rem 0.8rem;
488 |     padding: 0.8rem 1rem;
489 |     text-align: left;
490 |     font: inherit;
491 |     color: var(--ink);
492 |     background: var(--card);
493 |     border: 1px solid var(--stroke);
494 |     border-radius: 14px;
495 |     cursor: pointer;
496 |     transition: border-color 0.2s ease, background 0.2s ease;
497 | }
498 |
499 | .demo-step-button:disabled {
500 |     cursor: default;
501 |     color: var(--muted);
502 | }
503 |
504 | .demo-step-button:not(:disabled):hover {
505 |     border-color: var(--accent);
506 | }
507 |
508 | .demo-step-number {
509 |     display: inline-flex;
510 |     align-items: center;
511 |     justify-content: center;
512 |     width: 1.9rem;
513 |     height: 1.9rem;
514 |     border-radius: 50%;
515 |     border: 1px solid var(--stroke);
516 |     font-family: var(--font-display);
517 |     font-weight: 800;
518 |     font-size: 0.9rem;
519 | }
520 |
521 | .demo-step-title {
522 |     font-family: var(--font-display);
523 |     font-weight: 600;
524 | }
525 |
526 | .demo-step-text {
527 |     display: none;
528 |     grid-column: 2;
529 |     color: var(--muted);
530 |     font-size: 0.92rem;
531 | }
532 |
533 | .demo-step[data-state="current"] .demo-step-button {
534 |     border-color: var(--accent);
535 |     color: var(--ink);
536 |     background: rgba(125, 255, 179, 0.08);
537 | }
538 |
539 | .demo-step[data-state="current"] .demo-step-number {
540 |     background: var(--accent);
541 |     border-color: var(--accent);
542 |     color: #062016;
543 | }
544 |
545 | .demo-step[data-state="current"] .demo-step-text {
546 |     display: block;
547 | }
548 |
549 | .demo-step[data-state="done"] .demo-step-number {
550 |     border-color: var(--accent);
551 |     color: var(--accent);
552 | }
```

- **Z. 474–480** Die Liste: Aufzählungspunkte und Standardabstände weg, dann ein Grid mit `gap: 0.6rem`. Es hat keine Spaltenangabe, also entsteht **eine Spalte**: die Schritte stehen untereinander.
- **Z. 482–497** Jeder Schritt ist ein Button und sieht aus wie eine Karte. `width: 100%` füllt die Spalte. `display: grid` mit `grid-template-columns: auto 1fr` ergibt zwei Spalten: links die Nummer (so breit wie nötig), rechts der Rest. `gap: 0.2rem 0.8rem` setzt zwei Abstände (Zeilen und Spalten). **`font: inherit`** ist wichtig: Buttons übernehmen die Schrift sonst **nicht** von der Seite. `text-align: left` ist nötig, weil Buttons Text sonst zentrieren. Dazu Farbe, Karte, Rand, Rundung, Handzeiger und weiche Übergänge.
- **Z. 499–502** Ein gesperrter Button (aktueller oder noch nicht erreichter Schritt) bekommt keinen Handzeiger und die gedämpfte Farbe.
- **Z. 504–506** `:not(:disabled)` bedeutet „nicht gesperrt". Nur ein Schritt, den man anklicken kann, bekommt beim Darüberfahren einen grünen Rand.
- **Z. 508–519** Der Kreis mit der Nummer: `inline-flex` und die beiden Zentrierungen (`align-items`, `justify-content`) setzen die Zahl in die Mitte. Breite und Höhe sind gleich groß (1,9 rem), und `border-radius: 50%` macht daraus einen **Kreis**.
- **Z. 521–524** Der Titel in der Display-Schrift.
- **Z. 526–531** Die Beschreibung ist **standardmäßig versteckt** (`display: none`). `grid-column: 2` setzt sie in die **zweite** Spalte, unter den Titel, falls sie sichtbar wird.
- **Z. 533–537** Dieser Selektor hat drei Teile: ein `.demo-step`, das das Attribut `data-state="current"` trägt, und darin der Button. React setzt dieses Attribut (siehe `Stepper.tsx`). So kommt der Zustand vom Code ins CSS. Der aktuelle Schritt bekommt einen grünen Rand und einen schwach grünen Hintergrund.
- **Z. 539–543** Die Nummer des aktuellen Schritts wird ein **gefüllter** grüner Kreis mit dunkler Ziffer.
- **Z. 545–547** Nur beim aktuellen Schritt wird die Beschreibung angezeigt (`display: block`). Sie ist spezifischer als `.demo-step-text` weiter oben und gewinnt deshalb.
- **Z. 549–552** Erledigte Schritte bekommen einen grünen Rand und eine grüne Ziffer.

## Das Panel, Karte, Filter

```css
554 | /* Panel: map, filters, list and the later steps live in one card */
555 | .demo-panel {
556 |     display: grid;
557 |     gap: 1rem;
558 |     padding: 1.2rem;
559 |     background: var(--card);
560 |     border: 1px solid var(--stroke);
561 |     border-radius: var(--radius);
562 |     box-shadow: var(--shadow);
563 | }
564 |
565 | .demo-panel h3 {
566 |     margin: 0;
567 | }
568 |
569 | .demo-note {
570 |     margin: 0;
571 |     color: var(--accent);
572 |     font-size: 0.78rem;
573 |     letter-spacing: 0.14em;
574 |     text-transform: uppercase;
575 | }
576 |
577 | .demo-hint,
578 | .demo-insight,
579 | .demo-summary {
580 |     margin: 0;
581 |     color: var(--muted);
582 | }
583 |
584 | .demo-insight strong,
585 | .demo-summary strong {
586 |     color: var(--accent);
587 | }
588 |
589 | .demo-map {
590 |     width: 100%;
591 |     height: auto;
592 |     display: block;
593 |     border: 1px solid var(--stroke);
594 |     border-radius: 12px;
595 | }
596 |
597 | .demo-marker {
598 |     cursor: pointer;
599 |     outline: none;
600 | }
601 |
602 | .demo-marker:focus-visible .demo-marker-dot {
603 |     stroke: var(--ink);
604 |     stroke-width: 4;
605 | }
```

- **Z. 555–563** Der große Kasten rechts: ein Grid in **einer** Spalte (`display: grid` mit `gap: 1rem`), Karte-Optik (Hintergrund, Rand, Rundung, Schatten) wie bei den anderen Karten.
- **Z. 565–567** Überschriften im Panel ohne Standardabstände.
- **Z. 569–575** Der Hinweis „Sample data, not live bikes": klein, grün, gesperrt und in Großbuchstaben.
- **Z. 577–582** Drei Textarten teilen sich eine Regel: gedämpfte Farbe und kein Abstand.
- **Z. 584–587** Hervorgehobene Zahlen („70 m") sind grün.
- **Z. 589–595** Das SVG der Karte füllt die Breite (`width: 100%`), die Höhe folgt dem Seitenverhältnis (`height: auto`). **`display: block`** entfernt den kleinen Abstand unter einem SVG, der entsteht, weil es sonst wie ein Buchstabe in einer Textzeile steht.
- **Z. 597–600** Ein Rad auf der Karte hat einen Handzeiger. `outline: none` entfernt den Standardrahmen, weil er bei einem SVG-Kreis unschön wäre. **Aber:** Der Tastaturfokus muss weiter sichtbar sein. Das übernimmt die nächste Regel.
- **Z. 602–605** Wenn die Gruppe (`.demo-marker`) per Tastatur den Fokus hat, bekommt der Kreis darin (`.demo-marker-dot`) einen hellen, dicken Rand. Das ist der Ersatz für den entfernten Standardrahmen.

## Chips, Liste

```css
607 | .demo-filters {
608 |     display: flex;
609 |     flex-wrap: wrap;
610 |     gap: 0.5rem;
611 | }
612 |
613 | .demo-chip {
614 |     display: inline-flex;
615 |     align-items: center;
616 |     gap: 0.4rem;
617 |     padding: 0.4rem 0.85rem;
618 |     font: inherit;
619 |     font-size: 0.92rem;
620 |     color: var(--muted);
621 |     background: transparent;
622 |     border: 1px solid var(--stroke);
623 |     border-radius: 999px;
624 |     cursor: pointer;
625 |     transition: border-color 0.2s ease, color 0.2s ease, background 0.2s ease;
626 | }
627 |
628 | .demo-chip:hover,
629 | .demo-chip[aria-pressed="true"] {
630 |     color: var(--ink);
631 |     border-color: var(--accent);
632 | }
633 |
634 | .demo-chip[aria-pressed="true"] {
635 |     background: rgba(125, 255, 179, 0.12);
636 | }
637 |
638 | .demo-dot {
639 |     display: inline-block;
640 |     width: 0.7rem;
641 |     height: 0.7rem;
642 |     border-radius: 50%;
643 |     flex: none;
644 | }
645 |
646 | .demo-list-title {
647 |     margin: 0 0 0.5rem;
648 |     font-size: 1rem;
649 | }
650 |
651 | .demo-list {
652 |     list-style: none;
653 |     margin: 0;
654 |     padding: 0;
655 |     display: grid;
656 |     gap: 0.4rem;
657 | }
658 |
659 | .demo-row {
660 |     width: 100%;
661 |     display: grid;
662 |     grid-template-columns: auto 1fr auto auto;
663 |     align-items: center;
664 |     gap: 0.8rem;
665 |     padding: 0.6rem 0.9rem;
666 |     font: inherit;
667 |     color: var(--ink);
668 |     background: transparent;
669 |     border: 1px solid var(--stroke);
670 |     border-radius: 12px;
671 |     cursor: pointer;
672 |     text-align: left;
673 |     transition: border-color 0.2s ease, background 0.2s ease;
674 | }
675 |
676 | .demo-row:hover,
677 | .demo-row[aria-pressed="true"] {
678 |     border-color: var(--accent);
679 | }
680 |
681 | .demo-row[aria-pressed="true"] {
682 |     background: rgba(125, 255, 179, 0.1);
683 | }
684 |
685 | .demo-actions {
686 |     display: flex;
687 |     flex-wrap: wrap;
688 |     align-items: center;
689 |     gap: 0.85rem;
690 | }
691 |
692 | .demo-view {
693 |     display: grid;
694 |     gap: 1rem;
695 | }
```

- **Z. 607–611** Die Chips liegen in einer umbrechenden Flex-Zeile.
- **Z. 613–626** Jeder Chip ist ein Button in Pillenform. `display: inline-flex` mit `align-items: center` stellt den Punkt und den Text auf eine Linie. `font: inherit` plus eine eigene `font-size` (siehe Hinweis oben zu Buttons). Durchsichtiger Hintergrund, dünner Rand, `border-radius: 999px`.
- **Z. 628–632** Beim Darüberfahren **und** bei einem gewählten Chip (`[aria-pressed="true"]`): heller Text und grüner Rand. Dasselbe Attribut, das Screenreader auslesen, steuert hier das Aussehen. Es gibt nur **eine** Quelle für den Zustand.
- **Z. 634–636** Nur der gewählte Chip bekommt zusätzlich einen grünen Hintergrund.
- **Z. 638–644** Der farbige Punkt vor einem Namen: ein Kreis (`border-radius: 50%`) mit fester Größe. `flex: none` verhindert, dass ihn eine Flex-Zeile zusammendrückt.
- **Z. 646–649** Der Titel „Nearest bikes".
- **Z. 651–657** Die Liste ohne Punkte, als Grid mit kleinem Abstand.
- **Z. 659–674** Jede Zeile ist ein Button mit **vier Spalten**: `auto 1fr auto auto` heißt Punkt, Name (nimmt den Rest), Entfernung und Preis. Die übrigen Eigenschaften entsprechen den Chips.
- **Z. 676–679** Grüner Rand beim Darüberfahren und bei der gewählten Zeile.
- **Z. 681–683** Die gewählte Zeile bekommt zusätzlich einen grünen Hintergrund.
- **Z. 685–690** Der Bereich für Buttons: Flex-Zeile, die umbricht.
- **Z. 692–695** Die Ansichten für Bezahlen und Entsperren sind einfache Grids mit Abstand.

## Zahlung, QR-Code und Buttons

```css
697 | .demo-pay-options {
698 |     display: grid;
699 |     gap: 0.5rem;
700 |     margin: 0;
701 |     padding: 0;
702 |     border: 0;
703 | }
704 |
705 | .demo-pay-options legend {
706 |     padding: 0;
707 |     margin-bottom: 0.5rem;
708 |     color: var(--muted);
709 | }
710 |
711 | .demo-pay-option {
712 |     display: flex;
713 |     align-items: center;
714 |     gap: 0.7rem;
715 |     padding: 0.7rem 0.9rem;
716 |     border: 1px solid var(--stroke);
717 |     border-radius: 12px;
718 |     cursor: pointer;
719 | }
720 |
721 | .demo-pay-option:has(input:checked) {
722 |     border-color: var(--accent);
723 |     background: rgba(125, 255, 179, 0.1);
724 | }
725 |
726 | .demo-pay-option input {
727 |     accent-color: var(--accent);
728 | }
729 |
730 | .demo-unlock {
731 |     display: flex;
732 |     flex-wrap: wrap;
733 |     align-items: center;
734 |     gap: 1.5rem;
735 | }
736 |
737 | .demo-qr {
738 |     width: 170px;
739 |     height: 170px;
740 |     border-radius: 12px;
741 | }
742 |
743 | .demo-code {
744 |     margin: 0.4rem 0 0;
745 |     font-family: var(--font-display);
746 |     font-weight: 800;
747 |     font-size: 2.6rem;
748 |     letter-spacing: 0.3em;
749 |     color: var(--accent);
750 |     font-variant-numeric: tabular-nums;
751 | }
752 |
753 | .demo button.btn {
754 |     border: 0;
755 |     font-size: 1rem;
756 |     cursor: pointer;
757 | }
758 |
759 | .demo button.btn-ghost {
760 |     border: 1px solid var(--stroke);
761 | }
762 |
763 | .demo button:focus-visible {
764 |     outline: 2px solid var(--accent);
765 |     outline-offset: 3px;
766 | }
767 |
768 | .demo button.btn:disabled {
769 |     opacity: 0.6;
770 |     cursor: default;
771 | }
772 |
773 | .demo button.btn:disabled:hover {
774 |     transform: none;
775 | }
```

- **Z. 697–703** Die Gruppe der Zahlungsarten ist ein `<fieldset>`, das der Browser mit Rahmen und Abstand liefert. Hier wird alles zurückgesetzt (`margin`, `padding`, `border: 0`) und als Grid angeordnet.
- **Z. 705–709** Die Beschriftung der Gruppe: gedämpft, mit Abstand nach unten, ohne Innenabstand.
- **Z. 711–719** Jede Zahlungsart ist ein `<label>` und sieht wie eine Zeile aus: Flex, Rand, Rundung, Handzeiger.
- **Z. 721–724** **Neu:** `:has(...)` wählt ein Element danach aus, **was es enthält**. Hier: ein `label`, in dem ein Radiobutton ausgewählt ist. Dieses Label bekommt grünen Rand und Hintergrund. Früher ging das nur mit JavaScript. Ältere Browser kennen `:has` nicht und zeigen dann nur den normalen Radiobutton ohne Hervorhebung. Die Funktion ist weiter **nutzbar**, nur weniger schön.
- **Z. 726–728** `accent-color` färbt den eingebauten Radiobutton grün, ohne dass man ihn selbst nachbauen muss.
- **Z. 730–735** Der Bereich mit QR-Code und Schloss-Code: Flex mit Umbruch, auf dem Handy stehen beide untereinander.
- **Z. 737–741** Der QR-Code ist 170 mal 170 Pixel groß mit runden Ecken.
- **Z. 743–751** Der Schloss-Code: große, fette Display-Schrift. `letter-spacing: 0.3em` setzt die vier Ziffern weit auseinander, `tabular-nums` macht alle Ziffern gleich breit.
- **Z. 753–757** Die Buttons der Demo benutzen die Klassen `btn` und `btn-primary` von der Seite. Diese Regel gleicht die Unterschiede zwischen einem Link (`<a class="btn">`) und einem echten Button aus: kein Standardrand (`border: 0`), eine Schriftgröße, Handzeiger. Der Selektor `.demo button.btn` ist **spezifischer** als `.btn` allein und gewinnt deshalb.
- **Z. 759–761** Die Folge der Regel davor: `border: 0` würde auch den dünnen Rand des Ghost-Buttons entfernen, weil die Regel spezifischer ist. Deshalb setzt diese Regel ihn wieder.
- **Z. 763–766** Sichtbarer Tastaturfokus für alle Buttons der Demo.
- **Z. 768–771** Gesperrte Buttons (während des Bezahlens) sind etwas durchsichtig (`opacity: 0.6`) und haben keinen Handzeiger.
- **Z. 773–775** Ein gesperrter Button hebt sich beim Darüberfahren nicht an (`transform: none`), obwohl `.btn:hover` das sonst tut.

## Anpassung ans Handy

```css
777 | /* Narrow screens: steps become a compact row of numbers and titles above the panel */
778 | @media (max-width: 800px) {
779 |     .demo-layout {
780 |         grid-template-columns: 1fr;
781 |     }
782 |
783 |     .demo-steps {
784 |         grid-auto-flow: column;
785 |         grid-auto-columns: 1fr;
786 |         gap: 0.4rem;
787 |     }
788 |
789 |     .demo-step-button {
790 |         grid-template-columns: 1fr;
791 |         justify-items: center;
792 |         padding: 0.5rem 0.2rem;
793 |         text-align: center;
794 |     }
795 |
796 |     .demo-step-title {
797 |         font-size: 0.78rem;
798 |     }
799 |
800 |     .demo-step[data-state="current"] .demo-step-text {
801 |         display: none;
802 |     }
803 | }
```

- **Z. 778** Gilt nur auf dem Handy, wie im gemeinsamen Teil.
- **Z. 779–781** Eine Spalte: Schritte **über** dem Panel.
- **Z. 783–787** **Neu:** `grid-auto-flow: column` lässt die Schritte nebeneinander laufen, statt untereinander. `grid-auto-columns: 1fr` macht alle Spalten gleich breit. So wird aus der Liste eine Leiste mit fünf Feldern.
- **Z. 789–794** Jeder Schritt hat nur noch **eine** Spalte, alles zentriert, weniger Innenabstand.
- **Z. 796–798** Kleinere Schrift, damit die Titel in die schmalen Felder passen.
- **Z. 800–802** Die lange Beschreibung wird auf dem Handy auch beim aktuellen Schritt versteckt, weil sie in der schmalen Leiste keinen Platz hat. Der Hinweistext im Panel (`demo-hint`) übernimmt.

---

# Teil B: Der Rechner (`business.css`, ab Zeile 435)


## Abschnitt und Aufteilung

```css
435 | /* Calculator section: interactive break-even calculator (see react/src/calculator), same tokens as the rest of the page */
436 | .calculator {
437 |     padding: 4vh 6vw 8vh;
438 | }
439 |
440 | .calculator h2 {
441 |     margin: 0 0 0.75rem;
442 |     font-size: clamp(1.8rem, 3vw, 2.6rem);
443 | }
444 |
445 | .calc-layout {
446 |     display: grid;
447 |     grid-template-columns: minmax(240px, 320px) 1fr;
448 |     gap: 1.5rem;
449 |     align-items: start;
450 |     margin-bottom: 1.5rem;
451 | }
452 |
453 | /* min-width: 0 lets the grid columns shrink, so a wide table scrolls inside its own box instead of widening the page */
454 | .calc-layout>*,
455 | .calc-results>* {
456 |     min-width: 0;
457 | }
458 |
459 | .calc-controls,
460 | .calc-results {
461 |     display: grid;
462 |     gap: 1.1rem;
463 |     padding: 1.3rem;
464 |     background: var(--card);
465 |     border: 1px solid var(--stroke);
466 |     border-radius: var(--radius);
467 |     box-shadow: var(--shadow);
468 | }
```

- **Z. 435** Kommentar zum Abschnitt.
- **Z. 436–438** und **Z. 440–443** Abstand und Überschrift, wie beim Demo-Abschnitt.
- **Z. 445–451** Zwei Spalten: Regler links (240 bis 320 Pixel), Ergebnisse rechts (`1fr`). Beide oben ausgerichtet (`align-items: start`), mit Abstand nach unten (`margin-bottom`).
- **Z. 453** Der Kommentar erklärt den Zweck der nächsten Regel.
- **Z. 454–457** `>` heißt **direktes Kind**, `*` heißt „alles". Die Regel gilt also für beide Spalten **und** für alle direkten Kinder der rechten Spalte. Ein Grid-Element ist standardmäßig mindestens so breit wie sein Inhalt (`min-width: auto`). Eine breite Tabelle zwang deshalb die ganze Spalte, breiter zu werden und die Seite seitlich zu verschieben. Mit `min-width: 0` darf die Spalte kleiner werden, und die Tabelle scrollt in ihrem eigenen Kasten. Das ist der Fehler, den wir beim Testen gefunden haben.
- **Z. 459–468** Die beiden Kästen (Regler und Ergebnisse) teilen sich die Optik: Grid mit Abstand, Innenabstand, Karten-Hintergrund, Rand, Rundung, Schatten.

## Regler

```css
470 | /* Visually hidden text that screen readers still read */
471 | .demo-sr-only {
472 |     position: absolute;
473 |     width: 1px;
474 |     height: 1px;
475 |     margin: -1px;
476 |     padding: 0;
477 |     overflow: hidden;
478 |     clip: rect(0, 0, 0, 0);
479 |     white-space: nowrap;
480 |     border: 0;
481 | }
482 |
483 | .calc-field {
484 |     display: grid;
485 |     gap: 0.4rem;
486 | }
487 |
488 | .calc-field-head {
489 |     display: flex;
490 |     justify-content: space-between;
491 |     align-items: baseline;
492 |     gap: 0.75rem;
493 | }
494 |
495 | .calc-field-head label {
496 |     font-weight: 600;
497 | }
498 |
499 | .calc-field-head output {
500 |     font-family: var(--font-display);
501 |     font-weight: 800;
502 |     color: var(--accent);
503 |     font-variant-numeric: tabular-nums;
504 | }
505 |
506 | .calc-field input[type="range"] {
507 |     width: 100%;
508 |     accent-color: var(--accent);
509 | }
510 |
511 | .calc-help {
512 |     margin: 0;
513 |     color: var(--muted);
514 |     font-size: 0.85rem;
515 | }
516 |
517 | .calc-presets {
518 |     display: flex;
519 |     flex-wrap: wrap;
520 |     gap: 0.6rem;
521 | }
522 |
523 | .calculator button.btn {
524 |     cursor: pointer;
525 |     font-size: 0.95rem;
526 | }
527 |
528 | .calculator button:focus-visible,
529 | .calculator input:focus-visible,
530 | .calculator summary:focus-visible {
531 |     outline: 2px solid var(--accent);
532 |     outline-offset: 3px;
533 | }
```

- **Z. 470–481** Dieselbe Regel `.demo-sr-only` wie in `product.css`. Sie ist hier ein zweites Mal definiert, weil der Rechner sie für die Tabellenüberschrift braucht und jede Seite ihre eigene CSS-Datei lädt. Der Name klingt nach „Demo", ist hier aber in Gebrauch. Das ist eine kleine Unsauberkeit: Eine gemeinsame Datei würde sie nur einmal brauchen.
- **Z. 483–486** Ein Regler mit Beschriftung und Hilfstext ist ein Grid mit kleinem Abstand.
- **Z. 488–493** Die Kopfzeile eines Reglers: Flex, `justify-content: space-between` schiebt Beschriftung links und Wert rechts. `align-items: baseline` richtet beide an der **Grundlinie** des Textes aus, damit unterschiedlich große Schriften auf einer Linie stehen.
- **Z. 495–497** Die Beschriftung ist halbfett.
- **Z. 499–504** Der aktuelle Wert: Display-Schrift, fett, grün, mit gleich breiten Ziffern (`tabular-nums`), damit er beim Ziehen nicht hin- und herzuckt.
- **Z. 506–509** Der Schieberegler. Der Selektor `input[type="range"]` wählt nur Eingabefelder dieses Typs. Er füllt die Breite, und `accent-color` färbt Schiene und Griff grün.
- **Z. 511–515** Der Hilfstext unter dem Regler: klein, gedämpft.
- **Z. 517–521** Die zwei Voreinstellungs-Buttons nebeneinander, mit Umbruch.
- **Z. 523–526** Buttons im Rechner: Handzeiger und eine etwas kleinere Schrift.
- **Z. 528–533** Tastaturfokus für Buttons, Regler und das aufklappbare `summary`. Drei Selektoren teilen sich den Rahmen.

## Kacheln und Legende

```css
535 | /* Result cards: three key figures; the cash card turns warm when the funding falls short */
536 | .calc-stats {
537 |     display: grid;
538 |     grid-template-columns: repeat(3, 1fr);
539 |     gap: 0.8rem;
540 | }
541 |
542 | .calc-stat {
543 |     padding: 0.9rem 1rem;
544 |     border: 1px solid var(--stroke);
545 |     border-radius: 14px;
546 |     background: rgba(255, 255, 255, 0.02);
547 | }
548 |
549 | .calc-stat-label {
550 |     margin: 0;
551 |     color: var(--muted);
552 |     font-size: 0.85rem;
553 | }
554 |
555 | .calc-stat-value {
556 |     margin: 0.25rem 0 0;
557 |     font-family: var(--font-display);
558 |     font-weight: 800;
559 |     font-size: clamp(1.2rem, 2vw, 1.7rem);
560 |     color: var(--accent);
561 |     font-variant-numeric: tabular-nums;
562 |     overflow-wrap: anywhere;
563 | }
564 |
565 | .calc-stat[data-state="gap"] {
566 |     border-color: #ffb27d;
567 | }
568 |
569 | .calc-stat[data-state="gap"] .calc-stat-value {
570 |     color: #ffb27d;
571 | }
572 |
573 | .calc-verdict {
574 |     margin: 0;
575 |     padding-left: 0.8rem;
576 |     border-left: 3px solid var(--accent);
577 |     color: var(--ink);
578 | }
579 |
580 | .calc-verdict[data-state="gap"] {
581 |     border-left-color: #ffb27d;
582 | }
583 |
584 | .calc-legend {
585 |     display: flex;
586 |     flex-wrap: wrap;
587 |     gap: 0.4rem 1.2rem;
588 |     color: var(--muted);
589 |     font-size: 0.88rem;
590 | }
591 |
592 | .calc-swatch {
593 |     display: inline-block;
594 |     width: 0.8rem;
595 |     height: 0.8rem;
596 |     margin-right: 0.35rem;
597 |     border-radius: 3px;
598 |     vertical-align: -1px;
599 | }
600 |
601 | .calc-swatch-pos {
602 |     background: var(--accent);
603 | }
604 |
605 | .calc-swatch-neg {
606 |     background: #ffb27d;
607 | }
608 |
609 | .calc-swatch-line {
610 |     height: 3px;
611 |     background: var(--ink);
612 |     vertical-align: 3px;
613 | }
```

- **Z. 536–540** Die drei Kacheln nebeneinander: `repeat(3, 1fr)` ergibt drei gleich breite Spalten.
- **Z. 542–547** Eine Kachel: Innenabstand, dünner Rand, Rundung und ein **kaum sichtbarer** Hintergrund (`rgba(255, 255, 255, 0.02)`, 2 % Weiß).
- **Z. 549–553** Die Beschriftung: gedämpft und klein.
- **Z. 555–563** Der Wert: Display-Schrift, fett, grün, mit fließender Größe zwischen 1,2 und 1,7 rem. `overflow-wrap: anywhere` verhindert, dass ein langer Betrag aus der Kachel ragt.
- **Z. 565–567** Wenn `Calculator.tsx` bei einer Finanzierungslücke `data-state="gap"` setzt, bekommt die Kachel einen orangen Rand. Das ist die Verbindung zwischen der Berechnung und dem Aussehen.
- **Z. 569–571** Der Wert in der Kachel wird dabei orange.
- Die Farbe `#ffb27d` steht in der Datei **als fester Wert**. Die Variable `--pain` gibt es nur in `problem.css`. Eine gemeinsame Datei würde sie überall verfügbar machen.
- **Z. 573–578** Der Satz zur Finanzierung bekommt links einen 3 Pixel breiten grünen Balken (`border-left`) und etwas Abstand dahinter (`padding-left`).
- **Z. 580–582** Bei einer Lücke wird der Balken orange. Es wird nur `border-left-color` überschrieben, nicht der ganze Rand.
- **Z. 584–590** Die Legende: Flex mit Umbruch und zwei Abständen (`0.4rem 1.2rem`).
- **Z. 592–599** Ein kleines Farbquadrat vor jedem Legendeneintrag: `inline-block` mit fester Größe. `vertical-align: -1px` rückt es um einen Pixel nach unten, damit es mit dem Text optisch auf einer Höhe sitzt.
- **Z. 601–603** bis **Z. 609–613** Die drei Farben der Legende: grün, orange und eine **dünne Linie** (`height: 3px`) für die Kassenlinie.

## Diagramm und Tabelle

```css
615 | /* Chart: SVG colours come from classes so the page tokens stay in one place */
616 | .calc-chart {
617 |     width: 100%;
618 |     height: auto;
619 |     display: block;
620 | }
621 |
622 | .calc-grid {
623 |     stroke: rgba(125, 255, 179, 0.12);
624 |     stroke-width: 1;
625 | }
626 |
627 | .calc-zero {
628 |     stroke: rgba(244, 255, 248, 0.55);
629 |     stroke-width: 1.5;
630 | }
631 |
632 | .calc-axis-text {
633 |     fill: var(--muted);
634 |     font-size: 12px;
635 | }
636 |
637 | .calc-bar-pos {
638 |     fill: var(--accent);
639 | }
640 |
641 | .calc-bar-neg {
642 |     fill: #ffb27d;
643 | }
644 |
645 | .calc-line {
646 |     fill: none;
647 |     stroke: var(--ink);
648 |     stroke-width: 2.5;
649 |     stroke-linejoin: round;
650 | }
651 |
652 | .calc-dot {
653 |     fill: var(--ink);
654 | }
655 |
656 | .calc-details summary {
657 |     cursor: pointer;
658 |     color: var(--accent);
659 |     font-weight: 600;
660 | }
661 |
662 | .calc-table-wrap {
663 |     margin-top: 0.8rem;
664 |     overflow-x: auto;
665 | }
666 |
667 | .calc-table {
668 |     width: 100%;
669 |     border-collapse: collapse;
670 |     font-size: 0.92rem;
671 |     font-variant-numeric: tabular-nums;
672 | }
673 |
674 | .calc-table th,
675 | .calc-table td {
676 |     padding: 0.5rem 0.7rem;
677 |     text-align: right;
678 |     border-bottom: 1px solid var(--stroke);
679 |     white-space: nowrap;
680 | }
681 |
682 | .calc-table thead th {
683 |     color: var(--muted);
684 |     font-weight: 600;
685 | }
686 |
687 | .calc-table th:first-child {
688 |     text-align: left;
689 | }
690 |
691 | .calc-note {
692 |     margin: 0;
693 |     color: var(--muted);
694 |     font-size: 0.85rem;
695 | }
```

- **Z. 616–620** Das SVG des Diagramms füllt die Breite, `height: auto` hält das Seitenverhältnis, `display: block` entfernt den Zeilenabstand darunter.
- **Z. 622–625** Die Gitterlinien: `stroke` ist die **Randfarbe** einer SVG-Form (eine Linie hat nur einen Rand und keine Füllung), hier ein Grün mit 12 % Deckkraft, `stroke-width` die Dicke.
- **Z. 627–630** Die Null-Linie ist heller und dicker. Die Klassen werden in `Chart.tsx` vergeben.
- **Z. 632–635** Beschriftungen im SVG: `fill` ist die **Füllfarbe** des Textes (bei SVG-Text nimmt man `fill`, nicht `color`). `font-size: 12px` gilt in den Einheiten des SVG-Koordinatensystems, nicht in Bildschirmpixeln.
- **Z. 637–639** Gewinnbalken sind grün.
- **Z. 641–643** Verlustbalken sind orange.
- **Z. 645–650** Die Kassenlinie: `fill: none` (keine Füllung, sonst würde die Fläche unter der Linie gefüllt), helle Randfarbe, 2,5 Einheiten dick, `stroke-linejoin: round` rundet die Ecken an den Knickpunkten.
- **Z. 652–654** Die Punkte auf der Linie sind hell.
- **Z. 656–660** Die Zeile „Show the numbers" bekommt Handzeiger, grüne Farbe und halbfette Schrift.
- **Z. 662–665** Der Kasten um die Tabelle: `overflow-x: auto` zeigt bei Bedarf einen waagerechten Scrollbalken. In Kombination mit `min-width: 0` (oben) bleibt die Seite dadurch auch auf dem Handy in der Breite.
- **Z. 667–672** Die Tabelle füllt die Breite. `border-collapse: collapse` lässt benachbarte Zellränder zu **einem** Strich verschmelzen, statt Doppellinien mit Abstand. Gleich breite Ziffern.
- **Z. 674–680** Alle Zellen: Innenabstand, **rechtsbündig** (Zahlen stehen besser rechts), ein dünner Strich unten und `white-space: nowrap`, damit Beträge nicht umbrechen.
- **Z. 682–685** Die Spaltenüberschriften sind gedämpft und halbfett.
- **Z. 687–689** Die erste Spalte (die Jahreszahl) steht **links**. `:first-child` meint die erste Zelle jeder Zeile.
- **Z. 691–695** Der Hinweistext unter dem Rechner: klein und gedämpft.

## Anpassung ans Handy

```css
697 | /* Narrow screens: sliders above results, key figures stack */
698 | @media (max-width: 800px) {
699 |     .calc-layout {
700 |         grid-template-columns: 1fr;
701 |     }
702 | }
703 |
704 | @media (max-width: 560px) {
705 |     .calc-stats {
706 |         grid-template-columns: 1fr;
707 |     }
708 | }
```

- **Z. 698–702** Auf dem Handy steht der Regler-Kasten **über** den Ergebnissen: eine Spalte.
- **Z. 704–708** Auf sehr schmalen Handys stehen auch die drei Kacheln untereinander.

---

## Typische Fragen

- **Wie kommt der Zustand aus React ins CSS?** Über Attribute am Element: `data-state="current"` beim Schritt, `data-state="gap"` bei der Kachel, `aria-pressed="true"` bei Chips und Zeilen. Das CSS schreibt Regeln für diese Attribute. React ändert nur das Attribut, das Aussehen folgt automatisch.
- **Warum `aria-pressed` im CSS und nicht eine zusätzliche Klasse?** Das Attribut muss für Screenreader ohnehin da sein. Eine zweite Klasse für dasselbe wäre doppelt, und beide könnten sich widersprechen.
- **Warum braucht man `font: inherit` bei Buttons?** Buttons haben vom Browser eine eigene Schrift und übernehmen die Seitenschrift nicht von selbst. Mit `inherit` holt man sie zurück.
- **Was macht `:has()`?** Es wählt ein Element danach, was es enthält. Früher brauchte man JavaScript, um einem `label` eine Klasse zu geben, wenn sein Radiobutton gewählt wird.
- **Warum `min-width: 0` auf Grid-Kindern?** Damit eine breite Tabelle die Spalte nicht aufweitet. Sonst wird die ganze Seite zu breit.
- **Was ist der Unterschied zwischen `fill` und `stroke` in SVG?** `fill` ist die Füllung einer Fläche, `stroke` der Rand oder bei Linien die Linienfarbe.
- **Wo gibt es in diesem Abschnitt Doppelungen?** Die Klasse `.demo-sr-only` steht in `product.css` und in `business.css`. Eine gemeinsame Datei könnte das beheben.

## Mach es selbst

1. Ändere in `product.css` `grid-template-columns: minmax(220px, 300px) 1fr` auf `300px 1fr`. Was passiert beim Verkleinern des Fensters?
2. Entferne probehalber `font: inherit` aus `.demo-chip`. Wie sieht der Text im Chip danach aus?
3. Setze in `business.css` `accent-color` des Reglers auf eine andere Farbe. Was färbt sich um?
4. Entferne die Regel `.calc-layout>*, .calc-results>*` (Zeilen 454 bis 457) und öffne auf dem Handy (oder in den Entwicklerwerkzeugen mit schmalem Fenster) „Show the numbers". Was passiert mit der Seite?
5. Probiere im Browser die Tastatur: Tab durch die Demo. Wo siehst du den Fokus, und welche Regel ist dafür zuständig?
