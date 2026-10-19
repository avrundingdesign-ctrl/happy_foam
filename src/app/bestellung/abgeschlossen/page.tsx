import type { Metadata } from "next";
import { Suspense } from "react";
import { OrderResult } from "@/components/checkout/OrderResult";

export const metadata: Metadata = {
  title: "Bestellung",
  robots: { index: false, follow: false },
};

export default function OrderCompletePage() {
  return (
    <div className="container-hf pb-24">
      <Suspense fallback={null}>
        <OrderResult />
      </Suspense>
    </div>
  );
}
