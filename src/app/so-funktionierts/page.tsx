import type { Metadata } from "next";
import how from "@content/de/how.json";
import home from "@content/de/home.json";
import { pageMetadata } from "@/lib/seo";
import { PageHero } from "@/components/ui/PageHero";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Rich } from "@/components/ui/Rich";
import { Button } from "@/components/ui/Button";
import { Sticker } from "@/components/ui/Sticker";
import { Reveal } from "@/components/animations/Reveal";
import { CrossSection } from "@/components/animations/CrossSection";
import { StepFoam, StepSprinkle, StepTear } from "@/components/animations/StepAnimations";
import { DecibelMeter } from "@/components/animations/DecibelMeter";

export const metadata: Metadata = pageMetadata({
  title: "So funktioniert's",
  description:
    "Warum eine Schaumschicht Toilettengeräusche dämpft: Aufprall abfangen, Schall schlucken, Spritzer stoppen. Einfach erklärt.",
  path: "/so-funktionierts",
});

const stepArt = [StepTear, StepSprinkle, StepFoam];

export default function HowPage() {
  return (
    <>
      <PageHero eyebrow={how.hero.eyebrow} title={how.hero.title} text={how.hero.subtitle} />

      <section className="container-hf pb-20">
        <ol className="grid gap-6 md:grid-cols-3">
          {how.explain.map((e, i) => (
            <Reveal
              as="li"
              key={e.title}
              delay={i * 0.12}
              className="rounded-[2rem] bg-bubble p-7 ring-1 ring-ink/10"
            >
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-mint font-display text-lg font-extrabold">
                {i + 1}
              </span>
              <h2 className="mt-4 font-display text-2xl font-extrabold">{e.title}</h2>
              <p className="mt-2 text-lg leading-relaxed text-muted">{e.text}</p>
            </Reveal>
          ))}
        </ol>
      </section>

      <section className="section-y bg-sky/40">
        <div className="container-hf">
          <Reveal>
            <SectionHeading
              eyebrow="Im Querschnitt"
              title="Ohne Schaum vs. mit Schaum."
              align="center"
            />
          </Reveal>
          <Reveal delay={0.1} className="mt-12">
            <CrossSection />
          </Reveal>
          <p className="mt-6 text-center text-sm text-muted">
            Schematische Darstellung, nicht maßstabsgetreu.
          </p>
        </div>
      </section>

      <section className="section-y">
        <div className="container-hf grid items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <SectionHeading
              eyebrow="Die Zahlen"
              title="Was wir messen – sobald das Labor fertig ist."
            />
            <dl className="mt-8 grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
              {how.facts.map((f) => (
                <div key={f.label} className="rounded-3xl bg-bubble p-5 ring-1 ring-ink/10">
                  <dt className="text-sm text-muted">{f.label}</dt>
                  <dd className="mt-1 font-display text-xl font-extrabold">
                    <Rich text={f.value} />
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>
          <Reveal delay={0.1}>
            <DecibelMeter
              loudLabel={home.meter.loudLabel}
              quietLabel={home.meter.quietLabel}
              valueWithout={home.meter.valueWithout}
              valueWith={home.meter.valueWith}
            />
          </Reveal>
        </div>
      </section>

      <section className="section-y bg-bubble">
        <div className="container-hf">
          <Reveal>
            <SectionHeading eyebrow="Anwendung" title="Drei Schritte zur Stille." align="center" />
          </Reveal>
          <ol className="mt-12 grid gap-8 md:grid-cols-3">
            {home.steps.items.map((step, i) => {
              const Art = stepArt[i];
              return (
                <Reveal
                  as="li"
                  key={step.title}
                  delay={i * 0.12}
                  className="flex flex-col items-center rounded-[2rem] bg-foam p-6 text-center"
                >
                  <Art />
                  <h3 className="mt-3 font-display text-2xl font-extrabold">
                    {i + 1}. {step.title}
                  </h3>
                  <p className="mt-1 text-lg text-muted">{step.text}</p>
                </Reveal>
              );
            })}
          </ol>
          <p className="mt-10 text-center font-display text-xl font-bold">{home.steps.outro}</p>
        </div>
      </section>

      <section className="section-y">
        <div className="container-hf">
          <Reveal className="on-dark relative overflow-hidden rounded-[2.5rem] bg-ink p-8 text-bubble md:p-14">
            <Sticker tone="sun" rotate={-5} className="mb-6">
              {how.history.eyebrow}
            </Sticker>
            <h2 className="font-display text-[clamp(2rem,5vw,3.25rem)] leading-tight font-extrabold">
              {how.history.title}
            </h2>
            <p className="mt-5 max-w-3xl text-lg leading-relaxed text-bubble/80">
              {how.history.text}
            </p>
            <a
              href={how.history.href}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 inline-block font-semibold text-mint underline underline-offset-4"
            >
              {how.history.linkLabel} ↗
            </a>
          </Reveal>
          <div className="mt-12 flex flex-wrap justify-center gap-4">
            <Button href="/shop" size="lg">
              Jetzt leise werden
            </Button>
            <Button href="/faq" size="lg" variant="secondary">
              Noch Fragen?
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
