import Script from "next/script";
import { siteConfig } from "@config";

/** Cookieloses Analytics (Plausible). Standardmäßig aus – siehe site.config.ts. */
export function Analytics() {
  const domain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
  if (!siteConfig.features.analytics || !domain) return null;
  return (
    <Script
      defer
      data-domain={domain}
      src="https://plausible.io/js/script.js"
      strategy="afterInteractive"
    />
  );
}
