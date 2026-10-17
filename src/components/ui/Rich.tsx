import { Fragment } from "react";

const PLACEHOLDER = /(\[[A-ZÄÖÜ0-9_]+\])/g;
const IS_PLACEHOLDER = /^\[[A-ZÄÖÜ0-9_]+\]$/;

/** Markiert Platzhalter wie [SCHAUMDAUER_MIN] sichtbar, damit sie vor dem Livegang auffallen. */
export function Placeholder({ children }: { children: string }) {
  return (
    <mark
      className="rounded-md border border-dashed border-ink/40 bg-sun/60 px-1 py-px font-mono text-[0.85em] font-semibold [overflow-wrap:anywhere] text-ink"
      title="Platzhalter – muss vor dem Livegang ersetzt werden"
      data-placeholder={children}
    >
      {children}
    </mark>
  );
}

export function Rich({ text }: { text: string }) {
  const parts = text.split(PLACEHOLDER);
  return (
    <>
      {parts.map((part, i) =>
        IS_PLACEHOLDER.test(part) ? (
          <Placeholder key={i}>{part}</Placeholder>
        ) : (
          <Fragment key={i}>{part}</Fragment>
        ),
      )}
    </>
  );
}
