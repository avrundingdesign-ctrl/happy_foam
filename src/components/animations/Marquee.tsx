import { cn } from "@/lib/cn";

/** Laufband mit Claims. Reine CSS-Animation, pausiert bei Hover und steht bei reduzierter Bewegung still. */
export function Marquee({
  items,
  className,
  reverse = false,
  tone = "ink",
}: {
  items: readonly string[];
  className?: string;
  reverse?: boolean;
  tone?: "ink" | "mint" | "sun" | "blush";
}) {
  const tones = {
    ink: "bg-ink text-bubble",
    mint: "bg-mint text-ink",
    sun: "bg-sun text-ink",
    blush: "bg-blush text-ink",
  };
  const row = (hidden: boolean) => (
    <ul className="flex shrink-0 items-center" aria-hidden={hidden || undefined}>
      {items.map((t, i) => (
        <li
          key={i}
          className="flex items-center gap-6 px-6 font-display text-xl font-bold whitespace-nowrap md:text-2xl"
        >
          {t}
          <span
            className="inline-block h-3 w-3 rounded-full bg-current opacity-60"
            aria-hidden="true"
          />
        </li>
      ))}
    </ul>
  );
  return (
    <div className={cn("group relative overflow-hidden py-4 md:py-5", tones[tone], className)}>
      <div
        className={cn(
          "flex w-max animate-marquee group-hover:[animation-play-state:paused] motion-reduce:animate-none",
          reverse && "[animation-direction:reverse]",
        )}
      >
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}
