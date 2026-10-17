/**
 * Minimaler Shopify-Storefront-API-Client (Headless).
 * Aktiv, sobald SHOPIFY_STORE_DOMAIN und SHOPIFY_STOREFRONT_ACCESS_TOKEN gesetzt sind.
 */
const domain = process.env.SHOPIFY_STORE_DOMAIN;
const token = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN;
const apiVersion = process.env.SHOPIFY_API_VERSION || "2026-07";

export const isShopifyConfigured = Boolean(domain && token);

export async function shopifyFetch<T>(
  query: string,
  variables?: Record<string, unknown>,
): Promise<T> {
  if (!domain || !token) throw new Error("Shopify ist nicht konfiguriert.");
  const res = await fetch(
    `https://${domain.replace(/^https?:\/\//, "")}/api/${apiVersion}/graphql.json`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": token,
      },
      body: JSON.stringify({ query, variables }),
    },
  );
  if (!res.ok) throw new Error(`Shopify-Fehler ${res.status}`);
  const json = (await res.json()) as { data?: T; errors?: { message: string }[] };
  if (json.errors?.length) throw new Error(json.errors.map((e) => e.message).join(", "));
  return json.data as T;
}

export type ShopifyProductNode = {
  handle: string;
  title: string;
  description: string;
  availableForSale: boolean;
  images: { nodes: { url: string; altText: string | null; width: number; height: number }[] };
  variants: {
    nodes: {
      id: string;
      availableForSale: boolean;
      price: { amount: string; currencyCode: string };
    }[];
  };
};

export const PRODUCTS_QUERY = /* GraphQL */ `
  query Products($first: Int!) @inContext(country: DE, language: DE) {
    products(first: $first) {
      nodes {
        handle
        title
        description
        availableForSale
        images(first: 6) {
          nodes {
            url
            altText
            width
            height
          }
        }
        variants(first: 1) {
          nodes {
            id
            availableForSale
            price {
              amount
              currencyCode
            }
          }
        }
      }
    }
  }
`;

export const CART_CREATE_MUTATION = /* GraphQL */ `
  mutation CartCreate($input: CartInput!) @inContext(country: DE, language: DE) {
    cartCreate(input: $input) {
      cart {
        checkoutUrl
      }
      userErrors {
        field
        message
      }
    }
  }
`;
