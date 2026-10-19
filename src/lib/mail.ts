import "server-only";

/**
 * E-Mail-Versand über Resend (https://resend.com) per HTTP-API.
 * Ohne RESEND_API_KEY läuft der Demo-Modus: Die Nachricht wird nur im Server-Log ausgegeben.
 *
 * - CONTACT_EMAIL: Empfänger für Formulare und Bestell-Benachrichtigungen
 * - MAIL_FROM:     Absender, muss in Resend verifiziert sein
 */
export async function sendMail({
  to,
  subject,
  text,
  html,
  replyTo,
}: {
  /** Empfänger – Standard: CONTACT_EMAIL (also du selbst) */
  to?: string;
  subject: string;
  text: string;
  html?: string;
  replyTo?: string;
}): Promise<{ ok: boolean; demo?: boolean }> {
  const apiKey = process.env.RESEND_API_KEY;
  const recipient = to ?? process.env.CONTACT_EMAIL;
  const from = process.env.MAIL_FROM || "HappyFoam <onboarding@resend.dev>";

  if (!apiKey || !recipient) {
    console.info(
      `[mail:demo] Kein RESEND_API_KEY/Empfänger – Nachricht nicht versendet.\nAn: ${recipient ?? "–"}\nBetreff: ${subject}\n${text.slice(0, 2000)}`,
    );
    return { ok: true, demo: true };
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from, to: [recipient], subject, text, html, reply_to: replyTo }),
  });
  if (!res.ok) {
    console.error("[mail] Versand fehlgeschlagen", res.status, await res.text().catch(() => ""));
    return { ok: false };
  }
  return { ok: true };
}
