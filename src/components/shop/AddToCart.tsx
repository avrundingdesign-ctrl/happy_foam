"use client";

import { useRef, useState } from "react";
import { siteConfig } from "@config";
import { Button } from "@/components/ui/Button";
import { useCart } from "./CartProvider";
import type { Product } from "@/lib/types";
import { cn } from "@/lib/cn";

/** Mengenwahl + „In den Warenkorb“ mit Flug-Animation zum Warenkorb-Symbol. */
export function AddToCart({
  product,
  withQuantity = true,
  className,
}: {
  product: Product;
  withQuantity?: boolean;
  className?: string;
}) {
  const { add } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const btnRef = useRef<HTMLDivElement>(null);

  if (siteConfig.features.shopMode === "waitlist") {
    return (
      <Button href="/#newsletter" className={className}>
        Auf die Warteliste
      </Button>
    );
  }

  if (product.purchase !== "cart" || product.price == null) {
    return (
      <Button href="/fuer-unternehmen#anfrage" className={className}>
        Angebot anfragen
      </Button>
    );
  }

  const onAdd = () => {
    add(
      {
        handle: product.handle,
        title: product.title,
        price: product.price!,

        color: product.color,
      },
      qty,
      btnRef.current,
    );
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1800);
  };

  return (
    <div className={cn("flex flex-wrap items-center gap-3", className)}>
      {withQuantity && (
        <div
          className="inline-flex h-12 items-center rounded-full bg-bubble ring-2 ring-ink"
          role="group"
          aria-label="Menge wählen"
        >
          <button
            type="button"
            className="h-12 w-11 rounded-full text-lg font-bold hover:bg-sky/50 disabled:opacity-40"
            onClick={() => setQty((q) => Math.max(1, q - 1))}
            disabled={qty <= 1}
            aria-label="Menge verringern"
          >
            −
          </button>
          <label className="sr-only" htmlFor={`qty-${product.handle}`}>
            Menge
          </label>
          <input
            id={`qty-${product.handle}`}
            type="number"
            inputMode="numeric"
            min={1}
            max={99}
            value={qty}
            onChange={(e) => setQty(Math.min(99, Math.max(1, Number(e.target.value) || 1)))}
            className="h-12 w-10 appearance-none bg-transparent text-center font-semibold [-moz-appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
          />
          <button
            type="button"
            className="h-12 w-11 rounded-full text-lg font-bold hover:bg-sky/50"
            onClick={() => setQty((q) => Math.min(99, q + 1))}
            aria-label="Menge erhöhen"
          >
            +
          </button>
        </div>
      )}
      <div ref={btnRef}>
        <Button
          onClick={onAdd}
          size="md"
          disabled={!product.availableForSale}
          data-testid={`add-${product.handle}`}
        >
          {!product.availableForSale ? "Bald wieder da" : added ? "Drin! ✓" : "In den Warenkorb"}
        </Button>
      </div>
      <span className="sr-only" aria-live="polite">
        {added ? `${product.title} wurde in den Warenkorb gelegt.` : ""}
      </span>
    </div>
  );
}
