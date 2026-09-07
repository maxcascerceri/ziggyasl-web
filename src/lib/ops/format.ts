import type { Creator, Expense } from "./types";

export function monthlyRunRate(expenses: Expense[]): number {
  return expenses
    .filter((e) => e.active)
    .reduce((sum, e) => {
      if (e.cadence === "monthly") return sum + e.amount;
      if (e.cadence === "yearly") return sum + e.amount / 12;
      return sum;
    }, 0);
}

export function thisMonthTotal(expenses: Expense[]): number {
  return expenses
    .filter((e) => e.active)
    .reduce((sum, e) => {
      if (e.cadence === "yearly") return sum + e.amount / 12;
      return sum + e.amount;
    }, 0);
}

export function remainingCreatorCash(creators: Creator[]): number {
  return creators.reduce((sum, c) => {
    if (c.stage !== "active" && c.stage !== "negotiation") return sum;
    if (c.payment === "paid" || c.payment === "n/a") return sum;
    if (c.payment === "half") return sum + c.dealTotal / 2;
    return sum + c.dealTotal;
  }, 0);
}

export function usd(n: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: n % 1 === 0 ? 0 : 2,
  }).format(n);
}

export function addDaysIso(days: number): string {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10);
}

export function todayIso(): string {
  return addDaysIso(0);
}

export function isOverdue(date: string | null): boolean {
  if (!date) return false;
  return date < todayIso();
}

export function relativeTime(iso: string): string {
  const then = new Date(iso).getTime();
  const now = Date.now();
  const mins = Math.round((now - then) / 60000);
  if (mins < 1) return "now";
  if (mins < 60) return `${mins}m`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.round(hours / 24);
  if (days === 1) return "yesterday";
  if (days < 14) return `${days}d`;
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export const stageLabel: Record<string, string> = {
  wishlist: "Wishlist",
  outreach: "Outreach",
  negotiation: "Negotiation",
  active: "Active",
  done: "Done",
  passed: "Passed",
};

export const statusLabel: Record<string, string> = {
  not_started: "Haven’t started",
  working: "Working on",
  completed: "Completed",
};

export const paymentLabel: Record<string, string> = {
  unpaid: "Unpaid",
  half: "50%",
  paid: "Paid",
  "n/a": "n/a",
};
