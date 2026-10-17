"use client";

import { useEffect, useRef } from "react";
import { cn } from "@/lib/cn";

type Bubble = {
  x: number;
  y: number;
  r: number;
  vy: number;
  wobble: number;
  phase: number;
  pushX: number;
  pushY: number;
  pop: number; // > 0 = platzt gerade
};

/**
 * Aufsteigende Schaumblasen auf Canvas. Weichen auf Desktop der Maus aus
 * und platzen bei direktem Kontakt. Pausiert außerhalb des Sichtbereichs
 * und wird bei prefers-reduced-motion gar nicht erst gestartet.
 */
export function BubbleField({ className, density = 1 }: { className?: string; density?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (motionQuery.matches) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const finePointer = window.matchMedia("(pointer: fine)").matches;
    let width = 0;
    let height = 0;
    const bubbles: Bubble[] = [];
    let raf = 0;
    let visible = false;
    let last = performance.now();
    const mouse = { x: -9999, y: -9999, active: false };

    const spawn = (initial: boolean): Bubble => {
      const r = 4 + Math.random() * Math.random() * 26;
      return {
        x: Math.random() * width,
        y: initial ? Math.random() * height : height + r + Math.random() * 40,
        r,
        vy: 14 + Math.random() * 26 + (30 - r) * 0.6,
        wobble: 6 + Math.random() * 14,
        phase: Math.random() * Math.PI * 2,
        pushX: 0,
        pushY: 0,
        pop: 0,
      };
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const target = Math.round(Math.min(40, Math.max(10, (width * height) / 26000)) * density);
      while (bubbles.length < target) bubbles.push(spawn(true));
      bubbles.length = target;
    };

    const drawBubble = (b: Bubble, x: number, y: number) => {
      if (b.pop > 0) {
        // Platz-Ring
        const p = b.pop;
        ctx.beginPath();
        ctx.arc(x, y, b.r * (1 + p * 0.8), 0, Math.PI * 2);
        ctx.strokeStyle = `rgba(15,27,45,${0.25 * (1 - p)})`;
        ctx.lineWidth = 1.5;
        ctx.stroke();
        return;
      }
      const g = ctx.createRadialGradient(x - b.r * 0.35, y - b.r * 0.4, b.r * 0.1, x, y, b.r);
      g.addColorStop(0, "rgba(255,255,255,0.95)");
      g.addColorStop(0.7, "rgba(230,245,255,0.55)");
      g.addColorStop(1, "rgba(191,230,255,0.75)");
      ctx.beginPath();
      ctx.arc(x, y, b.r, 0, Math.PI * 2);
      ctx.fillStyle = g;
      ctx.fill();
      ctx.strokeStyle = "rgba(15,27,45,0.12)";
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(x - b.r * 0.35, y - b.r * 0.38, b.r * 0.18, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(255,255,255,0.95)";
      ctx.fill();
    };

    const tick = (now: number) => {
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      ctx.clearRect(0, 0, width, height);
      for (let i = 0; i < bubbles.length; i++) {
        let b = bubbles[i];
        if (b.pop > 0) {
          b.pop += dt * 3;
          if (b.pop >= 1) {
            b = bubbles[i] = spawn(false);
          }
        } else {
          b.y -= b.vy * dt;
          b.phase += dt * 1.4;
          if (b.y < -b.r - 10) b = bubbles[i] = spawn(false);
        }
        let x = b.x + Math.sin(b.phase) * b.wobble;
        const y = b.y;

        if (mouse.active && b.pop === 0) {
          const dx = x + b.pushX - mouse.x;
          const dy = y + b.pushY - mouse.y;
          const dist = Math.hypot(dx, dy);
          if (dist < b.r * 0.9 && b.r > 8) {
            b.pop = 0.01;
          } else if (dist < 110) {
            const f = (1 - dist / 110) * 60;
            b.pushX += (dx / (dist || 1)) * f * dt * 6;
            b.pushY += (dy / (dist || 1)) * f * dt * 6;
          }
        }
        b.pushX *= 0.94;
        b.pushY *= 0.94;
        x += b.pushX;
        drawBubble(b, x, y + b.pushY);
      }
      raf = requestAnimationFrame(tick);
    };

    const start = () => {
      if (raf || !visible || document.hidden) return;
      last = performance.now();
      raf = requestAnimationFrame(tick);
    };
    const stop = () => {
      cancelAnimationFrame(raf);
      raf = 0;
    };

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible) start();
      else stop();
    });
    const ro = new ResizeObserver(resize);

    // Erst starten, wenn der Browser Luft hat – der erste Seitenaufbau hat Vorrang.
    const idle = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 300));
    const cancelIdle = window.cancelIdleCallback ?? window.clearTimeout;
    const idleId = idle(
      () => {
        ro.observe(canvas);
        resize();
        io.observe(canvas);
      },
      { timeout: 1500 },
    );

    const onVisibility = () => (document.hidden ? stop() : start());
    document.addEventListener("visibilitychange", onVisibility);

    // Mausinteraktion nur auf Geräten mit feinem Zeiger (Desktop)
    const host = canvas.parentElement;
    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
      mouse.active = true;
    };
    const onLeave = () => {
      mouse.active = false;
    };
    if (finePointer && host) {
      host.addEventListener("pointermove", onMove);
      host.addEventListener("pointerleave", onLeave);
    }

    const onMotionChange = () => {
      if (motionQuery.matches) {
        stop();
        ctx.clearRect(0, 0, width, height);
      }
    };
    motionQuery.addEventListener("change", onMotionChange);

    return () => {
      cancelIdle(idleId);
      stop();
      io.disconnect();
      ro.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      motionQuery.removeEventListener("change", onMotionChange);
      if (host) {
        host.removeEventListener("pointermove", onMove);
        host.removeEventListener("pointerleave", onLeave);
      }
    };
  }, [density]);

  return (
    <canvas
      ref={canvasRef}
      className={cn("pointer-events-none absolute inset-0 h-full w-full", className)}
      aria-hidden="true"
    />
  );
}
