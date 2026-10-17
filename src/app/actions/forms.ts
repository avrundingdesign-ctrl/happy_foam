"use server";

import { sendMail } from "@/lib/mail";
import { subscribe } from "@/lib/newsletter";

export type FormState = {
  status: "idle" | "success" | "error";
  message?: string;
  errors?: Record<string, string>;
  values?: Record<string, string>;
  demo?: boolean;
};

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function str(fd: FormData, key: string, max = 2000) {
  const v = fd.get(key);
  return typeof v === "string" ? v.trim().slice(0, max) : "";
}

/** Honeypot: Bots füllen das versteckte Feld „website“ aus. */
function isSpam(fd: FormData) {
  return str(fd, "website").length > 0;
}

function fail(errors: Record<string, string>, values: Record<string, string>): FormState {
  return { status: "error", message: "Bitte prüfe die markierten Felder.", errors, values };
}

export async function submitContact(_: FormState, fd: FormData): Promise<FormState> {
  const values = {
    name: str(fd, "name", 200),
    email: str(fd, "email", 200),
    subject: str(fd, "subject", 200),
    message: str(fd, "message", 5000),
  };
  if (isSpam(fd)) return { status: "success", message: "Danke! Wir melden uns." };

  const errors: Record<string, string> = {};
  if (!values.name) errors.name = "Wie dürfen wir dich nennen?";
  if (!EMAIL.test(values.email)) errors.email = "Bitte gib eine gültige E-Mail-Adresse an.";
  if (values.message.length < 10) errors.message = "Ein, zwei Sätze mehr dürfen es sein.";
  if (fd.get("privacy") !== "on") errors.privacy = "Bitte bestätige den Datenschutzhinweis.";
  if (Object.keys(errors).length) return fail(errors, values);

  const res = await sendMail({
    subject: `Kontaktanfrage: ${values.subject || "Ohne Betreff"}`,
    replyTo: values.email,
    text: `Name: ${values.name}\nE-Mail: ${values.email}\nBetreff: ${values.subject}\n\n${values.message}`,
  });
  if (!res.ok) {
    return {
      status: "error",
      message: "Das hat leider nicht geklappt. Bitte versuch es später noch einmal.",
      values,
    };
  }
  return {
    status: "success",
    demo: res.demo,
    message: "Danke! Deine Nachricht ist angekommen. Wir melden uns – leise, aber bestimmt.",
  };
}

export async function submitInquiry(_: FormState, fd: FormData): Promise<FormState> {
  const values = {
    company: str(fd, "company", 200),
    name: str(fd, "name", 200),
    email: str(fd, "email", 200),
    phone: str(fd, "phone", 60),
    industry: str(fd, "industry", 100),
    toilets: str(fd, "toilets", 10),
    interest: str(fd, "interest", 40),
    message: str(fd, "message", 5000),
  };
  if (isSpam(fd)) return { status: "success", message: "Vielen Dank für Ihre Anfrage." };

  const errors: Record<string, string> = {};
  if (!values.company) errors.company = "Bitte geben Sie Ihr Unternehmen an.";
  if (!values.name) errors.name = "Bitte geben Sie einen Ansprechpartner an.";
  if (!EMAIL.test(values.email)) errors.email = "Bitte geben Sie eine gültige E-Mail-Adresse an.";
  if (values.phone && !/^[+\d][\d\s/()-]{4,}$/.test(values.phone))
    errors.phone = "Bitte prüfen Sie die Telefonnummer.";
  if (!values.industry) errors.industry = "Bitte wählen Sie eine Branche.";
  const toilets = Number(values.toilets);
  if (!Number.isInteger(toilets) || toilets < 1 || toilets > 10000)
    errors.toilets = "Bitte geben Sie eine Anzahl ab 1 an.";
  if (!["karton", "logo", "beides"].includes(values.interest))
    errors.interest = "Bitte wählen Sie Ihr Interesse.";
  if (fd.get("privacy") !== "on") errors.privacy = "Bitte bestätigen Sie den Datenschutzhinweis.";
  if (Object.keys(errors).length) {
    return { ...fail(errors, values), message: "Bitte prüfen Sie die markierten Felder." };
  }

  const interestLabel = { karton: "Business-Karton", logo: "Logo-Edition", beides: "Beides" }[
    values.interest
  ];
  const res = await sendMail({
    subject: `B2B-Anfrage: ${values.company} (${interestLabel})`,
    replyTo: values.email,
    text: [
      `Firma: ${values.company}`,
      `Ansprechpartner: ${values.name}`,
      `E-Mail: ${values.email}`,
      `Telefon: ${values.phone || "–"}`,
      `Branche: ${values.industry}`,
      `Anzahl Toiletten: ${values.toilets}`,
      `Interesse: ${interestLabel}`,
      "",
      values.message || "(keine Nachricht)",
    ].join("\n"),
  });
  if (!res.ok) {
    return {
      status: "error",
      message: "Das hat leider nicht geklappt. Bitte versuchen Sie es später erneut.",
      values,
    };
  }
  return {
    status: "success",
    demo: res.demo,
    message:
      "Vielen Dank! Ihre Anfrage ist eingegangen. Wir melden uns in Kürze mit einem Angebot.",
  };
}

export async function submitNewsletter(_: FormState, fd: FormData): Promise<FormState> {
  const values = { email: str(fd, "email", 200) };
  if (isSpam(fd))
    return {
      status: "success",
      message: "Fast geschafft! Bitte bestätige deine Anmeldung per E-Mail.",
    };

  const errors: Record<string, string> = {};
  if (!EMAIL.test(values.email)) errors.email = "Bitte gib eine gültige E-Mail-Adresse an.";
  if (fd.get("consent") !== "on") errors.consent = "Bitte bestätige die Einwilligung.";
  if (Object.keys(errors).length) return fail(errors, values);

  const res = await subscribe(values.email);
  if (!res.ok) {
    return {
      status: "error",
      message: "Das hat leider nicht geklappt. Bitte versuch es später noch einmal.",
      values,
    };
  }
  return {
    status: "success",
    demo: res.demo,
    message:
      "Fast geschafft! Wir haben dir eine E-Mail geschickt – bitte bestätige dort deine Anmeldung.",
  };
}
