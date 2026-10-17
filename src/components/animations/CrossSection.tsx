"use client";

import { motion } from "motion/react";
import { useReducedMotion } from "@/lib/useReducedMotion";

/** Animierte Querschnitt-Grafik: Wasser ohne vs. mit Schaumschicht. */
const fall = { duration: 1.1, repeat: Infinity, repeatDelay: 0.9, ease: "easeIn" as const };

function Panel({ foam, reduce }: { foam: boolean; reduce: boolean | null }) {
  return (
    <figure className="rounded-[2rem] bg-bubble p-4 ring-1 ring-ink/10 md:p-6">
      <svg viewBox="0 0 240 220" className="h-auto w-full" aria-hidden="true">
        {/* Keramik */}
        <path
          d="M20 60 L20 170 Q20 206 56 206 L184 206 Q220 206 220 170 L220 60"
          fill="#FFFFFF"
          stroke="#0F1B2D"
          strokeWidth="4"
        />
        {/* Wasser */}
        <rect x="24" y="120" width="192" height="82" rx="10" fill="#BFE6FF" />
        <path
          d="M24 120 Q60 114 96 120 T168 120 T216 120"
          fill="none"
          stroke="#0F1B2D"
          strokeWidth="2.5"
        />
        {/* Schaum */}
        {foam &&
          Array.from({ length: 13 }, (_, i) => (
            <circle
              key={i}
              cx={30 + i * 15}
              cy={112 - (i % 3) * 4}
              r={11 + (i % 2) * 4}
              fill="#FFFFFF"
              stroke="#BFE6FF"
              strokeWidth="2"
            />
          ))}
        {/* Tropfen */}
        <motion.path
          d="M120 10 C126 22 130 28 130 34 a10 10 0 0 1 -20 0 C110 28 114 22 120 10 Z"
          fill="#3DDCB4"
          stroke="#0F1B2D"
          strokeWidth="2.5"
          animate={reduce ? undefined : { y: foam ? [0, 72, 76] : [0, 84, 84], opacity: [1, 1, 0] }}
          transition={{ ...fall, times: [0, 0.85, 1] }}
        />
        {/* Wirkung */}
        {!foam &&
          !reduce &&
          [-1, 1].map((dir) => (
            <motion.circle
              key={dir}
              cx={120}
              cy={116}
              r={4}
              fill="#BFE6FF"
              stroke="#0F1B2D"
              strokeWidth="1.5"
              animate={{ x: [0, dir * 30, dir * 44], y: [0, -40, -6], opacity: [0, 1, 0] }}
              transition={{ duration: 0.7, delay: 0.95, repeat: Infinity, repeatDelay: 1.3 }}
            />
          ))}
        {!reduce && (
          <motion.g
            animate={{ opacity: [0, foam ? 0.25 : 1, 0], scale: [0.8, foam ? 0.9 : 1.15, 1.2] }}
            transition={{ duration: 0.8, delay: 0.95, repeat: Infinity, repeatDelay: 1.2 }}
            style={{ originX: "50%", originY: "50%" }}
          >
            <path
              d="M160 70 q10 10 0 20 M172 62 q16 18 0 36 M184 54 q22 26 0 52"
              fill="none"
              stroke="#FF8FB1"
              strokeWidth="4"
              strokeLinecap="round"
            />
          </motion.g>
        )}
      </svg>
      <figcaption className="mt-3 text-center font-display text-lg font-bold">
        {foam ? "Mit Schaum: Aufprall gedämpft" : "Ohne Schaum: Plopp & Spritzer"}
      </figcaption>
    </figure>
  );
}

export function CrossSection() {
  const reduce = useReducedMotion();
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Panel foam={false} reduce={reduce} />
      <Panel foam reduce={reduce} />
    </div>
  );
}
