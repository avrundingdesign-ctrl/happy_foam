"use client";

import { siteConfig } from "@config";
import { Field, inputClass } from "@/components/forms/Field";
import type { CheckoutAddress } from "@/lib/checkout-validation";
import { cn } from "@/lib/cn";

/** Adressfelder für Liefer- bzw. Rechnungsadresse (mit passenden autocomplete-Angaben). */
export function AddressFields({
  prefix,
  value,
  onChange,
  errors,
  autocompleteSection,
}: {
  prefix: "shipping" | "billing";
  value: CheckoutAddress;
  onChange: (next: CheckoutAddress) => void;
  errors: Record<string, string>;
  autocompleteSection: "shipping" | "billing";
}) {
  const countries = siteConfig.shop.shipping.countries;
  const id = (name: string) => `${prefix}-${name}`;
  const err = (name: string) => errors[`${prefix}.${name}`];
  const set =
    (name: keyof CheckoutAddress) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      onChange({ ...value, [name]: e.target.value });
  const aria = (name: string) => ({
    "aria-invalid": err(name) ? true : undefined,
    "aria-describedby": err(name) ? `${id(name)}-error` : undefined,
  });
  const ac = (token: string) => `section-${autocompleteSection} ${autocompleteSection} ${token}`;

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Field id={id("firstName")} label="Vorname" error={err("firstName")}>
        <input
          id={id("firstName")}
          value={value.firstName}
          onChange={set("firstName")}
          autoComplete={ac("given-name")}
          className={inputClass}
          {...aria("firstName")}
        />
      </Field>
      <Field id={id("lastName")} label="Nachname" error={err("lastName")}>
        <input
          id={id("lastName")}
          value={value.lastName}
          onChange={set("lastName")}
          autoComplete={ac("family-name")}
          className={inputClass}
          {...aria("lastName")}
        />
      </Field>
      <Field
        id={id("street")}
        label="Straße und Hausnummer"
        error={err("street")}
        className="sm:col-span-2"
      >
        <input
          id={id("street")}
          value={value.street}
          onChange={set("street")}
          autoComplete={ac("address-line1")}
          className={inputClass}
          {...aria("street")}
        />
      </Field>
      <Field id={id("addressLine2")} label="Adresszusatz" optional className="sm:col-span-2">
        <input
          id={id("addressLine2")}
          value={value.addressLine2}
          onChange={set("addressLine2")}
          autoComplete={ac("address-line2")}
          placeholder="z. B. c/o, Firma, Hinterhaus"
          className={inputClass}
        />
      </Field>
      <div className="grid grid-cols-[7.5rem_1fr] gap-4 sm:col-span-2">
        <Field id={id("zip")} label="PLZ" error={err("zip")}>
          <input
            id={id("zip")}
            value={value.zip}
            onChange={set("zip")}
            inputMode="numeric"
            autoComplete={ac("postal-code")}
            className={inputClass}
            {...aria("zip")}
          />
        </Field>
        <Field id={id("city")} label="Ort" error={err("city")}>
          <input
            id={id("city")}
            value={value.city}
            onChange={set("city")}
            autoComplete={ac("address-level2")}
            className={inputClass}
            {...aria("city")}
          />
        </Field>
      </div>
      <Field id={id("country")} label="Land" error={err("country")} className="sm:col-span-2">
        <select
          id={id("country")}
          value={value.country}
          onChange={set("country")}
          autoComplete={ac("country")}
          disabled={prefix === "shipping" && countries.length === 1}
          className={cn(inputClass, "appearance-none disabled:bg-foam disabled:text-ink")}
          {...aria("country")}
        >
          {countries.map((c) => (
            <option key={c.code} value={c.code}>
              {c.name}
            </option>
          ))}
        </select>
        {prefix === "shipping" && countries.length === 1 && (
          <p className="text-sm text-muted">Wir liefern derzeit nur nach {countries[0].name}.</p>
        )}
      </Field>
    </div>
  );
}
