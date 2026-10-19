import { siteConfig } from "@config";
import { findProduct } from "./catalog";
import type { ProductColor } from "./types";

/** Eine Warenkorb-Position mit Preisen aus dem Katalog (alle Beträge in Cent). */
export type PricedLine = {
  handle: string;
  title: string;
  color: ProductColor;
  quantity: number;
  unitCents: number;
  totalCents: number;
};

export type PricedOrder = {
  lines: PricedLine[];
  subtotalCents: number;
  shippingCents: number;
  totalCents: number;
  /** Enthaltene Umsatzsteuer (0 bei Kleinunternehmer-Regelung) */
  vatCents: number;
  /** Positionen, die nicht (mehr) bestellbar sind */
  rejected: string[];
};

export const toCents = (eur: number) => Math.round(eur * 100);
export const fromCents = (cents: number) => cents / 100;

export function shippingCountries() {
  return siteConfig.shop.shipping.countries;
}

/**
 * Berechnet eine Bestellung ausschließlich aus Katalogdaten – Preise aus dem
 * Browser werden ignoriert. Wird im Browser (Anzeige) und auf dem Server
 * (verbindlicher Betrag für Stripe) identisch verwendet.
 */
export function priceOrder(
  input: { handle: string; quantity: number }[],
  countryCode = "DE",
): PricedOrder {
  const lines: PricedLine[] = [];
  const rejected: string[] = [];
  const max = siteConfig.shop.maxQuantity;

  for (const item of input) {
    const product = findProduct(item.handle);
    const quantity = Math.floor(Number(item.quantity));
    if (
      !product ||
      product.purchase !== "cart" ||
      !product.availableForSale ||
      product.price == null ||
      !Number.isFinite(quantity) ||
      quantity < 1
    ) {
      rejected.push(item.handle);
      continue;
    }
    const unitCents = toCents(product.price);
    const q = Math.min(quantity, max);
    lines.push({
      handle: product.handle,
      title: product.title,
      color: product.color,
      quantity: q,
      unitCents,
      totalCents: unitCents * q,
    });
  }

  const subtotalCents = lines.reduce((sum, l) => sum + l.totalCents, 0);
  const country = siteConfig.shop.shipping.countries.find((c) => c.code === countryCode);
  const freeFrom = siteConfig.shop.shipping.freeFrom;
  const shippingCents =
    lines.length === 0 || !country
      ? 0
      : freeFrom != null && subtotalCents >= toCents(freeFrom)
        ? 0
        : toCents(country.cost);
  const totalCents = subtotalCents + shippingCents;
  const rate = siteConfig.legal.vatRate;
  const vatCents = siteConfig.legal.kleinunternehmer
    ? 0
    : Math.round((totalCents * rate) / (1 + rate));

  return { lines, subtotalCents, shippingCents, totalCents, vatCents, rejected };
}
