import type { Metadata } from "next";
import business from "@content/de/business.json";
import { getProducts } from "@/lib/products";
import { pageMetadata } from "@/lib/seo";
import { Button } from "@/components/ui/Button";
import { Rich } from "@/components/ui/Rich";
import { Sticker } from "@/components/ui/Sticker";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/animations/Reveal";
import { BubbleField } from "@/components/animations/BubbleField";
import { ProductVisual } from "@/components/shop/ProductVisual";
import { InquiryForm } from "@/components/forms/InquiryForm";

export const metadata: Metadata = pageMetadata({
  title: "Für Unternehmen",
  description:
    "HappyFoam für Büro, Hotel und Gastronomie: Business-Karton mit Wandspender oder Sachets mit Ihrem Logo. Jetzt Angebot anfragen.",
  path: "/fuer-unternehmen",
});

const icons = [
  // Team
  <svg key="team" viewBox="0 0 48 48" className="h-12 w-12" aria-hidden="true">
    <circle cx="16" cy="18" r="7" fill="#FFD84D" stroke="#0F1B2D" strokeWidth="3" />
    <circle cx="32" cy="18" r="7" fill="#FF8FB1" stroke="#0F1B2D" strokeWidth="3" />
    <path
      d="M4 40c0-8 6-12 12-12s12 4 12 12M20 40c0-8 6-12 12-12s12 4 12 12"
      fill="none"
      stroke="#0F1B2D"
      strokeWidth="3"
      strokeLinecap="round"
    />
  </svg>,
  // Gast / Stern
  <svg key="guest" viewBox="0 0 48 48" className="h-12 w-12" aria-hidden="true">
    <path
      d="M24 5l5.6 11.4 12.6 1.8-9.1 8.9 2.1 12.5L24 33.7l-11.2 5.9 2.1-12.5-9.1-8.9 12.6-1.8z"
      fill="#3DDCB4"
      stroke="#0F1B2D"
      strokeWidth="3"
      strokeLinejoin="round"
    />
  </svg>,
  // Münze
  <svg key="coin" viewBox="0 0 48 48" className="h-12 w-12" aria-hidden="true">
    <circle cx="24" cy="24" r="18" fill="#FFD84D" stroke="#0F1B2D" strokeWidth="3" />
    <text
      x="24"
      y="31"
      textAnchor="middle"
      fontSize="20"
      fontWeight="800"
      fill="#0F1B2D"
      fontFamily="var(--font-display), sans-serif"
    >
      €
    </text>
  </svg>,
];

