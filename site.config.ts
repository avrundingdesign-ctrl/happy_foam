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

  contact: {
    /** Öffentliche Kontaktadresse – Platzhalter [KONTAKT_EMAIL] */
    email: "[KONTAKT_EMAIL]",
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
    /** GPSR – Hersteller: Name, Postanschrift, E-Mail */
    manufacturer: "[HERSTELLER_ANGABEN]",
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

  /** Zahlungsarten-Icons im Footer (sollten zu den in Shopify aktivierten Zahlungsarten passen) */
  paymentMethods: ["PayPal", "Visa", "Mastercard", "Apple Pay", "Google Pay", "Klarna"],
} as const;

export type SiteConfig = typeof siteConfig;
