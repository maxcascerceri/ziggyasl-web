"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { copy } from "@/lib/copy";
import { links } from "@/lib/links";
import { uiSpring } from "@/lib/motion";
import { AppStoreButton } from "./AppStoreButton";
import { CloseIcon, MenuIcon } from "./Icons";
import { SearchButton } from "./SearchCommand";

const NAV = [
  { label: "Dictionary", href: "/dictionary" },
  { label: "Learn", href: "/learn" },
  { label: "Blog", href: "/blog" },
];

/**
 * Wide transparent bar at the top of the page; springs into a compact
 * floating pill once the user scrolls. Reversible mid-motion (spring),
 * instant state swap under Reduce Motion. Pages that start with content
 * (not a tall hero) pass `solid` so the bar is readable from the top.
 */
export function Header({ solid = false }: { solid?: boolean }) {
  const [compact, setCompact] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const reduceMotion = useReducedMotion();
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setCompact(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile sheet whenever the route changes (render-time adjust, no effect).
  const [menuPath, setMenuPath] = useState(pathname);
  if (menuPath !== pathname) {
    setMenuPath(pathname);
    setMenuOpen(false);
  }

  const condensed = compact || solid;

  return (
    <header className="fixed inset-x-0 top-0 z-50 flex justify-center px-3 pt-3 sm:px-5">
      <motion.div
        className="flex w-full items-center justify-between backdrop-blur-md"
        initial={false}
        animate={{
          maxWidth: compact ? 920 : 1152,
          borderRadius: compact ? 999 : 32,
          paddingLeft: compact ? 14 : 20,
          paddingRight: 12,
          paddingTop: compact ? 10 : 14,
          paddingBottom: compact ? 10 : 14,
          backgroundColor: condensed
            ? "rgba(252, 251, 242, 0.88)"
            : "rgba(252, 251, 242, 0.55)",
          boxShadow: condensed
            ? "0 1px 2px rgba(41,46,56,0.06), 0 10px 30px rgba(41,46,56,0.10)"
            : "0 0px 0px rgba(41,46,56,0), 0 0px 0px rgba(41,46,56,0)",
        }}
        transition={reduceMotion ? { duration: 0 } : uiSpring}
      >
        <Link href={links.home} className="flex min-h-11 items-center gap-2.5">
          <Image
            src="/brand/app-icon.png"
            alt=""
            width={44}
            height={44}
            sizes="44px"
            priority
            className="h-11 w-11 rounded-[12px] outline outline-1 -outline-offset-1 outline-black/10"
          />
          <span className="text-[1.5rem] font-bold leading-none tracking-tight text-ink">
            {copy.brand}
            <span className="text-brand">.</span>
          </span>
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-1 md:flex">
          {NAV.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`relative flex min-h-11 items-center rounded-full px-4 text-[15px] font-semibold transition-colors ${
                  active ? "text-ink" : "text-secondary hover:text-ink"
                }`}
              >
                {item.label}
                {active ? (
                  <motion.span
                    layoutId="nav-active"
                    className="absolute inset-x-3 -bottom-0.5 h-[3px] rounded-full bg-brand"
                    transition={reduceMotion ? { duration: 0 } : uiSpring}
                  />
                ) : null}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-1 sm:gap-2">
          <SearchButton />
          <div className="hidden sm:block">
            <AppStoreButton label={copy.header.appStoreCta} compact />
          </div>
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={menuOpen}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full text-ink transition-colors hover:bg-cream md:hidden"
          >
            {menuOpen ? <CloseIcon size={22} /> : <MenuIcon size={22} />}
          </button>
        </div>
      </motion.div>

      <AnimatePresence>
        {menuOpen ? (
          <motion.div
            key="sheet"
            className="absolute inset-x-3 top-[76px] rounded-[28px] bg-cream/95 p-3 shadow-phone backdrop-blur-md md:hidden"
            initial={{ opacity: 0, y: reduceMotion ? 0 : -8, scale: reduceMotion ? 1 : 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: reduceMotion ? 0 : -6, scale: reduceMotion ? 1 : 0.98 }}
            transition={reduceMotion ? { duration: 0 } : uiSpring}
          >
            <nav aria-label="Mobile" className="flex flex-col">
              {NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex min-h-12 items-center rounded-2xl px-4 text-lg font-semibold text-ink transition-colors hover:bg-white"
                >
                  {item.label}
                </Link>
              ))}
              <Link
                href="/about"
                className="flex min-h-12 items-center rounded-2xl px-4 text-lg font-semibold text-ink transition-colors hover:bg-white"
              >
                About
              </Link>
              <div className="mt-2 flex gap-2 px-2 pb-1">
                <AppStoreButton label={copy.header.appStoreCta} compact />
              </div>
            </nav>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
