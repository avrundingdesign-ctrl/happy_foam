import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { LegalPage } from "@/components/ui/LegalPage";

export const metadata: Metadata = pageMetadata({
  title: "Impressum",
  description: "Impressum von HappyFoam (Angaben gemäß § 5 DDG).",
  path: "/impressum",
});

export default function Page() {
  return <LegalPage title="Impressum" doc="impressum" />;
}
