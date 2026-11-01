"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { durations, easeOut } from "@/lib/motion";

/**
 * Fade + rise entrance, triggered once when scrolled into view.
 * With Reduce Motion on, the rise is dropped and only a fade remains.
 */
export function FadeIn({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      // Never start at opacity 0: that hides server-rendered content until JS
      // hydrates, which slows the largest paint and blanks the page without JS.
      initial={false}
      whileInView={reduceMotion ? undefined : { y: [18, 0] }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: durations.reveal, delay, ease: easeOut }}
    >
      {children}
    </motion.div>
  );
}

/** Hero-load variant: same motion but plays immediately on mount. */
export function RiseIn({
  children,
  delay = 0,
  className,
}: {
  children: ReactNode;
  delay?: number;
  className?: string;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={false}
      animate={reduceMotion ? undefined : { y: [14, 0] }}
      transition={{ duration: durations.reveal, delay, ease: easeOut }}
    >
      {children}
    </motion.div>
  );
}
