import type { Metadata } from "next";
import Link from "next/link";
import { CheckoutPage } from "@/components/checkout/CheckoutPage";

export const metadata: Metadata = {
  title: "Kasse",
  robots: { index: false, follow: false },
};

const steps = ["Warenkorb", "Adresse & Zahlung", "Fertig"];

export default function Kasse() {
  return (
    <div className="container-hf pt-6 pb-24 md:pt-10">
      <nav aria-label="Bestellschritte" className="mb-8">
        <ol className="flex flex-wrap items-center gap-2 text-sm font-semibold">
          {steps.map((s, i) => (
            <li key={s} className="flex items-center gap-2">
              <span
                className={
                  i === 1
                    ? "rounded-full bg-ink px-3 py-1 text-bubble"
                    : i === 0
                      ? "rounded-full bg-mint/40 px-3 py-1"
                      : "rounded-full bg-bubble px-3 py-1 text-muted ring-1 ring-ink/10"
                }
                aria-current={i === 1 ? "step" : undefined}
              >
                {i === 0 ? <Link href="/shop">✓ {s}</Link> : s}
              </span>
              {i < steps.length - 1 && (
                <span aria-hidden="true" className="text-muted">
                  →
                </span>
              )}
            </li>
          ))}
        </ol>
      </nav>
      <h1 className="mb-8 font-display text-[clamp(2.2rem,6vw,3.5rem)] leading-none font-extrabold">
        Fast geschafft. <span className="text-mint-ink">Psst.</span>
      </h1>
      <CheckoutPage />
    </div>
  );
}
