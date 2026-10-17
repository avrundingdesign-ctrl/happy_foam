import { useId } from "react";
import { cn } from "@/lib/cn";

type Mood = "happy" | "wink" | "oops" | "shh";

/**
 * Das HappyFoam-Maskottchen: eine kleine, lächelnde Schaumblase.
 * Frei erfunden, an keine bekannte Figur angelehnt.
 */
export function Mascot({
  mood = "happy",
  className,
  title,
}: {
  mood?: Mood;
  className?: string;
  title?: string;
}) {
  const id = useId().replace(/[^a-zA-Z0-9_-]/g, "");
  return (
    <svg
      viewBox="0 0 120 120"
      className={cn("overflow-visible", className)}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      <defs>
        <radialGradient id={`${id}-body`} cx="38%" cy="32%" r="75%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="62%" stopColor="#EAF6FF" />
          <stop offset="100%" stopColor="#BFE6FF" />
        </radialGradient>
      </defs>
      <circle cx="60" cy="62" r="50" fill={`url(#${id}-body)`} stroke="#0F1B2D" strokeWidth="3.5" />
      {/* Glanzlichter */}
      <ellipse cx="38" cy="36" rx="12" ry="7" fill="#FFFFFF" transform="rotate(-30 38 36)" />
      <circle cx="55" cy="27" r="3.5" fill="#FFFFFF" />
      {/* Bäckchen */}
      <ellipse cx="34" cy="74" rx="8" ry="5" fill="#FF8FB1" opacity="0.7" />
      <ellipse cx="86" cy="74" rx="8" ry="5" fill="#FF8FB1" opacity="0.7" />
      {/* Augen */}
      <g className="origin-center animate-[blink_5s_infinite]" style={{ transformBox: "fill-box" }}>
        {mood === "wink" ? (
          <path
            d="M40 60 q6 -6 12 0"
            fill="none"
            stroke="#0F1B2D"
            strokeWidth="4"
            strokeLinecap="round"
          />
        ) : (
          <ellipse cx="46" cy="60" rx="4.5" ry="6" fill="#0F1B2D" />
        )}
        <ellipse cx="74" cy="60" rx="4.5" ry="6" fill="#0F1B2D" />
      </g>
      {/* Mund */}
      {mood === "oops" ? (
        <ellipse cx="60" cy="82" rx="6" ry="7" fill="#0F1B2D" />
      ) : mood === "shh" ? (
        <>
          <path d="M52 82 h16" stroke="#0F1B2D" strokeWidth="4" strokeLinecap="round" />
          <rect
            x="57"
            y="68"
            width="7"
            height="24"
            rx="3.5"
            fill="#FFD84D"
            stroke="#0F1B2D"
            strokeWidth="2.5"
          />
        </>
      ) : (
        <path
          d="M46 78 q14 14 28 0"
          fill="none"
          stroke="#0F1B2D"
          strokeWidth="4"
          strokeLinecap="round"
        />
      )}
    </svg>
  );
}
