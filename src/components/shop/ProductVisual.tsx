import Image from "next/image";
import type { Product } from "@/lib/types";
import { ProductBox, type BoxView } from "@/components/illustrations/ProductBox";
import { cn } from "@/lib/cn";

const bg = { mint: "bg-mint/25", blush: "bg-blush/25", sky: "bg-sky/60", sun: "bg-sun/35" };

/** Zeigt das Produktbild aus data/products.json oder – solange keins da ist – das gezeichnete Platzhalter-Rendering. */
export function ProductVisual({
  product,
  view = "front",
  imageIndex = 0,
  className,
  priority,
  sizes = "(min-width: 1024px) 40vw, 90vw",
  tint = true,
}: {
  product: Product;
  view?: BoxView;
  imageIndex?: number;
  className?: string;
  priority?: boolean;
  sizes?: string;
  /** false = ohne farbige Hintergrundfläche */
  tint?: boolean;
}) {
  const img = product.images[imageIndex];
  return (
    <div
      className={cn(
        "relative flex aspect-square items-center justify-center overflow-hidden rounded-[2rem]",
        tint && bg[product.color],
        className,
      )}
    >
      <span
        className="bubble-deco absolute -top-6 -right-6 h-24 w-24 opacity-70"
        aria-hidden="true"
      />
      <span
        className="bubble-deco absolute bottom-6 left-6 h-10 w-10 opacity-70"
        aria-hidden="true"
      />
      {img ? (
        <Image
          src={img.url}
          alt={img.alt}
          fill
          sizes={sizes}
          className="object-contain p-6"
          priority={priority}
        />
      ) : (
        <>
          <ProductBox
            color={product.color}
            count={product.sachets}
            label={product.title}
            view={view}
            className="relative w-[82%]"
          />
          <span className="sr-only">Platzhalter-Abbildung: {product.title}</span>
        </>
      )}
    </div>
  );
}
