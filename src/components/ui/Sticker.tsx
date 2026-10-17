import { cn } from "@/lib/cn";
import type { ReactNode } from "react";

/** Leicht gedrehter „Sticker“, z. B. „Psst!“, „Neu“, „Made in Hamburg“. */
export function Sticker({
  children,
  className,
  tone = "sun",
  rotate = -6,
}: {
  children: ReactNode;
  className?: string;
  tone?: "sun" | "blush" | "mint" | "sky" | "ink";
  rotate?: number;
}) {
  const tones = {
    sun: "bg-sun text-ink",
    blush: "bg-blush text-ink",
    mint: "bg-mint text-ink",
    sky: "bg-sky text-ink",
    ink: "bg-ink text-bubble",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border-2 border-ink px-3.5 py-1 font-display text-sm font-extrabold shadow-[3px_3px_0_0_#0F1B2D]",
        tones[tone],
        className,
      )}
      style={{ transform: `rotate(${rotate}deg)` }}
    >
      {children}
    </span>
  );
}
