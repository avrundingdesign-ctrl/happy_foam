"use client";

import { motion } from "motion/react";
import { useReducedMotion } from "@/lib/useReducedMotion";
import type { ReactNode } from "react";

/** Sanftes Hereingleiten beim Scrollen. Bei reduzierter Bewegung nur Einblenden. */
export function Reveal({
  children,
  delay = 0,
  className,
  y = 28,
  as = "div",
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
  y?: number;
  as?: "div" | "li" | "section" | "article";
}) {
  const reduce = useReducedMotion();
  const Comp = motion[as];
  return (
    <Comp
      className={className}
      initial={{ opacity: 0, y: reduce ? 0 : y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2, margin: "0px 0px -40px 0px" }}
      transition={{ duration: reduce ? 0.3 : 0.6, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </Comp>
  );
}
