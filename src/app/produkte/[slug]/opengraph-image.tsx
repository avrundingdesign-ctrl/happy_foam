import { renderOg, ogSize, ogContentType } from "@/lib/og";
import { getProduct, getProducts } from "@/lib/products";

export const alt = "HappyFoam Produkt";
export const size = ogSize;
export const contentType = ogContentType;

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((p) => ({ slug: p.handle }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProduct(slug);
  return renderOg({
    title: product ? `${product.title}: ${product.tagline}` : "HappyFoam",
    eyebrow: "Shop",
  });
}
