import type { Metadata } from "next";
import { siteConfig } from "@config";
import { pageMetadata } from "@/lib/seo";
import { LegalPage } from "@/components/ui/LegalPage";
import { Rich } from "@/components/ui/Rich";

export const metadata: Metadata = pageMetadata({
  title: "Versand & Zahlung",
  description: "Versandkosten, Lieferzeiten und Zahlungsarten bei HappyFoam.",
  path: "/versand-und-zahlung",
});

export default function Page() {
  return (
    <LegalPage title="Versand & Zahlung" placeholder="[VERSAND_ZAHLUNG]">
      <h2>Auf einen Blick</h2>
      <ul>
        <li>
          Versandkosten (Deutschland): <Rich text="[VERSANDKOSTEN_DE]" />
        </li>
        <li>
          Versandkostenfrei ab: <Rich text="[VERSANDKOSTENFREI_AB]" />
        </li>
        <li>
          <Rich text={siteConfig.legal.deliveryTime} />
        </li>
        <li>Versand in neutraler Verpackung.</li>
        <li>
          Zahlungsarten: {siteConfig.paymentMethods.join(", ")} (Abwicklung über Shopify Checkout).
        </li>
      </ul>
    </LegalPage>
  );
}
