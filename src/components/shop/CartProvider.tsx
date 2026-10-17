"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
  type RefObject,
} from "react";
import { AnimatePresence, motion } from "motion/react";
import { useReducedMotion } from "@/lib/useReducedMotion";
import type { CartLine } from "@/lib/types";
import { Sachet } from "@/components/illustrations/Sachet";

const STORAGE_KEY = "happyfoam-cart-v1";

type Flight = { id: number; from: DOMRect; to: DOMRect; color: CartLine["color"] };

type CartContextValue = {
  lines: CartLine[];
  count: number;
  subtotal: number;
  add: (line: Omit<CartLine, "quantity">, quantity: number, origin?: HTMLElement | null) => void;
  setQuantity: (handle: string, quantity: number) => void;
  remove: (handle: string) => void;
  clear: () => void;
  isOpen: boolean;
  open: () => void;
  close: () => void;
  iconRef: RefObject<HTMLButtonElement | null>;
  /** Zählt hoch, wenn das Warenkorb-Symbol hüpfen soll */
  bump: number;
};

const CartContext = createContext<CartContextValue | null>(null);

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart muss innerhalb von <CartProvider> verwendet werden.");
  return ctx;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [isOpen, setOpen] = useState(false);
  const [bump, setBump] = useState(0);
  const [flights, setFlights] = useState<Flight[]>([]);
  const iconRef = useRef<HTMLButtonElement | null>(null);
  const reduce = useReducedMotion();

  // Warenkorb aus dem Browser-Speicher laden (rein lokal, kein Cookie)
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      // eslint-disable-next-line react-hooks/set-state-in-effect -- einmalige Hydrierung aus localStorage
      if (raw) setLines(JSON.parse(raw) as CartLine[]);
    } catch {
      /* Speicher nicht verfügbar – Warenkorb startet leer */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(lines));
    } catch {
      /* ignorieren */
    }
  }, [lines, hydrated]);

  const add = useCallback<CartContextValue["add"]>(
    (line, quantity, origin) => {
      setLines((prev) => {
        const existing = prev.find((l) => l.handle === line.handle);
        if (existing) {
          return prev.map((l) =>
            l.handle === line.handle ? { ...l, quantity: Math.min(99, l.quantity + quantity) } : l,
          );
        }
        return [...prev, { ...line, quantity }];
      });

      const target = iconRef.current;
      if (origin && target && !reduce) {
        const from = origin.getBoundingClientRect();
        const to = target.getBoundingClientRect();
        const id = Date.now();
        setFlights((f) => [...f, { id, from, to, color: line.color }]);
        window.setTimeout(() => {
          setFlights((f) => f.filter((x) => x.id !== id));
          setBump((b) => b + 1);
        }, 750);
      } else {
        setBump((b) => b + 1);
      }
    },
    [reduce],
  );

  const setQuantity = useCallback((handle: string, quantity: number) => {
    setLines((prev) =>
      quantity <= 0
        ? prev.filter((l) => l.handle !== handle)
        : prev.map((l) => (l.handle === handle ? { ...l, quantity: Math.min(99, quantity) } : l)),
    );
  }, []);

  const remove = useCallback((handle: string) => {
    setLines((prev) => prev.filter((l) => l.handle !== handle));
  }, []);

  const clear = useCallback(() => setLines([]), []);

  const value = useMemo<CartContextValue>(
    () => ({
      lines,
      count: lines.reduce((n, l) => n + l.quantity, 0),
      subtotal: lines.reduce((n, l) => n + l.quantity * l.price, 0),
      add,
      setQuantity,
      remove,
      clear,
      isOpen,
      open: () => setOpen(true),
      close: () => setOpen(false),
      iconRef,
      bump,
    }),
    [lines, add, setQuantity, remove, clear, isOpen, bump],
  );

  return (
    <CartContext.Provider value={value}>
      {children}
      {/* Fliegendes Sachet zum Warenkorb-Symbol */}
      <div className="pointer-events-none fixed inset-0 z-[70]" aria-hidden="true">
        <AnimatePresence>
          {flights.map((f) => {
            const startX = f.from.left + f.from.width / 2 - 24;
            const startY = f.from.top + f.from.height / 2 - 16;
            const endX = f.to.left + f.to.width / 2 - 24;
            const endY = f.to.top + f.to.height / 2 - 16;
            return (
              <motion.div
                key={f.id}
                className="absolute top-0 left-0 h-8 w-12"
                initial={{ x: startX, y: startY, scale: 1, rotate: 0, opacity: 1 }}
                animate={{
                  x: [startX, (startX + endX) / 2, endX],
                  y: [startY, Math.min(startY, endY) - 120, endY],
                  scale: [1, 1.2, 0.35],
                  rotate: [0, -160, -340],
                  opacity: [1, 1, 0.6],
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.75, ease: [0.5, 0, 0.3, 1] }}
              >
                <Sachet color={f.color} className="h-full w-full drop-shadow-md" />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </CartContext.Provider>
  );
}
