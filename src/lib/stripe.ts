import "server-only";

/**
 * Schlanker Stripe-Client über die REST-API (ohne SDK – läuft identisch
 * unter Node.js und auf Cloudflare Workers).
 *
 * Benötigte Umgebungsvariablen:
 * - STRIPE_SECRET_KEY       sk_test_… bzw. sk_live_…
 * - STRIPE_PUBLISHABLE_KEY  pk_test_… bzw. pk_live_…
 * - STRIPE_WEBHOOK_SECRET   whsec_… (für /api/stripe/webhook)
 */

export type StripeMode = "live" | "test" | "demo";

export function stripeMode(): StripeMode {
  const key = process.env.STRIPE_SECRET_KEY ?? "";
  if (key.startsWith("sk_live_") || key.startsWith("rk_live_")) return "live";
  if (key.startsWith("sk_test_") || key.startsWith("rk_test_")) return "test";
  return "demo";
}

export function isStripeConfigured() {
  return stripeMode() !== "demo" && Boolean(process.env.STRIPE_PUBLISHABLE_KEY);
}

export class StripeError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string,
  ) {
    super(message);
  }
}

/** Wandelt verschachtelte Objekte in Stripes Formular-Kodierung um (a[b][c]=…). */
function encode(params: Record<string, unknown>, prefix = ""): string[] {
  const out: string[] = [];
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null) continue;
    const name = prefix ? `${prefix}[${key}]` : key;
    if (Array.isArray(value)) {
      value.forEach((v, i) => {
        if (v !== null && typeof v === "object")
          out.push(...encode(v as Record<string, unknown>, `${name}[${i}]`));
        else out.push(`${encodeURIComponent(`${name}[${i}]`)}=${encodeURIComponent(String(v))}`);
      });
    } else if (typeof value === "object") {
      out.push(...encode(value as Record<string, unknown>, name));
    } else {
      out.push(`${encodeURIComponent(name)}=${encodeURIComponent(String(value))}`);
    }
  }
  return out;
}

export async function stripeRequest<T>(
  method: "GET" | "POST",
  path: string,
  params?: Record<string, unknown>,
  options: { idempotencyKey?: string } = {},
): Promise<T> {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new StripeError("Stripe ist nicht konfiguriert.", 500);

  const body = params ? encode(params).join("&") : undefined;
  const url = `https://api.stripe.com/v1/${path}${method === "GET" && body ? `?${body}` : ""}`;
  const res = await fetch(url, {
    method,
    headers: {
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/x-www-form-urlencoded",
      ...(options.idempotencyKey ? { "Idempotency-Key": options.idempotencyKey } : {}),
    },
    body: method === "POST" ? body : undefined,
    cache: "no-store",
  });
  const json = (await res.json()) as T & { error?: { message: string; code?: string } };
  if (!res.ok || json.error) {
    throw new StripeError(
      json.error?.message ?? `Stripe-Fehler ${res.status}`,
      res.status,
      json.error?.code,
    );
  }
  return json;
}

export type PaymentIntent = {
  id: string;
  object: "payment_intent";
  amount: number;
  currency: string;
  status:
    | "requires_payment_method"
    | "requires_confirmation"
    | "requires_action"
    | "processing"
    | "requires_capture"
    | "canceled"
    | "succeeded";
  client_secret: string;
  receipt_email: string | null;
  description: string | null;
  created: number;
  metadata: Record<string, string>;
  shipping: {
    name: string;
    phone?: string | null;
    address: {
      line1: string;
      line2?: string | null;
      postal_code: string;
      city: string;
      country: string;
    };
  } | null;
  payment_method_types: string[];
  latest_charge?: string | { payment_method_details?: { type?: string } } | null;
};

// --- Webhook-Signatur (HMAC-SHA256, Web Crypto) ------------------------------

const encoder = new TextEncoder();

function toHex(buffer: ArrayBuffer) {
  return [...new Uint8Array(buffer)].map((b) => b.toString(16).padStart(2, "0")).join("");
}

function safeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

/**
 * Prüft den Header „Stripe-Signature“ gegen den Roh-Body.
 * Toleranz: 5 Minuten (Schutz vor wiederholt eingespielten Anfragen).
 */
export async function verifyStripeSignature(
  payload: string,
  header: string | null,
  secret: string,
  toleranceSeconds = 300,
  now = Math.floor(Date.now() / 1000),
): Promise<boolean> {
  if (!header || !secret) return false;
  const parts = header.split(",").map((p) => p.trim().split("="));
  const timestamp = Number(parts.find(([k]) => k === "t")?.[1]);
  const signatures = parts.filter(([k]) => k === "v1").map(([, v]) => v);
  if (!Number.isFinite(timestamp) || signatures.length === 0) return false;
  if (Math.abs(now - timestamp) > toleranceSeconds) return false;

  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const expected = toHex(
    await crypto.subtle.sign("HMAC", key, encoder.encode(`${timestamp}.${payload}`)),
  );
  return signatures.some((sig) => safeEqual(sig, expected));
}
