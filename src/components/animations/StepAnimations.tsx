"use client";

import { motion } from "motion/react";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { Sachet } from "@/components/illustrations/Sachet";

const loop = { repeat: Infinity, repeatDelay: 1.2 };

/** Schritt 1: Sachet wird aufgerissen. */
export function StepTear() {
  const reduce = useReducedMotion();
  return (
    <div className="relative mx-auto h-40 w-40" aria-hidden="true">
      <motion.div
        className="absolute top-12 left-4 w-32"
        animate={reduce ? undefined : { rotate: [0, -4, 0] }}
        transition={{ duration: 1.6, ...loop }}
      >
        <Sachet color="mint" className="w-full" />
      </motion.div>
      {/* abgerissene Ecke */}
      <motion.div
        className="absolute top-11 left-3 h-5 w-8 rounded-sm border-2 border-ink bg-mint"
        animate={
          reduce
            ? undefined
            : {
                x: [0, -10, -14, 0],
                y: [0, -18, -22, 0],
                rotate: [0, -30, -40, 0],
                opacity: [1, 1, 0, 0],
              }
        }
        transition={{ duration: 1.6, times: [0, 0.4, 0.8, 1], ...loop }}
      />
    </div>
  );
}

/** Schritt 2: Pulver rieselt ins Wasser und sprudelt. */
export function StepSprinkle() {
  const reduce = useReducedMotion();
  return (
    <div className="relative mx-auto h-40 w-40" aria-hidden="true">
      <svg viewBox="0 0 160 160" className="absolute inset-0 h-full w-full">
        <ellipse cx="80" cy="122" rx="62" ry="26" fill="#BFE6FF" stroke="#0F1B2D" strokeWidth="3" />
        {!reduce &&
          Array.from({ length: 9 }, (_, i) => (
            <motion.circle
              key={i}
              cx={64 + (i % 3) * 14}
              cy={46}
              r={3}
              fill="#0F1B2D"
              opacity={0.6}
              animate={{ y: [0, 72], opacity: [0.8, 0] }}
              transition={{
                duration: 0.9,
                delay: i * 0.12,
                repeat: Infinity,
                repeatDelay: 0.6,
                ease: "easeIn",
              }}
            />
          ))}
        {!reduce &&
          Array.from({ length: 6 }, (_, i) => (
            <motion.circle
              key={`b${i}`}
              cx={50 + i * 12}
              cy={120}
              r={4 + (i % 3) * 2}
              fill="#FFFFFF"
              stroke="#0F1B2D"
              strokeWidth="1.5"
              animate={{ y: [0, -14, -20], opacity: [0, 1, 0], scale: [0.4, 1, 1.2] }}
              transition={{
                duration: 1.2,
                delay: 0.5 + i * 0.15,
                repeat: Infinity,
                repeatDelay: 0.3,
              }}
            />
          ))}
      </svg>
      <motion.div
        className="absolute top-1 left-12 w-16 rotate-[130deg]"
        animate={reduce ? undefined : { rotate: [120, 140, 120] }}
        transition={{ duration: 1.4, repeat: Infinity }}
      >
        <Sachet color="mint" className="w-full" torn />
      </motion.div>
    </div>
  );
}

/** Schritt 3: Schaumteppich, Uhr zählt 5 Sekunden. */
export function StepFoam() {
  const reduce = useReducedMotion();
  return (
    <div className="relative mx-auto h-40 w-40" aria-hidden="true">
      <svg viewBox="0 0 160 160" className="absolute inset-0 h-full w-full">
        <ellipse cx="80" cy="122" rx="62" ry="26" fill="#BFE6FF" stroke="#0F1B2D" strokeWidth="3" />
        {[
          [44, 118, 12],
          [62, 112, 15],
          [82, 116, 16],
          [102, 112, 13],
          [118, 120, 10],
          [56, 128, 10],
          [92, 128, 11],
          [74, 126, 9],
        ].map(([x, y, r], i) => (
          <motion.circle
            key={i}
            cx={x}
            cy={y}
            r={r}
            fill="#FFFFFF"
            stroke="#BFE6FF"
            strokeWidth="2"
            animate={reduce ? undefined : { scale: [0.9, 1.05, 0.9] }}
            transition={{ duration: 2 + i * 0.2, repeat: Infinity }}
          />
        ))}
        {/* Stoppuhr */}
        <circle cx="80" cy="46" r="28" fill="#FFFFFF" stroke="#0F1B2D" strokeWidth="3.5" />
        <rect x="74" y="12" width="12" height="7" rx="2" fill="#0F1B2D" />
        <motion.line
          x1="80"
          y1="46"
          x2="80"
          y2="26"
          stroke="#FF8FB1"
          strokeWidth="4"
          strokeLinecap="round"
          style={{ originX: "50%", originY: "100%" }}
          animate={reduce ? undefined : { rotate: [0, 360] }}
          transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
        />
        <circle cx="80" cy="46" r="3.5" fill="#0F1B2D" />
      </svg>
    </div>
  );
}
