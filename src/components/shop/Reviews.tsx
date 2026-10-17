import { Mascot } from "@/components/brand/Mascot";

export type Review = {
  author: string;
  rating: number;
  title?: string;
  text: string;
  date: string;
  verified?: boolean;
};

/**
 * Bewertungen – vorbereitet, aber bewusst leer.
 * Nur echte, überprüfbare Kundenbewertungen einbinden (z. B. aus einer Shopify-Review-App).
 */
export function Reviews({ reviews = [] }: { reviews?: Review[] }) {
  return (
    <section
      aria-labelledby="reviews-title"
      className="rounded-[2rem] bg-bubble p-6 ring-1 ring-ink/10 md:p-10"
    >
      <h2 id="reviews-title" className="font-display text-3xl font-extrabold">
        Bewertungen
      </h2>
      {reviews.length === 0 ? (
        <div className="mt-6 flex flex-col items-center gap-3 py-6 text-center">
          <Mascot mood="shh" className="h-16 w-16" />
          <p className="font-display text-xl font-bold">Noch ganz still hier.</p>
          <p className="max-w-md text-muted">
            Sobald die ersten echten Bewertungen eintrudeln, findest du sie an dieser Stelle.
          </p>
        </div>
      ) : (
        <ul className="mt-6 grid gap-4 md:grid-cols-2">
          {reviews.map((r, i) => (
            <li key={i} className="rounded-3xl bg-foam p-5">
              <p aria-label={`${r.rating} von 5 Sternen`} className="text-lg text-ink">
                {"★".repeat(r.rating)}
                <span className="text-ink/20">{"★".repeat(5 - r.rating)}</span>
              </p>
              {r.title && <p className="mt-2 font-bold">{r.title}</p>}
              <p className="mt-1 text-muted">{r.text}</p>
              <p className="mt-3 text-sm text-muted">
                {r.author} · {r.date}
                {r.verified ? " · Verifizierter Kauf" : ""}
              </p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
