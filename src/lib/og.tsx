import { ImageResponse } from "next/og";
import { BRICOLAGE_800_WOFF_BASE64 } from "./og-font";

export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";

/** Open-Graph-Bild im Marken-Look (Schaumweiß, Minze, Blasen). */
export async function renderOg({
  title,
  eyebrow = "HappyFoam",
}: {
  title: string;
  eyebrow?: string;
}) {
  const font = Buffer.from(BRICOLAGE_800_WOFF_BASE64, "base64");
  const bubbles = [
    { x: 940, y: 60, r: 140 },
    { x: 1080, y: 330, r: 70 },
    { x: 860, y: 420, r: 46 },
    { x: 60, y: 520, r: 60 },
    { x: 1010, y: 520, r: 30 },
  ];
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: 72,
        background: "linear-gradient(135deg, #F7F9FC 0%, #E1F3FF 60%, #C9F5E9 100%)",
        fontFamily: "Bricolage",
        color: "#0F1B2D",
        position: "relative",
      }}
    >
      {bubbles.map((b, i) => (
        <div
          key={i}
          style={{
            position: "absolute",
            left: b.x - b.r,
            top: b.y - b.r,
            width: b.r * 2,
            height: b.r * 2,
            borderRadius: 9999,
            background:
              "radial-gradient(circle at 32% 30%, #FFFFFF 0%, #FFFFFF 14%, rgba(255,255,255,0.7) 15%, rgba(191,230,255,0.9) 100%)",
            border: "3px solid rgba(15,27,45,0.12)",
          }}
        />
      ))}
      <div style={{ display: "flex", alignItems: "center", fontSize: 44 }}>
        <span>Happy</span>
        <span style={{ color: "#0A7A60" }}>Foam</span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", maxWidth: 860 }}>
        <div
          style={{
            display: "flex",
            alignSelf: "flex-start",
            background: "#FFD84D",
            border: "3px solid #0F1B2D",
            borderRadius: 999,
            padding: "6px 22px",
            fontSize: 26,
            marginBottom: 24,
            transform: "rotate(-3deg)",
          }}
        >
          {eyebrow}
        </div>
        <div style={{ fontSize: 76, lineHeight: 1.02, letterSpacing: -2 }}>{title}</div>
      </div>
      <div style={{ display: "flex", fontSize: 26, color: "#5B6B80" }}>
        Made with Schaum in Hamburg.
      </div>
    </div>,
    { ...ogSize, fonts: [{ name: "Bricolage", data: font, weight: 800, style: "normal" }] },
  );
}
