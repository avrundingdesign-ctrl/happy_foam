import { useId } from "react";
import type { ProductColor } from "@/lib/types";
import { productColors } from "./colors";
import { Sachet } from "./Sachet";

export type BoxView = "front" | "open" | "sachets";

/**
 * Platzhalter-Rendering der Verpackung. Wird ersetzt, sobald echte
 * Produktfotos/Renderings in Shopify hinterlegt sind.
 */
export function ProductBox({
  color = "mint",
  count = 10,
  label = "Pocket-Box",
  view = "front",
  className,
}: {
  color?: ProductColor;
  count?: number;
  label?: string;
  view?: BoxView;
  className?: string;
}) {
  const c = productColors[color];
  const id = useId().replace(/[^a-zA-Z0-9_-]/g, "");

  if (view === "sachets") {
    return (
      <div className={className} aria-hidden="true">
        <div className="relative mx-auto aspect-square w-full">
          <Sachet
            color={color}
            className="absolute top-[18%] left-[8%] w-[62%] -rotate-12 drop-shadow-lg"
          />
          <Sachet
            color={color}
            className="absolute top-[34%] left-[28%] w-[62%] rotate-6 drop-shadow-lg"
          />
          <Sachet
            color={color}
            className="absolute top-[52%] left-[14%] w-[62%] -rotate-3 drop-shadow-xl"
          />
        </div>
      </div>
    );
  }

  return (
    <svg viewBox="0 0 300 300" className={className} aria-hidden="true">
      <defs>
        <pattern id={`${id}-dots`} width="22" height="22" patternUnits="userSpaceOnUse">
          <circle cx="6" cy="6" r="3" fill="#FFFFFF" opacity="0.45" />
          <circle cx="17" cy="16" r="1.8" fill="#FFFFFF" opacity="0.35" />
        </pattern>
      </defs>
      {/* Schatten */}
      <ellipse cx="150" cy="268" rx="110" ry="14" fill="#0F1B2D" opacity="0.08" />
      {view === "open" && (
        <>
          {/* Aufgeklappter Deckel */}
          <path
            d="M94 66 L250 66 L262 14 L106 14 Z"
            fill={c.light}
            stroke="#0F1B2D"
            strokeWidth="4"
            strokeLinejoin="round"
          />
          {/* Sachets schauen heraus */}
          <g transform="rotate(-10 120 70)">
            <Sachet color={color} x={70} y={38} width={110} height={74} />
          </g>
          <g transform="rotate(8 170 70)">
            <Sachet color={color} x={118} y={34} width={110} height={74} />
          </g>
        </>
      )}
      {/* Seitenfläche */}
      <path
        d="M216 86 L250 66 L250 236 L216 256 Z"
        fill={c.dark}
        stroke="#0F1B2D"
        strokeWidth="4"
        strokeLinejoin="round"
      />
      {/* Deckel / Öffnung */}
      {view === "open" ? (
        <path
          d="M60 86 L94 66 L250 66 L216 86 Z"
          fill="none"
          stroke="#0F1B2D"
          strokeWidth="4"
          strokeLinejoin="round"
        />
      ) : (
        <path
          d="M60 86 L94 66 L250 66 L216 86 Z"
          fill={c.light}
          stroke="#0F1B2D"
          strokeWidth="4"
          strokeLinejoin="round"
        />
      )}
      {/* Front */}
      <rect
        x="60"
        y="86"
        width="156"
        height="170"
        rx="6"
        fill={c.main}
        stroke="#0F1B2D"
        strokeWidth="4"
      />
      <rect x="60" y="86" width="156" height="170" rx="6" fill={`url(#${id}-dots)`} />
      {/* Logo-Blase */}
      <circle cx="138" cy="138" r="30" fill="#FFFFFF" stroke="#0F1B2D" strokeWidth="3.5" />
      <ellipse cx="128" cy="126" rx="7" ry="4" fill="#BFE6FF" transform="rotate(-30 128 126)" />
      <circle cx="130" cy="140" r="3.2" fill="#0F1B2D" />
      <circle cx="146" cy="140" r="3.2" fill="#0F1B2D" />
      <path
        d="M128 149 q10 9 20 0"
        fill="none"
        stroke="#0F1B2D"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      <text
        x="138"
        y="196"
        textAnchor="middle"
        fontFamily="var(--font-display), sans-serif"
        fontWeight="800"
        fontSize="22"
        fill="#0F1B2D"
      >
        HappyFoam
      </text>
      <text
        x="138"
        y="216"
        textAnchor="middle"
        fontFamily="var(--font-sans), sans-serif"
        fontWeight="700"
        fontSize="11"
        fill="#0F1B2D"
      >
        {label}
      </text>
      <text
        x="138"
        y="229"
        textAnchor="middle"
        fontFamily="var(--font-sans), sans-serif"
        fontWeight="500"
        fontSize="10"
        fill="#0F1B2D"
      >
        {count.toLocaleString("de-DE")} Sachets
      </text>
      <rect x="72" y="236" width="132" height="15" rx="7.5" fill="#0F1B2D" />
      <text
        x="138"
        y="246.5"
        textAnchor="middle"
        fontFamily="var(--font-sans), sans-serif"
        fontWeight="700"
        fontSize="8.5"
        fill="#FFFFFF"
        letterSpacing="1"
      >
        PSST. SCHAUM DRÜBER.
      </text>
    </svg>
  );
}
