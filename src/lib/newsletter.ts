import "server-only";

/**
 * Newsletter-Anmeldung mit Double-Opt-in über Brevo (austauschbar).
 * Benötigt NEWSLETTER_API_KEY, BREVO_LIST_ID und BREVO_DOI_TEMPLATE_ID.
 * Ohne Schlüssel: Demo-Modus (nur Log-Ausgabe).
 */
export async function subscribe(email: string): Promise<{ ok: boolean; demo?: boolean }> {
  const apiKey = process.env.NEWSLETTER_API_KEY;
  const listId = Number(process.env.BREVO_LIST_ID);
  const templateId = Number(process.env.BREVO_DOI_TEMPLATE_ID);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

  if (!apiKey || !listId || !templateId) {
    console.info(`[newsletter:demo] Anmeldung für ${email} – kein Anbieter konfiguriert.`);
    return { ok: true, demo: true };
  }

  const res = await fetch("https://api.brevo.com/v3/contacts/doubleOptinConfirmation", {
    method: "POST",
    headers: { "api-key": apiKey, "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      email,
      includeListIds: [listId],
      templateId,
      redirectionUrl: `${siteUrl}/newsletter/bestaetigt`,
    }),
  });
  if (!res.ok && res.status !== 204) {
    console.error(
      "[newsletter] Anmeldung fehlgeschlagen",
      res.status,
      await res.text().catch(() => ""),
    );
    return { ok: false };
  }
  return { ok: true };
}
