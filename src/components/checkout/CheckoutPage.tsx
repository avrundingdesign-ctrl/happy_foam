"use client";

import Link from "next/link";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { siteConfig } from "@config";
import {
  createOrderPayment,
  getCheckoutSettings,
  type CheckoutSettings,
} from "@/app/actions/checkout";
import { useCart } from "@/components/shop/CartProvider";
import { Button } from "@/components/ui/Button";
import { Mascot } from "@/components/brand/Mascot";
import { Field, inputClass } from "@/components/forms/Field";
import { priceOrder } from "@/lib/checkout-math";
import { emptyAddress, validateCustomer, type CheckoutCustomer } from "@/lib/checkout-validation";
import { cn } from "@/lib/cn";
import { AddressFields } from "./AddressFields";
import { OrderSummary } from "./OrderSummary";
import { StripePayment, stripeAppearance, type PaymentApi } from "./StripePayment";

const FORM_KEY = "happyfoam-checkout-form-v1";
const defaultCountry = siteConfig.shop.shipping.countries[0]?.code ?? "DE";

const initialCustomer = (): CheckoutCustomer => ({
  email: "",
  phone: "",
  shipping: emptyAddress(defaultCountry),
  billingDifferent: false,
  billing: emptyAddress(defaultCountry),
});

function Section({
  step,
  title,
  children,
  aside,
}: {
  step: number;
  title: string;
  children: React.ReactNode;
  aside?: React.ReactNode;
}) {
  return (
    <section
      className="rounded-[2rem] bg-bubble p-5 ring-1 ring-ink/5 md:p-7"
      aria-labelledby={`step-${step}`}
    >
      <div className="mb-5 flex items-center justify-between gap-3">
        <h2
          id={`step-${step}`}
          className="flex items-center gap-3 font-display text-xl font-extrabold md:text-2xl"
        >
          <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-mint text-base">
            {step}
          </span>
          {title}
        </h2>
        {aside}
      </div>
      {children}
    </section>
  );
}

