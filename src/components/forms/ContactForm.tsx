"use client";

import { useActionState } from "react";
import { submitContact, type FormState } from "@/app/actions/forms";
import { Button } from "@/components/ui/Button";
import { Field, FormMessage, Honeypot, PrivacyCheckbox, inputClass } from "./Field";

const initial: FormState = { status: "idle" };

export function ContactForm() {
  const [state, action, pending] = useActionState(submitContact, initial);
  const e = state.errors ?? {};
  const v = state.values ?? {};

  if (state.status === "success") {
    return <FormMessage status={state.status} message={state.message} demo={state.demo} />;
  }

  const aria = (name: string) => ({
    "aria-invalid": e[name] ? true : undefined,
    "aria-describedby": e[name] ? `c-${name}-error` : undefined,
  });

  return (
    <form action={action} className="relative grid gap-5" noValidate key={JSON.stringify(v)}>
      <Honeypot />
      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="c-name" label="Name" error={e.name}>
          <input
            id="c-name"
            name="name"
            autoComplete="name"
            required
            defaultValue={v.name}
            className={inputClass}
            {...aria("name")}
          />
        </Field>
        <Field id="c-email" label="E-Mail" error={e.email}>
          <input
            id="c-email"
            name="email"
            type="email"
            autoComplete="email"
            required
            defaultValue={v.email}
            className={inputClass}
            {...aria("email")}
          />
        </Field>
      </div>
      <Field id="c-subject" label="Betreff" optional>
        <input id="c-subject" name="subject" defaultValue={v.subject} className={inputClass} />
      </Field>
      <Field id="c-message" label="Nachricht" error={e.message}>
        <textarea
          id="c-message"
          name="message"
          rows={6}
          required
          defaultValue={v.message}
          className={inputClass}
          {...aria("message")}
        />
      </Field>
      <PrivacyCheckbox error={e.privacy} />
      <FormMessage status={state.status} message={state.message} />
      <div>
        <Button type="submit" size="lg" disabled={pending}>
          {pending ? "Wird gesendet …" : "Nachricht senden"}
        </Button>
      </div>
    </form>
  );
}
