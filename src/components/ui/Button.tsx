"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { useState, type ComponentProps, type MouseEvent, type ReactNode } from "react";
import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "dark" | "ghost" | "blush";
type Size = "md" | "lg" | "sm";

const variants: Record<Variant, string> = {
  primary:
    "bg-mint text-ink shadow-[0_6px_0_0_#0F1B2D] hover:shadow-[0_4px_0_0_#0F1B2D] hover:translate-y-[2px]",
  blush:
    "bg-blush text-ink shadow-[0_6px_0_0_#0F1B2D] hover:shadow-[0_4px_0_0_#0F1B2D] hover:translate-y-[2px]",
  secondary: "bg-bubble text-ink ring-2 ring-ink hover:bg-sky/40",
  dark: "bg-ink text-bubble hover:bg-ink/90",
  ghost: "text-ink hover:bg-ink/5",
};

const sizes: Record<Size, string> = {
  sm: "h-10 px-4 text-sm",
  md: "h-12 px-6 text-base",
  lg: "h-14 px-8 text-lg",
};

const MotionLink = motion.create(Link);

type Burst = { id: number; x: number; y: number };

const BURST_BUBBLES = [
  { dx: -34, dy: -30, s: 10 },
  { dx: 30, dy: -34, s: 8 },
  { dx: 40, dy: 6, s: 6 },
  { dx: -42, dy: 4, s: 7 },
  { dx: 4, dy: -44, s: 9 },
];

/** Lässt beim Klick 3–5 kleine Schaumblasen platzen. */
function BurstLayer({ bursts }: { bursts: Burst[] }) {
  return (
    <span className="pointer-events-none absolute inset-0 overflow-visible" aria-hidden="true">
      <AnimatePresence>
        {bursts.map((b) =>
          BURST_BUBBLES.map((bb, i) => (
            <motion.span
              key={`${b.id}-${i}`}
              className="bubble-deco absolute block ring-1 ring-ink/30"
              style={{ left: b.x - bb.s / 2, top: b.y - bb.s / 2, width: bb.s, height: bb.s }}
              initial={{ opacity: 1, x: 0, y: 0, scale: 0.4 }}
              animate={{ opacity: 0, x: bb.dx, y: bb.dy, scale: 1.3 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.55, ease: "easeOut" }}
            />
          )),
        )}
      </AnimatePresence>
    </span>
  );
}

type CommonProps = {
  variant?: Variant;
  size?: Size;
  className?: string;
  children: ReactNode;
  icon?: ReactNode;
};

type ButtonAsLink = CommonProps & {
  href: string;
  onClick?: (e: MouseEvent<HTMLAnchorElement>) => void;
  target?: string;
  rel?: string;
  prefetch?: boolean;
  "aria-label"?: string;
};
type ButtonAsButton = CommonProps & { href?: undefined } & Omit<
    ComponentProps<"button">,
    "className" | "children"
  >;

/**
 * Pill-Button im Marken-Look. „Plopp“: quetscht sich beim Klick kurz zusammen
 * und lässt kleine Blasen platzen (respektiert prefers-reduced-motion).
 */
export function Button(props: ButtonAsLink | ButtonAsButton) {
  const { variant = "primary", size = "md", className, children, icon } = props;
  const reduce = useReducedMotion();
  const [bursts, setBursts] = useState<Burst[]>([]);

  const burst = (e: MouseEvent<HTMLElement>) => {
    if (reduce) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX ? e.clientX - rect.left : rect.width / 2;
    const y = e.clientY ? e.clientY - rect.top : rect.height / 2;
    const id = Date.now();
    setBursts((b) => [...b, { id, x, y }]);
    window.setTimeout(() => setBursts((b) => b.filter((x) => x.id !== id)), 650);
  };

  const classes = cn(
    "relative inline-flex select-none items-center justify-center gap-2 rounded-full font-display font-bold transition-[background-color,box-shadow,translate] duration-150 disabled:cursor-not-allowed disabled:opacity-60",
    variants[variant],
    sizes[size],
    className,
  );
  const tap = { scaleX: 1.06, scaleY: 0.9 };
  const transition = { type: "spring" as const, stiffness: 600, damping: 18 };

  if (props.href !== undefined) {
    const {
      variant: _v,
      size: _s,
      className: _c,
      children: _ch,
      icon: _i,
      onClick,
      ...rest
    } = props;
    return (
      <MotionLink
        {...rest}
        className={classes}
        whileTap={tap}
        transition={transition}
        onClick={(e: MouseEvent<HTMLAnchorElement>) => {
          burst(e);
          onClick?.(e);
        }}
      >
        {children}
        {icon}
        <BurstLayer bursts={bursts} />
      </MotionLink>
    );
  }

  const {
    variant: _v,
    size: _s,
    className: _c,
    children: _ch,
    icon: _i,
    onClick,
    type,
    ...rest
  } = props;
  return (
    <motion.button
      {...(rest as ComponentProps<typeof motion.button>)}
      type={type ?? "button"}
      className={classes}
      whileTap={tap}
      transition={transition}
      onClick={(e: MouseEvent<HTMLButtonElement>) => {
        burst(e);
        onClick?.(e);
      }}
    >
      {children}
      {icon}
      <BurstLayer bursts={bursts} />
    </motion.button>
  );
}
