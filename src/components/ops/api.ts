import type { Actor } from "@/lib/ops/types";

export function actorHeader(actor: Actor): HeadersInit {
  return { "Content-Type": "application/json", "x-ops-actor": actor };
}

export async function opsFetch<T>(
  path: string,
  actor: Actor,
  init?: RequestInit,
): Promise<T> {
  const res = await fetch(path, {
    ...init,
    headers: { ...actorHeader(actor), ...(init?.headers ?? {}) },
  });
  const data = (await res.json().catch(() => ({}))) as T & { error?: string };
  if (!res.ok) {
    throw new Error(data.error || `Request failed (${res.status})`);
  }
  return data;
}
