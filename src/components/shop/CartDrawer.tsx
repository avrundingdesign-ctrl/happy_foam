"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useTransition } from "react";
import { AnimatePresence, motion } from "motion/react";
import { useCart } from "./CartProvider";
import { formatPrice, taxNote } from "@/lib/price";
import { createCheckout } from "@/app/actions/checkout";
import { Button } from "@/components/ui/Button";
import { Sachet } from "@/components/illustrations/Sachet";
import { Mascot } from "@/components/brand/Mascot";

/** Warenkorb als seitliches Panel (natives <dialog>: Fokusfalle und Escape inklusive). */
export function CartDrawer() {
  const { lines, subtotal, isOpen, close, setQuantity, remove } = useCart();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (isOpen && !dialog.open) {
      dialog.showModal();
      document.body.style.overflow = "hidden";
    } else if (!isOpen && dialog.open) {
      dialog.close();
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const checkout = () => {
    setMessage(null);
    startTransition(async () => {
      const res = await createCheckout(
        lines.map((l) => ({ handle: l.handle, quantity: l.quantity })),
      );
      if (res.ok) {
        window.location.href = res.url;
      } else {
        setMessage(res.message);
      }
    });
  };

  return (
    <dialog
      ref={dialogRef}
      onClose={close}
      onClick={(e) => e.target === dialogRef.current && close()}
      aria-labelledby="cart-title"
      className="fixed inset-0 m-0 ml-auto h-dvh max-h-dvh w-full max-w-md bg-transparent p-0 backdrop:bg-ink/40 backdrop:backdrop-blur-[2px] open:flex"
    >
      <div className="flex h-full w-full flex-col bg-foam shadow-2xl">
        <div className="flex items-center justify-between border-b border-ink/10 px-6 py-5">
          <h2 id="cart-title" className="font-display text-2xl font-extrabold">
            Dein Warenkorb
          </h2>
          <button
            type="button"
            onClick={close}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full ring-2 ring-ink hover:bg-sky/50"
            aria-label="Warenkorb schließen"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
              <path
                d="M5 5l14 14M19 5L5 19"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          {lines.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
              <Mascot mood="shh" className="h-28 w-28" />
              <p className="font-display text-xl font-bold">Hier ist es noch sehr still.</p>
              <p className="text-muted">Zu still, fast. Zeit für ein bisschen Schaum.</p>
              <Button href="/shop" onClick={close}>
                Zum Shop
              </Button>
            </div>
          ) : (
            <ul className="divide-y divide-ink/10">
              <AnimatePresence initial={false}>
                {lines.map((line) => (
                  <motion.li
                    key={line.handle}
                    layout
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="flex gap-4 py-4">
                      <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-bubble ring-1 ring-ink/10">
                        <Sachet color={line.color} className="w-14" />
                      </div>
                      <div className="flex flex-1 flex-col">
                        <div className="flex items-start justify-between gap-2">
                          <Link
                            href={`/produkte/${line.handle}`}
                            onClick={close}
                            className="font-display text-lg font-bold hover:underline"
                          >
                            {line.title}
                          </Link>
                          <span className="font-semibold">
                            {formatPrice(line.price * line.quantity)}
                          </span>
                        </div>
                        <span className="text-sm text-muted">
                          {formatPrice(line.price)} / Stück
                        </span>
                        <div className="mt-auto flex items-center justify-between pt-2">
                          <div
                            className="inline-flex items-center rounded-full ring-2 ring-ink"
                            role="group"
                            aria-label={`Menge ${line.title}`}
                          >
                            <button
                              type="button"
                              className="h-8 w-8 rounded-full font-bold hover:bg-sky/50"
                              onClick={() => setQuantity(line.handle, line.quantity - 1)}
                              aria-label="Eins weniger"
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
                              aria-label="Eins mehr"
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
                      </div>
                    </div>
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
          )}
        </div>

        {lines.length > 0 && (
          <div className="border-t border-ink/10 bg-bubble px-6 py-5">
            <div className="flex items-baseline justify-between">
              <span className="font-semibold">Zwischensumme</span>
              <span className="font-display text-2xl font-extrabold">{formatPrice(subtotal)}</span>
            </div>
            <p className="mt-1 text-sm text-muted">
              {taxNote()}, zzgl.{" "}
              <Link
                href="/versand-und-zahlung"
                onClick={close}
                className="underline underline-offset-2"
              >
                Versandkosten
              </Link>
              . Bezahlung und Rechnung im nächsten Schritt.
            </p>
            {message && (
              <p className="mt-3 rounded-2xl bg-sun/40 px-4 py-3 text-sm" role="status">
                {message}
              </p>
            )}
            <Button className="mt-4 w-full" size="lg" onClick={checkout} disabled={pending}>
              {pending ? "Einen Moment …" : "Zur Kasse"}
            </Button>
            <p className="mt-3 text-center text-xs text-muted">Diskret verpackt. Versprochen.</p>
          </div>
        )}
      </div>
    </dialog>
  );
}
