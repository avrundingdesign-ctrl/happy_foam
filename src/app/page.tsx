import Link from "next/link";
import home from "@content/de/home.json";
import faq from "@content/de/faq.json";
import { Button } from "@/components/ui/Button";
import { Sticker } from "@/components/ui/Sticker";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { FaqList } from "@/components/ui/FaqList";
import { Rich } from "@/components/ui/Rich";
import { HeroAnimation } from "@/components/animations/HeroAnimation";
import { BubbleField } from "@/components/animations/BubbleField";
import { Marquee } from "@/components/animations/Marquee";
import { Reveal } from "@/components/animations/Reveal";
import { DecibelMeter } from "@/components/animations/DecibelMeter";
import { SoundDemo } from "@/components/animations/SoundDemo";
import { StepFoam, StepSprinkle, StepTear } from "@/components/animations/StepAnimations";
import { SceneDate, SceneOffice, SceneTrain } from "@/components/illustrations/Scenes";
import { Mascot } from "@/components/brand/Mascot";
import { ProductBox } from "@/components/illustrations/ProductBox";
import { ProductCard } from "@/components/shop/ProductCard";
import { NewsletterForm } from "@/components/forms/NewsletterForm";
import { getShopProducts } from "@/lib/products";

const sceneArt = { office: SceneOffice, date: SceneDate, train: SceneTrain } as const;
const stepArt = [StepTear, StepSprinkle, StepFoam];

