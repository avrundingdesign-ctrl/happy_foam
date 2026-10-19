# Rechtstexte

Hier liegen die Rechtstexte als Markdown-Dateien. Sie erscheinen auf der Website **und** in der
Bestellbestätigungs-E-Mail (AGB und Widerrufsbelehrung müssen dort vollständig enthalten sein).

| Datei            | Seite                                                       |
| ---------------- | ----------------------------------------------------------- |
| `impressum.md`   | /impressum                                                  |
| `datenschutz.md` | /datenschutz                                                |
| `agb.md`         | /agb + Bestell-E-Mail                                       |
| `widerruf.md`    | /widerruf + Bestell-E-Mail (inkl. Muster-Widerrufsformular) |
| `versand.md`     | /versand-und-zahlung (Zusatztext)                           |

So geht's: Den Platzhalter (z. B. `[AGB]`) durch den Text des Rechtstexte-Anbieters ersetzen.
Überschriften mit `##`, Aufzählungen mit `-`. HTML vom Anbieter funktioniert ebenfalls.
Danach `npm run build:legal` ausführen (passiert beim Veröffentlichen automatisch).
