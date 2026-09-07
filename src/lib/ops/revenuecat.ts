import { getRcCache, setRcCache } from "./store";
import type { OverviewMetric, RevenueOverview } from "./types";

const CHARTS: { id: string; chart: string; label: string }[] = [
  { id: "active_trials", chart: "trials", label: "Active trials" },
  { id: "active_subscriptions", chart: "actives", label: "Active subscriptions" },
  { id: "mrr", chart: "mrr", label: "MRR" },
  { id: "revenue", chart: "revenue", label: "Revenue" },
  { id: "new_customers", chart: "customers_new", label: "New customers" },
  { id: "active_customers", chart: "customers_active", label: "Active customers" },
];

const CACHE_MS = 20 * 60 * 1000;

function projectId() {
  return process.env.REVENUECAT_PROJECT_ID ?? "";
}

function secret() {
  return process.env.REVENUECAT_SECRET_API_KEY ?? "";
}

function formatValue(id: string, value: number, unit?: string): string {
  const money = unit === "$" || id.includes("mrr") || id.includes("revenue");
  const amount = money && Number.isInteger(value) && Math.abs(value) >= 100 ? value / 100 : value;
  if (money) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(amount);
  }
  return new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(value);
}

function isoDaysAgo(days: number) {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - days);
  return d.toISOString().slice(0, 10);
}

async function rcGet(path: string) {
  const res = await fetch(`https://api.revenuecat.com/v2${path}`, {
    headers: {
      Authorization: `Bearer ${secret()}`,
      Accept: "application/json",
    },
    cache: "no-store",
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`RevenueCat ${res.status}: ${text.slice(0, 200)}`);
  }
  return res.json() as Promise<Record<string, unknown>>;
}

function sparkFromChart(json: Record<string, unknown>): number[] {
  const values = json.values;
  if (!Array.isArray(values)) return [];
  return values
    .map((row) => {
      if (typeof row === "number") return row;
      if (row && typeof row === "object") {
        const r = row as Record<string, unknown>;
        const v = r.value ?? r.y ?? r.measures;
        if (typeof v === "number") return v;
        if (Array.isArray(v) && typeof v[0] === "number") return v[0];
        if (Array.isArray(r.values) && typeof r.values[0] === "number") {
          return r.values[0] as number;
        }
      }
      return 0;
    })
    .slice(-28);
}

export async function getRevenueOverview(): Promise<RevenueOverview> {
  if (!secret() || !projectId()) {
    return {
      fetchedAt: null,
      available: false,
      message: "Add REVENUECAT_SECRET_API_KEY and REVENUECAT_PROJECT_ID to env.",
      metrics: CHARTS.map((c) => ({
        id: c.id,
        label: c.label,
        value: 0,
        formatted: "—",
        spark: [],
      })),
    };
  }

  const cached = await getRcCache();
  if (
    cached &&
    Date.now() - new Date(cached.fetchedAt).getTime() < CACHE_MS &&
    cached.payload &&
    typeof cached.payload === "object" &&
    (cached.payload as RevenueOverview).available
  ) {
    return cached.payload as RevenueOverview;
  }

  try {
    const overview = await rcGet(
      `/projects/${projectId()}/metrics/overview?currency=USD`,
    );
    const list = Array.isArray(overview.metrics)
      ? (overview.metrics as Array<{ id?: string; name?: string; value?: number; unit?: string; display_name?: string }>)
      : [];

    const start = isoDaysAgo(28);
    const end = isoDaysAgo(0);
    const sparks = await Promise.all(
      CHARTS.map(async (c) => {
        try {
          const chart = await rcGet(
            `/projects/${projectId()}/charts/${c.chart}?start_date=${start}&end_date=${end}&currency=USD`,
          );
          return sparkFromChart(chart);
        } catch {
          return [] as number[];
        }
      }),
    );

    const metrics: OverviewMetric[] = CHARTS.map((c, i) => {
      const hit =
        list.find((m) => m.id === c.id) ||
        list.find((m) => (m.id ?? "").includes(c.id.replace("active_", ""))) ||
        list.find((m) =>
          (m.display_name ?? m.name ?? "")
            .toLowerCase()
            .includes(c.label.toLowerCase().split(" ")[0]!),
        );
      const value = typeof hit?.value === "number" ? hit.value : 0;
      return {
        id: c.id,
        label: c.label,
        value,
        formatted: hit ? formatValue(c.id, value, hit.unit) : "—",
        spark: sparks[i] ?? [],
      };
    });

    const payload: RevenueOverview = {
      fetchedAt: new Date().toISOString(),
      available: true,
      metrics,
    };
    await setRcCache(payload);
    return payload;
  } catch (error) {
    return {
      fetchedAt: cached?.fetchedAt ?? null,
      available: false,
      message:
        error instanceof Error ? error.message : "Could not load RevenueCat.",
      metrics:
        (cached?.payload as RevenueOverview | undefined)?.metrics ??
        CHARTS.map((c) => ({
          id: c.id,
          label: c.label,
          value: 0,
          formatted: "—",
          spark: [],
        })),
    };
  }
}
