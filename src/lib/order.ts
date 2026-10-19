import "server-only";
import { siteConfig } from "@config";
import { findProduct } from "./catalog";
import type { PaymentIntent } from "./stripe";

export type Address = {
  name: string;
  line1: string;
  line2?: string;
  postalCode: string;
  city: string;
  country: string;
};

export type OrderLine = {
  handle: string;
  title: string;
  quantity: number;
  unitCents: number;
  totalCents: number;
};

/** Alles, was zu einer Bestellung gehört – rekonstruiert aus dem Stripe-PaymentIntent. */
export type OrderSummary = {
  orderNumber: string;
  paymentIntentId: string;
  status: PaymentIntent["status"];
  createdAt: Date;
  email: string;
  firstName: string;
  phone?: string;
  shippingAddress: Address | null;
  billingAddress: Address | null;
  lines: OrderLine[];
  subtotalCents: number;
  shippingCents: number;
  totalCents: number;
  vatCents: number;
  livemode: boolean;
};

const ALPHABET = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";

/** Bestellnummer wie HF-261019-7KQ2 (Datum + 4 zufällige, gut lesbare Zeichen). */
export function generateOrderNumber(date = new Date()) {
  const ymd = date.toISOString().slice(2, 10).replace(/-/g, "");
  const bytes = crypto.getRandomValues(new Uint8Array(4));
  const rand = [...bytes].map((b) => ALPHABET[b % ALPHABET.length]).join("");
  return `${siteConfig.shop.orderPrefix}-${ymd}-${rand}`;
}

/** Positionen kompakt für die Stripe-Metadaten: "pocket-box:2:699;vorratspack:1:1799" */
export function encodeItems(lines: { handle: string; quantity: number; unitCents: number }[]) {
  return lines.map((l) => `${l.handle}:${l.quantity}:${l.unitCents}`).join(";");
}

export function decodeItems(value: string | undefined): OrderLine[] {
  if (!value) return [];
  return value
    .split(";")
    .map((part) => {
      const [handle, qty, unit] = part.split(":");
      const quantity = Number(qty);
      const unitCents = Number(unit);
      return {
        handle,
        title: findProduct(handle)?.title ?? handle,
        quantity,
        unitCents,
        totalCents: quantity * unitCents,
      };
    })
    .filter((l) => l.handle && Number.isFinite(l.quantity) && Number.isFinite(l.unitCents));
}

export function encodeAddress(a: Address) {
  return JSON.stringify([a.name, a.line1, a.line2 ?? "", a.postalCode, a.city, a.country]);
}

function decodeAddress(value: string | undefined): Address | null {
  if (!value) return null;
  try {
    const [name, line1, line2, postalCode, city, country] = JSON.parse(value) as string[];
    return { name, line1, line2: line2 || undefined, postalCode, city, country };
  } catch {
    return null;
  }
}

export function orderFromPaymentIntent(pi: PaymentIntent & { livemode?: boolean }): OrderSummary {
  const m = pi.metadata ?? {};
  const shipping = pi.shipping
    ? {
        name: pi.shipping.name,
        line1: pi.shipping.address.line1,
        line2: pi.shipping.address.line2 ?? undefined,
        postalCode: pi.shipping.address.postal_code,
        city: pi.shipping.address.city,
        country: pi.shipping.address.country,
      }
    : null;
  return {
    orderNumber: m.order_number ?? pi.id,
    paymentIntentId: pi.id,
    status: pi.status,
    createdAt: new Date(pi.created * 1000),
    email: pi.receipt_email ?? m.email ?? "",
    firstName: m.first_name ?? "",
    phone: pi.shipping?.phone ?? undefined,
    shippingAddress: shipping,
    billingAddress: decodeAddress(m.billing_address) ?? shipping,
    lines: decodeItems(m.items),
    subtotalCents: Number(m.subtotal_cents ?? 0),
    shippingCents: Number(m.shipping_cents ?? 0),
    totalCents: pi.amount,
    vatCents: Number(m.vat_cents ?? 0),
    livemode: Boolean(pi.livemode),
  };
}

export function countryName(code: string) {
  return siteConfig.shop.shipping.countries.find((c) => c.code === code)?.name ?? code;
}
