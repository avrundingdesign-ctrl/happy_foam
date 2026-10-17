"use client";

import { AnimatePresence, motion, useInView } from "motion/react";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { useEffect, useRef, useState } from "react";
import { Sachet } from "@/components/illustrations/Sachet";

type Phase = "loud" | "drop" | "foam" | "quiet";

// Wasserfläche (Ellipse) in SVG-Koordinaten
const W = { cx: 200, cy: 250, rx: 84, ry: 96 };

/** Deterministischer Zufall, damit Server- und Client-Rendering identisch sind. */
function seeded(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

const round = (v: number) => Math.round(v * 100) / 100;

const FOAM = (() => {
  const rand = seeded(42);
  const out: { x: number; y: number; r: number; d: number }[] = [];
  for (let i = 0; i < 64; i++) {
    const a = rand() * Math.PI * 2;
    const dist = Math.sqrt(rand());
    const x = W.cx + Math.cos(a) * W.rx * dist;
    const y = W.cy + Math.sin(a) * W.ry * dist;
    // gerundet, damit Server und Browser exakt dieselben Werte rendern
    out.push({ x: round(x), y: round(y), r: round(12 + rand() * 16), d: dist });
  }
  return out.sort((a, b) => a.d - b.d);
})();

const POWDER = Array.from({ length: 14 }, (_, i) => ({
  x: W.cx - 30 + ((i * 37) % 60),
  delay: (i % 7) * 0.04,
}));

export function HeroAnimation({
  loud = "PLÄTSCHER!",
  quiet = "psst.",
}: {
  loud?: string;
  quiet?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const reduce = useReducedMotion();
  const [phase, setPhase] = useState<Phase>("loud");
  const [run, setRun] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const timers = [
      window.setTimeout(() => setPhase("drop"), reduce ? 1200 : 1500),
      window.setTimeout(() => setPhase("foam"), reduce ? 1300 : 2300),
      window.setTimeout(() => setPhase("quiet"), reduce ? 1400 : 3100),
    ];
    return () => timers.forEach(clearTimeout);
  }, [inView, run, reduce]);

  const replay = () => {
    setPhase("loud");
    setRun((r) => r + 1);
  };

  const isLoud = phase === "loud" || phase === "drop";
  const hasFoam = phase === "foam" || phase === "quiet";

  return (
    <div ref={ref} className="relative mx-auto w-full max-w-[460px]">
      <button
        type="button"
        onClick={replay}
        className="group relative block w-full cursor-pointer rounded-[2.5rem] focus-visible:outline-offset-4"
        aria-label="Nochmal abspielen: Animation vom Plätschern zur Stille"
      >
        <svg viewBox="0 0 400 404" className="h-auto w-full" aria-hidden="true">
          <defs>
            <clipPath id="hero-water">
              <ellipse cx={W.cx} cy={W.cy} rx={W.rx} ry={W.ry} />
            </clipPath>
            <radialGradient id="hero-water-fill" cx="50%" cy="45%" r="60%">
              <stop offset="0%" stopColor="#D8F0FF" />
              <stop offset="100%" stopColor="#8FD0F7" />
            </radialGradient>
            <radialGradient id="hero-foam" cx="35%" cy="30%" r="75%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="75%" stopColor="#F3FAFF" />
              <stop offset="100%" stopColor="#D6EEFF" />
            </radialGradient>
          </defs>

          {/* Spülkasten */}
          <rect
            x="104"
            y="8"
            width="192"
            height="58"
            rx="18"
            fill="#FFFFFF"
            stroke="#0F1B2D"
            strokeWidth="5"
          />
          <rect
            x="180"
            y="26"
            width="40"
            height="18"
            rx="9"
            fill="#BFE6FF"
            stroke="#0F1B2D"
            strokeWidth="3"
          />
          {/* Scharniere */}
          <rect
            x="146"
            y="62"
            width="22"
            height="14"
            rx="4"
            fill="#FFFFFF"
            stroke="#0F1B2D"
            strokeWidth="3.5"
          />
          <rect
            x="232"
            y="62"
            width="22"
            height="14"
            rx="4"
            fill="#FFFFFF"
            stroke="#0F1B2D"
            strokeWidth="3.5"
          />
          {/* Sitz (eiförmig) */}
          <path
            d="M200 70 C290 70 332 150 332 240 C332 336 272 394 200 394 C128 394 68 336 68 240 C68 150 110 70 200 70 Z"
            fill="#FFFFFF"
            stroke="#0F1B2D"
            strokeWidth="5"
          />
          {/* Schüssel innen */}
          <path
            d="M200 104 C266 104 298 166 298 242 C298 318 254 362 200 362 C146 362 102 318 102 242 C102 166 134 104 200 104 Z"
            fill="#EEF4FA"
            stroke="#0F1B2D"
            strokeWidth="4"
          />
          {/* Wasser */}
          <ellipse
            cx={W.cx}
            cy={W.cy}
            rx={W.rx}
            ry={W.ry}
            fill="url(#hero-water-fill)"
            stroke="#0F1B2D"
            strokeWidth="3"
          />

          <g clipPath="url(#hero-water)">
            {/* Wellenringe – nur solange es laut ist */}
            {!reduce &&
              isLoud &&
              [0, 0.6, 1.2].map((delay) => (
                <motion.ellipse
                  key={`${run}-${delay}`}
                  cx={W.cx}
                  cy={W.cy}
                  rx={24}
                  ry={27}
                  fill="none"
                  stroke="#FFFFFF"
                  strokeWidth={4}
                  initial={{ scale: 0.3, opacity: 0.9 }}
                  animate={{ scale: 3.8, opacity: 0 }}
                  transition={{ duration: 1.8, delay, repeat: Infinity, ease: "easeOut" }}
                />
              ))}

            {/* Pulver rieselt */}
            {!reduce &&
              phase === "foam" &&
              POWDER.map((p, i) => (
                <motion.circle
                  key={`${run}-p${i}`}
                  cx={p.x}
                  cy={W.cy - 40}
                  r={2.5}
                  fill="#FFFFFF"
                  initial={{ y: -10, opacity: 1 }}
                  animate={{ y: 40, opacity: 0 }}
                  transition={{ duration: 0.5, delay: p.delay }}
                />
              ))}

            {/* Schaumteppich breitet sich aus */}
            {FOAM.map((b, i) => (
              <motion.g
                key={`${run}-f${i}`}
                initial={false}
                animate={hasFoam ? { scale: 1, opacity: 1 } : { scale: 0, opacity: 0 }}
                transition={
                  reduce
                    ? { duration: 0.6 }
                    : {
                        type: "spring",
                        stiffness: 220,
                        damping: 14,
                        delay: hasFoam ? b.d * 0.7 : 0,
                      }
                }
                style={{ transformOrigin: `${b.x}px ${b.y}px` }}
              >
                <circle
                  cx={b.x}
                  cy={b.y}
                  r={b.r}
                  fill="url(#hero-foam)"
                  stroke="#BFE6FF"
                  strokeWidth="1.5"
                />
                <circle cx={b.x - b.r * 0.35} cy={b.y - b.r * 0.35} r={b.r * 0.22} fill="#FFFFFF" />
              </motion.g>
            ))}
          </g>

          {/* Fallendes Sachet */}
          <AnimatePresence>
            {!reduce && phase === "drop" && (
              <motion.g
                key={`sachet-${run}`}
                initial={{ y: -260, rotate: -30, opacity: 1 }}
                animate={{ y: 0, rotate: 12, opacity: 1 }}
                exit={{ scale: 0.2, opacity: 0, rotate: 40, transition: { duration: 0.3 } }}
                transition={{ type: "spring", stiffness: 140, damping: 13 }}
                style={{ transformOrigin: `${W.cx}px ${W.cy - 40}px` }}
              >
                <Sachet color="mint" x={W.cx - 45} y={W.cy - 70} width={90} height={60} />
              </motion.g>
            )}
          </AnimatePresence>
        </svg>

        {/* Lautmalerei */}
        <div
          className="pointer-events-none absolute inset-x-0 top-[52%] flex -translate-y-1/2 justify-center"
          aria-hidden="true"
        >
          <AnimatePresence mode="wait" initial={false}>
            {isLoud ? (
              <motion.span
                key={`loud-${run}`}
                className="text-shadow-pop font-display text-[clamp(2.2rem,9vw,4rem)] font-extrabold tracking-tight text-blush"
                initial={{ opacity: 0, scale: 0.6 }}
                animate={
                  reduce
                    ? { opacity: 1 }
                    : { opacity: 1, scale: [1, 1.12, 0.96, 1.08, 1], rotate: [-6, 5, -4, 6, -6] }
                }
                exit={
                  reduce
                    ? { opacity: 0 }
                    : { opacity: 0, scale: 0.2, transition: { duration: 0.35 } }
                }
                transition={
                  reduce
                    ? { duration: 0.4 }
                    : { duration: 0.9, repeat: Infinity, ease: "easeInOut" }
                }
              >
                {loud}
              </motion.span>
            ) : (
              <motion.span
                key={`quiet-${run}`}
                className="mt-2 rounded-full bg-bubble/90 px-3 py-1 font-display text-lg font-bold text-muted shadow-sm"
                initial={{ opacity: 0, scale: reduce ? 1 : 0.4 }}
                animate={{ opacity: phase === "quiet" ? 1 : 0, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                {quiet}
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        <span className="absolute right-3 bottom-3 inline-flex items-center gap-1.5 rounded-full bg-ink px-3 py-1.5 text-xs font-semibold text-bubble opacity-90 transition group-hover:opacity-100">
          <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" aria-hidden="true">
            <path
              d="M4 12a8 8 0 1 0 2.4-5.7M4 4v5h5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Nochmal
        </span>
      </button>
      {/* Für Screenreader: was die Animation zeigt */}
      <p className="sr-only">
        {phase === "quiet"
          ? "Schaum bedeckt das Wasser. Aus dem lauten Plätschern ist ein leises Psst geworden."
          : "Eine Toilette von oben, das Wasser plätschert laut."}
      </p>
    </div>
  );
}
