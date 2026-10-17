// Erzeugt public/brand/happyfoam-logo-entwurf.svg als reine Vektorpfade (ohne Schriftabhängigkeit).
// Aufruf: node scripts/build-logo.mjs
import opentype from "opentype.js";
import { readFileSync, writeFileSync } from "node:fs";

const buf = readFileSync("assets/fonts/BricolageGrotesque-ExtraBold.woff");
const font = opentype.parse(buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength));
const size = 100;
const ink = "#0F1B2D";
const mint = "#0A7A60";

let x = 0;
const n = (v) => Number(v.toFixed(2));
// Pfaddaten selbst serialisieren (opentype.js' toPathData rundet in manchen Fällen zu NaN)
const toD = (cmds) =>
  cmds
    .map((c) =>
      c.type === "M" || c.type === "L"
        ? `${c.type}${n(c.x)} ${n(c.y)}`
        : c.type === "Q"
          ? `Q${n(c.x1)} ${n(c.y1)} ${n(c.x)} ${n(c.y)}`
          : c.type === "C"
            ? `C${n(c.x1)} ${n(c.y1)} ${n(c.x2)} ${n(c.y2)} ${n(c.x)} ${n(c.y)}`
            : "Z",
    )
    .join("");
const parts = [];
const scale = size / font.unitsPerEm;
let prev = null;
// Zeichenweise setzen (ohne OpenType-Features), inkl. Kerning
const add = (text, color) => {
  for (const ch of text) {
    const glyph = font.charToGlyph(ch);
    if (prev) x += font.getKerningValue(prev, glyph) * scale;
    const p = glyph.getPath(x, 100, size);
    parts.push(`<path d="${toD(p.commands)}" fill="${color}"/>`);
    x += glyph.advanceWidth * scale;
    prev = glyph;
  }
};
add("Happy", ink);
add("F", mint);
// „o“ als lächelnde Schaumblase
const oWidth = font.charToGlyph("o").advanceWidth * scale;
prev = null;
const r = oWidth * 0.42;
const cx = x + oWidth / 2;
const cy = 100 - r - 1;
parts.push(`<g>
  <circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="${(r - 3.75).toFixed(1)}" fill="#E6F5FF" stroke="${mint}" stroke-width="7.5"/>
  <ellipse cx="${(cx - r * 0.38).toFixed(1)}" cy="${(cy - r * 0.42).toFixed(1)}" rx="${(r * 0.2).toFixed(1)}" ry="${(r * 0.11).toFixed(1)}" fill="#FFFFFF" transform="rotate(-30 ${(cx - r * 0.38).toFixed(1)} ${(cy - r * 0.42).toFixed(1)})"/>
  <circle cx="${(cx - r * 0.28).toFixed(1)}" cy="${(cy - r * 0.02).toFixed(1)}" r="${(r * 0.13).toFixed(1)}" fill="${mint}"/>
  <circle cx="${(cx + r * 0.28).toFixed(1)}" cy="${(cy - r * 0.02).toFixed(1)}" r="${(r * 0.13).toFixed(1)}" fill="${mint}"/>
  <path d="M${(cx - r * 0.33).toFixed(1)} ${(cy + r * 0.28).toFixed(1)} q${(r * 0.33).toFixed(1)} ${(r * 0.3).toFixed(1)} ${(r * 0.66).toFixed(1)} 0" fill="none" stroke="${mint}" stroke-width="6" stroke-linecap="round"/>
</g>`);
x += oWidth;
add("am", mint);

const width = Math.ceil(x) + 8;
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-4 0 ${width} 128" width="${width * 2}" height="256">
  <title>HappyFoam – Wortmarke (Entwurf)</title>
  ${parts.join("\n  ")}
</svg>
`;
writeFileSync("public/brand/happyfoam-logo-entwurf.svg", svg);
console.log("public/brand/happyfoam-logo-entwurf.svg", width);
