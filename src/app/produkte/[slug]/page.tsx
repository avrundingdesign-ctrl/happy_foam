import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { siteConfig } from "@config";
import { getProduct, getProducts } from "@/lib/products";
import { JsonLd, pageMetadata } from "@/lib/seo";
import { ProductGallery } from "@/components/shop/ProductGallery";
import { PriceBlock } from "@/components/shop/PriceBlock";
import { AddToCart } from "@/components/shop/AddToCart";
import { Reviews } from "@/components/shop/Reviews";
import { Rich } from "@/components/ui/Rich";
import { Sticker } from "@/components/ui/Sticker";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/animations/Reveal";

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((p) => ({ slug: p.handle }));
}

export async function generateMetadata({
  params,
}: PageProps<"/produkte/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return {};
  return pageMetadata({
    title: product.title,
    description: `${product.tagline} ${product.description}`.slice(0, 160),
    path: `/produkte/${slug}`,
  });
}

// Alle Produktseiten werden vorab gerendert (generateStaticParams) und komplett ausgeliefert –
// kein Ladezustand, kein Layout-Sprung.
export const instant = false;

export default async function ProductPage({ params }: PageProps<"/produkte/[slug]">) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();

  const { legal } = siteConfig;
  const clp = product.clp;

  return (
    <>
      {product.price != null && (
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "Product",
            name: `${siteConfig.name} ${product.title}`,
            description: product.description,
            brand: { "@type": "Brand", name: siteConfig.name },
            image: product.images[0]?.url ?? `${siteConfig.url}/opengraph-image`,
            offers: {
              "@type": "Offer",
              url: `${siteConfig.url}/produkte/${product.handle}`,
              priceCurrency: product.currency,
              price: product.price.toFixed(2),
              availability: product.availableForSale
                ? "https://schema.org/InStock"
                : "https://schema.org/OutOfStock",
            },
          }}
        />
      )}

      <nav aria-label="Brotkrumen" className="container-hf pt-6 text-sm text-muted">
        <ol className="flex flex-wrap gap-2">
          <li>
            <Link href="/" className="hover:text-ink hover:underline">
              Start
            </Link>{" "}
            /
          </li>
          <li>
            <Link
              href={product.purchase === "cart" ? "/shop" : "/fuer-unternehmen"}
              className="hover:text-ink hover:underline"
            >
              {product.purchase === "cart" ? "Shop" : "Für Unternehmen"}
            </Link>{" "}
            /
          </li>
          <li aria-current="page" className="font-semibold text-ink">
            {product.title}
          </li>
        </ol>
      </nav>

      <section className="container-hf grid gap-10 pt-6 pb-16 lg:grid-cols-2 lg:gap-16">
        <ProductGallery product={product} />

        <div className="flex flex-col gap-6">
          <div>
            {product.badge && (
              <Sticker tone="blush" rotate={-4} className="mb-4">
                {product.badge}
              </Sticker>
            )}
            <h1 className="font-display text-[clamp(2.4rem,6vw,4rem)] leading-none font-extrabold">
              {product.title}
            </h1>
            <p className="mt-3 text-xl text-muted">{product.tagline}</p>
          </div>

          <PriceBlock product={product} size="lg" />

          <AddToCart product={product} />

          <ul className="flex flex-col gap-1 text-sm text-muted">
            {product.purchase === "cart" && (
              <li>
                🚚 <Rich text={legal.deliveryTime} /> ·{" "}
                <Link href="/versand-und-zahlung" className="underline underline-offset-2">
                  Versand &amp; Zahlung
                </Link>
              </li>
            )}
            <li>📦 Diskret und neutral verpackt</li>
          </ul>

          <p className="text-lg leading-relaxed">{product.description}</p>

          <ul className="grid gap-2 sm:grid-cols-3">
            {product.highlights.map((h) => (
              <li
                key={h}
                className="rounded-2xl bg-bubble px-4 py-3 text-center font-semibold ring-1 ring-ink/10"
              >
                {h}
              </li>
            ))}
          </ul>

          {/* Pflicht- und Sicherheitsangaben */}
          <div className="flex flex-col gap-3">
            <details className="group rounded-3xl bg-bubble ring-1 ring-ink/10" open>
              <summary className="cursor-pointer list-none rounded-3xl px-6 py-4 font-display text-lg font-bold [&::-webkit-details-marker]:hidden">
                Sicherheitshinweise
              </summary>
              <div className="space-y-2 px-6 pb-5">
                <p className="font-semibold">Außerhalb der Reichweite von Kindern aufbewahren.</p>
                <p>
                  <Rich text={legal.safetyNotes} />
                </p>
                {clp && (clp.pictograms.length > 0 || clp.hazardStatements.length > 0) && (
                  <div className="rounded-2xl bg-blush/15 p-4">
                    {clp.signalWord && <p className="font-bold uppercase">{clp.signalWord}</p>}
                    <ul className="mt-2 list-disc pl-5">
                      {clp.hazardStatements.map((h) => (
                        <li key={h}>{h}</li>
                      ))}
                      {clp.precautionaryStatements.map((h) => (
                        <li key={h}>{h}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </details>
            <details className="group rounded-3xl bg-bubble ring-1 ring-ink/10">
              <summary className="cursor-pointer list-none rounded-3xl px-6 py-4 font-display text-lg font-bold [&::-webkit-details-marker]:hidden">
                Produktangaben &amp; Hersteller
              </summary>
              <dl className="grid gap-x-6 gap-y-2 px-6 pb-5 sm:grid-cols-[auto_1fr]">
                <dt className="font-semibold">Typbezeichnung</dt>
                <dd>
                  <Rich text={product.typeDesignation} />
                </dd>
                <dt className="font-semibold">Charge</dt>
                <dd>
                  <Rich text={product.batch} />
                </dd>
                <dt className="font-semibold">Inhalt</dt>
                <dd>
                  {product.sachets} Sachets
                  {product.netWeightGrams ? (
                    ` · ${product.netWeightGrams} g`
                  ) : (
                    <>
                      {" "}
                      · Füllmenge <Rich text="[FUELLMENGE_G]" />
                    </>
                  )}
                </dd>
                <dt className="font-semibold">Inhaltsstoffe</dt>
                <dd>
                  <Rich text="[INHALTSSTOFFE_FINAL]" />
                </dd>
                <dt className="font-semibold">Hersteller</dt>
                <dd>
                  <Rich text={legal.manufacturer} />
                </dd>
              </dl>
            </details>
          </div>
        </div>
      </section>

      <section className="container-hf pb-16">
        <Reviews />
      </section>

      {product.purchase === "cart" && (
        <section className="container-hf pb-24">
          <Reveal className="flex flex-col items-start justify-between gap-6 rounded-[2.5rem] bg-sky/60 p-8 md:flex-row md:items-center md:p-12">
            <div>
              <p className="eyebrow mb-2">Für dein Büro?</p>
              <h2 className="font-display text-3xl font-extrabold">Business-Karton anfragen.</h2>
              <p className="mt-2 text-lg text-ink/80">
                200 Sachets plus Wandspender – für alle WCs im Team.
              </p>
            </div>
            <Button href="/fuer-unternehmen" variant="dark" size="lg">
              Zu den Business-Angeboten
            </Button>
          </Reveal>
        </section>
      )}
    </>
  );
}
