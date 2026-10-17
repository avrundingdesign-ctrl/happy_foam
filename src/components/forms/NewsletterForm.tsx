"use client";

import Link from "next/link";
import { useActionState, useId } from "react";
import { submitNewsletter, type FormState } from "@/app/actions/forms";
import { Button } from "@/components/ui/Button";
import { FormMessage, Honeypot } from "./Field";
import { cn } from "@/lib/cn";

const initial: FormState = { status: "idle" };

/** Newsletter-/Wartelisten-Anmeldung mit Double-Opt-in. */
export function NewsletterForm({
  compact = false,
  dark = false,
}: {
  compact?: boolean;
  dark?: boolean;
}) {
  const [state, action, pending] = useActionState(submitNewsletter, initial);
  const id = useId();

  if (state.status === "success") {
    return <FormMessage status={state.status} message={state.message} demo={state.demo} />;
  }

  return (
    <form action={action} className="relative flex flex-col gap-3" noValidate>
      <Honeypot />
      <div className={cn("flex gap-2", compact ? "flex-col sm:flex-row" : "flex-col sm:flex-row")}>
        <label htmlFor={`${id}-email`} className="sr-only">
          E-Mail-Adresse
        </label>
        <input
          id={`${id}-email`}
          name="email"
          type="email"
          autoComplete="email"
          required
          placeholder="deine@email.de"
          defaultValue={state.values?.email}
          aria-invalid={state.errors?.email ? true : undefined}
          aria-describedby={state.errors?.email ? `${id}-email-error` : undefined}
          className={cn(
            "h-12 w-full min-w-0 rounded-full border-2 px-5 text-base text-ink placeholder:text-muted/80 sm:flex-1",
            dark ? "border-transparent bg-bubble" : "border-ink/15 bg-bubble focus:border-ink",
          )}
        />
        <Button
          type="submit"
          disabled={pending}
          variant={dark ? "primary" : "dark"}
          className="shrink-0"
        >
          {pending ? "Moment …" : "Leise anmelden"}
        </Button>
      </div>
      {state.errors?.email && (
        <p
          id={`${id}-email-error`}
          className={cn("text-sm font-semibold", dark ? "text-blush" : "text-blush-ink")}
        >
          {state.errors.email}
        </p>
      )}
      <div className="flex items-start gap-2.5">
        <input
          id={`${id}-consent`}
          name="consent"
          type="checkbox"
          required
          aria-invalid={state.errors?.consent ? true : undefined}
          className="mt-0.5 h-4.5 w-4.5 shrink-0 accent-[#0A7A60]"
        />
        <label
          htmlFor={`${id}-consent`}
          className={cn("text-xs leading-relaxed", dark ? "text-bubble/80" : "text-muted")}
        >
          Ja, ich möchte den HappyFoam-Newsletter mit Neuigkeiten und Angeboten per E-Mail erhalten.
          Die Einwilligung kann ich jederzeit über den Abmeldelink widerrufen. Nach dem Absenden
          bekomme ich eine E-Mail zur Bestätigung (Double-Opt-in). Mehr in der{" "}
          <Link href="/datenschutz" className="underline underline-offset-2">
            Datenschutzerklärung
          </Link>
          .
        </label>
      </div>
      {state.errors?.consent && (
        <p className={cn("text-sm font-semibold", dark ? "text-blush" : "text-blush-ink")}>
          {state.errors.consent}
        </p>
      )}
      {state.status === "error" && !state.errors && (
        <FormMessage status="error" message={state.message} />
      )}
    </form>
  );
}
