import { siteConfig } from "@config";

const eur = new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" });

export function formatPrice(value: number) {
  return eur.format(value);
}

/** Grundpreis nach Preisangabenverordnung: bis 250 g je 100 g, darüber je kg. */
export function basePrice(price: number | null, netWeightGrams: number | null) {
  if (price == null || !netWeightGrams) return null;
  if (netWeightGrams <= 250) {
    return { value: (price / netWeightGrams) * 100, unit: "100 g" };
  }
  return { value: (price / netWeightGrams) * 1000, unit: "kg" };
}

export function taxNote(isNet?: boolean) {
  if (siteConfig.legal.kleinunternehmer) {
    return "Gemäß § 19 UStG wird keine Umsatzsteuer berechnet.";
  }
  return isNet ? "netto zzgl. gesetzl. MwSt." : "inkl. MwSt.";
}
