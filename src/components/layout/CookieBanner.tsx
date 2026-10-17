"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/Button";

const KEY = "happyfoam-consent-v1";

/**
 * Einwilligungs-Banner. Nur nötig, wenn nicht notwendige Cookies/Tracker
 * eingesetzt werden – per siteConfig.features.cookieBanner schaltbar.
 * Die Entscheidung kann über window.happyfoamConsent ausgelesen werden.
 */
export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- liest gespeicherte Entscheidung nach dem Mount
      setVisible(!window.localStorage.getItem(KEY));
    } catch {
      setVisible(true);
    }
  }, []);

  const decide = (value: "all" | "necessary") => {
    try {
      window.localStorage.setItem(KEY, value);
    } catch {
      /* ignorieren */
    }
    setVisible(false);
    window.dispatchEvent(new CustomEvent("happyfoam:consent", { detail: value }));
  };

  if (!visible) return null;
  return (
    <div
      role="dialog"
      aria-live="polite"
      aria-label="Cookie-Einstellungen"
      className="fixed inset-x-3 bottom-3 z-[60] mx-auto max-w-xl rounded-3xl bg-bubble p-5 shadow-2xl ring-2 ring-ink md:bottom-6"
    >
      <p className="font-display text-lg font-bold">Ein Keks gefällig?</p>
      <p className="mt-1 text-sm text-muted">
        [COOKIE_TEXT] Wir nutzen nur dann zusätzliche Dienste, wenn du zustimmst. Details in der{" "}
        <Link href="/datenschutz" className="underline underline-offset-2">
          Datenschutzerklärung
        </Link>
        .
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <Button size="sm" onClick={() => decide("all")}>
          Alle akzeptieren
        </Button>
        <Button size="sm" variant="secondary" onClick={() => decide("necessary")}>
          Nur notwendige
        </Button>
      </div>
    </div>
  );
}
