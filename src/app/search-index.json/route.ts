import { searchIndex } from "@/lib/catalog";

export const dynamic = "force-static";

/** Compact sign index for the client search palette (built once at deploy). */
export function GET() {
  return Response.json(searchIndex(), {
    headers: { "Cache-Control": "public, max-age=3600, s-maxage=86400" },
  });
}
