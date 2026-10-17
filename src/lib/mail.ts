/**
 * E-Mail-Versand über Resend (https://resend.com) per HTTP-API.
 * Ohne RESEND_API_KEY läuft der Demo-Modus: Die Nachricht wird nur im Server-Log ausgegeben.
 */
export async function sendMail({
  subject,
  text,
  replyTo,
}: {
  subject: string;
  text: string;
  replyTo?: string;
}): Promise<{ ok: boolean; demo?: boolean }> {
  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_EMAIL;
  const from = process.env.MAIL_FROM || "HappyFoam Website <onboarding@resend.dev>";

  if (!apiKey || !to) {
    console.info(
      `[mail:demo] Kein RESEND_API_KEY/CONTACT_EMAIL gesetzt – Nachricht nicht versendet.\nBetreff: ${subject}\n${text}`,
    );
    return { ok: true, demo: true };
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ from, to: [to], subject, text, reply_to: replyTo }),
  });
  if (!res.ok) {
    console.error("[mail] Versand fehlgeschlagen", res.status, await res.text().catch(() => ""));
    return { ok: false };
  }
  return { ok: true };
}
