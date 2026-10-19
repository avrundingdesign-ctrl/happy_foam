import { catalog, findProduct } from "./catalog";

/** Alle Produkte (Shop und Anfrage-Produkte). */
export async function getProducts() {
  return catalog;
}

export async function getProduct(handle: string) {
  return findProduct(handle);
}

/** Produkte, die direkt im Warenkorb gekauft werden können. */
export async function getShopProducts() {
  return catalog.filter((p) => p.purchase === "cart");
}
