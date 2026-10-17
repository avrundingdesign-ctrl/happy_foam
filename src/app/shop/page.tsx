import type { Metadata } from "next";
import { getProducts } from "@/lib/products";
import { pageMetadata } from "@/lib/seo";
import { PageHero } from "@/components/ui/PageHero";
import { ProductCard } from "@/components/shop/ProductCard";
import { Reveal } from "@/components/animations/Reveal";
import { Button } from "@/components/ui/Button";
import { Sticker } from "@/components/ui/Sticker";
import { ProductVisual } from "@/components/shop/ProductVisual";

export const metadata: Metadata = pageMetadata({
  title: "Shop",
  description:
    "HappyFoam Pocket-Box und Vorratspack: Brausepulver im Sachet, das Toilettengeräusche unter einer Schaumschicht verschwinden lässt.",
  path: "/shop",
});

export default async function ShopPage() {
  const products = await getProducts();
  const shop = products.filter((p) => p.purchase === "cart");
  const b2b = products.filter((p) => p.purchase === "inquiry");

  return (
    <>
      <PageHero
        eyebrow="Shop"
        title="Ruhe zum Mitnehmen."
        text="Aufreißen, reinstreuen, entspannen. Wähl deine Packungsgröße – wir verschicken diskret und neutral verpackt."
      />

      <section className="container-hf pb-20">
        <div className="grid gap-8 md:grid-cols-2">
          {shop.map((p, i) => (
            <Reveal key={p.handle} delay={i * 0.1}>
              <ProductCard product={p} priority={i === 0} />
            </Reveal>
          ))}
        </div>
      </section>

      <section className="container-hf pb-24">
        <Reveal className="on-dark relative overflow-hidden rounded-[2.5rem] bg-ink p-8 text-bubble md:p-12">
          <Sticker tone="sun" rotate={-4} className="mb-5">
            Für dein Büro?
          </Sticker>
          <h2 className="max-w-2xl font-display text-[clamp(1.8rem,4vw,2.75rem)] leading-tight font-extrabold">
            Business-Karton anfragen – oder gleich mit eigenem Logo.
          </h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {b2b.map((p) => (
              <div
                key={p.handle}
                className="flex items-center gap-4 rounded-3xl bg-bubble/5 p-4 ring-1 ring-bubble/15"
              >
                <ProductVisual
                  product={p}
                  className="h-24 w-24 shrink-0 rounded-2xl"
                  sizes="96px"
                />
                <div>
                  <h3 className="font-display text-xl font-bold">{p.title}</h3>
                  <p className="text-sm text-bubble/75">{p.tagline}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8">
            <Button href="/fuer-unternehmen#anfrage">Angebot anfragen</Button>
          </div>
        </Reveal>
      </section>
    </>
  );
}
