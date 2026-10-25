import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Inter } from "next/font/google";
import { siteConfig } from "@config";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Providers } from "@/components/layout/Providers";
import { Analytics } from "@/components/layout/Analytics";
import { CookieBanner } from "@/components/layout/CookieBanner";
import { JsonLd } from "@/lib/seo";
import "./globals.css";

// next/font hostet die Schriften selbst – der Browser lädt nichts von Google-Servern.
const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} – ${siteConfig.claim}`,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  openGraph: {
    type: "website",
    locale: "de_DE",
    siteName: siteConfig.name,
  },
  twitter: { card: "summary_large_image" },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  themeColor: "#F7F9FC",
  colorScheme: "light",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="de" className={`${bricolage.variable} ${inter.variable} antialiased`}>
      <body className="flex min-h-dvh flex-col">
        <JsonLd
          data={{
            "@context": "https://schema.org",
            "@type": "Organization",
            name: siteConfig.name,
            url: siteConfig.url,
            logo: `${siteConfig.url}/brand/happyfoam-logo-entwurf.svg`,
            slogan: siteConfig.claim,
            parentOrganization: {
              "@type": "Organization",
              name: siteConfig.company.firm,
              url: siteConfig.company.firmUrl,
            },
            address: {
              "@type": "PostalAddress",
              addressLocality: siteConfig.city,
              addressCountry: "DE",
            },
            sameAs: siteConfig.social.filter((s) => s.href).map((s) => s.href),
          }}
        />
        <Providers>
          <Header />
          <main id="inhalt" className="flex-1">
            {children}
          </main>
          <Footer />
        </Providers>
        {siteConfig.features.cookieBanner && <CookieBanner />}
        <Analytics />
      </body>
    </html>
  );
}
