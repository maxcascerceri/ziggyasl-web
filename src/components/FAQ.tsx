"use client";

import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { easeInOut } from "@/lib/motion";
import { ChevronDown } from "./Icons";

export type FAQItem = { q: string; a: string };

export function FAQ({ items, title = "Questions" }: { items: FAQItem[]; title?: string }) {
  const reduceMotion = useReducedMotion();
  const [open, setOpen] = useState<number | null>(0);
  if (items.length === 0) return null;
  return (
    <section aria-labelledby="faq-heading">
      <h2 id="faq-heading" className="text-2xl font-bold tracking-tight text-ink sm:text-3xl">
        {title}
      </h2>
      <div className="mt-5 divide-y divide-divider rounded-[24px] bg-white px-5 shadow-card outline outline-1 -outline-offset-1 outline-black/5">
        {items.map((item, i) => {
          const isOpen = open === i;
          return (
            <div key={item.q}>
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : i)}
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between gap-4 py-4 text-left text-[1.02rem] font-semibold text-ink"
              >
                <span>{item.q}</span>
                <motion.span
                  animate={{ rotate: isOpen ? 180 : 0 }}
                  transition={{ duration: reduceMotion ? 0 : 0.25, ease: easeInOut }}
                  className="shrink-0 text-secondary"
                >
                  <ChevronDown size={18} />
                </motion.span>
              </button>
              <AnimatePresence initial={false}>
                {isOpen ? (
                  <motion.div
                    key="body"
                    initial={reduceMotion ? { opacity: 1 } : { height: 0, opacity: 0 }}
                    animate={reduceMotion ? { opacity: 1 } : { height: "auto", opacity: 1 }}
                    exit={reduceMotion ? { opacity: 0 } : { height: 0, opacity: 0 }}
                    transition={{ duration: 0.28, ease: easeInOut }}
                    className="overflow-hidden"
                  >
                    <p className="pb-5 pr-8 leading-relaxed text-secondary">{item.a}</p>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
}
