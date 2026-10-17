import { cn } from "@/lib/cn";
import type { ReactNode } from "react";

export function SectionHeading({
  eyebrow,
  title,
  text,
  align = "left",
  className,
  as: Tag = "h2",
}: {
  eyebrow?: string;
  title: ReactNode;
  text?: ReactNode;
  align?: "left" | "center";
  className?: string;
  as?: "h1" | "h2";
}) {
  return (
    <div className={cn("max-w-2xl", align === "center" && "mx-auto text-center", className)}>
      {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
      <Tag
        className={cn(
          "font-display leading-[1.05] font-extrabold",
          Tag === "h1" ? "text-[clamp(2.4rem,7vw,4.5rem)]" : "text-[clamp(2rem,5vw,3.25rem)]",
        )}
      >
        {title}
      </Tag>
      {text && <p className="mt-4 text-lg leading-relaxed text-muted md:text-xl">{text}</p>}
    </div>
  );
}
