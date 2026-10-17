import Link from "next/link";
import { Rich } from "./Rich";

export type FaqItem = { q: string; a: string; link?: { href: string; label: string } };

/** Aufklappbare FAQ – natives <details>, funktioniert auch ohne JavaScript. */
export function FaqList({ items }: { items: FaqItem[] }) {
  return (
    <div className="flex flex-col gap-3">
      {items.map((item) => (
        <details
          key={item.q}
          className="group rounded-3xl bg-bubble ring-1 ring-ink/10 open:ring-2 open:ring-ink"
        >
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 rounded-3xl px-6 py-5 font-display text-lg font-bold md:text-xl [&::-webkit-details-marker]:hidden">
            {item.q}
            <span
              className="relative inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-sky transition-transform duration-300 group-open:rotate-45 group-open:bg-mint"
              aria-hidden="true"
            >
              <span className="absolute h-0.5 w-4 rounded bg-ink" />
              <span className="absolute h-4 w-0.5 rounded bg-ink" />
            </span>
          </summary>
          <div className="px-6 pb-6 text-lg leading-relaxed text-ink/85">
            <p>
              <Rich text={item.a} />
            </p>
            {item.link && (
              <Link
                href={item.link.href}
                className="mt-3 inline-block font-semibold text-mint-ink underline underline-offset-4"
              >
                {item.link.label} →
              </Link>
            )}
          </div>
        </details>
      ))}
    </div>
  );
}
