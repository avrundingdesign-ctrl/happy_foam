import Link from "next/link";
import { basePrice, formatPrice, taxNote } from "@/lib/price";
import type { Product } from "@/lib/types";
import { Placeholder } from "@/components/ui/Rich";
import { cn } from "@/lib/cn";

/** Preis mit allen Pflichtangaben: MwSt./§ 19 UStG, Grundpreis, Versandkosten. */
export function PriceBlock({
  product,
  size = "md",
  className,
}: {
  product: Product;
  size?: "md" | "lg";
  className?: string;
}) {
  if (product.price == null) {
    return (
      <p className={cn("font-display text-2xl font-extrabold", className)}>Preis auf Anfrage</p>
    );
  }
  const bp = basePrice(product.price, product.netWeightGrams);
  return (
    <div className={className}>
      <p className={cn("font-display font-extrabold", size === "lg" ? "text-4xl" : "text-2xl")}>
        {formatPrice(product.price)}
        {product.pricePlaceholder && (
          <span className="ml-2 align-middle text-xs font-normal">
            <Placeholder>{product.pricePlaceholder}</Placeholder>
          </span>
        )}
      </p>
      <p className="mt-1 text-sm text-muted">
        {taxNote(product.priceIsNet)}
        {product.purchase === "cart" && (
          <>
            , zzgl.{" "}
            <Link
              href="/versand-und-zahlung"
              className="underline underline-offset-2 hover:text-ink"
            >
              Versandkosten
            </Link>
          </>
        )}
      </p>
      <p className="text-sm text-muted">
        Grundpreis:{" "}
        {bp ? (
          `${formatPrice(bp.value)} / ${bp.unit}`
        ) : (
          <Placeholder>[GRUNDPREIS – Füllmenge fehlt]</Placeholder>
        )}
      </p>
    </div>
  );
}
