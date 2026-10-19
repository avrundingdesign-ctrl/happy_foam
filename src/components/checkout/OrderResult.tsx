"use client";

import { useSearchParams } from "next/navigation";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { getOrderStatus, type OrderStatusResult } from "@/app/actions/checkout";
import { useCart } from "@/components/shop/CartProvider";
import { Mascot } from "@/components/brand/Mascot";
import { Button } from "@/components/ui/Button";
import { Sticker } from "@/components/ui/Sticker";
import { formatPrice } from "@/lib/price";
import { useReducedMotion } from "@/lib/useReducedMotion";

const money = (cents: number) => formatPrice(cents / 100);

const BUBBLES = Array.from({ length: 18 }, (_, i) => ({
  x: ((i * 37) % 100) - 50,
  size: 14 + ((i * 11) % 30),
  delay: (i % 6) * 0.08,
}));

function Celebration() {
  const reduce = useReducedMotion();
  if (reduce) return null;
  return (
    <div
      className="pointer-events-none absolute inset-x-0 top-0 h-64 overflow-visible"
      aria-hidden="true"
    >
      {BUBBLES.map((b, i) => (
        <motion.span
          key={i}
          className="bubble-deco absolute top-28 left-1/2 block ring-1 ring-ink/10"
          style={{ width: b.size, height: b.size }}
          initial={{ x: 0, y: 0, opacity: 0, scale: 0.3 }}
          animate={{ x: b.x * 5, y: -140 - (i % 5) * 30, opacity: [0, 1, 0], scale: 1 }}
          transition={{ duration: 1.8, delay: b.delay, ease: "easeOut" }}
        />
      ))}
    </div>
  );
}

export function OrderResult() {
  const params = useSearchParams();
  const { clear } = useCart();
  const [result, setResult] = useState<OrderStatusResult | "loading">("loading");

  const id = params.get("payment_intent") ?? "";
  const secret = params.get("payment_intent_client_secret") ?? "";

  useEffect(() => {
    if (!id || !secret) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- ohne Parameter gibt es nichts zu laden
      setResult({ ok: false });
      return;
    }
    getOrderStatus(id, secret)
      .then(setResult)
      .catch(() => setResult({ ok: false }));
  }, [id, secret]);

  const paidOrProcessing =
    result !== "loading" &&
    result.ok &&
    (result.status === "succeeded" || result.status === "processing");

  useEffect(() => {
    if (paidOrProcessing) {
      clear();
      try {
        window.sessionStorage.removeItem("happyfoam-checkout-form-v1");
      } catch {
        /* ignorieren */
      }
    }
  }, [paidOrProcessing, clear]);

  if (result === "loading") {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4" role="status">
        <Mascot className="h-20 w-20 animate-bounce motion-reduce:animate-none" />
        <p className="font-display text-xl font-bold text-muted">
          Wir schauen kurz nach deiner Bestellung …
        </p>
      </div>
    );
  }

  if (!result.ok) {
    return (
      <div className="mx-auto flex max-w-lg flex-col items-center gap-4 py-16 text-center">
        <Mascot mood="oops" className="h-24 w-24" />
        <h1 className="font-display text-3xl font-extrabold">Hier ist nichts zu finden.</h1>
        <p className="text-muted">
          Wir konnten keine Bestellung zu diesem Link finden. Falls du gerade bezahlt hast, schau in
          dein E-Mail-Postfach oder schreib uns.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Button href="/">Zur Startseite</Button>
          <Button href="/kontakt" variant="secondary">
            Kontakt
          </Button>
        </div>
      </div>
    );
  }

  if (result.status === "succeeded" || result.status === "processing") {
    const processing = result.status === "processing";
    return (
      <div className="relative mx-auto max-w-2xl py-10 text-center">
        {!processing && <Celebration />}
        <Mascot mood="wink" className="relative mx-auto h-28 w-28" />
        {result.testMode && (
          <Sticker tone="sun" rotate={-3} className="mt-4">
            Testbestellung – kein echtes Geld
          </Sticker>
        )}
        <h1 className="mt-6 font-display text-[clamp(2.2rem,6vw,3.5rem)] leading-tight font-extrabold">
          {processing
            ? "Bestellung eingegangen!"
            : `Danke${result.firstName ? `, ${result.firstName}` : ""}! Psst – ist unterwegs.`}
        </h1>
        <p className="mx-auto mt-4 max-w-lg text-lg text-muted">
          {processing
            ? "Deine Zahlung wird gerade noch bestätigt (das kann bei Lastschrift ein paar Tage dauern). Sobald sie da ist, bekommst du eine E-Mail und wir verschicken dein Paket."
            : `Deine Bestellbestätigung ist auf dem Weg an ${result.email}. Wir packen dein Paket diskret und schicken es so schnell wie möglich los.`}
        </p>

        <div className="mt-8 rounded-[2rem] bg-bubble p-6 text-left ring-1 ring-ink/5 md:p-8">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <p className="text-muted">Bestellnummer</p>
            <p className="font-display text-xl font-extrabold">{result.orderNumber}</p>
          </div>
          <ul className="mt-4 divide-y divide-ink/10">
            {result.lines.map((l) => (
              <li key={l.title} className="flex justify-between py-3">
                <span>
                  {l.quantity} × {l.title}
                </span>
                <span className="font-semibold">{money(l.totalCents)}</span>
              </li>
            ))}
            <li className="flex justify-between py-3 text-muted">
              <span>Versand</span>
              <span>{result.shippingCents === 0 ? "kostenlos" : money(result.shippingCents)}</span>
            </li>
            <li className="flex justify-between pt-3 font-display text-xl font-extrabold">
              <span>Gesamt</span>
              <span>{money(result.totalCents)}</span>
            </li>
          </ul>
        </div>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button href="/" size="lg">
            Zurück zur Startseite
          </Button>
          <Button href="/so-funktionierts" size="lg" variant="secondary">
            So funktioniert&apos;s
          </Button>
        </div>
      </div>
    );
  }

  // requires_payment_method, canceled o. Ä.
  return (
    <div className="mx-auto flex max-w-lg flex-col items-center gap-4 py-16 text-center">
      <Mascot mood="oops" className="h-24 w-24" />
      <h1 className="font-display text-3xl font-extrabold">Die Zahlung hat nicht geklappt.</h1>
      <p className="text-muted">
        Keine Sorge, es wurde nichts abgebucht und dein Warenkorb ist noch da. Versuch es einfach
        noch einmal – gern auch mit einer anderen Zahlungsart.
      </p>
      <Button href="/kasse" size="lg">
        Zurück zur Kasse
      </Button>
    </div>
  );
}
