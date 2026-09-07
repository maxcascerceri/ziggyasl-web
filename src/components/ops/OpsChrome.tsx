"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { type Activity } from "@/lib/ops/types";
import { activityDay, relativeTime } from "@/lib/ops/format";
import { opsFetch } from "./api";

const NAV = [
  { href: "/team", label: "Home" },
  { href: "/team/creators", label: "Creators" },
  { href: "/team/work", label: "Work" },
  { href: "/team/money", label: "Money" },
] as const;

const SEEN_KEY = "ziggy-ops-seen";

function entityHref(item: Activity) {
  if (item.entityType === "creator") return `/team/creators?id=${item.entityId}`;
  if (item.entityType === "task") return `/team/work?id=${item.entityId}`;
  return `/team/money?id=${item.entityId}`;
}

function navActive(pathname: string, href: string) {
  return href === "/team" ? pathname === "/team" : pathname.startsWith(href);
}

export function OpsChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [activity, setActivity] = useState<Activity[]>([]);
  const [open, setOpen] = useState(false);
  const [seen, setSeen] = useState<string>("");

  const loadActivity = useCallback(async () => {
    try {
      const data = await opsFetch<{ activity: Activity[] }>("/api/ops/activity");
      setActivity(data.activity);
    } catch {
      /* session handled by middleware */
    }
  }, []);

  useEffect(() => {
    setSeen(localStorage.getItem(SEEN_KEY) ?? "");
    void loadActivity();
    const t = setInterval(() => void loadActivity(), 20_000);
    return () => clearInterval(t);
  }, [loadActivity]);

  const unread = useMemo(() => {
    if (!seen) return activity.length;
    return activity.filter((a) => a.createdAt > seen).length;
  }, [activity, seen]);

  const groups = useMemo(() => {
    const order = ["Today", "Yesterday", "Earlier"] as const;
    const map: Record<(typeof order)[number], Activity[]> = {
      Today: [],
      Yesterday: [],
      Earlier: [],
    };
    for (const item of activity) {
      map[activityDay(item.createdAt)].push(item);
    }
    return order
      .map((label) => ({ label, items: map[label] }))
      .filter((g) => g.items.length > 0);
  }, [activity]);

  function markSeen() {
    const stamp = new Date().toISOString();
    localStorage.setItem(SEEN_KEY, stamp);
    setSeen(stamp);
  }

  async function logout() {
    await fetch("/api/ops/login", { method: "DELETE" });
    router.push("/team/login");
  }

  return (
    <div className="flex min-h-dvh bg-canvas text-ink">
      <aside className="hidden w-[220px] shrink-0 flex-col bg-white/70 md:flex">
        <div className="px-6 pb-3 pt-7">
          <p className="text-[1.35rem] font-semibold tracking-tight">
            Ziggy<span className="text-brand">.</span>
          </p>
          <p className="mt-0.5 text-[13px] font-medium text-secondary">Team</p>
        </div>
        <nav className="flex flex-1 flex-col gap-0.5 px-3 py-3">
          {NAV.map((item) => {
            const active = navActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex min-h-11 items-center rounded-[14px] px-3 text-[15px] transition-colors ${
                  active
                    ? "bg-white font-semibold text-brand shadow-card"
                    : "font-medium text-secondary hover:bg-white/80 hover:text-ink"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col pb-[calc(4.75rem+env(safe-area-inset-bottom))] md:pb-0">
        <header className="sticky top-0 z-30 flex h-12 items-center justify-end gap-1 px-4 md:h-[4.25rem] md:px-8">
          <button
            type="button"
            onClick={() => {
              setOpen(true);
              markSeen();
            }}
            className="relative flex h-11 w-11 items-center justify-center rounded-full bg-white/80 text-ink shadow-card active:scale-[0.97]"
            aria-label="Updates"
          >
            <BellIcon />
            {unread > 0 && (
              <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-brand" />
            )}
          </button>
        </header>

        <main className="mx-auto w-full max-w-3xl flex-1 px-4 pb-8 pt-1 md:px-8 md:pt-2">
          {children}
        </main>
      </div>

      <nav className="fixed inset-x-0 bottom-0 z-30 bg-white/90 pb-[env(safe-area-inset-bottom)] shadow-[0_-8px_30px_rgba(41,46,56,0.06)] backdrop-blur-md md:hidden">
        <div className="grid grid-cols-4">
          {NAV.map((item) => {
            const active = navActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex min-h-[3.25rem] flex-col items-center justify-center text-[11px] font-semibold tracking-wide ${
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
            className="absolute inset-0 bg-ink/15"
            aria-label="Close updates"
            onClick={() => setOpen(false)}
          />
          <div className="relative flex h-full w-full flex-col bg-white md:w-[400px] md:shadow-card">
            <header className="flex items-center justify-between px-5 py-4">
              <h2 className="text-lg font-semibold tracking-tight">Updates</h2>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex h-10 w-10 items-center justify-center rounded-full text-secondary hover:bg-canvas"
                aria-label="Close"
              >
                ×
              </button>
            </header>
            <div className="flex-1 overflow-y-auto px-2 pb-4">
              {activity.length === 0 ? (
                <p className="px-4 py-12 text-center text-[15px] text-secondary">
                  No updates yet.
                </p>
              ) : (
                groups.map((g) => (
                  <section key={g.label}>
                    <h3 className="px-4 pb-1 pt-3 text-[13px] font-semibold uppercase tracking-[0.06em] text-secondary">
                      {g.label}
                    </h3>
                    <ul>
                      {g.items.map((item) => (
                        <li key={item.id}>
                          <Link
                            href={entityHref(item)}
                            onClick={() => setOpen(false)}
                            className="flex items-start justify-between gap-3 rounded-[16px] px-4 py-3 hover:bg-canvas"
                          >
                            <span className="text-[15px] leading-snug text-ink">
                              {item.summary}
                            </span>
                            <span className="shrink-0 pt-0.5 text-[12px] tabular-nums text-secondary">
                              {relativeTime(item.createdAt)}
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </section>
                ))
              )}
            </div>
            <div className="px-5 py-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
              <button
                type="button"
                onClick={() => void logout()}
                className="min-h-11 w-full text-[15px] font-medium text-secondary"
              >
                Log out
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
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
