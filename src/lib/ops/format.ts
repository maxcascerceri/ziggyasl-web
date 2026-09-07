import type { Creator } from "./types";

export function remainingCreatorCash(creators: Creator[]): number {
  return creators.reduce((sum, c) => {
    if (!c.active || c.paid) return sum;
    return sum + c.dealAmount;
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

export function dateLabel(date: string | null): string {
  if (!date) return "No date";
  const today = todayIso();
  const tomorrow = addDaysIso(1);
  const yesterday = addDaysIso(-1);
  if (date === today) return "Today";
  if (date === tomorrow) return "Tomorrow";
  if (date === yesterday) return "Yesterday";
  const end = addDaysIso(6);
  if (date > today && date <= end) {
    return new Date(`${date}T12:00:00`).toLocaleDateString("en-US", {
      weekday: "short",
    });
  }
  return new Date(`${date}T12:00:00`).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
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

export function activityDay(iso: string): "Today" | "Yesterday" | "Earlier" {
  const day = iso.slice(0, 10);
  if (day === todayIso()) return "Today";
  if (day === addDaysIso(-1)) return "Yesterday";
  return "Earlier";
}

export function linkLabel(link: string): string {
  const raw = link.trim();
  if (!raw) return "";
  try {
    const url = new URL(raw.includes("://") ? raw : `https://${raw}`);
    const host = url.hostname.replace(/^www\./, "");
    const path = url.pathname.replace(/\/$/, "");
    return path && path !== "/" ? `${host}${path}` : host;
  } catch {
    return raw.replace(/^https?:\/\//, "");
  }
}

export function hrefFor(link: string): string {
  const raw = link.trim();
  if (!raw) return "";
  if (/^https?:\/\//i.test(raw)) return raw;
  return `https://${raw}`;
}

export const statusLabel: Record<string, string> = {
  not_started: "Todo",
  working: "Doing",
  completed: "Done",
};

export const statusPill: Record<string, string> = {
  not_started: "bg-canvas text-secondary",
  working: "bg-pastel-blue text-[#3d6a94]",
  completed: "bg-pastel-mint text-[#2d7a62]",
};

export const NEXT_STATUS = {
  not_started: "working",
  working: "completed",
  completed: "not_started",
} as const;
