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
} from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import type { SearchEntry } from "@/lib/catalog";
import { signThumbURL } from "@/lib/firebasePublic";
import { uiSpring } from "@/lib/motion";
import { SearchIcon } from "./Icons";

type Ctx = { open: () => void };
const SearchCtx = createContext<Ctx>({ open: () => {} });

export function useSearch() {
  return useContext(SearchCtx);
}

const RECENT_KEY = "ziggy.recentSearches";

function readRecent(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const parsed = JSON.parse(localStorage.getItem(RECENT_KEY) ?? "[]");
    return Array.isArray(parsed) ? parsed.filter((s) => typeof s === "string") : [];
  } catch {
    return [];
  }
}

function normalize(s: string) {
  return s.toLowerCase().replace(/[’']/g, "").replace(/[^a-z0-9 ]+/g, " ").trim();
}

function score(entry: SearchEntry, q: string): number {
  const name = normalize(entry.display);
  if (name === q) return 100;
  if (name.startsWith(q)) return 80 - name.length * 0.1;
  for (const alias of entry.aliases) {
    const a = normalize(alias);
    if (a === q) return 95;
    if (a.startsWith(q)) return 75;
  }
  if (name.split(" ").some((w) => w.startsWith(q))) return 60;
  if (name.includes(q)) return 40;
  if (normalize(entry.category).includes(q)) return 10;
  return 0;
}

/**
 * Site-wide search provider. Press "/" or Cmd/Ctrl+K anywhere, or use the
 * header button. The index is fetched lazily on first open.
 */
export function SearchProvider({ children }: { children: ReactNode }) {
  const [isOpen, setOpen] = useState(false);
  const open = useCallback(() => setOpen(true), []);
  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const typing =
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable);
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((v) => !v);
      } else if (e.key === "/" && !typing) {
        e.preventDefault();
        setOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <SearchCtx.Provider value={{ open }}>
      {children}
      <SearchPalette isOpen={isOpen} onClose={close} />
    </SearchCtx.Provider>
  );
}

export function SearchButton({
  variant = "icon",
  className = "",
  placeholder = "Search signs",
}: {
  variant?: "icon" | "field";
  className?: string;
  placeholder?: string;
}) {
  const { open } = useSearch();
  if (variant === "field") {
    return (
      <button
        type="button"
        onClick={open}
        className={`card-lift flex min-h-14 w-full items-center gap-3 rounded-full bg-white px-5 text-left text-base text-secondary outline outline-1 -outline-offset-1 outline-divider ${className}`}
      >
        <SearchIcon size={20} className="text-brand" />
        <span className="flex-1">{placeholder}</span>
        <kbd className="hidden rounded-md border border-divider bg-cream px-1.5 py-0.5 text-xs font-semibold text-secondary sm:inline">
          /
        </kbd>
      </button>
    );
  }
  return (
    <button
      type="button"
      onClick={open}
      aria-label="Search signs"
      className={`inline-flex h-11 w-11 items-center justify-center rounded-full text-ink transition-colors hover:bg-cream ${className}`}
    >
      <SearchIcon size={20} />
    </button>
  );
}

