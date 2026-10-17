"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { pressSpring } from "@/lib/motion";
import { CheckIcon, LinkIcon } from "./Icons";

export function CopyLinkButton({ label = "Copy link" }: { label?: string }) {
  const reduceMotion = useReducedMotion();
  const [done, setDone] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setDone(true);
      setTimeout(() => setDone(false), 1800);
    } catch {}
  };

  return (
    <motion.button
      type="button"
      onClick={copy}
      whileTap={reduceMotion ? undefined : { scale: 0.94 }}
      transition={pressSpring}
      className="inline-flex min-h-10 items-center gap-2 rounded-full bg-cream px-4 text-sm font-semibold text-ink outline outline-1 -outline-offset-1 outline-divider transition-colors hover:bg-white"
      aria-live="polite"
    >
      <span className="relative h-4 w-4">
        <AnimatePresence initial={false} mode="wait">
          {done ? (
            <motion.span
              key="check"
              className="absolute inset-0 text-pastel-mint-icon"
              initial={{ scale: 0.4, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.4, opacity: 0 }}
              transition={pressSpring}
            >
              <CheckIcon size={16} />
            </motion.span>
          ) : (
            <motion.span
              key="link"
              className="absolute inset-0"
              initial={{ scale: 0.4, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.4, opacity: 0 }}
              transition={pressSpring}
            >
              <LinkIcon size={16} />
            </motion.span>
          )}
        </AnimatePresence>
      </span>
      {done ? "Copied" : label}
    </motion.button>
  );
}
