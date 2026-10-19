// Automatisch erzeugt von scripts/build-legal.mjs aus content/de/rechtliches/*.md – nicht von Hand bearbeiten.
export const legalDocs = {
  "impressum": {
    "html": "<div class=\"legal-placeholder\" data-placeholder=\"[IMPRESSUM]\"><strong>Hier wird der Rechtstext eingefügt:</strong> <mark>[IMPRESSUM]</mark></div>\n",
    "text": "Hier wird der Rechtstext eingefügt: [IMPRESSUM]",
    "hasPlaceholder": true
  },
  "datenschutz": {
    "html": "<div class=\"legal-placeholder\" data-placeholder=\"[DATENSCHUTZ]\"><strong>Hier wird der Rechtstext eingefügt:</strong> <mark>[DATENSCHUTZ]</mark></div>\n",
    "text": "Hier wird der Rechtstext eingefügt: [DATENSCHUTZ]",
    "hasPlaceholder": true
  },
  "agb": {
    "html": "<div class=\"legal-placeholder\" data-placeholder=\"[AGB]\"><strong>Hier wird der Rechtstext eingefügt:</strong> <mark>[AGB]</mark></div>\n",
    "text": "Hier wird der Rechtstext eingefügt: [AGB]",
    "hasPlaceholder": true
  },
  "widerruf": {
    "html": "<div class=\"legal-placeholder\" data-placeholder=\"[WIDERRUF]\"><strong>Hier wird der Rechtstext eingefügt:</strong> <mark>[WIDERRUF]</mark></div>\n<h2>Muster-Widerrufsformular</h2>\n<p>(Wenn Sie den Vertrag widerrufen wollen, dann füllen Sie bitte dieses Formular aus und senden Sie es zurück.)</p>\n<ul>\n<li>An <mark>[HERSTELLER_ANGABEN]</mark> (Name, Anschrift und E-Mail-Adresse des Unternehmers):</li>\n<li>Hiermit widerrufe(n) ich/wir (*) den von mir/uns (*) abgeschlossenen Vertrag über den Kauf der folgenden Waren (*)/die Erbringung der folgenden Dienstleistung (*)</li>\n<li>Bestellt am (*)/erhalten am (*)</li>\n<li>Name des/der Verbraucher(s)</li>\n<li>Anschrift des/der Verbraucher(s)</li>\n<li>Unterschrift des/der Verbraucher(s) (nur bei Mitteilung auf Papier)</li>\n<li>Datum</li>\n</ul>\n<p>(*) Unzutreffendes streichen.</p>\n",
    "text": "Hier wird der Rechtstext eingefügt: [WIDERRUF]\n\nMuster-Widerrufsformular\n\n(Wenn Sie den Vertrag widerrufen wollen, dann füllen Sie bitte dieses Formular aus und senden Sie es zurück.)\n\n• An [HERSTELLER_ANGABEN] (Name, Anschrift und E-Mail-Adresse des Unternehmers):\n\n• Hiermit widerrufe(n) ich/wir (*) den von mir/uns (*) abgeschlossenen Vertrag über den Kauf der folgenden Waren (*)/die Erbringung der folgenden Dienstleistung (*)\n\n• Bestellt am (*)/erhalten am (*)\n\n• Name des/der Verbraucher(s)\n\n• Anschrift des/der Verbraucher(s)\n\n• Unterschrift des/der Verbraucher(s) (nur bei Mitteilung auf Papier)\n\n• Datum\n\n(*) Unzutreffendes streichen.",
    "hasPlaceholder": true
  },
  "versand": {
    "html": "<div class=\"legal-placeholder\" data-placeholder=\"[VERSAND_ZAHLUNG]\"><strong>Hier wird der Rechtstext eingefügt:</strong> <mark>[VERSAND_ZAHLUNG]</mark></div>\n",
    "text": "Hier wird der Rechtstext eingefügt: [VERSAND_ZAHLUNG]",
    "hasPlaceholder": true
  }
} as const;

export type LegalDocName = keyof typeof legalDocs;
