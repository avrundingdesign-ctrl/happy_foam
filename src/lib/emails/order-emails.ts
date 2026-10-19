import "server-only";
import { siteConfig } from "@config";
import { legalDocs } from "@/generated/legal";
import { countryName, type Address, type OrderSummary } from "@/lib/order";

const eur = new Intl.NumberFormat("de-DE", { style: "currency", currency: "EUR" });
const money = (cents: number) => eur.format(cents / 100);
const date = (d: Date) =>
  d.toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: "Europe/Berlin",
  });

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const C = {
  ink: "#0F1B2D",
  foam: "#F7F9FC",
  mint: "#3DDCB4",
  mintInk: "#0A7A60",
  muted: "#5B6B80",
  sky: "#BFE6FF",
  line: "#E3E8EF",
};

function addressLines(a: Address | null) {
  if (!a) return [];
  return [a.name, a.line1, a.line2, `${a.postalCode} ${a.city}`, countryName(a.country)].filter(
    Boolean,
  ) as string[];
}

function taxLine(order: OrderSummary) {
  return siteConfig.legal.kleinunternehmer
    ? "Gemäß § 19 UStG wird keine Umsatzsteuer berechnet."
    : `Enthaltene MwSt. (${Math.round(siteConfig.legal.vatRate * 100)} %): ${money(order.vatCents)}`;
}

