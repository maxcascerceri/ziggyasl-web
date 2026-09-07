import { NextResponse } from "next/server";
import {
  clearSessionCookieHeader,
  createSessionToken,
  passwordsMatch,
  sessionCookieHeader,
} from "@/lib/ops/session";
import { clientIp, rateLimitLogin } from "@/lib/ops/guard";

function safeNext(value: string | null): string {
  if (!value) return "/team";
  if (!value.startsWith("/team")) return "/team";
  if (value.startsWith("//") || value.includes("://")) return "/team";
  return value;
}

async function readPassword(req: Request): Promise<{
  password: string;
  next: string;
  form: boolean;
}> {
  const type = req.headers.get("content-type") ?? "";
  if (type.includes("application/json")) {
    const body = (await req.json().catch(() => null)) as {
      password?: string;
      next?: string;
    } | null;
    return {
      password: body?.password ?? "",
      next: safeNext(body?.next ?? null),
      form: false,
    };
  }
  const form = await req.formData().catch(() => null);
  return {
    password: String(form?.get("password") ?? ""),
    next: safeNext(String(form?.get("next") ?? "")),
    form: true,
  };
}

export async function POST(req: Request) {
  const ip = clientIp(req);
  if (!rateLimitLogin(ip)) {
    if ((req.headers.get("content-type") ?? "").includes("application/json")) {
      return NextResponse.json(
        { error: "Too many tries. Wait a minute." },
        { status: 429 },
      );
    }
    const url = new URL("/team/login", req.url);
    url.searchParams.set("error", "rate");
    return NextResponse.redirect(url, 303);
  }

  const { password, next, form } = await readPassword(req);
  if (!passwordsMatch(password)) {
    if (!form) {
      return NextResponse.json({ error: "Wrong password." }, { status: 401 });
    }
    const url = new URL("/team/login", req.url);
    url.searchParams.set("error", "1");
    if (next !== "/team") url.searchParams.set("next", next);
    return NextResponse.redirect(url, 303);
  }

  const token = await createSessionToken();
  if (form) {
    const res = NextResponse.redirect(new URL(next, req.url), 303);
    res.headers.set("Set-Cookie", sessionCookieHeader(token));
    return res;
  }
  const res = NextResponse.json({ ok: true });
  res.headers.set("Set-Cookie", sessionCookieHeader(token));
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.headers.set("Set-Cookie", clearSessionCookieHeader());
  return res;
}
