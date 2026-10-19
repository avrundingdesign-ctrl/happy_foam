// Wandelt content/de/rechtliches/*.md in src/generated/legal.ts um (HTML + Klartext),
// damit Seiten und E-Mails dieselben Rechtstexte nutzen – auch ohne Dateisystem (Cloudflare).
// Aufruf: node scripts/build-legal.mjs  (läuft automatisch vor „npm run dev“ und „npm run build“)
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { marked } from "marked";

const DOCS = ["impressum", "datenschutz", "agb", "widerruf", "versand"];
const PLACEHOLDER = /\[[A-ZÄÖÜ0-9_]{3,}\]/;

const toText = (html) =>
  html
    .replace(/<\/(p|h[1-6]|li|div)>/g, "\n")
    .replace(/<li>/g, "• ")
    .replace(/<br\s*\/?>/g, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

const out = {};
for (const name of DOCS) {
  const md = readFileSync(`content/de/rechtliches/${name}.md`, "utf8");
  // Absätze, die nur aus einem Platzhalter bestehen, werden als markierter Kasten dargestellt
  const html = marked
    .parse(md, { async: false })
    .replace(
      /<p>(\[[A-ZÄÖÜ0-9_]{3,}\])<\/p>/g,
      '<div class="legal-placeholder" data-placeholder="$1"><strong>Hier wird der Rechtstext eingefügt:</strong> <mark>$1</mark></div>',
    )
    // übrige Platzhalter im Fließtext markieren
    .replace(/(?<!data-placeholder="|<mark>)\[[A-ZÄÖÜ0-9_]{3,}\]/g, "<mark>$&</mark>");
  out[name] = { html, text: toText(html), hasPlaceholder: PLACEHOLDER.test(md) };
}

mkdirSync("src/generated", { recursive: true });
writeFileSync(
  "src/generated/legal.ts",
  `// Automatisch erzeugt von scripts/build-legal.mjs aus content/de/rechtliches/*.md – nicht von Hand bearbeiten.\n` +
    `export const legalDocs = ${JSON.stringify(out, null, 2)} as const;\n\n` +
    `export type LegalDocName = keyof typeof legalDocs;\n`,
);
console.log("src/generated/legal.ts aktualisiert:", DOCS.join(", "));
