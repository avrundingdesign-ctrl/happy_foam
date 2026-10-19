"use client";

import { PaymentElement, useElements, useStripe } from "@stripe/react-stripe-js";
import type { Appearance } from "@stripe/stripe-js";
import { useEffect, type MutableRefObject } from "react";

export type BillingDetails = {
  name: string;
  email: string;
  phone?: string;
  address: {
    line1: string;
    line2: string;
    postal_code: string;
    city: string;
    country: string;
    state: string;
  };
};

/** Schnittstelle, über die die Kassen-Seite die Zahlung auslöst. */
export type PaymentApi = {
  /** Prüft die Eingaben im Zahlungsbereich (und öffnet ggf. Apple Pay / Google Pay). */
  validate: () => Promise<string | null>;
  /** Bestätigt die Zahlung; leitet danach zur Bestätigungsseite (oder z. B. zu PayPal) weiter. */
  confirm: (clientSecret: string, billing: BillingDetails) => Promise<string | null>;
};

/** Stripe-Elements im HappyFoam-Look. */
export const stripeAppearance: Appearance = {
  theme: "stripe",
  labels: "above",
  variables: {
    colorPrimary: "#0A7A60",
    colorBackground: "#ffffff",
    colorText: "#0F1B2D",
    colorTextSecondary: "#5B6B80",
    colorDanger: "#C2255C",
    fontFamily: "Inter, ui-sans-serif, system-ui, -apple-system, Segoe UI, sans-serif",
    fontSizeBase: "16px",
    borderRadius: "16px",
    spacingUnit: "4px",
  },
  rules: {
    ".Input": { border: "2px solid rgba(15,27,45,0.15)", boxShadow: "none", padding: "12px 14px" },
    ".Input:focus": { border: "2px solid #0F1B2D", boxShadow: "0 0 0 3px rgba(61,220,180,0.35)" },
    ".Label": { fontWeight: "600", color: "#0F1B2D" },
    ".AccordionItem": { border: "2px solid rgba(15,27,45,0.12)", boxShadow: "none" },
    ".AccordionItem--selected": { borderColor: "#0F1B2D" },
  },
};

export function StripePayment({ apiRef }: { apiRef: MutableRefObject<PaymentApi | null> }) {
  const stripe = useStripe();
  const elements = useElements();

  useEffect(() => {
    if (!stripe || !elements) {
      apiRef.current = null;
      return;
    }
    apiRef.current = {
      validate: async () => {
        const { error } = await elements.submit();
        return error?.message ?? null;
      },
      confirm: async (clientSecret, billing) => {
        const { error } = await stripe.confirmPayment({
          elements,
          clientSecret,
          confirmParams: {
            return_url: `${window.location.origin}/bestellung/abgeschlossen`,
            payment_method_data: { billing_details: billing },
          },
        });
        // Nur bei sofortigen Fehlern landen wir hier – sonst leitet Stripe weiter.
        return error?.message ?? "Die Zahlung konnte nicht abgeschlossen werden.";
      },
    };
    return () => {
      apiRef.current = null;
    };
  }, [stripe, elements, apiRef]);

  return (
    <PaymentElement
      options={{
        layout: {
          type: "accordion",
          defaultCollapsed: false,
          radios: "always",
          spacedAccordionItems: true,
        },
        // Name, E-Mail und Adresse kennen wir schon aus dem Formular darüber
        fields: { billingDetails: { name: "never", email: "never", address: "never" } },
        business: { name: "HappyFoam" },
        wallets: { applePay: "auto", googlePay: "auto" },
      }}
    />
  );
}
