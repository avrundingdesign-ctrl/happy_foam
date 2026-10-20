import { createHmac } from "node:crypto";
import { expect, test, type Page } from "@playwright/test";

async function addToCartAndOpenCheckout(page: Page) {
  await page.goto("/produkte/pocket-box");
  await page.getByTestId("add-pocket-box").click();
  await expect(page.getByRole("button", { name: /Warenkorb öffnen \(1 Artikel\)/ })).toBeVisible();
  await page.goto("/kasse");
  await expect(page.getByRole("heading", { name: "Deine Bestellung" })).toBeVisible();
}

async function fillAddress(page: Page) {
  await page.fill("#email", "test@example.com");
  await page.fill("#shipping-firstName", "Erika");
  await page.fill("#shipping-lastName", "Mustermann");
  await page.fill("#shipping-street", "Musterstraße 1");
  await page.fill("#shipping-zip", "20095");
  await page.fill("#shipping-city", "Hamburg");
}

test.describe("Kasse", () => {
  test("leere Kasse zeigt Hinweis", async ({ page }) => {
    await page.goto("/kasse");
    await expect(page.getByRole("heading", { name: "Dein Warenkorb ist leer." })).toBeVisible();
  });

  test("Pflichtfelder, Summen und Bestell-Button", async ({ page }) => {
    await addToCartAndOpenCheckout(page);
    await expect(page.getByText("Gesamtsumme")).toBeVisible();
    await expect(page.getByText(/inkl\. \d+ % MwSt\.|§ 19 UStG/)).toBeVisible();
    await expect(page.getByRole("link", { name: "AGB", exact: true }).first()).toBeVisible();

    await page.getByRole("button", { name: "Zahlungspflichtig bestellen" }).click();
    await expect(page.getByText("Bitte gib eine gültige E-Mail-Adresse an.")).toBeVisible();
    await expect(page.getByText("Bitte prüfe die Postleitzahl.")).toBeVisible();

    await fillAddress(page);
    await page.fill("#shipping-zip", "123");
    await page.getByRole("button", { name: "Zahlungspflichtig bestellen" }).click();
    await expect(page.getByText("Bitte prüfe die Postleitzahl.")).toBeVisible();
  });

  test("Bestellung im Demo-Modus (ohne Stripe-Schlüssel)", async ({ page }) => {
    await addToCartAndOpenCheckout(page);
    // Erkennen, ob die Kasse mit Stripe verbunden ist (dann ist dieser Test nicht relevant)
    const demoBox = page.getByText("Demo-Modus: Stripe ist noch nicht verbunden");
    const stripeFrame = page.locator('iframe[title*="Zahlung"]');
    await expect(demoBox.or(stripeFrame)).toBeVisible({ timeout: 20_000 });
    test.skip(await stripeFrame.isVisible(), "Stripe ist verbunden – Demo-Modus nicht aktiv");
    await fillAddress(page);
    await page.getByRole("button", { name: "Zahlungspflichtig bestellen" }).click();
    await expect(page.getByRole("status").filter({ hasText: "Demo-Modus" })).toBeVisible();
  });

  test("Testzahlung mit Karte 4242 (nur mit Stripe-Testschlüsseln)", async ({ page }) => {
    test.skip(
      !process.env.STRIPE_TEST_PAYMENT,
      "STRIPE_TEST_PAYMENT=1 setzen, wenn Stripe-Testschlüssel aktiv sind",
    );
    test.setTimeout(90_000);
    await addToCartAndOpenCheckout(page);
    await fillAddress(page);
    await expect(page.getByText("Testmodus:")).toBeVisible();

    // Kartenfelder liegen in einem Stripe-iFrame
    const frame = page.frameLocator('iframe[title*="Zahlung"], iframe[title*="payment"]').first();
    const card = frame.getByRole("radio", { name: /Karte|Card/ });
    if (await card.isVisible().catch(() => false)) await card.check();
    await frame.locator('input[name="number"]').fill("4242424242424242");
    await frame.locator('input[name="expiry"]').fill("12 / 34");
    await frame.locator('input[name="cvc"]').fill("123");

    await page.getByRole("button", { name: "Zahlungspflichtig bestellen" }).click();
    await expect(page).toHaveURL(/\/bestellung\/abgeschlossen/, { timeout: 60_000 });
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Danke");
    await expect(page.getByText(/HF-\d{6}-[A-Z0-9]{4}/)).toBeVisible();
  });
});

test.describe("Stripe-Webhook", () => {
  test("lehnt Anfragen ohne gültige Signatur ab", async ({ request }) => {
    const res = await request.post("/api/stripe/webhook", {
      data: { type: "payment_intent.succeeded" },
    });
    expect([400, 503]).toContain(res.status());
  });

  test("akzeptiert korrekt signierte Ereignisse", async ({ request }) => {
    const secret = process.env.STRIPE_WEBHOOK_SECRET;
    test.skip(!secret, "STRIPE_WEBHOOK_SECRET muss für Test und Server gleich gesetzt sein");
    const payload = JSON.stringify({
      id: "evt_test",
      type: "ping",
      livemode: false,
      data: { object: {} },
    });
    const t = Math.floor(Date.now() / 1000);
    const sig = createHmac("sha256", secret!).update(`${t}.${payload}`).digest("hex");
    const ok = await request.post("/api/stripe/webhook", {
      data: payload,
      headers: { "Content-Type": "application/json", "Stripe-Signature": `t=${t},v1=${sig}` },
    });
    expect(ok.status()).toBe(200);
    const bad = await request.post("/api/stripe/webhook", {
      data: payload,
      headers: {
        "Content-Type": "application/json",
        "Stripe-Signature": `t=${t},v1=${"0".repeat(64)}`,
      },
    });
    expect(bad.status()).toBe(400);
  });
});
