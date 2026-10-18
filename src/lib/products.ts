import data from "@data/products.json";
import {
  isShopifyConfigured,
  shopifyFetch,
  PRODUCTS_QUERY,
  type ShopifyProductNode,
} from "./shopify";
import type { Product } from "./types";

type LocalProduct = (typeof data.products)[number];

function fromLocal(p: LocalProduct): Product {
  return {
    handle: p.handle,
    title: p.title,
    tagline: p.tagline,
    description: p.description,
    sachets: p.sachets,
    price: p.price,
    priceIsNet: "priceIsNet" in p ? Boolean(p.priceIsNet) : false,
    pricePlaceholder: p.pricePlaceholder,
    currency: "EUR",
    netWeightGrams: p.netWeightGrams,
    purchase: p.purchase as Product["purchase"],
    badge: p.badge,
    color: p.color as Product["color"],
    typeDesignation: p.typeDesignation,
    batch: p.batch,
    highlights: p.highlights,
    variantId: p.shopifyVariantId,
    availableForSale: true,
    images: [],
    clp: undefined,
  };
}

/**
 * Lädt alle Produkte. Mit Shopify-Zugangsdaten kommen Preis, Verfügbarkeit,
 * Varianten-ID und Bilder aus Shopify; Pflichtangaben (Füllmenge, GPSR …)
 * bleiben in data/products.json. Ohne Zugangsdaten: reine Mock-Daten.
 */
export async function getProducts(): Promise<Product[]> {
  const local = data.products.map(fromLocal);
  if (!isShopifyConfigured) return local;

  try {
    const res = await shopifyFetch<{ products: { nodes: ShopifyProductNode[] } }>(PRODUCTS_QUERY, {
      first: 50,
    });
    const byHandle = new Map(res.products.nodes.map((n) => [n.handle, n]));
    return local.map((p) => {
      const node = byHandle.get(p.handle);
      if (!node) return p;
      const variant = node.variants.nodes[0];
      return {
        ...p,
        title: node.title || p.title,
        description: node.description || p.description,
        price: variant ? Number(variant.price.amount) : p.price,
        currency: variant?.price.currencyCode ?? p.currency,
        variantId: variant?.id ?? p.variantId,
        availableForSale: node.availableForSale && (variant?.availableForSale ?? true),
        images: node.images.nodes.map((img) => ({
          url: img.url,
          alt: img.altText || node.title,
          width: img.width,
          height: img.height,
        })),
      };
    });
  } catch (err) {
    console.error("[shopify] Produkte konnten nicht geladen werden – nutze Mock-Daten.", err);
    return local;
  }
}

export async function getProduct(handle: string) {
  const products = await getProducts();
  return products.find((p) => p.handle === handle) ?? null;
}

export async function getShopProducts() {
  return (await getProducts()).filter((p) => p.purchase === "cart");
}