export default async function BusinessPage() {
  const products = await getProducts();

  return (
    <>
      <section className="container-hf pt-4">
        <div className="on-dark relative overflow-hidden rounded-[2.5rem] bg-ink px-6 py-14 text-bubble md:rounded-[3rem] md:px-14 md:py-20">
          <BubbleField density={0.7} />
          <div className="relative z-10 grid items-center gap-10 lg:grid-cols-[1.4fr_1fr]">
            <div>
              <p className="eyebrow mb-4 !text-mint">{business.hero.eyebrow}</p>
              <h1 className="font-display text-[clamp(2.5rem,7vw,4.5rem)] leading-[1.02] font-extrabold">
                {business.hero.title}
              </h1>
              <p className="mt-6 max-w-xl text-xl leading-relaxed text-bubble/80">
                {business.hero.subtitle}
              </p>
              <div className="mt-9 flex flex-wrap gap-4">
                <Button href="#anfrage" size="lg">
                  {business.hero.cta}
                </Button>
                <Button href="#produkte" size="lg" variant="secondary">
                  Produkte ansehen
                </Button>
              </div>
            </div>
            <div className="relative hidden lg:block">
              <Sticker
                tone="sun"
                rotate={8}
                className="absolute -top-4 right-4 z-10 px-5 py-2 text-lg"
              >
                Psst!
              </Sticker>
              <div className="rounded-[2.5rem] bg-sky p-2 ring-1 ring-bubble/15">
                {products.find((p) => p.handle === "business-karton") && (
                  <ProductVisual
                    product={products.find((p) => p.handle === "business-karton")!}
                    priority
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Vorteile */}
      <section className="section-y">
        <div className="container-hf">
          <Reveal>
            <SectionHeading eyebrow="Ihre Vorteile" title="Kleine Geste, große Wirkung." />
          </Reveal>
          <ul className="mt-12 grid gap-6 md:grid-cols-3">
            {business.benefits.map((b, i) => (
              <Reveal
                as="li"
                key={b.title}
                delay={i * 0.12}
                className="rounded-[2rem] bg-bubble p-7 ring-1 ring-ink/10"
              >
                {icons[i]}
                <h3 className="mt-5 font-display text-2xl font-extrabold">{b.title}</h3>
                <p className="mt-2 text-lg text-muted">
                  <Rich text={b.text} />
                </p>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* Produkte */}
      <section id="produkte" className="section-y scroll-mt-20 bg-bubble">
        <div className="container-hf">
          <Reveal>
            <SectionHeading eyebrow="Produkte" title="Zwei Wege zu stillen Örtchen." />
          </Reveal>
          <div className="mt-12 grid gap-8 md:grid-cols-2">
            {business.products.map((bp, i) => {
              const product = products.find((p) => p.handle === bp.handle);
              return (
                <Reveal
                  key={bp.handle}
                  delay={i * 0.12}
                  className="flex flex-col rounded-[2.25rem] bg-foam p-5 ring-1 ring-ink/5"
                >
                  {product && <ProductVisual product={product} />}
                  <div className="flex flex-1 flex-col px-2 pt-6 pb-2">
                    <h3 className="font-display text-3xl font-extrabold">{bp.title}</h3>
                    <p className="mt-2 text-lg text-muted">{bp.text}</p>
                    <ul className="mt-4 flex flex-col gap-2">
                      {bp.points.map((pt) => (
                        <li key={pt} className="flex items-center gap-2 font-semibold">
                          <span
                            className="inline-block h-3 w-3 rounded-full bg-mint ring-2 ring-ink"
                            aria-hidden="true"
                          />
                          <Rich text={pt} />
                        </li>
                      ))}
                    </ul>
                    <div className="mt-6">
                      <Button href={`/produkte/${bp.handle}`} variant="secondary">
                        Details ansehen
                      </Button>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* Mengenstaffel */}
      <section className="section-y">
        <div className="container-hf max-w-4xl">
          <Reveal>
            <SectionHeading eyebrow="Preise" title={business.tiers.title} />
            <div className="mt-10 overflow-hidden rounded-[2rem] bg-bubble ring-1 ring-ink/10">
              <table className="w-full text-left">
                <caption className="sr-only">
                  Mengenstaffel Business-Karton und Logo-Edition
                </caption>
                <thead className="bg-ink text-bubble">
                  <tr>
                    <th scope="col" className="px-6 py-4 font-display text-lg">
                      Menge
                    </th>
                    <th scope="col" className="px-6 py-4 text-right font-display text-lg">
                      Preis pro Karton (netto)
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {business.tiers.rows.map((r) => (
                    <tr key={r.qty} className="border-t border-ink/10">
                      <td className="px-6 py-4 font-semibold">{r.qty}</td>
                      <td className="px-6 py-4 text-right">
                        <Rich text={r.price} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-4 text-sm text-muted">{business.tiers.note}</p>
          </Reveal>
        </div>
      </section>

      {/* Anfrage */}
      <section id="anfrage" className="section-y scroll-mt-20 bg-sky/40">
        <div className="container-hf grid gap-12 lg:grid-cols-[1fr_1.5fr]">
          <Reveal>
            <SectionHeading
              eyebrow="Angebot anfragen"
              title="Erzählen Sie uns von Ihren WCs."
              text="Wir melden uns mit einem unverbindlichen Angebot – diskret, versteht sich."
            />
          </Reveal>
          <Reveal
            delay={0.1}
            className="rounded-[2rem] bg-bubble p-6 shadow-[0_30px_60px_-40px_rgba(15,27,45,0.4)] md:p-10"
          >
            <InquiryForm industries={business.industries} />
          </Reveal>
        </div>
      </section>
    </>
  );
}
