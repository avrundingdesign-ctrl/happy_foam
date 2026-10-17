import type { ReactNode } from "react";
import { PageHero } from "./PageHero";
import { Placeholder } from "./Rich";

/**
 * Rahmen für Rechtstexte. Die Texte selbst kommen von einem Rechtstexte-Dienst
 * (z. B. IT-Recht Kanzlei, Händlerbund) und werden an der markierten Stelle eingefügt.
 */
export function LegalPage({
  title,
  placeholder,
  intro,
  children,
}: {
  title: string;
  placeholder: string;
  intro?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <>
      <PageHero eyebrow="Rechtliches" title={title} text={intro} />
      <section className="container-hf pb-24">
        <div className="prose-hf max-w-3xl rounded-[2rem] bg-bubble p-6 ring-1 ring-ink/10 md:p-10">
          <div className="mb-6 rounded-2xl border-2 border-dashed border-ink/30 bg-sun/20 p-5">
            <p className="!mb-2 font-semibold">Hier wird der Rechtstext eingefügt:</p>
            <Placeholder>{placeholder}</Placeholder>
            <p className="mt-2 !mb-0 text-sm text-muted">
              Hinweis für die Pflege: Bitte den aktuellen Text des Rechtstexte-Anbieters vollständig
              hier einsetzen (siehe README, Abschnitt „Rechtstexte“). Dieser Kasten wird dann
              entfernt.
            </p>
          </div>
          {children}
        </div>
      </section>
    </>
  );
}