/** Bestellbestätigung für die Kundin / den Kunden (HTML + Text). */
export function customerConfirmationEmail(order: OrderSummary) {
  const site = siteConfig.url;
  const greeting = order.firstName ? `Hallo ${order.firstName},` : "Hallo,";
  const subject = `Deine HappyFoam-Bestellung ${order.orderNumber} 🫧`;

  const itemsText = order.lines
    .map((l) => `${l.quantity} × ${l.title} à ${money(l.unitCents)} = ${money(l.totalCents)}`)
    .join("\n");

  const text = [
    greeting,
    "",
    "danke für deine Bestellung! Psst – wir packen sie diskret ein und schicken sie dir so schnell wie möglich.",
    "",
    `Bestellnummer: ${order.orderNumber}`,
    `Bestelldatum: ${date(order.createdAt)}`,
    "",
    "DEINE BESTELLUNG",
    itemsText,
    "",
    `Zwischensumme: ${money(order.subtotalCents)}`,
    `Versand: ${order.shippingCents === 0 ? "kostenlos" : money(order.shippingCents)}`,
    `Gesamt: ${money(order.totalCents)}`,
    taxLine(order),
    "",
    "LIEFERADRESSE",
    ...addressLines(order.shippingAddress),
    "",
    "RECHNUNGSADRESSE",
    ...addressLines(order.billingAddress),
    "",
    siteConfig.legal.deliveryTime.replace(/\[|\]/g, ""),
    "",
    `Fragen? Antworte einfach auf diese E-Mail oder schreib an ${siteConfig.contact.email}.`,
    "",
    "Schaum drauf, Stress weg.",
    "Dein HappyFoam-Team",
    "",
    "──────────────",
    "ALLGEMEINE GESCHÄFTSBEDINGUNGEN",
    legalDocs.agb.text,
    "",
    "WIDERRUFSBELEHRUNG",
    legalDocs.widerruf.text,
    "",
    `Impressum: ${site}/impressum · Datenschutz: ${site}/datenschutz`,
  ].join("\n");

  const rows = order.lines
    .map(
      (l) => `<tr>
        <td style="padding:12px 0;border-bottom:1px solid ${C.line};font-size:15px;color:${C.ink};">
          <strong>${esc(l.title)}</strong><br>
          <span style="color:${C.muted};font-size:13px;">${l.quantity} × ${money(l.unitCents)}</span>
        </td>
        <td style="padding:12px 0;border-bottom:1px solid ${C.line};text-align:right;font-size:15px;color:${C.ink};white-space:nowrap;">${money(l.totalCents)}</td>
      </tr>`,
    )
    .join("");

  const sum = (label: string, value: string, strong = false) => `<tr>
      <td style="padding:4px 0;font-size:${strong ? 17 : 14}px;color:${strong ? C.ink : C.muted};${strong ? "font-weight:800;" : ""}">${label}</td>
      <td style="padding:4px 0;text-align:right;font-size:${strong ? 17 : 14}px;color:${C.ink};${strong ? "font-weight:800;" : ""}">${value}</td>
    </tr>`;

  const addressBlock = (
    title: string,
    a: Address | null,
  ) => `<td valign="top" style="padding:0 12px 0 0;width:50%;">
      <p style="margin:0 0 6px;font-size:12px;letter-spacing:.08em;text-transform:uppercase;font-weight:700;color:${C.mintInk};">${title}</p>
      <p style="margin:0;font-size:14px;line-height:1.5;color:${C.ink};">${addressLines(a).map(esc).join("<br>")}</p>
    </td>`;

  const legal = (
    title: string,
    html: string,
  ) => `<h3 style="margin:24px 0 8px;font-size:15px;color:${C.ink};">${title}</h3>
    <div style="font-size:12px;line-height:1.55;color:${C.muted};">${html}</div>`;

  const html = `<!doctype html>
<html lang="de"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(subject)}</title></head>
<body style="margin:0;padding:0;background:${C.foam};font-family:Inter,Segoe UI,Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.foam};padding:24px 12px;">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;">
        <tr><td style="padding:8px 4px 20px;font-size:26px;font-weight:800;color:${C.ink};letter-spacing:-.5px;">Happy<span style="color:${C.mintInk};">Foam</span></td></tr>
        <tr><td style="background:#ffffff;border-radius:24px;padding:32px 28px;">
          <p style="margin:0 0 6px;display:inline-block;background:${C.mint};color:${C.ink};font-weight:800;font-size:13px;border-radius:999px;padding:4px 12px;">Bestellung eingegangen</p>
          <h1 style="margin:14px 0 8px;font-size:26px;line-height:1.15;color:${C.ink};">${esc(greeting)} danke für deine Bestellung!</h1>
          <p style="margin:0 0 20px;font-size:15px;line-height:1.6;color:${C.muted};">Psst – wir packen sie diskret ein und schicken sie dir so schnell wie möglich. Hier ist alles auf einen Blick.</p>
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.foam};border-radius:16px;margin-bottom:20px;">
            <tr><td style="padding:14px 16px;font-size:14px;color:${C.ink};">Bestellnummer<br><strong style="font-size:17px;">${esc(order.orderNumber)}</strong></td>
                <td style="padding:14px 16px;font-size:14px;color:${C.ink};text-align:right;">Bestelldatum<br><strong style="font-size:17px;">${date(order.createdAt)}</strong></td></tr>
          </table>
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${rows}</table>
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:12px;">
            ${sum("Zwischensumme", money(order.subtotalCents))}
            ${sum("Versand", order.shippingCents === 0 ? "kostenlos" : money(order.shippingCents))}
            ${sum("Gesamt", money(order.totalCents), true)}
            <tr><td colspan="2" style="padding:2px 0 0;font-size:12px;color:${C.muted};">${esc(taxLine(order))}</td></tr>
            <tr><td colspan="2" style="padding:2px 0 0;font-size:12px;color:${C.muted};">${esc(siteConfig.legal.deliveryTime)}</td></tr>
          </table>
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:24px;">
            <tr>${addressBlock("Lieferadresse", order.shippingAddress)}${addressBlock("Rechnungsadresse", order.billingAddress)}</tr>
          </table>
          <p style="margin:24px 0 0;font-size:14px;line-height:1.6;color:${C.ink};">Fragen? Antworte einfach auf diese E-Mail. Wir melden uns – leise, aber bestimmt.</p>
          <p style="margin:12px 0 0;font-size:14px;color:${C.ink};">Schaum drauf, Stress weg.<br><strong>Dein HappyFoam-Team</strong></p>
        </td></tr>
        <tr><td style="padding:24px 8px 0;">
          ${legal("Allgemeine Geschäftsbedingungen", legalDocs.agb.html)}
          ${legal("Widerrufsbelehrung", legalDocs.widerruf.html)}
          <p style="margin:24px 0 0;font-size:12px;color:${C.muted};">
            <a href="${site}/impressum" style="color:${C.muted};">Impressum</a> ·
            <a href="${site}/datenschutz" style="color:${C.muted};">Datenschutz</a> ·
            Made with Schaum in Hamburg.
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;

  return { subject, text, html };
}

/** Kurze Benachrichtigung an dich: neue Bestellung zum Versenden. */
export function ownerNotificationEmail(order: OrderSummary) {
  const mode = order.livemode ? "" : " [TESTMODUS]";
  const subject = `🫧 Neue Bestellung ${order.orderNumber} – ${money(order.totalCents)}${mode}`;
  const text = [
    `Neue Bestellung${mode}: ${order.orderNumber}`,
    `Datum: ${order.createdAt.toLocaleString("de-DE", { timeZone: "Europe/Berlin" })}`,
    "",
    "ARTIKEL",
    ...order.lines.map((l) => `${l.quantity} × ${l.title} (${money(l.totalCents)})`),
    "",
    `Zwischensumme: ${money(order.subtotalCents)}`,
    `Versand: ${money(order.shippingCents)}`,
    `Gesamt: ${money(order.totalCents)} (bezahlt)`,
    "",
    "VERSAND AN",
    ...addressLines(order.shippingAddress),
    ...(order.phone ? [`Telefon: ${order.phone}`] : []),
    `E-Mail: ${order.email}`,
    "",
    "RECHNUNGSADRESSE",
    ...addressLines(order.billingAddress),
    "",
    `Stripe: https://dashboard.stripe.com/${order.livemode ? "" : "test/"}payments/${order.paymentIntentId}`,
  ].join("\n");
  return { subject, text };
}
