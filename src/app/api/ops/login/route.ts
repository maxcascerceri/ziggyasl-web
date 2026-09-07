import { NextResponse } from "next/server";
import {
  clearSessionCookieHeader,
  createSessionToken,
  passwordsMatch,
  sessionCookieHeader,
} from "@/lib/ops/session";
import { clientIp, rateLimitLogin } from "@/lib/ops/guard";

export async function POST(req: Request) {
  const ip = clientIp(req);
  if (!rateLimitLogin(ip)) {
    return NextResponse.json({ error: "Too many tries. Wait a minute." }, { status: 429 });
  }
  const body = (await req.json().catch(() => null)) as { password?: string } | null;
  const password = body?.password ?? "";
  if (!passwordsMatch(password)) {
    return NextResponse.json({ error: "Wrong password." }, { status: 401 });
  }
  const token = await createSessionToken();
  const res = NextResponse.json({ ok: true });
  res.headers.set("Set-Cookie", sessionCookieHeader(token));
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.headers.set("Set-Cookie", clearSessionCookieHeader());
  return res;
}
