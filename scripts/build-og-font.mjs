// Bettet die Schrift für die Open-Graph-Bilder als Base64 in den Code ein,
// damit die Bilder auch ohne Dateisystem (z. B. auf Cloudflare Workers) erzeugt werden können.
// Aufruf: node scripts/build-og-font.mjs
import { readFileSync, writeFileSync } from "node:fs";

const font = readFileSync("assets/fonts/BricolageGrotesque-ExtraBold.woff").toString("base64");
writeFileSync(
  "src/lib/og-font.ts",
  `// Automatisch erzeugt von scripts/build-og-font.mjs – nicht von Hand bearbeiten.\n// Bricolage Grotesque ExtraBold (SIL Open Font License)\nexport const BRICOLAGE_800_WOFF_BASE64 =\n  "${font}";\n`,
);
console.log("src/lib/og-font.ts", Math.round(font.length / 1024), "KB");
