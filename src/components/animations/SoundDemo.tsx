"use client";

import { motion } from "motion/react";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";

type Track = "ohne" | "mit";

const BARS = Array.from(
  { length: 28 },
  (_, i) => Math.round((0.35 + 0.65 * Math.abs(Math.sin(i * 1.7) * Math.cos(i * 0.6))) * 100) / 100,
);

/**
 * Hörprobe „Ohne“ / „Mit HappyFoam“. Ton nur nach Klick, nie automatisch.
 * Untertitel als Text-Alternative für Gehörlose und Hörgeschädigte.
 */
export function SoundDemo({
  without,
  withFoam,
  note,
}: {
  without: { label: string; caption: string };
  withFoam: { label: string; caption: string };
  note?: string;
}) {
  const [playing, setPlaying] = useState<Track | null>(null);
  const [lastPlayed, setLastPlayed] = useState<Track | null>(null);
  const [error, setError] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const reduce = useReducedMotion();

  useEffect(() => () => audioRef.current?.pause(), []);

  const play = async (track: Track) => {
    setError(null);
    if (playing === track) {
      audioRef.current?.pause();
      setPlaying(null);
      return;
    }
    audioRef.current?.pause();
    const audio = new Audio(`/audio/${track}.mp3`);
    audioRef.current = audio;
    audio.onended = () => setPlaying(null);
    try {
      await audio.play();
      setPlaying(track);
      setLastPlayed(track);
    } catch {
      setPlaying(null);
      setLastPlayed(track);
      setError("Die Hörprobe konnte nicht abgespielt werden. Unten steht, was du gehört hättest.");
    }
  };

  const amp = playing === "ohne" ? 1 : playing === "mit" ? 0.18 : 0.14;
  const caption =
    lastPlayed === "ohne" ? without.caption : lastPlayed === "mit" ? withFoam.caption : null;

  return (
    <div className="rounded-[2rem] bg-bubble p-6 shadow-[0_20px_60px_-30px_rgba(15,27,45,0.35)] ring-1 ring-ink/5 md:p-8">
      <div className="flex h-28 items-center justify-center gap-[3px] md:gap-1" aria-hidden="true">
        {BARS.map((h, i) => (
          <motion.span
            key={i}
            className={cn(
              "block w-1.5 origin-center rounded-full md:w-2",
              playing === "ohne" ? "bg-blush" : playing === "mit" ? "bg-mint" : "bg-sky",
            )}
            style={{ height: `${Math.round(h * 100)}%` }}
            animate={
              reduce || !playing
                ? { scaleY: Math.max(0.06, h * amp) }
                : { scaleY: [h * amp * 0.4, h * amp, h * amp * 0.25, h * amp * 0.9, h * amp * 0.4] }
            }
            transition={
              reduce || !playing
                ? { duration: 0.3 }
                : { duration: 0.6 + (i % 5) * 0.12, repeat: Infinity, ease: "easeInOut" }
            }
          />
        ))}
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3">
        {(
          [
            ["ohne", without.label],
            ["mit", withFoam.label],
          ] as const
        ).map(([track, label]) => (
          <button
            key={track}
            type="button"
            onClick={() => play(track)}
            aria-pressed={playing === track}
            className={cn(
              "inline-flex h-14 items-center justify-center gap-2 rounded-full border-2 border-ink px-3 font-display text-sm leading-tight font-bold transition active:scale-95 sm:px-4 sm:text-base",
              playing === track
                ? track === "ohne"
                  ? "bg-blush text-ink"
                  : "bg-mint text-ink"
                : "bg-bubble text-ink hover:bg-sky/40",
            )}
          >
            {playing === track ? (
              <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
                <rect x="6" y="5" width="4" height="14" rx="1" fill="currentColor" />
                <rect x="14" y="5" width="4" height="14" rx="1" fill="currentColor" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
                <path d="M7 5 L19 12 L7 19 Z" fill="currentColor" />
              </svg>
            )}
            <span>
              {label}
              <span className="sr-only">
                {playing === track ? " – stoppen" : " – Hörprobe abspielen"}
              </span>
            </span>
          </button>
        ))}
      </div>

      {/* Untertitel / Text-Alternative */}
      <div
        className="mt-5 min-h-[3.5rem] rounded-2xl bg-foam px-4 py-3 text-sm text-ink"
        aria-live="polite"
      >
        {error ? <p className="text-blush-ink">{error}</p> : null}
        {caption ? (
          <p>
            <span className="font-semibold">Untertitel: </span>
            {caption}
          </p>
        ) : !error ? (
          <p className="text-muted">
            Untertitel erscheinen hier, sobald du eine Hörprobe startest.
          </p>
        ) : null}
      </div>
      <details className="mt-3 text-sm text-muted">
        <summary className="cursor-pointer font-semibold text-ink">
          Textfassung beider Hörproben
        </summary>
        <p className="mt-2">
          <strong>{without.label}:</strong> {without.caption}
        </p>
        <p className="mt-1">
          <strong>{withFoam.label}:</strong> {withFoam.caption}
        </p>
      </details>
      {note && <p className="mt-3 text-xs text-muted">{note}</p>}
    </div>
  );
}
