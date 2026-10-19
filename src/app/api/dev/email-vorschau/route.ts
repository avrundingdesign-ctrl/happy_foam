import { customerConfirmationEmail, ownerNotificationEmail } from "@/lib/emails/order-emails";
import type { OrderSummary } from "@/lib/order";

/**
 * Vorschau der Bestell-E-Mails – nur lokal mit „npm run dev“:
 * http://localhost:3000/api/dev/email-vorschau  (?typ=text bzw. ?typ=intern)
 */
export async function GET(request: Request) {
  if (process.env.NODE_ENV !== "development")
    return new Response("Nicht gefunden", { status: 404 });

  const order: OrderSummary = {
    orderNumber: "HF-261020-7KQ2",
    paymentIntentId: "pi_beispiel",
    status: "succeeded",
    createdAt: new Date(),
    email: "erika@example.com",
    firstName: "Erika",
    shippingAddress: {
      name: "Erika Mustermann",
      line1: "Musterstraße 1",
      postalCode: "20095",
      city: "Hamburg",
      country: "DE",
    },
    billingAddress: null,
    lines: [
      { handle: "pocket-box", title: "Pocket-Box", quantity: 2, unitCents: 699, totalCents: 1398 },
      {
        handle: "vorratspack",
        title: "Vorratspack",
        quantity: 1,
        unitCents: 1799,
        totalCents: 1799,
      },
    ],
    subtotalCents: 3197,
    shippingCents: 0,
    totalCents: 3197,
    vatCents: 510,
    livemode: false,
  };
  order.billingAddress = order.shippingAddress;

  const type = new URL(request.url).searchParams.get("typ");
  if (type === "intern") {
    return new Response(ownerNotificationEmail(order).text, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }
  const mail = customerConfirmationEmail(order);
  if (type === "text") {
    return new Response(mail.text, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
  }
  return new Response(mail.html, { headers: { "Content-Type": "text/html; charset=utf-8" } });
}
