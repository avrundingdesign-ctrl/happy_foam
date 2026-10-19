"use server";

import { priceOrder } from "@/lib/checkout-math";
import {
  validateCustomer,
  type CheckoutAddress,
  type CheckoutCustomer,
} from "@/lib/checkout-validation";
import {
  encodeAddress,
  encodeItems,
  generateOrderNumber,
  orderFromPaymentIntent,
  type Address,
} from "@/lib/order";
import {
  isStripeConfigured,
  stripeMode,
  stripeRequest,
  StripeError,
  type PaymentIntent,
} from "@/lib/stripe";

export type CheckoutSettings = { mode: "live" | "test" | "demo"; publishableKey: string | null };

/** Liefert dem Browser den öffentlichen Stripe-Schlüssel (zur Laufzeit, ohne Neu-Build). */
export async function getCheckoutSettings(): Promise<CheckoutSettings> {
  if (!isStripeConfigured()) return { mode: "demo", publishableKey: null };
  return { mode: stripeMode(), publishableKey: process.env.STRIPE_PUBLISHABLE_KEY ?? null };
}

export type CheckoutInput = CheckoutCustomer & {
  lines: { handle: string; quantity: number }[];
  /** Gesamtbetrag, den der Browser angezeigt hat – muss zum Serverbetrag passen */
  expectedTotalCents: number;
};

export type CheckoutResult =
  | { ok: true; clientSecret: string; orderNumber: string; totalCents: number }
  | {
      ok: false;
      message: string;
      errors?: Record<string, string>;
      demo?: boolean;
      priceChanged?: boolean;
    };

const toAddress = (a: CheckoutAddress): Address => ({
  name: `${a.firstName} ${a.lastName}`,
  line1: a.street,
  line2: a.addressLine2 || undefined,
  postalCode: a.zip,
  city: a.city,
  country: a.country,
});

/**
 * Legt nach Klick auf „Zahlungspflichtig bestellen“ die Zahlung bei Stripe an.
 * Der Betrag wird ausschließlich hier auf dem Server aus dem Katalog berechnet.
 */
export async function createOrderPayment(input: CheckoutInput): Promise<CheckoutResult> {
  const { errors, customer } = validateCustomer(input ?? {});
  const { email, phone, shipping, billing } = customer;

  const lines = Array.isArray(input?.lines) ? input.lines.slice(0, 20) : [];
  const order = priceOrder(lines, shipping.country);
  if (order.lines.length === 0) return { ok: false, message: "Dein Warenkorb ist leer." };
  if (order.rejected.length) {
    return {
      ok: false,
      priceChanged: true,
      message: "Ein Artikel ist nicht mehr verfügbar. Bitte prüfe deinen Warenkorb.",
    };
  }
  if (Object.keys(errors).length) {
    return { ok: false, errors, message: "Bitte prüfe die markierten Felder." };
  }
  if (order.totalCents !== input.expectedTotalCents) {
    return {
      ok: false,
      priceChanged: true,
      message:
        "Die Preise haben sich gerade geändert. Bitte prüfe die aktualisierte Übersicht und bestelle erneut.",
    };
  }

  if (!isStripeConfigured()) {
    return {
      ok: false,
      demo: true,
      message:
        "Demo-Modus: Die Bezahlung ist noch nicht mit Stripe verbunden. Deine Angaben sind gültig – sobald Stripe eingerichtet ist, geht es hier zur Zahlung.",
    };
  }

  const orderNumber = generateOrderNumber();
  const shippingAddress = toAddress(shipping);
  try {
    const pi = await stripeRequest<PaymentIntent>(
      "POST",
      "payment_intents",
      {
        amount: order.totalCents,
        currency: "eur",
        automatic_payment_methods: { enabled: true },
        description: `HappyFoam ${orderNumber}: ${order.lines.map((l) => `${l.quantity}× ${l.title}`).join(", ")}`,
        receipt_email: email,
        shipping: {
          name: shippingAddress.name,
          phone: phone || undefined,
          address: {
            line1: shippingAddress.line1,
            line2: shippingAddress.line2,
            postal_code: shippingAddress.postalCode,
            city: shippingAddress.city,
            country: shippingAddress.country,
          },
        },
        metadata: {
          order_number: orderNumber,
          items: encodeItems(order.lines),
          subtotal_cents: order.subtotalCents,
          shipping_cents: order.shippingCents,
          vat_cents: order.vatCents,
          first_name: shipping.firstName,
          email,
          billing_address: customer.billingDifferent
            ? encodeAddress(toAddress(billing))
            : undefined,
        },
      },
      { idempotencyKey: `pi-${orderNumber}` },
    );
    return { ok: true, clientSecret: pi.client_secret, orderNumber, totalCents: order.totalCents };
  } catch (err) {
    console.error(
      "[checkout] PaymentIntent fehlgeschlagen",
      err instanceof StripeError ? err.message : err,
    );
    return {
      ok: false,
      message:
        "Die Zahlung konnte gerade nicht vorbereitet werden. Bitte versuch es gleich noch einmal.",
    };
  }
}

export type OrderStatusResult =
  | {
      ok: true;
      status: PaymentIntent["status"];
      orderNumber: string;
      firstName: string;
      email: string;
      totalCents: number;
      shippingCents: number;
      lines: { title: string; quantity: number; totalCents: number }[];
      testMode: boolean;
    }
  | { ok: false };

/** Status einer Bestellung für die Bestätigungsseite (abgesichert über das Client-Secret). */
export async function getOrderStatus(
  paymentIntentId: string,
  clientSecret: string,
): Promise<OrderStatusResult> {
  if (
    !isStripeConfigured() ||
    !/^pi_[A-Za-z0-9]+$/.test(paymentIntentId) ||
    typeof clientSecret !== "string"
  ) {
    return { ok: false };
  }
  try {
    const pi = await stripeRequest<PaymentIntent & { livemode: boolean }>(
      "GET",
      `payment_intents/${paymentIntentId}`,
    );
    if (pi.client_secret !== clientSecret) return { ok: false };
    const order = orderFromPaymentIntent(pi);
    return {
      ok: true,
      status: pi.status,
      orderNumber: order.orderNumber,
      firstName: order.firstName,
      email: order.email,
      totalCents: order.totalCents,
      shippingCents: order.shippingCents,
      lines: order.lines.map((l) => ({
        title: l.title,
        quantity: l.quantity,
        totalCents: l.totalCents,
      })),
      testMode: !pi.livemode,
    };
  } catch (err) {
    console.error("[checkout] Status konnte nicht geladen werden", err);
    return { ok: false };
  }
}
