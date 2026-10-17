import { NextRequest, NextResponse } from "next/server";
import { OPS_COOKIE, isValidSessionToken } from "@/lib/ops/session";
import { cookieValue } from "@/lib/ops/guard";

const CASE_NORMALIZED_PREFIXES = ["/sign/", "/dictionary/", "/learn/", "/blog/"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Canonicalize public content URLs to lowercase so /sign/Hello never competes with /sign/hello.
  if (CASE_NORMALIZED_PREFIXES.some((p) => pathname.startsWith(p))) {
    const lower = pathname.toLowerCase();
    if (lower !== pathname) {
      const url = req.nextUrl.clone();
      url.pathname = lower;
      return NextResponse.redirect(url, 308);
    }
    return NextResponse.next();
  }

  const token = cookieValue(req.headers.get("cookie"), OPS_COOKIE);
  const ok = await isValidSessionToken(token);

  if (pathname.startsWith("/api/ops/login")) return NextResponse.next();

  if (pathname.startsWith("/api/ops/")) {
    if (!ok) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.next();
  }

  if (pathname === "/team/login") {
    if (ok) {
      return NextResponse.redirect(new URL("/team", req.url));
    }
    return NextResponse.next();
  }

  if (pathname === "/team" || pathname.startsWith("/team/")) {
    if (!ok) {
      const url = new URL("/team/login", req.url);
      url.searchParams.set("next", pathname);
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/team/:path*",
    "/team",
    "/api/ops/:path*",
    "/sign/:path*",
    "/dictionary/:path*",
    "/learn/:path*",
    "/blog/:path*",
  ],
};
