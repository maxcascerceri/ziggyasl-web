"use client";

import { useEffect, useState } from "react";
import { useActor } from "@/components/ops/OpsChrome";
import { Sparkline } from "@/components/ops/Sparkline";
import { opsFetch } from "@/components/ops/api";
import type { RevenueOverview } from "@/lib/ops/types";

export default function RevenuePage() {
  const { actor } = useActor();
  const [data, setData] = useState<RevenueOverview | null>(null);

  useEffect(() => {
    void opsFetch<RevenueOverview>("/api/ops/revenue", actor).then(setData);
  }, [actor]);

  return (
    <div>
      <header className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Revenue</h1>
        <p className="mt-1 text-sm text-secondary">
          Last 28 days from RevenueCat. Production proceeds.
        </p>
      </header>
      {!data?.available && (
        <p className="mb-4 text-sm text-secondary">
          {data?.message ?? "Loading…"}
        </p>
      )}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {(data?.metrics ?? []).map((m) => (
          <div
            key={m.id}
            className="rounded-2xl border border-divider bg-white px-5 py-4"
          >
            <p className="text-sm text-secondary">{m.label}</p>
            <p className="mt-2 text-3xl font-semibold tracking-tight">
              {m.formatted}
            </p>
            <p className="mt-1 text-sm text-secondary">Last 28 days</p>
            <div className="mt-4 text-brand">
              <Sparkline values={m.spark} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
