import { NextResponse } from "next/server";
import { OPS_COOKIE, isValidSessionToken } from "@/lib/ops/session";

const loginHits = new Map<string, number[]>();

export function clientIp(req: Request): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "local"
  );
}

export function rateLimitLogin(ip: string): boolean {
  const now = Date.now();
  const windowMs = 60_000;
  const prev = (loginHits.get(ip) ?? []).filter((t) => now - t < windowMs);
  if (prev.length >= 5) {
    loginHits.set(ip, prev);
    return false;
  }
  prev.push(now);
  loginHits.set(ip, prev);
  return true;
}

export async function requireOpsSession(req: Request): Promise<NextResponse | null> {
  const token = cookieValue(req.headers.get("cookie"), OPS_COOKIE);
  if (await isValidSessionToken(token)) return null;
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

export function cookieValue(
  header: string | null,
  name: string,
): string | undefined {
  if (!header) return undefined;
  const parts = header.split(";").map((p) => p.trim());
  for (const part of parts) {
    if (part.startsWith(`${name}=`)) return part.slice(name.length + 1);
  }
  return undefined;
}
