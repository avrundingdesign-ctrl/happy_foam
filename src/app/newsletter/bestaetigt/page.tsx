import type { Metadata } from "next";
import { Mascot } from "@/components/brand/Mascot";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = { title: "Anmeldung bestätigt", robots: { index: false } };

export default function NewsletterConfirmed() {
  return (
    <section className="container-hf flex flex-col items-center py-24 text-center">
      <Mascot mood="wink" className="h-28 w-28 animate-float" />
      <h1 className="mt-6 font-display text-[clamp(2.2rem,6vw,3.5rem)] font-extrabold">
        Psst – du bist dabei!
      </h1>
      <p className="mt-3 max-w-md text-lg text-muted">
        Danke für deine Bestätigung. Ab jetzt wirst du leise informiert.
      </p>
      <Button href="/" className="mt-8" size="lg">
        Zur Startseite
      </Button>
    </section>
  );
}