export default async function HomePage() {
  const products = await getShopProducts();
  const featuredFaq = faq.items.filter((i) => i.featured).slice(0, 5);

  return (
    <>
      {/* 1 · Hero */}
      <section className="relative -mt-18 overflow-hidden pt-28 pb-16 md:pt-36 md:pb-24">
        <div
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,#BFE6FF_0%,transparent_55%),radial-gradient(ellipse_at_bottom_left,#C9F5E9_0%,transparent_50%)]"
          aria-hidden="true"
        />
        <BubbleField />
        <div className="container-hf relative z-10 grid items-center gap-12 lg:grid-cols-[1.3fr_1fr]">
          <div>
            <Sticker tone="sun" rotate={-4} className="mb-6">
              {home.hero.eyebrow}
            </Sticker>
            <h1 className="font-display text-[clamp(2.6rem,7vw,3.9rem)] leading-[1] font-extrabold tracking-tight">
              Dein Geschäft bleibt{" "}
              <span className="relative inline-block">
                <span className="relative z-10">dein Geschäft.</span>
                <span
                  className="absolute inset-x-0 bottom-[0.08em] z-0 h-[0.32em] rounded-full bg-mint/70"
                  aria-hidden="true"
                />
              </span>
            </h1>
            <p className="mt-6 max-w-xl text-xl leading-relaxed text-muted md:text-2xl">
              {home.hero.subtitle}
            </p>
            <div className="mt-9 flex flex-wrap gap-4">
              <Button href="/shop" size="lg">
                {home.hero.ctaPrimary}
              </Button>
              <Button href="/fuer-unternehmen" size="lg" variant="secondary">
                {home.hero.ctaSecondary}
              </Button>
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-3 text-sm font-semibold text-muted">
              <Sticker tone="blush" rotate={3}>
                Neu
              </Sticker>
              <Sticker tone="sky" rotate={-2}>
                Made in Hamburg
              </Sticker>
            </div>
          </div>
          <div className="relative">
            <div className="absolute -top-6 -left-4 z-10 hidden md:block">
              <Mascot
                mood="wink"
                className="h-20 w-20 animate-float"
                title="HappyFoam-Maskottchen"
              />
            </div>
            <div className="rounded-[3rem] bg-bubble/70 p-4 shadow-[0_40px_80px_-40px_rgba(15,27,45,0.35)] ring-1 ring-ink/5 backdrop-blur-sm md:p-6">
              <HeroAnimation loud={home.hero.loud} quiet={home.hero.quiet} />
            </div>
          </div>
        </div>
      </section>

      <Marquee items={home.claims} tone="ink" />

      {/* 2 · Kennst du das? */}
      <section className="section-y">
        <div className="container-hf">
          <Reveal>
            <SectionHeading eyebrow={home.scenes.eyebrow} title={home.scenes.title} />
          </Reveal>
          <ul className="mt-12 grid gap-6 md:grid-cols-3">
            {home.scenes.items.map((s, i) => {
              const Art = sceneArt[s.id as keyof typeof sceneArt];
              return (
                <Reveal
                  as="li"
                  key={s.id}
                  delay={i * 0.12}
                  className="flex flex-col overflow-hidden rounded-[2rem] bg-bubble ring-1 ring-ink/10"
                >
                  <div className="bg-foam p-4">
                    <Art className="h-auto w-full" />
                  </div>
                  <div className="p-6">
                    <h3 className="font-display text-2xl font-extrabold">{s.title}</h3>
                    <p className="mt-2 text-lg text-muted">{s.text}</p>
                  </div>
                </Reveal>
              );
            })}
          </ul>
        </div>
      </section>

      {/* 3 · Zahlen */}
      <section className="pb-20 md:pb-28">
        <div className="container-hf">
          <Reveal>
            <SectionHeading eyebrow={home.stats.eyebrow} title={home.stats.title} />
          </Reveal>
          <ol className="mt-12 grid gap-6 md:grid-cols-3">
            {home.stats.items.map((s, i) => (
              <Reveal
                as="li"
                key={s.value}
                delay={i * 0.12}
                className="relative flex flex-col rounded-[2rem] bg-sky/50 p-7"
              >
                <p className="font-display text-5xl font-extrabold tracking-tight md:text-6xl">
                  {s.value}
                </p>
                <p className="mt-3 text-lg leading-snug">
                  {s.text}
                  <sup className="ml-0.5 font-semibold">
                    <a
                      href={`#quelle-${i + 1}`}
                      aria-label={`Quelle ${i + 1}`}
                      className="text-mint-ink"
                    >
                      [{i + 1}]
                    </a>
                  </sup>
                </p>
              </Reveal>
            ))}
          </ol>
          <ol className="mt-6 space-y-1 text-sm text-muted">
            {home.stats.items.map((s, i) => (
              <li key={s.href + i} id={`quelle-${i + 1}`}>
                [{i + 1}] Quelle:{" "}
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline underline-offset-2 hover:text-ink"
                >
                  {s.source}
                </a>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 4 · So funktioniert's */}
      <section className="section-y relative overflow-hidden bg-bubble">
        <div className="container-hf">
          <Reveal>
            <SectionHeading eyebrow={home.steps.eyebrow} title={home.steps.title} align="center" />
          </Reveal>
          <ol className="mt-14 grid gap-8 md:grid-cols-3">
            {home.steps.items.map((step, i) => {
              const Art = stepArt[i];
              return (
                <Reveal
                  as="li"
                  key={step.title}
                  delay={i * 0.15}
                  className="relative flex flex-col items-center rounded-[2rem] bg-foam px-6 pt-6 pb-8 text-center"
                >
                  <span className="absolute top-5 left-5 inline-flex h-10 w-10 items-center justify-center rounded-full bg-ink font-display text-lg font-extrabold text-bubble">
                    {i + 1}
                  </span>
                  <Art />
                  <h3 className="mt-4 font-display text-2xl font-extrabold">{step.title}</h3>
                  <p className="mt-1 text-lg text-muted">{step.text}</p>
                </Reveal>
              );
            })}
          </ol>
          <Reveal>
            <p className="mt-10 text-center font-display text-2xl font-bold">
              <span className="inline-block rounded-3xl bg-sun px-5 py-2">{home.steps.outro}</span>
            </p>
          </Reveal>
        </div>
      </section>

      {/* 5 · Dezibel-Meter + Sound-Demo */}
      <section className="section-y">
        <div className="container-hf grid items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <SectionHeading
              eyebrow={home.meter.eyebrow}
              title={home.meter.title}
              text={home.meter.text}
            />
            <div className="mt-10">
              <DecibelMeter
                loudLabel={home.meter.loudLabel}
                quietLabel={home.meter.quietLabel}
                valueWithout={home.meter.valueWithout}
                valueWith={home.meter.valueWith}
              />
            </div>
          </Reveal>
          <Reveal delay={0.15}>
            <h3 className="mb-2 font-display text-3xl font-extrabold">{home.sound.title}</h3>
            <p className="mb-6 text-lg text-muted">{home.sound.text}</p>
            <SoundDemo
              without={home.sound.without}
              withFoam={home.sound.with}
              note={home.sound.note}
            />
          </Reveal>
        </div>
      </section>

      <Marquee items={home.claims.slice().reverse()} tone="mint" reverse />

      {/* 6 · Produkte */}
      <section className="section-y" id="produkte">
        <div className="container-hf">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <Reveal>
              <SectionHeading eyebrow="Shop" title="Such dir deine Ruhe aus." />
            </Reveal>
            <Link href="/shop" className="font-semibold text-mint-ink underline underline-offset-4">
              Alle Produkte →
            </Link>
          </div>
          <div className="mt-12 grid gap-8 md:grid-cols-2">
            {products.map((p, i) => (
              <Reveal key={p.handle} delay={i * 0.12}>
                <ProductCard product={p} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 7 · Warum Schaum leiser macht */}
      <section className="section-y on-dark bg-ink text-bubble">
        <div className="container-hf">
          <Reveal>
            <p className="eyebrow mb-3 !text-mint">{home.science.eyebrow}</p>
            <h2 className="max-w-3xl font-display text-[clamp(2rem,5vw,3.25rem)] leading-[1.05] font-extrabold">
              {home.science.title}
            </h2>
          </Reveal>
          <ul className="mt-12 grid gap-6 md:grid-cols-3">
            {home.science.points.map((p, i) => (
              <Reveal
                as="li"
                key={p.title}
                delay={i * 0.12}
                className="rounded-[2rem] bg-bubble/5 p-7 ring-1 ring-bubble/15"
              >
                <span className="bubble-deco mb-5 block h-12 w-12" aria-hidden="true" />
                <h3 className="font-display text-2xl font-extrabold">{p.title}</h3>
                <p className="mt-2 text-lg text-bubble/75">{p.text}</p>
              </Reveal>
            ))}
          </ul>
          <div className="mt-10">
            <Button href="/so-funktionierts" variant="primary">
              {home.science.cta}
            </Button>
          </div>
        </div>
      </section>

      {/* 8 · Für Unternehmen */}
      <section className="section-y">
        <div className="container-hf">
          <Reveal className="relative overflow-hidden rounded-[2.5rem] bg-sky/60 px-6 py-12 md:px-14 md:py-16">
            <span className="bubble-deco absolute -top-10 -right-10 h-48 w-48" aria-hidden="true" />
            <span
              className="bubble-deco absolute right-40 bottom-6 hidden h-16 w-16 md:block"
              aria-hidden="true"
            />
            <div className="relative grid items-center gap-8 md:grid-cols-[1.4fr_1fr]">
              <div>
                <p className="eyebrow mb-3">{home.business.eyebrow}</p>
                <h2 className="font-display text-[clamp(2rem,5vw,3.25rem)] leading-[1.05] font-extrabold">
                  {home.business.title}
                </h2>
                <p className="mt-4 max-w-xl text-lg text-ink/80">{home.business.text}</p>
                <div className="mt-8">
                  <Button href="/fuer-unternehmen" variant="dark" size="lg">
                    {home.business.cta}
                  </Button>
                </div>
              </div>
              <div className="relative flex justify-center md:justify-end">
                <ProductBox
                  color="sky"
                  count={200}
                  label="Business-Karton"
                  className="w-56 md:w-72"
                />
                <Sticker
                  tone="sun"
                  rotate={6}
                  className="absolute right-0 bottom-2 px-5 py-2 text-lg md:-right-2"
                >
                  Auch mit Ihrem Logo!
                </Sticker>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 9 · Inhaltsstoffe */}
      <section className="pb-20 md:pb-28">
        <div className="container-hf grid items-center gap-10 md:grid-cols-2">
          <Reveal>
            <SectionHeading
              eyebrow={home.ingredients.eyebrow}
              title={home.ingredients.title}
              text={home.ingredients.text}
            />
            <p className="mt-4 text-sm text-muted">
              Finale Liste: <Rich text={home.ingredients.final} />
            </p>
          </Reveal>
          <ul className="flex flex-wrap justify-center gap-4 md:justify-start">
            {home.ingredients.items.map((item, i) => (
              <Reveal as="li" key={item} delay={i * 0.1}>
                <span
                  className="bubble-deco flex aspect-square w-40 items-center justify-center p-5 text-center font-display text-lg leading-tight font-bold ring-2 ring-ink md:w-44"
                  style={{ transform: `rotate(${(i - 1) * 4}deg)` }}
                >
                  {item}
                </span>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      {/* 10 · FAQ */}
      <section className="section-y bg-bubble">
        <div className="container-hf grid gap-10 lg:grid-cols-[1fr_1.6fr]">
          <Reveal>
            <SectionHeading
              eyebrow="FAQ"
              title="Fragen, die man sich nicht laut zu fragen traut."
            />
            <Link
              href="/faq"
              className="mt-6 inline-block font-semibold text-mint-ink underline underline-offset-4"
            >
              Alle Fragen &amp; Antworten →
            </Link>
          </Reveal>
          <Reveal delay={0.1}>
            <FaqList items={featuredFaq} />
          </Reveal>
        </div>
      </section>

      {/* 11 · Newsletter / Warteliste */}
      <section id="newsletter" className="relative overflow-hidden py-24 md:py-32">
        <div
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,#BFE6FF_0%,transparent_60%)]"
          aria-hidden="true"
        />
        <BubbleField density={0.8} />
        <div className="container-hf relative z-10">
          <Reveal className="mx-auto max-w-2xl rounded-[2.5rem] bg-bubble p-8 text-center shadow-[0_40px_80px_-40px_rgba(15,27,45,0.35)] ring-1 ring-ink/5 md:p-12">
            <Mascot mood="shh" className="mx-auto mb-4 h-20 w-20" />
            <h2 className="font-display text-[clamp(2rem,5vw,3rem)] leading-tight font-extrabold">
              {home.newsletter.title}
            </h2>
            <p className="mt-3 mb-8 text-lg text-muted">{home.newsletter.text}</p>
            <div className="text-left">
              <NewsletterForm />
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
