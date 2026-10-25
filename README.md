# HappyFoam – Website & Online-Shop

> **Dein Geschäft bleibt dein Geschäft.**

Die Website für HappyFoam: Startseite mit animierter Produktvorstellung, eigener Shop mit Warenkorb und Kasse (Bezahlung über Stripe: Karte, PayPal, Apple Pay, Google Pay, Klarna, SEPA), Seite für Unternehmen mit Anfrageformular, „So funktioniert's“, FAQ, Über uns, Kontakt, Presse und alle Rechtsseiten.

Technik: Next.js 16 (App Router) · TypeScript · Tailwind CSS 4 · Motion (Framer Motion) · Cloudflare Workers (OpenNext) · Stripe · Resend · Brevo · Playwright.

![Startseite – Desktop](docs/screenshots/start-desktop.png)

---

## Inhalt

1. [Projekt lokal starten](#1-projekt-lokal-starten)
2. [Shop & Bezahlung mit Stripe](#2-shop--bezahlung-mit-stripe)
3. [Texte und Produkte ändern](#3-texte-und-produkte-ändern)
4. [Formulare & Newsletter einrichten](#4-formulare--newsletter-einrichten)
5. [Veröffentlichen auf Cloudflare & Domain happyfoam.org](#5-veröffentlichen-auf-cloudflare--domain-happyfoamorg)
6. [Rechtstexte einfügen](#6-rechtstexte-einfügen)
7. [Offene Platzhalter](#7-offene-platzhalter)
8. [Fehlende Dateien & Assets](#8-fehlende-dateien--assets)
9. [Qualität: Tests, Screenshots, Lighthouse](#9-qualität-tests-screenshots-lighthouse)
10. [Projektstruktur](#10-projektstruktur)

---

## 1. Projekt lokal starten

**Einmalig vorbereiten**

1. [Node.js](https://nodejs.org) installieren (Version 20 oder neuer, „LTS“).
2. Das Projekt herunterladen:
   ```bash
   git clone https://github.com/avrundingdesign-ctrl/happy_foam.git
   cd happy_foam
   ```
3. Abhängigkeiten installieren:
   ```bash
   npm install
   ```
4. Einstellungsdatei anlegen (für den ersten Start muss nichts eingetragen werden):
   ```bash
   cp .env.example .env.local
   ```

**Starten**

```bash
npm run dev
```

Dann im Browser <http://localhost:3000> öffnen. Änderungen an Texten oder Code erscheinen sofort.

> **Demo-Modus:** Solange in `.env.local` nichts eingetragen ist, werden Formulare nicht wirklich verschickt (die Nachricht erscheint nur im Terminal) und die Kasse prüft zwar alle Eingaben, zeigt am Ende aber einen Demo-Hinweis statt der Zahlung.

---

## 2. Shop & Bezahlung mit Stripe

Der Shop ist komplett in die Website eingebaut – **ohne monatliche Shop-Gebühren**. Bezahlt wird über [Stripe](https://stripe.com/de). Stripe berechnet nur eine Gebühr pro Zahlung (siehe Stripe-Preisseite).

**So läuft eine Bestellung ab**

1. Kund*in legt Produkte in den Warenkorb → **Zur Kasse** (`/kasse`).
2. Kontaktdaten und Lieferadresse (optional abweichende Rechnungsadresse) eingeben, Zahlungsart wählen (Karte, PayPal, Apple Pay, Google Pay, Klarna, SEPA – je nach Freischaltung in Stripe).
3. Bestellübersicht mit Versandkosten, Gesamtsumme, MwSt.-Hinweis und Links zu AGB/Widerruf/Datenschutz → Button **„Zahlungspflichtig bestellen“**.
4. Die Zahlung läuft über Stripe (bei PayPal & Co. kurz extern), danach landet man auf `/bestellung/abgeschlossen`.
5. Stripe meldet die erfolgreiche Zahlung an die Website (Webhook). Die Website schickt eine **Bestellbestätigung** (inkl. AGB und Widerrufsbelehrung) an die Kundin bzw. den Kunden und eine **Benachrichtigung mit Lieferadresse** an `CONTACT_EMAIL` – also an dich.

Preise und Versandkosten berechnet **nur der Server** aus `data/products.json` und `site.config.ts` – Manipulationen im Browser haben keine Wirkung.

**Wo sehe ich Bestellungen?** Im Stripe-Dashboard unter **Zahlungen** (mit Bestellnummer, Artikeln, Lieferadresse) und in der Benachrichtigungs-E-Mail.

### Stripe einrichten

1. Kostenloses Konto auf <https://dashboard.stripe.com/register> anlegen. Für echte Zahlungen fragt Stripe Firmendaten, Ausweis und Bankverbindung (IBAN) ab – testen geht sofort.
2. **API-Schlüssel:** Stripe-Dashboard → _Entwickler → API-Schlüssel_. Für Tests die Schlüssel mit `pk_test_…` / `sk_test_…` nehmen, für echte Verkäufe `pk_live_…` / `sk_live_…`.
3. **Zahlungsarten freischalten:** _Einstellungen → Zahlungsmethoden_. Karten, Apple Pay, Google Pay sind meist schon aktiv. Klarna und SEPA-Lastschrift einschalten. **PayPal:** dort „PayPal“ aktivieren und dein (kostenloses) PayPal-Geschäftskonto verbinden.
4. **Apple Pay:** _Einstellungen → Zahlungsmethoden-Domains_ → `happyfoam.org` hinzufügen.
5. **Webhook anlegen:** _Entwickler → Webhooks → Endpunkt hinzufügen_
   - URL: `https://happyfoam.org/api/stripe/webhook`
   - Ereignis: `payment_intent.succeeded`
   - Danach das **Signing Secret** (`whsec_…`) kopieren.
6. **Schlüssel bei Cloudflare hinterlegen** – entweder im Cloudflare-Dashboard (_Workers & Pages → happyfoam-website → Settings → Variables and Secrets_, Typ „Secret“) oder im Projektordner:
   ```bash
   npx wrangler secret put STRIPE_SECRET_KEY        # sk_…
   npx wrangler secret put STRIPE_PUBLISHABLE_KEY   # pk_…
   npx wrangler secret put STRIPE_WEBHOOK_SECRET    # whsec_…
   ```
   Die Kasse liest die Schlüssel zur Laufzeit – ein neues Veröffentlichen ist dafür nicht nötig.
7. **Lokal testen:** dieselben drei Werte (Testschlüssel) in `.env.local` eintragen und `npm run dev` neu starten. Testkarte: `4242 4242 4242 4242`, beliebiges Ablaufdatum in der Zukunft, beliebige Prüfziffer. Im Testmodus zeigt die Kasse oben einen gelben Hinweis.
   Damit lokal auch die Bestellbestätigung ausgelöst wird, die Stripe-Benachrichtigungen an den lokalen Server weiterleiten:
   `npx @stripe/cli listen --api-key sk_test_… --forward-to localhost:3000/api/stripe/webhook` – das dort angezeigte `whsec_…` als `STRIPE_WEBHOOK_SECRET` in `.env.local` eintragen.
   Automatischer Test inkl. Testzahlung: `STRIPE_TEST_PAYMENT=1 BASE_URL=http://localhost:3000 npx playwright test`.
8. **Live gehen:** Konto bei Stripe vollständig verifizieren, die `…_live_…`-Schlüssel und einen Live-Webhook eintragen (Schritte 5 und 6 im Live-Modus wiederholen).

**Bestellbestätigung per E-Mail:** braucht Resend (siehe Abschnitt 4) – sonst werden die E-Mails nur ins Log geschrieben. Zusätzlich kann Stripe eigene Zahlungsbelege schicken: _Einstellungen → Kunden-E-Mails → Erfolgreiche Zahlungen_.

**E-Mail-Vorlage ansehen:** `npm run dev` starten und <http://localhost:3000/api/dev/email-vorschau> öffnen (Text-Fassung: `?typ=text`, Benachrichtigung an dich: `?typ=intern`). Die Vorlage liegt in `src/lib/emails/order-emails.ts`.

**Versandkosten:** in `site.config.ts` unter `shop.shipping` (Kosten je Land, Grenze für kostenlosen Versand). **Die eingetragenen Werte (3,95 € / frei ab 30 €) sind Platzhalter – bitte festlegen.**

**Business-Karton später in den Warenkorb:** In `data/products.json` beim Business-Karton `"purchase": "inquiry"` auf `"purchase": "cart"` ändern.

> **Rechtlich prüfen lassen:** Ablauf und Texte der Kasse sind nach gängiger Praxis gestaltet (Bestellübersicht, Button „Zahlungspflichtig bestellen“, Bestätigung mit AGB und Widerrufsbelehrung). Lass den Bestellprozess trotzdem von deinem Rechtstexte-Anbieter prüfen – viele bieten das als Shop-Check an.

---

## 3. Texte und Produkte ändern

Alle Inhalte liegen in einfachen Textdateien (JSON). Du brauchst nur einen Texteditor (z. B. [VS Code](https://code.visualstudio.com)). **Achtung:** Anführungszeichen `"` und Kommas `,` gehören zur Struktur – nur den Text dazwischen ändern.

| Was                                                                                                                                | Datei                      |
| ---------------------------------------------------------------------------------------------------------------------------------- | -------------------------- |
| Zentrale Einstellungen (Name, Anbieter/Adresse, E-Mail, Social-Links, Kleinunternehmer, Hersteller, Lieferzeit, Funktionen an/aus) | `site.config.ts`           |
| Startseite (Hero, Szenen, Zahlen, Schritte, Claims im Laufband …)                                                                  | `content/de/home.json`     |
| FAQ (`"featured": true` = erscheint auf der Startseite)                                                                            | `content/de/faq.json`      |
| Für Unternehmen (Vorteile, Mengenstaffel, Branchen im Formular)                                                                    | `content/de/business.json` |
| So funktioniert's                                                                                                                  | `content/de/how.json`      |
| Über uns                                                                                                                           | `content/de/about.json`    |
| Produkte: Preise, Verfügbarkeit (`available`), Bilder (`images`), Pflichtangaben                                                   | `data/products.json`       |
| Versandkosten, Bestellnummern-Präfix                                                                                               | `site.config.ts` → `shop`  |
| Rechtstexte (Seiten + Bestell-E-Mail)                                                                                              | `content/de/rechtliches/`  |

**Platzhalter** wie `[SCHAUMDAUER_MIN]` werden auf der Website automatisch **gelb markiert**, damit nichts vergessen wird. Einfach durch den echten Text ersetzen – die Markierung verschwindet dann von selbst.

**Wichtige Schalter in `site.config.ts`:**

- `legal.kleinunternehmer: true` → statt „inkl. MwSt.“ erscheint „Gemäß § 19 UStG wird keine Umsatzsteuer berechnet.“
- `features.shopMode: "waitlist"` → alle Kaufbuttons führen zur Warteliste (Newsletter) statt in den Warenkorb.
- `features.newsletter`, `features.analytics`, `features.cookieBanner` → an/aus.

**Grundpreis:** Sobald die Füllmenge feststeht, bei jedem Produkt in `data/products.json` `"netWeightGrams": 50` (Beispiel) eintragen. Der Grundpreis (je 100 g bzw. je kg) wird dann automatisch berechnet.

**Gefahrenkennzeichnung (CLP):** Falls die Rezeptur als gefährlich eingestuft wird, kann je Produkt ein Feld `clp` mit Signalwort, H- und P-Sätzen gepflegt werden (siehe `src/lib/types.ts`). Standardmäßig leer.

**Englisch vorbereitet:** Alle Texte liegen unter `content/de/`. Für Englisch wird später `content/en/` mit denselben Dateien angelegt und das Routing um eine Sprache erweitert (z. B. mit `next-intl`).

---

## 4. Formulare & Newsletter einrichten

**E-Mails: Kontakt- und B2B-Formular, Bestellbestätigungen (Resend)**

1. Konto bei <https://resend.com> anlegen und die Domain `happyfoam.org` verifizieren. Die DNS-Einträge, die Resend anzeigt, im Cloudflare-Dashboard unter _DNS_ anlegen (die IONOS-Mail-Einträge MX/TXT bleiben unverändert).
2. API-Key erstellen und in `.env.local` eintragen:
   ```
   RESEND_API_KEY=re_...
   CONTACT_EMAIL=hallo@happyfoam.org
   MAIL_FROM=HappyFoam <bestellung@happyfoam.org>
   ```
   Auf Cloudflare: `npx wrangler secret put RESEND_API_KEY` (ebenso `CONTACT_EMAIL`, `MAIL_FROM`).

Beide Formulare haben einen Spamschutz (verstecktes „Honeypot“-Feld) und eine Datenschutz-Checkbox.

**Newsletter / Warteliste (Brevo, mit Double-Opt-in)**

1. Konto bei <https://www.brevo.com> anlegen.
2. Eine Kontaktliste anlegen → deren **ID** notieren.
3. Eine **Double-Opt-in-Vorlage** anlegen (Kampagnen → Vorlagen, Typ „Double opt-in“) → deren **ID** notieren.
4. API-Key erstellen und eintragen:
   ```
   NEWSLETTER_API_KEY=xkeysib-...
   BREVO_LIST_ID=3
   BREVO_DOI_TEMPLATE_ID=7
   ```

Nach der Bestätigung landen Abonnent*innen auf `/newsletter/bestaetigt`. Ein anderer Anbieter lässt sich in `src/lib/newsletter.ts` austauschen.

**Analytics (optional, cookielos):** Plausible-Konto anlegen, `NEXT_PUBLIC_PLAUSIBLE_DOMAIN=happyfoam.org` setzen **und** in `site.config.ts` `features.analytics: true`. In der Datenschutzerklärung erwähnen.

> Diese Dienste sind teilweise kostenpflichtig. Es ist nichts aktiviert, solange keine Schlüssel eingetragen sind. Auf Cloudflare werden die Schlüssel als „Secrets“ hinterlegt (siehe Abschnitt 5).

---

## 5. Veröffentlichen auf Cloudflare & Domain happyfoam.org

Die Website läuft auf **Cloudflare Workers** (über den Adapter [OpenNext](https://opennext.js.org/cloudflare)). Die Domain `happyfoam.org` ist bei IONOS registriert, nutzt aber die **Nameserver von Cloudflare**. Alle DNS-Einträge werden deshalb im Cloudflare-Dashboard gepflegt. E-Mail bleibt bei IONOS: Die **MX**- und **TXT**-Einträge in Cloudflare nie löschen.

**Lokal so testen, wie es auf Cloudflare läuft**

```bash
npm run preview      # baut die Seite und startet sie unter http://localhost:8787
```

**Veröffentlichen**

```bash
npx wrangler login   # einmalig: im Browser mit dem Cloudflare-Konto bestätigen
npm run deploy       # baut die Seite und lädt sie zu Cloudflare hoch
```

**Domain verbinden (einmalig)**

1. Cloudflare-Dashboard → **DNS → Records**: die alten **A**- und **AAAA**-Einträge für `happyfoam.org` (IONOS-Parkseite) und einen eventuellen Eintrag für `www` löschen.
2. **Workers & Pages → happyfoam-website → Settings → Domains & Routes → Add → Custom domain** → `happyfoam.org` eintragen. Danach dasselbe für `www.happyfoam.org`.
3. Cloudflare legt die passenden DNS-Einträge und das SSL-Zertifikat automatisch an. Nach wenigen Minuten läuft die Seite unter https://happyfoam.org.

**Automatisch bei jedem `git push` veröffentlichen (optional)**
Im Worker → **Settings → Builds** das GitHub-Repository verbinden:

- Build-Befehl: `npx opennextjs-cloudflare build`
- Deploy-Befehl: `npx opennextjs-cloudflare deploy`

**Geheime Schlüssel (Stripe, Resend, Brevo …)**
Im Worker → **Settings → Variables and Secrets** eintragen, oder per `npx wrangler secret put RESEND_API_KEY`. Für den lokalen Test kommen sie in die Datei `.dev.vars` (gleiche Namen wie in `.env.example`).

**Kosten**
Der kostenlose Workers-Tarif erlaubt 100.000 Aufrufe pro Tag und 10 ms Rechenzeit pro Aufruf. Die Seiten werden vorab erzeugt und kommen in wenigen Millisekunden aus dem Zwischenspeicher. Falls Formulare oder die Kasse an die Grenze stoßen (Fehler 1102 in den Cloudflare-Logs), auf **Workers Paid** wechseln.

**Technischer Hinweis:** Die Next.js-16-Funktion „Cache Components“ ist abgeschaltet, weil der Cloudflare-Adapter sie noch nicht stabil unterstützt (Stand Oktober 2026). Produktdaten werden beim Veröffentlichen geladen. Nach einer Preisänderung die Seite also neu veröffentlichen (`npm run deploy` oder `git push`).

---

## 6. Rechtstexte einfügen

Die Rechtstexte werden **nicht** selbst geschrieben, sondern von einem Rechtstexte-Dienst bezogen (z. B. IT-Recht Kanzlei, Händlerbund). Sie liegen als einfache Textdateien (Markdown) in `content/de/rechtliches/` und erscheinen **auf der Website und in der Bestellbestätigungs-E-Mail** – du pflegst sie also nur an einer Stelle.

| Datei                                   | Erscheint auf                                                     | Platzhalter         |
| --------------------------------------- | ----------------------------------------------------------------- | ------------------- |
| `content/de/rechtliches/impressum.md`   | /impressum (§ 5 DDG) – Anbieter TRIN (Christoph Hesse)            | –                   |
| `content/de/rechtliches/datenschutz.md` | /datenschutz                                                      | `[DATENSCHUTZ]`     |
| `content/de/rechtliches/agb.md`         | /agb **und** Bestell-E-Mail                                       | `[AGB]`             |
| `content/de/rechtliches/widerruf.md`    | /widerruf **und** Bestell-E-Mail (inkl. Muster-Widerrufsformular) | `[WIDERRUF]`        |
| `content/de/rechtliches/versand.md`     | /versand-und-zahlung (Zusatztext)                                 | `[VERSAND_ZAHLUNG]` |

So geht's: Den Platzhalter in der Datei durch den Text des Anbieters ersetzen (Überschriften mit `##`, Aufzählungen mit `-`, HTML vom Anbieter funktioniert auch). Beim Veröffentlichen wird alles automatisch übernommen. Das gesetzliche Muster-Widerrufsformular ist bereits enthalten – bitte mit der Fassung des Anbieters abgleichen.

**Für die Datenschutzerklärung wichtig:** Die Website wird über Cloudflare ausgeliefert (Hosting/CDN). Auf der Kasse wird Stripe.js geladen (Zahlungsabwicklung durch Stripe, inkl. PayPal/Klarna). E-Mails gehen über Resend, der Newsletter über Brevo. Das muss der Rechtstexte-Anbieter berücksichtigen.

**Bereits technisch berücksichtigt:** Schriften werden lokal ausgeliefert (kein Google-Fonts-Server), keine externen Einbettungen, keine Cookies im Standardbetrieb (der Warenkorb liegt im Browser-Speicher), Cookie-Banner vorbereitet und per Schalter aktivierbar, Newsletter nur mit Double-Opt-in, Datenschutz-Hinweis an allen Formularen, Preisangaben mit MwSt.-/Kleinunternehmer-Hinweis, Grundpreis, Versandkosten-Link und GPSR-Angaben (Hersteller, Sicherheitshinweise, Typbezeichnung, Charge) auf jeder Produktseite.

---

## 7. Offene Platzhalter

| Platzhalter                                                 | Bedeutung                                                              | Fundstelle                                                                                       |
| ----------------------------------------------------------- | ---------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| `[PREIS_POCKET]`                                            | Endpreis Pocket-Box (Plan: 6,99 €)                                     | `data/products.json`                                                                             |
| `[PREIS_VORRAT]`                                            | Endpreis Vorratspack (Plan: 17,99 €)                                   | `data/products.json`                                                                             |
| `[PREIS_B2B]`                                               | Preis Business-Karton (Plan: 60 € netto)                               | `data/products.json`, `content/de/business.json`                                                 |
| `[PREIS_STAFFEL_1]` … `[PREIS_STAFFEL_3]`                   | Mengenstaffel B2B                                                      | `content/de/business.json`                                                                       |
| `[MESSWERT_OHNE_DB]`, `[MESSWERT_MIT_DB]`                   | Gemessene Lautstärke ohne/mit Schaum                                   | `content/de/home.json`, `content/de/how.json`                                                    |
| `[SCHAUMDAUER_MIN]`                                         | Wie lange der Schaum hält                                              | `content/de/faq.json`, `content/de/how.json`                                                     |
| `[INHALTSSTOFFE_FINAL]`                                     | Finale Inhaltsstoffliste                                               | `content/de/home.json`, `content/de/faq.json`, Produktseite (`src/app/produkte/[slug]/page.tsx`) |
| `[ROHR_KLAERGRUBE_TEXT]`, `[URINAL_TEXT]`, `[DUFT_TEXT]`    | FAQ-Antworten nach Labortests                                          | `content/de/faq.json`                                                                            |
| `[SICHERHEITSHINWEISE]`                                     | Warn- und Sicherheitshinweise                                          | `site.config.ts` (`legal.safetyNotes`)                                                           |
| `[TYPBEZEICHNUNG]`, `[CHARGE]`                              | Typ-/Chargenbezeichnung je Produkt                                     | `data/products.json`                                                                             |
| `[FUELLMENGE_G]` / Grundpreis                               | Füllmenge in Gramm → `netWeightGrams`                                  | `data/products.json`                                                                             |
| `[LIEFERZEIT]`                                              | Lieferzeit in Werktagen                                                | `site.config.ts` (`legal.deliveryTime`)                                                          |
| `[VERSANDKOSTEN_DE]`, `[VERSANDKOSTENFREI_AB]`              | Versandkosten (eingetragen: 3,95 € / frei ab 30 € – Platzhalterwerte!) | `site.config.ts` (`shop.shipping`)                                                               |
| `[KOSTEN_PRO_NUTZUNG]`                                      | B2B-Kosten pro Toilettengang                                           | `content/de/business.json`                                                                       |
| `[SOCIAL_LINKS]`                                            | Instagram, TikTok, LinkedIn …                                          | `site.config.ts` (`social`)                                                                      |
| `[GRUENDERSTORY]`                                           | Text „Über uns“                                                        | `content/de/about.json`                                                                          |
| `[GRUENDERFOTO]`                                            | Foto für „Über uns“                                                    | `src/app/ueber-uns/page.tsx`                                                                     |
| `[PRESSEKIT_DOWNLOAD]`                                      | Link zum Pressekit                                                     | `src/app/presse/page.tsx`                                                                        |
| `[DATENSCHUTZ]`, `[AGB]`, `[WIDERRUF]`, `[VERSAND_ZAHLUNG]` | Rechtstexte vom Anbieter                                               | `content/de/rechtliches/*.md` (siehe Abschnitt 6)                                                |
| `[COOKIE_TEXT]`                                             | Text im Cookie-Banner (nur falls aktiviert)                            | `src/components/layout/CookieBanner.tsx`                                                         |

Schnell alle offenen Platzhalter finden:

```bash
grep -rnoE "\[[A-ZÄÖÜ0-9_]{3,}\]" content data site.config.ts src
```

**Hinweis zu den Zahlen auf der Startseite:** Die drei Statistiken stammen aus dem Briefing und wurden mit den verlinkten Quellen abgeglichen. Formulierungen wurden präzisiert: Die QS-Supplies-Studie misst Unwohlsein beim „großen Geschäft“ am Arbeitsplatz, die Toto-Zahl (500.000) ist ein Stand von 2004. Das US-Patent 3,383,710 wurde 1964 angemeldet und 1968 erteilt.

---

## 8. Fehlende Dateien & Assets

| Was                                               | Status                                                            | Wo ersetzen                                                                                                                         |
| ------------------------------------------------- | ----------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| Logo / Wortmarke                                  | **Entwurf** in Bricolage Grotesque, „o“ als lächelnde Schaumblase | `public/brand/happyfoam-logo-entwurf.svg` (wird mit `npm run build:logo` erzeugt), im Code `src/components/brand/Logo.tsx`          |
| Maskottchen (lächelnde Schaumblase)               | Entwurf, frei erfunden                                            | `src/components/brand/Mascot.tsx`, `public/brand/happyfoam-maskottchen.svg`                                                         |
| Produktfotos/Renderings Box & Sachet              | gezeichnete Platzhalter                                           | Fotos nach `public/produkte/` legen und in `data/products.json` unter `images` eintragen – sie ersetzen die Platzhalter automatisch |
| Hörproben „Ohne“ / „Mit HappyFoam“                | synthetische Platzhalter                                          | `public/audio/ohne.mp3`, `public/audio/mit.mp3` (gleiche Dateinamen, 2–4 Sekunden)                                                  |
| Echte Messwerte, Inhaltsstoffe, Herstellerangaben | fehlen                                                            | siehe Platzhalter-Tabelle                                                                                                           |
| Gründerfoto & -story                              | fehlen                                                            | `src/app/ueber-uns/page.tsx`, `content/de/about.json`                                                                               |
| Social-Media-Bilder (Open Graph)                  | werden automatisch im Marken-Look erzeugt                         | `src/lib/og.tsx`                                                                                                                    |

---

## 9. Qualität: Tests, Screenshots, Lighthouse

```bash
npm run lint         # Code-Prüfung (ESLint)
npm run typecheck    # TypeScript
npm run format       # Code formatieren (Prettier)
npm test             # Playwright-Smoke-Tests (baut die Seite und startet sie)
```

Einmalig für die Tests: `npx playwright install chromium`.

Die Tests prüfen auf Handy (390 px) und Desktop (1440 px): Startseite lädt ohne Fehler, Produkt in den Warenkorb, Kontakt-/B2B-/Newsletter-Formular-Validierung, Pflichtangaben auf der Produktseite, 404-Seite und das Easter Egg.

**Screenshots aller Seiten** (Handy + Desktop) liegen in [`docs/screenshots/`](docs/screenshots). Neu erzeugen:

```bash
npm run build && npm start      # in einem Terminal
npm run screenshots             # in einem zweiten Terminal
```

**Lighthouse (mobil, Produktions-Build, Stand Oktober 2026):**

| Seite             | Performance | Barrierefreiheit | Best Practices | SEO |
| ----------------- | ----------- | ---------------- | -------------- | --- |
| Startseite        | 94          | 100              | 100            | 100 |
| Produktseite      | 95          | 100              | 100            | 100 |
| So funktioniert's | 95          | 100              | 100            | 100 |

**Animationen & Barrierefreiheit:** Alle Animationen respektieren die Systemeinstellung „Bewegung reduzieren“ (dann nur Überblendungen, keine Partikel). Ton gibt es nur nach Klick, die Hörproben haben Untertitel und eine Textfassung. Die Blasen im Hintergrund pausieren, wenn sie nicht sichtbar sind.

**Easter Egg:** Fünfmal schnell aufs Logo klicken. 🫧

---

## 10. Projektstruktur

```
site.config.ts            Zentrale Einstellungen
content/de/*.json         Texte (Startseite, FAQ, B2B, So funktioniert's, Über uns)
data/products.json        Produkte (Mock + Pflichtangaben)
public/audio/             Hörproben (Platzhalter)
public/brand/             Logo & Maskottchen (Entwürfe)
src/app/                  Seiten (jede Unterseite = ein Ordner mit page.tsx)
src/app/actions/          Server-Aktionen: Formulare, Kasse
src/components/animations Hero, Blasen, Dezibel-Meter, Sound-Demo, Laufband, Strudel …
src/components/shop/      Warenkorb, Produktkarten, Galerie, Preisangaben
src/components/forms/     Kontakt-, B2B- und Newsletter-Formular
src/lib/                  Produkte, Preise, Stripe, Bestellungen, E-Mail, Newsletter, SEO
src/lib/emails/           Vorlagen für Bestellbestätigung und Benachrichtigung
src/components/checkout/  Kasse, Zahlungsbereich, Bestellübersicht, Bestätigungsseite
src/app/api/stripe/       Stripe-Webhook
content/de/rechtliches/   Rechtstexte als Markdown (Seiten + E-Mails)
tests/                    Playwright-Smoke-Tests
scripts/                  Screenshot- und Logo-Skripte
```
