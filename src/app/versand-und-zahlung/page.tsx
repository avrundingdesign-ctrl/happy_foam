import type { Metadata } from "next";
import { siteConfig } from "@config";
import { pageMetadata } from "@/lib/seo";
import { formatPrice } from "@/lib/price";
import { LegalPage } from "@/components/ui/LegalPage";
import { Rich } from "@/components/ui/Rich";

export const metadata: Metadata = pageMetadata({
  title: "Versand & Zahlung",
  description: "Versandkosten, Lieferzeiten und Zahlungsarten bei HappyFoam.",
  path: "/versand-und-zahlung",
});

export default function Page() {
  const { shipping } = siteConfig.shop;
  return (
    <LegalPage title="Versand & Zahlung" doc="versand">
      <h2>Versandkosten</h2>
      <ul>
        {shipping.countries.map((c) => (
          <li key={c.code}>
            {c.name}: {formatPrice(c.cost)}
          </li>
        ))}
        {shipping.freeFrom != null && (
          <li>Versandkostenfrei ab einem Bestellwert von {formatPrice(shipping.freeFrom)}.</li>
        )}
        <li>Wir liefern derzeit nur nach {shipping.countries.map((c) => c.name).join(", ")}.</li>
      </ul>
      <h2>Lieferzeit</h2>
      <p>
        <Rich text={siteConfig.legal.deliveryTime} />. Versand in neutraler Verpackung.
      </p>
      <h2>Zahlungsarten</h2>
      <p>
        {siteConfig.paymentMethods.join(", ")} sowie weitere im Bestellprozess angezeigte
        Zahlungsarten. Die Zahlung wird sicher über unseren Zahlungsdienstleister Stripe
        abgewickelt.
      </p>
    </LegalPage>
  );
}
