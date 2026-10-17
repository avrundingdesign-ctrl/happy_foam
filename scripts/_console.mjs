import { chromium } from "@playwright/test";
const routes = [
  "/",
  "/shop",
  "/produkte/pocket-box",
  "/produkte/logo-edition",
  "/fuer-unternehmen",
  "/so-funktionierts",
  "/faq",
  "/ueber-uns",
  "/kontakt",
  "/presse",
  "/impressum",
  "/widerruf",
  "/versand-und-zahlung",
  "/xyz",
];
const b = await chromium.launch();
for (const w of [390, 1440]) {
  const p = await b.newPage({ viewport: { width: w, height: 900 } });
  for (const r of routes) {
    const errs = [];
    p.removeAllListeners("console");
    p.removeAllListeners("pageerror");
    p.on("console", (m) => m.type() === "error" && errs.push(m.text().slice(0, 160)));
    p.on("pageerror", (e) => errs.push(String(e).slice(0, 160)));
    await p.goto("http://localhost:3100" + r, { waitUntil: "networkidle" });
    const overflow = await p.evaluate(
      () => document.documentElement.scrollWidth > window.innerWidth,
    );
    if (errs.length || overflow) console.log(w, r, overflow ? "OVERFLOW" : "", errs.join(" | "));
  }
}
console.log("done");
await b.close();
