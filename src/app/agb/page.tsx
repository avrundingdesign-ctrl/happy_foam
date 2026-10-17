import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { LegalPage } from "@/components/ui/LegalPage";

export const metadata: Metadata = pageMetadata({
  title: "Allgemeine Geschäftsbedingungen",
  description: "Allgemeine Geschäftsbedingungen von HappyFoam.",
  path: "/agb",
});

export default function Page() {
  return <LegalPage title="Allgemeine Geschäftsbedingungen" placeholder="[AGB]" />;
}
