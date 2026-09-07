"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useActor } from "@/components/ops/OpsChrome";
import { Sparkline } from "@/components/ops/Sparkline";
import { opsFetch } from "@/components/ops/api";
import type { Creator, RevenueOverview, Task } from "@/lib/ops/types";
import { isOverdue, paymentLabel, stageLabel, statusLabel } from "@/lib/ops/format";

export default function HomePage() {
  const { actor } = useActor();
  const [creators, setCreators] = useState<Creator[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [revenue, setRevenue] = useState<RevenueOverview | null>(null);

  const load = useCallback(async () => {
    const [c, t, r] = await Promise.all([
      opsFetch<{ creators: Creator[] }>("/api/ops/creators", actor),
      opsFetch<{ tasks: Task[] }>("/api/ops/tasks", actor),
      opsFetch<RevenueOverview>("/api/ops/revenue", actor).catch(() => null),
    ]);
    setCreators(c.creators);
    setTasks(t.tasks);
    setRevenue(r);
  }, [actor]);

  useEffect(() => {
    void load();
  }, [load]);

  const followUps = creators.filter((x) => isOverdue(x.nextFollowUp));
  const unpaid = creators.filter(
    (x) =>
      (x.stage === "active" || x.stage === "negotiation") &&
      (x.payment === "unpaid" || x.payment === "half"),
  );
  const mine = tasks.filter(
    (x) => x.assignee === actor && x.status !== "completed",
  );

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">Today</h1>
        <p className="mt-1 text-sm text-secondary">
          Follow-ups, unpaid deals, and your open work.
        </p>
      </header>

      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-secondary">
          Needs you
        </h2>
        <ul className="divide-y divide-divider overflow-hidden rounded-2xl border border-divider bg-white">
          {followUps.length + unpaid.length + mine.length === 0 && (
            <li className="px-4 py-10 text-sm text-secondary">
              Nothing overdue. Add a creator or a task.
            </li>
          )}
          {followUps.map((c) => (
            <Row
              key={`f-${c.id}`}
              href={`/team/creators?id=${c.id}`}
              title={`Follow up @${c.handle || c.name}`}
              meta={`${stageLabel[c.stage]} · ${c.nextFollowUp}`}
            />
          ))}
          {unpaid.map((c) => (
            <Row
              key={`u-${c.id}`}
              href={`/team/creators?id=${c.id}`}
              title={`${c.name || c.handle} still ${paymentLabel[c.payment]}`}
              meta={stageLabel[c.stage]}
            />
          ))}
          {mine.map((t) => (
            <Row
              key={`t-${t.id}`}
              href={`/team/work?id=${t.id}`}
              title={t.title}
              meta={statusLabel[t.status]}
            />
          ))}
        </ul>
      </section>

      <section>
        <div className="mb-3 flex items-baseline justify-between">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-secondary">
            Revenue
          </h2>
          <Link href="/team/revenue" className="text-sm font-semibold text-brand">
            See revenue
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
          {(revenue?.metrics ?? []).map((m) => (
            <div
              key={m.id}
              className="rounded-2xl border border-divider bg-white px-4 py-3"
            >
              <p className="text-sm text-secondary">{m.label}</p>
              <p className="mt-1 text-xl font-semibold">{m.formatted}</p>
              <div className="mt-2 text-brand">
                <Sparkline values={m.spark} />
              </div>
            </div>
          ))}
          {!revenue?.available && (
            <p className="col-span-full text-sm text-secondary">
              {revenue?.message ?? "RevenueCat is not configured yet."}
            </p>
          )}
        </div>
      </section>
    </div>
  );
}

function Row({
  href,
  title,
  meta,
}: {
  href: string;
  title: string;
  meta: string;
}) {
  return (
    <li>
      <Link
        href={href}
        className="flex min-h-14 items-center justify-between gap-3 px-4 py-3"
      >
        <span className="font-medium">{title}</span>
        <span className="shrink-0 text-sm text-secondary">{meta}</span>
      </Link>
    </li>
  );
}
