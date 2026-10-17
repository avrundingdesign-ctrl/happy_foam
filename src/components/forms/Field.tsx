import Link from "next/link";
import { useId, type ReactNode } from "react";
import { cn } from "@/lib/cn";

export const inputClass =
  "w-full rounded-2xl border-2 border-ink/15 bg-bubble px-4 py-3 text-base text-ink placeholder:text-muted/70 transition-colors focus:border-ink aria-[invalid=true]:border-blush-ink";

export function Field({
  id,
  label,
  error,
  hint,
  optional,
  children,
  className,
}: {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  optional?: boolean;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <label htmlFor={id} className="font-semibold">
        {label}
        {optional ? <span className="font-normal text-muted"> (optional)</span> : null}
      </label>
      {children}
      {hint && !error ? (
        <p id={`${id}-hint`} className="text-sm text-muted">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={`${id}-error`} className="text-sm font-semibold text-blush-ink">
          {error}
        </p>
      ) : null}
    </div>
  );
}

/** Verstecktes Honeypot-Feld gegen Spam-Bots. */
export function Honeypot() {
  const id = useId();
  return (
    <div aria-hidden="true" className="absolute top-auto left-[-9999px] h-px w-px overflow-hidden">
      <label htmlFor={`${id}-website`}>Website (bitte leer lassen)</label>
      <input id={`${id}-website`} type="text" name="website" tabIndex={-1} autoComplete="off" />
    </div>
  );
}

export function PrivacyCheckbox({
  error,
  formal = false,
  name = "privacy",
  children,
}: {
  error?: string;
  formal?: boolean;
  name?: string;
  children?: ReactNode;
}) {
  const id = `${name}-checkbox`;
  return (
    <div>
      <div className="flex items-start gap-3">
        <input
          id={id}
          name={name}
          type="checkbox"
          required
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-error` : undefined}
          className="mt-1 h-5 w-5 shrink-0 rounded accent-[#0A7A60]"
        />
        <label htmlFor={id} className="text-sm leading-relaxed text-ink">
          {children ??
            (formal ? (
              <>
                Ich habe die{" "}
                <Link href="/datenschutz" className="underline underline-offset-2">
                  Datenschutzerklärung
                </Link>{" "}
                zur Kenntnis genommen. Ich bin einverstanden, dass meine Angaben zur Bearbeitung
                meiner Anfrage verarbeitet werden.
              </>
            ) : (
              <>
                Ich habe die{" "}
                <Link href="/datenschutz" className="underline underline-offset-2">
                  Datenschutzerklärung
                </Link>{" "}
                gelesen und bin einverstanden, dass meine Angaben zur Beantwortung meiner Anfrage
                verarbeitet werden.
              </>
            ))}
        </label>
      </div>
      {error ? (
        <p id={`${id}-error`} className="mt-1 text-sm font-semibold text-blush-ink">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function FormMessage({
  status,
  message,
  demo,
}: {
  status: string;
  message?: string;
  demo?: boolean;
}) {
  if (!message || status === "idle") return null;
  return (
    <div
      role={status === "error" ? "alert" : "status"}
      className={cn(
        "rounded-2xl px-4 py-3 text-sm font-semibold",
        status === "success" ? "bg-mint/30 text-ink" : "bg-blush/25 text-ink",
      )}
    >
      {message}
      {demo ? (
        <span className="mt-1 block font-normal text-muted">
          (Demo-Modus: Es ist noch kein E-Mail-/Newsletter-Dienst verbunden – nichts wurde
          versendet.)
        </span>
      ) : null}
    </div>
  );
}
