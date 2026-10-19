import type { ReactNode } from "react";
import { legalDocs, type LegalDocName } from "@/generated/legal";
import { PageHero } from "./PageHero";

/**
 * Rahmen für Rechtstexte. Die Texte stehen in content/de/rechtliches/*.md
 * (vom Rechtstexte-Anbieter) und werden beim Build eingelesen.
 */
export function LegalPage({
  title,
  doc,
  intro,
  children,
}: {
  title: string;
  doc: LegalDocName;
  intro?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <>
      <PageHero eyebrow="Rechtliches" title={title} text={intro} />
      <section className="container-hf pb-24">
        <div className="prose-hf max-w-3xl rounded-[2rem] bg-bubble p-6 ring-1 ring-ink/10 md:p-10">
          {children}
          {/* Inhalt stammt aus den eigenen Markdown-Dateien im Repository */}
          <div dangerouslySetInnerHTML={{ __html: legalDocs[doc].html }} />
        </div>
      </section>
    </>
  );
}
