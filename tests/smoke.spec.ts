import { expect, test } from "@playwright/test";

test.describe("Smoke-Tests", () => {
  test("Startseite lädt ohne JavaScript-Fehler", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    await page.goto("/");
    await expect(page).toHaveTitle(/HappyFoam/);
    await expect(page.getByRole("heading", { level: 1 })).toContainText("Dein Geschäft bleibt");
    await expect(page.getByRole("link", { name: "Jetzt leise werden" })).toBeVisible();
    expect(errors).toEqual([]);
  });

  test("Produkt in den Warenkorb legen", async ({ page }) => {
    await page.goto("/produkte/pocket-box");
    await expect(page.getByRole("heading", { level: 1, name: "Pocket-Box" })).toBeVisible();
    await page.getByRole("button", { name: "Menge erhöhen" }).click();
    await page.getByTestId("add-pocket-box").click();
    const cartButton = page.getByRole("button", { name: /Warenkorb öffnen \(2 Artikel\)/ });
    await expect(cartButton).toBeVisible();
    await cartButton.click();
    const drawer = page.getByRole("dialog", { name: "Dein Warenkorb" });
    await expect(drawer).toBeVisible();
    await expect(drawer.getByRole("link", { name: "Pocket-Box" })).toBeVisible();
    await expect(drawer).toContainText("13,98 €");
    await drawer.getByRole("link", { name: "Zur Kasse" }).click();
    await expect(page).toHaveURL(/\/kasse$/);
    await expect(page.getByRole("heading", { name: "Deine Bestellung" })).toBeVisible();
  });

  test("Kontaktformular validiert Eingaben", async ({ page }) => {
    await page.goto("/kontakt");
    await page.getByRole("button", { name: "Nachricht senden" }).click();
    await expect(page.getByText("Bitte gib eine gültige E-Mail-Adresse an.")).toBeVisible();
    await expect(page.getByText("Bitte bestätige den Datenschutzhinweis.")).toBeVisible();

    await page.getByLabel("Name", { exact: true }).fill("Test Person");
    await page.getByLabel("E-Mail", { exact: true }).fill("test@example.com");
    await page.getByLabel("Nachricht", { exact: true }).fill("Hallo, das ist eine Testnachricht.");
    await page.locator("#privacy-checkbox").check();
    await page.getByRole("button", { name: "Nachricht senden" }).click();
    await expect(page.getByRole("status")).toContainText("Danke!");
  });

  test("B2B-Anfrageformular validiert Pflichtfelder", async ({ page }) => {
    await page.goto("/fuer-unternehmen#anfrage");
    await page.getByRole("button", { name: "Anfrage senden" }).click();
    await expect(page.getByText("Bitte geben Sie Ihr Unternehmen an.")).toBeVisible();
    await expect(page.getByText("Bitte wählen Sie Ihr Interesse.")).toBeVisible();
  });

  test("Newsletter verlangt Einwilligung", async ({ page }) => {
    await page.goto("/");
    const form = page.locator("#newsletter form");
    await form.getByLabel("E-Mail-Adresse").fill("test@example.com");
    await form.getByRole("button", { name: "Leise anmelden" }).click();
    await expect(form.getByText("Bitte bestätige die Einwilligung.")).toBeVisible();
  });

  test("404-Seite", async ({ page }) => {
    const res = await page.goto("/gibt-es-nicht");
    expect(res?.status()).toBe(404);
    await expect(page.getByRole("heading", { level: 1 })).toContainText("runtergespült");
    await page.getByRole("link", { name: "Zurück an die Oberfläche" }).click();
    await expect(page).toHaveURL("/");
  });

  test("Easter Egg: fünfmal aufs Logo", async ({ page }) => {
    await page.goto("/");
    const logo = page.getByRole("link", { name: "HappyFoam – zur Startseite" }).first();
    for (let i = 0; i < 5; i++) await logo.click();
    await expect(page.getByText("Okay, jetzt war's laut.")).toBeVisible();
  });

  test("Pflichtangaben auf der Produktseite", async ({ page }) => {
    await page.goto("/produkte/vorratspack");
    await expect(page.getByText(/inkl\. MwSt\.|§ 19 UStG/).first()).toBeVisible();
    await expect(page.getByText("Grundpreis:").first()).toBeVisible();
    await expect(page.getByText("Außerhalb der Reichweite von Kindern aufbewahren.")).toBeVisible();
    await expect(page.getByRole("link", { name: "Versandkosten" }).first()).toBeVisible();
  });
});
