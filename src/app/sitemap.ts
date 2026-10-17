import type { MetadataRoute } from "next";
import { siteConfig } from "@config";
import { getProducts } from "@/lib/products";

const STATIC_ROUTES = [
  "",
  "/shop",
  "/so-funktionierts",
  "/fuer-unternehmen",
  "/faq",
  "/ueber-uns",
  "/kontakt",
  "/presse",
  "/impressum",
  "/datenschutz",
  "/agb",
  "/widerruf",
  "/versand-und-zahlung",
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getProducts();
  return [
    ...STATIC_ROUTES.map((path) => ({
      url: `${siteConfig.url}${path}`,
      changeFrequency: "weekly" as const,
      priority: path === "" ? 1 : 0.7,
    })),
    ...products.map((p) => ({
      url: `${siteConfig.url}/produkte/${p.handle}`,
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  ];
}
