import { siteConfig } from "@config";

export type CheckoutAddress = {
  firstName: string;
  lastName: string;
  street: string;
  addressLine2: string;
  zip: string;
  city: string;
  country: string;
};

export type CheckoutCustomer = {
  email: string;
  phone: string;
  shipping: CheckoutAddress;
  billingDifferent: boolean;
  billing: CheckoutAddress;
};

export const emptyAddress = (country = "DE"): CheckoutAddress => ({
  firstName: "",
  lastName: "",
  street: "",
  addressLine2: "",
  zip: "",
  city: "",
  country,
});

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const ZIP: Record<string, RegExp> = { DE: /^\d{5}$/, AT: /^\d{4}$/, CH: /^\d{4}$/ };

const clean = (v: unknown, max = 120) =>
  typeof v === "string" ? v.trim().replace(/\s+/g, " ").slice(0, max) : "";

function checkAddress(
  a: CheckoutAddress | undefined,
  prefix: string,
  errors: Record<string, string>,
) {
  const out: CheckoutAddress = {
    firstName: clean(a?.firstName, 60),
    lastName: clean(a?.lastName, 60),
    street: clean(a?.street, 120),
    addressLine2: clean(a?.addressLine2, 120),
    zip: clean(a?.zip, 12),
    city: clean(a?.city, 80),
    country: clean(a?.country, 2).toUpperCase(),
  };
  if (!out.firstName) errors[`${prefix}.firstName`] = "Bitte gib deinen Vornamen an.";
  if (!out.lastName) errors[`${prefix}.lastName`] = "Bitte gib deinen Nachnamen an.";
  if (out.street.length < 3) errors[`${prefix}.street`] = "Bitte gib Straße und Hausnummer an.";
  else if (!/\d/.test(out.street)) errors[`${prefix}.street`] = "Bitte ergänze die Hausnummer.";
  const zipRule = ZIP[out.country] ?? /^[A-Za-z0-9 -]{3,10}$/;
  if (!zipRule.test(out.zip)) errors[`${prefix}.zip`] = "Bitte prüfe die Postleitzahl.";
  if (!out.city) errors[`${prefix}.city`] = "Bitte gib deinen Ort an.";
  return out;
}

/** Prüft Kontakt- und Adressdaten der Kasse – identisch im Browser und auf dem Server. */
export function validateCustomer(input: Partial<CheckoutCustomer>) {
  const errors: Record<string, string> = {};
  const email = clean(input.email, 200).toLowerCase();
  const phone = clean(input.phone, 40);
  if (!EMAIL.test(email)) errors.email = "Bitte gib eine gültige E-Mail-Adresse an.";
  if (phone && !/^[+\d][\d\s/()-]{5,}$/.test(phone))
    errors.phone = "Bitte prüfe die Telefonnummer.";

  const shipping = checkAddress(input.shipping, "shipping", errors);
  const allowed = siteConfig.shop.shipping.countries.map((c) => c.code as string);
  if (!allowed.includes(shipping.country)) {
    errors["shipping.country"] = "In dieses Land liefern wir leider (noch) nicht.";
  }
  const billingDifferent = Boolean(input.billingDifferent);
  const billing = billingDifferent ? checkAddress(input.billing, "billing", errors) : shipping;

  return {
    errors,
    customer: { email, phone, shipping, billingDifferent, billing } satisfies CheckoutCustomer,
  };
}
