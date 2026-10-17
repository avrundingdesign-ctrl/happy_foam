import type { Metadata } from "next";
import { Whirlpool } from "@/components/animations/Whirlpool";
import { Button } from "@/components/ui/Button";

export const metadata: Metadata = { title: "Seite nicht gefunden", robots: { index: false } };

export default function NotFound() {
  return (
    <section className="container-hf flex flex-col items-center py-16 text-center md:py-24">
      <Whirlpool />
      <p className="eyebrow mt-8">Fehler 404</p>
      <h1 className="mt-2 font-display text-[clamp(2.2rem,6vw,4rem)] leading-tight font-extrabold">
        Ups – diese Seite wurde runtergespült.
      </h1>
      <p className="mt-3 max-w-md text-lg text-muted">Keine Panik. Wir holen dich da raus.</p>
      <Button href="/" className="mt-8" size="lg">
        Zurück an die Oberfläche
      </Button>
    </section>
  );
}
