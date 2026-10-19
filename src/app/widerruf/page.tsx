import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { LegalPage } from "@/components/ui/LegalPage";

export const metadata: Metadata = pageMetadata({
  title: "Widerrufsbelehrung",
  description: "Widerrufsbelehrung und Muster-Widerrufsformular von HappyFoam.",
  path: "/widerruf",
});

export default function Page() {
  return <LegalPage title="Widerrufsbelehrung" doc="widerruf" />;
}
