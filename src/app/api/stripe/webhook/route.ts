import { customerConfirmationEmail, ownerNotificationEmail } from "@/lib/emails/order-emails";
import { sendMail } from "@/lib/mail";
import { orderFromPaymentIntent } from "@/lib/order";
import { stripeRequest, verifyStripeSignature, type PaymentIntent } from "@/lib/stripe";

type StripeEvent = {
  id: string;
  type: string;
  livemode: boolean;
  data: { object: PaymentIntent & { livemode: boolean } };
};

/**
 * Stripe-Webhook: https://<domain>/api/stripe/webhook
 * Ereignis „payment_intent.succeeded“ → Bestellbestätigung an Kund*in + Benachrichtigung an dich.
 */
export async function POST(request: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) return new Response("Webhook nicht konfiguriert", { status: 503 });

  const payload = await request.text();
  const valid = await verifyStripeSignature(
    payload,
    request.headers.get("stripe-signature"),
    secret,
  );
  if (!valid) return new Response("Ungültige Signatur", { status: 400 });

  let event: StripeEvent;
  try {
    event = JSON.parse(payload) as StripeEvent;
  } catch {
    return new Response("Ungültiger Inhalt", { status: 400 });
  }

  if (event.type === "payment_intent.succeeded") {
    // Aktuellen Stand holen – Webhooks können mehrfach zugestellt werden
    const pi = await stripeRequest<PaymentIntent & { livemode: boolean }>(
      "GET",
      `payment_intents/${event.data.object.id}`,
    );
    if (pi.metadata?.confirmation_sent === "1") {
      return Response.json({ received: true, duplicate: true });
    }

    const order = orderFromPaymentIntent(pi);
    const customer = customerConfirmationEmail(order);
    const owner = ownerNotificationEmail(order);

    const [toCustomer, toOwner] = await Promise.all([
      order.email
        ? sendMail({
            to: order.email,
            subject: customer.subject,
            text: customer.text,
            html: customer.html,
            replyTo: process.env.CONTACT_EMAIL,
          })
        : Promise.resolve({ ok: false }),
      sendMail({ subject: owner.subject, text: owner.text, replyTo: order.email || undefined }),
    ]);

    if (!toCustomer.ok) {
      // 500 → Stripe stellt das Ereignis später erneut zu
      console.error(`[webhook] Bestätigung für ${order.orderNumber} konnte nicht versendet werden`);
      return new Response("E-Mail-Versand fehlgeschlagen", { status: 500 });
    }
    if (!toOwner.ok)
      console.error(`[webhook] Benachrichtigung für ${order.orderNumber} fehlgeschlagen`);

    await stripeRequest("POST", `payment_intents/${pi.id}`, {
      metadata: { confirmation_sent: "1" },
    });
  }

  return Response.json({ received: true });
}
