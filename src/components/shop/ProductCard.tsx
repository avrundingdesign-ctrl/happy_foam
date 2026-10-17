import Link from "next/link";
import type { Product } from "@/lib/types";
import { ProductVisual } from "./ProductVisual";
import { PriceBlock } from "./PriceBlock";
import { AddToCart } from "./AddToCart";
import { Sticker } from "@/components/ui/Sticker";

export function ProductCard({ product, priority }: { product: Product; priority?: boolean }) {
  return (
    <article className="group relative flex flex-col rounded-[2.25rem] bg-bubble p-4 shadow-[0_24px_60px_-36px_rgba(15,27,45,0.4)] ring-1 ring-ink/5 transition-transform duration-300 hover:-translate-y-1 md:p-5">
      <Link
        href={`/produkte/${product.handle}`}
        className="block rounded-[2rem]"
        tabIndex={-1}
        aria-hidden="true"
      >
        <ProductVisual
          product={product}
          priority={priority}
          className="transition-transform duration-500 group-hover:scale-[1.02]"
        />
      </Link>
      {product.badge && (
        <Sticker
          tone={product.color === "blush" ? "sun" : "blush"}
          rotate={-5}
          className="absolute top-7 left-7"
        >
          {product.badge}
        </Sticker>
      )}
      <div className="flex flex-1 flex-col gap-3 px-2 pt-5 pb-2">
        <h3 className="font-display text-2xl font-extrabold">
          <Link href={`/produkte/${product.handle}`} className="hover:underline">
            {product.title}
          </Link>
        </h3>
        <p className="text-muted">{product.tagline}</p>
        <PriceBlock product={product} />
        <div className="mt-auto pt-2">
          <AddToCart product={product} />
        </div>
      </div>
    </article>
  );
}