function SearchPalette({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const reduceMotion = useReducedMotion();
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [index, setIndex] = useState<SearchEntry[] | null>(null);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const [recent, setRecent] = useState<string[]>([]);

  // Reset the palette each time it opens (render-time adjust, no effect).
  const [wasOpen, setWasOpen] = useState(isOpen);
  if (wasOpen !== isOpen) {
    setWasOpen(isOpen);
    if (isOpen) {
      setQuery("");
      setActive(0);
      setRecent(readRecent());
    }
  }

  useEffect(() => {
    if (!isOpen) return;
    if (!index) {
      fetch("/search-index.json")
        .then((r) => r.json())
        .then((data: SearchEntry[]) => setIndex(data))
        .catch(() => setIndex([]));
    }
    const t = setTimeout(() => inputRef.current?.focus(), 30);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      clearTimeout(t);
      document.body.style.overflow = prev;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const results = useMemo(() => {
    if (!index) return [];
    const q = normalize(query);
    if (!q) {
      const recents = recent
        .map((id) => index.find((e) => e.id === id))
        .filter((e): e is SearchEntry => Boolean(e));
      return recents.slice(0, 6);
    }
    return index
      .map((e) => ({ e, s: score(e, q) }))
      .filter((x) => x.s > 0)
      .sort((a, b) => b.s - a.s || a.e.display.localeCompare(b.e.display))
      .slice(0, 8)
      .map((x) => x.e);
  }, [index, query, recent]);

  const go = useCallback(
    (entry: SearchEntry) => {
      try {
        const next = [entry.id, ...recent.filter((r) => r !== entry.id)].slice(0, 8);
        localStorage.setItem(RECENT_KEY, JSON.stringify(next));
      } catch {}
      onClose();
      router.push(`/sign/${entry.slug}`);
    },
    [onClose, recent, router],
  );

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") onClose();
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, Math.max(results.length - 1, 0)));
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    }
    if (e.key === "Enter" && results[active]) {
      e.preventDefault();
      go(results[active]);
    }
  };

  return (
    <AnimatePresence>
      {isOpen ? (
        <motion.div
          key="search"
          role="dialog"
          aria-modal="true"
          aria-label="Search signs"
          className="fixed inset-0 z-[100] flex items-start justify-center px-4 pt-[12vh]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.16 }}
        >
          <button
            type="button"
            aria-label="Close search"
            onClick={onClose}
            className="absolute inset-0 bg-ink/35 backdrop-blur-sm"
          />
          <motion.div
            className="relative w-full max-w-xl overflow-hidden rounded-[28px] bg-white shadow-phone"
            initial={{ opacity: 0, y: reduceMotion ? 0 : -12, scale: reduceMotion ? 1 : 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: reduceMotion ? 0 : -8, scale: reduceMotion ? 1 : 0.98 }}
            transition={reduceMotion ? { duration: 0 } : uiSpring}
            onKeyDown={onKeyDown}
          >
            <div className="flex items-center gap-3 border-b border-divider px-5">
              <SearchIcon size={20} className="shrink-0 text-brand" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setActive(0);
                }}
                placeholder="Type a word, like “thank you”"
                autoComplete="off"
                spellCheck={false}
                className="h-16 w-full bg-transparent text-lg text-ink placeholder:text-secondary/70 focus:outline-none"
                aria-activedescendant={results[active] ? `search-${results[active].id}` : undefined}
                aria-controls="search-results"
              />
              <kbd className="hidden rounded-md border border-divider bg-cream px-1.5 py-0.5 text-xs font-semibold text-secondary sm:inline">
                esc
              </kbd>
            </div>

            <ul id="search-results" role="listbox" className="max-h-[52vh] overflow-y-auto p-2">
              {!index ? (
                <li className="px-4 py-6 text-center text-sm text-secondary">Loading signs…</li>
              ) : results.length === 0 ? (
                <li className="px-4 py-8 text-center text-sm text-secondary">
                  {query
                    ? <>No sign for “{query}” yet. Try a simpler word.</>
                    : "Start typing to search 700+ signs."}
                </li>
              ) : (
                results.map((entry, i) => (
                  <li key={entry.id} role="option" aria-selected={i === active} id={`search-${entry.id}`}>
                    <button
                      type="button"
                      onMouseEnter={() => setActive(i)}
                      onClick={() => go(entry)}
                      className={`flex w-full items-center gap-3 rounded-2xl px-3 py-2 text-left transition-colors ${
                        i === active ? "bg-soft/60" : "hover:bg-cream"
                      }`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={signThumbURL(entry.id)}
                        alt=""
                        loading="lazy"
                        className="h-11 w-[4.5rem] shrink-0 rounded-lg bg-cream object-cover"
                      />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate font-bold text-ink">{entry.display}</span>
                        <span className="block truncate text-xs text-secondary">
                          {entry.aliases.length ? `also ${entry.aliases.join(", ")} · ` : ""}
                          {entry.category || (entry.type === "phrase" ? "Phrase" : "Sign")}
                        </span>
                      </span>
                      {!query ? (
                        <span className="text-[11px] font-semibold uppercase tracking-wide text-secondary/70">
                          Recent
                        </span>
                      ) : null}
                    </button>
                  </li>
                ))
              )}
            </ul>
            <div className="flex items-center justify-between border-t border-divider px-5 py-2.5 text-[11px] font-medium text-secondary">
              <span>↑↓ to move · Enter to open</span>
              <span>Ziggy ASL Dictionary</span>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
