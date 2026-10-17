import type { ProductColor } from "@/lib/types";
import { productColors } from "./colors";

/** Flaches Einzel-Sachet (Platzhalter-Rendering). */
export function Sachet({
  color = "mint",
  className,
  torn = false,
  width,
  height,
  x,
  y,
}: {
  color?: ProductColor;
  className?: string;
  torn?: boolean;
  /** Nur nötig, wenn das Sachet in ein anderes SVG eingebettet wird */
  width?: number;
  height?: number;
  x?: number;
  y?: number;
}) {
  const c = productColors[color];
  const zig = (y: number, dir: 1 | -1) => {
    let d = `M4 ${y}`;
    for (let x = 4; x < 116; x += 8) d += ` l4 ${dir * 4} l4 ${-dir * 4}`;
    return d;
  };
  return (
    <svg
      viewBox="0 0 120 80"
      className={className}
      x={x}
      y={y}
      width={width}
      height={height}
      aria-hidden="true"
    >
      <rect
        x="4"
        y="6"
        width="112"
        height="68"
        rx="6"
        fill={c.main}
        stroke="#0F1B2D"
        strokeWidth="3"
      />
      {/* Siegelnaht oben/unten */}
      <path d={zig(14, -1)} fill="none" stroke="#0F1B2D" strokeWidth="1.5" opacity="0.35" />
      <path d={zig(66, 1)} fill="none" stroke="#0F1B2D" strokeWidth="1.5" opacity="0.35" />
      {/* Blasen-Muster */}
      <circle cx="96" cy="30" r="9" fill="#FFFFFF" opacity="0.85" />
      <circle cx="84" cy="48" r="5" fill="#FFFFFF" opacity="0.7" />
      <circle cx="102" cy="52" r="3.5" fill="#FFFFFF" opacity="0.7" />
      <text
        x="14"
        y="45"
        fontFamily="var(--font-display), sans-serif"
        fontWeight="800"
        fontSize="15"
        fill="#0F1B2D"
      >
        HappyFoam
      </text>
      {/* Aufreißkerbe */}
      <path d="M4 22 l6 3 l-6 3" fill="#F7F9FC" stroke="#0F1B2D" strokeWidth="1.5" />
      {torn && <path d="M4 18 L116 18" stroke="#F7F9FC" strokeWidth="6" strokeDasharray="6 4" />}
    </svg>
  );
}
