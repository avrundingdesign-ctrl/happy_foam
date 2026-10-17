import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@config";
import { pageMetadata } from "@/lib/seo";
import { PageHero } from "@/components/ui/PageHero";
import { Rich } from "@/components/ui/Rich";
import { ContactForm } from "@/components/forms/ContactForm";
import { Mascot } from "@/components/brand/Mascot";

export const metadata: Metadata = pageMetadata({
  title: "Kontakt",
  description: "Fragen, Lob, Ideen? Schreib dem HappyFoam-Team – wir antworten diskret.",
  path: "/kontakt",
});

export default function ContactPage() {
  const email = siteConfig.contact.email;
  const isPlaceholder = email.startsWith("[");
  return (
    <>
      <PageHero
        eyebrow="Kontakt"
        title="Schreib uns. Wir hören zu."
        text="Fragen, Lob, Kritik oder eine wirklich gute Toiletten-Anekdote – alles willkommen."
      />
      <section className="container-hf grid gap-10 pb-24 lg:grid-cols-[1.5fr_1fr]">
        <div className="rounded-[2rem] bg-bubble p-6 shadow-[0_30px_60px_-40px_rgba(15,27,45,0.4)] ring-1 ring-ink/5 md:p-10">
          <ContactForm />
        </div>
        <aside className="flex flex-col gap-6">
          <div className="rounded-[2rem] bg-sky/50 p-7">
            <h2 className="font-display text-2xl font-extrabold">Lieber per E-Mail?</h2>
            <p className="mt-2 text-lg">
              {isPlaceholder ? (
                <Rich text={email} />
              ) : (
                <a href={`mailto:${email}`} className="font-semibold underline underline-offset-4">
                  {email}
                </a>
              )}
            </p>
            {siteConfig.contact.phone && <p className="mt-1">{siteConfig.contact.phone}</p>}
          </div>
          <div className="rounded-[2rem] bg-bubble p-7 ring-1 ring-ink/10">
            <h2 className="font-display text-2xl font-extrabold">Für Unternehmen</h2>
            <p className="mt-2 text-muted">
              Sie möchten HappyFoam für Ihr Büro, Hotel oder Restaurant? Nutzen Sie unser
              Anfrageformular.
            </p>
            <Link
              href="/fuer-unternehmen#anfrage"
              className="mt-3 inline-block font-semibold text-mint-ink underline underline-offset-4"
            >
              Zum B2B-Anfrageformular →
            </Link>
          </div>
          <div className="flex items-center gap-4 px-2">
            <Mascot mood="wink" className="h-16 w-16 shrink-0" />
            <p className="text-muted">
              Wir antworten in der Regel innerhalb weniger Werktage. Leise, aber zuverlässig.
            </p>
          </div>
        </aside>
      </section>
    </>
  );
}
