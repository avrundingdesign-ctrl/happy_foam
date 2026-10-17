"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useAnimate } from "motion/react";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { useEffect, useState } from "react";
import { cn } from "@/lib/cn";
import { useCart } from "@/components/shop/CartProvider";
import { HeaderLogo } from "./HeaderLogo";
import { siteConfig } from "@config";

export const NAV = [
  { href: "/shop", label: "Shop" },
  { href: "/so-funktionierts", label: "So funktioniert's" },
  { href: "/fuer-unternehmen", label: "Für Unternehmen" },
  { href: "/faq", label: "FAQ" },
] as const;

function CartButton() {
  const { count, open, iconRef, bump } = useCart();
  const reduce = useReducedMotion();
  const [scope, animate] = useAnimate<HTMLSpanElement>();

  // Hüpfen, sobald etwas im Warenkorb gelandet ist
  useEffect(() => {
    if (!bump || reduce || !scope.current) return;
    animate(scope.current, { y: [0, -10, 0, -4, 0], rotate: [0, -8, 6, 0] }, { duration: 0.55 });
  }, [bump, reduce, animate, scope]);

  return (
    <button
      ref={iconRef}
      type="button"
      onClick={open}
      className="relative inline-flex h-11 w-11 items-center justify-center rounded-full bg-bubble ring-2 ring-ink transition-colors hover:bg-sky/50"
      aria-label={`Warenkorb öffnen (${count} Artikel)`}
    >
      <span ref={scope} className="inline-flex">
        <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
          <path
            d="M5 8h14l-1.2 11.1a2 2 0 0 1-2 1.9H8.2a2 2 0 0 1-2-1.9L5 8Zm4 0V6a3 3 0 0 1 6 0v2"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
      {count > 0 && (
        <span className="absolute -top-1.5 -right-1.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-blush px-1 text-[11px] font-bold text-ink ring-2 ring-ink">
          {count}
        </span>
      )}
    </button>
  );
}

export function Header() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const reduce = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Menü bei Seitenwechsel schließen
  const [lastPath, setLastPath] = useState(pathname);
  if (lastPath !== pathname) {
    setLastPath(pathname);
    setMenuOpen(false);
  }

  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-[background-color,box-shadow] duration-300",
        scrolled || menuOpen
          ? "bg-foam/85 shadow-[0_1px_0_0_rgba(15,27,45,0.08)] backdrop-blur-md"
          : "bg-transparent",
      )}
    >
      <a
        href="#inhalt"
        className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-4 focus:z-[60] focus:rounded-full focus:bg-ink focus:px-4 focus:py-2 focus:text-bubble"
      >
        Zum Inhalt springen
      </a>
      <div className="container-hf flex h-18 items-center justify-between gap-4 py-3">
        <HeaderLogo />

        <nav aria-label="Hauptnavigation" className="hidden md:block">
          <ul className="flex items-center gap-1">
            {NAV.map((item) => {
              const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "relative rounded-full px-4 py-2 font-semibold transition-colors hover:bg-ink/5",
                      active && "bg-sky/60",
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          {siteConfig.features.shopMode === "shop" && <CartButton />}
          <button
            type="button"
            className="relative inline-flex h-11 w-11 items-center justify-center rounded-full bg-ink text-bubble md:hidden"
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? "Menü schließen" : "Menü öffnen"}
            onClick={() => setMenuOpen((o) => !o)}
          >
            <span className="relative block h-3.5 w-5" aria-hidden="true">
              <span
                className={cn(
                  "absolute top-0 left-0 h-0.5 w-5 rounded bg-current transition-transform duration-300",
                  menuOpen && "translate-y-[6px] rotate-45",
                )}
              />
              <span
                className={cn(
                  "absolute top-1.5 left-0 h-0.5 w-5 rounded bg-current transition-opacity",
                  menuOpen && "opacity-0",
                )}
              />
              <span
                className={cn(
                  "absolute top-3 left-0 h-0.5 w-5 rounded bg-current transition-transform duration-300",
                  menuOpen && "-translate-y-[6px] -rotate-45",
                )}
              />
            </span>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            id="mobile-menu"
            className="fixed inset-x-0 top-[72px] bottom-0 z-40 overflow-hidden bg-foam md:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            {/* Animierte Blasen im Hintergrund */}
            {!reduce &&
              [
                { l: "8%", s: 70, d: 0 },
                { l: "70%", s: 110, d: 0.1 },
                { l: "40%", s: 46, d: 0.2 },
                { l: "82%", s: 36, d: 0.3 },
                { l: "18%", s: 54, d: 0.25 },
              ].map((b, i) => (
                <motion.span
                  key={i}
                  className="bubble-deco absolute"
                  style={{ left: b.l, width: b.s, height: b.s, bottom: -b.s }}
                  initial={{ y: 0, opacity: 0 }}
                  animate={{ y: -520 - i * 60, opacity: [0, 1, 1, 0.6] }}
                  transition={{ duration: 2.6 + i * 0.3, delay: b.d, ease: "easeOut" }}
                  aria-hidden="true"
                />
              ))}
            <nav aria-label="Mobile Navigation" className="container-hf relative pt-6">
              <ul className="flex flex-col gap-2">
                {[
                  ...NAV,
                  { href: "/ueber-uns", label: "Über uns" },
                  { href: "/kontakt", label: "Kontakt" },
                ].map((item, i) => (
                  <motion.li
                    key={item.href}
                    initial={{ opacity: 0, x: reduce ? 0 : -24 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.05 + i * 0.05 }}
                  >
                    <Link
                      href={item.href}
                      className="block rounded-3xl bg-bubble px-6 py-4 font-display text-2xl font-extrabold ring-1 ring-ink/10"
                      aria-current={pathname === item.href ? "page" : undefined}
                    >
                      {item.label}
                    </Link>
                  </motion.li>
                ))}
              </ul>
              <p className="mt-8 text-center font-display text-lg font-bold text-muted">
                Psst. Niemand muss es hören.
              </p>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
