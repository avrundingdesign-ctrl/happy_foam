import type { Metadata } from "next";
import faq from "@content/de/faq.json";
import { JsonLd, pageMetadata } from "@/lib/seo";
import { PageHero } from "@/components/ui/PageHero";
import { FaqList } from "@/components/ui/FaqList";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = pageMetadata({
  title: "FAQ",
  description:
    "Alle Antworten rund um HappyFoam: Wie funktioniert es, wie lange hält der Schaum, was ist drin, ist die Verpackung diskret?",
  path: "/faq",
});

const PLACEHOLDER = /\[[A-ZÄÖÜ0-9_]+\]/;

export default function FaqPage() {
  // Antworten, die noch Platzhalter enthalten, gehen nicht in die strukturierten Daten
  const answered = faq.items.filter((i) => !PLACEHOLDER.test(i.a));
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: answered.map((i) => ({
            "@type": "Question",
            name: i.q,
            acceptedAnswer: { "@type": "Answer", text: i.a },
          })),
        }}
      />
      <PageHero
        eyebrow="FAQ"
        title="Fragen, die man sich nicht laut zu fragen traut."
        text="Hier darfst du. Ganz leise."
      />
      <section className="container-hf max-w-4xl pb-16">
        <FaqList items={faq.items} />
      </section>
      <section className="container-hf max-w-4xl pb-24">
        <div className="flex flex-col items-start justify-between gap-6 rounded-[2rem] bg-sky/50 p-8 md:flex-row md:items-center">
          <div>
            <h2 className="font-display text-2xl font-extrabold">Deine Frage war nicht dabei?</h2>
            <p className="mt-1 text-muted">Schreib uns. Wir antworten diskret.</p>
          </div>
          <Button href="/kontakt" variant="dark">
            Kontakt aufnehmen
          </Button>
        </div>
      </section>
    </>
  );
}
