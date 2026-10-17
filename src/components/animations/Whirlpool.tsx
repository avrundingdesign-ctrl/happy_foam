"use client";

import { motion } from "motion/react";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { Mascot } from "@/components/brand/Mascot";

/** Animierter Strudel für die 404-Seite. */
export function Whirlpool() {
  const reduce = useReducedMotion();
  return (
    <div
      className="relative mx-auto aspect-square w-full max-w-[340px] overflow-hidden rounded-full"
      aria-hidden="true"
    >
      <motion.svg
        viewBox="0 0 300 300"
        className="absolute inset-0 h-full w-full"
        animate={reduce ? undefined : { rotate: 360 }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
      >
        <circle cx="150" cy="150" r="140" fill="#BFE6FF" stroke="#0F1B2D" strokeWidth="5" />
        {Array.from({ length: 5 }, (_, i) => (
          <path
            key={i}
            d="M150 150 C150 110 190 90 220 110 C250 130 250 180 220 210"
            fill="none"
            stroke={i % 2 ? "#FFFFFF" : "#7CC8F5"}
            strokeWidth={10 - i}
            strokeLinecap="round"
            transform={`rotate(${i * 72} 150 150)`}
          />
        ))}
        <circle cx="150" cy="150" r="14" fill="#0F1B2D" opacity="0.8" />
      </motion.svg>
      <motion.div
        className="absolute top-1/2 left-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2"
        animate={reduce ? undefined : { rotate: [0, -360], scale: [1, 0.55, 1] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        <Mascot mood="oops" className="h-full w-full" />
      </motion.div>
    </div>
  );
}
