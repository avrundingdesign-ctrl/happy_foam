import data from "@data/products.json";
import type { Product } from "./types";

type RawProduct = Omit<(typeof data.products)[number], "images"> & {
  priceIsNet?: boolean;
  images?: { src: string; alt: string; width?: number; height?: number }[];
};

function toProduct(p: RawProduct): Product {
  return {
    handle: p.handle,
    title: p.title,
    tagline: p.tagline,
    description: p.description,
    sachets: p.sachets,
    price: p.price,
    priceIsNet: Boolean(p.priceIsNet),
    pricePlaceholder: p.pricePlaceholder,
    currency: "EUR",
    netWeightGrams: p.netWeightGrams,
    purchase: p.purchase as Product["purchase"],
    badge: p.badge,
    color: p.color as Product["color"],
    typeDesignation: p.typeDesignation,
    batch: p.batch,
    highlights: p.highlights,
    availableForSale: p.available !== false,
    images: (p.images ?? []).map((img) => ({
      url: img.src,
      alt: img.alt,
      width: img.width,
      height: img.height,
    })),
    clp: undefined,
  };
}

/** Der komplette Produktkatalog aus data/products.json (auch im Browser nutzbar). */
export const catalog: Product[] = (data.products as RawProduct[]).map(toProduct);

export function findProduct(handle: string) {
  return catalog.find((p) => p.handle === handle) ?? null;
}
