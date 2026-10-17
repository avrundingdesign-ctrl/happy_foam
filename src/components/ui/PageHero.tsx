import type { ReactNode } from "react";
import { SectionHeading } from "./SectionHeading";
import { cn } from "@/lib/cn";

/** Kopfbereich für Unterseiten mit dekorativen Blasen. */
export function PageHero({
  eyebrow,
  title,
  text,
  children,
  className,
}: {
  eyebrow?: string;
  title: ReactNode;
  text?: ReactNode;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("relative overflow-hidden pt-10 pb-12 md:pt-16 md:pb-20", className)}>
      <span
        className="bubble-deco absolute -top-10 -right-16 h-56 w-56 animate-float opacity-80 md:h-80 md:w-80"
        aria-hidden="true"
      />
      <span
        className="bubble-deco absolute top-[60%] right-[20%] hidden h-16 w-16 animate-float [animation-delay:1.5s] md:block"
        aria-hidden="true"
      />
      <span
        className="bubble-deco absolute bottom-0 -left-10 h-28 w-28 animate-float [animation-delay:0.7s]"
        aria-hidden="true"
      />
      <div className="container-hf relative">
        <SectionHeading as="h1" eyebrow={eyebrow} title={title} text={text} />
        {children}
      </div>
    </section>
  );
}
