"use client";

import { siteConfig } from "@config";
import type { ReactNode } from "react";
import { useCart } from "@/components/shop/CartProvider";
import { Sachet } from "@/components/illustrations/Sachet";
import { Rich } from "@/components/ui/Rich";
import type { PricedOrder } from "@/lib/checkout-math";
import { formatPrice } from "@/lib/price";
import { FreeShippingProgress } from "./FreeShippingProgress";

const money = (cents: number) => formatPrice(cents / 100);

/** Bestellübersicht mit Mengenänderung, Summen und Pflichtangaben. */
export function OrderSummary({
  order,
  editable = true,
  children,
}: {
  order: PricedOrder;
  editable?: boolean;
  children?: ReactNode;
}) {
  const { setQuantity, remove } = useCart();
  const kleinunternehmer = siteConfig.legal.kleinunternehmer;

  return (
    <div className="rounded-[2rem] bg-bubble p-5 shadow-[0_30px_60px_-40px_rgba(15,27,45,0.45)] ring-1 ring-ink/5 md:p-7">
      <h2 id="bestelluebersicht" className="font-display text-2xl font-extrabold">
        Deine Bestellung
      </h2>
      <ul className="mt-4 divide-y divide-ink/10">
        {order.lines.map((line) => (
          <li key={line.handle} className="flex gap-4 py-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-foam">
              <Sachet color={line.color} className="w-11" />
            </div>
            <div className="flex min-w-0 flex-1 flex-col">
              <div className="flex items-start justify-between gap-3">
                <p className="font-display text-lg leading-tight font-bold">{line.title}</p>
                <p className="font-semibold whitespace-nowrap">{money(line.totalCents)}</p>
              </div>
              <p className="text-sm text-muted">{money(line.unitCents)} / Stück</p>
              {editable && (
                <div className="mt-2 flex items-center gap-3">
                  <div
                    className="inline-flex items-center rounded-full ring-2 ring-ink"
                    role="group"
                    aria-label={`Menge ${line.title}`}
                  >
                    <button
                      type="button"
                      className="h-8 w-8 rounded-full font-bold hover:bg-sky/50"
                      onClick={() => setQuantity(line.handle, line.quantity - 1)}
                      aria-label={`${line.title}: eins weniger`}
                    >
                      −
                    </button>
                    <span className="w-8 text-center font-semibold" aria-live="polite">
                      {line.quantity}
                    </span>
                    <button
                      type="button"
                      className="h-8 w-8 rounded-full font-bold hover:bg-sky/50"
                      onClick={() => setQuantity(line.handle, line.quantity + 1)}
                      aria-label={`${line.title}: eins mehr`}
                    >
                      +
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => remove(line.handle)}
                    className="text-sm font-semibold text-muted underline-offset-2 hover:text-ink hover:underline"
                  >
                    Entfernen
                  </button>
                </div>
              )}
            </div>
          </li>
        ))}
      </ul>

      <FreeShippingProgress subtotalCents={order.subtotalCents} className="mt-2" />

      <dl className="mt-5 space-y-2 text-base">
        <div className="flex justify-between">
          <dt className="text-muted">Zwischensumme</dt>
          <dd>{money(order.subtotalCents)}</dd>
        </div>
        <div className="flex justify-between">
          <dt className="text-muted">Versand</dt>
          <dd>{order.shippingCents === 0 ? "kostenlos" : money(order.shippingCents)}</dd>
        </div>
        <div className="flex items-baseline justify-between border-t border-ink/10 pt-3">
          <dt className="font-display text-xl font-extrabold">Gesamtsumme</dt>
          <dd className="font-display text-2xl font-extrabold">{money(order.totalCents)}</dd>
        </div>
      </dl>
      <p className="mt-1 text-sm text-muted">
        {kleinunternehmer
          ? "Gemäß § 19 UStG wird keine Umsatzsteuer berechnet."
          : `inkl. ${Math.round(siteConfig.legal.vatRate * 100)} % MwSt. (${money(order.vatCents)})`}
      </p>
      <p className="mt-1 text-sm text-muted">
        <Rich text={siteConfig.legal.deliveryTime} />
      </p>

      {children}
    </div>
  );
}
