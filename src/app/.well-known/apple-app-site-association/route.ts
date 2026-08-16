import { NextResponse } from "next/server";
import { appleAppSiteAssociation } from "@/lib/aasa";

export const dynamic = "force-static";

export function GET() {
  return NextResponse.json(appleAppSiteAssociation, {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
