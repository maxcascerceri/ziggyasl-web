"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { ACTORS, type Activity, type Actor } from "@/lib/ops/types";
import { relativeTime } from "@/lib/ops/format";
import { opsFetch } from "./api";

const NAV = [
  { href: "/team", label: "Home" },
  { href: "/team/revenue", label: "Revenue" },
  { href: "/team/creators", label: "Creators" },
  { href: "/team/work", label: "Work" },
  { href: "/team/money", label: "Money" },
] as const;

const MOBILE = [
  { href: "/team", label: "Home" },
  { href: "/team/creators", label: "Creators" },
  { href: "/team/work", label: "Work" },
  { href: "/team/more", label: "More" },
] as const;

const ACTOR_KEY = "ziggy-ops-actor";
const SEEN_KEY = "ziggy-ops-seen";

const ActorCtx = createContext<{
  actor: Actor;
  choose: (next: Actor) => void;
}>({ actor: "Bernie", choose: () => {} });

export function useActor() {
  return useContext(ActorCtx);
}

function entityHref(item: Activity) {
  if (item.entityType === "creator") return `/team/creators?id=${item.entityId}`;
  if (item.entityType === "task") return `/team/work?id=${item.entityId}`;
  return `/team/money?id=${item.entityId}`;
}

export function OpsChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [actor, setActor] = useState<Actor>("Bernie");
  const [activity, setActivity] = useState<Activity[]>([]);
  const [open, setOpen] = useState(false);
  const [seen, setSeen] = useState<string>("");

  useEffect(() => {
    const saved = localStorage.getItem(ACTOR_KEY);
    if (saved && (ACTORS as readonly string[]).includes(saved)) {
      setActor(saved as Actor);
    }
  }, []);

  const choose = (next: Actor) => {
    setActor(next);
    localStorage.setItem(ACTOR_KEY, next);
  };

  const loadActivity = useCallback(async () => {
    try {
      const data = await opsFetch<{ activity: Activity[] }>(
        "/api/ops/activity",
        actor,
      );
      setActivity(data.activity);
    } catch {
      /* session handled by middleware */
    }
  }, [actor]);

  useEffect(() => {
    setSeen(localStorage.getItem(`${SEEN_KEY}:${actor}`) ?? "");
    void loadActivity();
    const t = setInterval(() => void loadActivity(), 20_000);
    return () => clearInterval(t);
  }, [actor, loadActivity]);

  const unread = useMemo(() => {
    if (!seen) return activity.length;
    return activity.filter((a) => a.createdAt > seen).length;
  }, [activity, seen]);

  function markSeen() {
    const stamp = new Date().toISOString();
    localStorage.setItem(`${SEEN_KEY}:${actor}`, stamp);
    setSeen(stamp);
  }

  function openBell() {
    setOpen(true);
    markSeen();
  }

  async function logout() {
    await fetch("/api/ops/login", { method: "DELETE" });
    router.push("/team/login");
  }

  return (
    <ActorCtx.Provider value={{ actor, choose }}>
    <div className="flex min-h-dvh bg-canvas text-ink">
      <aside className="hidden w-56 shrink-0 flex-col border-r border-divider bg-white md:flex">
        <div className="px-5 pb-2 pt-6">
          <p className="text-lg font-semibold tracking-tight">
            Ziggy<span className="text-brand">.</span>
          </p>
          <p className="text-sm text-secondary">Team</p>
        </div>
        <nav className="flex flex-1 flex-col gap-1 px-3 py-4">
          {NAV.map((item) => {
            const active =
              item.href === "/team"
                ? pathname === "/team"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex min-h-11 items-center rounded-xl px-3 text-[15px] ${
                  active
                    ? "bg-soft font-semibold text-brand"
                    : "font-medium text-secondary hover:bg-canvas hover:text-ink"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col pb-[calc(4.5rem+env(safe-area-inset-bottom))] md:pb-0">
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between gap-3 border-b border-divider bg-canvas/90 px-4 backdrop-blur-md md:h-16 md:px-6">
          <label className="flex min-h-11 items-center gap-2 text-sm text-secondary">
            Acting as
            <select
              value={actor}
              onChange={(e) => choose(e.target.value as Actor)}
              className="min-h-11 rounded-xl border border-divider bg-white px-3 font-semibold text-ink"
            >
              {ACTORS.map((a) => (
                <option key={a}>{a}</option>
              ))}
            </select>
          </label>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={openBell}
              className="relative flex h-11 w-11 items-center justify-center rounded-full hover:bg-white"
              aria-label="Activity"
            >
              <BellIcon />
              {unread > 0 && (
                <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-brand">
                  <span className="sr-only">
                    {unread > 9 ? "9+" : unread} new
                  </span>
                </span>
              )}
            </button>
            <button
              type="button"
              onClick={() => void logout()}
              className="hidden min-h-11 rounded-xl px-3 text-sm font-medium text-secondary hover:text-ink md:block"
            >
              Log out
            </button>
          </div>
        </header>

        <main className="flex-1 px-4 py-5 md:px-8 md:py-7">{children}</main>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-divider bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md md:hidden">
        <div className="grid grid-cols-4">
          {MOBILE.map((item) => {
            const active =
              item.href === "/team"
                ? pathname === "/team"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex min-h-12 flex-col items-center justify-center text-xs font-semibold ${
                  active ? "text-brand" : "text-secondary"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </nav>

      {open && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <button
            type="button"
            className="absolute inset-0 bg-ink/20"
            aria-label="Close activity"
            onClick={() => setOpen(false)}
          />
          <div className="relative flex h-full w-full flex-col bg-white md:w-[380px] md:border-l md:border-divider">
            <header className="flex items-center justify-between border-b border-divider px-5 py-4">
              <h2 className="text-lg font-semibold">Activity</h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex h-11 items-center px-2 text-secondary"
              >
                Close
              </button>
            </header>
            <ul className="flex-1 overflow-y-auto">
              {activity.length === 0 && (
                <li className="px-5 py-10 text-sm text-secondary">
                  Changes you make will show up here.
                </li>
              )}
              {activity.map((item) => (
                <li key={item.id} className="border-b border-divider">
                  <Link
                    href={entityHref(item)}
                    onClick={() => setOpen(false)}
                    className="flex min-h-14 items-start justify-between gap-3 px-5 py-3"
                  >
                    <span className="text-[15px] leading-snug text-ink">
                      {item.summary}
                    </span>
                    <span className="shrink-0 text-xs text-secondary">
                      {relativeTime(item.createdAt)}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
    </ActorCtx.Provider>
  );
}

function BellIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden>
      <path
        d="M10 2.5a4.5 4.5 0 0 0-4.5 4.5c0 3.2-1.2 4.7-1.8 5.3H16.3c-.6-.6-1.8-2.1-1.8-5.3A4.5 4.5 0 0 0 10 2.5Z"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <path
        d="M8 15.2a2 2 0 0 0 4 0"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}
