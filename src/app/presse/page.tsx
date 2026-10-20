import type { Metadata } from "next";
import { siteConfig } from "@config";
import { pageMetadata } from "@/lib/seo";
import { PageHero } from "@/components/ui/PageHero";
import { Rich } from "@/components/ui/Rich";
import { Logo } from "@/components/brand/Logo";
import { Mascot } from "@/components/brand/Mascot";

export const metadata: Metadata = pageMetadata({
  title: "Presse",
  description: "Pressekit von HappyFoam: Logo, Kurztext und Ansprechpartner.",
  path: "/presse",
});

const SHORT_TEXT =
  "HappyFoam ist ein Brausepulver im flachen Einzel-Sachet. Vor dem Toilettengang ins Becken gestreut, bildet es in wenigen Sekunden eine dicke Schaumschicht, die Plätschern, „Plopp“ und Spritzer dämpft. Beim Spülen verschwindet der Schaum. HappyFoam wird in Hamburg gegründet und richtet sich an Privatkundinnen und -kunden ebenso wie an Büros, Hotels und Gastronomie.";

export default function PressPage() {
  return (
    <>
      <PageHero
        eyebrow="Presse"
        title="Leise Marke, laute Geschichte."
        text="Hier finden Sie Logo, Kurztext und Ansprechpartner. Weitere Materialien schicken wir gern auf Anfrage."
      />
      <section className="container-hf grid gap-8 pb-24 lg:grid-cols-2 [&>*]:min-w-0">
        <div className="rounded-[2rem] bg-bubble p-7 ring-1 ring-ink/10 md:p-10">
          <h2 className="font-display text-2xl font-extrabold">Logo</h2>
          <div className="mt-6 flex items-center justify-center rounded-3xl bg-foam px-4 py-10 text-4xl sm:text-5xl">
            <Logo />
          </div>
          <div className="mt-4 flex items-center justify-center rounded-3xl bg-ink px-4 py-10 text-4xl text-bubble sm:text-5xl">
            <span className="[&_.text-mint-ink]:text-mint">
              <Logo />
            </span>
          </div>
          <p className="mt-4 text-sm text-muted">Entwurf – die finale Wortmarke folgt.</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href="/brand/happyfoam-logo-entwurf.svg"
              download
              className="inline-flex h-12 items-center rounded-full bg-mint px-6 font-display font-bold shadow-[0_5px_0_0_#0F1B2D]"
            >
              Logo herunterladen (SVG)
            </a>
            <a
              href="/brand/happyfoam-maskottchen.svg"
              download
              className="inline-flex h-12 items-center rounded-full bg-bubble px-6 font-display font-bold ring-2 ring-ink"
            >
              Maskottchen (SVG)
            </a>
          </div>
        </div>
        <div className="flex flex-col gap-8">
          <div className="rounded-[2rem] bg-bubble p-7 ring-1 ring-ink/10 md:p-10">
            <h2 className="font-display text-2xl font-extrabold">Kurztext</h2>
            <p className="mt-4 text-lg leading-relaxed">{SHORT_TEXT}</p>
          </div>
          <div className="rounded-[2rem] bg-sky/50 p-7 md:p-10">
            <h2 className="font-display text-2xl font-extrabold">Pressekontakt</h2>
            <p className="mt-3 text-lg">
              {siteConfig.company.owner}
              <br />
              <a
                href={`mailto:${siteConfig.contact.email}`}
                className="font-semibold underline underline-offset-4"
              >
                {siteConfig.contact.email}
              </a>
            </p>
            <p className="mt-4 text-sm text-muted">
              Pressefotos und Produktmuster: <Rich text="[PRESSEKIT_DOWNLOAD]" />
            </p>
            <Mascot mood="wink" className="mt-6 h-16 w-16" />
          </div>
        </div>
      </section>
    </>
  );
}