export function CheckoutPage() {
  const { lines, ready } = useCart();
  const [settings, setSettings] = useState<CheckoutSettings | null>(null);
  const [customer, setCustomer] = useState<CheckoutCustomer>(initialCustomer);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [message, setMessage] = useState<{ text: string; tone: "error" | "info" } | null>(null);
  const [pending, setPending] = useState(false);
  const paymentApi = useRef<PaymentApi | null>(null);
  const lastIntent = useRef<{ key: string; clientSecret: string } | null>(null);

  useEffect(() => {
    getCheckoutSettings()
      .then(setSettings)
      .catch(() => setSettings({ mode: "demo", publishableKey: null }));
    // Eingaben der laufenden Sitzung wiederherstellen (z. B. nach abgebrochener Zahlung)
    try {
      const saved = window.sessionStorage.getItem(FORM_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect -- einmalige Wiederherstellung nach dem Mount
      if (saved) setCustomer({ ...initialCustomer(), ...(JSON.parse(saved) as CheckoutCustomer) });
    } catch {
      /* ignorieren */
    }
  }, []);

  useEffect(() => {
    try {
      window.sessionStorage.setItem(FORM_KEY, JSON.stringify(customer));
    } catch {
      /* ignorieren */
    }
  }, [customer]);

  const order = useMemo(
    () =>
      priceOrder(
        lines.map((l) => ({ handle: l.handle, quantity: l.quantity })),
        customer.shipping.country,
      ),
    [lines, customer.shipping.country],
  );

  const publishableKey = settings?.publishableKey ?? null;
  const stripePromise = useMemo(
    () => (publishableKey ? loadStripe(publishableKey, { locale: "de" }) : null),
    [publishableKey],
  );

  const update = (patch: Partial<CheckoutCustomer>) => setCustomer((c) => ({ ...c, ...patch }));

  const focusFirstError = (errs: Record<string, string>) => {
    const first = Object.keys(errs)[0];
    if (!first) return;
    const el = document.getElementById(first.replace(".", "-"));
    el?.focus();
    el?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (pending) return;
    setMessage(null);

    const { errors: localErrors } = validateCustomer(customer);
    setErrors(localErrors);
    if (Object.keys(localErrors).length) {
      setMessage({ text: "Bitte prüfe die markierten Felder.", tone: "error" });
      focusFirstError(localErrors);
      return;
    }

    setPending(true);
    try {
      const api = paymentApi.current;
      if (api) {
        const paymentError = await api.validate();
        if (paymentError) {
          setMessage({ text: paymentError, tone: "error" });
          return;
        }
      }

      // Bei erneutem Versuch mit unveränderten Daten dieselbe Zahlung wiederverwenden
      const key = JSON.stringify({ lines: order.lines, customer, total: order.totalCents });
      let clientSecret = lastIntent.current?.key === key ? lastIntent.current.clientSecret : null;

      if (!clientSecret) {
        const res = await createOrderPayment({
          ...customer,
          lines: order.lines.map((l) => ({ handle: l.handle, quantity: l.quantity })),
          expectedTotalCents: order.totalCents,
        });
        if (!res.ok) {
          if (res.errors) {
            setErrors(res.errors);
            focusFirstError(res.errors);
          }
          setMessage({ text: res.message, tone: res.demo ? "info" : "error" });
          return;
        }
        clientSecret = res.clientSecret;
        lastIntent.current = { key, clientSecret };
      }

      if (!api) {
        setMessage({
          text: "Die Zahlungsarten werden noch geladen. Bitte versuch es gleich noch einmal.",
          tone: "error",
        });
        return;
      }

      const billing = customer.billingDifferent ? customer.billing : customer.shipping;
      const confirmError = await api.confirm(clientSecret, {
        name: `${billing.firstName} ${billing.lastName}`.trim(),
        email: customer.email.trim(),
        address: {
          line1: billing.street,
          line2: billing.addressLine2,
          postal_code: billing.zip,
          city: billing.city,
          country: billing.country,
          state: "",
        },
      });
      // Hierher kommen wir nur, wenn die Zahlung sofort scheitert (z. B. Karte abgelehnt)
      if (confirmError) setMessage({ text: confirmError, tone: "error" });
    } catch (err) {
      console.error(err);
      setMessage({
        text: "Da ist etwas schiefgelaufen. Bitte versuch es noch einmal.",
        tone: "error",
      });
    } finally {
      setPending(false);
    }
  };

  // --- Zustände vor dem eigentlichen Formular ---------------------------------
  if (!ready) {
    return (
      <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3" role="status">
        <Mascot className="h-16 w-16 animate-bounce motion-reduce:animate-none" />
        <p className="font-display text-lg font-bold text-muted">Kasse wird vorbereitet …</p>
      </div>
    );
  }

  if (order.lines.length === 0) {
    return (
      <div className="mx-auto flex max-w-md flex-col items-center gap-4 py-16 text-center">
        <Mascot mood="shh" className="h-24 w-24" />
        <h2 className="font-display text-2xl font-extrabold">Dein Warenkorb ist leer.</h2>
        <p className="text-muted">Hier ist es noch sehr still. Zu still, fast.</p>
        <Button href="/shop" size="lg">
          Zum Shop
        </Button>
      </div>
    );
  }

  const demo = settings?.mode === "demo";
  const emailError = errors.email;
  const phoneError = errors.phone;

  const form = (
    <form
      onSubmit={onSubmit}
      noValidate
      className="grid items-start gap-6 lg:grid-cols-[1.35fr_1fr] lg:gap-8"
    >
      <div className="flex flex-col gap-6">
        {settings?.mode === "test" && (
          <p className="rounded-2xl border-2 border-dashed border-ink/30 bg-sun/40 px-4 py-3 text-sm">
            <strong>Testmodus:</strong> Es wird kein echtes Geld abgebucht. Testkarte: 4242 4242
            4242 4242, beliebiges Ablaufdatum in der Zukunft, beliebige Prüfziffer.
          </p>
        )}

        <Section step={1} title="Kontakt">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              id="email"
              label="E-Mail"
              error={emailError}
              hint="Hierhin schicken wir die Bestellbestätigung."
            >
              <input
                id="email"
                type="email"
                value={customer.email}
                onChange={(e) => update({ email: e.target.value })}
                autoComplete="email"
                className={inputClass}
                aria-invalid={emailError ? true : undefined}
                aria-describedby={emailError ? "email-error" : "email-hint"}
              />
            </Field>
            <Field
              id="phone"
              label="Telefon"
              optional
              error={phoneError}
              hint="Nur für Rückfragen zur Lieferung."
            >
              <input
                id="phone"
                type="tel"
                value={customer.phone}
                onChange={(e) => update({ phone: e.target.value })}
                autoComplete="tel"
                className={inputClass}
                aria-invalid={phoneError ? true : undefined}
                aria-describedby={phoneError ? "phone-error" : "phone-hint"}
              />
            </Field>
          </div>
        </Section>

        <Section step={2} title="Lieferadresse">
          <AddressFields
            prefix="shipping"
            autocompleteSection="shipping"
            value={customer.shipping}
            onChange={(shipping) => update({ shipping })}
            errors={errors}
          />
          <label className="mt-5 flex cursor-pointer items-center gap-3 font-semibold">
            <input
              type="checkbox"
              checked={customer.billingDifferent}
              onChange={(e) => update({ billingDifferent: e.target.checked })}
              className="h-5 w-5 accent-[#0A7A60]"
            />
            Rechnungsadresse weicht von der Lieferadresse ab
          </label>
          {customer.billingDifferent && (
            <div className="mt-5 rounded-3xl bg-foam p-4 md:p-5">
              <h3 className="mb-4 font-display text-lg font-bold">Rechnungsadresse</h3>
              <AddressFields
                prefix="billing"
                autocompleteSection="billing"
                value={customer.billing}
                onChange={(billing) => update({ billing })}
                errors={errors}
              />
            </div>
          )}
        </Section>

        <Section
          step={3}
          title="Zahlungsart"
          aside={
            <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted">
              <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
                <path
                  d="M7 10V7a5 5 0 0 1 10 0v3M5 10h14v10H5z"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinejoin="round"
                />
              </svg>
              Sicher über Stripe
            </span>
          }
        >
          {settings === null ? (
            <div
              className="h-40 animate-pulse rounded-2xl bg-foam"
              aria-label="Zahlungsarten werden geladen"
            />
          ) : demo ? (
            <div className="rounded-2xl border-2 border-dashed border-ink/25 bg-foam p-5">
              <p className="font-semibold">Hier erscheinen die Zahlungsarten:</p>
              <p className="mt-1 text-muted">{siteConfig.paymentMethods.join(" · ")}</p>
              <p className="mt-3 text-sm text-muted">
                Demo-Modus: Stripe ist noch nicht verbunden (siehe README, Abschnitt „Stripe
                verbinden“).
              </p>
            </div>
          ) : (
            <StripePayment apiRef={paymentApi} />
          )}
        </Section>
      </div>

      <div className="lg:sticky lg:top-24">
        <OrderSummary order={order}>
          <div className="mt-6 border-t border-ink/10 pt-5">
            <p className="text-sm leading-relaxed text-muted">
              Mit Klick auf „Zahlungspflichtig bestellen“ gibst du eine verbindliche Bestellung ab.
              Es gelten unsere{" "}
              <Link
                href="/agb"
                target="_blank"
                className="font-semibold text-ink underline underline-offset-2"
              >
                AGB
              </Link>
              . Infos zu deinem Widerrufsrecht findest du in der{" "}
              <Link
                href="/widerruf"
                target="_blank"
                className="font-semibold text-ink underline underline-offset-2"
              >
                Widerrufsbelehrung
              </Link>
              , zum Umgang mit deinen Daten in der{" "}
              <Link
                href="/datenschutz"
                target="_blank"
                className="font-semibold text-ink underline underline-offset-2"
              >
                Datenschutzerklärung
              </Link>
              .
            </p>
            {message && (
              <p
                role={message.tone === "error" ? "alert" : "status"}
                className={cn(
                  "mt-4 rounded-2xl px-4 py-3 text-sm font-semibold",
                  message.tone === "error" ? "bg-blush/25" : "bg-sun/40",
                )}
              >
                {message.text}
              </p>
            )}
            <Button
              type="submit"
              size="lg"
              className="mt-4 w-full"
              disabled={pending || settings === null}
            >
              {pending ? "Einen Moment …" : "Zahlungspflichtig bestellen"}
            </Button>
            <ul className="mt-4 grid gap-1.5 text-sm text-muted">
              <li>🔒 Verschlüsselte Zahlung über Stripe</li>
              <li>📦 Diskreter, neutraler Versand</li>
              <li>↩️ Gesetzliches Widerrufsrecht</li>
            </ul>
          </div>
        </OrderSummary>
      </div>
    </form>
  );

  if (stripePromise && !demo) {
    return (
      <Elements
        stripe={stripePromise}
        options={{
          mode: "payment",
          amount: order.totalCents,
          currency: "eur",
          appearance: stripeAppearance,
          locale: "de",
        }}
      >
        {form}
      </Elements>
    );
  }
  return form;
}
