import Link from "next/link";
import { siteConfig } from "@config";
import { Logo } from "@/components/brand/Logo";
import { Mascot } from "@/components/brand/Mascot";
import { NewsletterForm } from "@/components/forms/NewsletterForm";
import { Placeholder } from "@/components/ui/Rich";

const groups = [
  {
    title: "Shop",
    links: [
      { href: "/shop", label: "Alle Produkte" },
      { href: "/produkte/pocket-box", label: "Pocket-Box" },
      { href: "/produkte/vorratspack", label: "Vorratspack" },
      { href: "/fuer-unternehmen", label: "Für Unternehmen" },
    ],
  },
  {
    title: "HappyFoam",
    links: [
      { href: "/so-funktionierts", label: "So funktioniert's" },
      { href: "/ueber-uns", label: "Über uns" },
      { href: "/faq", label: "FAQ" },
      { href: "/presse", label: "Presse" },
      { href: "/kontakt", label: "Kontakt" },
    ],
  },
  {
    title: "Rechtliches",
    links: [
      { href: "/impressum", label: "Impressum" },
      { href: "/datenschutz", label: "Datenschutz" },
      { href: "/agb", label: "AGB" },
      { href: "/widerruf", label: "Widerrufsbelehrung" },
      { href: "/versand-und-zahlung", label: "Versand & Zahlung" },
    ],
  },
];

export function Footer() {
  const socials = siteConfig.social.filter((s) => s.href);
  return (
    <footer className="on-dark relative mt-auto overflow-hidden bg-ink text-bubble">
      <div className="container-hf grid gap-12 py-16 lg:grid-cols-[1.2fr_2fr] lg:py-20">
        <div className="flex flex-col gap-6">
          <Link
            href="/"
            className="w-fit rounded-xl text-3xl"
            aria-label="HappyFoam – zur Startseite"
          >
            <span className="[&_.text-mint-ink]:text-mint">
              <Logo />
            </span>
          </Link>
          <p className="font-display text-2xl font-bold">{siteConfig.claim}</p>
          {siteConfig.features.newsletter && (
            <div>
              <p className="mb-3 font-semibold">Werde leise informiert.</p>
              <NewsletterForm compact dark />
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
          {groups.map((g) => (
            <nav key={g.title} aria-label={g.title}>
              <h2 className="mb-4 font-display text-lg font-bold text-mint">{g.title}</h2>
              <ul className="flex flex-col gap-2.5">
                {g.links.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="rounded text-bubble/80 transition-colors hover:text-bubble hover:underline"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>
      </div>

      <div className="border-t border-bubble/10">
        <div className="container-hf flex flex-col gap-6 py-8 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="mb-2 text-xs font-semibold tracking-widest text-bubble/60 uppercase">
              Sicher bezahlen
            </p>
            <ul className="flex flex-wrap gap-2" aria-label="Zahlungsarten">
              {siteConfig.paymentMethods.map((m) => (
                <li key={m} className="rounded-lg bg-bubble px-2.5 py-1 text-xs font-bold text-ink">
                  {m}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col gap-2 md:items-end">
            <p className="mb-1 text-xs font-semibold tracking-widest text-bubble/60 uppercase">
              Folge uns
            </p>
            {socials.length ? (
              <ul className="flex gap-3">
                {socials.map((s) => (
                  <li key={s.label}>
                    <a
                      href={s.href}
                      className="rounded-full bg-bubble/10 px-3 py-1.5 text-sm font-semibold hover:bg-bubble/20"
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      {s.label}
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <Placeholder>[SOCIAL_LINKS]</Placeholder>
            )}
          </div>
        </div>
      </div>

      <div className="border-t border-bubble/10">
        <div className="container-hf flex flex-col items-center justify-between gap-3 py-6 text-sm text-bubble/70 sm:flex-row">
          <p className="flex items-center gap-2">
            <Mascot className="h-6 w-6" />
            Made with Schaum in Hamburg.
          </p>
          <p>© {siteConfig.name}</p>
        </div>
      </div>
    </footer>
  );
}
