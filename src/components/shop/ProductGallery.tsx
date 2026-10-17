"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import type { Product } from "@/lib/types";
import type { BoxView } from "@/components/illustrations/ProductBox";
import { ProductVisual } from "./ProductVisual";
import { cn } from "@/lib/cn";

const PLACEHOLDER_VIEWS: { view: BoxView; label: string }[] = [
  { view: "front", label: "Verpackung vorne" },
  { view: "open", label: "Verpackung geöffnet" },
  { view: "sachets", label: "Einzel-Sachets" },
];

/** Produktgalerie: Shopify-Bilder oder gezeichnete Platzhalter-Ansichten. */
export function ProductGallery({ product }: { product: Product }) {
  const slides = product.images.length
    ? product.images.map((img, i) => ({
        key: `img-${i}`,
        label: img.alt,
        imageIndex: i,
        view: "front" as BoxView,
      }))
    : PLACEHOLDER_VIEWS.map((v) => ({ key: v.view, label: v.label, imageIndex: 99, view: v.view }));
  const [active, setActive] = useState(0);
  const current = slides[active];

  return (
    <div>
      <div className="relative">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={current.key}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.25 }}
          >
            <ProductVisual
              product={product}
              view={current.view}
              imageIndex={current.imageIndex}
              priority
            />
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="mt-4 flex gap-3" role="group" aria-label="Produktansichten">
        {slides.map((s, i) => (
          <button
            key={s.key}
            type="button"
            onClick={() => setActive(i)}
            aria-label={s.label}
            aria-pressed={i === active}
            className={cn(
              "w-20 overflow-hidden rounded-2xl ring-2 transition md:w-24",
              i === active ? "ring-ink" : "opacity-70 ring-transparent hover:opacity-100",
            )}
          >
            <ProductVisual
              product={product}
              view={s.view}
              imageIndex={s.imageIndex}
              className="rounded-2xl"
              sizes="96px"
            />
          </button>
        ))}
      </div>
      {!product.images.length && (
        <p className="mt-3 text-xs text-muted">
          Abbildungen sind Platzhalter-Renderings, bis echte Produktfotos vorliegen.
        </p>
      )}
    </div>
  );
}
