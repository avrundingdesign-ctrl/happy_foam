import type { Metadata } from "next";
import about from "@content/de/about.json";
import { pageMetadata } from "@/lib/seo";
import { PageHero } from "@/components/ui/PageHero";
import { Rich } from "@/components/ui/Rich";
import { Sticker } from "@/components/ui/Sticker";
import { Button } from "@/components/ui/Button";
import { Mascot } from "@/components/brand/Mascot";
import { Reveal } from "@/components/animations/Reveal";

export const metadata: Metadata = pageMetadata({
  title: "Über uns",
  description: "HappyFoam ist ein kleines Start-up aus Hamburg. Made with Schaum in Hamburg.",
  path: "/ueber-uns",
});

export default function AboutPage() {
  return (
    <>
      <PageHero eyebrow={about.hero.eyebrow} title={about.hero.title} text={about.hero.subtitle} />

      <section className="container-hf grid gap-10 pb-20 lg:grid-cols-[1fr_1.3fr] lg:items-center">
        <Reveal>
          {/* Foto-Platzhalter */}
          <div className="relative">
            <div
              className="flex aspect-[4/5] flex-col items-center justify-center gap-3 rounded-[2.5rem] border-2 border-dashed border-ink/30 bg-sky/40 p-8 text-center"
              role="img"
              aria-label="Platzhalter für ein Gründerfoto"
            >
              <Mascot mood="happy" className="h-24 w-24" />
              <p className="font-display text-xl font-bold">Hier kommt das Gründerfoto hin.</p>
              <p className="text-sm text-muted">
                [GRUENDERFOTO] – Hochformat 4:5, mind. 1200 px breit
              </p>
            </div>
            <Sticker
              tone="sun"
              rotate={-8}
              className="absolute -top-4 -right-2 px-4 py-2 text-base"
            >
              Made in Hamburg
            </Sticker>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="font-display text-[clamp(2rem,4.5vw,3rem)] leading-tight font-extrabold">
            Wie alles anfing.
          </h2>
          <div className="mt-5 space-y-4 text-lg leading-relaxed">
            <p>
              <Rich text={about.story} />
            </p>
          </div>
        </Reveal>
      </section>

      <section className="section-y bg-bubble">
        <div className="container-hf">
          <h2 className="font-display text-[clamp(2rem,4.5vw,3rem)] font-extrabold">
            Woran wir glauben.
          </h2>
          <ul className="mt-10 grid gap-6 md:grid-cols-3">
            {about.values.map((v, i) => (
              <Reveal as="li" key={v.title} delay={i * 0.12} className="rounded-[2rem] bg-foam p-7">
                <span
                  className="bubble-deco mb-5 block h-12 w-12 ring-2 ring-ink"
                  aria-hidden="true"
                />
                <h3 className="font-display text-2xl font-extrabold">{v.title}</h3>
                <p className="mt-2 text-lg text-muted">{v.text}</p>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <section className="section-y">
        <div className="container-hf text-center">
          <p className="font-display text-[clamp(2rem,5vw,3.5rem)] leading-tight font-extrabold">
            Happy Foam, happy you.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <Button href="/shop" size="lg">
              Zum Shop
            </Button>
            <Button href="/kontakt" size="lg" variant="secondary">
              Sag Hallo
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
