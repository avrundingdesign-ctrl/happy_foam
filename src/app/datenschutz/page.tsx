import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { LegalPage } from "@/components/ui/LegalPage";

export const metadata: Metadata = pageMetadata({
  title: "Datenschutzerklärung",
  description: "Datenschutzerklärung von HappyFoam.",
  path: "/datenschutz",
});

export default function Page() {
  return <LegalPage title="Datenschutzerklärung" doc="datenschutz" />;
}
