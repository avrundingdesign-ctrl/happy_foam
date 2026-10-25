/**
 * Zentrale Einstellungen für die HappyFoam-Website.
 * Alles, was in eckigen Klammern steht ([…]), ist ein Platzhalter und muss
 * vor dem Livegang ersetzt werden – siehe README, Abschnitt „Offene Platzhalter“.
 */
export const siteConfig = {
  name: "HappyFoam",
  claim: "Dein Geschäft bleibt dein Geschäft.",
  description:
    "HappyFoam ist ein Brausepulver im Sachet: ins Klo streuen, Schaum drauf – Plätschern, Plopp und Spritzer bleiben unter uns.",
  /** Domain der Website. Wird von NEXT_PUBLIC_SITE_URL überschrieben (z. B. für Vorschau-Deployments). */
  url: process.env.NEXT_PUBLIC_SITE_URL || "https://happyfoam.org",
  locale: "de-DE",
  city: "Hamburg",

  /** Anbieter (Impressum, Hersteller-Angaben, E-Mails) – übernommen von trin.studio/impressum.
   *  HappyFoam läuft über das Gewerbe TRIN von Christoph Hesse. */
  company: {
    owner: "Christoph Hesse",
    /** Geschäftsbezeichnung des Gewerbes */
    firm: "TRIN",
    firmUrl: "https://trin.studio",
    brand: "HappyFoam",
    street: "Scheplerstraße 6",
    zip: "22767",
    city: "Hamburg",
    country: "Deutschland",
  },

  contact: {
    /** Öffentliche Kontaktadresse */
    email: "chris@trin.studio",
    /** Telefon optional – leer lassen, wenn nicht gewünscht */
    phone: "",
  },

  /** Social-Links – Platzhalter [SOCIAL_LINKS]. Leere URLs werden ausgeblendet. */
  social: [
    { label: "Instagram", href: "" },
    { label: "TikTok", href: "" },
    { label: "LinkedIn", href: "" },
  ],

  legal: {
    /** true = Kleinunternehmer-Hinweis statt „inkl. MwSt.“ */
    kleinunternehmer: false,
    vatRate: 0.19,
    /** GPSR – Hersteller: Name, Postanschrift, E-Mail (wer unter eigener Marke verkauft, gilt als Hersteller) */
    manufacturer:
      "Christoph Hesse · TRIN, Scheplerstraße 6, 22767 Hamburg, Deutschland · chris@trin.studio",
    safetyNotes: "[SICHERHEITSHINWEISE]",
    /** Lieferzeit-Text für Produktseiten */
    deliveryTime: "Lieferzeit: [LIEFERZEIT] Werktage",
  },

  features: {
    /** "shop" = Warenkorb aktiv · "waitlist" = Buttons führen auf die Warteliste */
    shopMode: "shop" as "shop" | "waitlist",
    newsletter: true,
    /** Cookieloses Analytics (Plausible) – nur aktiv, wenn zusätzlich NEXT_PUBLIC_PLAUSIBLE_DOMAIN gesetzt ist */
    analytics: false,
    /** Cookie-Banner nur nötig, wenn nicht notwendige Cookies/Tracker eingesetzt werden */
    cookieBanner: false,
  },

  shop: {
    currency: "EUR",
    /**
     * Versand – PLATZHALTER-WERTE ([VERSANDKOSTEN_DE], [VERSANDKOSTENFREI_AB]), bitte festlegen.
     * Weitere Länder einfach ergänzen, z. B. { code: "AT", name: "Österreich", cost: 9.9 }.
     */
    shipping: {
      countries: [{ code: "DE", name: "Deutschland", cost: 3.95 }],
      /** Ab diesem Warenwert (Euro) ist der Versand kostenlos. null = nie kostenlos */
      freeFrom: 30 as number | null,
    },
    /** Präfix der Bestellnummern, z. B. HF-261019-7KQ2 */
    orderPrefix: "HF",
    /** Höchstmenge pro Produkt und Bestellung */
    maxQuantity: 99,
  },

  /** Zahlungsarten im Footer – sollten zu den im Stripe-Dashboard aktivierten passen */
  paymentMethods: ["PayPal", "Visa", "Mastercard", "Apple Pay", "Google Pay", "Klarna"],
} as const;

export type SiteConfig = typeof siteConfig;
