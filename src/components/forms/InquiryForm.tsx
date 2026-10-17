"use client";

import { useActionState } from "react";
import { submitInquiry, type FormState } from "@/app/actions/forms";
import { Button } from "@/components/ui/Button";
import { Field, FormMessage, Honeypot, PrivacyCheckbox, inputClass } from "./Field";
import { cn } from "@/lib/cn";

const initial: FormState = { status: "idle" };

const INTERESTS = [
  { value: "karton", label: "Business-Karton" },
  { value: "logo", label: "Logo-Edition" },
  { value: "beides", label: "Beides" },
];

/** B2B-Anfrageformular (Siezen). */
export function InquiryForm({
  industries,
  defaultInterest,
}: {
  industries: string[];
  defaultInterest?: string;
}) {
  const [state, action, pending] = useActionState(submitInquiry, initial);
  const e = state.errors ?? {};
  const v = state.values ?? {};

  if (state.status === "success") {
    return <FormMessage status={state.status} message={state.message} demo={state.demo} />;
  }

  const aria = (name: string) => ({
    "aria-invalid": e[name] ? true : undefined,
    "aria-describedby": e[name] ? `b-${name}-error` : undefined,
  });

  return (
    <form action={action} className="relative grid gap-5" noValidate key={JSON.stringify(v)}>
      <Honeypot />
      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="b-company" label="Firma" error={e.company}>
          <input
            id="b-company"
            name="company"
            autoComplete="organization"
            required
            defaultValue={v.company}
            className={inputClass}
            {...aria("company")}
          />
        </Field>
        <Field id="b-name" label="Ansprechpartner" error={e.name}>
          <input
            id="b-name"
            name="name"
            autoComplete="name"
            required
            defaultValue={v.name}
            className={inputClass}
            {...aria("name")}
          />
        </Field>
        <Field id="b-email" label="E-Mail" error={e.email}>
          <input
            id="b-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            defaultValue={v.email}
            className={inputClass}
            {...aria("email")}
          />
        </Field>
        <Field id="b-phone" label="Telefon" optional error={e.phone}>
          <input
            id="b-phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            defaultValue={v.phone}
            className={inputClass}
            {...aria("phone")}
          />
        </Field>
        <Field id="b-industry" label="Branche" error={e.industry}>
          <select
            id="b-industry"
            name="industry"
            required
            defaultValue={v.industry ?? ""}
            className={cn(inputClass, "appearance-none")}
            {...aria("industry")}
          >
            <option value="" disabled>
              Bitte wählen …
            </option>
            {industries.map((i) => (
              <option key={i} value={i}>
                {i}
              </option>
            ))}
          </select>
        </Field>
        <Field id="b-toilets" label="Anzahl Toiletten" error={e.toilets}>
          <input
            id="b-toilets"
            name="toilets"
            type="number"
            inputMode="numeric"
            min={1}
            required
            defaultValue={v.toilets}
            className={inputClass}
            {...aria("toilets")}
          />
        </Field>
      </div>

      <fieldset aria-describedby={e.interest ? "b-interest-error" : undefined}>
        <legend className="mb-2 font-semibold">Interesse</legend>
        <div className="flex flex-wrap gap-2">
          {INTERESTS.map((opt) => (
            <label key={opt.value} className="cursor-pointer">
              <input
                type="radio"
                name="interest"
                value={opt.value}
                defaultChecked={(v.interest ?? defaultInterest) === opt.value}
                className="peer sr-only"
              />
              <span className="inline-flex h-11 items-center rounded-full border-2 border-ink/20 bg-bubble px-5 font-semibold transition peer-checked:border-ink peer-checked:bg-mint peer-focus-visible:outline-3 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ink">
                {opt.label}
              </span>
            </label>
          ))}
        </div>
        {e.interest && (
          <p id="b-interest-error" className="mt-1.5 text-sm font-semibold text-blush-ink">
            {e.interest}
          </p>
        )}
      </fieldset>

      <Field id="b-message" label="Nachricht" optional>
        <textarea
          id="b-message"
          name="message"
          rows={5}
          defaultValue={v.message}
          className={inputClass}
          placeholder="Zeitraum, Wunschmenge, Logo-Ideen …"
        />
      </Field>
      <PrivacyCheckbox error={e.privacy} formal />
      <FormMessage status={state.status} message={state.message} />
      <div>
        <Button type="submit" size="lg" disabled={pending}>
          {pending ? "Wird gesendet …" : "Anfrage senden"}
        </Button>
      </div>
    </form>
  );
}
