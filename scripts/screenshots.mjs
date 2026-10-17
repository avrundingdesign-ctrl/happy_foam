// Screenshots aller Seiten (Mobil 390 px + Desktop 1440 px) nach docs/screenshots/
// Voraussetzung: laufender Server (npm run dev oder npm start). Aufruf: npm run screenshots
import { chromium } from "@playwright/test";
import { mkdirSync } from "node:fs";

const BASE = process.env.BASE_URL || "http://localhost:3000";
const OUT = process.env.OUT_DIR || "docs/screenshots";
const ONLY = process.env.ONLY ? process.env.ONLY.split(",") : null;
const ROUTES = [
  ["start", "/"],
  ["shop", "/shop"],
  ["produkt-pocket-box", "/produkte/pocket-box"],
  ["produkt-business-karton", "/produkte/business-karton"],
  ["fuer-unternehmen", "/fuer-unternehmen"],
  ["so-funktionierts", "/so-funktionierts"],
  ["faq", "/faq"],
  ["ueber-uns", "/ueber-uns"],
  ["kontakt", "/kontakt"],
  ["presse", "/presse"],
  ["impressum", "/impressum"],
  ["datenschutz", "/datenschutz"],
  ["agb", "/agb"],
  ["widerruf", "/widerruf"],
  ["versand-und-zahlung", "/versand-und-zahlung"],
  ["404", "/diese-seite-gibt-es-nicht"],
];
const VIEWPORTS = [
  ["mobil", { width: 390, height: 844 }],
  ["desktop", { width: 1440, height: 900 }],
];

mkdirSync(OUT, { recursive: true });
const browser = await chromium.launch();
for (const [vpName, viewport] of VIEWPORTS) {
  const context = await browser.newContext({ viewport, deviceScaleFactor: 1 });
  const page = await context.newPage();
  for (const [name, path] of ROUTES) {
    if (ONLY && !ONLY.includes(name)) continue;
    const errors = [];
    page.removeAllListeners("pageerror");
    page.on("pageerror", (e) => errors.push(String(e)));
    await page.goto(BASE + path, { waitUntil: "networkidle" });
    // Seite stückweise durchscrollen, damit alle Scroll-Animationen auslösen
    await page.evaluate(async () => {
      for (let y = 0; y < document.documentElement.scrollHeight; y += 350) {
        window.scrollTo({ top: y, behavior: "instant" });
        await new Promise((r) => setTimeout(r, 140));
      }
      window.scrollTo({ top: 0, behavior: "instant" });
    });
    await page.waitForTimeout(3800);
    await page.screenshot({ path: `${OUT}/${name}-${vpName}.png`, fullPage: true });
    console.log(`✓ ${name}-${vpName}${errors.length ? "  ⚠ " + errors.join(" | ") : ""}`);
  }
  await context.close();
}
await browser.close();
