# HappyFoam – Website & Online-Shop

> **Dein Geschäft bleibt dein Geschäft.**

Die Website für HappyFoam: Startseite mit animierter Produktvorstellung, Shop mit Warenkorb (Shopify), Seite für Unternehmen mit Anfrageformular, „So funktioniert's“, FAQ, Über uns, Kontakt, Presse und alle Rechtsseiten.

Technik: Next.js 16 (App Router) · TypeScript · Tailwind CSS 4 · Motion (Framer Motion) · Shopify Storefront API · Resend · Brevo · Playwright.

![Startseite – Desktop](docs/screenshots/start-desktop.png)

---

## Inhalt

1. [Projekt lokal starten](#1-projekt-lokal-starten)
2. [Shopify verbinden](#2-shopify-verbinden)
3. [Texte und Produkte ändern](#3-texte-und-produkte-ändern)
4. [Formulare & Newsletter einrichten](#4-formulare--newsletter-einrichten)
5. [Auf Vercel veröffentlichen & eigene Domain](#5-auf-vercel-veröffentlichen--eigene-domain)
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

> **Demo-Modus:** Solange in `.env.local` nichts eingetragen ist, zeigt der Shop Beispielprodukte aus `data/products.json`, Formulare werden nicht wirklich verschickt (die Nachricht erscheint nur im Terminal) und „Zur Kasse“ zeigt einen Hinweis statt des Shopify-Checkouts.

---

## 2. Shopify verbinden

Zahlung, Rechnungen, Steuern und Bestellabwicklung laufen über Shopify. Die Website zeigt die Produkte an und schickt den Warenkorb an den Shopify-Checkout.

1. **Shopify-Shop anlegen** (falls noch nicht vorhanden) auf <https://www.shopify.com/de>.
2. **Headless-Kanal installieren:** Im Shopify-Admin → _Vertriebskanäle_ → _+_ → im App Store nach **„Headless“** suchen → installieren.
3. **Storefront anlegen:** _Headless_ öffnen → _Storefront hinzufügen_.
4. **Token kopieren:** In der Storefront unter _Storefront API_ den **öffentlichen Zugriffstoken** („Public access token“) kopieren.
5. **Produkte anlegen** – wichtig ist der **Handle** (steht unter _Produkt → Suchmaschinen-Eintrag → URL_). Er muss genau so heißen wie in `data/products.json`:
   | Produkt                               | Handle            |
   | ------------------------------------- | ----------------- |
   | Pocket-Box                            | `pocket-box`      |
   | Vorratspack                           | `vorratspack`     |
   | Business-Karton (später im Warenkorb) | `business-karton` |
   | Logo-Edition                          | `logo-edition`    |
6. Produkte im Headless-Kanal **verfügbar machen** (Produkt → _Vertriebskanäle_ → Headless anhaken).
7. In `.env.local` eintragen:
   ```
   SHOPIFY_STORE_DOMAIN=dein-shop.myshopify.com
   SHOPIFY_STOREFRONT_ACCESS_TOKEN=der-kopierte-token
   ```
8. Server neu starten (`Strg + C`, dann `npm run dev`).

**Was kommt woher?**

- Aus **Shopify**: Preis, Verfügbarkeit, Produktbilder, Titel, Beschreibung, Varianten-ID für den Warenkorb.
- Aus **`data/products.json`**: Füllmenge (für den Grundpreis), Typbezeichnung, Charge, Highlights, Farbe, Kaufweg (Warenkorb oder Anfrage). Diese Angaben bleiben auch mit Shopify gültig.

**Checkout prüfen (Pflicht in Deutschland):** Der Bestellbutton im Checkout muss **„Zahlungspflichtig bestellen“** heißen. In Shopify unter _Einstellungen → Sprachen_ bzw. im Checkout-Editor prüfen und den Text ggf. anpassen.

**Business-Karton später in den Warenkorb:** In `data/products.json` beim Business-Karton `"purchase": "inquiry"` auf `"purchase": "cart"` ändern.

---

## 3. Texte und Produkte ändern

Alle Inhalte liegen in einfachen Textdateien (JSON). Du brauchst nur einen Texteditor (z. B. [VS Code](https://code.visualstudio.com)). **Achtung:** Anführungszeichen `"` und Kommas `,` gehören zur Struktur – nur den Text dazwischen ändern.

| Was                                                                                                                      | Datei                      |
| ------------------------------------------------------------------------------------------------------------------------ | -------------------------- |
| Zentrale Einstellungen (Name, Domain, E-Mail, Social-Links, Kleinunternehmer, Hersteller, Lieferzeit, Funktionen an/aus) | `site.config.ts`           |
| Startseite (Hero, Szenen, Zahlen, Schritte, Claims im Laufband …)                                                        | `content/de/home.json`     |
| FAQ (`"featured": true` = erscheint auf der Startseite)                                                                  | `content/de/faq.json`      |
| Für Unternehmen (Vorteile, Mengenstaffel, Branchen im Formular)                                                          | `content/de/business.json` |
| So funktioniert's                                                                                                        | `content/de/how.json`      |
| Über uns                                                                                                                 | `content/de/about.json`    |
| Produkte (Mock-Daten + Pflichtangaben)                                                                                   | `data/products.json`       |

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

**Kontakt- und B2B-Formular (Resend)**

1. Konto bei <https://resend.com> anlegen, eigene Domain verifizieren.
2. API-Key erstellen und in `.env.local` eintragen:
   ```
   RESEND_API_KEY=re_...
   CONTACT_EMAIL=hallo@happyfoam.org
   MAIL_FROM=HappyFoam <hallo@happyfoam.org>
   ```

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

> Diese Dienste sind teilweise kostenpflichtig. Es ist nichts aktiviert, solange keine Schlüssel eingetragen sind.

---

## 5. Auf Vercel veröffentlichen & eigene Domain

> **Wichtig:** Der kostenlose Vercel-Tarif „Hobby“ ist nur für **nicht-kommerzielle** Projekte erlaubt. Solange die Seite nur eine Vorschau ist, reicht Hobby. Sobald der Shop verkauft, braucht es den Tarif **Pro** (20 $ pro Monat).

**Website veröffentlichen**

1. Konto bei <https://vercel.com> anlegen (Anmeldung mit GitHub).
2. **Add New → Project** → das Repository `happy_foam` auswählen → **Import**.
3. Unter **Environment Variables** `NEXT_PUBLIC_SITE_URL=https://happyfoam.org` eintragen (später auch Shopify/Resend/Brevo).
4. **Deploy** klicken. Nach 1–2 Minuten ist die Seite unter einer `…vercel.app`-Adresse online.

**Domain `happyfoam.org` (bei IONOS) verbinden**

1. In Vercel im Projekt → **Settings → Domains → Add Domain** → `happyfoam.org` eingeben. Vercel fragt, ob `www.happyfoam.org` dazukommen soll → **ja**, mit Weiterleitung auf `happyfoam.org`.
2. Vercel zeigt jetzt zwei DNS-Einträge an – **genau diese Werte** verwenden:
   | Typ   | Hostname | Wert                                          |
   | ----- | -------- | --------------------------------------------- |
   | A     | `@`      | IP-Adresse aus Vercel (meist `76.76.21.21`)   |
   | CNAME | `www`    | Ziel aus Vercel (z. B. `…vercel-dns-017.com`) |
3. Bei IONOS: **Domains & SSL → happyfoam.org → Reiter „DNS“**.
   - Den vorhandenen **A-Eintrag** für `@` bearbeiten und die Vercel-IP eintragen.
   - Den **AAAA-Eintrag** für `@` **löschen** (sonst landen manche Besucher weiter auf der IONOS-Parkseite).
   - Vorhandene Einträge für `www` löschen und den **CNAME** `www` → Vercel-Ziel anlegen.
   - **MX-** und **TXT-Einträge nicht anfassen** – die braucht später das E-Mail-Postfach.
4. Warten: meist 5–30 Minuten, selten bis 24 Stunden. In Vercel steht dann bei beiden Domains „Valid Configuration“.
5. Das **SSL-Zertifikat** stellt Vercel automatisch und kostenlos aus. Das SSL-Angebot von IONOS wird **nicht** gebraucht.

Jeder `git push` auf `main` veröffentlicht die Seite automatisch neu.

---

## 6. Rechtstexte einfügen

Die Rechtstexte werden **nicht** selbst geschrieben, sondern von einem Rechtstexte-Dienst bezogen (z. B. IT-Recht Kanzlei, Händlerbund). Die Seiten sind angelegt und enthalten einen markierten Kasten, an dessen Stelle der Text kommt:

| Seite                                         | Datei                                  | Platzhalter         |
| --------------------------------------------- | -------------------------------------- | ------------------- |
| Impressum (§ 5 DDG)                           | `src/app/impressum/page.tsx`           | `[IMPRESSUM]`       |
| Datenschutzerklärung                          | `src/app/datenschutz/page.tsx`         | `[DATENSCHUTZ]`     |
| AGB                                           | `src/app/agb/page.tsx`                 | `[AGB]`             |
| Widerrufsbelehrung + Muster-Widerrufsformular | `src/app/widerruf/page.tsx`            | `[WIDERRUF]`        |
| Versand & Zahlung                             | `src/app/versand-und-zahlung/page.tsx` | `[VERSAND_ZAHLUNG]` |

Das gesetzliche Muster-Widerrufsformular ist bereits enthalten – bitte mit der Fassung des Anbieters abgleichen.

**Bereits technisch berücksichtigt:** Schriften werden lokal ausgeliefert (kein Google-Fonts-Server), keine externen Einbettungen, keine Cookies im Standardbetrieb (der Warenkorb liegt im Browser-Speicher), Cookie-Banner vorbereitet und per Schalter aktivierbar, Newsletter nur mit Double-Opt-in, Datenschutz-Hinweis an allen Formularen, Preisangaben mit MwSt.-/Kleinunternehmer-Hinweis, Grundpreis, Versandkosten-Link und GPSR-Angaben (Hersteller, Sicherheitshinweise, Typbezeichnung, Charge) auf jeder Produktseite.

---

## 7. Offene Platzhalter

| Platzhalter                                                                | Bedeutung                                   | Fundstelle                                                                                       |
| -------------------------------------------------------------------------- | ------------------------------------------- | ------------------------------------------------------------------------------------------------ |
| `[PREIS_POCKET]`                                                           | Endpreis Pocket-Box (Plan: 6,99 €)          | `data/products.json`                                                                             |
| `[PREIS_VORRAT]`                                                           | Endpreis Vorratspack (Plan: 17,99 €)        | `data/products.json`                                                                             |
| `[PREIS_B2B]`                                                              | Preis Business-Karton (Plan: 60 € netto)    | `data/products.json`, `content/de/business.json`                                                 |
| `[PREIS_STAFFEL_1]` … `[PREIS_STAFFEL_3]`                                  | Mengenstaffel B2B                           | `content/de/business.json`                                                                       |
| `[MESSWERT_OHNE_DB]`, `[MESSWERT_MIT_DB]`                                  | Gemessene Lautstärke ohne/mit Schaum        | `content/de/home.json`, `content/de/how.json`                                                    |
| `[SCHAUMDAUER_MIN]`                                                        | Wie lange der Schaum hält                   | `content/de/faq.json`, `content/de/how.json`                                                     |
| `[INHALTSSTOFFE_FINAL]`                                                    | Finale Inhaltsstoffliste                    | `content/de/home.json`, `content/de/faq.json`, Produktseite (`src/app/produkte/[slug]/page.tsx`) |
| `[ROHR_KLAERGRUBE_TEXT]`, `[URINAL_TEXT]`, `[DUFT_TEXT]`                   | FAQ-Antworten nach Labortests               | `content/de/faq.json`                                                                            |
| `[HERSTELLER_ANGABEN]`                                                     | Name, Postanschrift, E-Mail (GPSR)          | `site.config.ts` (`legal.manufacturer`), Muster-Widerrufsformular                                |
| `[SICHERHEITSHINWEISE]`                                                    | Warn- und Sicherheitshinweise               | `site.config.ts` (`legal.safetyNotes`)                                                           |
| `[TYPBEZEICHNUNG]`, `[CHARGE]`                                             | Typ-/Chargenbezeichnung je Produkt          | `data/products.json`                                                                             |
| `[FUELLMENGE_G]` / Grundpreis                                              | Füllmenge in Gramm → `netWeightGrams`       | `data/products.json`                                                                             |
| `[LIEFERZEIT]`                                                             | Lieferzeit in Werktagen                     | `site.config.ts` (`legal.deliveryTime`)                                                          |
| `[VERSANDKOSTEN_DE]`, `[VERSANDKOSTENFREI_AB]`                             | Versandkosten                               | `src/app/versand-und-zahlung/page.tsx`                                                           |
| `[KOSTEN_PRO_NUTZUNG]`                                                     | B2B-Kosten pro Toilettengang                | `content/de/business.json`                                                                       |
| `[KONTAKT_EMAIL]`                                                          | Öffentliche Kontaktadresse                  | `site.config.ts` + `CONTACT_EMAIL` in `.env.local`                                               |
| `[SOCIAL_LINKS]`                                                           | Instagram, TikTok, LinkedIn …               | `site.config.ts` (`social`)                                                                      |
| `[GRUENDERSTORY]`                                                          | Text „Über uns“                             | `content/de/about.json`                                                                          |
| `[GRUENDERFOTO]`                                                           | Foto für „Über uns“                         | `src/app/ueber-uns/page.tsx`                                                                     |
| `[PRESSEKONTAKT_NAME]`, `[PRESSEKIT_DOWNLOAD]`                             | Pressekontakt, Link zum Pressekit           | `src/app/presse/page.tsx`                                                                        |
| `[IMPRESSUM]`, `[DATENSCHUTZ]`, `[AGB]`, `[WIDERRUF]`, `[VERSAND_ZAHLUNG]` | Rechtstexte vom Anbieter                    | siehe Abschnitt 6                                                                                |
| `[COOKIE_TEXT]`                                                            | Text im Cookie-Banner (nur falls aktiviert) | `src/components/layout/CookieBanner.tsx`                                                         |

Schnell alle offenen Platzhalter finden:

```bash
grep -rnoE "\[[A-ZÄÖÜ0-9_]{3,}\]" content data site.config.ts src
```

**Hinweis zu den Zahlen auf der Startseite:** Die drei Statistiken stammen aus dem Briefing und wurden mit den verlinkten Quellen abgeglichen. Formulierungen wurden präzisiert: Die QS-Supplies-Studie misst Unwohlsein beim „großen Geschäft“ am Arbeitsplatz, die Toto-Zahl (500.000) ist ein Stand von 2004. Das US-Patent 3,383,710 wurde 1964 angemeldet und 1968 erteilt.

---

## 8. Fehlende Dateien & Assets

| Was                                               | Status                                                            | Wo ersetzen                                                                                                                |
| ------------------------------------------------- | ----------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------- |
| Logo / Wortmarke                                  | **Entwurf** in Bricolage Grotesque, „o“ als lächelnde Schaumblase | `public/brand/happyfoam-logo-entwurf.svg` (wird mit `npm run build:logo` erzeugt), im Code `src/components/brand/Logo.tsx` |
| Maskottchen (lächelnde Schaumblase)               | Entwurf, frei erfunden                                            | `src/components/brand/Mascot.tsx`, `public/brand/happyfoam-maskottchen.svg`                                                |
| Produktfotos/Renderings Box & Sachet              | gezeichnete Platzhalter                                           | echte Bilder einfach in Shopify hochladen – sie ersetzen die Platzhalter automatisch                                       |
| Hörproben „Ohne“ / „Mit HappyFoam“                | synthetische Platzhalter                                          | `public/audio/ohne.mp3`, `public/audio/mit.mp3` (gleiche Dateinamen, 2–4 Sekunden)                                         |
| Echte Messwerte, Inhaltsstoffe, Herstellerangaben | fehlen                                                            | siehe Platzhalter-Tabelle                                                                                                  |
| Gründerfoto & -story                              | fehlen                                                            | `src/app/ueber-uns/page.tsx`, `content/de/about.json`                                                                      |
| Social-Media-Bilder (Open Graph)                  | werden automatisch im Marken-Look erzeugt                         | `src/lib/og.tsx`                                                                                                           |

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
src/app/actions/          Server-Aktionen: Formulare, Checkout
src/components/animations Hero, Blasen, Dezibel-Meter, Sound-Demo, Laufband, Strudel …
src/components/shop/      Warenkorb, Produktkarten, Galerie, Preisangaben
src/components/forms/     Kontakt-, B2B- und Newsletter-Formular
src/lib/                  Shopify, Produkte, Preise, E-Mail, Newsletter, SEO
tests/                    Playwright-Smoke-Tests
scripts/                  Screenshot- und Logo-Skripte
```
