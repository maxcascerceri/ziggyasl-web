"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { copy } from "@/lib/copy";
import { links } from "@/lib/links";
import { pressSpring, uiSpring } from "@/lib/motion";
import { CheckIcon, CloseIcon, ReplayIcon } from "../Icons";
import type { ClipData } from "./SignClip";

const ROUNDS = 5;

function seededShuffle<T>(arr: T[], seed: number): T[] {
  const out = [...arr];
  let s = seed;
  for (let i = out.length - 1; i > 0; i--) {
    s = (s * 9301 + 49297) % 233280;
    const j = Math.floor((s / 233280) * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

function initialSeed(clips: ClipData[]): number {
  let h = 7;
  for (const c of clips) for (let i = 0; i < c.id.length; i++) h = (h * 31 + c.id.charCodeAt(i)) % 10007;
  return h;
}

/**
 * "Watch and choose" — the app's core recognition drill, on the web.
 * Shows a clip, offers three names, celebrates, moves on. Five rounds then
 * a soft handoff to the app.
 */
export function PracticeWidget({ clips, title = "Try it" }: { clips: ClipData[]; title?: string }) {
  const reduceMotion = useReducedMotion();
  // Deterministic first seed (derived from the clip set) so server and client render the same
  // opening question; "Play again" re-seeds randomly on the client.
  const [seed, setSeed] = useState(() => initialSeed(clips));
  const [round, setRound] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  const order = useMemo(() => seededShuffle(clips, seed).slice(0, ROUNDS), [clips, seed]);
  const current = order[round];

  const choices = useMemo(() => {
    if (!current) return [];
    const others = seededShuffle(
      clips.filter((c) => c.id !== current.id),
      seed + round * 7,
    ).slice(0, 2);
    return seededShuffle([current, ...others], seed + round * 13);
  }, [clips, current, seed, round]);

  useEffect(() => {
    const v = videoRef.current;
    if (!v || reduceMotion) return;
    v.currentTime = 0;
    void v.play().catch(() => {});
  }, [current, reduceMotion]);

  if (clips.length < 3) return null;

  const correct = picked === current?.id;
  const done = round >= ROUNDS;

  const next = () => {
    if (picked === current.id) setScore((s) => s + 1);
    setPicked(null);
    setRound((r) => r + 1);
  };

  const restart = () => {
    setSeed(Math.floor(Math.random() * 10000));
    setRound(0);
    setPicked(null);
    setScore(0);
  };

  return (
    <section
      aria-label={title}
      className="my-12 overflow-hidden rounded-[32px] bg-gradient-to-br from-soft/70 via-white to-pastel-mint/50 p-5 shadow-card outline outline-1 -outline-offset-1 outline-black/5 sm:p-7"
    >
      <div className="flex items-center justify-between">
        <p className="text-sm font-bold uppercase tracking-[0.12em] text-brand-shadow">{title}</p>
        {!done ? (
          <p className="text-sm font-semibold text-secondary">
            {Math.min(round + 1, ROUNDS)} / {ROUNDS}
          </p>
        ) : null}
      </div>

      {done ? (
        <div className="mt-4 text-center">
          <Image
            src="/brand/ziggy-celebrate.png"
            alt=""
            aria-hidden
            width={160}
            height={160}
            sizes="160px"
            className="mx-auto h-auto w-40"
          />
          <p className="text-3xl font-bold tracking-tight text-ink">
            {score} out of {ROUNDS}
          </p>
          <p className="mt-2 text-secondary">
            {score === ROUNDS
              ? "Perfect. That is exactly how the Ziggy app drills every sign, with spaced review so it sticks."
              : score >= 3
                ? "Nice. A few more reps and these are yours. The app keeps score for you and brings back the ones you missed."
                : "Good start. Recognition comes before production, and it comes fast with daily reps."}
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <a
              href={links.appStore}
              className="cta-clay relative isolate inline-flex min-h-12 items-center rounded-full bg-brand px-6 text-base font-semibold text-white"
            >
              {copy.appCta.appStoreCta}
            </a>
            <button
              type="button"
              onClick={restart}
              className="inline-flex min-h-12 items-center gap-2 rounded-full bg-white px-6 text-base font-semibold text-ink outline outline-1 -outline-offset-1 outline-divider"
            >
              <ReplayIcon size={18} /> Again
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-4 grid gap-5 sm:grid-cols-[1.1fr_1fr] sm:items-center">
          <div className="relative aspect-video overflow-hidden rounded-[22px] bg-ink shadow-card">
            <video
              ref={videoRef}
              key={current.id}
              src={current.video}
              poster={current.poster}
              muted
              loop
              playsInline
              // No autoPlay attribute: SSR can't see prefers-reduced-motion, so the effect below
              // decides whether to start playback after hydration.
              preload="auto"
              controls={Boolean(reduceMotion)}
              aria-label="Which sign is this?"
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
          <div>
            <p className="text-xl font-bold text-ink">Which sign is this?</p>
            <ul className="mt-4 space-y-2">
              {choices.map((c) => {
                const isPicked = picked === c.id;
                const isAnswer = c.id === current.id;
                const state = picked
                  ? isAnswer
                    ? "bg-pastel-mint text-ink outline-pastel-mint-icon"
                    : isPicked
                      ? "bg-pastel-peach text-ink outline-pastel-peach-icon"
                      : "bg-white text-secondary outline-divider"
                  : "bg-white text-ink outline-divider hover:bg-cream";
                return (
                  <li key={c.id}>
                    <motion.button
                      type="button"
                      disabled={Boolean(picked)}
                      onClick={() => setPicked(c.id)}
                      whileTap={reduceMotion || picked ? undefined : { scale: 0.98 }}
                      transition={pressSpring}
                      className={`flex min-h-12 w-full items-center justify-between rounded-2xl px-4 text-left text-base font-semibold outline outline-1 -outline-offset-1 transition-colors ${state}`}
                    >
                      {c.display}
                      {picked && isAnswer ? (
                        <CheckIcon size={18} className="text-pastel-mint-icon" />
                      ) : picked && isPicked ? (
                        <CloseIcon size={18} className="text-pastel-peach-icon" />
                      ) : null}
                    </motion.button>
                  </li>
                );
              })}
            </ul>
            <AnimatePresence mode="wait">
              {picked ? (
                <motion.div
                  key="feedback"
                  initial={{ opacity: 0, y: reduceMotion ? 0 : 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={uiSpring}
                  className="mt-4 flex items-center justify-between gap-3"
                >
                  <p className="text-sm font-semibold text-ink">
                    {correct ? "Yes, that's it." : `Not quite. That one is ${current.display}.`}
                  </p>
                  <button
                    type="button"
                    onClick={next}
                    className="cta-clay relative isolate inline-flex min-h-11 items-center rounded-full bg-brand px-5 text-sm font-semibold text-white"
                  >
                    {round + 1 >= ROUNDS ? "See score" : "Next"}
                  </button>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
        </div>
      )}
    </section>
  );
}
