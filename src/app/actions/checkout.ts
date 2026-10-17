"use server";

import { getProducts } from "@/lib/products";
import { isShopifyConfigured, shopifyFetch, CART_CREATE_MUTATION } from "@/lib/shopify";

type CheckoutResult = { ok: true; url: string } | { ok: false; demo?: boolean; message: string };

/**
 * Legt einen Shopify-Warenkorb an und liefert die Checkout-URL.
 * Varianten-IDs werden serverseitig aus den Produktdaten ermittelt –
 * Werte aus dem Browser werden nicht ungeprüft übernommen.
 */
export async function createCheckout(
  lines: { handle: string; quantity: number }[],
): Promise<CheckoutResult> {
  if (!Array.isArray(lines) || lines.length === 0) {
    return { ok: false, message: "Dein Warenkorb ist leer." };
  }
  if (!isShopifyConfigured) {
    return {
      ok: false,
      demo: true,
      message:
        "Demo-Modus: Der Shop ist noch nicht mit Shopify verbunden. Sobald die Zugangsdaten hinterlegt sind, geht es hier zur Kasse.",
    };
  }

  const products = await getProducts();
  const cartLines = [];
  for (const line of lines) {
    const product = products.find((p) => p.handle === line.handle && p.purchase === "cart");
    const quantity = Math.floor(Number(line.quantity));
    if (!product?.variantId || !Number.isFinite(quantity) || quantity < 1 || quantity > 99) {
      return { ok: false, message: "Ein Artikel in deinem Warenkorb ist nicht mehr verfügbar." };
    }
    cartLines.push({ merchandiseId: product.variantId, quantity });
  }

  try {
    const data = await shopifyFetch<{
      cartCreate: { cart: { checkoutUrl: string } | null; userErrors: { message: string }[] };
    }>(CART_CREATE_MUTATION, { input: { lines: cartLines } });
    const url = data.cartCreate.cart?.checkoutUrl;
    if (!url) {
      return {
        ok: false,
        message: data.cartCreate.userErrors[0]?.message ?? "Checkout nicht möglich.",
      };
    }
    return { ok: true, url };
  } catch (err) {
    console.error("[checkout]", err);
    return {
      ok: false,
      message: "Die Kasse ist gerade nicht erreichbar. Bitte versuch es gleich noch einmal.",
    };
  }
}
