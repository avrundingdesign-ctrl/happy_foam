"use client";

import { siteConfig } from "@config";
import { formatPrice } from "@/lib/price";
import { toCents } from "@/lib/checkout-math";
import { cn } from "@/lib/cn";

/** „Noch 9,03 € bis zum kostenlosen Versand“ mit Schaum-Fortschrittsbalken. */
export function FreeShippingProgress({
  subtotalCents,
  className,
}: {
  subtotalCents: number;
  className?: string;
}) {
  const freeFrom = siteConfig.shop.shipping.freeFrom;
  if (freeFrom == null) return null;
  const goal = toCents(freeFrom);
  const missing = Math.max(0, goal - subtotalCents);
  const progress = Math.min(1, subtotalCents / goal);
  return (
    <div className={cn("rounded-2xl bg-foam p-3", className)}>
      <p className="text-sm font-semibold">
        {missing === 0 ? (
          <>🎉 Versand ist kostenlos!</>
        ) : (
          <>Noch {formatPrice(missing / 100)} bis zum kostenlosen Versand</>
        )}
      </p>
      <div
        className="mt-2 h-2.5 overflow-hidden rounded-full bg-sky/60"
        role="progressbar"
        aria-label="Fortschritt bis zum kostenlosen Versand"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(progress * 100)}
      >
        <div
          className="h-full w-full origin-left rounded-full bg-mint transition-transform duration-500"
          style={{ transform: `scaleX(${progress})` }}
        />
      </div>
    </div>
  );
}
