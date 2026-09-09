"use client";

import Link from "next/link";
import { useCallback, useEffect, useState, type ReactNode } from "react";
import {
  ListSkeleton,
  PageHeader,
  Pill,
  Stat,
  Surface,
} from "@/components/ops/fields";
import { opsFetch } from "@/components/ops/api";
import type { Creator, Task } from "@/lib/ops/types";
import {
  dateLabel,
  isOverdue,
  statusLabel,
  statusPill,
  todayIso,
  usd,
} from "@/lib/ops/format";

const CAP = 12;

export default function HomePage() {
  const [creators, setCreators] = useState<Creator[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [ready, setReady] = useState(false);

  const load = useCallback(async () => {
    const [c, t] = await Promise.all([
      opsFetch<{ creators: Creator[] }>("/api/ops/creators"),
      opsFetch<{ tasks: Task[] }>("/api/ops/tasks"),
    ]);
    setCreators(c.creators);
    setTasks(t.tasks);
    setReady(true);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const toReach = creators.filter((x) => !x.reachedOut);
  const unpaid = creators.filter((x) => x.active && !x.paid);
  const workDue = tasks.filter((t) => {
    if (t.status === "completed") return false;
    if (!t.dueAt) return true;
    return t.dueAt <= todayIso();
  });

  type Row = {
    key: string;
    href: string;
    title: string;
    meta: string;
    overdue?: boolean;
    pill: ReactNode;
  };

  const reachRows: Row[] = toReach.map((c) => ({
    key: `r-${c.id}`,
    href: `/team/creators?id=${c.id}`,
    title: c.name || "Untitled",
    meta: c.videos > 0 || c.dealAmount > 0
      ? `${c.videos} for ${usd(c.dealAmount)}`
      : "Not reached yet",
    pill: <Pill className="bg-canvas text-secondary">To reach</Pill>,
  }));
  const unpaidRows: Row[] = unpaid.map((c) => ({
    key: `u-${c.id}`,
    href: `/team/creators?id=${c.id}`,
    title: c.name || "Untitled",
    meta: `${usd(c.dealAmount)} · ${c.posted}/${c.videos} posted`,
    pill: <Pill className="bg-pastel-peach text-[#b45a24]">Unpaid</Pill>,
  }));
  const workRows: Row[] = workDue.map((t) => ({
    key: `t-${t.id}`,
    href: `/team/work?id=${t.id}`,
    title: t.title,
    meta: [t.assignee, dateLabel(t.dueAt)].filter((x) => x !== "No date").join(" · "),
    overdue: isOverdue(t.dueAt),
    pill: <Pill className={statusPill[t.status]}>{statusLabel[t.status]}</Pill>,
  }));

  const groups = [
    { key: "reach", label: "To reach", href: "/team/creators", rows: reachRows },
    { key: "unpaid", label: "Unpaid", href: "/team/creators", rows: unpaidRows },
    { key: "work", label: "Work", href: "/team/work", rows: workRows },
  ].filter((g) => g.rows.length > 0);

  let used = 0;
  const shown = groups.map((g) => {
    const left = Math.max(0, CAP - used);
    const rows = g.rows.slice(0, left);
    const extra = g.rows.length > rows.length;
    used += rows.length;
    return { ...g, rows, extra };
  });

  return (
    <div>
      <PageHeader
        title="Up next"
        subtitle="People to reach, unpaid deals, and work."
      />

      <div className="mb-6 grid grid-cols-3 gap-2.5">
        <Stat label="To reach" value={String(toReach.length)} />
        <Stat label="Unpaid" value={String(unpaid.length)} />
        <Stat label="Work due" value={String(workDue.length)} />
      </div>

      {!ready ? (
        <ListSkeleton />
      ) : shown.every((g) => g.rows.length === 0) ? (
        <Surface>
          <p className="px-5 py-12 text-center text-[15px] text-secondary">
            Nothing due.
          </p>
        </Surface>
      ) : (
        <Surface>
          {shown.map((g) =>
            g.rows.length === 0 ? null : (
              <section key={g.key}>
                <h2 className="px-5 pb-1 pt-4 text-[13px] font-semibold uppercase tracking-[0.06em] text-secondary">
                  {g.label}
                </h2>
                <ul>
                  {g.rows.map((row) => (
                    <li
                      key={row.key}
                      className="border-b border-divider/70 last:border-0"
                    >
                      <Link
                        href={row.href}
                        className="flex min-h-[3.5rem] items-center justify-between gap-3 px-5 py-2.5 hover:bg-canvas/80"
                      >
                        <span className="min-w-0">
                          <span className="block font-medium">{row.title}</span>
                          {row.meta && (
                            <span
                              className={`mt-0.5 block text-[12px] ${
                                row.overdue
                                  ? "font-semibold text-pastel-peach-icon"
                                  : "text-secondary"
                              }`}
                            >
                              {row.meta}
                            </span>
                          )}
                        </span>
                        {row.pill}
                      </Link>
                    </li>
                  ))}
                </ul>
                {g.extra && (
                  <Link
                    href={g.href}
                    className="block px-5 py-3 text-[13px] font-semibold text-brand"
                  >
                    See all
                  </Link>
                )}
              </section>
            ),
          )}
        </Surface>
      )}
    </div>
  );
}
