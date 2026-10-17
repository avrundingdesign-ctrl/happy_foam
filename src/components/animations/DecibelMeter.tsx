"use client";

import { animate, motion, useInView, useMotionValue } from "motion/react";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { useEffect, useRef, useState } from "react";
import { Rich } from "@/components/ui/Rich";

const LOUD_ANGLE = 68;
const QUIET_ANGLE = -68;

/** Tacho, der beim Hineinscrollen von „Großraumbüro-Alarm“ auf „Bibliothek“ dreht. */
export function DecibelMeter({
  loudLabel,
  quietLabel,
  valueWithout,
  valueWith,
}: {
  loudLabel: string;
  quietLabel: string;
  valueWithout: string;
  valueWith: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const reduce = useReducedMotion();
  const angle = useMotionValue(LOUD_ANGLE);
  const [quiet, setQuiet] = useState(false);

  useEffect(() => {
    if (!inView) return;
    if (reduce) {
      const t = window.setTimeout(() => {
        angle.set(QUIET_ANGLE);
        setQuiet(true);
      }, 600);
      return () => clearTimeout(t);
    }
    // Erst nervös zittern, dann sanft auf „Bibliothek“ sinken
    const controls = animate(angle, [LOUD_ANGLE, 74, 62, 72, 64, 70, LOUD_ANGLE, QUIET_ANGLE], {
      duration: 2.6,
      times: [0, 0.08, 0.16, 0.24, 0.32, 0.4, 0.45, 1],
      ease: "easeInOut",
    });
    const t = window.setTimeout(() => setQuiet(true), 1900);
    return () => {
      controls.stop();
      clearTimeout(t);
    };
  }, [inView, reduce, angle]);

  return (
    <div ref={ref} className="relative mx-auto w-full max-w-md">
      <svg viewBox="0 0 320 200" className="h-auto w-full" aria-hidden="true">
        <defs>
          <linearGradient id="db-arc" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0%" stopColor="#3DDCB4" />
            <stop offset="50%" stopColor="#FFD84D" />
            <stop offset="100%" stopColor="#FF8FB1" />
          </linearGradient>
        </defs>
        {/* Skala */}
        <path
          d="M30 160 A130 130 0 0 1 290 160"
          fill="none"
          stroke="#0F1B2D"
          strokeWidth="34"
          strokeLinecap="round"
        />
        <path
          d="M30 160 A130 130 0 0 1 290 160"
          fill="none"
          stroke="url(#db-arc)"
          strokeWidth="26"
          strokeLinecap="round"
        />
        {Array.from({ length: 11 }, (_, i) => {
          const a = (-90 + (i * 180) / 10) * (Math.PI / 180);
          const r1 = 100;
          const r2 = i % 5 === 0 ? 84 : 90;
          return (
            <line
              key={i}
              x1={Math.round((160 + Math.sin(a) * r1) * 100) / 100}
              y1={Math.round((160 - Math.cos(a) * r1) * 100) / 100}
              x2={Math.round((160 + Math.sin(a) * r2) * 100) / 100}
              y2={Math.round((160 - Math.cos(a) * r2) * 100) / 100}
              stroke="#0F1B2D"
              strokeWidth={i % 5 === 0 ? 4 : 2.5}
              strokeLinecap="round"
            />
          );
        })}
        {/* Nadel */}
        <motion.g style={{ rotate: angle, originX: 0.5, originY: 1 }}>
          <path d="M156 160 L160 52 L164 160 Z" fill="#0F1B2D" />
        </motion.g>
        <circle cx="160" cy="160" r="16" fill="#FFFFFF" stroke="#0F1B2D" strokeWidth="5" />
        <circle cx="160" cy="160" r="5" fill="#0F1B2D" />
      </svg>
      <div className="-mt-2 flex justify-between gap-4 text-sm font-semibold">
        <span
          className={quiet ? "rounded-full bg-mint px-3 py-1 text-ink" : "px-3 py-1 text-muted"}
        >
          {quietLabel}
        </span>
        <span
          className={!quiet ? "rounded-full bg-blush px-3 py-1 text-ink" : "px-3 py-1 text-muted"}
        >
          {loudLabel}
        </span>
      </div>
      <p className="mt-6 text-center font-display text-2xl font-extrabold" aria-live="polite">
        {quiet ? (
          <>
            Mit HappyFoam: <Rich text={valueWith} />
          </>
        ) : (
          <>
            Ohne: <Rich text={valueWithout} />
          </>
        )}
      </p>
    </div>
  );
}
