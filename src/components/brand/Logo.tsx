import { useId } from "react";
import { cn } from "@/lib/cn";

/** Das „o“ in Foam als lächelnde Schaumblase. */
export function BubbleO({ className }: { className?: string }) {
  const id = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden="true">
      <defs>
        <radialGradient id={id} cx="35%" cy="30%" r="80%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="70%" stopColor="#D9F2FF" />
          <stop offset="100%" stopColor="#BFE6FF" />
        </radialGradient>
      </defs>
      <circle cx="50" cy="50" r="42" fill={`url(#${id})`} stroke="currentColor" strokeWidth="12" />
      <ellipse cx="34" cy="31" rx="9" ry="5" fill="#FFFFFF" transform="rotate(-30 34 31)" />
      <circle cx="38" cy="50" r="5.5" fill="currentColor" />
      <circle cx="62" cy="50" r="5.5" fill="currentColor" />
      <path
        d="M36 63 q14 13 28 0"
        fill="none"
        stroke="currentColor"
        strokeWidth="7"
        strokeLinecap="round"
      />
    </svg>
  );
}

/**
 * Wortmarke „HappyFoam“ – ENTWURF.
 * Gesetzt in Bricolage Grotesque, das „o“ in „Foam“ ist eine lächelnde Schaumblase.
 */
export function Logo({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-baseline font-display leading-none font-extrabold tracking-tight",
        className,
      )}
    >
      <span className="sr-only">HappyFoam</span>
      <span aria-hidden="true">Happy</span>
      <span aria-hidden="true" className="text-mint-ink">
        F
      </span>
      <BubbleO className="mx-[0.02em] h-[0.66em] w-[0.66em] translate-y-[0.04em] self-baseline text-mint-ink" />
      <span aria-hidden="true" className="text-mint-ink">
        am
      </span>
    </span>
  );
}
