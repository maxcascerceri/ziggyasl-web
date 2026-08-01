"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { copy } from "@/lib/copy";
import { links } from "@/lib/links";
import { uiSpring } from "@/lib/motion";
import { AppStoreButton } from "./AppStoreButton";

/**
 * Wide transparent bar at the top of the page; springs into a compact
 * floating pill once the user scrolls. Reversible mid-motion (spring),
 * instant state swap under Reduce Motion.
 */
export function Header() {
  const [compact, setCompact] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    const onScroll = () => setCompact(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50 flex justify-center px-3 pt-3 sm:px-5">
      <motion.div
        className="flex w-full items-center justify-between backdrop-blur-md"
        initial={false}
        animate={{
          maxWidth: compact ? 880 : 1152,
          borderRadius: compact ? 999 : 32,
          paddingLeft: compact ? 18 : 28,
          paddingRight: 16,
          paddingTop: compact ? 14 : 20,
          paddingBottom: compact ? 14 : 20,
          backgroundColor: compact
            ? "rgba(252, 251, 242, 0.85)"
            : "rgba(252, 251, 242, 0.55)",
          boxShadow: compact
            ? "0 1px 2px rgba(41,46,56,0.06), 0 10px 30px rgba(41,46,56,0.10)"
            : "0 0px 0px rgba(41,46,56,0), 0 0px 0px rgba(41,46,56,0)",
        }}
        transition={reduceMotion ? { duration: 0 } : uiSpring}
      >
        <Link href={links.home} className="flex min-h-11 items-center gap-2.5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/brand/app-icon.png"
            alt=""
            className="h-14 w-14 rounded-[15px] outline outline-1 -outline-offset-1 outline-black/10"
          />
          <span className="text-[1.65rem] font-bold leading-none tracking-tight text-ink">
            {copy.brand}
            <span className="text-brand">.</span>
          </span>
        </Link>
        <nav className="flex items-center gap-1 sm:gap-2">
          <Link
            href={links.privacyPath}
            className="hidden min-h-11 items-center px-3 text-sm font-medium text-secondary transition-colors hover:text-ink md:flex"
          >
            {copy.footer.privacy}
          </Link>
          <Link
            href={links.termsPath}
            className="hidden min-h-11 items-center px-3 text-sm font-medium text-secondary transition-colors hover:text-ink md:flex"
          >
            {copy.footer.terms}
          </Link>
          <AppStoreButton label={copy.header.cta} compact />
        </nav>
      </motion.div>
    </header>
  );
}
