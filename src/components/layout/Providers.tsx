"use client";

import { MotionConfig } from "motion/react";
import type { ReactNode } from "react";
import { CartProvider } from "@/components/shop/CartProvider";
import { CartDrawer } from "@/components/shop/CartDrawer";

export function Providers({ children }: { children: ReactNode }) {
  return (
    // reducedMotion="user": Bewegungen werden bei prefers-reduced-motion automatisch abgeschaltet
    <MotionConfig reducedMotion="user">
      <CartProvider>
        {children}
        <CartDrawer />
      </CartProvider>
    </MotionConfig>
  );
}
