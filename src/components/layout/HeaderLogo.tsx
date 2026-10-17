"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Logo } from "@/components/brand/Logo";

const CONFETTI = Array.from({ length: 42 }, (_, i) => ({
  left: (i * 23.7) % 100,
  size: 10 + ((i * 7) % 26),
  delay: (i % 10) * 0.07,
  drift: ((i % 7) - 3) * 22,
  duration: 1.8 + (i % 5) * 0.25,
  color: ["#FFFFFF", "#BFE6FF", "#3DDCB4", "#FF8FB1", "#FFD84D"][i % 5],
}));

/**
 * Logo mit Easter Egg: Fünfmal schnell klicken löst einen
 * Blasen-Konfettiregen aus – „Okay, jetzt war's laut.“
 */
export function HeaderLogo() {
  const clicks = useRef<number[]>([]);
  const [party, setParty] = useState(0);
  const reduce = useReducedMotion();

  const onClick = () => {
    const now = Date.now();
    clicks.current = [...clicks.current.filter((t) => now - t < 2500), now];
    if (clicks.current.length >= 5) {
      clicks.current = [];
      const id = now;
      setParty(id);
      window.setTimeout(() => setParty((p) => (p === id ? 0 : p)), 3200);
    }
  };

  return (
    <>
      <Link
        href="/"
        onClick={onClick}
        className="rounded-xl text-2xl md:text-[1.7rem]"
        aria-label="HappyFoam – zur Startseite"
      >
        <Logo />
      </Link>
      {party !== 0 &&
        createPortal(
          <motion.div
            key={party}
            className="pointer-events-none fixed inset-0 z-[80] overflow-hidden"
            initial={{ opacity: 1 }}
            animate={{ opacity: [1, 1, 0] }}
            transition={{ duration: 3.2, times: [0, 0.85, 1] }}
          >
            {!reduce &&
              CONFETTI.map((c, i) => (
                <motion.span
                  key={i}
                  className="absolute top-0 block rounded-full border border-ink/20"
                  style={{
                    left: `${c.left}%`,
                    width: c.size,
                    height: c.size,
                    background: `radial-gradient(circle at 32% 30%, #fff 0 18%, ${c.color} 19%)`,
                  }}
                  initial={{ y: -60, x: 0, opacity: 1 }}
                  animate={{ y: "105vh", x: c.drift, opacity: [1, 1, 0.8] }}
                  transition={{ duration: c.duration, delay: c.delay, ease: "easeIn" }}
                />
              ))}
            <motion.p
              role="status"
              className="absolute top-1/3 left-1/2 -translate-x-1/2 rounded-full border-2 border-ink bg-sun px-6 py-3 font-display text-2xl font-extrabold whitespace-nowrap text-ink shadow-[4px_4px_0_0_#0F1B2D]"
              initial={{ scale: reduce ? 1 : 0.4, opacity: 0, rotate: -4 }}
              animate={{ scale: 1, opacity: 1, rotate: -4 }}
              transition={{ type: "spring", stiffness: 300, damping: 14 }}
            >
              Okay, jetzt war&apos;s laut.
            </motion.p>
          </motion.div>,
          document.body,
        )}
    </>
  );
}
